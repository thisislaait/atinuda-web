// Invented buyers for the local preview at /staff/payments?sample=1. Never used in production.
import { USD_RATE, transferAmounts } from '@/lib/atinuda7Checkout';
import { buildLedger, type Comparison, type StaffOrder } from '@/lib/staffLedger';

const DAY_MS = 24 * 60 * 60 * 1000;

const PASSES = [
  { name: 'Nuru', price: 155000 },
  { name: 'Safi', price: 255000 },
  { name: 'Zuri', price: 430000 },
  { name: 'Amani', price: 560000 },
  { name: 'Adé', price: 685000 },
];

const NAMES = ['Sample Buyer A', 'Sample Buyer B', 'Sample Buyer C', 'Sample Buyer D', 'Sample Buyer E', 'Sample Buyer F', 'Sample Buyer G'];

function fullOrder(i: number, daysAgo: number, now: number): StaffOrder {
  const pass = PASSES[i % PASSES.length];
  const name = NAMES[i % NAMES.length];
  return {
    txRef: `ATN7-SAMPLE-${String(i).padStart(3, '0')}`,
    eventSlug: 'atinuda-7',
    status: 'paid',
    productId: pass.name.toLowerCase(),
    productName: pass.name,
    quantity: 1,
    supportPasses: 0,
    total: pass.price,
    currency: 'NGN',
    buyer: { name, email: `buyer${i}@example.com`, phone: '+234 800 000 0000', company: '' },
    attendees: [],
    plan: 'full',
    amountPaid: pass.price,
    paidAtIso: new Date(now - daysAgo * DAY_MS - (i % 7) * 3_600_000).toISOString(),
    flwTransactionId: String(900000 + i),
  };
}

function planOrder(i: number, startedDaysAgo: number, paidCount: number, now: number, status: StaffOrder['status'] = 'part_paid'): StaffOrder {
  const pass = PASSES[i % PASSES.length];
  const start = now - startedDaysAgo * DAY_MS;
  const steps = [Math.round(pass.price / 2), Math.round(pass.price / 4), pass.price - Math.round(pass.price / 2) - Math.round(pass.price / 4)];
  return {
    ...fullOrder(i, startedDaysAgo, now),
    status,
    plan: 'instalments',
    amountPaid: undefined,
    paidAtIso: undefined,
    flwTransactionId: undefined,
    instalments: steps.map((amount, s) => ({
      n: s + 1,
      amount,
      dueAt: new Date(start + s * 30 * DAY_MS).toISOString(),
      status: s < paidCount ? ('paid' as const) : ('due' as const),
      ...(s < paidCount
        ? { paidAt: new Date(start + s * 30 * DAY_MS).toISOString(), flwAmount: amount, flwTransactionId: String(910000 + i * 10 + s) }
        : {}),
    })),
  };
}

export function sampleLedger() {
  const now = Date.now();
  const gaps = [0, 0, 1, 1, 2, 3, 3, 4, 6, 7, 7, 8, 9, 11, 12, 14, 14, 15, 17, 19, 21, 22, 24, 26, 27, 29, 33, 36, 40, 44, 47];
  const orders: StaffOrder[] = gaps.map((daysAgo, i) => fullOrder(i, daysAgo, now));
  orders.push(planOrder(40, 25, 1, now));
  orders.push(planOrder(41, 34, 1, now));
  orders.push(planOrder(42, 62, 2, now));
  orders.push(planOrder(43, 45, 1, now, 'cancelled'));
  orders.push({
    ...fullOrder(44, 2, now),
    status: 'review',
    paidAtIso: undefined,
    amountPaid: undefined,
    flwAmount: 200000,
    reviewReason: 'underpaid',
  });
  // Bank transfers staff still need to check, one for each state on the list.
  const hold = new Date(now + 2 * DAY_MS).toISOString();
  const transfer = (i: number, currency: 'NGN' | 'USD', extra: Partial<StaffOrder>): StaffOrder => {
    const base = fullOrder(i, 0, now);
    return {
      ...base,
      status: 'pending',
      method: 'transfer',
      amountPaid: undefined,
      paidAtIso: undefined,
      flwTransactionId: undefined,
      holdUntil: hold,
      transfer: { currency, amounts: transferAmounts([base.total], currency), rate: currency === 'USD' ? USD_RATE : null },
      ...extra,
    };
  };
  const receipts = { full: { path: '', contentType: 'image/svg+xml', size: 0, uploadedAt: new Date(now).toISOString() } };
  orders.push(transfer(50, 'NGN', { declaredAt: new Date(now - 3_600_000).toISOString(), receipts }));
  orders.push(transfer(51, 'USD', { declaredAt: new Date(now - 7_200_000).toISOString(), receipts }));
  orders.push(transfer(52, 'NGN', {}));
  orders.push(transfer(53, 'NGN', { status: 'lapsed', holdUntil: new Date(now - 2 * DAY_MS).toISOString() }));
  return buildLedger(orders, new Date(now));
}

export function sampleComparison(): Comparison {
  return {
    days: 30,
    matched: 26,
    unrecorded: [
      { id: '990001', ref: 'ATN7-SAMPLE-099', amount: 255000, currency: 'NGN', at: new Date(Date.now() - DAY_MS).toISOString(), name: 'Sample Buyer H', email: 'buyer99@example.com' },
    ],
    otherCount: 4,
    otherNaira: 720000,
    partial: false,
  };
}
