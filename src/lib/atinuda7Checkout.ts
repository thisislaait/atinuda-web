// Atinuda 7.0 pass catalogue and pricing rules.
// Shared by the checkout page (display) and the checkout API (authoritative charge amount),
// so the amount a buyer sees is computed by the same code the server charges against.
// Prices are in whole naira and must match /pricing.

export const EVENT_SLUG = 'atinuda-7';
export const EVENT_LABEL = 'Atinuda 7.0';
export const EVENT_WHEN = '6–8 October 2027';
export const EVENT_WHERE = 'Lagos';

export type ProductId = 'nuru' | 'safi' | 'zuri' | 'amani' | 'ade' | 'workshop' | 'gala';

export type Product = {
  id: ProductId;
  name: string;
  tier: string;
  kind: 'pass' | 'single';
  price: number;
  earlyBird?: { price: number; until: string; label: string };
  summary: string;
  allowsSupportPass: boolean;
  ticketPrefix: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'nuru',
    name: 'Nuru',
    tier: 'Essential Experience',
    kind: 'pass',
    price: 180000,
    // Early bird ends at midnight Lagos time (WAT, UTC+1) going into 1 January 2027.
    earlyBird: { price: 155000, until: '2027-01-01T00:00:00+01:00', label: 'Early bird until 31 December 2026' },
    summary: 'Selected main-stage sessions and the networking areas around them.',
    allowsSupportPass: false,
    ticketPrefix: 'NUR',
  },
  {
    id: 'safi',
    name: 'Safi',
    tier: 'Conference Experience',
    kind: 'pass',
    price: 295000,
    summary: 'Every main-stage conversation, plus the conference networking labs.',
    allowsSupportPass: false,
    ticketPrefix: 'SAF',
  },
  {
    id: 'zuri',
    name: 'Zuri',
    tier: 'Enhanced Experience',
    kind: 'pass',
    price: 500000,
    summary: 'The full workshop programme, Future Lab, African Room and the Azizi Welcome Cocktail.',
    allowsSupportPass: false,
    ticketPrefix: 'ZUR',
  },
  {
    id: 'amani',
    name: 'Amani',
    tier: 'Signature Experience',
    kind: 'pass',
    price: 650000,
    summary: 'VIP seating, the Executive Dinner Gala and the private Executive Leadership Session.',
    allowsSupportPass: true,
    ticketPrefix: 'AMA',
  },
  {
    id: 'ade',
    name: 'Adé',
    tier: 'Prestige Experience',
    kind: 'pass',
    price: 795000,
    summary: 'Everything in Amani, with VVIP registration, priority seating and executive networking.',
    allowsSupportPass: true,
    ticketPrefix: 'ADE',
  },
  {
    id: 'workshop',
    name: 'Workshop Access',
    tier: 'Single experience',
    kind: 'single',
    price: 250000,
    summary: 'Expert-led workshops and curated breakouts. Excludes the main conference.',
    allowsSupportPass: false,
    ticketPrefix: 'WRK',
  },
  {
    id: 'gala',
    name: 'Executive Dinner Gala',
    tier: 'Single experience',
    kind: 'single',
    price: 250000,
    summary: 'The dinner gala, curated dining and live entertainment. Excludes the daytime programme.',
    allowsSupportPass: false,
    ticketPrefix: 'GAL',
  },
];

export const SUPPORT_PASS = { name: 'Support Pass', price: 135000, ticketPrefix: 'SUP' };

// Group rates apply to every product. Ordered highest threshold first.
export const GROUP_TIERS = [
  { min: 10, percent: 15 },
  { min: 5, percent: 10 },
] as const;

export const MAX_QUANTITY = 50;

export const findProduct = (id: string | null | undefined) =>
  PRODUCTS.find((p) => p.id === id) ?? null;

export const isEarlyBird = (p: Product, now: Date = new Date()) =>
  !!p.earlyBird && now < new Date(p.earlyBird.until);

export const unitPrice = (p: Product, now: Date = new Date()) =>
  p.earlyBird && isEarlyBird(p, now) ? p.earlyBird.price : p.price;

export const groupPercent = (quantity: number) =>
  GROUP_TIERS.find((t) => quantity >= t.min)?.percent ?? 0;

export type Quote = {
  product: Product;
  quantity: number;
  unit: number;
  earlyBird: boolean;
  subtotal: number;
  groupPercent: number;
  groupDiscount: number;
  supportPasses: number;
  supportTotal: number;
  total: number;
};

// Returns null when the input cannot be priced (unknown product, out-of-range counts).
export function quote(
  input: { productId: string; quantity: number; supportPasses?: number },
  now: Date = new Date(),
): Quote | null {
  const product = findProduct(input.productId);
  const quantity = input.quantity;
  const supportPasses = input.supportPasses ?? 0;
  if (!product) return null;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
  if (!Number.isInteger(supportPasses) || supportPasses < 0) return null;
  if (supportPasses > 0 && (!product.allowsSupportPass || supportPasses > quantity)) return null;

  const unit = unitPrice(product, now);
  const subtotal = unit * quantity;
  const pct = groupPercent(quantity);
  const groupDiscount = Math.round((subtotal * pct) / 100);
  // Support Passes are priced flat and sit outside the group rate.
  const supportTotal = supportPasses * SUPPORT_PASS.price;

  return {
    product,
    quantity,
    unit,
    earlyBird: isEarlyBird(product, now),
    subtotal,
    groupPercent: pct,
    groupDiscount,
    supportPasses,
    supportTotal,
    total: subtotal - groupDiscount + supportTotal,
  };
}

export const formatNaira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`;
