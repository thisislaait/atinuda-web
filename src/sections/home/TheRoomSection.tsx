'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sd   = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK  = '#1B1E1C';
const BG   = '#F4F5F3';

const PHOTOS = [
  { src: '/assets/images/summit/RBS13419.jpg',               w: 220, h: 290, x: 6,  y: 8,  from: { x: -180, y: -60  } },
  { src: '/assets/images/summit/H1C10404.jpg',               w: 170, h: 220, x: 68, y: 5,  from: { x: 140,  y: -80  } },
  { src: '/assets/images/summit/GM5_1315.JPG',               w: 200, h: 260, x: 3,  y: 52, from: { x: -160, y: 100  } },
  { src: '/assets/images/summit/ATINUDA%20DAY%202_130.jpg',  w: 180, h: 230, x: 74, y: 44, from: { x: 160,  y: 80   } },
  { src: '/assets/images/summit/IMG_0733L.jpg',              w: 150, h: 195, x: 38, y: 62, from: { x: 0,    y: 160  } },
  { src: '/assets/images/summit/ATINUDA%20DAY%202_507.jpg',  w: 160, h: 210, x: 56, y: 14, from: { x: 100, y: -120 } },
];

type Persona = { role: string; desc: string } | null;

const PERSONAS: Persona[] = [
  { role: 'Founders',   desc: 'Early-stage to series-funded. Building across tech, fashion, hospitality and media.' },
  null,
  null,
  { role: 'Executives', desc: 'C-suite and senior leadership from global and African corporations.' },
  { role: 'Creators',   desc: 'Music, film, art and brand directors whose work defines African culture globally.' },
  { role: 'Innovators', desc: 'Investors, technologists and policy leaders deploying capital across African markets.' },
];

type GlowState = {
  cx: number;         // gradient centre x %
  cy: number;         // gradient centre y %
  textLeft: number;   // text anchor x %
  textTop: number;    // text anchor y %
  side: 'left' | 'right'; // which side of the photo the text sits on
  maxW: number;       // max-width in %
};

export function TheRoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const [hovered, setHovered] = useState<number | null>(null);
  const [glow, setGlow]       = useState<GlowState>({ cx: 50, cy: 50, textLeft: 55, textTop: 40, side: 'right', maxW: 30 });

  useEffect(() => {
    const init = async () => {
      const { default: gsap }  = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      photoRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = PHOTOS[i];

        gsap.fromTo(el,
          { x: p.from.x, y: p.from.y, opacity: 0, scale: 0.88 },
          {
            x: 0, y: 0, opacity: 1, scale: 1,
            ease: 'power3.out', duration: 1, delay: i * 0.08,
            scrollTrigger: {
              trigger: container,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const driftY = (i % 2 === 0 ? -1 : 1) * (18 + i * 6);
        gsap.to(el, {
          y: driftY, ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5 + i * 0.2,
          },
        });
      });

      return () => ScrollTrigger.getAll().forEach(t => t.kill());
    };

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  const handleMouseEnter = (i: number) => {
    const persona = PERSONAS[i];
    const el = photoRefs.current[i];
    if (!persona || !el || !containerRef.current) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const pRect = el.getBoundingClientRect();

    const cx = (pRect.left - cRect.left + pRect.width  / 2) / cRect.width  * 100;
    const cy = (pRect.top  - cRect.top  + pRect.height / 2) / cRect.height * 100;

    const photoLeftPct  = (pRect.left  - cRect.left) / cRect.width  * 100;
    const photoRightPct = (pRect.right - cRect.left) / cRect.width  * 100;

    // Text vertically centred on the photo, clamped to container
    const textTop = Math.min(Math.max(cy - 8, 4), 75);

    // Photos past 55% of container width → text to the LEFT, else to the RIGHT
    const side: 'left' | 'right' = cx > 55 ? 'left' : 'right';

    const GAP = 3; // % breathing room between photo edge and text

    const textLeft = side === 'right'
      ? photoRightPct + GAP                        // text starts after photo right edge
      : photoLeftPct  - GAP;                       // text ends before photo left edge

    const maxW = side === 'right'
      ? Math.max(100 - photoRightPct - GAP - 2, 20)
      : Math.max(photoLeftPct - GAP - 2, 20);

    setGlow({ cx, cy, textLeft, textTop, side, maxW });
    setHovered(i);
  };

  const persona = hovered !== null ? PERSONAS[hovered] : null;

  return (
    <section style={{ background: BG }}>

      {/* ── Scatter collage ──────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ position: 'relative', height: '90vh', minHeight: '620px', overflow: 'hidden' }}
      >

        {/* Scattered photos */}
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            ref={el => { photoRefs.current[i] = el; }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.w,
              height: p.h,
              willChange: 'transform, opacity',
              cursor: PERSONAS[i] ? 'crosshair' : 'default',
              zIndex: hovered === i ? 4 : 1,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <Image
                src={p.src}
                alt=""
                fill
                sizes="300px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        ))}

        {/* Spotlight — panoramic radial glow from photo centre */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            opacity: persona ? 1 : 0,
            transition: 'opacity 0.45s ease',
            background: persona
              ? `radial-gradient(ellipse 62% 56% at ${glow.cx.toFixed(1)}% ${glow.cy.toFixed(1)}%,
                  rgba(224,165,72,0.55) 0%,
                  rgba(181,98,42,0.25) 38%,
                  rgba(181,98,42,0.07) 60%,
                  transparent 78%)`
              : 'transparent',
          }}
        />

        {/* Persona text — to the side of the hovered photo */}
        <div
          style={{
            position: 'absolute',
            top:  `${glow.textTop.toFixed(1)}%`,
            // For right side: anchor from left. For left side: anchor from right edge via left + translateX(-100%)
            left: `${glow.textLeft.toFixed(1)}%`,
            transform: glow.side === 'left' ? 'translateX(-100%)' : 'none',
            zIndex: 6,
            pointerEvents: 'none',
            textAlign: glow.side === 'left' ? 'right' : 'left',
            maxWidth: `min(${glow.maxW.toFixed(0)}%, 260px)`,
            opacity: persona ? 1 : 0,
            transition: 'opacity 0.35s ease 0.08s',
          }}
        >
          <p style={{ ...sd, fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', color: INK, lineHeight: 1, marginBottom: '10px' }}>
            {persona?.role}
          </p>
          <p style={{ ...sans, fontSize: '12px', lineHeight: 1.75, color: 'rgba(27,30,28,0.65)' }}>
            {persona?.desc}
          </p>
        </div>

        {/* Circular word ring + CTA — centred */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <div style={{ position: 'relative', width: 320, height: 320 }}>

            {/* Spinning ring of words */}
            <svg
              viewBox="0 0 300 300"
              width="320"
              height="320"
              style={{
                position: 'absolute',
                inset: 0,
                animation: 'room-spin 32s linear infinite',
                willChange: 'transform',
              }}
              aria-hidden="true"
            >
              <defs>
                <path
                  id="roomCircle"
                  d="M 150,150 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
                />
              </defs>
              <text
                fontFamily="Hanken Grotesk, system-ui, sans-serif"
                fontSize="11.5"
                letterSpacing="7"
                fill={INK}
                fillOpacity="0.72"
              >
                <textPath href="#roomCircle" startOffset="0%">
                  FOUNDERS · EXECUTIVES · CREATORS · INNOVATORS · FOUNDERS · EXEC
                </textPath>
              </text>
            </svg>

            {/* Become a Member — static at centre */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}
            >
              <Link
                href="/7.0-waitlist"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: INK,
                  color: BG,
                  padding: '14px 30px',
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Become a Member
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── NOTABLES — archived ───────────────────────────────
      <div style={{ borderTop: '1px solid rgba(27,30,28,0.1)' }}>
        {[
          { name: 'Founders',   descriptor: 'Early-stage to series-funded, building across tech, fashion, hospitality, and media.' },
          { name: 'Executives', descriptor: 'C-suite and senior leadership from global and African corporations operating on the continent.' },
          { name: 'Creatives',  descriptor: 'Music, film, art, and brand directors whose work defines African culture for a global audience.' },
          { name: 'Investors',  descriptor: 'GPs, LPs, and family offices actively deploying capital across African markets.' },
        ].map((n) => (
          <div
            key={n.name}
            className="notables-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '40px',
              padding: '32px clamp(28px, 5.5vw, 80px)',
              borderBottom: '1px solid rgba(27,30,28,0.08)',
              alignItems: 'start',
            }}
          >
            <p style={{ ...sd, fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', color: INK, lineHeight: 1 }}>{n.name}</p>
            <p style={{ ...sans, fontSize: '14px', lineHeight: 1.75, color: 'rgba(27,30,28,0.5)' }}>{n.descriptor}</p>
          </div>
        ))}
      </div>
      ── end NOTABLES ── */}

      <style>{`
        @keyframes room-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
