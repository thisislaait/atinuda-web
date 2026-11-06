// Turns Atinuda 7.0 orders into the staff view of money received. No server imports, so the
// staff page and the daily email share these rules. Each paid instalment is its own payment.
import { INSTALMENT_GRACE_DAYS, formatMoney } from '@/lib/atinuda7Checkout';
import type { OrderDoc } from '@/lib/atinuda7Fulfil';
import { sourceLabel } from '@/lib/leadSource';

export type StaffOrder = OrderDoc & {
  paidAtIso?: string;
  createdAtIso?: string;
  flwTransactionId?: string;
  flwAmount?: number;
  reviewReason?: string;
};

export type PaymentRow = {
  id: string;
  at: string;
  day: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  company: string;
  pass: string;
  quantity: number;
  amount: number;
  payment: string;
  orderRef: string;
  flwTransactionId: string;
  booking: 'Paid' | 'Part paid' | 'Cancelled';
  channel: 'Bank transfer' | 'Flutterwave';
  // Identifies an attached receipt to fetch; the file's location never reaches the browser.
  receiptKey: string | null;
  // What the buyer sent when that isn't naira. `amount` stays in naira so totals add up.
  paidAs: string;
  confirmedBy: string;
  ticketEmail: 'Sent' | 'Failed' | 'Not confirmed' | null;
  // The one name used to total sales by source.
  source: string;
  // The evidence behind it: the tagged link, the referring site and what the buyer told us.
  sourceRef: string;
  sourceSite: string;
  sourceHeard: string;
};

// A bank transfer staff should look for. `n` is the instalment, or null for payment in one go.
export type AwaitingTransfer = {
  id: string;
  orderRef: string;
  n: number | null;
  state: 'sent' | 'not_marked' | 'overdue' | 'lapsed';
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  company: string;
  pass: string;
  naira: number;
  send: string;
  bank: string;
  payment: string;
  note: string;
  receiptKey: string | null;
};

export type AttentionItem = {
  id: string;
  level: 'check' | 'overdue' | 'cancelled' | 'due';
  label: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  company: string;
  pass: string;
  amount: number;
  note: string;
  orderRef: string;
  // True when staff can send this order's ticket email again from here.
  resend?: boolean;
};

export type Ledger = {
  rows: PaymentRow[];
  attention: AttentionItem[];
  awaiting: AwaitingTransfer[];
  outstanding: number;
  generatedAt: string;
};

export type FlwTransaction = {
  id: number | string;
  tx_ref: string;
  amount: number;
  currency: string;
  created_at: string;
  customer?: { name?: string; email?: string };
};

export type Comparison = {
  days: number;
  matched: number;
  // Paid on Flutterwave for a 7.0 order, but no order here records the transaction.
  unrecorded: { id: string; ref: string; amount: number; currency: string; at: string; name: string; email: string }[];
  // Other payments on the same Flutterwave account, such as the app.
  otherCount: number;
  otherNaira: number;
  // True when Flutterwave stopped answering before every page was read.
  partial: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

// A payment can reach Flutterwave a few minutes before the webhook reaches us.
const SETTLE_MS = 15 * 60 * 1000;

const LEVEL_ORDER: AttentionItem['level'][] = ['check', 'overdue', 'cancelled', 'due'];
const AWAITING_ORDER: AwaitingTransfer['state'][] = ['sent', 'overdue', 'not_marked', 'lapsed'];
// How long a lapsed order stays on the list, in case its money turns up late.
const LAPSED_SHOWN_DAYS = 14;

export const lagosDay = (at: string | Date) =>
  new Date(at).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });

export const addDays = (day: string, n: number) =>
  new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

const BANK_LABEL = { NGN: 'GT Bank', USD: 'Access Bank' } as const;

// A send still 'sending' after this long was cut off before it could report back.
const SENDING_GRACE_MS = 2 * 60 * 1000;

function ticketEmailLabel(o: StaffOrder, now: Date): PaymentRow['ticketEmail'] {
  if (o.status !== 'paid' || !o.tickets?.length) return null;
  const email = o.ticketEmail;
  if (email?.status === 'sent') return 'Sent';
  if (email?.status === 'failed') return 'Failed';
  if (email?.status === 'sending' && now.getTime() - new Date(email.at).getTime() < SENDING_GRACE_MS) return 'Sent';
  return 'Not confirmed';
}

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Lagos' });

export function buildLedger(orders: StaffOrder[], now: Date = new Date()): Ledger {
  const rows: PaymentRow[] = [];
  const attention: AttentionItem[] = [];
  const awaiting: AwaitingTransfer[] = [];
  let outstanding = 0;

  for (const o of orders) {
    const buyer = {
      buyerName: o.buyer.name,
      buyerEmail: o.buyer.email,
      buyerPhone: o.buyer.phone,
      company: o.buyer.company,
    };
    const row = {
      ...buyer,
      pass: o.productName,
      quantity: o.quantity,
      orderRef: o.txRef,
      source: sourceLabel(o.source),
      sourceRef: o.source?.ref ?? '',
      sourceSite: o.source?.referrer ?? '',
      sourceHeard: o.source?.heard ?? '',
    };
    const isTransfer = o.method === 'transfer';
    const channel = isTransfer ? ('Bank transfer' as const) : ('Flutterwave' as const);
    const paidAs = (n: number | null) => {
      if (o.transfer?.currency !== 'USD') return '';
      const { amounts, currency } = o.transfer;
      return formatMoney(n ? amounts[n - 1] : amounts.reduce((sum, a) => sum + a, 0), currency);
    };
    const flag = (id: string, level: AttentionItem['level'], label: string, amount: number, note: string) =>
      attention.push({ id: `${o.txRef}-${id}`, level, label, ...buyer, pass: o.productName, amount, note, orderRef: o.txRef });

    if (o.plan === 'instalments') {
      const booking = o.status === 'paid' ? 'Paid' : o.status === 'cancelled' ? 'Cancelled' : 'Part paid';
      for (const i of o.instalments ?? []) {
        if (i.status !== 'paid' || !i.paidAt) continue;
        rows.push({
          ...row,
          id: `${o.txRef}-${i.n}`,
          at: i.paidAt,
          day: lagosDay(i.paidAt),
          amount: i.flwAmount ?? i.amount,
          payment: `Instalment ${i.n} of ${o.instalments!.length}`,
          flwTransactionId: i.flwTransactionId ?? '',
          booking,
          channel,
          receiptKey: o.receipts?.[String(i.n)] ? String(i.n) : null,
          paidAs: paidAs(i.n),
          confirmedBy: i.confirmedBy ?? '',
          ticketEmail: i.n === o.instalments!.length ? ticketEmailLabel(o, now) : null,
        });
      }
    } else if (o.status === 'paid' && o.paidAtIso) {
      rows.push({
        ...row,
        id: o.txRef,
        at: o.paidAtIso,
        day: lagosDay(o.paidAtIso),
        amount: o.amountPaid ?? o.total,
        payment: 'Paid in full',
        flwTransactionId: o.flwTransactionId ?? '',
        booking: 'Paid',
        channel,
        receiptKey: o.receipts?.full ? 'full' : null,
        paidAs: paidAs(null),
        confirmedBy: o.confirmedBy ?? '',
        ticketEmail: ticketEmailLabel(o, now),
      });
    }

    const ticketEmail = ticketEmailLabel(o, now);
    if (ticketEmail === 'Failed' || ticketEmail === 'Not confirmed') {
      attention.push({
        id: `${o.txRef}-ticket-email`,
        level: 'check',
        label: ticketEmail === 'Failed' ? 'Ticket email failed' : 'Ticket email not confirmed',
        ...buyer,
        pass: o.productName,
        amount: o.amountPaid ?? o.total,
        note: 'Paid and ticket issued, but we cannot confirm the buyer received their ticket email.',
        orderRef: o.txRef,
        resend: true,
      });
    }

    if (o.status === 'review') {
      flag('review', 'check', 'To check', o.flwAmount ?? 0, `Payment held back: ${o.reviewReason ?? 'needs a manual check'}. No ticket issued.`);
    }
    for (const r of o.reviewPayments ?? []) {
      flag(`review-${r.flwTransactionId}`, 'check', 'To check', r.amount, `Extra payment: ${r.reason}.`);
    }
    if (o.status === 'cancelled') {
      const paid = (o.instalments ?? []).filter((i) => i.status === 'paid').reduce((sum, i) => sum + (i.flwAmount ?? i.amount), 0);
      flag('cancelled', 'cancelled', 'Cancelled', paid, 'Missed an instalment. Amount shown has been paid; any refund is your decision.');
    }
    if (o.status === 'part_paid') {
      const unpaid = (o.instalments ?? []).filter((i) => i.status !== 'paid');
      outstanding += unpaid.reduce((sum, i) => sum + i.amount, 0);
      const next = unpaid[0];
      // Bank transfer instalments are followed up on the transfers list instead.
      if (next && !isTransfer) {
        const due = new Date(next.dueAt).getTime();
        if (due < now.getTime()) {
          const cancelOn = new Date(due + INSTALMENT_GRACE_DAYS * DAY_MS).toISOString();
          flag(`n${next.n}`, 'overdue', 'Overdue', next.amount, `Instalment ${next.n} was due ${dateLabel(next.dueAt)}. Cancels after ${dateLabel(cancelOn)}.`);
        } else if (due - now.getTime() <= 7 * DAY_MS) {
          flag(`n${next.n}`, 'due', 'Due soon', next.amount, `Instalment ${next.n} is due ${dateLabel(next.dueAt)}.`);
        }
      }
    }
  }

  for (const o of orders) {
    if (o.method !== 'transfer' || !o.transfer) continue;
    const account = BANK_LABEL[o.transfer.currency];
    const base = {
      orderRef: o.txRef,
      buyerName: o.buyer.name,
      buyerEmail: o.buyer.email,
      buyerPhone: o.buyer.phone,
      company: o.buyer.company,
      pass: o.productName,
      bank: account,
    };
    const send = (n: number | null) => {
      const { amounts, currency } = o.transfer!;
      return formatMoney(n ? amounts[n - 1] : amounts.reduce((sum, a) => sum + a, 0), currency);
    };

    if (o.status === 'part_paid' || ((o.status === 'pending' || o.status === 'lapsed') && o.plan === 'instalments')) {
      const next = (o.instalments ?? []).find((i) => i.status !== 'paid');
      if (!next) continue;
      const of = o.instalments!.length;
      const due = new Date(next.dueAt).getTime();
      const late = o.status === 'part_paid' && due < now.getTime();
      if (o.status === 'part_paid' && !next.declaredAt && !late && due - now.getTime() > 7 * DAY_MS) continue;
      const lapsedLong = o.status === 'lapsed' && o.holdUntil && now.getTime() - new Date(o.holdUntil).getTime() > LAPSED_SHOWN_DAYS * DAY_MS;
      if (lapsedLong) continue;
      const state: AwaitingTransfer['state'] = o.status === 'lapsed' ? 'lapsed' : next.declaredAt ? 'sent' : late ? 'overdue' : 'not_marked';
      awaiting.push({
        ...base,
        id: `${o.txRef}-${next.n}`,
        n: next.n,
        state,
        naira: next.amount,
        send: send(next.n),
        payment: `Instalment ${next.n} of ${of}`,
        receiptKey: o.receipts?.[String(next.n)] ? String(next.n) : null,
        note: state === 'lapsed' ? 'The 3-day hold ended. You can still confirm if the money arrived.' : `Due ${dateLabel(next.dueAt)}.`,
      });
    } else if (o.status === 'pending' || o.status === 'lapsed') {
      if (o.status === 'lapsed' && o.holdUntil && now.getTime() - new Date(o.holdUntil).getTime() > LAPSED_SHOWN_DAYS * DAY_MS) continue;
      const state: AwaitingTransfer['state'] = o.status === 'lapsed' ? 'lapsed' : o.declaredAt ? 'sent' : 'not_marked';
      awaiting.push({
        ...base,
        id: o.txRef,
        n: null,
        state,
        naira: o.total,
        send: send(null),
        payment: 'Full payment',
        receiptKey: o.receipts?.full ? 'full' : null,
        note: state === 'lapsed'
          ? 'The 3-day hold ended. You can still confirm if the money arrived.'
          : `Held until ${dateLabel(o.holdUntil ?? now.toISOString())}.`,
      });
    }
  }
  awaiting.sort((a, b) => AWAITING_ORDER.indexOf(a.state) - AWAITING_ORDER.indexOf(b.state));

  rows.sort((a, b) => b.at.localeCompare(a.at));
  attention.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
  return { rows, attention, awaiting, outstanding, generatedAt: now.toISOString() };
}

// Every Flutterwave transaction id an order has recorded, including those held for review.
export function recordedTransactionIds(orders: StaffOrder[]) {
  const ids = new Set<string>();
  for (const o of orders) {
    if (o.flwTransactionId) ids.add(String(o.flwTransactionId));
    for (const i of o.instalments ?? []) if (i.flwTransactionId) ids.add(String(i.flwTransactionId));
    for (const r of o.reviewPayments ?? []) ids.add(String(r.flwTransactionId));
  }
  return ids;
}

export function compareTransactions(
  orders: StaffOrder[],
  transactions: FlwTransaction[],
  days: number,
  partial: boolean,
  now: Date = new Date(),
): Comparison {
  const recorded = recordedTransactionIds(orders);
  const result: Comparison = { days, matched: 0, unrecorded: [], otherCount: 0, otherNaira: 0, partial };

  for (const t of transactions) {
    if (!String(t.tx_ref ?? '').startsWith('ATN7-')) {
      result.otherCount += 1;
      if (t.currency === 'NGN') result.otherNaira += Number(t.amount) || 0;
    } else if (recorded.has(String(t.id))) {
      result.matched += 1;
    } else if (now.getTime() - new Date(t.created_at).getTime() >= SETTLE_MS) {
      result.unrecorded.push({
        id: String(t.id),
        ref: t.tx_ref,
        amount: Number(t.amount) || 0,
        currency: t.currency,
        at: t.created_at,
        name: t.customer?.name ?? '',
        email: t.customer?.email ?? '',
      });
    }
  }
  return result;
}
