// pages/api/register-session.ts
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

type PaymentRecord = {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  company?: string | null;
  org?: string | null;
  business?: string | null;
  emailLower?: string | null;
  [k: string]: unknown;
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
    const pay = payDoc.data() as PaymentRecord;
    const paymentId = payDoc.id;

    // Normalize attendee info from payment safely
    const fullName =
      (typeof pay.fullName === 'string' && pay.fullName) ||
      (
        `${(typeof pay.firstName === 'string' ? pay.firstName : '')} ${(typeof pay.lastName === 'string' ? pay.lastName : '')}`.trim()
      ) ||
      'Attendee';

    const email = typeof pay.email === 'string' ? pay.email : '';
    const company =
      (typeof pay.company === 'string' && pay.company) ||
      (typeof pay.org === 'string' && pay.org) ||
      (typeof pay.business === 'string' && pay.business) ||
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
  } catch (err: unknown) {
    // safe error handling without `any`
    console.error('ERROR /api/register-session', stringifyError(err));
    const msg = (err instanceof Error && err.message) ? err.message : 'Server error';
    return res.status(500).json({ ok: false, message: msg });
  }
}

/** Helper to safely convert unknown errors to strings for logs */
function stringifyError(e: unknown): string {
  if (e instanceof Error) return e.stack ?? e.message;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}
