'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PillarsSection } from '@/sections/home/PillarsSection';

gsap.registerPlugin(ScrollTrigger);

const sd = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const INK = '#1a1040';
const COPPER = '#b5622a';
const BG = '#faf9fe';

const GALLERY = [
  {
    img: '/assets/images/Retreat/Together/ATINUDA6_DAY3_35.JPG',
    label: 'Six years',
    headline: 'Built in the room.',
    sub: 'Every edition, a different city. Every room, the same standard.',
  },
  {
    img: '/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_17.JPG',
    label: 'The work',
    headline: 'Where clarity lives.',
    sub: 'Ideas that could only emerge when the right people are in proximity.',
  },
  {
    img: '/assets/images/Retreat/Within/ATINUDA6_DAY2_17.JPG',
    label: 'The elevation',
    headline: 'You become the room.',
    sub: "Africa's most consequential founders, executives, and cultural architects.",
  },
  {
    img: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_425.JPG',
    label: 'The craft',
    headline: 'Sharpened here.',
    sub: 'Every touchpoint a masterclass. Every conversation, a transfer of excellence.',
  },
  {
    img: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_45.JPG',
    label: 'Atinuda 7.0',
    headline: 'Tomorrow, now.',
    sub: 'The next chapter begins. Register your interest and be the first to know.',
  },
];

const NOTABLES = [
  { name: 'Founders', descriptor: 'Early-stage to series-funded, building across tech, fashion, hospitality, and media.' },
  { name: 'Executives', descriptor: 'C-suite and senior leadership from global and African corporations operating on the continent.' },
  { name: 'Creatives', descriptor: 'Music, film, art, and brand directors whose work defines African culture for a global audience.' },
  { name: 'Investors', descriptor: 'GPs, LPs, and family offices actively deploying capital across African markets.' },
];

export function HomeContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── HERO: staggered entry on load ─────────────────────
      gsap.timeline({ delay: 0.15 })
        .from('.hero-label', { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.hero-line-1', { y: 80, opacity: 0, duration: 1.05, ease: 'power3.out' }, '-=0.3')
        .from('.hero-line-2', { y: 80, opacity: 0, duration: 1.05, ease: 'power3.out' }, '-=0.75')
        .from('.hero-desc', { y: 26, opacity: 0, duration: 0.85, ease: 'power2.out' }, '-=0.45')
        .from('.hero-cta', { y: 18, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35');

      // ── PLATFORM: scroll reveals ──────────────────────────
      gsap.from('.plat-eye', {
        y: 18, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.plat-eye', start: 'top 87%', toggleActions: 'play none none none' },
      });
      gsap.from('.plat-head', {
        y: 44, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.plat-head', start: 'top 83%', toggleActions: 'play none none none' },
      });
      gsap.from('.plat-body p', {
        y: 28, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.plat-body', start: 'top 80%', toggleActions: 'play none none none' },
      });
      gsap.from('.stat-cell', {
        y: 22, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.stats-grid', start: 'top 83%', toggleActions: 'play none none none' },
      });

      // ── CINEMATIC GALLERY: pinned scrub ───────────────────
      const panels = gsap.utils.toArray<HTMLElement>('.c-panel');
      if (panels.length) {
        // Initial state: all panels hidden except first
        gsap.set(panels.slice(1), { opacity: 0 });
        gsap.set('.c-bar', { scaleX: 0, transformOrigin: 'left center' });

        const hold = 0.7;
        const fade = 0.3;
        const N = panels.length;
        const totalDuration = (N - 1) * (hold + fade) + hold + 0.5;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.c-pin',
            start: 'top top',
            end: '+=400%',
            scrub: 1.4,
            pin: true,
            pinSpacing: true,
          },
        });

        // Progress bar sweeps across full duration
        tl.to('.c-bar', { scaleX: 1, duration: totalDuration, ease: 'none' }, 0);

        // Chapter crossfades
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const t = (i - 1) * (hold + fade) + hold;
          tl.to(panels[i - 1], { opacity: 0, duration: fade }, t);
          tl.to(panel, { opacity: 1, duration: fade }, t);
        });
      }

      // ── THE ROOM: scroll reveals ──────────────────────────
      gsap.from('.room-eye, .room-head', {
        y: 28, opacity: 0, stagger: 0.15, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.room-head', start: 'top 83%', toggleActions: 'play none none none' },
      });
      gsap.from('.room-img', {
        y: 44, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.room-grid', start: 'top 77%', toggleActions: 'play none none none' },
      });
      gsap.from('.notable-cell', {
        y: 22, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: '.notables-grid', start: 'top 80%', toggleActions: 'play none none none' },
      });

      // ── CTA: scroll reveals ───────────────────────────────
      gsap.from('.cta-eye', {
        y: 14, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta-eye', start: 'top 83%', toggleActions: 'play none none none' },
      });
      gsap.from('.cta-head', {
        y: 54, opacity: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-head', start: 'top 80%', toggleActions: 'play none none none' },
      });
      gsap.from('.cta-body', {
        y: 26, opacity: 0, duration: 0.85, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta-body', start: 'top 83%', toggleActions: 'play none none none' },
      });
      gsap.from('.cta-btn', {
        y: 16, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta-btn', start: 'top 87%', toggleActions: 'play none none none' },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Retreat/landinghero.JPG"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(26,16,64,0.25) 0%, rgba(26,16,64,0.6) 55%, rgba(26,16,64,0.94) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 md:px-16 lg:px-20 pb-24 md:pb-36">
          <p
            className="hero-label nav-text uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.42)', marginBottom: '28px' }}
          >
            Atinuda 7.0
          </p>

          <h1
            style={{
              ...sd,
              fontSize: 'clamp(4rem, 10vw, 9.5rem)',
              lineHeight: '0.92',
              color: '#fff',
              marginBottom: '40px',
            }}
          >
            <span className="hero-line-1" style={{ display: 'block' }}>Tomorrow,</span>
            <span className="hero-line-2" style={{ display: 'block' }}>Now.</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-28">
            <p
              className="hero-desc"
              style={{
                fontSize: '17px',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.58)',
                maxWidth: '420px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
              }}
            >
              The platform that connects Africa&apos;s most influential creators, founders,
              and executives, on the continent, in the diaspora, and across the world.
            </p>
            <Link
              href="/7.0-waitlist"
              className="hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: COPPER,
                color: '#fff',
                padding: '15px 36px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Join the Waitlist
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATFORM ──────────────────────────────────────────── */}
      <section style={{ background: BG, padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-start">

            <div className="md:sticky md:top-32">
              <p
                className="plat-eye nav-text uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(26,16,64,0.32)', marginBottom: '32px' }}
              >
                The Platform
              </p>
              <h2
                className="plat-head"
                style={{ ...sd, fontSize: 'clamp(2.6rem, 4.5vw, 5rem)', color: INK, lineHeight: '1.06' }}
              >
                Not an event.<br />A platform.
              </h2>
            </div>

            <div className="plat-body" style={{ paddingTop: '4px' }}>
              <p
                style={{
                  fontSize: '20px',
                  lineHeight: '1.75',
                  color: 'rgba(26,16,64,0.68)',
                  marginBottom: '28px',
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                }}
              >
                <em style={{ fontStyle: 'italic', color: INK, fontFamily: 'SaolDisplay, Georgia, serif' }}>Átinúdá</em>: to rise, to ascend, to be lifted by the work
                and the room you keep. Seven editions in, the name still says everything.
              </p>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.85',
                  color: 'rgba(26,16,64,0.5)',
                  marginBottom: '56px',
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                }}
              >
                We built a summit. Then a retreat. Then a members community that spans five
                continents. Atinuda 7.0 is the next chapter — a platform year that brings
                Africa&apos;s creative and business leadership into one extended conversation,
                across multiple touchpoints, cities, and formats.
              </p>

              <div
                className="stats-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1px',
                  background: 'rgba(26,16,64,0.08)',
                }}
              >
                {[
                  { n: '7', label: 'Editions' },
                  { n: '6+', label: 'Cities' },
                  { n: '20+', label: 'Countries' },
                ].map(({ n, label }) => (
                  <div className="stat-cell" key={label} style={{ background: BG, padding: '32px 24px' }}>
                    <p style={{ ...sd, fontSize: '3.2rem', color: INK, lineHeight: 1 }}>{n}</p>
                    <p
                      className="nav-text uppercase"
                      style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(26,16,64,0.32)', marginTop: '10px' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC GALLERY ─────────────────────────────────── */}
      <div
        className="c-pin"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: INK }}
      >
        {GALLERY.map((ch, i) => (
          <div
            key={i}
            className="c-panel"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === 0 ? 1 : 0,
              willChange: 'opacity',
            }}
          >
            <Image
              src={ch.img}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={i === 0}
            />
            {/* Dark vignette overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(26,16,64,0.06) 0%, rgba(26,16,64,0.5) 60%, rgba(26,16,64,0.82) 100%)',
              }}
            />

            {/* Chapter text */}
            <div
              style={{
                position: 'absolute',
                bottom: '13%',
                left: 0,
                padding: '0 clamp(32px, 6vw, 80px)',
                maxWidth: '860px',
              }}
            >
              <p
                className="nav-text uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.42em', color: COPPER, marginBottom: '18px' }}
              >
                {ch.label}
              </p>
              <h2
                style={{
                  ...sd,
                  fontSize: 'clamp(2.8rem, 5.5vw, 6.5rem)',
                  color: '#fff',
                  lineHeight: '0.94',
                  marginBottom: '22px',
                }}
              >
                {ch.headline}
              </h2>
              <p
                style={{
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                  fontSize: 'clamp(14px, 1.4vw, 17px)',
                  lineHeight: '1.8',
                  color: 'rgba(255,255,255,0.5)',
                  maxWidth: '420px',
                }}
              >
                {ch.sub}
              </p>
            </div>
          </div>
        ))}

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 10,
          }}
        >
          <div
            className="c-bar"
            style={{ height: '100%', background: COPPER }}
          />
        </div>

        {/* Edition label — top right */}
        <div
          style={{
            position: 'absolute',
            top: '36px',
            right: 'clamp(32px, 5vw, 80px)',
            zIndex: 10,
          }}
        >
          <span
            className="nav-text uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.26)' }}
          >
            Six years of Atinuda
          </span>
        </div>
      </div>

      {/* ── THREE PILLARS ─────────────────────────────────────── */}
      <PillarsSection />

      {/* ── THE ROOM ──────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div style={{ marginBottom: '64px' }}>
            <p
              className="room-eye nav-text uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(26,16,64,0.3)', marginBottom: '24px' }}
            >
              The Room
            </p>
            <h2
              className="room-head"
              style={{ ...sd, fontSize: 'clamp(2.6rem, 4vw, 4.5rem)', color: INK, lineHeight: '1.06' }}
            >
              Who&apos;s in the room.
            </h2>
          </div>

          <div
            className="room-grid grid grid-cols-2 md:grid-cols-4"
            style={{ gap: '2px', marginBottom: '2px', height: '360px' }}
          >
            {[
              '/assets/images/azizi1.jpeg',
              '/assets/images/azizi3.jpeg',
              '/assets/images/azizi5.jpeg',
              '/assets/images/azizi7.jpeg',
            ].map((src, i) => (
              <div key={i} className="room-img relative overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>

          <div
            className="notables-grid grid md:grid-cols-4"
            style={{ gap: '1px', background: 'rgba(26,16,64,0.07)' }}
          >
            {NOTABLES.map((n) => (
              <div className="notable-cell" key={n.name} style={{ background: '#fff', padding: '36px 28px' }}>
                <p style={{ ...sd, fontSize: '1.35rem', color: INK, marginBottom: '12px' }}>{n.name}</p>
                <p
                  style={{
                    fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                    fontSize: '13px',
                    lineHeight: '1.65',
                    color: 'rgba(26,16,64,0.45)',
                  }}
                >
                  {n.descriptor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7.0 CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: '160px 0' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Mauritius2.png"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(26,16,64,0.88)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div style={{ maxWidth: '580px' }}>
            <p
              className="cta-eye nav-text uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.32)', marginBottom: '36px' }}
            >
              Atinuda 7.0 · 2026
            </p>
            <h2
              className="cta-head"
              style={{
                ...sd,
                fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                color: '#fff',
                lineHeight: '0.94',
                marginBottom: '36px',
              }}
            >
              Lagos will set<br />the standard<br />for influence.
            </h2>
            <p
              className="cta-body"
              style={{
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '17px',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '52px',
                maxWidth: '400px',
              }}
            >
              The room is forming. The names are being placed.
              Register your interest now and be the first to know
              when doors open.
            </p>
            <Link
              href="/7.0-waitlist"
              className="cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: COPPER,
                color: '#fff',
                padding: '16px 40px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Register Interest
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
