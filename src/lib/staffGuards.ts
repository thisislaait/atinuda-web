// Server-only checks for staff pages and scheduled jobs.
import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { getAuth } from 'firebase-admin/auth';
import { getAdminDb } from '@/utils/firebaseAdmin';

// Staff hold the Firebase custom claim `admin: true`, granted with scripts/grant-staff-access.mjs.
// Sends the 401 or 403 itself and returns null, so callers just stop.
export async function requireStaff(req: NextApiRequest, res: NextApiResponse) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ ok: false, message: 'Please sign in.' });
    return null;
  }
  try {
    getAdminDb();
    const decoded = await getAuth().verifyIdToken(token, true);
    if (decoded.admin !== true) {
      res.status(403).json({ ok: false, message: 'This account does not have access.' });
      return null;
    }
    return decoded;
  } catch {
    res.status(401).json({ ok: false, message: 'Please sign in again.' });
    return null;
  }
}

// Vercel Cron sends CRON_SECRET as a bearer token. Sends its own error and returns false.
export function requireCron(req: NextApiRequest, res: NextApiResponse, route: string) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error(`${route}: CRON_SECRET is not set`);
    res.status(500).json({ ok: false });
    return false;
  }
  const received = Buffer.from(req.headers.authorization ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    res.status(401).json({ ok: false });
    return false;
  }
  return true;
}
