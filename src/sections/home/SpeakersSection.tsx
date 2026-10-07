'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { TracksSection } from './TracksSection';

const sd   = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const BG     = '#F4F5F3';
const COPPER = '#b5622a';

const SPEAKERS = [
  { name: 'David Stark',        role: 'Founder & Chief Creative Officer', org: 'David Stark Design and Production', image: '/assets/images/speaker_section/David%20Stark.jpg' },
  { name: 'David Tutera',       role: 'Chief Design Officer',             org: 'The David Tutera Brand',            image: '/assets/images/speaker_section/David%20Tutera.jpg' },
  { name: 'Georgie Ndiranga',   role: 'Business Journalist & Presenter',  org: 'CNBC Africa',                       image: '/assets/images/speaker_section/Georgie%20Ndiranga.png' },
  { name: 'Lady Denta',         role: 'Founder & CEO',                    org: 'GUBA Awards',                       image: '/assets/images/speaker_section/Lady%20Denta.jpeg' },
  { name: 'Marcy Blum',         role: 'Founder',                          org: 'Marcy Blum Events',                 image: '/assets/images/speaker_section/Marcy%20Blum.jpg' },
  { name: 'Preston Bailey',     role: 'Founder & Creative Director',      org: 'Preston Bailey Entertainment',      image: '/assets/images/speaker_section/Preston%20Bailey.jpeg' },
  { name: 'Dr. Segun Awosanya', role: 'Founder & President',              org: 'Social Intervention Advocacy Foundation', image: '/assets/images/speaker_section/Sega.jpeg' },
  { name: 'Simon Alexander Ong', role: 'Life Coach, Speaker & Author',    org: 'SAO Learning Ltd',                 image: '/assets/images/speaker_section/Simon.jpg' },
  { name: 'TY Bello',           role: 'Photographer & Recording Artist',  org: 'Depth of Field',                   image: '/assets/images/speaker_section/TY%20Bello.png' },
  { name: 'Kamil Olufowobi',    role: 'Founder & CEO',                    org: 'MIPAD',                             image: '/assets/images/speaker_section/kamil%20Olufowobi.webp' },
];

const PORTRAIT_H = 360;

export function SpeakersSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [portraitY, setPortraitY] = useState(0);
  const listRef  = useRef<HTMLDivElement>(null);
  const rowRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const handleEnter = (i: number) => {
    setHovered(i);
    const row     = rowRefs.current[i];
    const section = listRef.current;
    if (!row || !section) return;
    const rowRect     = row.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const rowCenter   = rowRect.top - sectionRect.top + rowRect.height / 2;
    setPortraitY(Math.max(rowCenter - PORTRAIT_H / 2, 0));
  };

  return (
    <>
      {/* ── Editorial copy ────────────────────────────────────── */}
      <section style={{
        background: BG,
        borderTop: `1px solid rgba(27,30,28,0.07)`,
        padding: '100px clamp(28px, 5.5vw, 80px) 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <p style={{
          ...sans,
          fontSize: '10px',
          letterSpacing: '0.44em',
          textTransform: 'uppercase',
          color: COPPER,
          marginBottom: '32px',
        }}>
          Theme
        </p>

        <h2 style={{
          ...sd,
          fontSize: 'clamp(3rem, 6vw, 7.2rem)',
          color: INK,
          lineHeight: 1.0,
          letterSpacing: '-0.01em',
          maxWidth: '900px',
          marginBottom: '16px',
        }}>
          The Architecture of Scale
        </h2>

        <p style={{
          ...sans,
          fontSize: '13px',
          letterSpacing: '0.12em',
          color: 'rgba(27,30,28,0.4)',
          marginBottom: '64px',
          textTransform: 'uppercase',
        }}>
          Formalizing Africa&apos;s Creative Infrastructure
        </p>

        <div style={{ maxWidth: '720px', width: '100%' }}>
          <p style={{
            ...sans,
            fontSize: '16px',
            color: 'rgba(27,30,28,0.62)',
            lineHeight: 1.8,
            marginBottom: '28px',
          }}>
            Africa&apos;s creative sector has talent in abundance. What it has lacked, and what is now being built, is the formal architecture beneath it: the financing structures, the distribution networks, the IP frameworks, the training pipelines and the industry standards that allow individual brilliance to become sector strength.
          </p>
          <p style={{
            ...sans,
            fontSize: '16px',
            color: 'rgba(27,30,28,0.62)',
            lineHeight: 1.8,
          }}>
            In Lagos, over three days, we bring together the designers, operators, investors and policymakers who are already at work building this infrastructure, to compare notes, identify the gaps, and make the connections that move the sector forward.
          </p>
        </div>
      </section>

      {/* ── Speaker name list ─────────────────────────────────── */}
      <div
        ref={listRef}
        style={{
          background: BG,
          borderTop: `1px solid rgba(27,30,28,0.07)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '48px clamp(28px, 5.5vw, 80px) 0',
          borderBottom: `1px solid rgba(27,30,28,0.06)`,
        }}>
          <p style={{
            ...sans,
            fontSize: '10px',
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: 'rgba(27,30,28,0.3)',
            paddingBottom: '48px',
          }}>
            The Room Has Included
          </p>
        </div>

        {SPEAKERS.map((s, i) => (
          <div
            key={s.name}
            ref={el => { rowRefs.current[i] = el; }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '0 clamp(28px, 5.5vw, 80px)',
              borderBottom: `1px solid rgba(27,30,28,0.06)`,
              cursor: 'default',
              display: 'flex',
              alignItems: 'baseline',
              transition: 'background 0.2s ease',
              background: hovered === i ? 'rgba(27,30,28,0.03)' : 'transparent',
            }}
          >
            <div style={{ flex: 1, padding: '12px 0' }}>
              <p style={{
                ...sd,
                fontSize: 'clamp(2.6rem, 5.5vw, 7rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: hovered === i ? INK : 'rgba(27,30,28,0.18)',
                transition: 'color 0.25s ease',
              }}>
                {s.name}
              </p>
              {s.role && (
                <p style={{
                  ...sans,
                  fontSize: '12px',
                  color: hovered === i ? 'rgba(27,30,28,0.5)' : 'rgba(27,30,28,0.2)',
                  transition: 'color 0.25s ease',
                  marginTop: '2px',
                  letterSpacing: '0.01em',
                }}>
                  {s.role} &nbsp;·&nbsp; {s.org}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Portrait — snaps to hovered row center */}
        <div style={{
          position: 'absolute',
          right: 'clamp(28px, 5.5vw, 80px)',
          top: 0,
          width: '280px',
          height: `${PORTRAIT_H}px`,
          pointerEvents: 'none',
          zIndex: 10,
          opacity: hovered !== null ? 1 : 0,
          transform: `translateY(${portraitY}px)`,
          transition: 'opacity 0.25s ease, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}>
          {hovered !== null && (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <Image
                src={SPEAKERS[hovered].image}
                alt={SPEAKERS[hovered].name}
                fill
                sizes="280px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(27,30,28,0.4) 0%, transparent 50%)',
              }} />
            </div>
          )}
        </div>

        {/* Bottom note */}
        <div style={{
          padding: '40px clamp(28px, 5.5vw, 80px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid rgba(27,30,28,0.07)`,
        }}>
          <p style={{
            ...sans,
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(27,30,28,0.3)',
          }}>
            7.0 Speakers · Announced Soon
          </p>
          <a
            href="/7.0-waitlist"
            style={{
              ...sans,
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: INK,
              textDecoration: 'none',
              borderBottom: `1px solid rgba(27,30,28,0.3)`,
              paddingBottom: '2px',
            }}
          >
            Join the Waitlist
          </a>
        </div>
      </div>

    </>
  );
}
