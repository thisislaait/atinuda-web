// pages/api/staff/confirm-transfer.ts
// Staff only. Records that a bank transfer has arrived, which issues any tickets now due.
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireStaff } from '@/lib/staffGuards';
import { confirmTransfer } from '@/lib/atinuda7Transfers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const staff = await requireStaff(req, res);
  if (!staff) return;

  const { orderRef, n } = (req.body ?? {}) as { orderRef?: unknown; n?: unknown };
  if (typeof orderRef !== 'string' || !orderRef || (n !== null && !Number.isInteger(n))) {
    return res.status(400).json({ ok: false, message: 'orderRef and n are required.' });
  }

  try {
    const result = await confirmTransfer(orderRef, n as number | null, { uid: staff.uid, email: staff.email });
    if (!result.ok) return res.status(result.status).json({ ok: false, message: result.message });
    return res.status(200).json({ ok: true, already: result.already });
  } catch (err) {
    console.error('staff/confirm-transfer: failed', orderRef, err);
    return res.status(500).json({ ok: false, message: 'We could not confirm this payment. Nothing was issued.' });
  }
}
