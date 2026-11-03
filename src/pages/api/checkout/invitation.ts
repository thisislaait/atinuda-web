// pages/api/checkout/invitation.ts
// Sends a buyer their invitation as a PDF, using their order's private token.
import type { NextApiRequest, NextApiResponse } from 'next';
import { orderForToken } from '@/lib/atinuda7Fulfil';
import { buildInvitationPdf } from '@/lib/invitationPdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  try {
    const order = await orderForToken(req.query.order, req.query.t);
    if (!order) return res.status(404).json({ ok: false, message: 'This order link is not valid.' });
    if (order.status !== 'paid' || !order.tickets?.length) {
      return res.status(409).json({ ok: false, message: 'Your invitation is ready once your payment is confirmed.' });
    }
    const pdf = await buildInvitationPdf(order.tickets, order.productId === 'test');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Atinuda-7-invitation-${order.txRef}.pdf"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(Buffer.from(pdf));
  } catch (err) {
    console.error('checkout/invitation: failed', err);
    return res.status(500).json({ ok: false, message: 'Your invitation did not download. Please try again.' });
  }
}
