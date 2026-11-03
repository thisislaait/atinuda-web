// Server-only. Loads Atinuda 7.0 orders for staff, compares them with Flutterwave's records and
// sends the morning payments email.
import { adminDb } from '@/utils/firebaseAdmin';
import { EVENT_LABEL, EVENT_SLUG, formatNaira } from '@/lib/atinuda7Checkout';
import { esc, sendMail } from '@/lib/atinuda7Fulfil';
import {
  addDays,
  buildLedger,
  compareTransactions,
  lagosDay,
  type Comparison,
  type FlwTransaction,
  type StaffOrder,
} from '@/lib/staffLedger';

export const STAFF_EMAILS = ['ayiri@atinuda.africa', 'ugo@atinuda.africa'];

const SITE_URL = process.env.SITE_URL || 'https://www.atinuda.africa';
const COMPARE_DAYS = 30;
// Keeps the whole comparison inside a serverless function's time limit.
const COMPARE_BUDGET_MS = 8_000;

type Stamp = { toDate?: () => Date } | undefined;
const iso = (t: unknown) => (t as Stamp)?.toDate?.().toISOString();

// Abandoned checkouts stay `pending` and are left out, so this doesn't grow with them.
export async function loadStaffOrders(): Promise<StaffOrder[]> {
  const snap = await adminDb.collection('orders')
    .where('eventSlug', '==', EVENT_SLUG)
    .where('status', 'in', ['paid', 'part_paid', 'review', 'cancelled'])
    .get();
  // Unpaid bank transfers also matter, because staff may see the money before the buyer says so.
  const transfers = await adminDb.collection('orders')
    .where('method', '==', 'transfer')
    .where('status', 'in', ['pending', 'lapsed'])
    .get();
  const docs = [...snap.docs, ...transfers.docs.filter((d) => d.get('eventSlug') === EVENT_SLUG)];
  return docs.map((d) => {
    const o = d.data();
    return { ...o, paidAtIso: iso(o.paidAt), createdAtIso: iso(o.createdAt) } as StaffOrder;
  });
}

async function fetchTransactions(days: number, now: Date) {
  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) throw new Error('FLW_SECRET_KEY is not set');
  const deadline = Date.now() + COMPARE_BUDGET_MS;
  const from = addDays(lagosDay(now), -days);
  const to = lagosDay(now);
  const transactions: FlwTransaction[] = [];

  for (let page = 1; ; page += 1) {
    const remaining = deadline - Date.now();
    // The first page must succeed; after that, report whatever was read as partial.
    if (remaining <= 0) return { transactions, partial: true };
    try {
      const resp = await fetch(
        `https://api.flutterwave.com/v3/transactions?from=${from}&to=${to}&status=successful&page=${page}`,
        { headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(remaining) },
      );
      const json = (await resp.json()) as {
        status?: string;
        data?: FlwTransaction[];
        meta?: { page_info?: { total_pages?: number } };
      };
      if (!resp.ok || json.status !== 'success') throw new Error(`Flutterwave answered ${resp.status}`);
      transactions.push(...(json.data ?? []));
      if (page >= (json.meta?.page_info?.total_pages ?? 0)) return { transactions, partial: false };
    } catch (err) {
      if (page === 1) throw err;
      console.warn('staffPayments: Flutterwave stopped at page', page, err);
      return { transactions, partial: true };
    }
  }
}

export async function compareWithFlutterwave(orders: StaffOrder[], now: Date = new Date()): Promise<Comparison> {
  const { transactions, partial } = await fetchTransactions(COMPARE_DAYS, now);
  return compareTransactions(orders, transactions, COMPARE_DAYS, partial, now);
}

const cell = 'padding:6px 16px 6px 0;vertical-align:top';
const heading = (text: string) => `<p style="margin:24px 0 8px;font-weight:600">${text}</p>`;
const longDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function summaryHtml(orders: StaffOrder[], comparison: Comparison | null, now: Date) {
  const ledger = buildLedger(orders, now);
  const yesterday = addDays(lagosDay(now), -1);
  const paid = ledger.rows.filter((r) => r.day === yesterday);
  const total = paid.reduce((sum, r) => sum + r.amount, 0);
  const toDate = ledger.rows.reduce((sum, r) => sum + r.amount, 0);
  const attention = ledger.attention.filter((a) => a.level !== 'due');
  const toConfirm = ledger.awaiting.filter((a) => a.state === 'sent');

  const rows = paid.map((r) => `<tr>
    <td style="${cell}">${esc(r.buyerName)}</td>
    <td style="${cell}">${esc(r.pass)}</td>
    <td style="${cell}">${esc(r.payment)}</td>
    <td style="${cell}">${formatNaira(r.amount)}</td>
  </tr>`).join('');

  const missing = comparison?.unrecorded ?? [];
  const compareLine = !comparison
    ? '<p>The comparison with Flutterwave could not run this morning. Please check the payments page.</p>'
    : missing.length > 0
      ? `${heading('Paid on Flutterwave but not recorded here')}<table style="border-collapse:collapse;font-size:14px">${missing.map((m) => `<tr>
          <td style="${cell}">${esc(m.name)}</td>
          <td style="${cell}">${m.currency === 'NGN' ? formatNaira(m.amount) : `${esc(m.currency)} ${m.amount}`}</td>
          <td style="${cell}">${esc(m.ref)}</td>
        </tr>`).join('')}</table>`
      : comparison.partial
        ? '<p>Flutterwave only returned part of its records this morning, so the comparison is incomplete.</p>'
        : `<p>Every Atinuda 7.0 payment on Flutterwave in the last ${comparison.days} days is recorded here.</p>`;

  return {
    subject: paid.length > 0
      ? `${EVENT_LABEL} payments, ${longDay(yesterday)}: ${formatNaira(total)}`
      : `${EVENT_LABEL} payments, ${longDay(yesterday)}: none`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:640px;font-size:14px">
      <p>${paid.length > 0 ? `${paid.length} ${paid.length === 1 ? 'payment' : 'payments'} totalling <strong>${formatNaira(total)}</strong> on ${longDay(yesterday)}.` : `No payments on ${longDay(yesterday)}.`} Received to date: <strong>${formatNaira(toDate)}</strong>.</p>
      ${paid.length > 0 ? `<table style="border-collapse:collapse;font-size:14px">${rows}</table>` : ''}
      ${toConfirm.length > 0 ? `${heading('Bank transfers to confirm')}<table style="border-collapse:collapse;font-size:14px">${toConfirm.map((a) => `<tr>
        <td style="${cell}">${esc(a.buyerName)}</td>
        <td style="${cell}">${esc(a.send)} to ${esc(a.bank)}</td>
        <td style="${cell}">${esc(a.orderRef)}</td>
      </tr>`).join('')}</table>` : ''}
      ${attention.length > 0 ? `${heading('Needs attention')}<table style="border-collapse:collapse;font-size:14px">${attention.map((a) => `<tr>
        <td style="${cell}">${esc(a.label)}</td>
        <td style="${cell}">${esc(a.buyerName)}</td>
        <td style="${cell}">${formatNaira(a.amount)}</td>
        <td style="${cell}">${esc(a.note)}</td>
      </tr>`).join('')}</table>` : ''}
      ${compareLine}
      <p><a href="${SITE_URL}/staff/payments" style="color:#1B1E1C">Open the payments page</a></p>
    </div>`,
  };
}

// The marker stops a repeated cron delivery from sending the same morning's email twice.
export async function sendDailySummary(now: Date = new Date()) {
  const marker = adminDb.collection('staffDigests').doc(lagosDay(now));
  try {
    await marker.create({ startedAt: now.toISOString() });
  } catch {
    return { sent: false, reason: 'already sent' };
  }

  try {
    const orders = await loadStaffOrders();
    // A Flutterwave outage should not cost staff the rest of the email.
    const comparison = await compareWithFlutterwave(orders, now).catch((err) => {
      console.error('staffPayments: comparison failed', err);
      return null;
    });
    const { subject, html } = summaryHtml(orders, comparison, now);
    const sent = await sendMail(STAFF_EMAILS.join(', '), subject, html);
    if (!sent) throw new Error('Email is not configured');
    return { sent: true };
  } catch (err) {
    await marker.delete().catch(() => undefined);
    throw err;
  }
}
