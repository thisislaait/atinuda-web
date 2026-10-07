'use client';

import Image from 'next/image';

const sd     = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const COPPER = '#b5622a';
const BG     = '#F4F5F3';
const BGALT  = '#ECEEED';

const CHAPTERS = [
  {
    number: '01',
    title: 'The Sector',
    body: "Sub-Saharan Africa's fashion, hospitality, events and design sectors generate measurable capital, employment and cultural export. The industry has no formal institution. Atinuda is building one.",
    image: '/assets/images/summit/GM5_1315.JPG',
  },
  {
    number: '02',
    title: 'The Operators',
    body: "The sector's leaders are not hard to find. What is rare is uninterrupted time with the people whose decisions have direct bearing on yours. Atinuda is where that time exists.",
    image: '/assets/images/summit/ATINUDA%20DAY%202_507.jpg',
  },
  {
    number: '03',
    title: 'The Record',
    body: 'Seven editions. Six cities. Twenty-plus countries. Every session, investment introduction and cross-border partnership that began here is part of the permanent institutional record.',
    image: '/assets/images/summit/H1C10404.jpg',
  },
];

export function PillarsSection() {
  return (
    <section style={{ background: BGALT, borderTop: `1px solid rgba(27,30,28,0.07)` }}>

      {/* ── Two-event cards ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="platform-cards">

        {/* ── Lagos ── */}
        <div style={{ borderRight: '1px solid rgba(27,30,28,0.08)' }}>
          {/* Top links */}
          <div style={{
            display: 'flex',
            gap: '32px',
            padding: '28px clamp(28px, 4vw, 56px)',
            borderBottom: '1px solid rgba(27,30,28,0.08)',
          }}>
            <a href="/7.0" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>Learn More</a>
            <a href="/7.0-waitlist" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(27,30,28,0.4)', textDecoration: 'none' }}>Join Waitlist</a>
          </div>
          {/* Image */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '68%', overflow: 'hidden' }}>
            <Image
              src="/assets/images/summit/H1C10415.jpg"
              alt="Atinuda Lagos"
              fill
              sizes="50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          {/* Type */}
          <div style={{ padding: '32px clamp(28px, 4vw, 56px) 28px' }}>
            <p style={{ ...sans, fontSize: '10px', letterSpacing: '0.36em', textTransform: 'uppercase', color: COPPER, marginBottom: '12px' }}>Summit</p>
            <p style={{ ...sd, fontSize: 'clamp(2rem, 3vw, 3.6rem)', color: INK, lineHeight: 1.04, marginBottom: '10px' }}>Atinuda 7.0 Lagos</p>
            <p style={{ ...sans, fontSize: '13px', color: 'rgba(27,30,28,0.44)', letterSpacing: '0.02em' }}>6–8 October 2027</p>
          </div>
          {/* Bottom links */}
          <div style={{
            display: 'flex',
            gap: '32px',
            padding: '20px clamp(28px, 4vw, 56px) 28px',
            borderTop: '1px solid rgba(27,30,28,0.08)',
          }}>
            <a href="/7.0" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>Learn More</a>
            <a href="/7.0-waitlist" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(27,30,28,0.4)', textDecoration: 'none' }}>Join Waitlist</a>
          </div>
        </div>

        {/* ── Rwanda ── */}
        <div>
          {/* Top links */}
          <div style={{
            display: 'flex',
            gap: '32px',
            padding: '28px clamp(28px, 4vw, 56px)',
            borderBottom: '1px solid rgba(27,30,28,0.08)',
          }}>
            <a href="/elevation-2028" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>Learn More</a>
            <a href="/elevation-2028#register" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(27,30,28,0.4)', textDecoration: 'none' }}>Register</a>
          </div>
          {/* Image */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '68%', overflow: 'hidden' }}>
            <Image
              src="/assets/images/kigali.jpg"
              alt="Elevation Retreat Rwanda"
              fill
              sizes="50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          {/* Type */}
          <div style={{ padding: '32px clamp(28px, 4vw, 56px) 28px' }}>
            <p style={{ ...sans, fontSize: '10px', letterSpacing: '0.36em', textTransform: 'uppercase', color: COPPER, marginBottom: '12px' }}>Retreat</p>
            <p style={{ ...sd, fontSize: 'clamp(2rem, 3vw, 3.6rem)', color: INK, lineHeight: 1.04, marginBottom: '10px' }}>Elevation · Rwanda</p>
            <p style={{ ...sans, fontSize: '13px', color: 'rgba(27,30,28,0.44)', letterSpacing: '0.02em' }}>March 2028</p>
          </div>
          {/* Bottom links */}
          <div style={{
            display: 'flex',
            gap: '32px',
            padding: '20px clamp(28px, 4vw, 56px) 28px',
            borderTop: '1px solid rgba(27,30,28,0.08)',
          }}>
            <a href="/elevation-2028" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>Learn More</a>
            <a href="/elevation-2028#register" style={{ ...sans, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(27,30,28,0.4)', textDecoration: 'none' }}>Register</a>
          </div>
        </div>

      </div>

      {/* ── Three-column grid (archived) ────────────────────── */}
      {/* {CHAPTERS.map(...)} */}

      <style>{`
        @media (max-width: 768px) {
          .platform-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </section>
  );
}
