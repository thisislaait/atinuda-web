'use client';

import Image from 'next/image';

const DARK   = '#0F0F0F';
const BG     = '#F4F5F3';
const INK    = '#1B1E1C';
const COPPER = '#b5622a';
const sd     = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };

const TRACKS = [
  {
    label: 'Sustainability',
    heading: 'Building in a way that lasts.',
    body: 'The sector cannot grow by consuming itself. This track examines the structures, supply chains, and leadership decisions that make creative businesses durable across generations.',
    image: '/assets/images/summit/new-images/IMG_0964L.jpg',
  },
  {
    label: 'Business of Design',
    heading: 'The economics of what we create.',
    body: 'Talent is not the constraint. Commercial infrastructure is. These sessions explore how African creative businesses price, scale, and build margin without sacrificing the work.',
    image: '/assets/images/summit/new-images/IMG_1181L.jpg',
  },
  {
    label: 'What We Discuss',
    heading: 'Growth mechanics within regional and global scales.',
    body: 'The pathways between Lagos, Nairobi, London, and New York are not theoretical. This track is a practical examination of how the sector crosses borders and what makes that expansion stick.',
    image: '/assets/images/summit/new-images/IMG_1282L.jpg',
  },
  {
    label: 'M.I.C.E',
    heading: 'Top executives across major sectors.',
    body: 'The most consequential meetings in African business happen at events. This track examines how the MICE economy works, who controls it, and where the next decade of investment is going.',
    image: '/assets/images/summit/new-images/IMG_1451L.jpg',
  },
  {
    label: 'Spark the Future',
    heading: 'Where ideas meet capital.',
    body: 'Ten early-stage ventures. One live pitch stage. The Atinuda audience is not passive — it is the room that can change what happens next for a business.',
    image: '/assets/images/summit/new-images/IMG_1459L.jpg',
  },
];

export function TracksSection() {
  return (
    <section>

      {/* ── Dark editorial header ─────────────────────────────────── */}
      <div style={{
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '112px clamp(28px, 5.5vw, 80px) 96px',
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
          Five editorial tracks define each edition. The conversations that move the sector, not the ones that merely describe it.
        </p>
      </div>

      {/* ── Alternating track rows ────────────────────────────────── */}
      <div style={{ background: BG }}>
        {TRACKS.map((track, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <div
              key={track.label}
              style={{
                display: 'grid',
                gridTemplateColumns: imageLeft ? '42fr 58fr' : '58fr 42fr',
                minHeight: '560px',
                borderBottom: '1px solid rgba(27,30,28,0.07)',
              }}
              className="track-row"
            >
              {/* Image */}
              <div style={{
                order: imageLeft ? 0 : 1,
                position: 'relative',
                overflow: 'hidden',
                minHeight: '440px',
              }}>
                <Image
                  src={track.image}
                  alt={track.label}
                  fill
                  sizes="42vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>

              {/* Text */}
              <div style={{
                order: imageLeft ? 1 : 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(48px, 6vw, 96px) clamp(32px, 5vw, 80px)',
              }}>
                <p style={{
                  ...sans,
                  fontSize: '10px',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: COPPER,
                  marginBottom: '28px',
                }}>
                  {track.label}
                </p>

                <h3 style={{
                  ...sd,
                  fontSize: 'clamp(2.2rem, 3.5vw, 4.4rem)',
                  fontWeight: 400,
                  color: INK,
                  lineHeight: 1.08,
                  letterSpacing: '-0.01em',
                  marginBottom: '28px',
                  maxWidth: '480px',
                }}>
                  {track.heading}
                </h3>

                <p style={{
                  ...sans,
                  fontSize: '14px',
                  lineHeight: 1.85,
                  color: 'rgba(27,30,28,0.5)',
                  maxWidth: '400px',
                }}>
                  {track.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .track-row {
            grid-template-columns: 1fr !important;
          }
          .track-row > div {
            order: unset !important;
          }
        }
      `}</style>

    </section>
  );
}
