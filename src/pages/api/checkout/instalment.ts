// pages/api/checkout/instalment.ts
// Backs the private pay link. GET shows where the order stands. POST starts the next Flutterwave
// payment, or with `action: 'declare'` records that the buyer has sent a bank transfer.
// Amounts always come from the stored order.
import type { NextApiRequest, NextApiResponse } from 'next';
import { FLUTTERWAVE_OPEN } from '@/lib/atinuda7Checkout';
import { instalmentAttemptRef, nextInstalment, orderForToken, publicSchedule, type OrderDoc } from '@/lib/atinuda7Fulfil';
import { declareTransfer, transferDue } from '@/lib/atinuda7Transfers';

// Every order has a private page, including Flutterwave orders paid in one go, which show the invitation.
const loadOrder = (orderId: unknown, token: unknown): Promise<OrderDoc | null> => orderForToken(orderId, token);

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
      method: order.method ?? 'flutterwave',
      buyerEmail: order.buyer.email,
      tickets: order.status === 'paid' ? order.tickets ?? [] : [],
      testOnly: order.productId === 'test',
      holdUntil: order.holdUntil ?? null,
      transfer: order.transfer ? { currency: order.transfer.currency, amounts: order.transfer.amounts, due: transferDue(order) } : null,
    });
  }

  if (params.action === 'declare') {
    if (order.method !== 'transfer') return res.status(409).json({ ok: false, message: 'This order is not paid by bank transfer.' });
    try {
      const result = await declareTransfer(order);
      if (!result.ok) return res.status(409).json({ ok: false, message: result.message });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('checkout/instalment: declare failed', order.txRef, err);
      return res.status(500).json({ ok: false, message: 'We could not record that. Please try again.' });
    }
  }

  if (order.method === 'transfer' || !FLUTTERWAVE_OPEN) {
    return res.status(409).json({ ok: false, message: 'This order is paid by bank transfer.' });
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
