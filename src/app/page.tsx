import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { PillarsSection } from '@/sections/home/PillarsSection';
import { CinematicHero } from '@/sections/home/CinematicHero';
import { TheRoomSection } from '@/sections/home/TheRoomSection';
import { SpeakersSection } from '@/sections/home/SpeakersSection';
import { TracksSection } from '@/sections/home/TracksSection';
import { StatsSection } from '@/sections/home/StatsSection';
import { ParallaxBreak } from '@/components/ParallaxBreak';

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
  title: 'Atinuda 7.0 | The Architecture of Scale',
  description:
    "Atinuda 7.0. The definitive institutional platform for Sub-Saharan Africa's Experiential Economy. Lagos, October 2027.",
  openGraph: {
    title: 'Atinuda 7.0 | The Architecture of Scale',
    description: "The definitive institutional platform for Sub-Saharan Africa's Experiential Economy. Lagos, October 2027.",
    images: [{ url: '/assets/images/Mauritius2.png' }],
  },
};

const sd     = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const COPPER = '#b5622a';

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <CinematicHero />

      {/* ── SPEAKERS ──────────────────────────────────────────── */}
      <SpeakersSection />

      <div style={{ height: '96px', background: '#F4F5F3' }} />

      {/* ── STATS ─────────────────────────────────────────────── */}
      <StatsSection />

      <div style={{ height: '96px', background: '#F4F5F3' }} />

      {/* ── THE PLATFORM ─────────────────────────────────────── */}
      <PillarsSection />

      <div style={{ height: '96px', background: '#F4F5F3' }} />

      {/* ── TRACKS ───────────────────────────────────────────── */}
      <TracksSection />

      <div style={{ height: '96px', background: '#F4F5F3' }} />

      {/* ── THE ROOM ──────────────────────────────────────────── */}
      <TheRoomSection />

      <div style={{ height: '96px', background: '#F4F5F3' }} />

      {/* ── CLOSING CTA ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: '160px 0 140px' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Mauritius2.png"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(27,30,28,0.88)' }} />
        </div>

        <div
          className="relative z-10"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 clamp(28px, 5.5vw, 80px)',
          }}
        >
          <p style={{
            ...sans,
            fontSize: '10px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            marginBottom: '48px',
          }}>
            Atinuda 7.0 · Lagos · 2027
          </p>

          <h2 style={{
            ...sd,
            fontSize: 'clamp(3.4rem, 7vw, 8.5rem)',
            color: '#fff',
            lineHeight: '0.94',
            marginBottom: '48px',
            maxWidth: '860px',
          }}>
            The room is in Lagos.
          </h2>

          <p style={{
            ...sans,
            fontSize: '16px',
            lineHeight: '1.85',
            color: 'rgba(255,255,255,0.44)',
            maxWidth: '540px',
            marginBottom: '64px',
          }}>
            Lagos is where the continent&apos;s fashion, hospitality, design and events sectors concentrate. Atinuda 7.0 brings their founders, creative directors and investors into one room for three days.
          </p>

          <Link
            href="/7.0-waitlist"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(255,255,255,0.55)',
              background: 'transparent',
              color: '#fff',
              padding: '16px 56px',
              ...sans,
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              textDecoration: 'none',
              marginBottom: '120px',
            }}
          >
            Become a Member
          </Link>

          <div style={{ width: '100%', maxWidth: '900px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '64px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '48px' }}>

              <Link href="/" style={{ display: 'inline-block', flexShrink: 0 }}>
                <Image
                  src="/assets/images/whitelogo.png"
                  alt="Atinuda"
                  width={110}
                  height={34}
                  style={{ objectFit: 'contain' }}
                />
              </Link>

              <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', textAlign: 'left' }}>
                {FOOTER_NAV.map((col) => (
                  <div key={col.heading}>
                    <p style={{
                      ...sans,
                      fontSize: '9px',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.28)',
                      marginBottom: '16px',
                    }}>
                      {col.heading}
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', margin: 0, padding: 0 }}>
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.path}
                            style={{ ...sans, fontSize: '12px', color: 'rgba(255,255,255,0.44)', textDecoration: 'none' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '56px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <p style={{ ...sans, fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
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
                    style={{ color: 'rgba(255,255,255,0.35)', display: 'flex' }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
