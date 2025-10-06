// pages/api/register-session.ts
'use client'

import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';

type Payload = {
  ticketNumber?: string;
  selections?: {
    breakouts?: string[];
    workshops?: string[];
    notes?: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (simple)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const body = (req.body ?? {}) as Payload;

    const ticketNumber = String(body.ticketNumber ?? '').trim();
    if (!ticketNumber) {
      return res.status(400).json({ ok: false, message: 'ticketNumber is required' });
    }

    const selections = {
      breakouts: body.selections?.breakouts ?? [],
      workshops: body.selections?.workshops ?? [],
      notes: body.selections?.notes ?? '',
    };

    // 1) Resolve payment by ticketNumber
    // Adjust the field name if you store it differently (e.g., `ticket` / `orderId`).
    const paySnap = await adminDb
      .collection('payments')
      .where('ticketNumber', '==', ticketNumber)
      .limit(1)
      .get();

    if (paySnap.empty) {
      return res.status(404).json({
        ok: false,
        message: `No payment found for ticketNumber "${ticketNumber}"`,
      });
    }

    const payDoc = paySnap.docs[0];
    const pay = payDoc.data() as Record<string, any>;
    const paymentId = payDoc.id;

    // Normalize attendee info from payment
    const fullName =
      (pay.fullName as string) ||
      `${pay.firstName ?? ''} ${pay.lastName ?? ''}`.trim() ||
      'Attendee';
    const email = (pay.email as string) || '';
    const company =
      (pay.company as string) ||
      (pay.org as string) ||
      (pay.business as string) ||
      '';

    // (Optional) Try to link a userId by emailLower in users
    let userId: string | null = null;
    const emailLower = (email || '').toLowerCase();
    if (emailLower) {
      const usersByLower = await adminDb
        .collection('users')
        .where('emailLower', '==', emailLower)
        .limit(1)
        .get();

      if (!usersByLower.empty) {
        userId = usersByLower.docs[0].id;
      } else {
        const usersByEmail = await adminDb
          .collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
        if (!usersByEmail.empty) userId = usersByEmail.docs[0].id;
      }
    }

    // 2) Write to top-level `webbreakout`
    const webRef = await adminDb.collection('webbreakout').add({
      ticketNumber,
      paymentId,
      userId,
      fullName,
      email,
      company,
      selections,
      createdAt: FieldValue.serverTimestamp(),
      source: 'web-form',
    });

    // 3) Mirror under the payment for easy lookup (optional)
    await adminDb
      .collection('payments')
      .doc(paymentId)
      .collection('webbreakout')
      .doc(webRef.id)
      .set({
        webbreakoutRef: webRef.path,
        ticketNumber,
        userId,
        fullName,
        email,
        company,
        selections,
        createdAt: FieldValue.serverTimestamp(),
        source: 'web-form',
      });

    return res.status(200).json({
      ok: true,
      id: webRef.id,
      name: fullName,
      email,
      company,
      message: 'Registration received ✅',
    });
  } catch (err: any) {
    console.error('ERROR /api/register-session', err);
    const msg = err?.message || 'Server error';
    return res.status(500).json({ ok: false, message: msg });
  }
}
