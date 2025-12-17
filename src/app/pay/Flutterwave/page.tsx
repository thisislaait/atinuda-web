'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { getAuth } from 'firebase/auth';

const EVENT_SLUG = process.env.NEXT_PUBLIC_EVENT_SLUG || 'martitus-retreat-2026';
const PAY_API = process.env.NEXT_PUBLIC_PAY_API_URL || '';
const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '';

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

export default function FlutterwavePayPage() {
  useFlutterwaveScript();
  const router = useRouter();
  const search = useSearchParams();
if (!search) {
  return <div>Loading…</div>;
}


  // Incoming payload from the buy page
  const productKey = (search.get('productKey') || '').trim();      // e.g., main-ngn, main-usd, group-ngn, group-usd
  const title = search.get('title') || 'Ticket';
  const currency = (search.get('currency') || 'NGN').toUpperCase() as 'NGN' | 'USD';
  const amount = Number(search.get('amount') || '0');
  const quantity = Math.max(1, Number(search.get('quantity') || '1'));

  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const txRef = useMemo(
    () => `atn-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [productKey, amount, currency, quantity]
  );

  const handlePay = useCallback(async () => {
    if (!productKey || !amount || amount <= 0) {
      setError('Invalid checkout payload. Please restart.');
      return;
    }
    const fw = (window as any).FlutterwaveCheckout;
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
      public_key: FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount,
      currency,
      customer: { email: customerEmail, name: customerName },
      customizations: { title: 'Atinuda', description: `${title} • ${quantity} seat(s)`, logo: '/icon.png' },
      callback: async (resp: any) => {
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
        } catch (err: any) {
          setError(err?.message || 'Verification failed');
        } finally {
          setVerifying(false);
        }
      },
      onclose: () => {},
    });
  }, [productKey, amount, currency, quantity, txRef, router]);

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 16 }}>
      <h1>Pay with Flutterwave</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!error && (
        <>
          <p>{title}</p>
          <p>{currency} {amount.toLocaleString()} ({quantity} seat{quantity > 1 ? 's' : ''})</p>
          <button onClick={handlePay} disabled={verifying || amount <= 0}>
            {verifying ? 'Verifying…' : 'Pay with Flutterwave'}
          </button>
        </>
      )}
    </div>
  );
}

