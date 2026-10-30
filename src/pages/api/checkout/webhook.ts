// pages/api/checkout/webhook.ts
// Flutterwave webhook for Atinuda 7.0 orders. Issues tickets when a buyer pays but the
// browser never reaches /api/checkout/confirm (closed tab, dropped connection).
//
// Flutterwave dashboard → Settings → Webhooks:
//   URL:         https://www.atinuda.africa/api/checkout/webhook
//   Secret hash: the value of FLW_SECRET_HASH
//   Enable:      "Receive webhook response in JSON format" and charge.completed events
import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { fulfilOrder } from '@/lib/atinuda7Fulfil';

type FlwWebhook = {
  event?: string;
  data?: { id?: number | string; tx_ref?: string; status?: string };
};

function hashMatches(received: string | string[] | undefined, expected: string) {
  if (typeof received !== 'string') return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const secretHash = process.env.FLW_SECRET_HASH;
  if (!secretHash) {
    console.error('checkout/webhook: FLW_SECRET_HASH is not set');
    return res.status(500).json({ ok: false });
  }
  if (!hashMatches(req.headers['verif-hash'], secretHash)) return res.status(401).json({ ok: false });

  const { event, data } = (req.body ?? {}) as FlwWebhook;
  const txRef = data?.tx_ref;
  const transactionId = data?.id;

  // The same Flutterwave account serves older flows; only handle Atinuda 7.0 orders.
  if (event !== 'charge.completed' || !txRef?.startsWith('ATN7-') || transactionId == null) {
    return res.status(200).json({ ok: true, ignored: true });
  }
  if (data?.status !== 'successful') return res.status(200).json({ ok: true, ignored: true });

  let result: Awaited<ReturnType<typeof fulfilOrder>>;
  try {
    result = await fulfilOrder(txRef, transactionId);
  } catch (err) {
    console.error('checkout/webhook: fulfilment error', txRef, err);
    return res.status(500).json({ ok: false });
  }
  if (!result.ok) {
    console.warn('checkout/webhook: not fulfilled', txRef, result.message);
    // A non-200 makes Flutterwave retry; only ask for that when retrying could help.
    return res.status(result.retry ? 500 : 200).json({ ok: false });
  }
  return res.status(200).json({ ok: true });
}
