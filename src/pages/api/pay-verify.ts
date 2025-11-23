// src/pages/api/pay-verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

type Currency = 'NGN' | 'USD';

type VerifyBody = {
  txRef?: string;
  transactionId?: string | number;
  eventSlug?: string;
  productKey?: string;
  quantity?: number;
  currency?: Currency;
  recipients?: string[];
};

type TicketProduct = {
  price: number;
  currency: Currency;
  title?: string;
};

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
if (!FLW_SECRET_KEY) {
  console.warn('⚠️ FLW_SECRET_KEY is not set; pay-verify route will reject requests.');
}

function getServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (path) return require(path);
  throw new Error('Set FIREBASE_SERVICE_ACCOUNT_B64 or GOOGLE_APPLICATION_CREDENTIALS');
}

if (!getApps().length) {
  initializeApp({ credential: cert(getServiceAccount()) });
}
const adminAuth = getAuth();
const db = getFirestore();

async function verifyFlutterwave(txId: string | number) {
  const url = `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(txId))}/verify`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Flutterwave verify failed: ${resp.status} ${txt}`);
  }
  const json = (await resp.json()) as any;
  if (json?.status !== 'success' || json?.data?.status !== 'successful') {
    throw new Error('Transaction not successful on Flutterwave');
  }
  return json.data as {
    id: number;
    status: string;
    amount: number;
    currency: string;
    tx_ref: string;
    customer?: { email?: string; name?: string };
  };
}

async function getProduct(slug: string, productKey: string): Promise<TicketProduct | null> {
  const snap = await db.collection('events').doc(slug).collection('ticketProducts').doc(productKey).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<TicketProduct>;
  if (typeof data?.price !== 'number') return null;
  const cur = data.currency === 'USD' ? 'USD' : 'NGN';
  return { price: data.price, currency: cur, title: data.title };
}

function generateTicketNumber(productKey?: string): string {
  const prefix = productKey ? productKey.slice(0, 4).toUpperCase() : 'GEN';
  const rand = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `ATN-${prefix}-${rand}`;
}

async function issueTicket(opts: {
  eventSlug: string;
  productKey: string;
  quantity: number;
  currency: Currency;
  userId: string;
  email: string | null;
  name: string | null;
  txRef: string;
  transactionId: string | number;
  product: TicketProduct;
}) {
  const { eventSlug, productKey, quantity, currency, userId, email, name, txRef, transactionId, product } = opts;
  const ticketNumber = generateTicketNumber(productKey);

  const payload = {
    userId,
    email: email ?? null,
    issuedToName: name ?? email ?? 'Guest',
    ticketNumber,
    ticketType: product.title ?? productKey,
    productKey,
    currency,
    amount: product.price * quantity,
    quantity,
    unitAmount: product.price,
    lastTxRef: txRef,
    lastTransactionId: String(transactionId),
    status: 'active',
    purchasedAt: FieldValue.serverTimestamp(),
    eventSlug,
  };

  await db.collection('events').doc(eventSlug).collection('attendees').doc(userId).set(payload, { merge: true });
  return payload;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    if (!FLW_SECRET_KEY) {
      return res.status(500).json({ ok: false, message: 'Server misconfigured (FLW_SECRET_KEY missing)' });
    }

    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) {
      return res.status(401).json({ ok: false, message: 'Missing auth token' });
    }

    const body = (req.body ?? {}) as VerifyBody;
    const { txRef, transactionId, eventSlug, productKey, quantity = 1, currency = 'NGN', recipients = [] } = body;

    if (!txRef || (!transactionId && transactionId !== 0) || !eventSlug || !productKey) {
      return res.status(400).json({ ok: false, message: 'txRef, transactionId, eventSlug, productKey are required' });
    }
    if (currency !== 'NGN' && currency !== 'USD') {
      return res.status(400).json({ ok: false, message: 'Unsupported currency' });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;
    const userEmail = decoded.email ?? null;
    const userName = decoded.name ?? decoded.email ?? null;

    const product = await getProduct(eventSlug, productKey);
    if (!product) {
      return res.status(400).json({ ok: false, message: 'Unknown productKey for event' });
    }

    const flw = await verifyFlutterwave(transactionId!);
    const sameRef = flw.tx_ref === txRef;
    const sameCurrency = flw.currency?.toUpperCase() === currency;
    const expectedAmount = product.price * Math.max(1, quantity);
    const sameAmount = Number(flw.amount) === Number(expectedAmount);
    if (!sameRef || !sameCurrency || !sameAmount) {
      return res.status(400).json({ ok: false, message: 'Amount/currency/txRef mismatch' });
    }

    const primary = await issueTicket({
      eventSlug,
      productKey,
      quantity: Math.max(1, quantity),
      currency,
      userId,
      email: userEmail,
      name: userName,
      txRef,
      transactionId,
      product,
    });

    const guestTickets = [];
    for (const [idx, email] of (recipients || []).entries()) {
      const clean = (email || '').trim().toLowerCase();
      if (!clean) continue;
      const guestId = `guest:${clean}`;
      const guest = await issueTicket({
        eventSlug,
        productKey,
        quantity: 1,
        currency,
        userId: guestId,
        email: clean,
        name: clean,
        txRef: `${txRef}-g${idx}`,
        transactionId,
        product,
      });
      guestTickets.push(guest);
    }

    return res.status(200).json({ ok: true, ticket: primary, guests: guestTickets });
  } catch (err: any) {
    console.error('pay-verify error', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Server error' });
  }
}
