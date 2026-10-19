import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Passes & Pricing | Atinuda 7.0',
  description: 'Five passes for Atinuda 7.0, 6–8 October 2027 in Lagos — from selected main-stage sessions to the Executive Dinner Gala and the private leadership session.',
};

const DARK   = '#0F0F0F';
const INK    = '#1B1E1C';
const BG     = '#F4F5F3';
const BG_ALT = '#ECEEED';
const COPPER = '#b5622a';
const COPPER_ON_DARK = '#cf8550';

const saol = { fontFamily: 'SaolDisplay, Georgia, serif' };
const sans = { fontFamily: '"Hanken Grotesk", system-ui, sans-serif' };

type Pass = {
  id: string;
  name: string;
  tier: string;
  price: string;
  early: string | null;
  features: string[];
  note: string | null;
};

const PASSES: Pass[] = [
  {
    id: 'nuru',
    name: 'Nuru',
    tier: 'Essential Experience',
    price: '₦180,000',
    early: '₦155,000 until 31 December 2026',
    features: [
      'Selected main-stage conference sessions',
      'Shared networking areas during included sessions',
      'Digital event schedule and attendee information',
      'Welcome gift package',
    ],
    note: null,
  },
  {
    id: 'safi',
    name: 'Safi',
    tier: 'Conference Experience',
    price: '₦295,000',
    early: null,
    features: [
      'All main-stage conference conversations',
      'Conference networking labs and connection spaces',
      'Complete schedule for included conference days',
    ],
    note: null,
  },
  {
    id: 'zuri',
    name: 'Zuri',
    tier: 'Enhanced Experience',
    price: '₦500,000',
    early: null,
    features: [
      'All Safi programme and networking benefits',
      'Full workshop programme and curated breakout groups',
      'Future Lab and African Room',
      'Pamper Lounge',
      'Azizi Welcome Cocktail and concierge registration',
    ],
    note: null,
  },
  {
    id: 'amani',
    name: 'Amani',
    tier: 'Signature Experience',
    price: '₦650,000',
    early: null,
    features: [
      'Full conference programme, networking labs and workshops',
      'Roundtable, Future Lab, African Room and Pamper Lounge',
      'Direct access to speakers and summit contributors',
      'Azizi Welcome Cocktail and Executive Dinner Gala',
      'Private Executive Leadership Session',
      'Reserved VIP seating and dedicated VIP registration',
    ],
    note: 'A Support Pass (₦135,000) may be added at checkout for an accompanying PA, assistant or content creator.',
  },
  {
    id: 'ade',
    name: 'Adé',
    tier: 'Prestige Experience',
    price: '₦795,000',
    early: null,
    features: [
      'All Amani programme and hospitality benefits',
      'Executive networking speed sessions',
      'Extended Q&A within the private executive session',
      'Priority seating across the main programme',
      'Dedicated VVIP registration',
    ],
    note: 'The private Executive Leadership Session is a separate, focused off-site experience for Amani and Adé guests.',
  },
];

const [NURU, SAFI, ZURI, AMANI, ADE] = PASSES;

const FEATURES = [
  'Conference programme',
  'Speaker & contributor access',
  'Networking labs',
  'Full workshop access',
  'Roundtable, Future Lab & African Room',
  'Pamper Lounge',
  'Reserved seating',
  'Concierge / dedicated registration',
  'Azizi Welcome Cocktail',
  'Executive Dinner Gala',
  'Private Executive Leadership',
  'Executive networking',
  'Extended private Q&A',
];

type Cell = 'yes' | 'no' | 'partial';

const MATRIX: Cell[][] = [
  ['partial', 'yes', 'yes', 'yes', 'yes'],
  ['no', 'no', 'no', 'yes', 'yes'],
  ['partial', 'yes', 'yes', 'yes', 'yes'],
  ['no', 'no', 'yes', 'yes', 'yes'],
  ['no', 'no', 'no', 'yes', 'yes'],
  ['no', 'no', 'yes', 'yes', 'yes'],
  ['no', 'no', 'no', 'yes', 'yes'],
  ['no', 'no', 'yes', 'yes', 'yes'],
  ['no', 'no', 'yes', 'yes', 'yes'],
  ['no', 'no', 'no', 'yes', 'yes'],
  ['no', 'no', 'no', 'yes', 'yes'],
  ['no', 'no', 'no', 'no', 'yes'],
  ['no', 'no', 'no', 'no', 'yes'],
];

const STANDALONE = [
  { label: 'Workshop Access', price: '₦250,000', desc: 'Expert-led practical workshops and curated small-group breakouts. Excludes the full conference programme.' },
  { label: 'Executive Dinner Gala Only', price: '₦250,000', desc: 'Dinner gala, curated dining and live entertainment. Excludes daytime conference and workshops.' },
];

const ADDITIONAL = [
  { label: 'Ubuntu — Group Access', price: 'Enquire', desc: 'Group booking for companies, associations and teams. Rates depend on the number of tickets and selected pass category. Qualifying groups receive coordinated booking support and attendee management.' },
  { label: 'Loyalty & Community', price: '10% off', desc: 'Available to returning guests who have attended Atinuda at least twice, and to verified APPOEMN members. Confirmed at checkout or via a dedicated code. Not applicable to Nuru passes.' },
  { label: 'Support Pass', price: '₦135,000', desc: 'Available at checkout with an Amani or Adé pass for an accompanying PA, assistant or content creator. Not sold separately. Does not grant access to experiences reserved for the primary pass holder.' },
];

// Until checkout is live, every Reserve button goes to the waitlist with the chosen pass attached.
const reserveHref = (pass: Pass) => `/7.0-waitlist?pass=${pass.id}`;

function PassNumber({ pass, dark }: { pass: Pass; dark?: boolean }) {
  const n = PASSES.indexOf(pass) + 1;
  return (
    <p className="pp-caps" style={{ color: dark ? COPPER_ON_DARK : COPPER, marginBottom: '20px' }}>
      {String(n).padStart(2, '0')} &nbsp;·&nbsp; {pass.tier}
    </p>
  );
}

function Price({ pass, dark, size = 'clamp(1.9rem, 2.6vw, 2.6rem)' }: { pass: Pass; dark?: boolean; size?: string }) {
  return (
    <div>
      <p style={{ ...saol, fontSize: size, lineHeight: 1, color: dark ? BG : INK }}>{pass.price}</p>
      {pass.early && (
        <p style={{ ...sans, fontSize: '13px', color: COPPER, marginTop: '10px' }}>
          Early bird {pass.early}
        </p>
      )}
    </div>
  );
}

function FeatureList({ pass, dark }: { pass: Pass; dark?: boolean }) {
  return (
    <ul className="pp-features" style={{ borderColor: dark ? 'rgba(244,245,243,0.14)' : '#DBDFDB' }}>
      {pass.features.map((f) => (
        <li key={f} style={{ color: dark ? 'rgba(244,245,243,0.82)' : '#3A403C', borderColor: dark ? 'rgba(244,245,243,0.08)' : '#E4E7E4' }}>
          {f}
        </li>
      ))}
    </ul>
  );
}

function Note({ pass, dark }: { pass: Pass; dark?: boolean }) {
  if (!pass.note) return null;
  return (
    <p style={{ ...sans, fontSize: '13px', lineHeight: 1.7, color: dark ? 'rgba(244,245,243,0.5)' : '#8D948E', marginTop: '20px', maxWidth: '520px' }}>
      {pass.note}
    </p>
  );
}

function Reserve({ pass, variant }: { pass: Pass; variant: 'outline' | 'solid' | 'light' }) {
  return (
    <Link href={reserveHref(pass)} className={`pp-btn pp-btn-${variant}`}>
      Reserve {pass.name}
    </Link>
  );
}

export default function PricingPage() {
  return (
    <div style={{ background: BG }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100svh', background: DARK, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Image
          src="/assets/motion/infinity-terrace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.52)' }} />

        <div className="pp-wrap" style={{ position: 'relative', zIndex: 1, paddingTop: '160px', paddingBottom: 'clamp(48px, 7vh, 88px)' }}>
          <p className="pp-caps" style={{ color: 'rgba(244,245,243,0.6)', marginBottom: '28px' }}>
            Atinuda 7.0 &nbsp;·&nbsp; 6–8 October 2027 &nbsp;·&nbsp; Lagos
          </p>
          <h1 style={{ ...saol, fontSize: 'clamp(3.6rem, 8.5vw, 10.5rem)', color: BG, lineHeight: 0.92, letterSpacing: '-0.025em', maxWidth: '1100px', marginBottom: '36px' }}>
            Five ways into<br />
            <em style={{ fontStyle: 'italic', fontWeight: 500, whiteSpace: 'nowrap' }}>Atinuda 7.0</em>
          </h1>
          <p style={{ ...sans, fontSize: '16px', lineHeight: 1.75, color: 'rgba(244,245,243,0.72)', maxWidth: '540px' }}>
            Each pass sets how much of the programme you join — from selected main-stage sessions to the full workshop programme, the Executive Dinner Gala and a private leadership session off-site.
          </p>
        </div>

        {/* Pass index */}
        <nav aria-label="Passes" className="pp-index" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(244,245,243,0.16)' }}>
          {PASSES.map((pass, i) => (
            <a key={pass.id} href={`#${pass.id}`} className="pp-index-item">
              <span className="pp-caps" style={{ color: i >= 3 ? COPPER_ON_DARK : 'rgba(244,245,243,0.45)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ ...saol, fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)', color: BG, lineHeight: 1 }}>{pass.name}</span>
              <span style={{ ...sans, fontSize: '13px', color: 'rgba(244,245,243,0.6)' }}>{pass.price}</span>
            </a>
          ))}
        </nav>
      </section>

      {/* ── THE CONFERENCE — NURU & SAFI ─────────────────────── */}
      <section className="pp-wrap" style={{ paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <div className="pp-group-head">
          <p className="pp-caps" style={{ color: '#8D948E' }}>01 – 02 &nbsp;·&nbsp; The conference</p>
          <p style={{ ...sans, fontSize: '16px', lineHeight: 1.7, color: '#5A615C', maxWidth: '560px' }}>
            Main-stage conversations and the networking spaces around them.
          </p>
        </div>

        <div className="pp-pair">
          {[NURU, SAFI].map((pass) => (
            <article key={pass.id} id={pass.id} className="pp-pair-item">
              <PassNumber pass={pass} />
              <h2 style={{ ...saol, fontSize: 'clamp(3.4rem, 6vw, 6rem)', color: INK, lineHeight: 0.9, letterSpacing: '-0.025em', marginBottom: '28px' }}>
                {pass.name}
              </h2>
              <Price pass={pass} />
              <FeatureList pass={pass} />
              <div style={{ marginTop: 'auto', paddingTop: '36px' }}>
                <Reserve pass={pass} variant="outline" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── THE FULL PROGRAMME — ZURI ────────────────────────── */}
      <section id={ZURI.id} style={{ background: BG_ALT }}>
        <div className="pp-split">
          <div className="pp-split-media" style={{ position: 'relative' }}>
            <Image
              src="/assets/images/summit/new-images/ATINUDA%20DAY%203_600.jpg"
              alt="A curated breakout group at Atinuda"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              quality={85}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="pp-split-body">
            <p className="pp-caps" style={{ color: '#8D948E', marginBottom: '40px' }}>The full programme</p>
            <PassNumber pass={ZURI} />
            <h2 style={{ ...saol, fontSize: 'clamp(4rem, 7.5vw, 8rem)', color: INK, lineHeight: 0.88, letterSpacing: '-0.03em', marginBottom: '32px' }}>
              {ZURI.name}
            </h2>
            <Price pass={ZURI} size="clamp(2.2rem, 3vw, 3rem)" />
            <FeatureList pass={ZURI} />
            <div style={{ paddingTop: '40px' }}>
              <Reserve pass={ZURI} variant="solid" />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE EXECUTIVE EXPERIENCE — AMANI & ADÉ ───────────── */}
      <section style={{ background: DARK }}>
        <div className="pp-wrap" style={{ paddingTop: 'clamp(96px, 12vw, 160px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
          <p className="pp-caps" style={{ color: COPPER_ON_DARK, marginBottom: '28px' }}>04 – 05 &nbsp;·&nbsp; The executive experience</p>
          <h2 style={{ ...saol, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(2.6rem, 5vw, 5.4rem)', color: BG, lineHeight: 1.02, maxWidth: '900px' }}>
            VIP registration, the Executive Dinner Gala and a private leadership session.
          </h2>
        </div>

        {/* Amani */}
        <article id={AMANI.id} className="pp-split pp-split-reverse" style={{ borderTop: '1px solid rgba(244,245,243,0.12)' }}>
          <div className="pp-split-media" style={{ position: 'relative' }}>
            <Image
              src="/assets/images/summit/new-images/IMG_7378L.jpg"
              alt="Executive panel at Atinuda"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              quality={85}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="pp-split-body">
            <PassNumber pass={AMANI} dark />
            <h3 style={{ ...saol, fontSize: 'clamp(4.4rem, 8vw, 9rem)', color: BG, lineHeight: 0.88, letterSpacing: '-0.03em', marginBottom: '32px' }}>
              {AMANI.name}
            </h3>
            <Price pass={AMANI} dark size="clamp(2.2rem, 3vw, 3rem)" />
            <FeatureList pass={AMANI} dark />
            <Note pass={AMANI} dark />
            <div style={{ paddingTop: '40px' }}>
              <Reserve pass={AMANI} variant="light" />
            </div>
          </div>
        </article>

        {/* Adé */}
        <article id={ADE.id}>
          <div style={{ position: 'relative', height: 'clamp(520px, 88vh, 920px)', overflow: 'hidden' }}>
            <Image
              src="/assets/images/summit/new-images/IMG_7600L.jpg"
              alt="A private executive roundtable at Atinuda"
              fill
              sizes="100vw"
              quality={90}
              style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.58)' }} />
            <div className="pp-wrap" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'clamp(40px, 6vw, 80px)' }}>
              <p className="pp-caps" style={{ color: BG, marginBottom: '20px' }}>
                05 &nbsp;·&nbsp; {ADE.tier}
              </p>
              <h3 style={{ ...saol, fontSize: 'clamp(6rem, 16vw, 17rem)', color: BG, lineHeight: 0.82, letterSpacing: '-0.035em' }}>
                {ADE.name}
              </h3>
            </div>
          </div>

          <div className="pp-wrap pp-ade-body">
            <div>
              <Price pass={ADE} dark size="clamp(2.8rem, 4vw, 4.2rem)" />
              <div style={{ paddingTop: '36px' }}>
                <Reserve pass={ADE} variant="light" />
              </div>
            </div>
            <div>
              <FeatureList pass={ADE} dark />
              <Note pass={ADE} dark />
            </div>
          </div>
        </article>
      </section>

      {/* ── COMPARE ──────────────────────────────────────────── */}
      <section id="compare" className="pp-wrap" style={{ paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <div className="pp-group-head">
          <p className="pp-caps" style={{ color: '#8D948E' }}>Compare passes</p>
          <h2 style={{ ...saol, fontSize: 'clamp(2.4rem, 4vw, 4.4rem)', color: INK, lineHeight: 1.04, maxWidth: '620px' }}>
            What each pass includes.
          </h2>
        </div>

        <div className="pp-table-scroll">
          <table className="pp-table">
            <thead>
              <tr>
                <th scope="col" className="pp-caps" style={{ color: '#8D948E', textAlign: 'left', fontWeight: 400 }}>Benefit</th>
                {PASSES.map((pass, i) => (
                  <th key={pass.id} scope="col">
                    <span style={{ ...saol, display: 'block', fontSize: '1.6rem', color: INK, fontWeight: 400, lineHeight: 1 }}>{pass.name}</span>
                    <span style={{ ...sans, display: 'block', fontSize: '12px', color: i >= 3 ? COPPER : '#8D948E', fontWeight: 400, marginTop: '8px' }}>{pass.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, fi) => (
                <tr key={feature}>
                  <th scope="row" style={{ ...sans, fontSize: '14px', color: '#3A403C', fontWeight: 400, textAlign: 'left' }}>{feature}</th>
                  {MATRIX[fi].map((val, pi) => (
                    <td key={pi}>
                      {val === 'yes' && <span className="pp-dot" aria-label="Included" />}
                      {val === 'partial' && <span className="pp-dot pp-dot-partial" aria-label="Selected sessions only" />}
                      {val === 'no' && <span className="pp-dash" aria-label="Not included" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pp-legend">
          <span><span className="pp-dot" /> Included</span>
          <span><span className="pp-dot pp-dot-partial" /> Selected sessions and associated networking areas only</span>
        </div>
        <p style={{ ...sans, fontSize: '13px', lineHeight: 1.8, color: '#8D948E', marginTop: '12px', maxWidth: '760px' }}>
          Seating: Zuri — general; Amani — VIP; Adé — priority. Registration: Nuru and Safi — standard; Zuri — concierge; Amani — VIP; Adé — VVIP.
        </p>
      </section>

      {/* ── SINGLE EXPERIENCES & ADDITIONAL OPTIONS ──────────── */}
      <section style={{ background: BG_ALT }}>
        <div className="pp-wrap pp-standalone" style={{ paddingTop: 'clamp(80px, 10vw, 128px)', paddingBottom: 'clamp(56px, 7vw, 88px)' }}>
          <div>
            <p className="pp-caps" style={{ color: '#8D948E', marginBottom: '24px' }}>Single experiences</p>
            <h2 style={{ ...saol, fontSize: 'clamp(2.2rem, 3.6vw, 3.8rem)', color: INK, lineHeight: 1.06, maxWidth: '420px' }}>
              One part of the programme, without a full pass.
            </h2>
          </div>
          <div>
            {STANDALONE.map((item) => (
              <div key={item.label} className="pp-line-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', marginBottom: '10px' }}>
                  <p style={{ ...sans, fontSize: '16px', fontWeight: 600, color: INK }}>{item.label}</p>
                  <p style={{ ...saol, fontSize: '1.7rem', color: INK, whiteSpace: 'nowrap' }}>{item.price}</p>
                </div>
                <p style={{ ...sans, fontSize: '14px', lineHeight: 1.7, color: '#5A615C', maxWidth: '520px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-wrap">
          <div className="pp-additional">
            {ADDITIONAL.map((item) => (
              <div key={item.label}>
                <p className="pp-caps" style={{ color: '#8D948E', marginBottom: '20px' }}>{item.label}</p>
                <p style={{ ...saol, fontSize: 'clamp(2rem, 2.6vw, 2.6rem)', color: INK, lineHeight: 1, marginBottom: '18px' }}>{item.price}</p>
                <p style={{ ...sans, fontSize: '14px', lineHeight: 1.75, color: '#5A615C' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────────────────────── */}
      <section style={{ background: DARK, textAlign: 'center' }}>
        <div className="pp-wrap" style={{ paddingTop: 'clamp(104px, 13vw, 176px)', paddingBottom: 'clamp(104px, 13vw, 176px)' }}>
          <p className="pp-caps" style={{ color: 'rgba(244,245,243,0.45)', marginBottom: '40px' }}>
            Atinuda 7.0 &nbsp;·&nbsp; 6–8 October 2027 &nbsp;·&nbsp; Lagos
          </p>
          <h2 style={{ ...saol, fontSize: 'clamp(3.4rem, 8vw, 9.5rem)', color: BG, lineHeight: 0.92, letterSpacing: '-0.025em', marginBottom: '32px' }}>
            Reserve your pass.
          </h2>
          <p style={{ ...sans, fontSize: '16px', lineHeight: 1.7, color: 'rgba(244,245,243,0.6)', maxWidth: '460px', margin: '0 auto 56px' }}>
            Nuru is <span style={{ color: COPPER_ON_DARK }}>₦155,000</span> until 31 December 2026. Group bookings for companies and associations are available through Ubuntu.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/7.0-waitlist" className="pp-btn pp-btn-light">
              Join the Waitlist
            </Link>
            <a href="#compare" className="pp-text-link">Compare passes ↑</a>
          </div>
        </div>
      </section>

      <style>{`
        .pp-wrap { padding-left: clamp(24px, 5.5vw, 80px); padding-right: clamp(24px, 5.5vw, 80px); }
        .pp-caps { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; }
        article[id], section[id] { scroll-margin-top: 72px; }

        .pp-index { display: grid; grid-template-columns: repeat(5, 1fr); }
        .pp-index-item { display: flex; flex-direction: column; gap: 12px; padding: 28px clamp(16px, 2vw, 32px); text-decoration: none; border-right: 1px solid rgba(244,245,243,0.12); transition: background 0.3s ease; }
        .pp-index-item:first-child { padding-left: clamp(24px, 5.5vw, 80px); }
        .pp-index-item:last-child { border-right: none; }
        .pp-index-item:hover { background: rgba(244,245,243,0.06); }

        .pp-group-head { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; padding-bottom: 40px; border-bottom: 1px solid #DBDFDB; margin-bottom: 0; }

        .pp-pair { display: grid; grid-template-columns: 1fr 1fr; }
        .pp-pair-item { display: flex; flex-direction: column; padding: clamp(48px, 6vw, 80px) clamp(24px, 4vw, 64px) 0 0; }
        .pp-pair-item + .pp-pair-item { border-left: 1px solid #DBDFDB; padding-left: clamp(24px, 4vw, 64px); padding-right: 0; }

        .pp-split { display: grid; grid-template-columns: 5fr 6fr; min-height: 720px; }
        .pp-split-reverse .pp-split-media { order: 2; }
        .pp-split-body { padding: clamp(56px, 7vw, 112px) clamp(24px, 5.5vw, 96px); display: flex; flex-direction: column; justify-content: center; }
        .pp-split-media { min-height: 480px; }

        .pp-ade-body { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(40px, 6vw, 96px); padding-top: clamp(56px, 7vw, 96px); padding-bottom: clamp(96px, 12vw, 160px); }

        .pp-features { list-style: none; margin: 32px 0 0; padding: 0; border-top: 1px solid; }
        .pp-features li { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 15px; line-height: 1.55; padding: 14px 0; border-bottom: 1px solid; }
        .pp-features li:last-child { border-bottom: none; }

        .pp-btn { display: inline-block; font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; text-decoration: none; padding: 17px 44px; border-radius: 0; transition: opacity 0.25s ease, background 0.25s ease, color 0.25s ease; }
        .pp-btn-outline { color: ${INK}; border: 1px solid ${INK}; background: transparent; }
        .pp-btn-outline:hover { background: ${INK}; color: ${BG}; }
        .pp-btn-solid { color: ${BG}; background: ${INK}; border: 1px solid ${INK}; }
        .pp-btn-solid:hover { opacity: 0.85; }
        .pp-btn-light { color: ${DARK}; background: ${BG}; border: 1px solid ${BG}; }
        .pp-btn-light:hover { background: ${COPPER_ON_DARK}; border-color: ${COPPER_ON_DARK}; color: ${DARK}; }

        .pp-text-link { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.6); text-decoration: none; }
        .pp-text-link:hover { color: ${BG}; }

        .pp-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .pp-table { width: 100%; min-width: 720px; border-collapse: collapse; }
        .pp-table thead th { padding: 40px 8px 24px; text-align: center; border-bottom: 1px solid #DBDFDB; vertical-align: bottom; }
        .pp-table thead th:first-child { padding-left: 0; width: 34%; }
        .pp-table tbody th { padding: 18px 16px 18px 0; line-height: 1.4; }
        .pp-table tbody td { text-align: center; padding: 18px 8px; }
        .pp-table tbody tr { border-bottom: 1px solid #E4E7E4; }
        .pp-table tbody td:nth-child(5), .pp-table tbody td:nth-child(6), .pp-table thead th:nth-child(5), .pp-table thead th:nth-child(6) { background: rgba(181,98,42,0.05); }

        .pp-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${INK}; vertical-align: middle; }
        .pp-dot-partial { background: transparent; border: 1px solid ${INK}; }
        .pp-dash { display: inline-block; width: 12px; height: 1px; background: #B7BBB7; vertical-align: middle; }
        .pp-legend { display: flex; flex-wrap: wrap; gap: 12px 32px; margin-top: 32px; font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 13px; color: #5A615C; }
        .pp-legend > span { display: inline-flex; align-items: center; gap: 10px; }

        .pp-standalone { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 96px); align-items: start; }
        .pp-line-item { padding: 28px 0; border-bottom: 1px solid #DBDFDB; }
        .pp-line-item:first-child { padding-top: 0; }
        .pp-line-item:last-child { border-bottom: none; }

        .pp-additional { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #DBDFDB; padding-bottom: clamp(80px, 10vw, 128px); }
        .pp-additional > div { padding: clamp(40px, 5vw, 64px) clamp(24px, 3vw, 48px) 0; }
        .pp-additional > div:first-child { padding-left: 0; }
        .pp-additional > div + div { border-left: 1px solid #DBDFDB; }

        @media (max-width: 900px) {
          .pp-index { grid-template-columns: 1fr; }
          .pp-index-item { flex-direction: row; align-items: baseline; justify-content: space-between; padding: 16px 24px !important; border-right: none; border-bottom: 1px solid rgba(244,245,243,0.12); }
          .pp-index-item:last-child { border-bottom: none; }
          .pp-index-item > span:nth-child(2) { flex: 1; padding-left: 16px; }

          .pp-group-head { grid-template-columns: 1fr; gap: 16px; }
          .pp-pair { grid-template-columns: 1fr; }
          .pp-pair-item { padding: 48px 0 !important; }
          .pp-pair-item + .pp-pair-item { border-left: none; border-top: 1px solid #DBDFDB; }

          .pp-split { grid-template-columns: 1fr; min-height: 0; }
          .pp-split-reverse .pp-split-media { order: 0; }
          .pp-split-media { min-height: 0; aspect-ratio: 4 / 3; }

          .pp-ade-body { grid-template-columns: 1fr; }
          .pp-standalone { grid-template-columns: 1fr; }
          .pp-additional { grid-template-columns: 1fr; }
          .pp-additional > div { padding: 40px 0 0 !important; }
          .pp-additional > div + div { border-left: none; border-top: 1px solid #DBDFDB; margin-top: 40px; }
        }
      `}</style>
    </div>
  );
}
