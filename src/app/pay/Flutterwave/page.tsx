'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Currency = 'NGN' | 'USD';
type TicketProduct = { id: string; title?: string; description?: string; price: number; currency: Currency; key: string };

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

export default function FlutterwaveCheckoutPage() {
  useFlutterwaveScript();

  const [product, setProduct] = useState<TicketProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Example: load one ticket product (adjust as needed)
  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'events', EVENT_SLUG, 'ticketProducts', 'main-ngn'); // change id if needed
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error('Ticket not found');
        const data = snap.data() as any;
        const currency = (data.currency as string)?.toUpperCase() as Currency;
        const price = typeof data.price === 'number' ? data.price : Number(data.price);
        if (!['NGN', 'USD'].includes(currency) || !Number.isFinite(price)) {
          throw new Error('Invalid ticket data');
        }
        setProduct({ id: snap.id, key: snap.id, title: data.title ?? snap.id, description: data.description, price, currency });
      } catch (e: any) {
        setError(e?.message || 'Failed to load ticket');
      }
    };
    load();
  }, []);

  const amount = useMemo(() => (product ? product.price * Math.max(1, quantity) : 0), [product, quantity]);

  const handlePay = useCallback(async () => {
    if (!product || !(window as any).FlutterwaveCheckout) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in first.');
      return;
    }
    const idToken = await user.getIdToken();
    const txRef = `atn-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const customerEmail = user.email || 'guest@atinuda.africa';
    const customerName = user.displayName || customerEmail.split('@')[0];

    (window as any).FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount,
      currency: product.currency,
      customer: { email: customerEmail, name: customerName },
      customizations: { title: 'Atinuda', description: product.title, logo: '/icon.png' },
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
              productKey: product.key,
              quantity: Math.max(1, quantity),
              currency: product.currency,
            }),
          });
          const json = await res.json();
          if (!res.ok || !json?.ok) throw new Error(json?.message || 'Verification failed');
          alert('Payment verified and ticket issued.');
        } catch (err: any) {
          setError(err?.message || 'Verification failed');
        } finally {
          setVerifying(false);
        }
      },
      onclose: () => {},
    });
  }, [amount, product, quantity]);

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 16 }}>
      <h1>Pay with Flutterwave</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!product && !error && <div>Loading ticket…</div>}
      {product && (
        <>
          <p>{product.title}</p>
          <p>{product.description}</p>
          <p>
            {product.currency} {amount.toLocaleString()}
          </p>
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span style={{ margin: '0 8px' }}>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          <div style={{ marginTop: 16 }}>
            <button onClick={handlePay} disabled={verifying || amount <= 0}>
              {verifying ? 'Verifying…' : 'Pay with Flutterwave'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
