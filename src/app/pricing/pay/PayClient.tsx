'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import {
  BANK_ACCOUNTS,
  EVENT_LABEL,
  EVENT_WHEN,
  EVENT_WHERE,
  formatDueDate,
  formatMoney,
  formatNaira,
  type TransferCurrency,
} from '@/lib/atinuda7Checkout';
import { CSS, CopyRow, PaymentSchedule, ReceiptField, prepareReceipt, uploadReceipt, type ScheduleRow } from '../checkout/CheckoutClient';

// Private page for an order: bank details for transfer buyers, and the link emailed to pay-in-3 buyers.
type OrderState = {
  orderRef: string;
  productName: string;
  total: number;
  status: 'pending' | 'part_paid' | 'paid' | 'review' | 'cancelled' | 'lapsed';
  instalments: ScheduleRow[];
  method: 'transfer' | 'flutterwave';
  buyerEmail: string;
  tickets: { ticketNumber: string; ticketType: string; name: string }[];
  testOnly: boolean;
  holdUntil: string | null;
  transfer: {
    currency: TransferCurrency;
    amounts: number[];
    due: { n: number | null; amount: number; declared: boolean } | null;
  } | null;
};

const INK = '#1B1E1C';
const COPPER = '#b5622a';
const saol = { fontFamily: 'SaolDisplay, Georgia, serif' };

const passLabel = (type: string) => (/pass|access|gala/i.test(type) ? type : `${type} pass`);

// On-screen twin of src/lib/invitationPdf.ts, which draws the download.
function Invitation({ order, downloadUrl }: { order: OrderState; downloadUrl: string }) {
  const many = order.tickets.length > 1;
  return (
    <>
    <div className="co-invite-scene" aria-hidden="true">
      <Image src="/assets/images/summit/new-images/invitation-backdrop.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover', objectPosition: 'center top' }} />
    </div>
    <div className="co-invite-page">
      <p className="co-invite-intro">You are confirmed. We email your pass details to {order.buyerEmail}.</p>
      <div className="co-invite-list">
        {order.tickets.map((t) => (
          <article className="co-invite" key={t.ticketNumber} aria-label={`Invitation for ${t.name || 'your guest'}`}>
            <div className="co-invite-arch" aria-hidden="true" />
            <div className="co-invite-body">
              {/* eslint-disable-next-line @next/next/no-img-element -- a small fixed mark inside a scaling card */}
              <img className="co-invite-glyph" src="/assets/images/atinuda-glyph.png" alt="" />
              <p className="co-invite-brand">ATINUDA</p>
              <p className="co-invite-small">is pleased to invite</p>
              <p className="co-invite-name">{t.name || 'Honoured Guest'}</p>
              <p className="co-invite-small">to</p>
              <p className="co-invite-event">{EVENT_LABEL}</p>
              <p className="co-invite-strap">Sub-Saharan Africa’s definitive summit for the experiential economy</p>
              <p className="co-invite-when">{EVENT_WHEN}<br />{EVENT_WHERE}</p>
              <span className="co-invite-rule" aria-hidden="true" />
              <p className="co-invite-pass">{passLabel(t.ticketType)}</p>
              <p className="co-invite-number">{t.ticketNumber}</p>
              {order.testOnly && <p className="co-invite-test">Test only. Not valid for entry.</p>}
            </div>
          </article>
        ))}
      </div>
      <a className="co-pay co-invite-download" href={downloadUrl}>Download {many ? 'invitations' : 'invitation'} (PDF)</a>
      {order.tickets.some((t) => !t.name) && (
        <p className="co-invite-note">To name a guest, reply to your confirmation email with their name and email.</p>
      )}
    </div>
    </>
  );
}

// What a buyer sees once their receipt is in: where things stand, not how to pay again.
function TransferNoted({ order }: { order: OrderState }) {
  const transfer = order.transfer!;
  const due = transfer.due!;
  const account = BANK_ACCOUNTS[transfer.currency];
  const money = (n: number) => formatMoney(n, transfer.currency);
  const instalments = order.instalments.length;
  const steps = [
    { label: 'Order placed', state: 'done' },
    { label: 'Receipt received', state: 'done' },
    { label: 'Team confirms your transfer', state: 'now' },
    { label: due.n && due.n < instalments ? 'Your next instalment' : 'Your pass arrives by email', state: 'next' },
  ];

  return (
    <div className="co-status">
      <h1 className="co-status-title" style={saol}>We have your receipt</h1>
      <p className="co-status-lede">
        The team is checking for your {money(due.amount)} transfer. We will email <strong>{order.buyerEmail}</strong> as soon as it is confirmed.
      </p>

      <ol className="co-track" aria-label="Order progress">
        {steps.map((s) => (
          <li key={s.label} className={`co-track-${s.state}`} aria-current={s.state === 'now' ? 'step' : undefined}>
            <span className="co-track-dot" aria-hidden="true">{s.state === 'done' ? '✓' : ''}</span>
            <span>{s.label}</span>
          </li>
        ))}
      </ol>

      <dl className="co-bank co-status-details">
        <div><dt>Pass</dt><dd>{order.productName}{due.n ? `, instalment ${due.n} of ${instalments}` : ''}</dd><span /></div>
        <div><dt>Amount</dt><dd>{money(due.amount)}</dd><span /></div>
        <div><dt>Sent to</dt><dd>{account.bank}</dd><span /></div>
        {order.status === 'pending' && order.holdUntil && (
          <div><dt>Price held until</dt><dd>{formatDueDate(order.holdUntil)}</dd><span /></div>
        )}
        <CopyRow label="Reference" value={order.orderRef} />
      </dl>

      {instalments > 0 && (
        <div className="co-status-schedule">
          <PaymentSchedule rows={order.instalments} format={(_, n) => money(transfer.amounts[n - 1])} />
        </div>
      )}

      <p className="co-status-foot">
        We have emailed you a private link to this page. Questions? Write to <a href="mailto:hello@atinuda.africa">hello@atinuda.africa</a> and quote your reference.
      </p>
    </div>
  );
}

function TransferView({ order, onDeclare, busy, error, downloadUrl }: { order: OrderState; onDeclare: (receipt: File) => void; busy: boolean; error: string | null; downloadUrl: string }) {
  const [asking, setAsking] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const { transfer } = order;
  if (!transfer) return null;
  const account = BANK_ACCOUNTS[transfer.currency];
  const money = (n: number) => formatMoney(n, transfer.currency);
  const paid = order.status === 'paid';
  const lapsed = order.status === 'lapsed';
  const cancelled = order.status === 'cancelled';
  const due = transfer.due;
  const firstPayment = order.status === 'pending';

  if (paid && order.tickets.length > 0) return <Invitation order={order} downloadUrl={downloadUrl} />;
  if (due?.declared && !paid && !lapsed && !cancelled) return <TransferNoted order={order} />;

  const eyebrow = paid ? 'Payment confirmed' : lapsed ? 'Hold ended' : cancelled ? 'Booking cancelled' : 'Pay by bank transfer';
  const heading = paid ? 'You are confirmed'
    : lapsed ? 'The hold on this order has ended'
    : cancelled ? 'This booking was cancelled'
    : due ? `Transfer ${money(due.amount)}` : '';

  return (
    <>
      <p className="co-caps" style={{ color: COPPER }}>{eyebrow}</p>
      <h1 style={{ ...saol, fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', lineHeight: 1, letterSpacing: '-0.025em', color: INK, margin: '24px 0 20px', maxWidth: '900px' }}>
        {heading}
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A615C', maxWidth: '560px' }}>
        {paid && `Your ${passLabel(order.productName)} for ${EVENT_LABEL} has been sent to your email. ${EVENT_WHEN}, ${EVENT_WHERE}.`}
        {lapsed && `If you have already paid, write to hello@atinuda.africa with your receipt and quote ${order.orderRef}.`}
        {cancelled && `To talk this through, write to hello@atinuda.africa and quote ${order.orderRef}.`}
        {!paid && !lapsed && !cancelled && due && `${order.productName} pass, ${EVENT_LABEL}. Send the exact amount and put this reference in your transfer narration, so we can match it to your order.`}
      </p>

      {due && !lapsed && (
        <dl className="co-bank">
          <CopyRow label="Account number" value={account.accountNumber} />
          <div><dt>Bank</dt><dd>{account.bank}</dd><span /></div>
          <div><dt>Account name</dt><dd>{account.accountName}</dd><span /></div>
          <div><dt>Amount</dt><dd>{money(due.amount)}</dd><span /></div>
          <CopyRow label="Reference" value={order.orderRef} />
        </dl>
      )}

      {firstPayment && order.holdUntil && (
        <p style={{ fontSize: '14px', color: '#5A615C', marginTop: '16px', maxWidth: '560px' }}>
          Your order and price are held until {formatDueDate(order.holdUntil)}.
        </p>
      )}

      {due && !lapsed && (
        <>
          <p className="co-shot" role="note">Take a screenshot of the transfer. You will need it to get your ticket.</p>
          {asking && <ReceiptField file={receipt} onChange={setReceipt} />}
          <button
            type="button"
            className="co-pay"
            style={{ maxWidth: '560px', marginTop: '20px' }}
            onClick={() => (asking && receipt ? onDeclare(receipt) : setAsking(true))}
            disabled={busy || (asking && !receipt)}
          >
            {busy ? 'Sending your receipt…' : !asking ? "I've made the transfer" : receipt ? 'Submit receipt' : 'Attach your receipt'}
          </button>
        </>
      )}
      {error && <p className="co-error" style={{ maxWidth: '560px' }} role="alert">{error}</p>}

      {order.instalments.length > 0 && (
        <div style={{ maxWidth: '560px', marginTop: '32px' }}>
          <PaymentSchedule rows={order.instalments} format={(_, n) => money(transfer.amounts[n - 1])} />
        </div>
      )}
      <p style={{ fontSize: '13px', color: '#5A615C', marginTop: '24px', maxWidth: '560px' }}>
        Save the link to this page to come back to your order. Order reference {order.orderRef}
      </p>
    </>
  );
}

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

  async function declare(receipt: File) {
    setError(null);
    setBusy(true);
    try {
      await uploadReceipt(orderId, token, await prepareReceipt(receipt));
      const res = await fetch('/api/checkout/instalment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderId, t: token, action: 'declare' }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || 'We could not record that. Please try again.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not record that. Please try again.');
    } finally {
      setBusy(false);
    }
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
        {order?.method === 'transfer' && <TransferView order={order} onDeclare={declare} busy={busy} error={error} downloadUrl={`/api/checkout/invitation?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`} />}
        {order && order.method !== 'transfer' && order.status === 'paid' && order.tickets.length > 0 && (
          <Invitation order={order} downloadUrl={`/api/checkout/invitation?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`} />
        )}
        {order && order.method !== 'transfer' && order.instalments.length === 0 && order.status !== 'paid' && (
          <>
            <p className="co-caps" style={{ color: COPPER }}>Your order</p>
            <h1 style={{ ...saol, fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', lineHeight: 1, letterSpacing: '-0.025em', color: INK, margin: '24px 0 20px', maxWidth: '900px' }}>
              Payment not confirmed yet
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A615C', maxWidth: '560px' }}>
              {`If you were charged, write to hello@atinuda.africa and quote ${order.orderRef}. We will confirm your ${order.productName} pass by email.`}
            </p>
          </>
        )}
        {order && order.method !== 'transfer' && order.instalments.length > 0 && !(order.status === 'paid' && order.tickets.length > 0) && (
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
