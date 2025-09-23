// pages/api/flw/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';

const FLW_SECRET = process.env.FLW_SECRET_KEY;
if (!FLW_SECRET) {
  // Optional: fail fast at boot in dev
  // throw new Error('Missing FLW_SECRET_KEY');
}

type CurrencyCode = 'NGN' | 'USD';

interface VerifyRequestBody {
  txRef: string;
  transactionId: number | string;
  expected: {
    amount: number;
    currency: CurrencyCode;
    ticketType: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    userId?: string;
    discountPercent: number;
  };
}

interface FlwCustomer {
  email?: string;
  name?: string;
  phone_number?: string;
}

interface FlwVerifyData {
  id: number;
  status: string;            // "successful"
  amount: number;
  currency: string;          // "NGN" | "USD"
  tx_ref: string;
  flw_ref?: string;
  created_at?: string;
  customer?: FlwCustomer;
}

interface FlwVerifyAPI {
  status: string;            // "success" | "error"
  data?: FlwVerifyData;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, message: 'Method not allowed' });

  if (!FLW_SECRET)
    return res.status(500).json({ ok: false, message: 'Server misconfigured: FLW_SECRET_KEY missing' });

  const body = req.body as VerifyRequestBody | undefined;

  if (
    !body ||
    typeof body.txRef !== 'string' ||
    (!body.transactionId && body.transactionId !== 0) ||
    !body.expected ||
    typeof body.expected.amount !== 'number' ||
    (body.expected.currency !== 'NGN' && body.expected.currency !== 'USD')
  ) {
    return res.status(400).json({ ok: false, message: 'Invalid request body' });
  }

  const { txRef, transactionId, expected } = body;

  try {
    // (A) Idempotency: if already marked paid, return ok
    const orderRef = adminDb.collection('orders').doc(txRef);
    const existingSnap = await orderRef.get();
    if (existingSnap.exists) {
      const ex = existingSnap.data() as { status?: string; transactionId?: number | string };
      if (ex?.status === 'paid') {
        return res.status(200).json({ ok: true, txRef, transactionId: ex.transactionId ?? transactionId });
      }
    }

    // (B) Verify with Flutterwave
    const flwResp = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transactionId))}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET}` } }
    );

    if (!flwResp.ok) {
      const text = await flwResp.text().catch(() => '');
      return res.status(502).json({ ok: false, message: `Flutterwave verify failed: ${flwResp.status} ${text}` });
    }

    const flwJson = (await flwResp.json()) as FlwVerifyAPI;

    if (flwJson?.status !== 'success' || !flwJson.data || flwJson.data.status !== 'successful') {
      return res.status(400).json({ ok: false, message: 'Transaction not successful on Flutterwave' });
    }

    const data = flwJson.data;

    // (C) Cross-check integrity vs canonical expectations
    const sameRef = data.tx_ref === txRef;
    const sameCurrency = data.currency?.toUpperCase() === expected.currency;
    const sameAmount = Number(data.amount) === Number(expected.amount);

    if (!sameRef || !sameCurrency || !sameAmount) {
      return res.status(400).json({ ok: false, message: 'Amount/currency/txRef mismatch' });
    }

    // (D) Persist/merge canonical order (source of truth for ticketing)
    const buyerEmail = data.customer?.email ?? null;
    const buyerName = data.customer?.name ?? null;

    await orderRef.set(
      {
        txRef,
        status: 'paid',
        paidAt: FieldValue.serverTimestamp(),
        // From Flutterwave:
        transactionId: data.id,
        flwRef: data.flw_ref ?? null,
        amount: data.amount,
        currency: data.currency?.toUpperCase(),
        // Buyer (from Flutterwave customer payload)
        buyerEmail,
        buyerName,
        // Your expected fields (helpful for reconciliation)
        ticketType: expected.ticketType,
        quantity: expected.quantity,
        unitPrice: expected.unitPrice,
        subtotal: expected.subtotal,
        discountPercent: expected.discountPercent,
        userId: expected.userId ?? null,
        // Ticket fulfillment flags
        ticketIssued: existingSnap.exists ? existingSnap.get('ticketIssued') ?? false : false,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existingSnap.exists ? existingSnap.get('createdAt') ?? FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // (E) (Optional) consume discount here atomically, e.g. mark code used for userId.

    return res.status(200).json({ ok: true, txRef, transactionId: data.id });
  } catch (err: unknown) {
    console.error('FLW verify error', err);
    return res.status(500).json({ ok: false, message: 'Server error verifying payment' });
  }
}
