// pages/api/checkout/order.ts
// Creates a pending Atinuda 7.0 order and returns the amount to charge.
// The amount is always computed here from the catalogue — the client never sends a price.
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { EVENT_SLUG, MAX_QUANTITY, instalmentSchedule, instalmentsAvailable, quote } from '@/lib/atinuda7Checkout';
import { instalmentAttemptRef } from '@/lib/atinuda7Fulfil';

type Person = { name?: unknown; email?: unknown };

type OrderBody = {
  productId?: unknown;
  quantity?: unknown;
  supportPasses?: unknown;
  plan?: unknown;
  buyer?: { name?: unknown; email?: unknown; phone?: unknown; company?: unknown };
  attendees?: Person[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  const body = (req.body ?? {}) as OrderBody;
  const productId = clean(body.productId, 20);
  const quantity = Number(body.quantity);
  const supportPasses = Number(body.supportPasses ?? 0);

  const q = quote({ productId, quantity, supportPasses });
  if (!q) {
    return res.status(400).json({
      ok: false,
      message: `Choose a pass and between 1 and ${MAX_QUANTITY} tickets.`,
    });
  }

  const payInThree = body.plan === 'instalments';
  if (payInThree && !instalmentsAvailable(q.quantity)) {
    return res.status(400).json({ ok: false, message: 'Paying in three instalments is available on single-pass orders only.' });
  }

  const buyer = {
    name: clean(body.buyer?.name),
    email: clean(body.buyer?.email).toLowerCase(),
    phone: clean(body.buyer?.phone, 30),
    company: clean(body.buyer?.company),
  };
  if (!buyer.name || !EMAIL_RE.test(buyer.email) || buyer.phone.length < 7) {
    return res.status(400).json({ ok: false, message: 'Your name, a valid email and a phone number are required.' });
  }

  // Attendee details are optional per seat; keep only what was supplied, one entry per seat.
  const rawAttendees = Array.isArray(body.attendees) ? body.attendees.slice(0, q.quantity) : [];
  const attendees = Array.from({ length: q.quantity }, (_, i) => {
    const a = rawAttendees[i] ?? {};
    const email = clean(a.email).toLowerCase();
    return { name: clean(a.name), email: EMAIL_RE.test(email) ? email : '' };
  });

  const txRef = `ATN7-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const instalments = payInThree
    ? instalmentSchedule(q.total).map((i) => ({ ...i, status: 'due' as const }))
    : null;

  try {
    await adminDb.collection('orders').doc(txRef).set({
      txRef,
      eventSlug: EVENT_SLUG,
      status: 'pending',
      productId: q.product.id,
      productName: q.product.name,
      quantity: q.quantity,
      unitPrice: q.unit,
      earlyBird: q.earlyBird,
      subtotal: q.subtotal,
      groupPercent: q.groupPercent,
      groupDiscount: q.groupDiscount,
      supportPasses: q.supportPasses,
      supportTotal: q.supportTotal,
      total: q.total,
      currency: 'NGN',
      buyer,
      attendees,
      plan: payInThree ? 'instalments' : 'full',
      ...(instalments ? { instalments, payToken: randomBytes(16).toString('hex') } : {}),
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('checkout/order: failed to create order', err);
    return res.status(500).json({ ok: false, message: 'We could not start your order. Please try again.' });
  }

  // Each instalment is its own Flutterwave payment, with its own reference.
  if (instalments) {
    return res.status(200).json({ ok: true, orderRef: txRef, txRef: instalmentAttemptRef(txRef, 1), amount: instalments[0].amount, currency: 'NGN' });
  }
  return res.status(200).json({ ok: true, orderRef: txRef, txRef, amount: q.total, currency: 'NGN' });
}
