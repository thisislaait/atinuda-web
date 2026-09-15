'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sd = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const COPPER = '#b5622a';

// 30 sequential frames — Day 3, Mauritius (confirmed to exist: DAY3_1 through DAY3_30)
const FRAMES = Array.from({ length: 30 }, (_, i) =>
  `/assets/images/Retreat/Together/ATINUDA6_DAY3_${i + 1}.JPG`
);

// Text moments that emerge at specific frame ranges
const MOMENTS = [
  {
    from: 0,
    to: 7,
    label: 'Day Three · Mauritius',
    line: 'The room\nwas forming.',
  },
  {
    from: 10,
    to: 18,
    label: 'Six editions',
    line: 'The same\nfrequency.',
  },
  {
    from: 21,
    to: 29,
    label: 'Atinuda 6.0',
    line: "You don't attend.\nYou join.",
  },
];

export default function ExperiencePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Draw a single frame to canvas — cover-fit
  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = framesRef.current[idx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  };

  // Resize canvas to match viewport
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    // ── IMAGE PRELOADING ────────────────────────────────────
    framesRef.current = FRAMES.map((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        if (i === 0) {
          drawFrame(0);
          // Reveal canvas, hide loading overlay
          const overlay = document.getElementById('seq-loading');
          if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
          }
        }
      };
      img.src = src;
      return img;
    });

    // ── GSAP ANIMATIONS ─────────────────────────────────────
    const ctx = gsap.context(() => {

      // Opening title: staggered reveal on load
      gsap.timeline({ delay: 0.25 })
        .from('.open-label', { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.open-title', { y: 110, opacity: 0, duration: 1.3, ease: 'power3.out' }, '-=0.35')
        .from('.open-sub', { y: 20, opacity: 0, duration: 0.85, ease: 'power2.out' }, '-=0.45')
        .from('.scroll-line', { scaleY: 0, transformOrigin: 'top center', duration: 0.8, ease: 'power2.inOut' }, '-=0.3')
        .from('.scroll-label', { opacity: 0, duration: 0.5 }, '-=0.1');

      // Image sequence: canvas scrub
      const obj = { frame: 0 };

      gsap.to(obj, {
        frame: FRAMES.length - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.seq-wrapper',
          start: 'top top',
          end: '+=400%',
          scrub: 0.4,
          pin: '.seq-pin',
          pinSpacing: true,
          onUpdate() {
            const f = Math.round(obj.frame);

            // Draw frame to canvas
            drawFrame(f);

            // Update frame counter (direct DOM — no re-render)
            const counter = document.getElementById('frame-counter');
            if (counter) {
              counter.textContent = `${String(f + 1).padStart(2, '0')} — ${String(FRAMES.length).padStart(2, '0')}`;
            }

            // Update progress bar
            const bar = document.getElementById('seq-bar');
            if (bar) {
              bar.style.width = `${(f / (FRAMES.length - 1)) * 100}%`;
            }

            // Update moments: show/hide based on frame range
            MOMENTS.forEach((m, i) => {
              const el = document.getElementById(`moment-${i}`);
              if (!el) return;
              const active = f >= m.from && f <= m.to;
              el.style.opacity = active ? '1' : '0';
              el.style.transform = active ? 'translateY(0px)' : 'translateY(28px)';
            });
          },
        },
      });

      // Statement: word-by-word reveal
      gsap.from('.stmt-word', {
        y: 80,
        opacity: 0,
        stagger: 0.07,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.stmt-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Finale: fade up
      gsap.from('.finale-left', {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.finale-left',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.finale-cta', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.finale-cta',
          start: 'top 83%',
          toggleActions: 'play none none none',
        },
      });

      ScrollTrigger.refresh();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ background: '#080808', color: '#fff', overflowX: 'hidden' }}>

      {/* ── OPENING TITLE ──────────────────────────────────────── */}
      <section
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#080808',
          textAlign: 'center',
          padding: '0 48px',
          position: 'relative',
        }}
      >
        <p
          className="open-label nav-text uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.46em',
            color: COPPER,
            marginBottom: '40px',
          }}
        >
          Atinuda · The Sixth Edition · Mauritius
        </p>

        <div style={{ overflow: 'hidden' }}>
          <h1
            className="open-title"
            style={{
              ...sd,
              fontSize: 'clamp(5rem, 14vw, 15rem)',
              lineHeight: '0.88',
              color: '#fff',
            }}
          >
            In Motion.
          </h1>
        </div>

        <p
          className="open-sub"
          style={{
            fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: '1.95',
            color: 'rgba(255,255,255,0.28)',
            marginTop: '44px',
            maxWidth: '300px',
          }}
        >
          Thirty frames. Six days.<br />
          Scroll to walk through them.
        </p>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            className="scroll-line"
            style={{
              width: '1px',
              height: '54px',
              background: 'linear-gradient(to bottom, rgba(181,98,42,0.6), transparent)',
            }}
          />
          <span
            className="scroll-label nav-text uppercase"
            style={{
              fontSize: '8px',
              letterSpacing: '0.42em',
              color: 'rgba(255,255,255,0.18)',
            }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ── IMAGE SEQUENCE ─────────────────────────────────────── */}
      <div className="seq-wrapper" style={{ position: 'relative' }}>
        <div
          className="seq-pin"
          style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            background: '#080808',
          }}
        >
          {/* Canvas — frames drawn here by GSAP onUpdate */}
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          />

          {/* Cinematic vignette — edges + bottom darkening */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, transparent 18%, transparent 60%, rgba(8,8,8,0.88) 100%)',
                'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(8,8,8,0.45) 100%)',
              ].join(', '),
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Text moments — emerge at specific frame ranges */}
          {MOMENTS.map((m, i) => (
            <div
              key={i}
              id={`moment-${i}`}
              style={{
                position: 'absolute',
                bottom: '14%',
                left: 'clamp(36px, 6vw, 88px)',
                zIndex: 2,
                opacity: 0,
                transform: 'translateY(28px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
                pointerEvents: 'none',
              }}
            >
              <p
                className="nav-text uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.44em',
                  color: COPPER,
                  marginBottom: '18px',
                }}
              >
                {m.label}
              </p>
              <h2
                style={{
                  ...sd,
                  fontSize: 'clamp(2.8rem, 5.5vw, 7rem)',
                  color: '#fff',
                  lineHeight: '1.0',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.line}
              </h2>
            </div>
          ))}

          {/* Frame counter — top right */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: 'clamp(36px, 5vw, 88px)',
              zIndex: 2,
            }}
          >
            <span
              id="frame-counter"
              className="nav-text"
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.22)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              01 — 30
            </span>
          </div>

          {/* Progress bar — bottom edge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'rgba(255,255,255,0.06)',
              zIndex: 2,
            }}
          >
            <div
              id="seq-bar"
              style={{
                height: '100%',
                width: '0%',
                background: COPPER,
                transition: 'width 0.04s linear',
              }}
            />
          </div>

          {/* Loading overlay — hides once first frame draws */}
          <div
            id="seq-loading"
            style={{
              position: 'absolute',
              inset: 0,
              background: '#080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              transition: 'opacity 0.5s ease',
            }}
          >
            <p
              className="nav-text uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.44em',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              Loading
            </p>
          </div>
        </div>
      </div>

      {/* ── STATEMENT ──────────────────────────────────────────── */}
      <section
        className="stmt-section"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#080808',
          padding: '80px clamp(40px, 8vw, 120px)',
        }}
      >
        <p
          className="nav-text uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.44em',
            color: 'rgba(255,255,255,0.2)',
            marginBottom: '52px',
          }}
        >
          Six editions later
        </p>

        <div>
          {["Africa's", 'most', 'influential', 'voices.'].map((word, i) => (
            <div
              key={i}
              className="stmt-word"
              style={{
                ...sd,
                fontSize: 'clamp(3.5rem, 8vw, 10rem)',
                lineHeight: '0.94',
                color: i < 3 ? '#fff' : 'rgba(255,255,255,0.2)',
                display: 'block',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINALE + CTA ───────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Background: finale photo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/assets/images/Retreat/Finale/ATINUDA6_DAY6_45.JPG')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.92) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '0 clamp(40px, 6vw, 88px) 80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          <div className="finale-left">
            <p
              className="nav-text uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.44em',
                color: COPPER,
                marginBottom: '24px',
              }}
            >
              Atinuda 7.0 · Lagos · 2026
            </p>
            <h2
              style={{
                ...sd,
                fontSize: 'clamp(3rem, 6.5vw, 8rem)',
                color: '#fff',
                lineHeight: '0.93',
              }}
            >
              The standard<br />is set here.
            </h2>
          </div>

          <Link
            href="/7.0-waitlist"
            className="finale-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              background: COPPER,
              color: '#fff',
              padding: '17px 44px',
              fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Join the room
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
