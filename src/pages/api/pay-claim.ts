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

    const product = await getProduct(eventSlug, productKey);
    if (!product) return res.status(400).json({ ok: false, message: 'Unknown ticket product' });

    // Transactional redeem: the claim check and the redeem write happen
    // atomically, so a code can never be redeemed twice — even under
    // concurrent requests (PRD-platform-uplift R1.3).
    type RedeemResult =
      | { status: 'ok'; ticketNumber: string }
      | { status: 'error'; code: number; message: string };

    const result = await db.runTransaction<RedeemResult>(async (tx) => {
      const snap = await tx.get(claimRef);
      if (!snap.exists) {
        return { status: 'error', code: 404, message: 'Invalid claim code' };
      }
      const claim = snap.data() as ClaimDoc & { ticketNumber?: string };
      if ((claim.eventSlug || eventSlug) !== eventSlug) {
        return { status: 'error', code: 400, message: 'Claim code not valid for this event' };
      }
      if (claim.redeemed) {
        // Same user retrying is idempotent; anyone else is rejected.
        if (claim.redeemedBy === userId && claim.ticketNumber) {
          return { status: 'ok', ticketNumber: claim.ticketNumber };
        }
        return { status: 'error', code: 400, message: 'Claim code already used' };
      }

      const ticketNumber = generateTicketNumber(eventSlug, productKey);
      const attendeeRef = db.collection('events').doc(eventSlug).collection('attendees').doc(userId);
      tx.set(
        attendeeRef,
        {
          userId,
          email: userEmail ?? null,
          issuedToName: userName ?? userEmail ?? 'Guest',
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
        },
        { merge: true },
      );
      tx.set(
        claimRef,
        {
          redeemed: true,
          redeemedBy: userId,
          redeemedEmail: userEmail ?? null,
          redeemedAt: FieldValue.serverTimestamp(),
          ticketNumber,
          eventSlug,
          productKey,
        },
        { merge: true },
      );
      return { status: 'ok', ticketNumber };
    });

    if (result.status === 'error') {
      return res.status(result.code).json({ ok: false, message: result.message });
    }
    return res.status(200).json({ ok: true, ticketNumber: result.ticketNumber });
  } catch (err: unknown) {
    console.error('pay-claim api error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ ok: false, message });
  }
}
