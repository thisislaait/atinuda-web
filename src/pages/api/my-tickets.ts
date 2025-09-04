// // src/pages/api/my-tickets.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { adminDb } from '@/utils/firebaseAdmin';
// import { getAuth } from 'firebase-admin/auth';

// type TicketCheckIn = {
//   azizi6th: boolean;
//   day1: boolean;
//   day2: boolean;
//   gala8pm: boolean;
// };

// type TicketOut = {
//   id: string;
//   fullName?: string;
//   email?: string;
//   ticketType?: string;
//   ticketNumber?: string;
//   location?: string;
//   createdAt?: string; // ISO
//   checkIn: TicketCheckIn;
// };

// type PaymentDoc = {
//   fullName?: string;
//   email?: string;
//   emailLower?: string;
//   ticketType?: string;
//   ticketNumber?: string;
//   location?: string;
//   createdAt?: FirebaseFirestore.Timestamp | string | Date | null;
//   uid?: string | null;
//   checkIn?:
//     | {
//         azizi6th?: unknown;
//         day1?: unknown;
//         day2?: unknown;
//         gala8pm?: unknown;
//       }
//     | {
//         // legacy support: only day1/day2
//         day1?: unknown;
//         day2?: unknown;
//       }
//     | null;
// };

// function hasToDate(v: unknown): v is { toDate: () => Date } {
//   return typeof v === 'object' && v !== null && 'toDate' in v && typeof (v as { toDate?: unknown }).toDate === 'function';
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     if (req.method !== 'GET') {
//       res.setHeader('Allow', ['GET']);
//       return res.status(405).json({ error: 'Method Not Allowed' });
//     }

//     const authHeader = req.headers.authorization ?? '';
//     const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
//     if (!idToken) return res.status(401).json({ error: 'Missing token' });

//     const decoded = await getAuth().verifyIdToken(idToken);
//     const emailLower = (decoded.email ?? '').toLowerCase();
//     const uid = decoded.uid;

//     if (!uid && !emailLower) {
//       return res.status(403).json({ error: 'No email on token' });
//     }

//     let snap: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

//     // Prefer uid if present on docs, fall back to emailLower
//     if (uid) {
//       snap = await adminDb
//         .collection('payments')
//         .where('uid', '==', uid)
//         .orderBy('createdAt', 'desc')
//         .limit(20)
//         .get();

//       if (snap.empty && emailLower) {
//         snap = await adminDb
//           .collection('payments')
//           .where('emailLower', '==', emailLower)
//           .orderBy('createdAt', 'desc')
//           .limit(20)
//           .get();
//       }
//     } else {
//       snap = await adminDb
//         .collection('payments')
//         .where('emailLower', '==', emailLower)
//         .orderBy('createdAt', 'desc')
//         .limit(20)
//         .get();
//     }

//     const tickets: TicketOut[] = snap.docs.map((d) => {
//       const data = d.data() as PaymentDoc;

//       // createdAt → ISO
//       let createdAtISO: string | undefined;
//       if (data.createdAt) {
//         if (hasToDate(data.createdAt)) {
//           createdAtISO = data.createdAt.toDate().toISOString();
//         } else if (data.createdAt instanceof Date) {
//           createdAtISO = data.createdAt.toISOString();
//         } else if (typeof data.createdAt === 'string') {
//           createdAtISO = data.createdAt;
//         }
//       }

//       const raw = (data.checkIn ?? {}) as Record<string, unknown>;
//       // Backward compatible mapping: support both {day1, day2} and the new 4 flags
//       const checkIn: TicketCheckIn = {
//         azizi6th: Boolean(raw.azizi6th ?? false),
//         day1: Boolean(raw.day1 ?? false),
//         day2: Boolean(raw.day2 ?? false),
//         gala8pm: Boolean(raw.gala8pm ?? false),
//       };

//       return {
//         id: d.id,
//         fullName: data.fullName ?? '',
//         email: data.email ?? '',
//         ticketType: data.ticketType ?? '',
//         ticketNumber: data.ticketNumber ?? '',
//         location: data.location ?? '',
//         createdAt: createdAtISO,
//         checkIn,
//       };
//     });

//     res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=45');
//     return res.status(200).json({ tickets });
//   } catch (e) {
//     const message = e instanceof Error ? e.message : 'Server error';
//     return res.status(500).json({ error: message });
//   }
// }


// src/pages/api/my-tickets.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

type TicketCheckIn = {
  azizi6th: boolean; // 6th: Azizi by Atinuda
  day1: boolean;     // 7th: Conference Day 1
  day2: boolean;     // 8th: Conference Day 2
  gala8pm: boolean;  // 8th 6pm: Dinner Gala
};

type TicketOut = {
  id: string;
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location: string;
  createdAt?: string; // ISO
  checkIn: TicketCheckIn;
};

type PaymentDoc = {
  fullName?: string;
  email?: string;
  emailLower?: string;
  ticketType?: string;
  ticketNumber?: string;
  location?: string;
  createdAt?: FirebaseFirestore.Timestamp | string | Date | null;
  uid?: string;
  checkIn?: {
    azizi6th?: unknown;
    day1?: unknown;
    day2?: unknown;
    gala8pm?: unknown;
  } | null;
};

function hasToDate(v: unknown): v is { toDate: () => Date } {
  return typeof v === 'object' && v !== null && 'toDate' in v &&
    typeof (v as { toDate?: unknown }).toDate === 'function';
}

function toISO(value: PaymentDoc['createdAt']): string | undefined {
  if (!value) return undefined;
  if (hasToDate(value)) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return undefined;
}

type PartialCheckInRaw = Partial<Record<keyof TicketCheckIn, unknown>>;
function isPartialCheckInRaw(v: unknown): v is PartialCheckInRaw {
  return typeof v === 'object' && v !== null;
}

function safeString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function mapDoc(
  d: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): TicketOut {
  const raw = d.data();

  const fullName = safeString(raw.fullName);
  const email = safeString(raw.email);
  const ticketType = safeString(raw.ticketType);
  const ticketNumber = safeString(raw.ticketNumber);
  const location = safeString(raw.location);

  const createdAtISO = toISO(raw.createdAt as PaymentDoc['createdAt']);

  const rawCI = isPartialCheckInRaw(raw.checkIn) ? raw.checkIn : {};
  const checkIn: TicketCheckIn = {
    azizi6th: Boolean(rawCI.azizi6th ?? false),
    day1: Boolean(rawCI.day1 ?? false),
    day2: Boolean(rawCI.day2 ?? false),
    gala8pm: Boolean(rawCI.gala8pm ?? false),
  };

  return {
    id: d.id,
    fullName,
    email,
    ticketType,
    ticketNumber,
    location,
    createdAt: createdAtISO,
    checkIn,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const authHeader = req.headers.authorization ?? '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const decoded = await getAuth().verifyIdToken(idToken);
    const emailRaw = decoded.email ?? '';
    const emailLower = emailRaw.toLowerCase();
    const uid = decoded.uid;

    const limit = 20;

    // 1) Try by uid
    let snap:
      | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
      | null = null;

    if (uid) {
      snap = await adminDb
        .collection('payments')
        .where('uid', '==', uid)
        .limit(limit)
        .get();
    }

    // 2) Try by emailLower (new docs/backfilled)
    if (!snap || snap.empty) {
      if (emailLower) {
        snap = await adminDb
          .collection('payments')
          .where('emailLower', '==', emailLower)
          .limit(limit)
          .get();
      }
    }

    // 3) Fall back to legacy exact `email` match (old tickets)
    if (!snap || snap.empty) {
      if (emailRaw) {
        snap = await adminDb
          .collection('payments')
          .where('email', '==', emailRaw)
          .limit(limit)
          .get();
      }
    }

    if (!snap || snap.empty) {
      return res.status(200).json({ tickets: [] });
    }

    // Sort newest first in memory (no composite index required)
    const tickets = snap.docs
      .map(mapDoc)
      .sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
        return tb - ta;
      });

    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=45');
    return res.status(200).json({ tickets });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: message });
  }
}
