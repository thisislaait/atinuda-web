// src/pages/api/attendees.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';

type AttendeeResp = {
  id: string;
  fullName: string;
  email?: string;
  ticketType?: string;
  ticketNumber?: string;
  location?: string;
  createdAt?: string; // ISO string
  userId?: string | null;
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET only
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  // CORS for mobile/web dev clients (adjust in production)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Optional query params:
  // - limit (number) default 200 (capped at 500)
  // - ticketType (string) optional filter
  const rawLimit = parseInt(String(req.query.limit ?? '200'), 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 200;
  const ticketType = typeof req.query.ticketType === 'string' ? req.query.ticketType.trim() : '';

  try {
    // Build base query
    let q = adminDb.collection('payments').orderBy('createdAt', 'desc').limit(limit);

    if (ticketType) {
      q = q.where('ticketType', '==', ticketType);
    }

    const snap = await q.get();
    const docs = snap.docs;

    // Collect unique lower-cased emails for user enrichment
    const emailsSet = new Set<string>();
    docs.forEach((d) => {
      const raw = d.data();
      if (isRecord(raw)) {
        const e = raw.email;
        if (typeof e === 'string' && e.trim()) {
          emailsSet.add(e.toLowerCase().trim());
        }
      }
    });
    const emails = Array.from(emailsSet);

    // Map email -> userId (if a matching user doc exists)
    const emailToUserId = new Map<string, string>();
    if (emails.length > 0) {
      // Firestore 'in' supports up to 10 values; chunk accordingly
      const chunks = chunkArray(emails, 10);
      for (const chunk of chunks) {
        const usersSnap = await adminDb.collection('users').where('email', 'in', chunk).get();
        usersSnap.forEach((u) => {
          const udata = u.data();
          if (isRecord(udata)) {
            const ue = udata.email;
            if (typeof ue === 'string' && ue.trim()) {
              emailToUserId.set(ue.toLowerCase().trim(), u.id);
            }
          }
        });
      }
    }

    // Build attendees response
    const attendees: AttendeeResp[] = docs.map((d) => {
      const raw = d.data();
      const data = isRecord(raw) ? raw : {};

      // Normalize createdAt to ISO string when possible
      let createdAtISO: string | undefined;
      const rawCreated = data.createdAt;
      if (rawCreated && isRecord(rawCreated)) {
        // Firestore Timestamp from Admin SDK exposes toDate()
        const toDate = (rawCreated as { toDate?: unknown }).toDate;
        if (typeof toDate === 'function') {
          try {
            createdAtISO = (toDate as () => Date)().toISOString();
          } catch {
            createdAtISO = undefined;
          }
        }
      } else if (typeof rawCreated === 'string') {
        createdAtISO = rawCreated;
      }

      const emailRaw = data.email;
      const emailStr = typeof emailRaw === 'string' ? emailRaw : '';
      const emailNorm = emailStr ? emailStr.toLowerCase().trim() : '';

      const fullName =
        typeof data.fullName === 'string'
          ? data.fullName
          : typeof data.name === 'string'
          ? data.name
          : '';

      return {
        id: d.id,
        fullName,
        email: emailStr || undefined,
        ticketType: typeof data.ticketType === 'string' ? data.ticketType : undefined,
        ticketNumber: typeof data.ticketNumber === 'string' ? data.ticketNumber : undefined,
        location: typeof data.location === 'string' ? data.location : undefined,
        createdAt: createdAtISO,
        userId: emailNorm ? (emailToUserId.get(emailNorm) ?? null) : null,
      } as AttendeeResp;
    });

    // Small caching header — adjust as needed
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=59');

    return res.status(200).json({ ok: true, attendees });
  } catch (err) {
    console.error('ERROR /api/attendees', err);
    return res.status(500).json({ ok: false, message: 'Server error fetching attendees' });
  }
}
