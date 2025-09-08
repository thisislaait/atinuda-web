// pages/api/attendees-explore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';

type AttendeeExplore = {
  id: string;
  userId: string | null;
  fullName: string;
  company: string;
  position: string;
  image: string;
  categories: string[];
  mutualConnections: number;
};

// small helper
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const rawLimit = parseInt(String(req.query.limit ?? '200'), 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 200;

  try {
    // 1) Grab latest payers
    const paySnap = await adminDb
      .collection('payments')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const emailToPayment: Map<string, { id: string; fullName?: string }> = new Map();
    const emails: string[] = [];
    paySnap.docs.forEach((d) => {
      const data = d.data() as Record<string, unknown>;
      const emailRaw = typeof data.email === 'string' ? data.email : '';
      const emailLower = emailRaw.toLowerCase().trim();
      if (!emailLower) return;
      if (!emailToPayment.has(emailLower)) {
        emailToPayment.set(emailLower, {
          id: d.id,
          fullName: typeof data.fullName === 'string' ? data.fullName : undefined,
        });
        emails.push(emailLower);
      }
    });

    // 2) Resolve users
    const emailToUserDoc = new Map<string, { id: string; data: Record<string, unknown> }>();
    if (emails.length > 0) {
      const chunks = chunk(emails, 10);
      for (const c of chunks) {
        const byLower = await adminDb.collection('users').where('emailLower', 'in', c).get();
        byLower.forEach((u) => {
          const ud = u.data() as Record<string, unknown>;
          const e = typeof ud.emailLower === 'string' ? ud.emailLower.toLowerCase().trim() : '';
          if (e) emailToUserDoc.set(e, { id: u.id, data: ud });
        });

        const missing = c.filter((e) => !emailToUserDoc.has(e));
        if (missing.length) {
          const byEmail = await adminDb.collection('users').where('email', 'in', missing).get();
          byEmail.forEach((u) => {
            const ud = u.data() as Record<string, unknown>;
            const e = typeof ud.email === 'string' ? ud.email.toLowerCase().trim() : '';
            if (e) emailToUserDoc.set(e, { id: u.id, data: ud });
          });
        }
      }
    }

    // 3) Build attendees + sync to attendees_public
    const attendees: AttendeeExplore[] = [];
    for (const emailLower of emails) {
      const user = emailToUserDoc.get(emailLower);
      const pay = emailToPayment.get(emailLower);

      const userData = user?.data ?? {};
      const firstName = typeof userData.firstName === 'string' ? userData.firstName : '';
      const lastName = typeof userData.lastName === 'string' ? userData.lastName : '';
      const fullName =
        [firstName, lastName].filter(Boolean).join(' ') ||
        (typeof userData.fullName === 'string' ? userData.fullName : '') ||
        pay?.fullName ||
        'Attendee';

      const company = typeof userData.company === 'string' ? userData.company : '';
      const position =
        typeof userData.position === 'string'
          ? userData.position
          : typeof userData.title === 'string'
          ? userData.title
          : '';

      const image =
        (typeof userData.avatarEmoji === 'string' && userData.avatarEmoji) ||
        (typeof userData.emoji === 'string' && userData.emoji) ||
        '👤';

      const categoriesArr: string[] =
        Array.isArray(userData.categories)
          ? (userData.categories as unknown[]).filter((x): x is string => typeof x === 'string')
          : Array.isArray(userData.interests)
          ? (userData.interests as unknown[]).filter((x): x is string => typeof x === 'string')
          : [];

      const attendee: AttendeeExplore = {
        id: user?.id ?? pay?.id ?? emailLower,
        userId: user?.id ?? null,
        fullName,
        company,
        position,
        image,
        categories: categoriesArr,
        mutualConnections: 0,
      };

      attendees.push(attendee);

      // 🔄 Sync into attendees_public
      await adminDb.collection('attendees_public').doc(attendee.id).set(attendee, { merge: true });
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=59');
    return res.status(200).json({ ok: true, attendees });
  } catch (err) {
    console.error('ERROR /api/attendees-explore', err);
    return res.status(500).json({ ok: false, message: 'Server error fetching attendees' });
  }
}
