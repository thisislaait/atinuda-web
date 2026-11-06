// Records what brought a buyer to the site, so staff can see which outreach produces sales.
// No server imports: the browser, the order route and the staff ledger all share these rules.
export type LeadSource = { ref: string; referrer: string; heard: string };

// A link is tagged with ?ref=lagos-fashion-week, or the utm_ tags that ad platforms add.
const STORAGE_KEY = 'atn_lead_source';
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;

export const HEARD_OPTIONS = [
  'An invitation from the Atinuda team',
  'A colleague or friend',
  'An industry body or partner',
  'A news article',
  'LinkedIn',
  'Instagram',
  'A web search',
  'A previous Atinuda event',
  'Somewhere else',
] as const;

const cleanTag = (v: unknown) =>
  typeof v === 'string' ? v.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) : '';

// Whatever the browser sends is only a label, so keep it short and free of markup.
export function cleanLeadSource(raw: unknown): LeadSource {
  const s = (raw ?? {}) as Record<string, unknown>;
  const heard = HEARD_OPTIONS.find((o) => o === s.heard) ?? '';
  return { ref: cleanTag(s.ref), referrer: cleanTag(s.referrer), heard };
}

// A tagged link was sent on purpose, so it outranks what the buyer recalls, then the referring site.
export const sourceLabel = (s?: Partial<LeadSource>) => s?.ref || s?.heard || s?.referrer || 'Not known';

const isOwnSite = (host: string) => host === 'localhost' || host === 'atinuda.africa' || host.endsWith('.atinuda.africa');

// Runs once when someone lands. A new tagged link replaces an older one; a referring site never does.
export function rememberLeadSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = [params.get('utm_source'), params.get('utm_campaign')].filter(Boolean).join('-');
    const ref = cleanTag(params.get('ref') || utm);
    const referrerHost = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '';
    const referrer = isOwnSite(referrerHost) ? '' : cleanTag(referrerHost);
    if (!ref && (!referrer || storedLeadSource())) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ref, referrer, at: Date.now() }));
  } catch {
    // Storage can be blocked. The buyer can still answer the question at checkout.
  }
}

export function storedLeadSource(): { ref: string; referrer: string } | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!saved || Date.now() - Number(saved.at) > KEEP_MS) return null;
    return { ref: cleanTag(saved.ref), referrer: cleanTag(saved.referrer) };
  } catch {
    return null;
  }
}
