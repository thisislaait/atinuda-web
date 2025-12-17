"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useCallback, Suspense } from 'react';
import { getAuth } from 'firebase/auth';

type Currency = 'NGN' | 'USD';
type FlutterwaveResponse = { status?: string; transaction_id?: string | number };
type FlutterwaveCheckoutFn = (opts: Record<string, unknown>) => void;

const EVENT_SLUG = process.env.NEXT_PUBLIC_EVENT_SLUG || 'martitus-retreat-2026';
const PAY_API = process.env.NEXT_PUBLIC_PAY_API_URL || "/api/pay-verify";
const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

function useFlutterwaveScript() {
  useEffect(() => {
    if (document.getElementById('flw-script')) return;
    const s = document.createElement('script');
    s.id = 'flw-script';
    s.src = 'https://checkout.flutterwave.com/v3.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

function FlutterwavePayPageInner() {
  useFlutterwaveScript();
  const search = useSearchParams();
  const router = useRouter();

  // Parse incoming payload once
  const payload = useMemo(() => {
    const params = search;
    const productKey = (params?.get('productKey') || '').trim().toLowerCase();
    const title = params?.get('title') || 'Ticket';
    const currency = ((params?.get('currency') || 'NGN').toUpperCase() as Currency) || 'NGN';
    const amount = Number(params?.get('amount') || '0');
    const quantity = Math.max(1, Number(params?.get('quantity') || '1'));
    return { productKey, title, currency, amount, quantity };
  }, [search]);

  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Generate txRef once per page load
  const txRef = useRef(`atn-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`).current;

  const handlePay = useCallback(async () => {
    const { productKey, amount, currency, quantity, title } = payload;

    if (!productKey || !amount || amount <= 0) {
      setError('Invalid checkout payload. Please restart.');
      return;
    }

    const fw = (window as unknown as { FlutterwaveCheckout?: FlutterwaveCheckoutFn }).FlutterwaveCheckout;
    if (!fw) {
      setError('Payment module not loaded yet.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in first.');
      return;
    }

    const idToken = await user.getIdToken();
    const customerEmail = user.email || 'guest@atinuda.africa';
    const customerName = user.displayName || customerEmail.split('@')[0];

    fw({
      public_key: FLW_PUBLIC_KEY.trim(),
      tx_ref: txRef,
      amount,
      currency,
      customer: { email: customerEmail, name: customerName },
      customizations: {
        title: 'Atinuda',
        description: `${title} • ${quantity} seat(s)`,
        logo: '/icon.png',
      },
      callback: async (resp: FlutterwaveResponse) => {
        if (resp.status !== 'successful') return;
        setVerifying(true);
        try {
          const res = await fetch(PAY_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
            body: JSON.stringify({
              txRef,
              transactionId: resp.transaction_id,
              eventSlug: EVENT_SLUG,
              productKey,
              quantity,
              currency,
            }),
          });
          const json = await res.json();
          if (!res.ok || !json?.ok) throw new Error(json?.message || 'Verification failed');
          alert('Payment verified and ticket issued.');
          router.push('/tickets/mine');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Verification failed';
          setError(msg);
        } finally {
          setVerifying(false);
        }
      },
      onclose: () => {},
    });
  }, [payload, router, txRef]);

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 16 }}>
      <h1>Pay with Flutterwave</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!error && (
        <>
          <p>{payload.title}</p>
          <p>
            {payload.currency} {payload.amount.toLocaleString()} ({payload.quantity} seat
            {payload.quantity > 1 ? 's' : ''})
          </p>
          <div style={{ marginTop: 16 }}>
            <button onClick={handlePay} disabled={verifying || payload.amount <= 0}>
              {verifying ? 'Verifying…' : 'Pay with Flutterwave'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function FlutterwavePayPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 480, margin: '40px auto', padding: 16 }}>Loading…</div>}>
      <FlutterwavePayPageInner />
    </Suspense>
  );
}
