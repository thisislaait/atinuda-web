// pages/api/staff/resend-tickets.ts
// Staff only. Sends a paid order's ticket email again, for example after a failed send.
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';
import { deliverTickets, type OrderDoc } from '@/lib/atinuda7Fulfil';
import { requireStaff } from '@/lib/staffGuards';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const staff = await requireStaff(req, res);
  if (!staff) return;

  const { orderRef } = (req.body ?? {}) as { orderRef?: unknown };
  if (typeof orderRef !== 'string' || !orderRef) return res.status(400).json({ ok: false, message: 'orderRef is required.' });

  try {
    const order = (await adminDb.collection('orders').doc(orderRef).get()).data() as OrderDoc | undefined;
    if (!order || order.status !== 'paid' || !order.tickets?.length) {
      return res.status(409).json({ ok: false, message: 'This order has no tickets to send.' });
    }
    const sent = await deliverTickets(order, order.tickets);
    await adminDb.collection('auditLog').doc().set({
      action: 'ticket_email_resent',
      orderRef,
      sent,
      by: staff.email ?? staff.uid,
      uid: staff.uid,
      at: new Date().toISOString(),
    });
    if (!sent) return res.status(502).json({ ok: false, message: 'The email did not send. The error is saved on the order. Try again shortly.' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('staff/resend-tickets: failed', orderRef, err);
    return res.status(500).json({ ok: false, message: 'The email did not send. Try again shortly.' });
  }
}
