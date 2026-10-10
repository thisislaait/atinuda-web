'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const sd   = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const COPPER = '#b5622a';

const SLIDE_COUNT = 5;

export function CinematicHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDE_COUNT), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      minHeight: '100dvh',
      overflow: 'hidden',
    }}>

      {/* ── Full-bleed video ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      >
        <source src="/assets/motion/hero-video-new.mp4" type="video/mp4" />
      </video>

      {/* ── Subtle right-side darkening so left panel blends in ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(27,30,28,0.0) 38%, rgba(27,30,28,0.18) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Content row ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        height: '100%',
      }}>

        {/* ── Left text panel — semi-transparent ── */}
        <div style={{
          width: 'clamp(320px, 36%, 520px)',
          flexShrink: 0,
          background: 'rgba(27,30,28,0.72)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: 'clamp(100px, 22vh, 200px) clamp(32px, 4vw, 64px) clamp(40px, 5vh, 72px)',
        }}>

          <p style={{
            ...sans,
            fontSize: '9px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: COPPER,
            marginBottom: '24px',
          }}>
            Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; October 2027
          </p>

          <h1 style={{
            ...sd,
            fontSize: 'clamp(2.2rem, 2.8vw, 3.8rem)',
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '16px',
            maxWidth: '380px',
          }}>
            Sub-Saharan Africa&apos;s definitive summit for the experiential economy.
          </h1>

          <div style={{
            width: '36px',
            height: '1px',
            background: COPPER,
            marginBottom: '20px',
          }} />

          <p style={{
            ...sans,
            fontSize: '13px',
            lineHeight: 1.82,
            color: 'rgba(255,255,255,0.52)',
            marginBottom: '20px',
            maxWidth: '340px',
          }}>
            Atinuda 7.0 takes place on 6–8 October 2027 in Lagos, bringing together the continent&apos;s most active design founders, hospitality executives, creative directors and sector investors for three days of closed roundtables, private dinners and capital conversations.
          </p>

          <p style={{
            ...sans,
            fontSize: '13px',
            lineHeight: 1.82,
            color: 'rgba(255,255,255,0.52)',
            marginBottom: '28px',
            maxWidth: '340px',
          }}>
            Delegates leave with the market intelligence, cross-border relationships and investment introductions that define how this sector grows, alongside the founders, operators and institutions actively building it.
          </p>

          <Link
            href="/7.0-waitlist"
            style={{
              ...sans,
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#fff',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.55)',
              padding: '13px 36px',
              marginBottom: '44px',
            }}
          >
            Join the Waitlist
          </Link>

          {/* Slide dots */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '22px' : '6px',
                  height: '2px',
                  background: i === current ? COPPER : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.35s ease, background 0.35s ease',
                }}
              />
            ))}
          </div>

        </div>

        {/* Right — video shows through, no overlay needed */}
        <div style={{ flex: 1 }} />

      </div>

    </div>
  );
}
