'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sd    = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans  = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK   = '#1B1E1C';
const INK06 = 'rgba(27,30,28,0.06)';
const COPPER = '#b5622a';
const BG     = '#F4F5F3';

const IMAGES = [
  { src: '/assets/images/summit/new-images/ATINUDA DAY 3_277.jpg', alt: 'Atinuda Day 3',  offset: 0  },
  { src: '/assets/images/summit/new-images/ATINUDA DAY 3_355.jpg', alt: 'Atinuda Day 3',  offset: 32 },
  { src: '/assets/images/summit/new-images/ATINUDA DAY 3_600.jpg', alt: 'Atinuda Day 3',  offset: 0  },
  { src: '/assets/images/summit/new-images/ATINUDA DAY 3_609.jpg', alt: 'Atinuda Day 3',  offset: 44 },
  { src: '/assets/images/summit/new-images/IMG_0523L.jpg',         alt: 'Atinuda Summit', offset: 16 },
  { src: '/assets/images/summit/new-images/IMG_0544L.jpg',         alt: 'Atinuda Summit', offset: 0  },
  { src: '/assets/images/summit/new-images/IMG_0741L.jpg',         alt: 'Atinuda Summit', offset: 28 },
];

const IMG_W = 280;
const IMG_H = 380;
const GAP   = 12;
const VISIBLE = 4;
const MAX_IDX = IMAGES.length - VISIBLE;

export function PillarsSection() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(MAX_IDX, i + 1));

  const translateX = -(idx * (IMG_W + GAP));

  return (
    <section style={{ background: BG, padding: '112px 0 120px' }}>

      {/* ── Centered header ─────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 clamp(28px, 5.5vw, 80px)',
        marginBottom: '72px',
      }}>

        {/* Thin decorative line */}
        <div style={{ width: '1px', height: '48px', background: 'rgba(27,30,28,0.2)', marginBottom: '40px' }} />

        <h2 style={{
          ...sd,
          fontSize: 'clamp(2.8rem, 5vw, 6rem)',
          fontWeight: 400,
          color: INK,
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          maxWidth: '680px',
          marginBottom: '24px',
        }}>
          Invest Where Tourism, Capital &amp; Growth Meet
        </h2>

        <p style={{
          ...sans,
          fontSize: '14px',
          lineHeight: 1.8,
          color: 'rgba(27,30,28,0.5)',
          maxWidth: '440px',
        }}>
          Six editions across Nairobi, Mauritius, Lagos and beyond. Every gathering brings together the founders, investors and creative directors who are actively building this sector.
        </p>

      </div>

      {/* ── Image gallery ───────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingLeft: 'clamp(28px, 5.5vw, 80px)' }}>

        <div style={{
          display: 'flex',
          gap: `${GAP}px`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(${translateX}px)`,
          alignItems: 'flex-start',
        }}>
          {IMAGES.map((img, i) => (
            <div
              key={img.src}
              style={{
                flexShrink: 0,
                width: `${IMG_W}px`,
                height: `${IMG_H}px`,
                position: 'relative',
                overflow: 'hidden',
                marginTop: `${img.offset}px`,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="280px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          ))}
        </div>

        {/* Arrows — bottom right */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          padding: '20px clamp(28px, 5.5vw, 80px) 0 0',
          marginTop: '8px',
        }}>
          {[
            { label: '←', action: prev, disabled: idx === 0 },
            { label: '→', action: next, disabled: idx === MAX_IDX },
          ].map(({ label, action, disabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              style={{
                ...sans,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: `1px solid rgba(27,30,28,${disabled ? '0.12' : '0.35'})`,
                background: 'transparent',
                color: disabled ? 'rgba(27,30,28,0.2)' : INK,
                fontSize: '15px',
                cursor: disabled ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two CTAs ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '64px',
        padding: '0 clamp(28px, 5.5vw, 80px)',
      }}>
        <Link
          href="/7.0-waitlist"
          style={{
            ...sans,
            display: 'inline-block',
            padding: '16px 40px',
            background: INK,
            color: BG,
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
            textDecoration: 'none',
            borderRadius: '999px',
          }}
        >
          Reserve Atinuda 7.0 Lagos
        </Link>
        <Link
          href="/elevation-2028"
          style={{
            ...sans,
            display: 'inline-block',
            padding: '16px 40px',
            background: 'transparent',
            color: INK,
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
            textDecoration: 'none',
            borderRadius: '999px',
            border: `1px solid rgba(27,30,28,0.35)`,
          }}
        >
          Explore Elevation Rwanda
        </Link>
      </div>

    </section>
  );
}
