'use client';

import Image from 'next/image';

const DARK   = '#0F0F0F';
const COPPER = '#b5622a';
const BORDER = 'rgba(255,255,255,0.08)';
const sd     = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };

function TileLabel({ text }: { text: string }) {
  return (
    <p style={{ ...sans, fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: COPPER, marginBottom: '12px' }}>
      {text}
    </p>
  );
}

function TileTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ ...sd, fontSize: 'clamp(1.7rem, 2.4vw, 3rem)', color: '#fff', lineHeight: 1.1, maxWidth: '280px' }}>
      {children}
    </p>
  );
}

const overlay = {
  position: 'absolute' as const,
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.22) 100%)',
};

const caption = {
  position: 'absolute' as const,
  bottom: 40,
  left: 40,
  right: 40,
};

export function TracksSection() {
  return (
    <section style={{ background: DARK }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: '380px 380px',
      }}>

        {/* Col 1 — Sustainability photo, spans both rows */}
        <div style={{
          gridColumn: '1',
          gridRow: '1 / 3',
          position: 'relative',
          borderRight: `1px solid ${BORDER}`,
          overflow: 'hidden',
        }}>
          <Image
            src="/assets/images/Sustainability.jpg"
            alt="Sustainability"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={overlay} />
          <div style={caption}>
            <TileLabel text="Sustainability" />
            <TileTitle>Building in a way that lasts.</TileTitle>
          </div>
        </div>

        {/* Col 2, Row 1 — Business of Design, photo */}
        <div style={{
          gridColumn: '2',
          gridRow: '1',
          position: 'relative',
          borderRight: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          overflow: 'hidden',
        }}>
          <Image
            src="/assets/images/summit/ATINUDA DAY 2_487.jpg"
            alt="Business of Design"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={overlay} />
          <div style={caption}>
            <TileLabel text="Business of Design" />
            <TileTitle>The economics of what we create.</TileTitle>
          </div>
        </div>

        {/* Col 3, Row 1 — What We Discuss, photo */}
        <div style={{
          gridColumn: '3',
          gridRow: '1',
          position: 'relative',
          borderBottom: `1px solid ${BORDER}`,
          overflow: 'hidden',
        }}>
          <Image
            src="/assets/images/summit/H1C10415.jpg"
            alt="What We Discuss"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={overlay} />
          <div style={caption}>
            <TileLabel text="What We Discuss" />
            <TileTitle>The room that sets the agenda.</TileTitle>
          </div>
        </div>

        {/* Col 2, Row 2 — MICE photo */}
        <div style={{
          gridColumn: '2',
          gridRow: '2',
          position: 'relative',
          borderRight: `1px solid ${BORDER}`,
          overflow: 'hidden',
        }}>
          <Image
            src="/assets/images/summit/RBS13419.jpg"
            alt="MICE"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={overlay} />
          <div style={caption}>
            <TileLabel text="M.I.C.E" />
            <TileTitle>Where people gather with purpose.</TileTitle>
          </div>
        </div>

        {/* Col 3, Row 2 — Spark the Future photo */}
        <div style={{
          gridColumn: '3',
          gridRow: '2',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Image
            src="/assets/images/summit/GM5_1341.JPG"
            alt="Spark the Future"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={overlay} />
          <div style={caption}>
            <TileLabel text="Spark the Future" />
            <TileTitle>Where ideas meet capital.</TileTitle>
          </div>
        </div>

      </div>
    </section>
  );
}
