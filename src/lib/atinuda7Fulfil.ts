// Server-only. Verifies an Atinuda 7.0 payment with Flutterwave against the stored order, then
// issues one ticket per seat (plus Support Passes) and emails the buyer. Pay-in-3 orders issue
// tickets only when the final instalment clears.
// Used by both the browser confirmation (/api/checkout/confirm) and the Flutterwave webhook
// (/api/checkout/webhook). Idempotent: whichever arrives second gets the existing result.
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import {
  EVENT_LABEL,
  EVENT_WHEN,
  EVENT_WHERE,
  SUPPORT_PASS,
  findProduct,
  formatDueDate,
  formatNaira,
  type Instalment,
} from '@/lib/atinuda7Checkout';

export type OrderInstalment = Instalment & {
  status: 'due' | 'paid';
  paidAt?: string;
  txRef?: string;
  flwTransactionId?: string;
  flwAmount?: number;
};

type ReviewPayment = { reason: string; txRef: string; flwTransactionId: string; amount: number; at: string };

export type OrderDoc = {
  txRef: string;
  eventSlug: string;
  status: 'pending' | 'part_paid' | 'paid' | 'review' | 'cancelled';
  productId: string;
  productName: string;
  quantity: number;
  supportPasses: number;
  total: number;
  currency: 'NGN';
  buyer: { name: string; email: string; phone: string; company: string };
  attendees: { name: string; email: string }[];
  tickets?: IssuedTicket[];
  plan?: 'full' | 'instalments';
  instalments?: OrderInstalment[];
  payToken?: string;
  amountPaid?: number;
  reviewPayments?: ReviewPayment[];
  remindersSent?: Record<string, string>;
};

export type IssuedTicket = { ticketNumber: string; ticketType: string; name: string; email: string };

export type PublicInstalment = Pick<OrderInstalment, 'n' | 'amount' | 'dueAt' | 'status'>;

// `retry` marks failures worth trying again later (provider unreachable), as opposed to
// final outcomes such as an unknown order or an underpayment.
export type FulfilResult =
  | { ok: true; tickets: IssuedTicket[]; instalments?: PublicInstalment[] }
  | { ok: false; status: number; message: string; retry: boolean };

type FlwVerify = {
  status?: string;
  data?: { id: number; status: string; amount: number; currency: string; tx_ref: string };
};
type FlwTransaction = NonNullable<FlwVerify['data']>;

export const TEAM_EMAIL = process.env.INSTALMENT_TEAM_EMAIL || 'hello@atinuda.africa';
const SITE_URL = process.env.SITE_URL || 'https://www.atinuda.africa';

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// 64 random bits: a ticket number opens its ticket page, so it must not be guessable.
const ticketNumber = (prefix: string) => `ATN7-${prefix}-${randomBytes(8).toString('hex').toUpperCase()}`;

// Flutterwave needs a fresh reference per attempt: <order>-P<instalment>-<random>.
const ATTEMPT_RE = /^(ATN7-[A-Z0-9]+-[A-F0-9]{6})-P([1-9])-[A-F0-9]+$/;

export const instalmentAttemptRef = (orderId: string, n: number) =>
  `${orderId}-P${n}-${randomBytes(3).toString('hex').toUpperCase()}`;

export const payLink = (order: Pick<OrderDoc, 'txRef' | 'payToken'>) =>
  `${SITE_URL}/pricing/pay?order=${encodeURIComponent(order.txRef)}&t=${order.payToken}`;

export const publicSchedule = (order: Pick<OrderDoc, 'instalments'>): PublicInstalment[] =>
  (order.instalments ?? []).map(({ n, amount, dueAt, status }) => ({ n, amount, dueAt, status }));

export const nextInstalment = (order: Pick<OrderDoc, 'instalments'>) =>
  order.instalments?.find((i) => i.status !== 'paid') ?? null;

async function verifyWithFlutterwave(
  transactionId: string | number,
): Promise<{ ok: true; flw: FlwTransaction } | Extract<FulfilResult, { ok: false }>> {
  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) return { ok: false, status: 500, message: 'Payments are not configured.', retry: true };
  // Never trust the browser callback or the webhook body alone.
  try {
    const resp = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transactionId))}/verify`,
      { headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(10_000) },
    );
    const json = (await resp.json()) as FlwVerify;
    if (!resp.ok || json.status !== 'success' || json.data?.status !== 'successful') {
      return { ok: false, status: 402, message: 'Payment was not completed.', retry: false };
    }
    return { ok: true, flw: json.data };
  } catch (err) {
    console.error('fulfilOrder: Flutterwave verify failed', err);
    return { ok: false, status: 502, message: 'We could not reach the payment provider. Please contact us with your reference.', retry: true };
  }
}

function buildTickets(order: OrderDoc): IssuedTicket[] {
  const product = findProduct(order.productId);
  const productName = product?.name ?? order.productName;
  const prefix = product?.ticketPrefix ?? 'GEN';
  return [
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
}

function writeTickets(tx: FirebaseFirestore.Transaction, order: OrderDoc, tickets: IssuedTicket[]) {
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
      txRef: order.txRef,
      status: 'active',
      ticketIssued: true,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
}

export async function fulfilOrder(txRef: string, transactionId: string | number): Promise<FulfilResult> {
  const attempt = ATTEMPT_RE.exec(txRef);
  if (attempt) return fulfilInstalment(txRef, attempt[1], Number(attempt[2]), transactionId);

  const orderRef = adminDb.collection('orders').doc(txRef);
  const existing = await orderRef.get();
  if (!existing.exists) return { ok: false, status: 404, message: 'Order not found.', retry: false };
  const order = existing.data() as OrderDoc;
  if (order.status === 'paid') return { ok: true, tickets: order.tickets ?? [] };

  const verified = await verifyWithFlutterwave(transactionId);
  if (!verified.ok) return verified;
  const { flw } = verified;

  const amountOk = Number(flw.amount) >= order.total;
  const matches = flw.tx_ref === txRef && flw.currency?.toUpperCase() === order.currency;
  if (!matches || !amountOk) {
    await orderRef.set(
      { status: 'review', reviewReason: !matches ? 'reference/currency mismatch' : 'underpaid', flwTransactionId: String(flw.id), flwAmount: flw.amount },
      { merge: true },
    );
    return { ok: false, status: 400, message: 'Your payment needs a manual check. Our team will be in touch.', retry: false };
  }

  const tickets = buildTickets(order);

  // Mark paid and issue tickets atomically; bail out if another request got there first.
  const result = await adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(orderRef)).data() as OrderDoc;
    if (fresh.status === 'paid') return { tickets: fresh.tickets ?? [], issued: false };

    writeTickets(tx, order, tickets);
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
    // Awaited so serverless functions don't freeze before the email is handed off.
    await sendConfirmation(order, result.tickets).catch((err) => console.warn('fulfilOrder: email failed', err));
  }

  return { ok: true, tickets: result.tickets };
}

async function fulfilInstalment(
  attemptRef: string,
  orderId: string,
  n: number,
  transactionId: string | number,
): Promise<FulfilResult> {
  const orderRef = adminDb.collection('orders').doc(orderId);
  const existing = await orderRef.get();
  const order = existing.data() as OrderDoc | undefined;
  const target = order?.instalments?.find((i) => i.n === n);
  if (!order || !target) return { ok: false, status: 404, message: 'Order not found.', retry: false };

  const replay = (o: OrderDoc): FulfilResult => ({ ok: true, tickets: o.tickets ?? [], instalments: publicSchedule(o) });
  if (target.status === 'paid' && target.flwTransactionId === String(transactionId)) return replay(order);

  const verified = await verifyWithFlutterwave(transactionId);
  if (!verified.ok) return verified;
  const { flw } = verified;
  const flwId = String(flw.id);
  const manualCheck = { ok: false as const, status: 400, message: 'Your payment needs a manual check. Our team will be in touch.', retry: false };

  const matches = flw.tx_ref === attemptRef && flw.currency?.toUpperCase() === order.currency;
  if (!matches || Number(flw.amount) < target.amount) {
    await recordReview(order, { reason: !matches ? 'reference/currency mismatch' : 'underpaid', txRef: attemptRef, flwTransactionId: flwId, amount: flw.amount, at: new Date().toISOString() });
    return manualCheck;
  }

  const tickets = buildTickets(order);

  const outcome = await adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(orderRef)).data() as OrderDoc;
    const current = fresh.instalments ?? [];
    const now = current.find((i) => i.n === n);
    if (now?.status === 'paid') {
      return { kind: now.flwTransactionId === flwId ? ('replay' as const) : ('duplicate' as const), order: fresh };
    }
    if (fresh.status === 'cancelled') return { kind: 'cancelled' as const, order: fresh };

    const instalments = current.map((i) =>
      i.n === n ? { ...i, status: 'paid' as const, paidAt: new Date().toISOString(), txRef: attemptRef, flwTransactionId: flwId, flwAmount: flw.amount } : i,
    );
    const complete = instalments.every((i) => i.status === 'paid');
    if (complete) writeTickets(tx, fresh, tickets);
    const update = {
      instalments,
      status: complete ? ('paid' as const) : ('part_paid' as const),
      amountPaid: instalments.reduce((sum, i) => sum + (i.flwAmount ?? 0), 0),
      ...(complete ? { tickets, paidAt: FieldValue.serverTimestamp() } : {}),
    };
    tx.set(orderRef, update, { merge: true });
    const next: OrderDoc = { ...fresh, instalments, status: update.status, ...(complete ? { tickets } : {}) };
    return { kind: complete ? ('complete' as const) : ('progress' as const), order: next };
  });

  const entry = { txRef: attemptRef, flwTransactionId: flwId, amount: flw.amount, at: new Date().toISOString() };
  switch (outcome.kind) {
    case 'replay':
      return replay(outcome.order);
    case 'duplicate':
      // The buyer owes nothing more for this instalment, so they still see success.
      await recordReview(outcome.order, { ...entry, reason: 'instalment paid twice' });
      return replay(outcome.order);
    case 'cancelled':
      await recordReview(outcome.order, { ...entry, reason: 'paid after cancellation' });
      return manualCheck;
    case 'complete':
      await sendConfirmation(outcome.order, tickets).catch((err) => console.warn('fulfilInstalment: email failed', err));
      return replay(outcome.order);
    case 'progress':
      await sendInstalmentReceipt(outcome.order, target).catch((err) => console.warn('fulfilInstalment: email failed', err));
      return replay(outcome.order);
  }
}

// Money that needs a person: keep it on the order and tell the team once per transaction.
async function recordReview(order: OrderDoc, entry: ReviewPayment) {
  const orderRef = adminDb.collection('orders').doc(order.txRef);
  const added = await adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(orderRef)).data() as OrderDoc;
    const list = fresh.reviewPayments ?? [];
    if (list.some((r) => r.flwTransactionId === entry.flwTransactionId)) return false;
    tx.set(orderRef, { reviewPayments: [...list, entry] }, { merge: true });
    return true;
  });
  if (!added) return;
  await sendMail(
    TEAM_EMAIL,
    `Instalment payment to check: ${order.txRef}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C">
      <p>A payment on order <strong>${esc(order.txRef)}</strong> needs a manual check: ${esc(entry.reason)}.</p>
      <p>${esc(order.buyer.name)} (${esc(order.buyer.email)}), ${formatNaira(entry.amount)}, Flutterwave transaction ${esc(entry.flwTransactionId)}.</p>
    </div>`,
  ).catch((err) => console.warn('recordReview: email failed', err));
}

// Returns false when email is not configured, so callers don't record a send that never happened.
export async function sendMail(to: string, subject: string, html: string) {
  const user = process.env.EMAIL_USER || process.env.HOSTINGER_EMAIL;
  const pass = process.env.EMAIL_PASS || process.env.HOSTINGER_EMAIL_PASS;
  const sender = process.env.SENDER_EMAIL || user;
  if (!user || !pass || !sender) {
    console.warn('atinuda7Fulfil: email credentials missing, skipping', subject);
    return false;
  }
  const port = Number(process.env.EMAIL_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  await transporter.sendMail({ from: `"Atinuda" <${sender}>`, to, subject, html });
  return true;
}

export const scheduleTable = (order: Pick<OrderDoc, 'instalments'>) =>
  `<table style="border-collapse:collapse;font-size:14px;margin:16px 0">${(order.instalments ?? [])
    .map((i) => `<tr><td style="padding:6px 16px 6px 0">${formatNaira(i.amount)}</td><td style="padding:6px 16px 6px 0">${i.status === 'paid' ? 'Paid' : `Due ${formatDueDate(i.dueAt)}`}</td></tr>`)
    .join('')}</table>`;

async function sendInstalmentReceipt(order: OrderDoc, paid: Instalment) {
  const next = nextInstalment(order);
  await sendMail(
    order.buyer.email,
    paid.n === 1 ? `Your ${EVENT_LABEL} place is held` : `Instalment received for ${EVENT_LABEL}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
      <p>Hello ${esc(order.buyer.name)},</p>
      <p>We have received ${formatNaira(paid.amount)} towards your ${esc(order.productName)} pass for ${EVENT_LABEL}, ${EVENT_WHEN} in ${EVENT_WHERE}. Your place and price are held, and your pass is issued when the final payment clears.</p>
      ${scheduleTable(order)}
      ${next ? `<p><a href="${payLink(order)}" style="color:#1B1E1C">Pay your next instalment</a>. This link is private to you. We will remind you before each due date.</p>` : ''}
      <p>Order reference: <strong>${order.txRef}</strong></p>
      <p>Atinuda</p>
    </div>`,
  );
}

async function sendConfirmation(order: OrderDoc, tickets: IssuedTicket[]) {
  const rows = tickets
    .map((t) => `<tr><td style="padding:6px 16px 6px 0;font-family:monospace">${t.ticketNumber}</td><td style="padding:6px 16px 6px 0">${t.ticketType}</td><td style="padding:6px 0">${t.name ? esc(t.name) : 'To be assigned'}</td></tr>`)
    .join('');

  await sendMail(
    order.buyer.email,
    `Your ${EVENT_LABEL} passes are confirmed`,
    `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
        <p>Hello ${esc(order.buyer.name)},</p>
        <p>Your payment of ${formatNaira(order.total)} is confirmed. ${EVENT_LABEL} takes place on ${EVENT_WHEN} in ${EVENT_WHERE}.</p>
        <table style="border-collapse:collapse;font-size:14px;margin:16px 0">${rows}</table>
        <p>Order reference: <strong>${order.txRef}</strong></p>
        <p>To assign unnamed passes, reply to this email with each attendee's name and email.</p>
        <p>Atinuda</p>
      </div>`,
  );
}
