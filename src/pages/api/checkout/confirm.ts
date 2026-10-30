// pages/api/checkout/confirm.ts
// Called by the checkout page after the Flutterwave modal reports success.
// The webhook (/api/checkout/webhook) runs the same fulfilment if this call never arrives.
import type { NextApiRequest, NextApiResponse } from 'next';
import { fulfilOrder } from '@/lib/atinuda7Fulfil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  const { txRef, transactionId } = (req.body ?? {}) as { txRef?: unknown; transactionId?: unknown };
  if (typeof txRef !== 'string' || !txRef || (typeof transactionId !== 'string' && typeof transactionId !== 'number')) {
    return res.status(400).json({ ok: false, message: 'txRef and transactionId are required.' });
  }

  let result: Awaited<ReturnType<typeof fulfilOrder>>;
  try {
    result = await fulfilOrder(txRef, transactionId);
  } catch (err) {
    console.error('checkout/confirm: fulfilment error', txRef, err);
    return res.status(500).json({ ok: false, message: 'We could not confirm your payment yet.' });
  }
  if (!result.ok) return res.status(result.status).json({ ok: false, message: result.message });
  return res.status(200).json({ ok: true, tickets: result.tickets });
}
