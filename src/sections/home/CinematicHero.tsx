'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sd   = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const COPPER = '#b5622a';
const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Container is 500vh: 4 scenes transition in first 300vh, reveal sits for final 200vh
const FRAMES = [
  {
    id: 0,
    image: '/assets/motion/pocket-watches.jpg',
    from: { scale: 1.0,  x: 0,   y: 0   },
    to:   { scale: 1.14, x: -18, y: -22 },
    lines: ["What if tomorrow", "wasn't tomorrow?"],
    isReveal: false,
  },
  {
    id: 1,
    image: '/assets/motion/yacht-motion.jpg',
    from: { scale: 1.06, x: 40,  y: -8  },
    to:   { scale: 1.1,  x: -40, y: -18 },
    lines: ["The future isn't coming.", "It's already in motion."],
    isReveal: false,
  },
  {
    id: 2,
    image: '/assets/motion/future-building.jpg',
    from: { scale: 1.08, x: 0, y: 50  },
    to:   { scale: 1.02, x: 0, y: -30 },
    lines: [
      "What if the future is already being designed, funded and experienced.",
    ],
    isReveal: false,
  },
  {
    id: 3,
    image: '/assets/motion/infinity-terrace.jpg',
    from: { scale: 1.1, x: 0, y: 0   },
    to:   { scale: 1.0, x: 0, y: -15 },
    lines: [],
    isReveal: true,
  },
];

// 500vh container. Transitions occupy 0–60%, reveal sits 60–100%.
// Per scene Ken Burns: 0–20, 20–40, 40–60, 60–80 (then static)
// Crossfades: 17–23%, 37–43%, 57–63%
const SCENE_STEP = 20; // % per scene Ken Burns
const FADES: [number, number, string, string][] = [
  [0, 1, '17% top', '23% top'],
  [1, 2, '37% top', '43% top'],
  [2, 3, '57% top', '63% top'],
];

export function CinematicHero() {
  const containerRef       = useRef<HTMLDivElement>(null);
  const imgRefs            = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const barFillRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const tomorrowRef        = useRef<HTMLSpanElement>(null);
  const nowRef             = useRef<HTMLSpanElement>(null);
  const hasAnimated        = useRef(false);
  const scrambleInterval   = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevFrameRef       = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Reset reveal text so scramble fires again on re-entry
  const resetRevealText = () => {
    if (scrambleInterval.current) {
      clearInterval(scrambleInterval.current);
      scrambleInterval.current = null;
    }
    hasAnimated.current = false;
    const tomorrowEl = tomorrowRef.current;
    const nowEl      = nowRef.current;
    if (!tomorrowEl || !nowEl) return;
    tomorrowEl.textContent   = 'Tomorrow,';
    nowEl.style.transition   = 'none';
    nowEl.style.opacity      = '0';
    nowEl.style.transform    = 'translateY(32px) scale(1.15)';
  };

  // Scramble + reveal animation for the final frame text
  const triggerRevealText = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const tomorrowEl = tomorrowRef.current;
    const nowEl      = nowRef.current;
    if (!tomorrowEl || !nowEl) return;

    const target = 'Tomorrow,';
    let frameCount = 0;
    const totalFrames = 22;

    scrambleInterval.current = setInterval(() => {
      tomorrowEl.textContent = target.split('').map((char, i) => {
        if (char === ',' || char === ' ') return char;
        // chars settle left-to-right as frameCount progresses
        if (frameCount > i * (totalFrames / target.length)) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      frameCount++;

      if (frameCount > totalFrames) {
        clearInterval(scrambleInterval.current!);
        scrambleInterval.current = null;
        tomorrowEl.textContent = target;

        // "Now." drops in after scramble settles
        nowEl.style.transition = 'none';
        nowEl.style.opacity    = '0';
        nowEl.style.transform  = 'translateY(32px) scale(1.15)';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            nowEl.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
            nowEl.style.opacity    = '1';
            nowEl.style.transform  = 'translateY(0) scale(1)';
          });
        });
      }
    }, 55);
  };

  useEffect(() => {
    const init = async () => {
      const { default: gsap }        = await import('gsap');
      const { ScrollTrigger }        = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      // ── Ken Burns per scene ────────────────────────────────────
      FRAMES.forEach((frame, i) => {
        const imgEl = imgRefs.current[i];
        if (!imgEl) return;
        gsap.fromTo(
          imgEl,
          { scale: frame.from.scale, x: frame.from.x, y: frame.from.y },
          {
            scale: frame.to.scale, x: frame.to.x, y: frame.to.y,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: `${i * SCENE_STEP}% top`,
              end:   `${(i + 1) * SCENE_STEP}% top`,
              scrub: 2.5,
            },
          }
        );
      });

      // ── Image crossfades ───────────────────────────────────────
      FADES.forEach(([outIdx, inIdx, start, end]) => {
        gsap.to(imgRefs.current[outIdx], {
          opacity: 0, ease: 'none',
          scrollTrigger: { trigger: container, start, end, scrub: 1.5 },
        });
        gsap.fromTo(imgRefs.current[inIdx],
          { opacity: 0 },
          { opacity: 1, ease: 'none',
            scrollTrigger: { trigger: container, start, end, scrub: 1.5 } }
        );
      });

      // ── Text opacity + upward drift ────────────────────────────
      FRAMES.forEach((_, i) => {
        const textEl = textRefs.current[i];
        if (!textEl) return;

        const s  = i * SCENE_STEP;
        const e  = (i + 1) * SCENE_STEP;

        // Frame 0 is already opacity:1 in the DOM — skip the fromTo so GSAP
        // doesn't override it to 0 before the user scrolls at all
        if (i > 0) {
          gsap.fromTo(textEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: 'power2.out',
              scrollTrigger: { trigger: container, start: `${s}% top`, end: `${s + 3}% top`, scrub: 1 } }
          );
        }
        if (i < FRAMES.length - 1) {
          gsap.to(textEl, {
            opacity: 0, y: -22, ease: 'none',
            scrollTrigger: { trigger: container, start: `${e - 6}% top`, end: `${e}% top`, scrub: 1 },
          });
        }
      });

      // Trigger reveal text animation when frame 3 scrolls into view — replay on re-entry
      ScrollTrigger.create({
        trigger: container,
        start: '60% top',
        onEnter: triggerRevealText,
        onLeaveBack: resetRevealText,
      });

      // ── Scroll handler: progress bars + frame state ────────────
      let rafId: number;
      const onScroll = () => {
        const rect      = container.getBoundingClientRect();
        const scrollable = container.clientHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Update bars directly
          FRAMES.forEach((_, i) => {
            const bar  = barFillRefs.current[i];
            if (!bar) return;
            const s    = i * 0.25;
            const e    = (i + 1) * 0.25;
            const fill = progress >= e ? 100 : progress <= s ? 0 : ((progress - s) / 0.25) * 100;
            bar.style.width = `${fill}%`;
          });

          const newFrame = progress < 0.2 ? 0 : progress < 0.4 ? 1 : progress < 0.6 ? 2 : 3;
          if (newFrame !== prevFrameRef.current) {
            prevFrameRef.current = newFrame;
            setCurrentFrame(newFrame);
          }
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      return () => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(rafId);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    };

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  return (
    // 500vh: transitions in first 300vh, reveal sits for 200vh
    <div ref={containerRef} style={{ height: '500vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#080604' }}>

        {/* Images */}
        {FRAMES.map((f, i) => (
          <div
            key={f.id}
            ref={el => { imgRefs.current[i] = el; }}
            style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0, willChange: 'transform, opacity' }}
          >
            <Image
              src={f.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center', willChange: 'transform' }}
            />
          </div>
        ))}

        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,6,4,0.1) 0%, rgba(8,6,4,0.42) 55%, rgba(8,6,4,0.9) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Text layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {FRAMES.map((f, i) => (
            <div
              key={f.id}
              ref={el => { textRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                bottom: 'clamp(96px, 12vh, 136px)',
                left:  'clamp(28px, 5.5vw, 80px)',
                right: 'clamp(28px, 5.5vw, 80px)',
                opacity: i === 0 ? 1 : 0,
                pointerEvents: i === currentFrame ? 'auto' : 'none',
              }}
            >
              {f.isReveal ? (
                <div>
                  <p style={{ ...sans, fontSize: '10px', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.38)', marginBottom: '24px', textTransform: 'uppercase' }}>
                    Atinuda 7.0
                  </p>

                  {/* Animated headline */}
                  <h1 style={{ ...sd, lineHeight: 0.9, color: '#fff', marginBottom: '36px', margin: 0 }}>
                    <span
                      ref={tomorrowRef}
                      style={{ display: 'block', fontSize: 'clamp(3.2rem, 7vw, 8rem)' }}
                    >
                      Tomorrow,
                    </span>
                    <span
                      ref={nowRef}
                      style={{
                        display: 'block',
                        fontSize: 'clamp(5rem, 11vw, 13rem)',
                        letterSpacing: '-0.02em',
                        opacity: 0,
                        transform: 'translateY(32px) scale(1.15)',
                        marginTop: '-0.05em',
                      }}
                    >
                      Now.
                    </span>
                  </h1>

                  {/* Date — bold and prominent */}
                  <div style={{ marginTop: '44px', marginBottom: '28px' }}>
                    <p style={{
                      ...sd,
                      fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
                      color: '#fff',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}>
                      October 6 – 8
                    </p>
                    <p style={{ ...sans, fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
                      Registration opens soon
                    </p>
                  </div>

                  <Link
                    href="/7.0-waitlist"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 14,
                      background: COPPER, color: '#fff',
                      padding: '16px 42px',
                      ...sans, fontSize: '11px', letterSpacing: '0.16em',
                      textTransform: 'uppercase', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Join the Waitlist <span aria-hidden>→</span>
                  </Link>
                </div>
              ) : (
                <h2 style={{
                  ...sd,
                  fontSize: 'clamp(2.8rem, 5.6vw, 6rem)',
                  lineHeight: 1.1, color: '#fff', margin: 0,
                }}>
                  {f.lines.map((line, j) => (
                    <span key={j} style={{ display: 'block' }}>{line}</span>
                  ))}
                </h2>
              )}
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div style={{
          position: 'absolute', bottom: 44, zIndex: 3,
          left:  'clamp(28px, 5.5vw, 80px)',
          right: 'clamp(28px, 5.5vw, 80px)',
          display: 'flex', gap: 6,
        }}>
          {FRAMES.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '1.5px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
              <div ref={el => { barFillRefs.current[i] = el; }} style={{ height: '100%', background: 'rgba(255,255,255,0.78)', width: '0%' }} />
            </div>
          ))}
        </div>

        {/* Scroll nudge */}
        <div style={{
          position: 'absolute', bottom: 52,
          right: 'clamp(28px, 5.5vw, 80px)',
          zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: currentFrame === 0 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <p style={{ ...sans, fontSize: '9px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Scroll</p>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.16)' }} />
        </div>

      </div>
    </div>
  );
}
