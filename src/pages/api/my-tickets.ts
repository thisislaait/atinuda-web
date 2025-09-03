// src/pages/api/my-tickets.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isFirestoreTimestamp(v: unknown): v is { toDate: () => Date } {
  return isRecord(v) && typeof (v as { toDate?: unknown }).toDate === 'function';
}

function safeErrorMessage(e: unknown): string {
  if (!e) return 'Unknown error';
  if (e instanceof Error) return e.message;
  try {
    return String(e);
  } catch {
    return 'Unknown error';
  }
}

// initialize admin SDK if not already initialized
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
  const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, '\n') : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    // In production you'd want to fail loudly; leaving a console.warn to help debug builds.
    console.warn('firebase-admin not fully configured: missing env vars FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    } as admin.ServiceAccount),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = String(req.headers.authorization || '');
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!idToken) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    // Verify token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid || '';
    const emailLower = typeof decoded.email === 'string' ? decoded.email.toLowerCase() : '';

    const db = admin.firestore();

    // Prefer uid lookup, then fallback to emailLower
    let snap: admin.firestore.QuerySnapshot<admin.firestore.DocumentData> | null = null;

    if (uid) {
      snap = await db
        .collection('payments')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      // If nothing via uid, try emailLower
      if (snap.empty && emailLower) {
        snap = await db
          .collection('payments')
          .where('emailLower', '==', emailLower)
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get();
      }
    } else if (emailLower) {
      snap = await db
        .collection('payments')
        .where('emailLower', '==', emailLower)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
    } else {
      return res.status(403).json({ error: 'No email/uid available in token' });
    }

    // Safety: if still null (shouldn't happen), return empty list
    if (!snap) {
      return res.status(200).json({ tickets: [] });
    }

    // Normalize documents
    const tickets = snap.docs.map((d) => {
      const raw = d.data();
      const data = isRecord(raw) ? raw : {};

      // Normalize createdAt to ISO string if possible
      let createdAtIso: string | undefined;
      const createdRaw = data.createdAt;
      if (isFirestoreTimestamp(createdRaw)) {
        try {
          createdAtIso = createdRaw.toDate().toISOString();
        } catch {
          createdAtIso = undefined;
        }
      } else if (typeof createdRaw === 'string') {
        createdAtIso = createdRaw;
      }

      // Build a safe ticket object
      return {
        id: d.id,
        fullName: typeof data.fullName === 'string' ? data.fullName : (typeof data.name === 'string' ? data.name : undefined),
        email: typeof data.email === 'string' ? data.email : undefined,
        emailLower: typeof data.emailLower === 'string' ? data.emailLower : undefined,
        ticketType: typeof data.ticketType === 'string' ? data.ticketType : undefined,
        ticketNumber: typeof data.ticketNumber === 'string' ? data.ticketNumber : undefined,
        location: typeof data.location === 'string' ? data.location : undefined,
        uid: typeof data.uid === 'string' ? data.uid : undefined,
        createdAt: createdAtIso,
        meta: isRecord(data.meta) ? data.meta : undefined,
      } as Record<string, unknown>;
    });

    // small cache header
    res.setHeader('Cache-Control', 'private, max-age=0, s-maxage=30, stale-while-revalidate=59');

    return res.status(200).json({ tickets });
  } catch (err: unknown) {
    const msg = safeErrorMessage(err);
    console.error('ERROR /api/my-tickets', msg, err);
    return res.status(500).json({ error: msg });
  }
}
