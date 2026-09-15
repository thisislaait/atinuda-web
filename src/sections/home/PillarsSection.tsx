'use client';

import Image from 'next/image';

const sd     = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const COPPER = '#b5622a';
const BG     = '#F4F5F3';

const CHAPTERS = [
  {
    number: '01',
    title: 'Creativity',
    body: 'Culture is the currency of the next decade. Atinuda centres the African creative economy: music, film, fashion, design, and the leaders building it at scale.',
    image: '/assets/images/summit/GM5_1315.JPG',
  },
  {
    number: '02',
    title: 'Leadership',
    body: 'Executive panels, keynotes, and peer access designed for founders, C-suite, and the emerging voices shaping sectors across the continent and diaspora.',
    image: '/assets/images/summit/ATINUDA%20DAY%202_507.jpg',
  },
  {
    number: '03',
    title: 'Enterprise',
    body: 'Trade, investment, and brand activation opportunities that turn relationships forged in the room into commercial partnerships that outlast the moment.',
    image: '/assets/images/summit/H1C10404.jpg',
  },
];

// Inline image thumbnail — floats inside the text like the Kinetic reference
function InlineImg({ src, wide }: { src: string; wide?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      width: wide ? '4.2em' : '3em',
      height: '1.55em',
      overflow: 'hidden',
      borderRadius: '3px',
      verticalAlign: 'middle',
      position: 'relative',
      margin: '0 0.18em',
      transform: 'translateY(-0.12em)',
      flexShrink: 0,
    }}>
      <Image
        src={src}
        alt=""
        fill
        sizes="200px"
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
    </span>
  );
}

export function PillarsSection() {
  return (
    <section style={{ background: BG }}>

      {/* ── Editorial statement ──────────────────────────────── */}
      <div style={{
        padding: '100px clamp(28px, 5.5vw, 80px) 0',
      }}>
        {/* Label */}
        <p style={{
          ...sans,
          fontSize: '10px',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: COPPER,
          marginBottom: '52px',
        }}>
          What We Build Around
        </p>

        {/* The big statement — inline images sit inside the text */}
        <p style={{
          ...sd,
          fontSize: 'clamp(2rem, 4.8vw, 5.4rem)',
          lineHeight: 1.18,
          color: INK,
          maxWidth: '1100px',
        }}>
          Where
          <InlineImg src="/assets/images/summit/RBS13419.jpg" wide />
          culture meets capital. Where
          <InlineImg src="/assets/images/summit/ATINUDA%20DAY%202_130.jpg" wide />
          founders share tables with executives. Where
          <InlineImg src="/assets/images/summit/IMG_0733L.jpg" />
          ambition becomes architecture.
        </p>
      </div>

      {/* ── Chapter rows ─────────────────────────────────────── */}
      <div style={{ marginTop: '80px' }}>
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.number}
            style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr 2fr 160px',
              gap: '40px',
              padding: '36px clamp(28px, 5.5vw, 80px)',
              borderTop: `1px solid rgba(27,30,28,0.1)`,
              alignItems: 'center',
            }}
            className="pillar-row"
          >
            {/* Number */}
            <p style={{
              ...sans,
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: COPPER,
              textTransform: 'uppercase',
            }}>
              {ch.number}
            </p>

            {/* Title */}
            <p style={{
              ...sd,
              fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
              color: INK,
              lineHeight: 1,
            }}>
              {ch.title}
            </p>

            {/* Body */}
            <p style={{
              ...sans,
              fontSize: '14px',
              lineHeight: 1.75,
              color: 'rgba(27,30,28,0.52)',
              maxWidth: '520px',
            }}>
              {ch.body}
            </p>

            {/* Thumbnail */}
            <div style={{
              height: '88px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px',
            }}>
              <Image
                src={ch.image}
                alt={ch.title}
                fill
                sizes="160px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        ))}

        {/* Bottom border */}
        <div style={{ borderTop: `1px solid rgba(27,30,28,0.1)` }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pillar-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .pillar-row > div:last-child {
            display: none;
          }
        }
      `}</style>

    </section>
  );
}
