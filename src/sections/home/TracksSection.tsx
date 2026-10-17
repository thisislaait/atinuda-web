'use client';

import Image from 'next/image';

const DARK   = '#0F0F0F';
const BG     = '#F4F5F3';
const INK    = '#1B1E1C';
const COPPER = '#b5622a';
const sd     = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const sans   = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };

const TRACKS = [
  {
    label: 'MICE & Business Events',
    heading: 'New markets and destination competitiveness.',
    body: 'Connecting the people and organisations shaping the business events landscape — from conferences and exhibitions to incentive travel, destinations and convention bureaus. Explore new markets, strengthen destination competitiveness and unlock opportunities for growth across the global events economy.',
    image: '/assets/images/summit/new-images/IMG_0964L.jpg',
  },
  {
    label: 'Creative Industries & Experience Design',
    heading: 'Creative excellence and commercial thinking.',
    body: 'Celebrating the creative minds who transform ideas into memorable experiences. From creative direction and design to entertainment, floristry, production and experiential agencies — exploring how creative excellence, intellectual property and commercial thinking can build distinctive experiences and sustainable creative businesses.',
    image: '/assets/images/summit/new-images/IMG_1181L.jpg',
  },
  {
    label: 'Social Events, Hospitality & Celebrations',
    heading: 'Service excellence and lasting value.',
    body: 'Bringing together the professionals who shape exceptional celebrations and hospitality experiences. Through conversations on service excellence, entrepreneurship and profitability, this pillar explores how planners, venues, caterers and luxury experience providers can raise standards, build stronger businesses and deliver lasting value.',
    image: '/assets/images/summit/new-images/IMG_1282L.jpg',
  },
  {
    label: 'Leadership, Enterprise & Investment',
    heading: 'Strategies to scale and attract capital.',
    body: 'Where industry leadership meets enterprise ambition and investment opportunity. Bringing together founders, executives, investors and corporate decision-makers — examining the strategies, governance structures and partnerships that enable businesses to scale, attract capital and compete in a changing global marketplace.',
    image: '/assets/images/summit/new-images/IMG_1451L.jpg',
  },
  {
    label: 'Technology, Innovation & Sustainability',
    heading: 'Future-ready businesses and new efficiencies.',
    body: 'Exploring the ideas, technologies and practices redefining how events are designed, produced and experienced. From AI and event technology to digital experiences and sustainable production — discover new ways to improve efficiency, create value and build more resilient, future-ready businesses.',
    image: '/assets/images/summit/new-images/IMG_1459L.jpg',
  },
  {
    label: 'Talent, Education & Industry Development',
    heading: 'Skills and pathways for the industry\'s future.',
    body: 'Investing in the people and institutions shaping the industry\'s future. Bringing together educators, emerging professionals, mentors and industry associations — focusing on practical skills, professional standards and leadership pathways that support talent development and strengthen the industry for generations to come.',
    image: '/assets/images/summit/new-images/IMG_0733L.jpg',
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
          Six strategic pillars define each edition. The conversations that move the sector, not the ones that merely describe it.
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
                  sizes="(max-width: 768px) 100vw, 42vw"
                  quality={90}
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
