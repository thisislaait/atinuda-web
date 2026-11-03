'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { formatNaira } from '@/lib/atinuda7Checkout';
import { addDays, lagosDay, type AttentionItem, type AwaitingTransfer, type Comparison, type Ledger, type PaymentRow } from '@/lib/staffLedger';
import EquityCurve, { type CurvePoint } from './EquityCurve';
import { CSS } from './styles';

type Sample = { ledger: Ledger; comparison: Comparison };
type Range = '7' | '30' | '90' | 'all';
type View = 'overview' | 'transfers' | 'payments' | 'attention';
type TypeFilter = 'all' | 'full' | 'instalments' | 'cancelled';

const RANGES: { id: Range; label: string }[] = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: 'all', label: 'All time' },
];

const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'full', label: 'Paid in full' },
  { id: 'instalments', label: 'Instalments' },
  { id: 'cancelled', label: 'Cancelled' },
];

const REFRESH_MS = 60_000;
const PAGE_SIZE = 20;

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });

const dayLabel = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const sum = (rows: PaymentRow[]) => rows.reduce((total, r) => total + r.amount, 0);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const rangeStart = (today: string, range: Range) => addDays(today, -(Number(range) - 1));

// One point per day, running total included, from the range's first day through today.
function curvePoints(rows: PaymentRow[], today: string, range: Range): CurvePoint[] {
  if (rows.length === 0) return [];
  const byDay = new Map<string, number>();
  for (const r of rows) byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.amount);
  const firstDay = [...byDay.keys()].sort()[0];
  const start = range === 'all' ? addDays(firstDay, -1) : rangeStart(today, range);

  let total = 0;
  for (const [day, amount] of byDay) if (day < start) total += amount;
  const points: CurvePoint[] = [];
  for (let day = start; day <= today; day = addDays(day, 1)) {
    const received = byDay.get(day) ?? 0;
    total += received;
    points.push({ day, received, total });
  }
  return points;
}

// Names come from buyers: a leading = + - @ would run as a formula in a spreadsheet.
const csvCell = (value: string | number) => {
  const text = String(value);
  const safe = typeof value === 'string' && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

function downloadCsv(rows: PaymentRow[]) {
  const header = ['Date', 'Time', 'Buyer', 'Email', 'Phone', 'Company', 'Pass', 'Quantity', 'Payment', 'Amount (NGN)', 'Paid as', 'Paid by', 'Confirmed by', 'Order reference', 'Flutterwave ID', 'Booking'];
  const lines = rows.map((r) =>
    [r.day, time(r.at), r.buyerName, r.buyerEmail, r.buyerPhone, r.company, r.pass, r.quantity, r.payment, r.amount, r.paidAs, r.channel, r.confirmedBy, r.orderRef, r.flwTransactionId, r.booking]
      .map(csvCell)
      .join(','),
  );
  const blob = new Blob([`﻿${[header.map(csvCell).join(','), ...lines].join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atinuda-payments-${lagosDay(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const paymentPill = (r: PaymentRow) => {
  if (r.booking === 'Cancelled') return <span className="sa-pill sa-pill-cancelled">Booking cancelled</span>;
  if (r.payment === 'Paid in full') return <span className="sa-pill sa-pill-paid">Paid in full</span>;
  return <span className="sa-pill sa-pill-part">{r.payment}</span>;
};

function SignIn({ notice }: { notice?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(notice ?? '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setMessage('That email and password did not match. If you have not set a password yet, use the link below.');
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.trim()) {
      setMessage('Enter your email first, then choose this link again.');
      return;
    }
    setBusy(true);
    // Same message either way, so this can't be used to test which addresses have accounts.
    await sendPasswordResetEmail(auth, email.trim()).catch(() => undefined);
    setBusy(false);
    setMessage('If that address has an account, a link to set your password is on its way.');
  };

  return (
    <main className="sa-signin-page">
      <style>{CSS}</style>
      <div className="sa-signin-wrap">
        <Image className="sa-signin-logo" src="/assets/images/whitelogo.png" alt="Atinuda" width={680} height={250} priority />
        <form className="sa-signin" onSubmit={submit}>
          <h1>Sign in to Atinuda staff</h1>
          <label className="sa-field">
            Email
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="sa-field">
            Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {message && <p role="status">{message}</p>}
          <button className="sa-cta" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <button className="sa-signin-link" type="button" onClick={reset} disabled={busy}>Set or reset password</button>
        </form>
      </div>
    </main>
  );
}

function PaymentDrawer({ row, onClose }: { row: PaymentRow; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const copy = async () => {
    await navigator.clipboard?.writeText(row.orderRef).catch(() => undefined);
    setCopied(true);
  };

  const fields: [string, string][] = [
    ['Buyer', row.buyerName],
    ['Email', row.buyerEmail],
    ['Phone', row.buyerPhone],
    ['Company', row.company || 'Not given'],
    ['Pass', row.quantity > 1 ? `${row.pass} × ${row.quantity}` : row.pass],
    ['Paid', dateTime(row.at)],
    ['Paid by', row.channel],
    ...(row.paidAs ? ([['Paid as', row.paidAs]] as [string, string][]) : []),
    ...(row.confirmedBy ? ([['Confirmed by', row.confirmedBy]] as [string, string][]) : []),
    ['Booking', row.booking],
    ['Reference', row.orderRef],
    ['Flutterwave ID', row.flwTransactionId || 'Not recorded'],
  ];

  return (
    <dialog
      ref={dialog}
      className="sa-drawer"
      data-lenis-prevent
      aria-label={`Payment from ${row.buyerName}`}
      onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
    >
      <div className="sa-drawer-head">
        <div>
          <div className="sa-drawer-figure">{formatNaira(row.amount)}</div>
          {paymentPill(row)}
        </div>
        <button className="sa-btn" onClick={() => dialog.current?.close()}>Close</button>
      </div>
      <dl className="sa-dl">
        {fields.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
        <div style={{ borderBottom: 0 }}>
          <dt />
          <dd><button className="sa-btn" onClick={copy}>{copied ? 'Reference copied' : 'Copy reference'}</button></dd>
        </div>
      </dl>
    </dialog>
  );
}

function PaymentsTable({ rows, onOpen }: { rows: PaymentRow[]; onOpen: (r: PaymentRow) => void }) {
  return (
    <table className="sa-table">
      <thead>
        <tr><th>Buyer</th><th>Pass</th><th>Payment</th><th>Date</th><th className="sa-num">Amount</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} onClick={() => onOpen(r)}>
            <td className="sa-td-buyer">
              <button className="sa-buyer" onClick={(e) => { e.stopPropagation(); onOpen(r); }}>{r.buyerName}</button>
              <span className="sa-subline">{r.buyerEmail}</span>
            </td>
            <td className="sa-td-pass">{r.pass}{r.quantity > 1 ? ` × ${r.quantity}` : ''}</td>
            <td className="sa-td-status">{paymentPill(r)}</td>
            <td className="sa-td-date sa-date">{dateTime(r.at)}</td>
            <td className="sa-num">{formatNaira(r.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FlagItem({ item }: { item: AttentionItem }) {
  return (
    <div className="sa-flag">
      <div className="sa-flag-head">
        <span className={`sa-pill sa-pill-${item.level}`}>{item.label}</span>
        <span className="sa-flag-amount">{formatNaira(item.amount)}</span>
      </div>
      <p className="sa-flag-name">{item.buyerName}, {item.pass}</p>
      <p className="sa-flag-note">{item.note}</p>
      <p className="sa-flag-contact">{item.buyerEmail}, {item.buyerPhone}</p>
    </div>
  );
}

function UnrecordedItem({ item }: { item: Comparison['unrecorded'][number] }) {
  return (
    <div className="sa-flag">
      <div className="sa-flag-head">
        <span className="sa-pill sa-pill-check">Not recorded</span>
        <span className="sa-flag-amount">{item.currency === 'NGN' ? formatNaira(item.amount) : `${item.currency} ${item.amount}`}</span>
      </div>
      <p className="sa-flag-name">{item.name || 'Name not given'}</p>
      <p className="sa-flag-note">Flutterwave shows this paid on {dateTime(item.at)}, but no order records it and no ticket has been issued.</p>
      <p className="sa-flag-contact">{item.email ? `${item.email}, ` : ''}{item.ref}</p>
    </div>
  );
}

const AWAITING_LABEL: Record<AwaitingTransfer['state'], { text: string; pill: string }> = {
  sent: { text: 'Buyer says sent', pill: 'sa-pill-paid' },
  overdue: { text: 'Overdue', pill: 'sa-pill-overdue' },
  not_marked: { text: 'Not marked as sent', pill: 'sa-pill-part' },
  lapsed: { text: 'Hold ended', pill: 'sa-pill-due' },
};

function TransferItem({ item, onConfirm }: { item: AwaitingTransfer; onConfirm: (item: AwaitingTransfer) => Promise<string | null> }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const label = AWAITING_LABEL[item.state];

  const confirm = async () => {
    setBusy(true);
    setProblem('');
    const failure = await onConfirm(item);
    if (failure) {
      setProblem(failure);
      setBusy(false);
    }
  };

  return (
    <div className="sa-transfer">
      <div className="sa-flag-head">
        <span className={`sa-pill ${label.pill}`}>{label.text}</span>
        <span className="sa-flag-amount">{item.send}</span>
      </div>
      <p className="sa-flag-name">{item.buyerName}, {item.pass}</p>
      <p className="sa-flag-note">
        {item.payment}. Look in {item.bank} for reference <b>{item.orderRef}</b>
        {item.send !== formatNaira(item.naira) ? `, counted as ${formatNaira(item.naira)}` : ''}. {item.note}
      </p>
      <p className="sa-flag-contact">{item.buyerEmail}, {item.buyerPhone}</p>
      <div className="sa-transfer-actions">
        {!asking ? (
          <button className="sa-btn" onClick={() => setAsking(true)}>Confirm payment</button>
        ) : (
          <>
            <button className="sa-cta sa-cta-sm" onClick={confirm} disabled={busy}>{busy ? 'Confirming…' : `Yes, ${item.send} has arrived`}</button>
            <button className="sa-btn" onClick={() => setAsking(false)} disabled={busy}>Cancel</button>
            <span className="sa-flag-contact">The buyer is emailed straight away, and their pass is issued if this is the last payment.</span>
          </>
        )}
      </div>
      {problem && <p className="sa-error" role="alert">{problem}</p>}
    </div>
  );
}

const Skeleton = () => (
  <div className="sa-inner" role="status" aria-label="Loading payments">
    <div className="sa-skel" style={{ height: 36, width: 200 }} />
    <div className="sa-skel" style={{ height: 480 }} />
    <div className="sa-skel" style={{ height: 240 }} />
  </div>
);

export default function PaymentsClient({ sample }: { sample?: Sample }) {
  const [user, setUser] = useState<User | null | undefined>(sample ? null : undefined);
  const [ledger, setLedger] = useState<Ledger | null>(sample?.ledger ?? null);
  const [comparison, setComparison] = useState<Comparison | null>(sample?.comparison ?? null);
  const [compareFailed, setCompareFailed] = useState(false);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<View>('overview');
  const [range, setRange] = useState<Range>('30');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [page, setPage] = useState(0);
  const [openRow, setOpenRow] = useState<PaymentRow | null>(null);

  useEffect(() => {
    if (sample) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setForbidden(false);
      if (!next) {
        setLedger(null);
        setComparison(null);
      }
    });
  }, [sample]);

  const load = useCallback(async (who: User) => {
    setRefreshing(true);
    try {
      const resp = await fetch('/api/staff/payments', { headers: { Authorization: `Bearer ${await who.getIdToken()}` } });
      if (resp.status === 403) {
        setForbidden(true);
        return;
      }
      const json = await resp.json();
      if (!resp.ok || !json.ok) throw new Error(json.message);
      setLedger(json);
      setError('');
    } catch {
      setError('Payments did not refresh, so these figures may be out of date. Choose Refresh to try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const compare = useCallback(async (who: User) => {
    setCompareFailed(false);
    try {
      const resp = await fetch('/api/staff/compare', { headers: { Authorization: `Bearer ${await who.getIdToken()}` } });
      const json = await resp.json();
      if (!resp.ok || !json.ok) throw new Error(json.message);
      setComparison(json);
    } catch {
      setCompareFailed(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    load(user);
    compare(user);
    // Payments refresh on their own; the Flutterwave comparison runs on load and on Refresh.
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load(user);
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [user, load, compare]);

  const today = ledger ? lagosDay(ledger.generatedAt) : '';
  const rows = useMemo(() => ledger?.rows ?? [], [ledger]);
  const points = useMemo(() => curvePoints(rows, today, range), [rows, today, range]);
  const inRange = useMemo(() => {
    if (range === 'all' || !today) return rows;
    const from = rangeStart(today, range);
    return rows.filter((r) => r.day >= from);
  }, [rows, today, range]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inRange.filter((r) => {
      if (typeFilter === 'full' && r.payment !== 'Paid in full') return false;
      if (typeFilter === 'instalments' && r.payment === 'Paid in full') return false;
      if (typeFilter === 'cancelled' && r.booking !== 'Cancelled') return false;
      return !q || [r.buyerName, r.buyerEmail, r.buyerPhone, r.orderRef, r.pass].some((v) => v.toLowerCase().includes(q));
    });
  }, [inRange, query, typeFilter]);

  const passTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const r of inRange) totals.set(r.pass, (totals.get(r.pass) ?? 0) + r.amount);
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, [inRange]);

  useEffect(() => setPage(0), [query, typeFilter, range]);

  if (!sample) {
    if (user === undefined) {
      return <main className="sa-signin-page"><style>{CSS}</style><p role="status" style={{ color: '#fff' }}>Loading…</p></main>;
    }
    if (user === null) return <SignIn />;
    if (forbidden) {
      return (
        <main className="sa-signin-page">
          <style>{CSS}</style>
          <div className="sa-signin-wrap">
            <div className="sa-signin">
              <h1>No access</h1>
              <p>{user.email} is not set up for the payments page. Ask Ugo to add it.</p>
              <button className="sa-cta" onClick={() => signOut(auth)}>Sign out</button>
            </div>
          </div>
        </main>
      );
    }
  }

  const awaiting = ledger?.awaiting ?? [];
  const toConfirm = awaiting.filter((a) => a.state === 'sent').length;
  const unrecorded = comparison?.unrecorded ?? [];
  const attention = ledger?.attention ?? [];
  const attentionCount = unrecorded.length + attention.length;

  const weekFrom = today ? addDays(today, -6) : '';
  const prevFrom = today ? addDays(today, -13) : '';
  const todayRows = rows.filter((r) => r.day === today);
  const weekRows = rows.filter((r) => r.day >= weekFrom);
  const prevWeek = sum(rows.filter((r) => r.day >= prevFrom && r.day < weekFrom));
  const weekChange = prevWeek > 0 ? Math.round(((sum(weekRows) - prevWeek) / prevWeek) * 100) : null;
  const rangeLabel = range === 'all' ? 'since the first payment' : `in the last ${range} days`;
  const dailyRows = points.filter((p) => p.received > 0).reverse();
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const passMax = passTotals[0]?.[1] ?? 1;

  const compareLine = compareFailed
    ? 'The Flutterwave check did not run. Choose Refresh to try again.'
    : !comparison
      ? 'Checking against Flutterwave…'
      : `Flutterwave check, last ${comparison.days} days: ${comparison.matched} matched, ${unrecorded.length} not recorded.${comparison.partial ? ' Flutterwave returned only part of its records, so this is incomplete.' : ''}${comparison.otherCount > 0 ? ` ${plural(comparison.otherCount, 'other payment')} on the account (${formatNaira(comparison.otherNaira)} in naira) came from outside this checkout and are not counted here.` : ''}`;

  const titles: Record<View, string> = { overview: 'Overview', transfers: 'Bank transfers', payments: 'Payments', attention: 'Needs attention' };

  const confirmItem = async (item: AwaitingTransfer): Promise<string | null> => {
    if (sample) return 'This is a preview, so nothing was confirmed.';
    if (!user) return 'Please sign in again.';
    try {
      const resp = await fetch('/api/staff/confirm-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ orderRef: item.orderRef, n: item.n }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) return json.message || 'That payment was not confirmed. Try again.';
      await load(user);
      return null;
    } catch {
      return 'That payment may not have been confirmed. Refresh and check before trying again.';
    }
  };

  return (
    <div className="sa-app">
      <style>{CSS}</style>
      <aside className="sa-side">
        <Image className="sa-logo" src="/assets/images/whitelogo.png" alt="Atinuda" width={680} height={250} priority />
        <nav className="sa-nav" aria-label="Staff pages">
          {(['overview', 'transfers', 'payments', 'attention'] as View[]).map((v) => (
            <button key={v} aria-current={view === v ? 'page' : undefined} onClick={() => setView(v)}>
              {titles[v]}
              {v === 'attention' && attentionCount > 0 && <span className="sa-count">{attentionCount}</span>}
              {v === 'transfers' && toConfirm > 0 && <span className="sa-count">{toConfirm}</span>}
            </button>
          ))}
        </nav>
        <div className="sa-who">
          <p>{sample ? 'Local preview' : user?.email}</p>
          {user && <button onClick={() => signOut(auth)}>Sign out</button>}
        </div>
      </aside>

      <main className="sa-main">
        {!ledger ? (
          error ? (
            <div className="sa-inner">
              <p className="sa-error" role="alert">{error}</p>
              {user && <div><button className="sa-btn" onClick={() => load(user)}>Try again</button></div>}
            </div>
          ) : <Skeleton />
        ) : (
          <div className="sa-inner">
            {sample && <p className="sa-sample">Sample data with invented buyers. This preview only runs on a local dev server.</p>}
            {error && <p className="sa-error" role="alert">{error}</p>}

            <header className="sa-top">
              <h1>{titles[view]}</h1>
              <div className="sa-top-actions">
                <span className="sa-updated" role="status">{refreshing ? 'Refreshing…' : `Updated ${time(ledger.generatedAt)}, Lagos time`}</span>
                {user && <button className="sa-btn" onClick={() => { load(user); compare(user); }} disabled={refreshing}>Refresh</button>}
                {(view === 'overview' || view === 'payments') && (
                  <div className="sa-seg" role="group" aria-label="Date range">
                    {RANGES.map((r) => (
                      <button key={r.id} aria-pressed={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {view === 'overview' && (
              <>
                <section className="sa-panel" aria-label="Money received">
                  <div className="sa-hero-head">
                    <p className="sa-hero-label">Received to date</p>
                    <p className="sa-hero-figure">{formatNaira(sum(rows))}</p>
                    <p className="sa-hero-sub">
                      {rows.length === 0
                        ? 'Refunds are not deducted.'
                        : <><b>+{formatNaira(sum(inRange))}</b> {rangeLabel}. Refunds are not deducted.</>}
                    </p>
                  </div>
                  {rows.length === 0
                    ? <div className="sa-curve-empty">No Atinuda 7.0 payments yet. Each one appears here within a minute of clearing.</div>
                    : <EquityCurve points={points} />}
                  <div className="sa-strip">
                    <div className="sa-stat">
                      <p className="sa-stat-label">Today</p>
                      <p className="sa-stat-figure">{formatNaira(sum(todayRows))}</p>
                      <p className="sa-stat-note">{plural(todayRows.length, 'payment')}</p>
                    </div>
                    <div className="sa-stat">
                      <p className="sa-stat-label">Last 7 days</p>
                      <p className="sa-stat-figure">{formatNaira(sum(weekRows))}</p>
                      <p className="sa-stat-note">
                        {weekChange === null ? plural(weekRows.length, 'payment') : `${weekChange >= 0 ? '+' : ''}${weekChange}% on the week before`}
                      </p>
                    </div>
                    <div className="sa-stat">
                      <p className="sa-stat-label">Still due on instalments</p>
                      <p className="sa-stat-figure">{formatNaira(ledger.outstanding)}</p>
                      <p className="sa-stat-note">Not yet received</p>
                    </div>
                  </div>
                  {dailyRows.length > 0 && (
                    <details className="sa-details">
                      <summary>Daily figures</summary>
                      <table className="sa-daily">
                        <thead><tr><th>Day</th><th>Received</th><th>To date</th></tr></thead>
                        <tbody>
                          {dailyRows.map((p) => (
                            <tr key={p.day}><td>{dayLabel(p.day)}</td><td>{formatNaira(p.received)}</td><td>{formatNaira(p.total)}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </details>
                  )}
                </section>

                <div className="sa-cols">
                  <section className="sa-panel" aria-labelledby="sa-recent">
                    <div className="sa-phead">
                      <h2 id="sa-recent">Latest payments</h2>
                      {inRange.length > 0 && <button className="sa-textbtn" onClick={() => setView('payments')}>View all {inRange.length}</button>}
                    </div>
                    {inRange.length === 0
                      ? <p className="sa-empty">No payments in this date range.</p>
                      : <PaymentsTable rows={inRange.slice(0, 6)} onOpen={setOpenRow} />}
                  </section>

                  <div className="sa-stack">
                    {toConfirm > 0 && (
                      <section className="sa-panel" aria-labelledby="sa-toconfirm">
                        <div className="sa-phead">
                          <h2 id="sa-toconfirm">{plural(toConfirm, 'transfer')} to confirm</h2>
                          <button className="sa-textbtn" onClick={() => setView('transfers')}>Review</button>
                        </div>
                      </section>
                    )}
                    <section className="sa-panel" aria-labelledby="sa-flagged">
                      <div className="sa-phead">
                        <h2 id="sa-flagged">Needs attention</h2>
                        {attentionCount > 3 && <button className="sa-textbtn" onClick={() => setView('attention')}>View all {attentionCount}</button>}
                      </div>
                      {attentionCount === 0 && <p className="sa-empty">Nothing to follow up.</p>}
                      <div className="sa-flags">
                        {unrecorded.slice(0, 3).map((m) => <UnrecordedItem key={m.id} item={m} />)}
                        {attention.slice(0, Math.max(0, 3 - unrecorded.length)).map((a) => <FlagItem key={a.id} item={a} />)}
                      </div>
                    </section>

                    {passTotals.length > 0 && (
                      <section className="sa-panel" aria-labelledby="sa-passes">
                        <div className="sa-phead"><h2 id="sa-passes">Received by pass</h2></div>
                        <div className="sa-bars">
                          {passTotals.map(([pass, total]) => (
                            <div key={pass}>
                              <div className="sa-bar-row"><span>{pass}</span><b>{formatNaira(total)}</b></div>
                              <div className="sa-bar-track"><div className="sa-bar-fill" style={{ width: `${(total / passMax) * 100}%` }} /></div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </>
            )}

            {view === 'transfers' && (
              <section className="sa-panel" aria-label="Bank transfers to check">
                {awaiting.length === 0
                  ? <p className="sa-empty" style={{ paddingTop: 20 }}>No bank transfers to check. New orders appear here as soon as a buyer sees the bank details.</p>
                  : <div className="sa-flags">{awaiting.map((a) => <TransferItem key={a.id} item={a} onConfirm={confirmItem} />)}</div>}
              </section>
            )}

            {view === 'payments' && (
              <section className="sa-panel" aria-label="All payments">
                <div className="sa-tools">
                  <input
                    className="sa-search"
                    type="search"
                    placeholder="Search name, email, phone or reference"
                    aria-label="Search payments"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="sa-seg" role="group" aria-label="Payment type">
                    {TYPE_FILTERS.map((f) => (
                      <button key={f.id} aria-pressed={typeFilter === f.id} onClick={() => setTypeFilter(f.id)}>{f.label}</button>
                    ))}
                  </div>
                  <button className="sa-btn" onClick={() => downloadCsv(filtered)} disabled={filtered.length === 0}>Download CSV</button>
                </div>
                {filtered.length === 0 ? (
                  <p className="sa-empty">{rows.length === 0 ? 'No Atinuda 7.0 payments yet.' : 'No payments match. Clear the search or widen the date range.'}</p>
                ) : (
                  <>
                    <PaymentsTable rows={pageRows} onOpen={setOpenRow} />
                    <div className="sa-pager">
                      <span>{plural(filtered.length, 'payment')}, {formatNaira(sum(filtered))}</span>
                      {pageCount > 1 && (
                        <div>
                          <button className="sa-btn" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
                          <button className="sa-btn" onClick={() => setPage(page + 1)} disabled={page >= pageCount - 1}>Next</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
            )}

            {view === 'attention' && (
              <section className="sa-panel" aria-label="Payments that need follow-up">
                {attentionCount === 0 && <p className="sa-empty" style={{ paddingTop: 20 }}>Nothing to follow up.</p>}
                <div className="sa-flags">
                  {unrecorded.map((m) => <UnrecordedItem key={m.id} item={m} />)}
                  {attention.map((a) => <FlagItem key={a.id} item={a} />)}
                </div>
                <p className="sa-check" role="status">{compareLine}</p>
              </section>
            )}
          </div>
        )}
      </main>

      {openRow && <PaymentDrawer key={openRow.id} row={openRow} onClose={() => setOpenRow(null)} />}
    </div>
  );
}
