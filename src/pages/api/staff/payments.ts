// pages/api/staff/payments.ts
// Staff only. Money received on Atinuda 7.0, for the /staff/payments page.
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireStaff } from '@/lib/staffGuards';
import { buildLedger } from '@/lib/staffLedger';
import { loadStaffOrders } from '@/lib/staffPayments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const staff = await requireStaff(req, res);
  if (!staff) return;

  try {
    const ledger = buildLedger(await loadStaffOrders());
    return res.status(200).json({ ok: true, ...ledger });
  } catch (err) {
    console.error('staff/payments: failed to load', err);
    return res.status(500).json({ ok: false, message: 'We could not load payments.' });
  }
}
