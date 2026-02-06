import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

type Body = { name?: string; email?: string; phone?: string };

function getServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (path) {
    const json = fs.readFileSync(path, 'utf8');
    return JSON.parse(json) as Record<string, unknown>;
  }
  throw new Error('Set FIREBASE_SERVICE_ACCOUNT_B64 or GOOGLE_APPLICATION_CREDENTIALS');
}

if (!getApps().length) initializeApp({ credential: cert(getServiceAccount()) });
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
    const body = (req.body || {}) as Body;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    if (!name || !email || !phone) {
      return res.status(400).json({ ok: false, message: 'name, email, phone are required' });
    }

    await db.collection('preSignups').add({
      name,
      email: email.toLowerCase(),
      phone,
      source: 'web-pre-signup',
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    console.error('pre-signup api error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ ok: false, message });
  }
}
