// src/pages/api/pay-init.ts
import http, { IncomingMessage, ServerResponse } from 'http';

type InitBody = {
  txRef?: string;
  amount?: number;
  currency?: 'NGN' | 'USD';
  customer?: { email?: string; name?: string };
  title?: string;
  description?: string;
  redirectUrl?: string;
};

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

async function parseJson(req: IncomingMessage): Promise<InitBody> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(Buffer.from(c));
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw) as InitBody;
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method !== 'POST') {
      res.writeHead(405).end(JSON.stringify({ ok: false }));
      return;
    }
    if (!FLW_SECRET_KEY) {
      res.writeHead(500).end(JSON.stringify({ ok: false, message: 'Missing FLW_SECRET_KEY' }));
      return;
    }

    const body = await parseJson(req);
    const { txRef, amount, currency, customer, title, description, redirectUrl } = body;

    if (!txRef || !amount || !currency || !customer?.email) {
      res.writeHead(400).end(JSON.stringify({ ok: false, message: 'Missing required fields' }));
      return;
    }

    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: redirectUrl || 'https://www.atinuda.africa/pay-redirect',
        customer,
        customizations: {
          title: title || 'Atinuda Ticket',
          description: description || 'Atinuda payment',
        },
      }),
    });

    const json = (await resp.json()) as { status?: string; message?: string; data?: { link?: string } };
    const link = json?.data?.link;
    if (!resp.ok || !link) {
      res.writeHead(400).end(JSON.stringify({ ok: false, message: json?.message || 'Init failed' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, link }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.writeHead(500).end(JSON.stringify({ ok: false, message }));
  }
}

export default async function nextHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}

if (require.main === module) {
  const port = process.env.PORT || 8080;
  http.createServer(handler).listen(port);
}
