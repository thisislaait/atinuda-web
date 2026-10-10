'use client';

import Image from 'next/image';

const DARK   = '#0F0F0F';
const COPPER = '#b5622a';
const BORDER = 'rgba(255,255,255,0.08)';
const sd     = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };

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

const label = (text: string) => (
  <p style={{ ...sans, fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: COPPER, marginBottom: '12px' }}>
    {text}
  </p>
);

const title = (text: string) => (
  <p style={{ ...sd, fontSize: 'clamp(1.7rem, 2.4vw, 3rem)', color: '#fff', lineHeight: 1.1, maxWidth: '280px' }}>
    {text}
  </p>
);

export function TracksSection() {
  return (
    <section style={{ background: DARK }}>

      {/* ── Editorial header ──────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '112px clamp(28px, 5.5vw, 80px) 80px',
      }}>
        <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.2)', marginBottom: '40px' }} />

        <h2 style={{
          ...sd,
          fontSize: 'clamp(2.8rem, 5vw, 6rem)',
          fontWeight: 400,
          color: '#fff',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          maxWidth: '680px',
          marginBottom: '24px',
        }}>
          What We Discuss
        </h2>

        <p style={{
          ...sans,
          fontSize: '14px',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.38)',
          maxWidth: '440px',
        }}>
          Five editorial tracks define each edition — the conversations that move the sector, not the ones that merely describe it.
        </p>
      </div>

      {/* ── Photo grid ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: '400px 400px',
      }}>

        {/* Col 1 — spans both rows */}
        <div style={{ gridColumn: '1', gridRow: '1 / 3', position: 'relative', borderRight: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <Image src="/assets/images/summit/new-images/IMG_0964L.jpg" alt="Sustainability" fill sizes="33vw" style={{ objectFit: 'cover' }} />
          <div style={overlay} />
          <div style={caption}>
            {label('Sustainability')}
            {title('Building in a way that lasts.')}
          </div>
        </div>

        {/* Col 2, Row 1 */}
        <div style={{ gridColumn: '2', gridRow: '1', position: 'relative', borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <Image src="/assets/images/summit/new-images/IMG_1181L.jpg" alt="Business of Design" fill sizes="33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={overlay} />
          <div style={caption}>
            {label('Business of Design')}
            {title('The economics of what we create.')}
          </div>
        </div>

        {/* Col 3, Row 1 */}
        <div style={{ gridColumn: '3', gridRow: '1', position: 'relative', borderBottom: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <Image src="/assets/images/summit/new-images/IMG_1282L.jpg" alt="What We Discuss" fill sizes="33vw" style={{ objectFit: 'cover' }} />
          <div style={overlay} />
          <div style={caption}>
            {label('What We Discuss')}
            {title('The room that sets the agenda.')}
          </div>
        </div>

        {/* Col 2, Row 2 */}
        <div style={{ gridColumn: '2', gridRow: '2', position: 'relative', borderRight: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <Image src="/assets/images/summit/new-images/IMG_1451L.jpg" alt="MICE" fill sizes="33vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={overlay} />
          <div style={caption}>
            {label('M.I.C.E')}
            {title('Where people gather with purpose.')}
          </div>
        </div>

        {/* Col 3, Row 2 */}
        <div style={{ gridColumn: '3', gridRow: '2', position: 'relative', overflow: 'hidden' }}>
          <Image src="/assets/images/summit/new-images/IMG_1459L.jpg" alt="Spark the Future" fill sizes="33vw" style={{ objectFit: 'cover' }} />
          <div style={overlay} />
          <div style={caption}>
            {label('Spark the Future')}
            {title('Where ideas meet capital.')}
          </div>
        </div>

      </div>
    </section>
  );
}
