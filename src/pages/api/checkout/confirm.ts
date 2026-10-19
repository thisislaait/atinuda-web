// pages/api/checkout/confirm.ts
// Verifies an Atinuda 7.0 payment with Flutterwave against the stored pending order,
// then issues one ticket per seat (plus Support Passes). Safe to call more than once:
// a paid order returns its existing tickets.
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import {
  EVENT_LABEL,
  EVENT_WHEN,
  EVENT_WHERE,
  SUPPORT_PASS,
  findProduct,
  formatNaira,
} from '@/lib/atinuda7Checkout';

const FLW_SECRET = process.env.FLW_SECRET_KEY;

type OrderDoc = {
  txRef: string;
  eventSlug: string;
  status: 'pending' | 'paid' | 'review';
  productId: string;
  productName: string;
  quantity: number;
  supportPasses: number;
  total: number;
  currency: 'NGN';
  buyer: { name: string; email: string; phone: string; company: string };
  attendees: { name: string; email: string }[];
  tickets?: IssuedTicket[];
};

type IssuedTicket = { ticketNumber: string; ticketType: string; name: string; email: string };

type FlwVerify = {
  status?: string;
  data?: { id: number; status: string; amount: number; currency: string; tx_ref: string };
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const ticketNumber = (prefix: string) => `ATN7-${prefix}-${randomBytes(3).toString('hex').toUpperCase()}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  if (!FLW_SECRET) return res.status(500).json({ ok: false, message: 'Payments are not configured.' });

  const { txRef, transactionId } = (req.body ?? {}) as { txRef?: unknown; transactionId?: unknown };
  if (typeof txRef !== 'string' || !txRef || (typeof transactionId !== 'string' && typeof transactionId !== 'number')) {
    return res.status(400).json({ ok: false, message: 'txRef and transactionId are required.' });
  }

  const orderRef = adminDb.collection('orders').doc(txRef);
  const existing = await orderRef.get();
  if (!existing.exists) return res.status(404).json({ ok: false, message: 'Order not found.' });
  const order = existing.data() as OrderDoc;
  if (order.status === 'paid') return res.status(200).json({ ok: true, tickets: order.tickets ?? [] });

  // Verify with Flutterwave. Never trust the browser callback.
  let flw: FlwVerify['data'];
  try {
    const resp = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transactionId))}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET}` } },
    );
    const json = (await resp.json()) as FlwVerify;
    if (!resp.ok || json.status !== 'success' || json.data?.status !== 'successful') {
      return res.status(402).json({ ok: false, message: 'Payment was not completed.' });
    }
    flw = json.data;
  } catch (err) {
    console.error('checkout/confirm: Flutterwave verify failed', err);
    return res.status(502).json({ ok: false, message: 'We could not reach the payment provider. Please contact us with your reference.' });
  }

  const amountOk = Number(flw.amount) >= order.total;
  const matches = flw.tx_ref === txRef && flw.currency?.toUpperCase() === order.currency;
  if (!matches || !amountOk) {
    await orderRef.set(
      { status: 'review', reviewReason: !matches ? 'reference/currency mismatch' : 'underpaid', flwTransactionId: String(flw.id), flwAmount: flw.amount },
      { merge: true },
    );
    return res.status(400).json({ ok: false, message: 'Your payment needs a manual check. Our team will be in touch.' });
  }

  const product = findProduct(order.productId);
  const productName = product?.name ?? order.productName;
  const prefix = product?.ticketPrefix ?? 'GEN';

  const tickets: IssuedTicket[] = [
    ...order.attendees.map((a, i) => ({
      ticketNumber: ticketNumber(prefix),
      ticketType: productName,
      // Seat 1 falls back to the buyer; other seats stay unassigned until details arrive.
      name: a.name || (i === 0 ? order.buyer.name : ''),
      email: a.email || (i === 0 ? order.buyer.email : ''),
    })),
    ...Array.from({ length: order.supportPasses }, () => ({
      ticketNumber: ticketNumber(SUPPORT_PASS.ticketPrefix),
      ticketType: SUPPORT_PASS.name,
      name: '',
      email: '',
    })),
  ];

  // Mark paid and issue tickets atomically; bail out if another request got there first.
  const result = await adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(orderRef)).data() as OrderDoc;
    if (fresh.status === 'paid') return { tickets: fresh.tickets ?? [], issued: false };

    for (const t of tickets) {
      tx.set(adminDb.collection('tickets').doc(t.ticketNumber), {
        ticketNumber: t.ticketNumber,
        ticketType: t.ticketType,
        eventSlug: order.eventSlug,
        fullName: t.name || null,
        email: t.email || null,
        emailLower: t.email ? t.email.toLowerCase() : null,
        purchaserEmail: order.buyer.email,
        purchaserName: order.buyer.name,
        txRef,
        status: 'active',
        ticketIssued: true,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    tx.set(
      orderRef,
      {
        status: 'paid',
        tickets,
        flwTransactionId: String(flw.id),
        amountPaid: flw.amount,
        paidAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { tickets, issued: true };
  });

  if (result.issued) {
    sendConfirmation(order, result.tickets).catch((err) => console.warn('checkout/confirm: email failed', err));
  }

  return res.status(200).json({ ok: true, tickets: result.tickets });
}

async function sendConfirmation(order: OrderDoc, tickets: IssuedTicket[]) {
  const user = process.env.EMAIL_USER || process.env.HOSTINGER_EMAIL;
  const pass = process.env.EMAIL_PASS || process.env.HOSTINGER_EMAIL_PASS;
  const sender = process.env.SENDER_EMAIL || user;
  if (!user || !pass || !sender) {
    console.warn('checkout/confirm: email credentials missing, skipping confirmation');
    return;
  }
  const port = Number(process.env.EMAIL_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const rows = tickets
    .map((t) => `<tr><td style="padding:6px 16px 6px 0;font-family:monospace">${t.ticketNumber}</td><td style="padding:6px 16px 6px 0">${t.ticketType}</td><td style="padding:6px 0">${t.name ? esc(t.name) : 'To be assigned'}</td></tr>`)
    .join('');

  await transporter.sendMail({
    from: `"Atinuda" <${sender}>`,
    to: order.buyer.email,
    subject: `Your ${EVENT_LABEL} passes are confirmed`,
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
        <p>Hello ${esc(order.buyer.name)},</p>
        <p>Your payment of ${formatNaira(order.total)} is confirmed. ${EVENT_LABEL} takes place on ${EVENT_WHEN} in ${EVENT_WHERE}.</p>
        <table style="border-collapse:collapse;font-size:14px;margin:16px 0">${rows}</table>
        <p>Order reference: <strong>${order.txRef}</strong></p>
        <p>To assign unnamed passes, reply to this email with each attendee's name and email.</p>
        <p>Atinuda</p>
      </div>`,
  });
}
