import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ticket Options | Atinuda 7.0',
  description: 'Five thoughtfully curated ways to experience Atinuda 7.0. Lagos, October 2027.',
};

const cg   = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic' as const };
const hg   = { fontFamily: '"Hanken Grotesk", system-ui, sans-serif' };
const INK  = '#0a0a0a';
const WHITE = '#ffffff';

const PASSES = [
  {
    name:  'Nuru',
    tier:  'Essential Experience',
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
    name:  'Safi',
    tier:  'Conference Experience',
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
    name:  'Zuri',
    tier:  'Enhanced Experience',
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
    name:  'Amani',
    tier:  'Signature Experience',
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
    name:  'Adé',
    tier:  'Prestige Experience',
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

type Cell = '✓' | '✗' | 'partial';

const MATRIX: Cell[][] = [
  ['partial', '✓', '✓', '✓', '✓'],
  ['✗', '✗', '✗', '✓', '✓'],
  ['partial', '✓', '✓', '✓', '✓'],
  ['✗', '✗', '✓', '✓', '✓'],
  ['✗', '✗', '✗', '✓', '✓'],
  ['✗', '✗', '✓', '✓', '✓'],
  ['✗', '✗', '✗', '✓', '✓'],
  ['✗', '✗', '✓', '✓', '✓'],
  ['✗', '✗', '✓', '✓', '✓'],
  ['✗', '✗', '✗', '✓', '✓'],
  ['✗', '✗', '✗', '✓', '✓'],
  ['✗', '✗', '✗', '✗', '✓'],
  ['✗', '✗', '✗', '✗', '✓'],
];

export default function PricingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '100dvh', overflow: 'hidden', background: INK }}>
        <Image
          src="/assets/motion/infinity-terrace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.28) 55%, rgba(10,10,10,0.1) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(40px, 6vh, 80px) clamp(28px, 5.5vw, 80px)',
        }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.44em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
            Atinuda 7.0 &nbsp;·&nbsp; Ticket Options
          </p>
          <h1 style={{ ...cg, fontSize: 'clamp(4rem, 8.5vw, 11rem)', color: WHITE, lineHeight: 0.92, letterSpacing: '-0.025em', maxWidth: '1000px', marginBottom: '40px' }}>
            Choose Your<br />Atinuda Experience
          </h1>
          <p style={{ ...hg, fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '480px', lineHeight: 1.75 }}>
            Five thoughtfully curated ways to experience Atinuda 7.0. A distinct level of participation, learning and connection at each tier.
          </p>
        </div>
      </section>

      {/* ── DATE STRIP ───────────────────────────────────────── */}
      <div style={{
        background: WHITE,
        borderBottom: '1px solid rgba(10,10,10,0.08)',
        padding: '22px clamp(28px, 5.5vw, 80px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.38)' }}>
          October 6–8, 2027 &nbsp;·&nbsp; Lagos, Nigeria
        </p>
        <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.38)' }}>
          Five passes &nbsp;·&nbsp; One room
        </p>
      </div>

      {/* ── PASSES ───────────────────────────────────────────── */}
      <section style={{ background: WHITE }}>
        {PASSES.map((pass, i) => (
          <div
            key={pass.name}
            style={{
              borderBottom: '1px solid rgba(10,10,10,0.08)',
              padding: 'clamp(48px, 7vw, 96px) clamp(28px, 5.5vw, 80px)',
            }}
          >
            {/* Top row — number + name + price */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '36px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(20px, 3vw, 48px)' }}>
                <span style={{ ...hg, fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(10,10,10,0.25)', paddingBottom: '8px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 style={{
                  ...cg,
                  fontSize: 'clamp(4rem, 8vw, 10rem)',
                  color: INK,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                }}>
                  {pass.name}
                </h2>
              </div>
              <div style={{ textAlign: 'right', paddingBottom: '8px' }}>
                <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', marginBottom: '8px' }}>
                  {pass.tier}
                </p>
                <p style={{ ...cg, fontSize: 'clamp(1.8rem, 3vw, 3rem)', color: INK, lineHeight: 1 }}>
                  {pass.price}
                </p>
                {pass.early && (
                  <p style={{ ...hg, fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '6px', fontStyle: 'italic' }}>
                    Early bird: {pass.early}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom row — features + CTA */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '40px',
              alignItems: 'end',
            }}
              className="pass-bottom"
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px' }}>
                {pass.features.map((f) => (
                  <span key={f} style={{
                    ...hg,
                    fontSize: '13px',
                    color: 'rgba(10,10,10,0.55)',
                    lineHeight: 1.6,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}>
                    <span style={{ color: 'rgba(10,10,10,0.2)', flexShrink: 0 }}>—</span>
                    {f}
                  </span>
                ))}
                {pass.note && (
                  <p style={{ ...hg, fontSize: '11px', color: 'rgba(10,10,10,0.3)', fontStyle: 'italic', lineHeight: 1.6, width: '100%', marginTop: '4px' }}>
                    {pass.note}
                  </p>
                )}
              </div>
              <Link
                href="/7.0-waitlist"
                style={{
                  ...hg,
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: INK,
                  textDecoration: 'none',
                  border: '1px solid rgba(10,10,10,0.3)',
                  padding: '14px 40px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Reserve
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── FULL-BLEED IMAGE BREAK ────────────────────────────── */}
      <div style={{ position: 'relative', height: 'clamp(400px, 55vw, 720px)', overflow: 'hidden' }}>
        <Image
          src="/assets/motion/yacht-motion.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.18)' }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(32px, 4vw, 56px) clamp(28px, 5.5vw, 80px)',
        }}>
          <p style={{ ...cg, fontSize: 'clamp(1.8rem, 3.5vw, 4rem)', color: WHITE, lineHeight: 1.1, maxWidth: '680px' }}>
            "From selected conference conversations to a fully hosted executive experience — each pass offers a distinct level of participation."
          </p>
        </div>
      </div>

      {/* ── COMPARISON MATRIX ────────────────────────────────── */}
      <section style={{ background: INK, padding: 'clamp(64px, 8vw, 112px) clamp(28px, 5.5vw, 80px)' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.44em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>
            Benefits Matrix
          </p>
          <h2 style={{ ...cg, fontSize: 'clamp(2.6rem, 4.5vw, 5.5rem)', color: WHITE, lineHeight: 1.02, maxWidth: '560px' }}>
            Compare your benefits at a glance.
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ ...hg, fontSize: '9px', letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 400, textAlign: 'left', padding: '0 0 20px', width: '38%' }}>
                  Benefit
                </th>
                {['Nuru', 'Safi', 'Zuri', 'Amani', 'Adé'].map((n) => (
                  <th key={n} style={{ ...hg, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: WHITE, fontWeight: 500, textAlign: 'center', padding: '0 0 20px' }}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, fi) => (
                <tr key={feature} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...hg, fontSize: '13px', color: 'rgba(255,255,255,0.45)', padding: '17px 0', lineHeight: 1.4 }}>
                    {feature}
                  </td>
                  {MATRIX[fi].map((val, pi) => (
                    <td key={pi} style={{ textAlign: 'center', padding: '17px 0' }}>
                      {val === '✓'      && <span style={{ color: WHITE, fontSize: '14px' }}>✓</span>}
                      {val === 'partial' && <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>✓*</span>}
                      {val === '✗'      && <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '13px' }}>✗</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ ...hg, fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '28px', lineHeight: 1.7 }}>
          ✓* Limited to selected sessions and associated networking areas. &nbsp;·&nbsp; Seating: Zuri — general; Amani — VIP; Adé — priority. &nbsp;·&nbsp; Registration: Nuru/Safi — standard; Zuri — concierge; Amani — VIP; Adé — VVIP.
        </p>
      </section>

      {/* ── STANDALONE & ADDITIONAL ──────────────────────────── */}
      <section style={{ background: WHITE }}>

        {/* Standalone tickets */}
        <div style={{
          padding: 'clamp(56px, 7vw, 96px) clamp(28px, 5.5vw, 80px)',
          borderBottom: '1px solid rgba(10,10,10,0.08)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(24px, 4vw, 80px)',
          alignItems: 'start',
        }}
          className="standalone-grid"
        >
          <div>
            <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.44em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.32)', marginBottom: '28px' }}>
              Standalone Options
            </p>
            <h2 style={{ ...cg, fontSize: 'clamp(2.4rem, 4vw, 5rem)', color: INK, lineHeight: 1.04, maxWidth: '380px' }}>
              Access specific experiences without a full pass.
            </h2>
          </div>
          <div>
            {[
              { label: 'Workshop Access', price: '₦250,000', desc: 'Expert-led practical workshops and curated small-group breakouts. Excludes the full conference programme.' },
              { label: 'Executive Dinner Gala Only', price: '₦250,000', desc: 'Dinner gala, curated dining and live entertainment. Excludes daytime conference and workshops.' },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ padding: '28px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(10,10,10,0.07)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
                  <p style={{ ...hg, fontSize: '14px', fontWeight: 600, color: INK }}>{item.label}</p>
                  <p style={{ ...cg, fontSize: '1.4rem', color: INK, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.price}</p>
                </div>
                <p style={{ ...hg, fontSize: '13px', color: 'rgba(10,10,10,0.45)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional three-column */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottom: '1px solid rgba(10,10,10,0.08)',
        }}
          className="additional-grid"
        >
          {[
            { label: 'Ubuntu — Group Access', price: 'Enquire', desc: 'Group booking for companies, associations and teams. Rates depend on the number of tickets and selected pass category. Qualifying groups receive coordinated booking support and attendee management.' },
            { label: 'Loyalty & Community', price: '10% off', desc: 'Available to returning guests who have attended Atinuda at least twice, and to verified APPOEMN members. Confirmed at checkout or via a dedicated code. Not applicable to Nuru passes.' },
            { label: 'Support Pass', price: '₦135,000', desc: 'Available at checkout with an Amani or Adé pass for an accompanying PA, assistant or content creator. Not sold separately. Does not grant access to experiences reserved for the primary pass holder.' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              padding: 'clamp(36px, 5vw, 64px) clamp(24px, 3.5vw, 48px)',
              borderRight: i < arr.length - 1 ? '1px solid rgba(10,10,10,0.08)' : 'none',
            }}>
              <p style={{ ...hg, fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.28)', marginBottom: '20px' }}>
                {item.label}
              </p>
              <p style={{ ...cg, fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: INK, marginBottom: '16px', lineHeight: 1 }}>
                {item.price}
              </p>
              <p style={{ ...hg, fontSize: '13px', color: 'rgba(10,10,10,0.45)', lineHeight: 1.75 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECOND IMAGE BREAK ───────────────────────────────── */}
      <div style={{ position: 'relative', height: 'clamp(360px, 45vw, 600px)', overflow: 'hidden' }}>
        <Image
          src="/assets/motion/future-building.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.22)' }} />
      </div>

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section style={{
        background: INK,
        padding: 'clamp(96px, 12vw, 160px) clamp(28px, 5.5vw, 80px)',
        textAlign: 'center',
      }}>
        <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.44em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '44px' }}>
          Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; October 2027
        </p>
        <h2 style={{ ...cg, fontSize: 'clamp(4rem, 9vw, 12rem)', color: WHITE, lineHeight: 0.9, letterSpacing: '-0.025em', marginBottom: '60px' }}>
          Reserve your place<br />before doors open.
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/7.0-waitlist" style={{ ...hg, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: WHITE, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.42)', padding: '17px 60px' }}>
            Join the Waitlist
          </Link>
          <Link href="/pricing" style={{ ...hg, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '17px 0' }}>
            Review all passes ↑
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .pass-bottom { grid-template-columns: 1fr !important; }
          .standalone-grid { grid-template-columns: 1fr !important; }
          .additional-grid { grid-template-columns: 1fr !important; }
          .additional-grid > div { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.08); }
        }
      `}</style>
    </>
  );
}
