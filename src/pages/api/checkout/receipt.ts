// pages/api/checkout/receipt.ts
// A buyer attaches their transfer receipt, using their order's private token. Replacing it is
// allowed until they have told us the transfer is made.
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';
import { nextInstalment, orderForToken } from '@/lib/atinuda7Fulfil';
import { receiptKey } from '@/lib/atinuda7Transfers';
import { MAX_RECEIPT_BYTES, deleteReceipt, detectReceiptType, saveReceipt } from '@/lib/transferReceipts';

// The body is the raw file.
export const config = { api: { bodyParser: false } };

async function readBody(req: NextApiRequest) {
  const parts: Buffer[] = [];
  let size = 0;
  for await (const part of req) {
    const chunk = Buffer.from(part as Buffer);
    size += chunk.length;
    if (size > MAX_RECEIPT_BYTES) return null;
    parts.push(chunk);
  }
  return Buffer.concat(parts);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const orderId = String(req.query.order);

  try {
    const order = await orderForToken(req.query.order, req.query.t);
    if (!order || order.method !== 'transfer') {
      return res.status(404).json({ ok: false, message: 'This order link is not valid.' });
    }
    const ref = adminDb.collection('orders').doc(orderId);
    const declared = order.plan === 'instalments' ? !!nextInstalment(order)?.declaredAt : !!order.declaredAt;
    if (!['pending', 'part_paid'].includes(order.status) || declared) {
      return res.status(409).json({ ok: false, message: 'This order is not waiting for a receipt.' });
    }

    const bytes = await readBody(req);
    if (!bytes) return res.status(413).json({ ok: false, message: 'That file is too large. Please attach one under 4 MB.' });
    const kind = detectReceiptType(bytes);
    if (!kind) return res.status(415).json({ ok: false, message: 'Please attach your receipt as a JPG, PNG, WebP or PDF.' });

    const key = receiptKey(order);
    const path = await saveReceipt(bytes);
    await ref.set(
      { receipts: { [key]: { path, contentType: kind.type, size: bytes.length, uploadedAt: new Date().toISOString() } } },
      { merge: true },
    );
    const previous = order.receipts?.[key]?.path;
    if (previous) await deleteReceipt(previous).catch((err) => console.warn('checkout/receipt: old file not removed', err));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('checkout/receipt: upload failed', orderId, err);
    return res.status(500).json({ ok: false, message: 'Your receipt did not upload. Please try again.' });
  }
}
