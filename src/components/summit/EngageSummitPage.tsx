'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Handshake,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };
const EASE = [0.22, 1, 0.36, 1] as const;

const HIGHLIGHTS = [
  {
    tag: 'Attendee Calibre',
    title: 'Founders, operators, policy makers, and cultural leaders in one room.',
    body: 'The summit curates decision-makers across technology, finance, media, fashion, hospitality, and public institutions.',
  },
  {
    tag: 'Speaker Standard',
    title: 'Voices with operating proof, not recycled opinion.',
    body: 'Main-stage and breakout sessions are led by people who have built, scaled, regulated, or financed real businesses.',
  },
  {
    tag: 'Programme Design',
    title: 'Editorial pacing from morning keynotes to black-tie close.',
    body: 'Each chapter is designed to move delegates from strategic insight to practical alignment and direct relationship-building.',
  },
  {
    tag: 'Strategic Value',
    title: 'A room where partnerships, mandates, and next-year plans begin.',
    body: 'Across editions, delegates return for access to practical conversation and high-trust relationships they cannot source elsewhere.',
  },
];

const PROGRAMME_MODULES = [
  {
    chapter: 'Chapter 01',
    title: 'Main Stage Dialogues',
    image: '/assets/images/summit/H1C10404.jpg',
    summary:
      'Opening keynotes and panels focused on cross-border growth, capital strategy, creative enterprise, and institutional collaboration.',
    sessions: [
      'State of African enterprise and global market access',
      'Finance, governance, and succession planning',
      'Public-private partnerships for creative economies',
      'Founders, boards, and the next chapter of leadership',
    ],
  },
  {
    chapter: 'Chapter 02',
    title: 'Breakout Intelligence Tracks',
    image: '/assets/images/summit/ATINUDA DAY 2_507.jpg',
    summary:
      'Parallel workshops for operators who want practical execution frameworks across brand, technology, finance, and organisation design.',
    sessions: [
      'Deal architecture and negotiation under complexity',
      'Technology as leverage across every business model',
      'Building category authority through narrative discipline',
      'Personal leadership systems for high-growth environments',
    ],
  },
  {
    chapter: 'Chapter 03',
    title: 'Executive Dinner Gala',
    image: '/assets/images/summit/ATINUDA DAY 2_560.jpg',
    summary:
      'An invitation-level evening where the day transitions into deeper relationship work through curated seating, private conversations, and live performance.',
    sessions: [
      'Executive cocktail reception and hosted introductions',
      'Black-tie dinner with curated table composition',
      'Live showcase and closing remarks',
      'Post-dinner networking for partners and delegates',
    ],
  },
];

const SPEAKERS = [
  {
    img: '/assets/images/summit-speakers/yewande.jpg',
    name: 'Yewande Zacchaeus',
    title: 'Chair',
    company: 'Eventful / Coker Creative',
  },
  {
    img: '/assets/images/summit-speakers/lilian.jpg',
    name: 'Lilian Olubi',
    title: 'CEO',
    company: 'EFG Hermes Nigeria',
  },
  {
    img: '/assets/images/summit-speakers/martin.jpg',
    name: 'Dr. Martin Kwende',
    title: 'Founder',
    company: 'Kwende Foundation',
  },
  {
    img: '/assets/images/summit-speakers/osayi.jpg',
    name: 'Osayi Alile',
    title: 'CEO',
    company: 'ACT Foundation',
  },
  {
    img: '/assets/images/summit-speakers/kelvin.jpg',
    name: 'Kelvin Okafor',
    title: 'Artist & Founder',
    company: 'Kelvin Okafor Studios',
  },
  {
    img: '/assets/images/summit-speakers/ezinne.jpg',
    name: 'Ezinne Chinkata',
    title: 'Fashion Entrepreneur',
    company: 'Zinkata',
  },
  {
    img: '/assets/images/summit-speakers/bisola.jpg',
    name: 'Bisola Borha Arigbe',
    title: 'CEO',
    company: 'Truly Scumptious',
  },
  {
    img: '/assets/images/summit-speakers/frank.jpg',
    name: 'Frank Oshodi Richard',
    title: 'Creative Director',
    company: 'House of Bunor',
  },
];

const SUPPORTERS = [
  'Oaken Events',
  'Lagos State Government',
  'SMEDAN',
  'BellaNaija',
  'ThisDay Live',
  'Flutterwave',
  'MIPAD',
  'ACT Foundation',
];

const PARTNERSHIP_TIERS = [
  {
    title: 'Title Partner',
    detail:
      'Lead ownership across summit communications, keynote theatre integration, and full-funnel visibility pre, during, and post event.',
  },
  {
    title: 'Programme Partner',
    detail:
      'Own a strategic track or workshop stream with delegate-facing activations and editorial storytelling opportunities.',
  },
  {
    title: 'Executive Dinner Partner',
    detail:
      'Access the invitation-level evening with curated table hosting, premium visibility, and direct executive engagement.',
  },
  {
    title: 'Spark the Future Partner',
    detail:
      'Support the founder pipeline through pitch finals, mentorship touchpoints, and high-credibility youth innovation exposure.',
  },
];

const INSIGHTS = [
  {
    category: 'Feature',
    publication: 'ThisDay Live',
    date: 'Oct 2025',
    title: "Atinuda 5.0: The Summit Powering Africa's Global Creative Ascent",
    image: '/assets/images/summit/ATINUDA DAY 2_487.jpg',
    href: 'https://www.thisdaylive.com/2025/10/17/atinuda-5-0-the-summit-powering-africas-global-creative-ascent/',
  },
  {
    category: 'News',
    publication: 'BellaNaija',
    date: 'Oct 2025',
    title: 'Konga CEO Urges Nigerian Entrepreneurs to Think Global at Atinuda 5.0',
    image: '/assets/images/summit/ATINUDA DAY 2_507.jpg',
    href: 'https://www.bellanaija.com/2025/10/konga-ceo-entrepreneurs-atinuda/',
  },
  {
    category: 'Preview',
    publication: 'ThisDay Live',
    date: 'Oct 2025',
    title: "Atinuda 5.0 Summit to Spotlight Africa's Creative Transformation in Lagos",
    image: '/assets/images/summit/ATINUDA DAY 2_560.jpg',
    href: 'https://www.thisdaylive.com/2025/10/07/atinuda-5-0-summit-to-spotlight-africas-creative-transformation-in-lagos/',
  },
];

function Reveal({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function EngageSummitPage() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroAtmosphereRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroMetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = heroSectionRef.current;
      const mediaLayer = heroMediaRef.current;
      const overlay = heroOverlayRef.current;
      const atmosphere = heroAtmosphereRef.current;
      const copy = heroCopyRef.current;
      const meta = heroMetaRef.current;

      if (!hero || !mediaLayer || !overlay || !atmosphere || !copy || !meta) return;

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=140%',
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .to(mediaLayer, { scale: 1.16, yPercent: -7 }, 0)
        .to(overlay, { opacity: 0.78 }, 0)
        .to(atmosphere, { opacity: 1 }, 0.08)
        .to(copy, { yPercent: -25, opacity: 0.14 }, 0.05)
        .to(meta, { yPercent: -20, opacity: 0.25 }, 0.06);
    });

    return () => media.revert();
  }, []);

  return (
    <div className="bg-[#040c14] text-white overflow-x-hidden">
      <section ref={heroSectionRef} className="relative h-screen min-h-[700px] overflow-hidden">
        <div ref={heroMediaRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/assets/images/summit/GM5_1341.JPG"
            alt="Local To Global Summit"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        <div ref={heroOverlayRef} className="absolute inset-0 bg-[#040c14]/50" />

        <div
          ref={heroAtmosphereRef}
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(80% 50% at 72% 28%, rgba(255,127,65,0.28) 0%, rgba(255,127,65,0.06) 40%, rgba(4,12,20,0) 75%)',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#040c14]/30 via-transparent to-[#040c14]/88" />

        <motion.div
          ref={heroMetaRef}
          className="absolute top-24 md:top-28 lg:top-32 z-20 w-full px-8 md:px-16 lg:px-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-7 gap-y-2 border-y border-white/12 py-4">
            <span className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/85">ATINUDA · ANNUAL SUMMIT</span>
            <span className="nav-text text-[9px] tracking-[0.18em] text-white/52 inline-flex items-center gap-2">
              <CalendarDays size={10} aria-hidden="true" />
              OCTOBER 2026
            </span>
            <span className="nav-text text-[9px] tracking-[0.18em] text-white/52 inline-flex items-center gap-2">
              <MapPin size={10} aria-hidden="true" />
              LAGOS, NIGERIA
            </span>
            <span className="nav-text text-[9px] tracking-[0.18em] text-white/52 inline-flex items-center gap-2">
              <Users size={10} aria-hidden="true" />
              400+ CURATED DELEGATES
            </span>
          </div>
        </motion.div>

        <div ref={heroCopyRef} className="absolute inset-0 z-10 flex items-end px-8 md:px-16 lg:px-20 pb-14 md:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto w-full">
            <motion.p
              className="nav-text text-[10px] tracking-[0.32em] text-[#ff7f41]/78 mb-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              LOCAL TO GLOBAL SUMMIT
            </motion.p>

            <motion.h1
              style={serifDisplay}
              className="text-[clamp(3.2rem,9.3vw,8.6rem)] leading-[0.9] tracking-tight max-w-5xl"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.24, ease: EASE }}
            >
              Enter the room where
              <br />
              African ambition is
              <br />
              translated into scale.
            </motion.h1>

            <motion.div
              className="mt-9 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            >
              <p className="text-white/70 leading-relaxed">
                A one-day summit engineered for founders, executives, and investors building institutions with regional depth and global reach.
              </p>
            </motion.div>

            <motion.div
              className="mt-9 flex flex-col sm:flex-row items-start gap-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            >
              <Link
                href="/summit/tickets"
                className="inline-flex items-center gap-3 bg-[#ff7f41] text-white nav-text text-[10px] tracking-[0.2em] px-8 py-4 hover:bg-white hover:text-[#040c14] transition-all duration-300"
              >
                REGISTER NOW
              </Link>
              <a
                href="#programme"
                className="inline-flex items-center gap-3 border border-white/20 text-white/62 nav-text text-[10px] tracking-[0.2em] px-8 py-4 hover:border-white/45 hover:text-white transition-all duration-300"
              >
                EXPLORE THE PROGRAMME
                <ArrowRight size={11} />
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 right-8 md:right-16 lg:right-20 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 3.1, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-white/35" />
          <span className="nav-text text-[8px] tracking-[0.28em] text-white/25 [writing-mode:vertical-rl]">SCROLL</span>
        </motion.div>
      </section>

      <section className="bg-[#f5f0eb] text-[#0d1e2c] px-8 md:px-16 lg:px-20 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[220px_1fr] gap-14 items-start">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41] mb-5">POSITIONING</p>
              <div className="space-y-1.5">
                <p className="nav-text text-[9px] tracking-[0.16em] text-[#0d1e2c]/38">ANNUAL SUMMIT</p>
                <p className="nav-text text-[9px] tracking-[0.16em] text-[#0d1e2c]/38">LAGOS</p>
                <p className="nav-text text-[9px] tracking-[0.16em] text-[#0d1e2c]/38">SINCE 2015</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl lg:text-6xl leading-[1.04] text-[#0d1e2c] max-w-4xl">
                The summit is not a stage for noise.
                <br />
                It is a working room for people
                <br />
                building what lasts.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-t border-[#0d1e2c]/12 pt-8 grid md:grid-cols-2 gap-8">
                <p className="text-[#0d1e2c]/66 leading-relaxed text-[1.02rem]">
                  Atinuda&apos;s summit format carries the same DNA as the retreat: curated attendance, deliberate rhythm, and conversations designed to produce real movement, not surface-level inspiration.
                </p>
                <p className="text-[#0d1e2c]/56 leading-relaxed text-sm">
                  Delegates arrive for strategic clarity, operating insight, and decision-grade relationships. The day moves through keynote context, breakout depth, and an executive evening where high-trust partnerships begin.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#040c14] px-8 md:px-16 lg:px-20 border-y border-white/7">
        <div className="max-w-7xl mx-auto py-14 lg:py-16">
          <Reveal>
            <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/74 mb-10">EVENT HIGHLIGHTS</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            {HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.tag} delay={index * 0.05}>
                <article className="border-t border-white/8 pt-6">
                  <p className="nav-text text-[9px] tracking-[0.2em] text-[#ff7f41]/68 mb-4">{item.tag.toUpperCase()}</p>
                  <h3 style={serif} className="text-2xl text-white/90 leading-snug mb-3 max-w-xl">
                    {item.title}
                  </h3>
                  <p className="text-white/44 text-sm leading-relaxed max-w-xl">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="programme" className="bg-[#081727] px-8 md:px-16 lg:px-20 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 lg:mb-16">
            <Reveal>
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41] mb-6">PROGRAMME OVERVIEW</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl text-white leading-tight">
                A day paced like
                <br />
                an editorial issue.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-white/35 text-sm leading-relaxed max-w-sm md:text-right">
                2026 session titles will be announced closer to the summit. This structure reflects the active format delegates can expect.
              </p>
            </Reveal>
          </div>

          <div className="space-y-12 lg:space-y-16">
            {PROGRAMME_MODULES.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <article className="grid lg:grid-cols-[1.08fr_1fr] gap-10 lg:gap-14 items-stretch">
                  <div className={`relative min-h-[280px] md:min-h-[360px] overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c14]/80 via-[#040c14]/25 to-transparent" />
                    <div className="absolute left-5 bottom-5 md:left-7 md:bottom-7">
                      <p className="nav-text text-[9px] tracking-[0.2em] text-[#ff7f41]/75 mb-2">{item.chapter.toUpperCase()}</p>
                      <p style={serif} className="text-2xl md:text-3xl text-white/90 leading-tight max-w-md">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <div className={`border border-white/8 bg-[#040c14]/44 p-7 md:p-9 lg:p-10 flex flex-col ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="text-white/50 leading-relaxed text-sm mb-7">{item.summary}</p>

                    <details className="group border-t border-white/8 pt-5" open>
                      <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                        <span className="nav-text text-[9px] tracking-[0.18em] text-white/50">SESSION LINES</span>
                        <span className="text-white/30 group-open:rotate-90 transition-transform duration-300">+</span>
                      </summary>
                      <ul className="mt-5 space-y-3.5">
                        {item.sessions.map((session) => (
                          <li key={session} className="flex items-start gap-3 text-white/70 text-sm leading-snug">
                            <span className="mt-2 h-[1px] w-4 bg-[#ff7f41]/70 shrink-0" />
                            {session}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#040c14] px-8 md:px-16 lg:px-20 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start mb-12">
            <Reveal>
              <div className="relative min-h-[420px] overflow-hidden">
                <Image
                  src={SPEAKERS[0].img}
                  alt={SPEAKERS[0].name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040c14]/82 via-[#040c14]/30 to-transparent" />
                <div className="absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8">
                  <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/80 mb-4">SPEAKER FOCUS</p>
                  <h2 style={serifDisplay} className="text-4xl md:text-5xl text-white leading-tight mb-4">
                    Voices with
                    <br />
                    strategic range.
                  </h2>
                  <p className="text-white/76 text-base">{SPEAKERS[0].name}</p>
                  <p className="nav-text text-[9px] tracking-[0.16em] text-white/38 mt-1">
                    {SPEAKERS[0].title.toUpperCase()} · {SPEAKERS[0].company.toUpperCase()}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.06}>
                <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/78">SPEAKERS</p>
                <p className="text-white/44 leading-relaxed text-sm mt-5">
                  Presented in an editorial format to emphasise authority and perspective rather than generic conference card layouts.
                </p>
              </Reveal>

              <div className="border-t border-white/8">
                {SPEAKERS.slice(1, 5).map((speaker, index) => (
                  <Reveal key={speaker.name} delay={0.08 + index * 0.05}>
                    <div className="py-5 border-b border-white/8 group">
                      <p className="text-white/80 group-hover:text-white transition-colors">{speaker.name}</p>
                      <p className="nav-text text-[9px] tracking-[0.16em] text-white/30 mt-1">
                        {speaker.title.toUpperCase()} · {speaker.company.toUpperCase()}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.2}>
                <Link
                  href="/summit/tickets"
                  className="inline-flex items-center gap-3 border border-[#ff7f41]/34 text-[#ff7f41] nav-text text-[10px] tracking-[0.18em] px-7 py-3.5 hover:bg-[#ff7f41] hover:text-white transition-all duration-300"
                >
                  SECURE SUMMIT ACCESS
                  <ArrowRight size={11} />
                </Link>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/7">
            {SPEAKERS.slice(4).map((speaker, index) => (
              <Reveal key={speaker.name} delay={index * 0.05}>
                <motion.article className="group relative bg-[#081727] overflow-hidden" whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={speaker.img}
                      alt={speaker.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c14]/78 via-[#040c14]/18 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="text-white/86 text-sm leading-snug">{speaker.name}</p>
                    <p className="nav-text text-[8px] tracking-[0.14em] text-white/34 mt-1">{speaker.company.toUpperCase()}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f0eb] text-[#0d1e2c] px-8 md:px-16 lg:px-20 py-24 lg:py-28 border-t border-[#ddd5cb]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41] mb-6">TICKETS & REGISTRATION</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl text-[#0d1e2c] leading-tight mb-7">
                Two access levels.
                <br />
                One high-value day.
              </h2>
              <p className="text-[#0d1e2c]/62 leading-relaxed mb-8 max-w-lg">
                Ticketing is designed as an invitation, not a commodity grid. Conference and Executive passes are structured for distinct levels of access and relationship depth.
              </p>
              <Link
                href="/summit/tickets"
                className="inline-flex items-center gap-3 bg-[#0d1e2c] text-white nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:bg-[#ff7f41] transition-all duration-300"
              >
                VIEW TICKETS
                <ArrowRight size={11} />
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-px bg-[#dfd8cf]">
            <Reveal delay={0.08}>
              <article className="bg-[#f5f0eb] p-7 md:p-8 min-h-[280px]">
                <p className="nav-text text-[9px] tracking-[0.2em] text-[#0d1e2c]/38 mb-3">TIER 01</p>
                <h3 style={serif} className="text-3xl text-[#0d1e2c] mb-4">Conference</h3>
                <p className="text-sm text-[#0d1e2c]/55 leading-relaxed mb-6">
                  Main-stage access, keynote and panel programming, workshop tracks, and evening cocktail reception.
                </p>
                <p className="nav-text text-[9px] tracking-[0.16em] text-[#ff7f41]">FROM ₦295,000 / $200</p>
              </article>
            </Reveal>

            <Reveal delay={0.14}>
              <article className="bg-[#f5f0eb] p-7 md:p-8 min-h-[280px] border-l border-[#dfd8cf]">
                <p className="nav-text text-[9px] tracking-[0.2em] text-[#0d1e2c]/38 mb-3">TIER 02</p>
                <h3 style={serif} className="text-3xl text-[#0d1e2c] mb-4">Executive</h3>
                <p className="text-sm text-[#0d1e2c]/55 leading-relaxed mb-6">
                  Everything in Conference, plus priority seating and invitation to the Executive Dinner Gala.
                </p>
                <p className="nav-text text-[9px] tracking-[0.16em] text-[#ff7f41]">FROM ₦650,000 / $440</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#081727] px-8 md:px-16 lg:px-20 py-24 border-y border-white/7">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center justify-between gap-6 mb-10">
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/75">PARTNERS & SUPPORTERS</p>
              <span className="nav-text text-[8px] tracking-[0.2em] text-white/30">SELECTED ACROSS EDITIONS</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/7">
            {SUPPORTERS.map((name, index) => (
              <Reveal key={name} delay={index * 0.03}>
                <div className="h-20 bg-[#040c14] flex items-center justify-center px-3">
                  <span className="nav-text text-[10px] tracking-[0.18em] text-white/44 text-center">{name.toUpperCase()}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#040c14] px-8 md:px-16 lg:px-20 py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.08fr] gap-16 items-start">
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/75 mb-7 inline-flex items-center gap-2">
                <Handshake size={11} aria-hidden="true" />
                SPONSORSHIP ACCESS
              </p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl text-white leading-tight mb-7">
                Partnership here is
                <br />
                strategic proximity.
              </h2>
              <p className="text-white/44 leading-relaxed mb-9 max-w-md">
                Sponsorship is framed as category access to a curated, paying audience of senior operators, founders, and policy-aligned stakeholders.
              </p>
              <a
                href="mailto:hello@atinuda.com?subject=Local To Global Summit — Sponsorship"
                className="inline-flex items-center gap-3 bg-[#ff7f41] text-white nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:bg-white hover:text-[#040c14] transition-all duration-300"
              >
                DISCUSS PARTNERSHIP
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="border border-white/8 divide-y divide-white/8">
              {PARTNERSHIP_TIERS.map((tier, index) => (
                <div key={tier.title} className="p-6 md:p-7 group hover:bg-white/[0.02] transition-colors duration-300">
                  <p className="nav-text text-[9px] tracking-[0.18em] text-[#ff7f41]/62 mb-2">TIER {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-white/82 leading-snug mb-2">{tier.title}</h3>
                  <p className="text-white/38 text-sm leading-relaxed">{tier.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f5f0eb] px-8 md:px-16 lg:px-20 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41] mb-5">RELATED INSIGHTS</p>
                <h2 style={serifDisplay} className="text-4xl md:text-5xl text-[#0d1e2c] leading-tight">
                  Reporting from the room.
                </h2>
              </div>
              <Link
                href="/press"
                className="nav-text text-[10px] tracking-[0.2em] text-[#0d1e2c]/40 hover:text-[#0d1e2c] transition-colors inline-flex items-center gap-2"
              >
                VIEW PRESS
                <ArrowRight size={11} />
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-[#e4dcd3]">
            {INSIGHTS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#f5f0eb]"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[#040c14]/20 group-hover:bg-[#040c14]/4 transition-colors duration-500" />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="nav-text text-[9px] tracking-[0.2em] text-[#ff7f41]">{item.category.toUpperCase()}</span>
                      <span className="nav-text text-[8px] tracking-[0.1em] text-[#0d1e2c]/30">{item.date}</span>
                    </div>
                    <p className="text-[#0d1e2c]/78 text-sm leading-snug mb-3 group-hover:text-[#0d1e2c] transition-colors">
                      {item.title}
                    </p>
                    <p className="nav-text text-[8px] tracking-[0.14em] text-[#0d1e2c]/34">{item.publication.toUpperCase()}</p>
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[72vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/summit/RBS13419.jpg"
            alt="Local To Global Summit closing moment"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040c14] via-[#040c14]/72 to-[#040c14]/30" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 lg:px-20 py-20 md:py-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="nav-text text-[9px] tracking-[0.36em] text-[#ff7f41]/82 mb-7 inline-flex items-center gap-2">
                <Sparkles size={11} aria-hidden="true" />
                LOCAL TO GLOBAL SUMMIT 2026
              </p>
              <h2 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl text-white leading-[0.94] max-w-3xl mb-9">
                The summit opens once.
                <br />
                The after-effect lasts all year.
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/summit/tickets"
                  className="inline-flex items-center gap-3 bg-[#ff7f41] text-white nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:bg-white hover:text-[#040c14] transition-all duration-300"
                >
                  GET YOUR TICKET
                </Link>
                <a
                  href="mailto:hello@atinuda.com"
                  className="inline-flex items-center gap-3 border border-white/18 text-white/60 nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:border-white/44 hover:text-white transition-all duration-300"
                >
                  ENQUIRE
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
