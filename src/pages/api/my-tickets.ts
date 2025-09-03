// pages/api/my-tickets.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return res.status(401).json({ error: 'Missing token' });

    const decoded = await getAuth().verifyIdToken(idToken);
    const emailLower = (decoded.email || '').toLowerCase();
    const uid = decoded.uid;

    const db = getFirestore();

    // Prefer uid (if your new docs save it), else fall back to emailLower
    let snap;
    if (uid) {
      snap = await db
        .collection('payments')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
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
      return res.status(403).json({ error: 'No email on token' });
    }

    const tickets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.status(200).json({ tickets });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
