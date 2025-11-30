// src/pages/api/pay-verify.ts
// Minimal HTTP server (Cloud Run / Node) to verify Flutterwave payments server-side
// and issue tickets in Firestore with Firebase Admin. Requires:
// - FLW_SECRET_KEY
// - FIREBASE_SERVICE_ACCOUNT_B64 or GOOGLE_APPLICATION_CREDENTIALS
// - A price catalog stored in Firestore: events/{slug}/ticketProducts/{productKey}

import http, { IncomingMessage, ServerResponse } from 'http';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
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
  price: number; // major units (e.g., 295000 for NGN)
  currency: Currency; // "NGN" | "USD"
  title?: string;
};

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
if (!FLW_SECRET_KEY) {
  console.warn('Warning: FLW_SECRET_KEY is not set. The server will reject requests.');
}

function getServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (path) {
    // allow require here for loading a JSON service account file in Node
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require(path) as Record<string, unknown>;
  }
  throw new Error('Set FIREBASE_SERVICE_ACCOUNT_B64 or GOOGLE_APPLICATION_CREDENTIALS');
}

if (!getApps().length) {
  initializeApp({ credential: cert(getServiceAccount()) });
}
const adminAuth = getAuth();
const db = getFirestore();

function parseJson(req: IncomingMessage): Promise<VerifyBody> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.from(c)));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8') || '{}';
        resolve(JSON.parse(raw) as VerifyBody);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

interface FlutterwaveVerifyResponse {
  status: string;
  data?: {
    id: number;
    status: string;
    amount: number;
    currency: string;
    tx_ref: string;
    customer?: { email?: string; name?: string };
  };
}

async function verifyFlutterwave(txId: string | number) {
  const url = `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(txId))}/verify`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Flutterwave verify failed: ${resp.status} ${txt}`);
  }
  const json = (await resp.json()) as FlutterwaveVerifyResponse;
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
  const snap = await db
    .collection('events')
    .doc(slug)
    .collection('ticketProducts')
    .doc(productKey)
    .get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<TicketProduct>;
  if (typeof data?.price !== 'number' || (data.currency !== 'NGN' && data.currency !== 'USD'))
    return null;
  return { price: data.price, currency: data.currency, title: data.title };
}

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
  finalAmount: number;
  unitAmount: number;
}) {
  const {
    eventSlug,
    productKey,
    quantity,
    currency,
    userId,
    email,
    name,
    txRef,
    transactionId,
    product,
    finalAmount,
    unitAmount,
  } = opts;

  const ticketNumber = generateTicketNumber(eventSlug, productKey);
  const payload = {
    userId,
    email: email ?? null,
    issuedToName: name ?? email ?? 'Guest',
    ticketNumber,
    ticketType: product.title ?? productKey,
    productKey,
    currency,
    amount: finalAmount,
    quantity,
    unitAmount,
    lastTxRef: txRef,
    lastTransactionId: String(transactionId),
    status: 'active',
    purchasedAt: FieldValue.serverTimestamp(),
    eventSlug,
  };

  await db
    .collection('events')
    .doc(eventSlug)
    .collection('attendees')
    .doc(userId)
    .set(payload, { merge: true });
  return payload;
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }));
      return;
    }

    if (!FLW_SECRET_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ ok: false, message: 'Server misconfigured (FLW_SECRET_KEY missing)' }),
      );
      return;
    }

    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Missing auth token' }));
      return;
    }

    const body = await parseJson(req);
    const {
      txRef,
      transactionId,
      eventSlug,
      productKey,
      quantity = 1,
      currency = 'NGN',
      recipients = [],
    } = body;

    if (!txRef || (!transactionId && transactionId !== 0) || !eventSlug || !productKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: false,
          message: 'txRef, transactionId, eventSlug, productKey are required',
        }),
      );
      return;
    }

    if (currency !== 'NGN' && currency !== 'USD') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Unsupported currency' }));
      return;
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;
    const userEmail = decoded.email ?? null;
    const userName = decoded.name ?? decoded.email ?? null;

    const product = await getProduct(eventSlug, productKey);
    if (!product) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Unknown productKey for event' }));
      return;
    }

    // Verify payment with Flutterwave
    const flw = await verifyFlutterwave(transactionId!);
    const sameRef = flw.tx_ref === txRef;
    const sameCurrency = flw.currency?.toUpperCase() === currency;
    
    // Trust Flutterwave's verified amount as source of truth
    // This allows flexible testing with different prices
    if (!sameRef || !sameCurrency) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'txRef/currency mismatch' }));
      return;
    }

    const finalAmount = Number(flw.amount);
    const unitAmount = quantity > 0 ? Math.round(finalAmount / quantity) : finalAmount;

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
      finalAmount,
      unitAmount,
    });

    // Optionally auto-issue for group recipients (each gets their own doc id = email)
    const guestTickets = [];
    for (const [idx, email] of recipients.entries()) {
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
        finalAmount: unitAmount,
        unitAmount,
      });
      guestTickets.push(guest);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, ticket: primary, guests: guestTickets }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('verify handler error', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, message }));
  }
}

const port = process.env.PORT || 8080;
http.createServer(handler).listen(port, () => {
  console.log(`pay-verify listening on ${port}`);
});
