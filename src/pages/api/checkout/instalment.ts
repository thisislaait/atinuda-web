// pages/api/checkout/instalment.ts
// Backs the private pay link emailed to pay-in-3 buyers. GET shows where the order stands;
// POST starts the next payment. The amount always comes from the stored order.
import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { adminDb } from '@/utils/firebaseAdmin';
import { instalmentAttemptRef, nextInstalment, publicSchedule, type OrderDoc } from '@/lib/atinuda7Fulfil';

const ORDER_RE = /^ATN7-[A-Z0-9]+-[A-F0-9]{6}$/;

async function loadOrder(orderId: unknown, token: unknown): Promise<OrderDoc | null> {
  if (typeof orderId !== 'string' || !ORDER_RE.test(orderId) || typeof token !== 'string' || !token) return null;
  const snap = await adminDb.collection('orders').doc(orderId).get();
  const order = snap.data() as OrderDoc | undefined;
  if (!order?.payToken || order.plan !== 'instalments') return null;
  const a = Buffer.from(token);
  const b = Buffer.from(order.payToken);
  return a.length === b.length && timingSafeEqual(a, b) ? order : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const params = req.method === 'GET' ? req.query : ((req.body ?? {}) as Record<string, unknown>);
  let order: OrderDoc | null;
  try {
    order = await loadOrder(params.order, params.t);
  } catch (err) {
    console.error('checkout/instalment: failed to load order', err);
    return res.status(500).json({ ok: false, message: 'We could not load your order. Please try again.' });
  }
  if (!order) return res.status(404).json({ ok: false, message: 'This payment link is not valid.' });

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      orderRef: order.txRef,
      productName: order.productName,
      total: order.total,
      status: order.status,
      instalments: publicSchedule(order),
    });
  }

  if (order.status !== 'part_paid') {
    return res.status(409).json({ ok: false, message: 'This order has no payment due.' });
  }
  const next = nextInstalment(order);
  if (!next) return res.status(409).json({ ok: false, message: 'This order has no payment due.' });

  return res.status(200).json({
    ok: true,
    txRef: instalmentAttemptRef(order.txRef, next.n),
    amount: next.amount,
    currency: order.currency,
    customer: { email: order.buyer.email, name: order.buyer.name, phone_number: order.buyer.phone },
  });
}
