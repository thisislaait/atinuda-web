// pages/api/checkout/instalment-reminders.ts
// Runs daily from Vercel Cron (vercel.json).
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireCron } from '@/lib/staffGuards';
import { runInstalmentSweep } from '@/lib/atinuda7Instalments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireCron(req, res, 'instalment-reminders')) return;

  try {
    const summary = await runInstalmentSweep();
    return res.status(200).json({ ok: true, ...summary });
  } catch (err) {
    console.error('instalment-reminders: sweep failed', err);
    return res.status(500).json({ ok: false });
  }
}
