// Turns Atinuda 7.0 orders into the staff view of money received. No server imports, so the
// staff page and the daily email share these rules. Each paid instalment is its own payment.
import { INSTALMENT_GRACE_DAYS } from '@/lib/atinuda7Checkout';
import type { OrderDoc } from '@/lib/atinuda7Fulfil';

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
};

export type AttentionItem = {
  id: string;
  level: 'check' | 'overdue' | 'cancelled' | 'due';
  label: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  pass: string;
  amount: number;
  note: string;
  orderRef: string;
};

export type Ledger = {
  rows: PaymentRow[];
  attention: AttentionItem[];
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

export const lagosDay = (at: string | Date) =>
  new Date(at).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });

export const addDays = (day: string, n: number) =>
  new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Lagos' });

export function buildLedger(orders: StaffOrder[], now: Date = new Date()): Ledger {
  const rows: PaymentRow[] = [];
  const attention: AttentionItem[] = [];
  let outstanding = 0;

  for (const o of orders) {
    const buyer = {
      buyerName: o.buyer.name,
      buyerEmail: o.buyer.email,
      buyerPhone: o.buyer.phone,
    };
    const row = { ...buyer, company: o.buyer.company, pass: o.productName, quantity: o.quantity, orderRef: o.txRef };
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
      if (next) {
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

  rows.sort((a, b) => b.at.localeCompare(a.at));
  attention.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
  return { rows, attention, outstanding, generatedAt: now.toISOString() };
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
