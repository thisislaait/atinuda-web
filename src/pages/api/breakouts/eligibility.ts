// pages/api/breakouts/eligibility.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/utils/firebaseAdmin';

type Session = {
  id: string;
  title: string;
  track?: string;
  start?: string;
  end?: string;
  capacity?: number | null;
};

function fallbackSessions(): Session[] {
  // Replace with your real sessions or remove fallback once you seed Firestore
  return [
    { id: 's1', title: 'Brand Storytelling', track: 'Marketing', start: '10:00', end: '11:00', capacity: 60 },
    { id: 's2', title: 'E-commerce Growth Tactics', track: 'Business', start: '11:15', end: '12:15', capacity: 60 },
    { id: 's3', title: 'Design Systems in Practice', track: 'Design', start: '14:00', end: '15:00', capacity: 60 },
  ];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Auth
  const authHeader = req.headers.authorization ?? '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) return res.status(401).json({ message: 'Missing auth token' });

  let uid: string;
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return res.status(401).json({ message: 'Invalid auth token' });
  }

  try {
    // Get user's tickets (paid)
    const ticketsSnap = await adminDb
      .collection('tickets')
      .where('uid', '==', uid)
      .get();

    const tickets = ticketsSnap.docs.map((d) => {
      const data = d.data() as { txRef?: string; ticketType?: string };
      return {
        txRef: data.txRef || d.id,
        ticketType: data.ticketType || 'General Admission',
      };
    });

    if (!tickets.length) {
      return res.status(200).json({
        eligible: false,
        tickets: [],
        sessions: [],
        message: 'No paid tickets found for your account.',
      });
    }

    // Load sessions from Firestore (breakout_sessions), else fallback
    const sessSnap = await adminDb.collection('breakout_sessions').get().catch(() => null);
    const sessions: Session[] =
      sessSnap && !sessSnap.empty
        ? sessSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Session, 'id'>) }))
        : fallbackSessions();

    // Check existing registration (idempotent: one per user)
    const regSnap = await adminDb.collection('breakout_registrations').doc(uid).get();
    let alreadyRegistered = false;
    let existing: { sessionId: string; txRef: string } | null = null;
    if (regSnap.exists) {
      const r = regSnap.data() as { sessionId?: string; txRef?: string };
      if (r?.sessionId && r?.txRef) {
        alreadyRegistered = true;
        existing = { sessionId: r.sessionId, txRef: r.txRef };
      }
    }

    return res.status(200).json({
      eligible: true,
      tickets,
      sessions,
      alreadyRegistered,
      existing,
    });
  } catch (err) {
    console.error('eligibility error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}
