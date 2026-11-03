// pages/api/staff/receipt.ts
// Staff only. Sends a buyer's attached receipt to the payments page.
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';
import type { OrderDoc } from '@/lib/atinuda7Fulfil';
import { requireStaff } from '@/lib/staffGuards';
import { readReceipt } from '@/lib/transferReceipts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const staff = await requireStaff(req, res);
  if (!staff) return;

  const { orderRef, key } = req.query;
  if (typeof orderRef !== 'string' || !orderRef || typeof key !== 'string' || !key) {
    return res.status(400).json({ ok: false, message: 'orderRef and key are required.' });
  }

  try {
    const order = (await adminDb.collection('orders').doc(orderRef).get()).data() as OrderDoc | undefined;
    const receipt = order?.receipts?.[key];
    if (!receipt) return res.status(404).json({ ok: false, message: 'No receipt is attached to this payment.' });
    const bytes = await readReceipt(receipt.path);
    res.setHeader('Content-Type', receipt.contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(bytes);
  } catch (err) {
    console.error('staff/receipt: failed', orderRef, err);
    return res.status(500).json({ ok: false, message: 'That receipt did not load. Try again.' });
  }
}
