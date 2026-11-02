'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { EVENT_LABEL, EVENT_WHEN, EVENT_WHERE, formatDueDate, formatNaira } from '@/lib/atinuda7Checkout';
import { CSS, PaymentSchedule, type ScheduleRow } from '../checkout/CheckoutClient';

// Private page behind the link emailed to pay-in-3 buyers.
type OrderState = {
  orderRef: string;
  productName: string;
  total: number;
  status: 'pending' | 'part_paid' | 'paid' | 'review' | 'cancelled';
  instalments: ScheduleRow[];
};

const INK = '#1B1E1C';
const COPPER = '#b5622a';
const saol = { fontFamily: 'SaolDisplay, Georgia, serif' };

export default function PayClient() {
  const params = useSearchParams();
  const orderId = params?.get('order') ?? '';
  const token = params?.get('t') ?? '';
  const [order, setOrder] = useState<OrderState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const paidRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkout/instalment?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`);
      const json = (await res.json()) as OrderState & { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || 'This payment link is not valid.');
      setOrder(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not load your order.');
    } finally {
      setLoaded(true);
    }
  }, [orderId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const next = order?.instalments.find((i) => i.status !== 'paid') ?? null;

  async function confirm(txRef: string, transactionId: string | number) {
    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txRef, transactionId }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || 'We could not confirm your payment.');
      await load();
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'We could not confirm your payment.'} If you were charged, quote reference ${txRef} to hello@atinuda.africa.`);
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    setError(null);
    if (typeof window.FlutterwaveCheckout !== 'function') {
      setError('The payment window is still loading. Try again in a moment.');
      return;
    }
    setBusy(true);
    let start: { txRef: string; amount: number; currency: string; customer: Record<string, string> };
    try {
      const res = await fetch('/api/checkout/instalment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderId, t: token }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'We could not start your payment.');
      start = json;
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : 'We could not start your payment.');
      return;
    }

    paidRef.current = false;
    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: start.txRef,
      amount: start.amount,
      currency: start.currency,
      payment_options: 'card,banktransfer,ussd',
      customer: start.customer,
      customizations: {
        title: EVENT_LABEL,
        description: `${order?.productName} · instalment ${next?.n} of 3`,
        logo: `${window.location.origin}/icon.png`,
      },
      callback: (resp: { transaction_id?: string | number }) => {
        if (paidRef.current || resp?.transaction_id == null) return;
        paidRef.current = true;
        confirm(start.txRef, resp.transaction_id);
      },
      onclose: () => {
        if (!paidRef.current) setBusy(false);
      },
    });
  }

  const eyebrow = order?.status === 'paid' ? 'Paid in full' : order?.status === 'cancelled' ? 'Booking cancelled' : 'Your instalments';
  const heading = order?.status === 'paid' ? 'You are confirmed' : order?.status === 'cancelled' ? 'This booking was cancelled' : next ? `${formatNaira(next.amount)} due ${formatDueDate(next.dueAt)}` : '';

  return (
    <div id="nohero" className="co-page">
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="afterInteractive" />
      <div className="co-wrap co-done">
        {!order && loaded && (
          <>
            <p className="co-caps" style={{ color: COPPER }}>Payment link</p>
            <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A615C', marginTop: '20px', maxWidth: '560px' }} role="alert">
              {error} If you need help, write to <a href="mailto:hello@atinuda.africa" style={{ color: INK }}>hello@atinuda.africa</a>.
            </p>
          </>
        )}
        {order && (
          <>
            <p className="co-caps" style={{ color: COPPER }}>{eyebrow}</p>
            <h1 style={{ ...saol, fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', lineHeight: 1, letterSpacing: '-0.025em', color: INK, margin: '24px 0 20px', maxWidth: '900px' }}>
              {heading}
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A615C', maxWidth: '560px' }}>
              {order.status === 'paid'
                ? `Your ${order.productName} pass for ${EVENT_LABEL} has been sent to your email. ${EVENT_WHEN}, ${EVENT_WHERE}.`
                : order.status === 'cancelled'
                  ? `To talk this through, write to hello@atinuda.africa and quote ${order.orderRef}.`
                  : `${order.productName} pass, ${EVENT_LABEL}, ${EVENT_WHEN}, ${EVENT_WHERE}. Your pass is issued after the final payment clears.`}
            </p>
            <div style={{ maxWidth: '480px', marginTop: '32px' }}><PaymentSchedule rows={order.instalments} /></div>
            {order.status === 'part_paid' && next && (
              <button type="button" className="co-pay" style={{ maxWidth: '480px', marginTop: '28px' }} onClick={pay} disabled={busy}>
                {busy ? 'Complete payment in the window' : `Pay ${formatNaira(next.amount)}`}
              </button>
            )}
            {error && <p className="co-error" style={{ maxWidth: '480px' }} role="alert">{error}</p>}
            <p style={{ fontSize: '13px', color: '#8D948E', marginTop: '24px' }}>Order reference {order.orderRef}</p>
          </>
        )}
      </div>
      <style>{CSS}</style>
    </div>
  );
}
