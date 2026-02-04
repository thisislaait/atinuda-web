// src/pages/api/pay-claim.ts
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

type Currency = 'NGN' | 'USD';
type ClaimBody = { claimCode?: string; eventSlug?: string; productKey?: string };
type TicketProduct = { price: number; currency: Currency; title?: string };
type ClaimDoc = { eventSlug?: string; redeemed?: boolean; redeemedBy?: string };

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
const auth = getAuth();
const db = getFirestore();

function generateTicketNumber(slug: string, productKey?: string): string {
  if (slug === 'martitus-retreat-2026') {
    const rand =
      `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
    return `ATNMAU-${rand}`;
  }
  const prefix = productKey ? productKey.slice(0, 4).toUpperCase() : 'GEN';
  const rand =
    `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `ATN-${prefix}-${rand}`;
}

async function getProduct(slug: string, productKey: string): Promise<TicketProduct | null> {
  const snap = await db.collection('events').doc(slug).collection('ticketProducts').doc(productKey).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<TicketProduct>;
  if (typeof data?.price !== 'number') return null;
  const currency = (data.currency || 'NGN').toUpperCase();
  if (currency !== 'NGN' && currency !== 'USD') return null;
  return { price: data.price, currency: currency as Currency, title: data.title };
}

async function issueTicket(opts: {
  eventSlug: string;
  productKey: string;
  userId: string;
  email: string | null;
  name: string | null;
  product: TicketProduct;
}) {
  const { eventSlug, productKey, userId, email, name, product } = opts;
  const ticketNumber = generateTicketNumber(eventSlug, productKey);
  const payload = {
    userId,
    email: email ?? null,
    issuedToName: name ?? email ?? 'Guest',
    ticketNumber,
    ticketType: product.title ?? productKey,
    productKey,
    currency: product.currency,
    amount: product.price,
    quantity: 1,
    unitAmount: product.price,
    lastTxRef: `claim-${ticketNumber}`,
    lastTransactionId: `claim-${ticketNumber}`,
    status: 'active',
    purchasedAt: FieldValue.serverTimestamp(),
    eventSlug,
  };
  await db.collection('events').doc(eventSlug).collection('attendees').doc(userId).set(payload, { merge: true });
  return payload;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return res.status(401).json({ ok: false, message: 'Missing auth token' });

    const { uid: userId, email: userEmail = null, name: userName = null } = await auth.verifyIdToken(idToken);

    const body = (req.body || {}) as ClaimBody;
    const claimCode = (body.claimCode || '').trim();
    const eventSlug = (body.eventSlug || '').trim();
    const productKey = (body.productKey || 'main-ngn').trim();
    if (!claimCode || !eventSlug || !productKey)
      return res.status(400).json({ ok: false, message: 'claimCode, eventSlug, productKey required' });

    const claimRef = db.collection('claimTickets').doc(claimCode);
    const snap = await claimRef.get();
    if (!snap.exists) return res.status(404).json({ ok: false, message: 'Invalid claim code' });

    const claim = snap.data() as ClaimDoc;
    if ((claim.eventSlug || eventSlug) !== eventSlug)
      return res.status(400).json({ ok: false, message: 'Claim code not valid for this event' });
    if (claim.redeemed && claim.redeemedBy && claim.redeemedBy !== userId)
      return res.status(400).json({ ok: false, message: 'Claim code already used' });

    const product = await getProduct(eventSlug, productKey);
    if (!product) return res.status(400).json({ ok: false, message: 'Unknown ticket product' });

    const ticket = await issueTicket({ eventSlug, productKey, userId, email: userEmail, name: userName, product });

    await claimRef.set(
      {
        redeemed: true,
        redeemedBy: userId,
        redeemedEmail: userEmail ?? null,
        redeemedAt: FieldValue.serverTimestamp(),
        ticketNumber: ticket.ticketNumber,
        eventSlug,
        productKey,
      },
      { merge: true },
    );

    return res.status(200).json({ ok: true, ticketNumber: ticket.ticketNumber });
  } catch (err: unknown) {
    console.error('pay-claim api error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ ok: false, message });
  }
}
