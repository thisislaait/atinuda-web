// pages/api/staff/compare.ts
// Staff only. Compares recent Flutterwave transactions with the orders on record.
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireStaff } from '@/lib/staffGuards';
import { compareWithFlutterwave, loadStaffOrders } from '@/lib/staffPayments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const staff = await requireStaff(req, res);
  if (!staff) return;

  try {
    const comparison = await compareWithFlutterwave(await loadStaffOrders());
    return res.status(200).json({ ok: true, ...comparison });
  } catch (err) {
    console.error('staff/compare: failed', err);
    return res.status(502).json({ ok: false, message: 'We could not compare with Flutterwave.' });
  }
}
