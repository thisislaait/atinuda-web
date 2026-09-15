import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { PillarsSection } from '@/sections/home/PillarsSection';
import { CinematicHero } from '@/sections/home/CinematicHero';
import { TheRoomSection } from '@/sections/home/TheRoomSection';

const FOOTER_NAV = [
  {
    heading: 'The Platform',
    links: [
      { name: 'Our Story',         path: '/our-story' },
      { name: 'LTG Summit',        path: '/local-to-global-summit-2025' },
      { name: 'Elevation Retreat', path: '/elevation-2026' },
      { name: 'Spark the Future',  path: '/spark-the-future' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { name: 'Membership',             path: '/membership' },
      { name: 'Join the Waitlist',      path: '/join-the-waitlist' },
      { name: 'Corp. Responsibility',   path: '/corporate-responsibility' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { name: 'Careers',        path: '/careers' },
      { name: 'Press',          path: '/press' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Legal',          path: '/legal' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Atinuda 7.0 | The New Standard',
  description:
    "Atinuda 7.0 — the platform connecting Africa's most influential creators, founders, and executives. Join the waitlist.",
  openGraph: {
    title: 'Atinuda 7.0 | The New Standard',
    description: "A platform for Africa's most influential voices. Join the room.",
    images: [{ url: '/assets/images/Mauritius2.png' }],
  },
};

const sd     = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const INK50  = 'rgba(27,30,28,0.5)';
const INK30  = 'rgba(27,30,28,0.3)';
const INK08  = 'rgba(27,30,28,0.08)';
const COPPER = '#b5622a';
const BG     = '#F4F5F3';
const BGALT  = '#ECEEED';


export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <CinematicHero />

      {/* ── TOMORROW, NOW ─────────────────────────────────────── */}
      <section style={{ background: BG, borderTop: `1px solid rgba(27,30,28,0.07)`, overflow: 'hidden' }}>

        {/* Ticker strip */}
        <div style={{ borderTop: `1px solid ${INK08}`, borderBottom: `1px solid ${INK08}`, padding: '15px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', animation: 'ticker 32s linear infinite', willChange: 'transform' }}>
            {[0, 1].map(i => (
              <p
                key={i}
                aria-hidden={i === 1 ? true : undefined}
                style={{
                  ...sans,
                  display: 'block',
                  flexShrink: 0,
                  margin: 0,
                  paddingRight: '96px',
                  fontSize: '11px',
                  letterSpacing: '0.26em',
                  color: INK50,
                  textTransform: 'uppercase' as const,
                  whiteSpace: 'nowrap' as const,
                }}
              >
                FASHION / DESIGN / HOSPITALITY / TECHNOLOGY / CAPITAL / CULTURE / CRAFT / LUXURY
              </p>
            ))}
          </div>
        </div>

        {/* Two-col editorial */}
        <div style={{ padding: '100px 0 120px' }}>
          <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-start">

              <div className="md:sticky md:top-32">
                <p
                  className="nav-text uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(27,30,28,0.32)', marginBottom: '32px' }}
                >
                  Tomorrow, Now · 2027
                </p>
                <h2
                  style={{
                    ...sd,
                    fontSize: 'clamp(2.6rem, 4.5vw, 5rem)',
                    color: INK,
                    lineHeight: '1.06',
                  }}
                >
                  Africa&apos;s future<br />is already<br />in motion.
                </h2>
              </div>

              <div style={{ paddingTop: '4px' }}>
                <p
                  style={{
                    fontSize: '20px',
                    lineHeight: '1.75',
                    color: 'rgba(27,30,28,0.68)',
                    marginBottom: '28px',
                    fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                  }}
                >
                  <em style={{ fontStyle: 'italic', color: INK, fontFamily: 'SaolDisplay, Georgia, serif' }}>Átinúdá</em>, meaning to rise, to ascend, to be lifted by the work
                  and the room you keep. Seven editions in, the name still says everything.
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.85',
                    color: 'rgba(27,30,28,0.5)',
                    marginBottom: '56px',
                    fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                  }}
                >
                  7.0 is not a conference you attend. It is an experience through time.
                  Three days of immersive sessions, private roundtables, creative dinners and
                  investment conversations that outlast the weekend. Built for the founders,
                  executives and creatives who are already designing what comes next.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    background: INK08,
                  }}
                >
                  {[
                    { n: '7', label: 'Editions' },
                    { n: '6+', label: 'Cities' },
                    { n: '20+', label: 'Countries' },
                  ].map(({ n, label }) => (
                    <div key={label} style={{ background: BG, padding: '32px 24px' }}>
                      <p style={{ ...sd, fontSize: '3.2rem', color: INK, lineHeight: 1 }}>{n}</p>
                      <p
                        className="nav-text uppercase"
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.25em',
                          color: 'rgba(27,30,28,0.32)',
                          marginTop: '10px',
                        }}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .closing-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          .closing-footer { border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 48px !important; }
        }
      `}</style>

      {/* ── THREE PILLARS ─────────────────────────────────────── */}
      <PillarsSection />

      {/* ── THE ROOM ──────────────────────────────────────────── */}
      <TheRoomSection />

      {/* ── CLOSING: CTA + FOOTER ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: '100px 0 72px' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Mauritius2.png"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(27,30,28,0.92)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div className="closing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

            {/* ── Left: CTA ── */}
            <div>
              <p
                className="nav-text uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.32)', marginBottom: '36px' }}
              >
                Atinuda 7.0 · 2027
              </p>
              <h2
                style={{
                  ...sd,
                  fontSize: 'clamp(2.8rem, 5vw, 5.8rem)',
                  color: '#fff',
                  lineHeight: '0.94',
                  marginBottom: '32px',
                }}
              >
                Lagos will set<br />the standard<br />for influence.
              </h2>
              <p
                style={{
                  ...sans,
                  fontSize: '16px',
                  lineHeight: '1.75',
                  color: 'rgba(255,255,255,0.48)',
                  marginBottom: '48px',
                  maxWidth: '380px',
                }}
              >
               The platform that connects Africa's most influential creators , founders & executives , on the continent, in the diaspora & across the world.
              </p>
              <Link
                href="/7.0-waitlist"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: COPPER,
                  color: '#fff',
                  padding: '16px 40px',
                  ...sans,
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Become a Member
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* ── Right: Footer ── */}
            <div
              className="closing-footer"
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '36px',
              }}
            >
              {/* Logo */}
              <Link href="/" style={{ display: 'inline-block' }}>
                <Image
                  src="/assets/images/whitelogo.png"
                  alt="Atinuda"
                  width={120}
                  height={38}
                  style={{ objectFit: 'contain' }}
                />
              </Link>

              {/* Nav columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {FOOTER_NAV.map((col) => (
                  <div key={col.heading}>
                    <p
                      className="nav-text uppercase"
                      style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', marginBottom: '14px' }}
                    >
                      {col.heading}
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }}>
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.path}
                            style={{ ...sans, fontSize: '12px', color: 'rgba(255,255,255,0.52)', textDecoration: 'none' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ ...sans, fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                  © {new Date().getFullYear()} Atinuda. Produced by Oaken Events.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { href: 'https://instagram.com/atinuda_',        Icon: Instagram, label: 'Instagram' },
                    { href: 'https://linkedin.com/company/atinuda',  Icon: Linkedin,  label: 'LinkedIn'  },
                    { href: 'https://twitter.com/atinuda_',          Icon: Twitter,   label: 'Twitter'   },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{ color: 'rgba(255,255,255,0.38)', display: 'flex' }}
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
