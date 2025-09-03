// pages/api/attendees.ts
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET only
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  // CORS - simple permissive header so your mobile app can call this endpoint.
  // In production you might want to restrict origin.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Optional query params:
  // - limit (number) default 200 (capped at 500)
  // - ticketType (string) optional filter
  const rawLimit = parseInt(String(req.query.limit || '200'), 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 200;
  const ticketType = typeof req.query.ticketType === 'string' ? req.query.ticketType.trim() : '';

  try {
    let q = adminDb.collection('payments')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (ticketType) {
      q = q.where('ticketType', '==', ticketType);
    }

    const snap = await q.get();

    const docs = snap.docs;
    // Gather unique emails (lowercased) for user lookup
    const emailsSet = new Set<string>();
    docs.forEach(d => {
      const data: any = d.data();
      if (data && data.email && typeof data.email === 'string') {
        emailsSet.add(data.email.toLowerCase().trim());
      }
    });

    const emails = Array.from(emailsSet).filter(Boolean);

    // Map email -> userId (if exists). Use 'in' queries in chunks of 10 (Firestore limit).
    const emailToUserId = new Map<string, string>();
    if (emails.length > 0) {
      const chunks = chunkArray(emails, 10);
      for (const chunk of chunks) {
        const usersSnap = await adminDb
          .collection('users')
          .where('email', 'in', chunk)
          .get();

        usersSnap.forEach(u => {
          const udata: any = u.data();
          const e = (udata.email || '').toLowerCase().trim();
          if (e) {
            emailToUserId.set(e, u.id);
          }
        });
      }
    }

    const attendees: AttendeeResp[] = docs.map(d => {
      const data: any = d.data() || {};

      // Normalize createdAt to ISO if possible
      let createdAtISO: string | undefined;
      if (data.createdAt) {
        // Firestore Timestamp (server SDK) has toDate()
        if (typeof (data.createdAt as any).toDate === 'function') {
          try {
            createdAtISO = (data.createdAt as any).toDate().toISOString();
          } catch {
            createdAtISO = undefined;
          }
        } else if (typeof data.createdAt === 'string') {
          createdAtISO = data.createdAt;
        } else {
          createdAtISO = undefined;
        }
      }

      const emailRaw = (data.email || '') as string;
      const emailNorm = typeof emailRaw === 'string' && emailRaw ? emailRaw.toLowerCase().trim() : '';

      return {
        id: d.id,
        fullName: data.fullName || data.name || '',
        email: emailRaw || undefined,
        ticketType: data.ticketType || '',
        ticketNumber: data.ticketNumber || '',
        location: data.location || '',
        createdAt: createdAtISO,
        userId: emailNorm ? (emailToUserId.get(emailNorm) || null) : null,
      } as AttendeeResp;
    });

    // Small caching header — adjust as needed for your environment.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=59');

    return res.status(200).json({ ok: true, attendees });
  } catch (err) {
    console.error('ERROR /api/attendees', err);
    return res.status(500).json({ ok: false, message: 'Server error fetching attendees' });
  }
}
