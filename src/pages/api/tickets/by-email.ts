// pages/api/tickets/by-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const emailRaw = String(req.query.email ?? '').trim();
  if (!emailRaw) {
    return res.status(400).json({ ok: false, message: 'Missing email' });
  }
  const emailLower = emailRaw.toLowerCase();

  try {
    // 🔎 PRIMARY: payments by emailLower
    let snap = await adminDb
      .collection('payments')
      .where('emailLower', '==', emailLower)
      .get();

    // Fallback 1: payments by legacy 'email'
    if (snap.empty) {
      snap = await adminDb
        .collection('payments')
        .where('email', '==', emailRaw)
        .get();
    }

    // Fallback 2: tickets (in case some were mirrored there)
    if (snap.empty) {
      snap = await adminDb
        .collection('tickets')
        .where('emailLower', '==', emailLower)
        .get();

      if (snap.empty) {
        snap = await adminDb
          .collection('tickets')
          .where('email', '==', emailRaw)
          .get();
      }
    }

    if (snap.empty) {
      return res.status(404).json({ ok: false, message: 'No tickets found for that email.' });
    }

    const docs = snap.docs.map((d) => d.data() as {
      fullName?: string;
      email?: string;
      emailLower?: string;
      company?: string | null;
      ticketType?: string;
      ticketNumber?: string;
    });

    // Prefer a doc with fullName/ticket fields if available
    const first = docs.find(d => d.fullName || d.ticketNumber) ?? docs[0];

    const tickets = docs
      .filter((x) => !!x.ticketNumber)
      .map((x) => ({
        ticketNumber: String(x.ticketNumber),
        ticketType: String(x.ticketType || 'General Admission'),
      }));

    return res.status(200).json({
      ok: true,
      fullName: first.fullName ?? '',
      email: first.email ?? emailRaw,
      company: first.company ?? '',
      tickets,
    });
  } catch (err) {
    console.error('by-email error:', err);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
}
