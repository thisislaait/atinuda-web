'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import {
  EVENT_LABEL,
  EVENT_WHEN,
  EVENT_WHERE,
  GROUP_TIERS,
  MAX_QUANTITY,
  PRODUCTS,
  SUPPORT_PASS,
  findProduct,
  formatNaira,
  isEarlyBird,
  quote,
  unitPrice,
  type ProductId,
} from '@/lib/atinuda7Checkout';

declare global {
  interface Window {
    FlutterwaveCheckout?: (opts: Record<string, unknown>) => void;
  }
}

const INK = '#1B1E1C';
const BG = '#F4F5F3';
const COPPER = '#b5622a';

const saol = { fontFamily: 'SaolDisplay, Georgia, serif' };

type Step = 1 | 2 | 3;
type Stage = 'idle' | 'creating' | 'paying' | 'confirming' | 'done';
type Seat = { name: string; email: string };
type Ticket = { ticketNumber: string; ticketType: string; name: string; email: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSES = PRODUCTS.filter((p) => p.kind === 'pass');
const SINGLES = PRODUCTS.filter((p) => p.kind === 'single');

const clampQty = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(n) || 1));

export default function CheckoutClient() {
  const params = useSearchParams();
  const [productId, setProductId] = useState<ProductId>(
    () => findProduct(params?.get('pass'))?.id ?? 'zuri',
  );
  const [quantity, setQuantity] = useState(() => clampQty(Number(params?.get('qty') ?? 1)));
  const [supportPasses, setSupportPasses] = useState(0);
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '', company: '' });
  const [seatOneIsBuyer, setSeatOneIsBuyer] = useState(true);
  const [showSeats, setShowSeats] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orderRef, setOrderRef] = useState('');
  const paidRef = useRef(false);
  const [step, setStep] = useState<Step>(1);
  const cardRef = useRef<HTMLDivElement>(null);

  const product = findProduct(productId)!;
  const q = useMemo(() => quote({ productId, quantity, supportPasses }), [productId, quantity, supportPasses]);

  // Keep dependent fields valid as the order changes.
  useEffect(() => {
    if (!product.allowsSupportPass) setSupportPasses(0);
    else setSupportPasses((s) => Math.min(s, quantity));
  }, [product.allowsSupportPass, quantity]);

  useEffect(() => {
    setSeats((prev) => Array.from({ length: quantity }, (_, i) => prev[i] ?? { name: '', email: '' }));
  }, [quantity]);

  const fieldErrors = {
    name: !buyer.name.trim() ? 'Enter your full name' : '',
    email: !EMAIL_RE.test(buyer.email.trim()) ? 'Enter a valid email address' : '',
    phone: buyer.phone.replace(/\D/g, '').length < 7 ? 'Enter a phone number' : '',
  };
  const seatErrors = seats.map((s) => (s.email.trim() && !EMAIL_RE.test(s.email.trim()) ? 'Check this email' : ''));
  const hasErrors = Object.values(fieldErrors).some(Boolean) || seatErrors.some(Boolean);
  const busy = stage === 'creating' || stage === 'paying' || stage === 'confirming';

  const attendeesPayload = () =>
    seats.map((s, i) => (i === 0 && seatOneIsBuyer ? { name: buyer.name, email: buyer.email } : s));

  async function confirm(txRef: string, transactionId: string | number) {
    setStage('confirming');
    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txRef, transactionId }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; tickets?: Ticket[] };
      if (!res.ok || !json.ok) throw new Error(json.message || 'We could not confirm your payment.');
      setTickets(json.tickets ?? []);
      setStage('done');
      window.scrollTo({ top: 0 });
    } catch (err) {
      setStage('idle');
      setError(
        `${err instanceof Error ? err.message : 'We could not confirm your payment.'} If you were charged, quote reference ${txRef} to hello@atinuda.africa.`,
      );
    }
  }

  function goTo(n: Step) {
    setStep(n);
    // Bring the card back into view if the visitor has scrolled past its top.
    requestAnimationFrame(() => {
      const el = cardRef.current;
      if (el && el.getBoundingClientRect().top < 72) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const primaryAction = () => (step < 3 ? goTo((step + 1) as Step) : handlePay());

  async function handlePay() {
    setError(null);
    if (hasErrors) {
      setShowErrors(true);
      if (seatErrors.some(Boolean)) setShowSeats(true);
      goTo(3);
      return;
    }
    if (typeof window.FlutterwaveCheckout !== 'function') {
      setError('The payment window is still loading. Try again in a moment.');
      return;
    }

    setStage('creating');
    let txRef: string;
    let amount: number;
    try {
      const res = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, supportPasses, buyer, attendees: attendeesPayload() }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; txRef?: string; amount?: number };
      if (!res.ok || !json.ok || !json.txRef || !json.amount) throw new Error(json.message || 'We could not start your order.');
      txRef = json.txRef;
      amount = json.amount;
    } catch (err) {
      setStage('idle');
      setError(err instanceof Error ? err.message : 'We could not start your order.');
      return;
    }

    setOrderRef(txRef);
    setStage('paying');
    paidRef.current = false;
    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount,
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd',
      customer: { email: buyer.email.trim(), name: buyer.name.trim(), phone_number: buyer.phone.trim() },
      customizations: {
        title: EVENT_LABEL,
        description: `${product.name} × ${quantity}${supportPasses ? ` + ${supportPasses} Support Pass` : ''}`,
        logo: `${window.location.origin}/icon.png`,
      },
      callback: (resp: { transaction_id?: string | number }) => {
        if (paidRef.current || resp?.transaction_id == null) return;
        paidRef.current = true;
        confirm(txRef, resp.transaction_id);
      },
      onclose: () => {
        if (!paidRef.current) setStage('idle');
      },
    });
  }

  if (stage === 'done') {
    return <Confirmation tickets={tickets} email={buyer.email} orderRef={orderRef} />;
  }

  const payLabel =
    stage === 'creating' ? 'Opening secure payment…'
    : stage === 'paying' ? 'Complete payment in the window'
    : stage === 'confirming' ? 'Confirming payment…'
    : `Pay ${q ? formatNaira(q.total) : ''}`;
  const actionLabel = step < 3 ? 'Continue' : payLabel;

  const steps: { n: Step; title: string; value: string }[] = [
    { n: 1, title: 'Pass', value: product.name },
    { n: 2, title: 'How many', value: `${quantity} ${quantity === 1 ? 'pass' : 'passes'}${q?.groupPercent ? ` · ${q.groupPercent}% off` : ''}` },
    { n: 3, title: 'Details', value: buyer.name.trim() || 'Name, email, phone' },
  ];

  return (
    <div id="nohero" className="co-page">
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="afterInteractive" />

      <header className="co-wrap co-head">
        <Link href="/pricing" className="co-back">← All passes</Link>
        <p className="co-caps" style={{ color: '#8D948E', marginTop: '36px' }}>
          {EVENT_LABEL} &nbsp;·&nbsp; {EVENT_WHEN} &nbsp;·&nbsp; {EVENT_WHERE}
        </p>
        <h1 style={{ ...saol, fontSize: 'clamp(2.8rem, 6vw, 5.6rem)', lineHeight: 0.95, letterSpacing: '-0.025em', color: INK, marginTop: '20px' }}>
          Reserve your <em style={{ fontStyle: 'italic', fontWeight: 500 }}>passes</em>
        </h1>
      </header>

      <div className="co-wrap co-grid">
        <main className="co-main">
          <div ref={cardRef} className="co-card">
          <nav className="co-tabs" aria-label="Checkout steps">
            {steps.map((t) => (
              <button
                key={t.n}
                type="button"
                onClick={() => goTo(t.n)}
                aria-current={t.n === step ? 'step' : undefined}
                className={`co-tab${t.n === step ? ' is-active' : ''}${t.n < step ? ' is-done' : ''}`}
              >
                <span className="co-tab-n">{t.n < step ? '✓' : String(t.n).padStart(2, '0')}</span>
                <span className="co-tab-text">
                  <span className="co-tab-title">{t.title}</span>
                  <span className="co-tab-value">{t.value}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="co-card-body" key={step}>
          {/* ── 01 PASS ───────────────────────────── */}
          {step === 1 && (
          <section className="co-step">
            <StepHead n="01" title="Choose your pass" />
            <div role="radiogroup" aria-label="Pass" className="co-pass-list">
              {PASSES.map((p, i) => (
                <PassOption key={p.id} id={p.id} index={i} selected={p.id === productId} onSelect={setProductId} />
              ))}
            </div>
            <p className="co-caps" style={{ color: '#8D948E', margin: '40px 0 16px' }}>Or a single experience</p>
            <div role="radiogroup" aria-label="Single experience" className="co-single-list">
              {SINGLES.map((p) => (
                <PassOption key={p.id} id={p.id} selected={p.id === productId} onSelect={setProductId} compact />
              ))}
            </div>
          </section>
          )}

          {/* ── 02 GROUP ──────────────────────────── */}
          {step === 2 && (
          <section className="co-step">
            <StepHead n="02" title="How many passes?" />
            <p className="co-lede">
              Book five or more {product.kind === 'pass' ? 'passes' : 'places'} in one order for 10% off each; ten or more for 15% off. The rate applies automatically.
            </p>

            <div className="co-group">
              <div className="co-presets">
                {[
                  { n: 1, label: 'Individual', sub: 'One pass' },
                  { n: 5, label: 'Group of 5', sub: '10% off' },
                  { n: 10, label: 'Group of 10', sub: '15% off' },
                ].map((o) => {
                  const active = o.n === 1 ? quantity < 5 : o.n === 5 ? quantity >= 5 && quantity < 10 : quantity >= 10;
                  return (
                    <button key={o.n} type="button" className={`co-preset${active ? ' is-active' : ''}`} onClick={() => setQuantity(o.n)} aria-pressed={active}>
                      <span className="co-preset-label">{o.label}</span>
                      <span className="co-preset-sub">{o.sub}</span>
                    </button>
                  );
                })}
              </div>

              <div className="co-qty-row">
                <div className="co-stepper">
                  <button type="button" aria-label="Remove one" onClick={() => setQuantity((n) => clampQty(n - 1))} disabled={quantity <= 1}>−</button>
                  <input
                    aria-label="Number of passes"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => setQuantity(clampQty(Number(e.target.value.replace(/\D/g, ''))))}
                  />
                  <button type="button" aria-label="Add one" onClick={() => setQuantity((n) => clampQty(n + 1))} disabled={quantity >= MAX_QUANTITY}>+</button>
                </div>
                <GroupRail quantity={quantity} />
              </div>

              {product.allowsSupportPass && (
                <div className="co-support">
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: INK }}>Support Pass &nbsp;<span style={{ fontWeight: 400, color: '#5A615C' }}>{formatNaira(SUPPORT_PASS.price)}</span></p>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#5A615C', marginTop: '4px', maxWidth: '440px' }}>
                      For an accompanying PA, assistant or content creator. One per {product.name} pass. Not included in the group rate.
                    </p>
                  </div>
                  <div className="co-stepper co-stepper-sm">
                    <button type="button" aria-label="Remove a Support Pass" onClick={() => setSupportPasses((s) => Math.max(0, s - 1))} disabled={supportPasses <= 0}>−</button>
                    <output aria-label="Support Passes">{supportPasses}</output>
                    <button type="button" aria-label="Add a Support Pass" onClick={() => setSupportPasses((s) => Math.min(quantity, s + 1))} disabled={supportPasses >= quantity}>+</button>
                  </div>
                </div>
              )}

              {quantity >= MAX_QUANTITY && (
                <p style={{ fontSize: '13px', color: '#5A615C', marginTop: '16px' }}>
                  Booking more than {MAX_QUANTITY}? Write to <a href="mailto:hello@atinuda.africa" style={{ color: INK }}>hello@atinuda.africa</a> for coordinated group booking.
                </p>
              )}
            </div>
          </section>
          )}

          {/* ── 03 DETAILS ────────────────────────── */}
          {step === 3 && (
          <section className="co-step" id="details">
            <StepHead n="03" title="Your details" />
            <div className="co-fields">
              <Field label="Full name" value={buyer.name} autoComplete="name" error={showErrors ? fieldErrors.name : ''} onChange={(v) => setBuyer({ ...buyer, name: v })} />
              <Field label="Email" type="email" value={buyer.email} autoComplete="email" error={showErrors ? fieldErrors.email : ''} onChange={(v) => setBuyer({ ...buyer, email: v })} />
              <Field label="Phone" type="tel" value={buyer.phone} autoComplete="tel" error={showErrors ? fieldErrors.phone : ''} onChange={(v) => setBuyer({ ...buyer, phone: v })} />
              <Field label="Company (optional)" value={buyer.company} autoComplete="organization" onChange={(v) => setBuyer({ ...buyer, company: v })} />
            </div>

            <div className="co-attendees">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
                <p className="co-caps" style={{ color: '#8D948E' }}>{quantity === 1 ? 'Attendee' : `Attendees · ${quantity}`}</p>
                {quantity > 1 && <p style={{ fontSize: '13px', color: '#8D948E' }}>Optional now — you can assign names after payment.</p>}
              </div>

              <label className="co-check">
                <input type="checkbox" checked={seatOneIsBuyer} onChange={(e) => setSeatOneIsBuyer(e.target.checked)} />
                <span>{quantity === 1 ? 'I am attending' : 'I am one of the attendees'}</span>
              </label>

              {quantity > 1 && !showSeats && (
                <button type="button" className="co-addnames" onClick={() => setShowSeats(true)}>
                  + Add attendee names now
                </button>
              )}

              {seats.map((s, i) => {
                if (i === 0 && seatOneIsBuyer) return null;
                if (quantity > 1 && !showSeats) return null;
                return (
                  <div key={i} className="co-seat">
                    <span className="co-seat-n">{String(i + 1).padStart(2, '0')}</span>
                    <Field label="Name" value={s.name} onChange={(v) => setSeats((prev) => prev.map((x, j) => (j === i ? { ...x, name: v } : x)))} />
                    <Field label="Email" type="email" value={s.email} error={showErrors ? seatErrors[i] : ''} onChange={(v) => setSeats((prev) => prev.map((x, j) => (j === i ? { ...x, email: v } : x)))} />
                  </div>
                );
              })}
            </div>
          </section>
          )}
          </div>

          <div className={`co-card-foot${step === 1 ? ' is-first' : ''}`}>
            {step > 1 ? (
              <button type="button" className="co-backbtn" onClick={() => goTo((step - 1) as Step)}>← Back</button>
            ) : <span />}
            <button type="button" className="co-next" onClick={primaryAction} disabled={busy || !q}>{actionLabel}</button>
          </div>
          </div>
        </main>

        <aside className="co-aside" aria-label="Order summary">
          <Summary q={q} payLabel={actionLabel} busy={busy} onPay={primaryAction} onQuantity={setQuantity} error={error} />
        </aside>
      </div>

      {/* Mobile pay bar */}
      <div className="co-mobilebar">
        <div>
          <p style={{ fontSize: '12px', color: '#8D948E' }}>
            {quantity} × {product.name}{q?.groupPercent ? ` · ${q.groupPercent}% off` : ''}
          </p>
          <p style={{ ...saol, fontSize: '1.6rem', color: INK, lineHeight: 1.1 }}>{q ? formatNaira(q.total) : '—'}</p>
        </div>
        <button type="button" className="co-pay co-pay-sm" onClick={primaryAction} disabled={busy || !q}>
          {busy ? '…' : step < 3 ? 'Next' : 'Pay'}
        </button>
      </div>

      <style>{CSS}</style>
    </div>
  );
}

function StepHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="co-step-head">
      <span className="co-caps" style={{ color: COPPER }}>{n}</span>
      <h2 style={{ ...saol, fontSize: 'clamp(1.9rem, 2.8vw, 2.6rem)', color: INK, lineHeight: 1 }}>{title}</h2>
    </div>
  );
}

function PassOption({ id, index, selected, onSelect, compact }: { id: ProductId; index?: number; selected: boolean; onSelect: (id: ProductId) => void; compact?: boolean }) {
  const p = findProduct(id)!;
  const early = isEarlyBird(p);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id)}
      className={`co-pass${selected ? ' is-selected' : ''}${compact ? ' is-compact' : ''}`}
    >
      <span className="co-pass-top">
        {index !== undefined && <span className="co-caps co-pass-n">{String(index + 1).padStart(2, '0')}</span>}
        <span className="co-pass-name" style={saol}>{p.name}</span>
        <span className="co-pass-price">
          {early && <s className="co-pass-was">{formatNaira(p.price)}</s>}
          <span style={saol}>{formatNaira(unitPrice(p))}</span>
        </span>
      </span>
      {!compact && <span className="co-caps co-pass-tier">{p.tier}{early ? ` · ${p.earlyBird!.label}` : ''}</span>}
      <span className="co-pass-summary">{p.summary}</span>
      <span className="co-pass-radio" aria-hidden="true" />
    </button>
  );
}

function GroupRail({ quantity }: { quantity: number }) {
  const filled = Math.min(quantity, 10);
  const nextTier = [...GROUP_TIERS].reverse().find((t) => quantity < t.min);
  const message =
    quantity >= 10 ? 'Best group rate applied: 15% off every pass.'
    : quantity >= 5 ? `Group rate applied: 10% off. Add ${10 - quantity} more for 15%.`
    : `Add ${nextTier!.min - quantity} more for 10% off every pass.`;

  return (
    <div className="co-rail-wrap">
      <div className="co-rail" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`co-rail-seg${i < filled ? ' is-on' : ''}${i === 4 || i === 9 ? ' is-mark' : ''}`}>
            {(i === 4 || i === 9) && <em>{i === 4 ? '10%' : '15%'}</em>}
          </span>
        ))}
      </div>
      <p className={`co-rail-msg${quantity >= 5 ? ' is-win' : ''}`} aria-live="polite">{message}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', autoComplete, error }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; error?: string }) {
  return (
    <label className={`co-field${error ? ' has-error' : ''}`}>
      <span className="co-caps">{label}</span>
      <input type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      {error && <span className="co-field-error">{error}</span>}
    </label>
  );
}

function Summary({ q, payLabel, busy, onPay, onQuantity, error }: { q: ReturnType<typeof quote>; payLabel: string; busy: boolean; onPay: () => void; onQuantity: (n: number) => void; error: string | null }) {
  if (!q) return null;
  const nextTier = [...GROUP_TIERS].reverse().find((t) => q.quantity < t.min);
  const toNext = nextTier ? nextTier.min - q.quantity : 0;

  return (
    <div className="co-sum">
      <div className="co-sum-head">
        <p className="co-caps" style={{ color: INK, fontWeight: 600 }}>Order summary</p>
        <p style={{ fontSize: '12px', color: '#8D948E' }}>{EVENT_WHEN} · {EVENT_WHERE}</p>
      </div>

      <div className="co-sum-body">
        <div className="co-sum-item">
          <div>
            <p style={{ ...saol, fontSize: '1.9rem', color: INK, lineHeight: 1 }}>{q.product.name}</p>
            <p style={{ fontSize: '13px', color: '#8D948E', marginTop: '6px' }}>{q.product.tier}</p>
          </div>
          <span className="co-sum-qty">× {q.quantity}</span>
        </div>

        <dl className="co-lines">
          <div>
            <dt>
              {q.quantity} × {formatNaira(q.unit)}
              {q.earlyBird && <span className="co-tag">Early bird</span>}
            </dt>
            <dd>{formatNaira(q.subtotal)}</dd>
          </div>
          {q.groupPercent > 0 && (
            <div className="is-win">
              <dt>Group rate ({q.groupPercent}%)</dt>
              <dd>−{formatNaira(q.groupDiscount)}</dd>
            </div>
          )}
          {q.supportPasses > 0 && (
            <div>
              <dt>Support Pass × {q.supportPasses}</dt>
              <dd>{formatNaira(q.supportTotal)}</dd>
            </div>
          )}
        </dl>

        {toNext > 0 && toNext <= 2 && nextTier && (
          <button type="button" className="co-nudge" onClick={() => onQuantity(nextTier.min)}>
            Add {toNext} more {toNext === 1 ? 'pass' : 'passes'} for {nextTier.percent}% off
          </button>
        )}

        <div className="co-total">
          <span style={{ fontSize: '14px', fontWeight: 600, color: INK }}>Total</span>
          <span style={{ ...saol, fontSize: 'clamp(2rem, 2.6vw, 2.5rem)', color: INK, lineHeight: 1 }}>{formatNaira(q.total)}</span>
        </div>
        {q.groupDiscount > 0 && <p className="co-saved">You save {formatNaira(q.groupDiscount)}</p>}

        <button type="button" className="co-pay" onClick={onPay} disabled={busy}>{payLabel}</button>

        {error && <p className="co-error" role="alert">{error}</p>}

        <ul className="co-assure">
          <li>Secure payment by Flutterwave</li>
          <li>Card, bank transfer or USSD</li>
          <li>Passes sent by email once payment clears</li>
        </ul>
      </div>
    </div>
  );
}

function Confirmation({ tickets, email, orderRef }: { tickets: Ticket[]; email: string; orderRef: string }) {
  const unassigned = tickets.filter((t) => !t.name).length;
  return (
    <div id="nohero" className="co-page">
      <div className="co-wrap co-done">
        <p className="co-caps" style={{ color: COPPER }}>Payment confirmed</p>
        <h1 style={{ ...saol, fontSize: 'clamp(2.8rem, 6vw, 5.4rem)', lineHeight: 0.98, letterSpacing: '-0.025em', color: INK, margin: '24px 0 28px', maxWidth: '900px' }}>
          You are confirmed for <em style={{ fontStyle: 'italic', fontWeight: 500 }}>{EVENT_LABEL}</em>
        </h1>
        <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A615C', maxWidth: '560px' }}>
          {EVENT_WHEN}, {EVENT_WHERE}. A confirmation with your pass numbers has been sent to {email}.
          {unassigned > 0 && ` ${unassigned} ${unassigned === 1 ? 'pass is' : 'passes are'} not yet assigned — reply to that email with each attendee's name and email.`}
        </p>

        <div className="co-done-list">
          {tickets.map((t) => (
            <div key={t.ticketNumber} className="co-done-row">
              <span className="co-done-num">{t.ticketNumber}</span>
              <span style={{ fontSize: '15px', color: INK }}>{t.ticketType}</span>
              <span style={{ fontSize: '15px', color: t.name ? '#5A615C' : '#8D948E' }}>{t.name || 'To be assigned'}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#8D948E', marginTop: '24px' }}>Order reference {orderRef}</p>
        <Link href="/pricing" className="co-back" style={{ display: 'inline-block', marginTop: '40px' }}>← Back to passes</Link>
      </div>
      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
  .co-page { background: ${BG}; min-height: 100vh; color: ${INK}; font-family: "Hanken Grotesk", system-ui, sans-serif; padding-bottom: 120px; }
  .co-wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 48px); }
  .co-head { padding-top: 120px; padding-bottom: clamp(32px, 4vw, 48px); }
  .co-caps { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; }
  .co-back { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5A615C; text-decoration: none; }
  .co-back:hover { color: ${INK}; }

  .co-grid { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: clamp(40px, 5vw, 80px); align-items: start; }
  .co-aside { position: sticky; top: 96px; }
  .co-card {
    background: #FAFAF8; border: 1px solid #DBDFDB; border-radius: 6px; scroll-margin-top: 96px;
    box-shadow: 0 1px 2px rgba(15,15,15,0.04), 0 24px 48px -28px rgba(15,15,15,0.28);
  }
  .co-tabs { display: grid; grid-template-columns: repeat(3, 1fr); background: #ECEEED; border-bottom: 1px solid #DBDFDB; border-radius: 6px 6px 0 0; }
  .co-tab { position: relative; display: flex; gap: 14px; align-items: flex-start; text-align: left; padding: 18px 22px 20px; background: transparent; border: 0; cursor: pointer; min-width: 0; transition: background .2s ease; }
  .co-tab + .co-tab { border-left: 1px solid #DBDFDB; }
  .co-tab:first-child { border-top-left-radius: 6px; }
  .co-tab:last-child { border-top-right-radius: 6px; }
  .co-tab::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: transparent; transition: background .25s ease; }
  .co-tab:hover { background: #E4E7E4; }
  .co-tab.is-active { background: #FAFAF8; }
  .co-tab.is-active::after { background: ${COPPER}; }
  .co-tab-n { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; color: #8D948E; border: 1px solid #B7BBB7; }
  .co-tab.is-active .co-tab-n { background: ${INK}; border-color: ${INK}; color: ${BG}; }
  .co-tab.is-done .co-tab-n { background: #28503E; border-color: #28503E; color: ${BG}; font-size: 12px; }
  .co-tab-text { display: grid; gap: 3px; min-width: 0; }
  .co-tab-title { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #8D948E; }
  .co-tab.is-active .co-tab-title, .co-tab.is-done .co-tab-title { color: ${INK}; font-weight: 600; }
  .co-tab-value { font-size: 13px; color: #5A615C; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-card-body { padding: clamp(24px, 3.5vw, 44px); animation: co-in .35s ease both; }
  @keyframes co-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .co-card-foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px clamp(24px, 3.5vw, 44px); border-top: 1px solid #E4E7E4; }
  .co-backbtn { background: transparent; border: 0; padding: 8px 0; font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #5A615C; cursor: pointer; }
  .co-backbtn:hover { color: ${INK}; }
  .co-next {
    padding: 16px 32px; border: 0; border-radius: 2px; background: ${INK}; color: ${BG}; cursor: pointer;
    font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
    box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 10px 20px -10px rgba(15,15,15,0.6);
    transition: opacity .2s ease, transform .15s ease;
  }
  .co-next:hover:not(:disabled) { opacity: 0.88; }
  .co-next:active:not(:disabled) { transform: translateY(1px); }
  .co-next:disabled { opacity: 0.35; cursor: default; }
  .co-step-head { display: flex; align-items: baseline; gap: 20px; margin-bottom: 32px; }
  .co-lede { font-size: 15px; line-height: 1.7; color: #5A615C; max-width: 560px; margin: -12px 0 28px; }

  /* Pass options: raised tiles that settle into a dark, lifted state when chosen */
  .co-pass-list { display: grid; gap: 10px; }
  .co-single-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .co-pass {
    position: relative; display: grid; gap: 6px; width: 100%; text-align: left; cursor: pointer;
    padding: 22px 64px 22px 24px; border-radius: 6px; border: 1px solid #DBDFDB; background: #FEFEFD; color: ${INK};
    box-shadow: 0 1px 2px rgba(15,15,15,0.04), 0 6px 16px -10px rgba(15,15,15,0.18);
    transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease, color .25s ease;
  }
  .co-pass:hover { transform: translateY(-2px); box-shadow: 0 2px 4px rgba(15,15,15,0.05), 0 16px 32px -16px rgba(15,15,15,0.28); }
  .co-pass:focus-visible { outline: 2px solid ${COPPER}; outline-offset: 3px; }
  .co-pass.is-selected {
    border-color: ${INK}; transform: translateY(-2px);
    box-shadow: 0 0 0 1px ${INK}, 0 18px 36px -20px rgba(15,15,15,0.35);
  }
  .co-pass-top { display: flex; align-items: baseline; gap: 16px; }
  .co-pass-n { color: #8D948E; width: 24px; flex-shrink: 0; }
  .co-pass.is-selected .co-pass-n { color: ${INK}; }
  .co-pass-name { font-size: clamp(1.7rem, 2.4vw, 2.1rem); line-height: 1; flex: 1; }
  .co-pass-price { display: flex; align-items: baseline; gap: 10px; font-size: 1.25rem; white-space: nowrap; }
  .co-pass-was { font-size: 13px; color: #8D948E; font-family: "Hanken Grotesk", system-ui, sans-serif; }
  .co-pass-tier { color: #8D948E; padding-left: 40px; font-size: 10px; }
  .co-pass-summary { font-size: 14px; line-height: 1.6; color: #5A615C; padding-left: 40px; max-height: 0; opacity: 0; overflow: hidden; transition: max-height .3s ease, opacity .3s ease, margin .3s ease; }
  .co-pass.is-selected .co-pass-summary { max-height: 80px; opacity: 1; margin-top: 8px; }
  .co-pass-radio { position: absolute; right: 24px; top: 26px; width: 18px; height: 18px; border-radius: 50%; border: 1px solid #B7BBB7; }
  .co-pass.is-selected .co-pass-radio { border-color: ${INK}; box-shadow: inset 0 0 0 4px #FEFEFD, inset 0 0 0 9px ${INK}; }
  .co-pass.is-compact { padding: 18px 56px 18px 20px; }
  .co-pass.is-compact .co-pass-top { flex-direction: column; gap: 10px; }
  .co-pass.is-compact .co-pass-name { font-size: 1.4rem; }
  .co-pass.is-compact .co-pass-summary { padding-left: 0; }
  .co-pass.is-compact .co-pass-radio { top: 22px; right: 20px; }

  /* Group size */
  .co-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 4px; background: #ECEEED; border-radius: 6px; box-shadow: inset 0 1px 3px rgba(15,15,15,0.08); }
  .co-preset { display: grid; gap: 2px; padding: 14px 12px; border-radius: 4px; background: transparent; border: 0; cursor: pointer; text-align: center; transition: background .2s ease, box-shadow .2s ease; }
  .co-preset-label { font-size: 14px; font-weight: 600; color: #5A615C; }
  .co-preset-sub { font-size: 12px; color: #8D948E; }
  .co-preset.is-active { background: #FFFFFF; box-shadow: 0 1px 2px rgba(15,15,15,0.08), 0 4px 10px -4px rgba(15,15,15,0.18); }
  .co-preset.is-active .co-preset-label { color: ${INK}; }
  .co-preset.is-active .co-preset-sub { color: #28503E; }
  .co-qty-row { display: flex; align-items: center; gap: 28px; margin-top: 28px; flex-wrap: wrap; }
  .co-stepper { display: inline-flex; align-items: stretch; border: 1px solid #DBDFDB; border-radius: 6px; background: ${BG}; overflow: hidden; box-shadow: inset 0 1px 2px rgba(15,15,15,0.05); }
  .co-stepper button { width: 48px; font-size: 20px; color: ${INK}; background: transparent; border: 0; cursor: pointer; }
  .co-stepper button:hover:not(:disabled) { background: #ECEEED; }
  .co-stepper button:disabled { opacity: 0.35; cursor: default; }
  .co-stepper input, .co-stepper output { width: 64px; text-align: center; font-family: SaolDisplay, Georgia, serif; font-size: 1.9rem; padding: 8px 0; background: transparent; border: 0; border-left: 1px solid #DBDFDB; border-right: 1px solid #DBDFDB; color: ${INK}; outline: none; display: flex; align-items: center; justify-content: center; }
  .co-stepper-sm button { width: 40px; font-size: 18px; }
  .co-stepper-sm output { width: 48px; font-size: 1.4rem; }
  .co-rail-wrap { flex: 1; min-width: 240px; }
  .co-rail { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; padding-top: 18px; }
  .co-rail-seg { position: relative; height: 8px; border-radius: 2px; background: #E4E7E4; box-shadow: inset 0 1px 1px rgba(15,15,15,0.06); transition: background .3s ease; }
  .co-rail-seg.is-on { background: ${INK}; }
  .co-rail-seg.is-mark em { position: absolute; right: 0; top: -18px; font-style: normal; font-size: 11px; font-weight: 600; color: #8D948E; letter-spacing: 0.04em; }
  .co-rail-seg.is-mark.is-on em { color: #28503E; }
  .co-rail-msg { font-size: 13px; color: #5A615C; margin-top: 12px; }
  .co-rail-msg.is-win { color: #28503E; font-weight: 600; }
  .co-support { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-top: 28px; padding-top: 24px; border-top: 1px solid #E4E7E4; flex-wrap: wrap; }

  /* Details */
  .co-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 28px 32px; }
  .co-field { display: grid; gap: 8px; }
  .co-field .co-caps { color: #8D948E; font-size: 10px; }
  .co-field input { font: inherit; font-size: 16px; color: ${INK}; background: transparent; border: 0; border-bottom: 1px solid #DBDFDB; padding: 8px 0 10px; outline: none; border-radius: 0; transition: border-color .2s ease; }
  .co-field input:focus { border-bottom-color: ${INK}; }
  .co-field.has-error input { border-bottom-color: #8C3B2E; }
  .co-field-error { font-size: 12px; color: #8C3B2E; }
  .co-attendees { margin-top: 48px; display: grid; gap: 20px; }
  .co-check { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; color: ${INK}; cursor: pointer; }
  .co-check input { width: 18px; height: 18px; accent-color: ${INK}; }
  .co-seat { display: grid; grid-template-columns: 32px 1fr 1fr; gap: 24px; align-items: end; padding-bottom: 4px; }
  .co-seat-n { font-size: 11px; letter-spacing: 0.2em; color: #8D948E; padding-bottom: 14px; align-self: end; }
  .co-addnames { justify-self: start; background: transparent; border: 0; border-bottom: 1px solid ${INK}; padding: 0 0 4px; font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: ${INK}; cursor: pointer; }
  .co-addnames:hover { color: ${COPPER}; border-color: ${COPPER}; }

  /* Order summary */
  .co-sum {
    background: #FAFAF8; border: 1px solid #DBDFDB; border-radius: 6px;
    box-shadow: 0 1px 2px rgba(15,15,15,0.04), 0 24px 48px -28px rgba(15,15,15,0.28);
  }
  .co-sum-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 18px 24px; border-bottom: 1px solid #E4E7E4; }
  .co-sum-body { padding: 24px; }
  .co-sum-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #E4E7E4; }
  .co-sum-qty { font-size: 13px; font-weight: 600; color: ${INK}; padding: 5px 10px; border: 1px solid #DBDFDB; border-radius: 4px; background: ${BG}; font-variant-numeric: tabular-nums; }
  .co-lines { display: grid; gap: 12px; padding: 20px 0; }
  .co-lines > div { display: flex; justify-content: space-between; gap: 16px; font-size: 14px; color: #5A615C; }
  .co-lines dt { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .co-lines dd { color: ${INK}; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .co-lines .is-win, .co-lines .is-win dd { color: #28503E; }
  .co-tag { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #5A615C; padding: 2px 6px; border: 1px solid #DBDFDB; border-radius: 3px; }
  .co-nudge { display: block; width: 100%; margin-bottom: 20px; padding: 12px 14px; text-align: left; font-family: inherit; font-size: 13px; color: ${INK}; background: transparent; border: 1px dashed #B7BBB7; border-radius: 4px; cursor: pointer; transition: background .2s ease, border-color .2s ease; }
  .co-nudge::after { content: '  →'; }
  .co-nudge:hover { background: #ECEEED; border-color: ${INK}; }
  .co-total { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding-top: 20px; border-top: 1px solid #DBDFDB; }
  .co-saved { font-size: 13px; color: #28503E; text-align: right; margin-top: 6px; }
  .co-pay {
    display: block; width: 100%; margin-top: 24px; padding: 17px 20px; border: 0; border-radius: 2px; cursor: pointer;
    background: ${INK}; color: ${BG}; font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, 0 10px 20px -12px rgba(15,15,15,0.6);
    transition: opacity .2s ease, transform .15s ease;
  }
  .co-pay:hover:not(:disabled) { opacity: 0.88; }
  .co-pay:active:not(:disabled) { transform: translateY(1px); }
  .co-pay:disabled { opacity: 0.35; cursor: default; }
  .co-error { font-size: 13px; line-height: 1.6; color: #8C3B2E; margin-top: 14px; }
  .co-assure { list-style: none; display: grid; gap: 8px; margin: 20px 0 0; padding: 18px 0 0; border-top: 1px solid #E4E7E4; }
  .co-assure li { font-size: 12px; color: #5A615C; display: flex; gap: 10px; }
  .co-assure li::before { content: '✓'; color: #8D948E; }

  .co-mobilebar { display: none; }

  /* Confirmation */
  .co-done { padding-top: 140px; padding-bottom: 80px; }
  .co-done-list { margin-top: 48px; border-top: 1px solid #DBDFDB; max-width: 760px; }
  .co-done-row { display: grid; grid-template-columns: 200px 1fr 1fr; gap: 16px; padding: 16px 0; border-bottom: 1px solid #E4E7E4; align-items: baseline; }
  .co-done-num { font-family: ui-monospace, Menlo, monospace; font-size: 14px; letter-spacing: 0.04em; color: ${INK}; }

  @media (max-width: 1023px) {
    .co-grid { grid-template-columns: minmax(0, 1fr); }
    .co-aside { position: static; }
    .co-mobilebar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
      background: rgba(250,250,248,0.96); backdrop-filter: blur(8px); border-top: 1px solid #DBDFDB; box-shadow: 0 -12px 32px -16px rgba(15,15,15,0.25);
    }
    .co-next { display: none; }
    .co-card-foot.is-first { display: none; }
    .co-pay-sm { width: auto; margin-top: 0; padding: 14px 28px; }
  }
  @media (max-width: 640px) {
    .co-tab { flex-direction: column; gap: 8px; padding: 14px 12px 16px; }
    .co-tab-value { display: none; }
    .co-tab-title { font-size: 10px; letter-spacing: 0.16em; }
    .co-fields { grid-template-columns: 1fr; }
    .co-single-list { grid-template-columns: 1fr; }
    .co-seat { grid-template-columns: 1fr; gap: 16px; }
    .co-seat-n { padding-bottom: 0; }
    .co-pass { padding: 18px 52px 18px 18px; }
    .co-pass-radio { right: 18px; top: 22px; }
    .co-pass-tier, .co-pass-summary { padding-left: 0; }
    .co-pass-n { display: none; }
    .co-pass-top { flex-wrap: wrap; gap: 8px 16px; }
    .co-sum-body { padding: 20px; }
    .co-sum-head { padding: 16px 20px; }
    .co-done-row { grid-template-columns: 1fr; gap: 4px; }
  }
`;
