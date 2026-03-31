'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, CircleCheck, MapPin, ShieldCheck } from 'lucide-react';
import Payment from '@/components/ui/Payment';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };
const EASE = [0.22, 1, 0.36, 1] as const;

const ACCESS_LAYERS = [
  {
    name: 'Conference Pass',
    label: 'Tier 01',
    image: '/assets/images/summit/H1C10415.jpg',
    note: 'From ₦295,000 / $200',
    summary:
      'Main-stage programme, keynote and panel sessions, breakout workshops, networking lunch, and cocktail reception.',
    lines: [
      'Full daytime summit access',
      'Workshop track participation',
      'Spark the Future pitch finals',
      'Cocktail reception from 17:00',
    ],
  },
  {
    name: 'Executive Pass',
    label: 'Tier 02',
    image: '/assets/images/summit/ATINUDA DAY 2_560.jpg',
    note: 'From ₦650,000 / $440',
    summary:
      'Everything in Conference plus invitation to the Executive Dinner Gala with priority access and curated seating.',
    lines: [
      'Priority summit seating',
      'Black-tie Executive Dinner Gala',
      'Curated evening table placement',
      'Post-dinner executive networking',
    ],
  },
];

const BOOKING_FLOW = [
  {
    step: '01',
    title: 'Select your pass',
    body: 'Choose Conference or Executive access in NGN or USD, then set ticket quantity.',
  },
  {
    step: '02',
    title: 'Complete secure checkout',
    body: 'Payments are processed through Flutterwave with immediate order confirmation.',
  },
  {
    step: '03',
    title: 'Receive summit credentials',
    body: 'Ticket confirmation and onboarding details are sent directly after payment.',
  },
];

const SUMMIT_IMAGES = [
  '/assets/images/summit/GM5_1315.JPG',
  '/assets/images/summit/IMG_0733L.jpg',
  '/assets/images/summit/H1C10404.jpg',
  '/assets/images/summit/ATINUDA DAY 2_487.jpg',
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
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TicketsPage() {
  return (
    <div className="bg-[#040c14] text-white min-h-screen overflow-x-hidden">
      <div className="px-8 md:px-16 lg:px-20 pt-8">
        <Link
          href="/summit"
          className="inline-flex items-center gap-2 nav-text text-[9px] tracking-[0.2em] text-white/34 hover:text-white/66 transition-colors"
        >
          <ArrowLeft size={10} />
          BACK TO SUMMIT
        </Link>
      </div>

      <section className="px-8 md:px-16 lg:px-20 pt-16 pb-20 border-b border-white/7">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_390px] gap-12 lg:gap-16 items-end">
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.36em] text-[#ff7f41]/78 mb-7">TICKETS · LOCAL TO GLOBAL SUMMIT</p>
              <h1 style={serifDisplay} className="text-[clamp(3rem,7vw,6.6rem)] leading-[0.92] tracking-tight max-w-4xl">
                Choose your seat
                <br />
                in the room.
              </h1>
              <p className="text-white/48 leading-relaxed mt-7 max-w-xl">
                Ticketing is designed with the same discipline as the programme: clear tiers, deliberate access differences, and a checkout flow that respects delegate time.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="border border-white/12 p-6 md:p-7 lg:p-8 bg-[#081727]">
              <p className="nav-text text-[9px] tracking-[0.22em] text-[#ff7f41]/76 mb-5">AT A GLANCE</p>
              <div className="space-y-4 text-sm text-white/58">
                <p className="inline-flex items-center gap-2"><CalendarDays size={13} aria-hidden="true" /> October 2026</p>
                <p className="inline-flex items-center gap-2"><MapPin size={13} aria-hidden="true" /> Lagos, Nigeria</p>
                <p className="inline-flex items-center gap-2"><ShieldCheck size={13} aria-hidden="true" /> NGN + USD checkout available</p>
              </div>
              <p className="text-white/35 text-xs mt-6 leading-relaxed">
                Group attendance and partnership-linked delegate blocks are managed via the summit team.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-20 py-20 border-b border-white/7">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/75 mb-10">ACCESS LAYERS</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-px bg-white/8">
            {ACCESS_LAYERS.map((pass, index) => (
              <Reveal key={pass.name} delay={index * 0.08}>
                <article className="bg-[#040c14] group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pass.image}
                      alt={pass.name}
                      fill
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c14]/82 via-[#040c14]/30 to-transparent" />
                    <div className="absolute left-6 bottom-6">
                      <p className="nav-text text-[9px] tracking-[0.2em] text-[#ff7f41]/80">{pass.label.toUpperCase()}</p>
                      <p style={serif} className="text-3xl text-white leading-tight mt-1">{pass.name}</p>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 border-t border-white/8">
                    <p className="nav-text text-[9px] tracking-[0.18em] text-[#ff7f41] mb-4">{pass.note.toUpperCase()}</p>
                    <p className="text-white/52 text-sm leading-relaxed mb-6">{pass.summary}</p>
                    <ul className="space-y-3">
                      {pass.lines.map((line) => (
                        <li key={line} className="flex items-start gap-2.5 text-sm text-white/72 leading-snug">
                          <CircleCheck size={13} className="text-[#ff7f41] mt-0.5 shrink-0" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="purchase" className="bg-[#f5f0eb] px-8 md:px-16 lg:px-20 py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10">
              <p className="nav-text text-[9px] tracking-[0.36em] text-[#ff7f41] mb-5">CHECKOUT</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl text-[#0d1e2c] leading-tight">
                Confirm your access.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-[#e2d9cf] bg-white p-5 md:p-8 lg:p-10">
              <Payment />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-[#0d1e2c]/38 text-xs mt-5 leading-relaxed max-w-lg">
              Need invoice support, group blocks, or concierge seating requests?{' '}
              <a
                href="mailto:hello@atinuda.com?subject=Local To Global Summit — Ticket Support"
                className="underline underline-offset-2 text-[#0d1e2c]/58 hover:text-[#0d1e2c] transition-colors"
              >
                Contact the summit team.
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-20 py-20 lg:py-24 border-y border-white/7">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.34em] text-[#ff7f41]/75 mb-6">AFTER BOOKING</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl text-white leading-tight mb-6">
                Clear, immediate,
                <br />
                and low-friction.
              </h2>
              <p className="text-white/45 leading-relaxed max-w-md">
                Registration has been shaped to feel premium in the same way the event itself does: minimal friction, strong confidence cues, and complete clarity.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {BOOKING_FLOW.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.06}>
                <article className="grid grid-cols-[52px_1fr] gap-5 border-t border-white/8 py-5">
                  <span style={serifDisplay} className="text-3xl text-[#ff7f41]/85 leading-none">{item.step}</span>
                  <div>
                    <h3 className="text-white/82 mb-1.5">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="flex overflow-hidden bg-[#040c14]" aria-hidden="true">
        {SUMMIT_IMAGES.map((src, i) => (
          <div key={src} className="relative flex-none w-[44vw] md:w-[30vw] lg:w-[25vw] aspect-[4/3] overflow-hidden">
            <Image src={src} fill alt="" className="object-cover grayscale opacity-55" sizes="25vw" priority={i === 0} />
          </div>
        ))}
      </div>

      <section className="px-8 md:px-16 lg:px-20 py-20 border-t border-white/7">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.3em] text-white/28 mb-3">PARTNERSHIP ENQUIRIES</p>
              <p className="text-white/48 text-sm leading-relaxed max-w-sm">
                For sponsorship-led delegate allocations and hosted table options, speak directly with the summit partnerships desk.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:hello@atinuda.com?subject=Local To Global Summit — Partnership"
                className="inline-flex items-center gap-3 border border-[#ff7f41]/35 text-[#ff7f41] nav-text text-[10px] tracking-[0.18em] px-7 py-3.5 hover:bg-[#ff7f41] hover:text-white transition-all duration-300"
              >
                PARTNERSHIP DESK
              </a>
              <Link
                href="/summit"
                className="inline-flex items-center gap-2 border border-white/15 text-white/50 nav-text text-[10px] tracking-[0.18em] px-7 py-3.5 hover:border-white/35 hover:text-white transition-all duration-300"
              >
                BACK TO SUMMIT
                <ArrowRight size={10} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
