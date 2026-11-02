// pages/api/staff/daily-summary.ts
// Runs each morning from Vercel Cron (vercel.json). Emails staff yesterday's payments.
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireCron } from '@/lib/staffGuards';
import { sendDailySummary } from '@/lib/staffPayments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireCron(req, res, 'staff/daily-summary')) return;

  try {
    const result = await sendDailySummary();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error('staff/daily-summary: failed', err);
    return res.status(500).json({ ok: false });
  }
}
