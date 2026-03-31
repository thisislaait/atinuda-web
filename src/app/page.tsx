// Server component, no 'use client'.
// Interactive islands (FAQ, Schedule, StickyNav) are imported as client components
// and will be SSR'd with their initial (closed/hidden) state, then hydrated.

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  MessageCircle,
  Download,
  ShieldCheck,
} from 'lucide-react';

import Image from 'next/image';
import FAQAccordion from '@/components/home/FAQAccordion';
import StickyRetreatNav from '@/components/layout/Nav/StickyRetreatNav';
import { featuredSpeakers, totalSpeakers } from '@/data/speakers';
import WhoAttendsSection from '@/components/home/WhoAttendsSection';
import RotatingHeading from '@/components/home/RotatingHeading';

// ── Page metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Atinuda Retreat 2026, The Elevation | Mauritius',
  description:
    "Seven days in Mauritius for Africa's leading founders, executives, and creative leaders. Keynotes, workshops, wellness, and the Elevation Gala. March 8–14, 2026.",
  openGraph: {
    title: 'Atinuda Retreat 2026, The Elevation',
    description:
      "Seven days in Mauritius. Keynotes, workshops, a château dinner, and the Elevation Gala.",
    images: [{ url: '/assets/images/Mauritius2.png' }],
  },
};

// ── Static data ───────────────────────────────────────────────────────────────

const RETREAT_TICKET_URL = '/retreat-ticket';

// [BUSINESS DATA] Replace [X] values with real numbers before launch
const proofStats = [
  { value: '6th', label: 'Edition' },
  { value: '742+', label: 'Leaders' },
  { value: '53', label: 'Sessions' },
  { value: 'Selected', label: 'By Application' },
];


const differentiators = [
  {
    title: 'Africa-centred, globally executed',
    desc: "Created by Africans for African leaders, then taken abroad. The global stage is the context, not the aspiration.",
  },
  {
    title: 'Wellness and leadership together',
    desc: "The week includes rest, physical experience, and proper downtime. That is part of the programme, not a break from it.",
  },
  {
    title: 'Experience over instruction',
    desc: "Every venue earns its place. Every session has a reason. The week is structured so each day builds on the one before.",
  },
  {
    title: 'The room is selected',
    desc: "Each delegate is chosen for what they bring to the group — their work, their stage, their presence in the room.",
  },
  {
    title: 'A community that outlasts the week',
    desc: "The relationships, collaborations, and accountability continue long after Mauritius.",
  },
];

const programmeHighlights = [
  {
    day: '1',
    date: 'Mar 8',
    title: 'The Arrival',
    desc: "Airport welcome, private transfers, room reveals at The Oberoi. Sunset cocktails, welcome ceremony, and a beach barbecue as the week begins.",
    venue: 'The Oberoi, Mauritius',
  },
  {
    day: '2',
    date: 'Mar 9',
    title: 'Rise Within',
    desc: "A full day of wellness and restoration. Morning practices, a catamaran cruise or spa immersion, and a chef's tasting dinner at LUX* Belle Mare.",
    venue: 'LUX* Belle Mare',
  },
  {
    day: '3',
    date: 'Mar 10',
    title: 'Rise Together',
    desc: "Opening keynotes, leadership panels, speed connections, and executive office hours. An evening Château dinner in the vineyards.",
    venue: 'The Oberoi & Château de Labourdonnais',
  },
  {
    day: '4',
    date: 'Mar 11',
    title: 'Rise in Skill',
    desc: "Deep-dive workshop tracks across business, finance, technology, and events. A Strategy Hot Seat, masterclass, and Elevation mini awards dinner.",
    venue: 'The Oberoi, Mauritius',
  },
  {
    day: '5',
    date: 'Mar 12',
    title: 'Rise in Creativity',
    desc: "A creative summit, branding panels, and immersive experience design labs. Closing with a connection dinner as the cohort finds its rhythm.",
    venue: 'The Oberoi, Mauritius',
  },
  {
    day: '6',
    date: 'Mar 13',
    title: 'Rise Beyond',
    desc: "Going-global keynotes and island experience tracks through the afternoon. The pinnacle Elevation Gala, a black-tie dinner and awards celebration.",
    venue: 'Le Château de Bel Ombre',
  },
];

const departureProgramme = {
  day: '7',
  date: 'Mar 14',
  title: 'Departure',
  desc: "A closing breakfast, private farewells, and the promise of what comes next. The week ends. The work continues.",
  venue: 'Mauritius',
};


const pastEvents = [
  {
    title: 'Azizi Mixer 2025',
    blurb: 'Afrofuturist soirée with live sets and structured connection.',
    tag: 'Lagos',
    gradient: 'from-[#0d2010] to-[#1f3622]',
  },
  {
    title: 'CEO Dinner 2025',
    blurb: 'Black-tie reception for founders, investors, and partners.',
    tag: 'Lagos',
    gradient: 'from-[#1a1a1a] to-[#2e1c12]',
  },
  {
    title: 'Summit Day 1',
    blurb: 'Keynotes, panels, and masterclasses on luxury experiences.',
    tag: 'Conference',
    gradient: 'from-[#0d1e0e] to-[#213d28]',
  },
  {
    title: 'Summit Day 2',
    blurb: 'Breakouts, showcases, and deal-making with global peers.',
    tag: 'Conference',
    gradient: 'from-[#1b2438] to-[#2b3f56]',
  },
];

// [BUSINESS DATA] What's included in the retreat pass
const included = [
  'All retreat sessions, keynotes & workshop tracks',
  'Welcome reception, cocktails & opening barbecue',
  "Château dinner at Château de Labourdonnais",
  'Elevation Gala, black-tie awards evening',
  'Catamaran cruise or full spa day',
  'Island excursions & cultural experiences',
  'Coffee connections & executive speed sessions',
  'All meals during hosted retreat activities',
  'Atinuda app access: itineraries, speakers & guides',
  'Post-retreat: gallery, resources & alumni access',
];

const notIncluded = [
  'Flights to and from Mauritius',
  'Hotel accommodation (preferred rates & links shared in the app)',
];

const faqs = [
  {
    q: 'How do I apply for a retreat pass?',
    a: "Retreat passes are available at atinuda.com/retreat-ticket. Once you apply, your submission is reviewed for cohort fit. Approved applicants receive a confirmation and payment link.",
  },
  {
    q: 'What is the investment?',
    a: "Investment details are shared privately with approved applicants. Your pass covers all programming, hospitality, hosted meals, and experiences listed in the programme. Flights and accommodation are not included.",
  },
  {
    q: 'Is accommodation included?',
    a: "No. Your pass covers all programming and hosted experiences. Preferred hotel rates and booking links are shared in the Atinuda app after your pass is confirmed.",
  },
  {
    q: 'Are there visa requirements for Mauritius?',
    a: "Most passports are visa-free or visa-on-arrival for Mauritius. Carry your hotel confirmation, return ticket, and proof of funds. Your passport must be valid for 6+ months. Full travel guidance is shared in the app after booking.",
  },
  {
    q: 'Will I get a QR pass?',
    a: "Yes. After checkout your QR pass is stored in the Atinuda app under Tickets. It is your entry to all retreat experiences and venues.",
  },
  {
    q: 'Is there a community after the retreat?',
    a: "Yes. Atinuda delegates gain access to a private circle via the app, WhatsApp community, and early access to future events. The community continues long after Mauritius.",
  },
  {
    q: 'Where can I view the full schedule?',
    a: "A snapshot of the seven-day arc is on this page. The complete live itinerary with speaker details, session times, and venue maps lives in the Atinuda app.",
  },
];

// ── Shared style shorthand ────────────────────────────────────────────────────
const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const } as const;
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' } as const;

// ── Page Component ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Sticky retreat CTA bar, appears after scrolling past the hero */}
      <StickyRetreatNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/Retreat/landinghero.JPG')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
          <p className="nav-text text-xs tracking-[0.35em] uppercase text-white/45">
            Atinuda Retreat 2026
          </p>

          <div className="space-y-4">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-none tracking-tight"
              style={{ ...serifDisplay, textShadow: '0 4px 60px rgba(0,0,0,0.4)' }}
            >
              The Elevation
            </h1>
            <p className="nav-text text-xs tracking-[0.3em] uppercase text-white/45">
              Rise Within · Rise Together · Rise Beyond
            </p>
          </div>

          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Seven days in Mauritius. Keynotes, workshops, deep-dive sessions, and a week
            that Africa&apos;s best founders, executives, and creative leaders have not
            stopped talking about.
          </p>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 text-sm text-white/60">
            <MapPin size={12} aria-hidden="true" />
            <span>Mauritius</span>
            <span className="text-white/25" aria-hidden="true">·</span>
            <Calendar size={12} aria-hidden="true" />
            <span>March 8–14, 2026</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={RETREAT_TICKET_URL}
              className="px-8 py-4 bg-white text-[#0d2010] text-sm font-semibold rounded-full hover:bg-white/92 transition-colors shadow-xl shadow-black/30"
            >
              Claim your retreat pass
            </Link>
            <Link
              href="#programme"
              className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
            >
              Explore the programme
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-white/25" />
        </div>
      </section>

      {/* ── PROOF BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] border-b border-[#ede9e4]" aria-label="At a glance">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x md:divide-[#e5e0da]">
            {proofStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-6">
                <span
                  className="text-4xl md:text-5xl text-[#0d2010]"
                  style={serifDisplay}
                >
                  {stat.value}
                </span>
                <span className="nav-text text-[10px] tracking-[0.28em] uppercase text-[#9ca3af] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#9ca3af] mb-8">
                The Elevation
              </p>
              <h2
                className="text-5xl md:text-6xl lg:text-7xl leading-[0.93] text-[#0d2010]"
                style={serifDisplay}
              >
                Not a<br /><RotatingHeading />
              </h2>
            </div>

            <div className="space-y-8 pt-1 lg:pt-16">
              <p className="text-[#3a3a3a] text-xl leading-relaxed">
                The Elevation is a seven-day programme in Mauritius — a nation that built
                itself from the ocean floor. The week runs luxury hospitality alongside
                real leadership sessions, structured wellness, and the kind of
                peer-to-peer access that takes years to build any other way.
              </p>
              <p className="text-[#3a3a3a] text-xl leading-relaxed">
                The venues are chosen with purpose. The cohort is selected. The programme
                has been running since 2015 and the standard has not dropped.
              </p>

              <div className="flex items-start gap-2.5 text-sm text-[#9ca3af] pt-2">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">
                  The Oberoi · LUX* Belle Mare · Château de Labourdonnais · Le Château de Bel Ombre
                </span>
              </div>

              <Link
                href="#programme"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d2010] group"
              >
                See what&apos;s included
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO ATTENDS ──────────────────────────────────────────────────── */}
      <WhoAttendsSection />

      {/* ── PROGRAMME ────────────────────────────────────────────────────── */}
      <section id="programme" className="bg-white py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
            <div>
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#9ca3af] mb-5">
                The Programme
              </p>
              <h2
                className="text-5xl md:text-6xl leading-tight text-[#0d2010]"
                style={serifDisplay}
              >
                Seven days.<br />Seven chapters.
              </h2>
            </div>
            <Link
              href={RETREAT_TICKET_URL}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#0d2010]/20 text-[#0d2010] text-sm font-semibold hover:bg-[#0d2010] hover:text-white transition-all self-start md:self-auto whitespace-nowrap"
            >
              Secure your place
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          {/* Editorial rows */}
          <div>
            {[...programmeHighlights, departureProgramme].map((item, idx) => (
              <div
                key={item.title}
                className="group grid grid-cols-[56px_1fr] md:grid-cols-[72px_180px_1fr] lg:grid-cols-[72px_200px_1fr_220px] gap-x-8 gap-y-1 py-8 border-t border-[#f0ede9] items-baseline hover:bg-[#faf9f7] -mx-6 px-6 transition-colors"
              >
                {/* Day number, oversized, decorative */}
                <span
                  className="text-[3.5rem] leading-none text-[#ede9e4] group-hover:text-[#ddd8d2] transition-colors select-none"
                  style={serif}
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Day + title */}
                <div className="self-center">
                  <p className="nav-text text-[10px] tracking-[0.25em] uppercase text-[#9ca3af]">
                    {item.date}
                  </p>
                  <p
                    className="text-lg font-semibold text-[#0d2010] mt-0.5 leading-snug"
                  >
                    {item.title}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#6b7280] leading-relaxed col-start-2 md:col-auto pt-1 md:pt-0 self-center">
                  {item.desc}
                </p>

                {/* Venue */}
                <p className="hidden lg:flex items-center gap-1.5 text-xs text-[#b0a89e] justify-end self-center">
                  <MapPin size={10} aria-hidden="true" />
                  {item.venue}
                </p>
              </div>
            ))}
            {/* Bottom border */}
            <div className="border-t border-[#f0ede9]" />
          </div>
        </div>
      </section>

      {/* ── SPEAKER TEASER ────────────────────────────────────────────────── */}
      <section className="bg-[#f2dfd2] py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#7a5e52] mb-5">
                The Voices
              </p>
              <h2
                className="text-5xl md:text-6xl leading-tight text-[#2b1f1a]"
                style={serifDisplay}
              >
                Who&apos;s speaking<br />in Mauritius.
              </h2>
            </div>
            <div className="flex flex-col gap-1.5 md:text-right shrink-0">
              <p className="text-sm text-[#7a6458]">
                {totalSpeakers} confirmed · More to be announced
              </p>
              <Link
                href="/speakers"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2b1f1a] group md:justify-end"
              >
                Meet all speakers
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Speaker grid – staggered portrait cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5 items-start">
            {featuredSpeakers.map((speaker, i) => (
              <Link
                key={speaker.id}
                href="/speakers"
                className={`group block bg-[#f5f0eb] rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300${i % 2 === 1 ? ' lg:mt-10' : ''}`}
                aria-label={`${speaker.name}, view all speakers`}
              >
                {/* Photo */}
                <div className="relative aspect-[3/4]">
                  <Image
                    src={`/assets/images/speakers/${speaker.photoAssetKey}`}
                    alt={speaker.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  />
                  {/* Arrow – appears on hover */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowRight size={11} className="text-[#0d2010] -rotate-45" aria-hidden="true" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5 pt-3">
                  <p className="nav-text text-[9px] tracking-[0.22em] uppercase text-[#a09080] mb-1.5">
                    {speaker.track}
                  </p>
                  <p className="text-sm font-semibold text-[#2b1f1a] leading-snug">
                    {speaker.name}
                  </p>
                  {speaker.title !== '[TITLE]' && (
                    <p className="text-xs text-[#8c7060] mt-0.5 leading-snug">{speaker.title}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-[#c9b8ab] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-[#7a6458]">
              Full lineup, session topics, and bios on the speakers page.
            </p>
            <Link
              href="/speakers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors whitespace-nowrap"
            >
              View all {totalSpeakers} speakers
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ───────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start mb-16 lg:mb-20">
            <div>
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-white/30 mb-5">
                Why Atinuda
              </p>
              <h2
                className="text-5xl md:text-6xl leading-tight text-white"
                style={serifDisplay}
              >
                A different<br />kind of retreat.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                Every detail of the experience is considered, from who is in the room
                to what happens after they leave it.
              </p>
            </div>
          </div>

          {/* Editorial numbered rows */}
          <div>
            {differentiators.map(({ title, desc }, idx) => (
              <div
                key={title}
                className="grid md:grid-cols-[64px_1fr_1.4fr] gap-x-10 gap-y-2 py-8 border-t border-white/8 items-baseline group"
              >
                <span className="nav-text text-xs tracking-[0.2em] text-white/20 pt-1">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="text-white font-semibold text-lg leading-snug">
                  {title}
                </p>
                <p className="text-white/50 text-sm leading-relaxed col-start-2 md:col-auto">
                  {desc}
                </p>
              </div>
            ))}
            <div className="border-t border-white/8" />
          </div>

          <div className="mt-14">
            <Link
              href={RETREAT_TICKET_URL}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0d2010] text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Join the 2026 cohort
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRACK RECORD ──────────────────────────────────────────────────── */}
      <section className="bg-white py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#9ca3af] mb-5">
                Track Record
              </p>
              <h2
                className="text-5xl md:text-6xl text-[#0d2010]"
                style={serifDisplay}
              >
                Atinuda<br />in the world.
              </h2>
            </div>
            <p className="text-sm text-[#9ca3af] max-w-xs md:text-right leading-relaxed">
              Past summits, retreats, and community events that set the standard for what this room creates.
            </p>
          </div>

          {/* Photo cards with real event images */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pastEvents.map((evt, idx) => (
              <div
                key={evt.title}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] group"
              >
                <Image
                  src={`/assets/images/azizi${idx * 2 + 1}.jpeg`}
                  alt={evt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="nav-text text-[9px] tracking-[0.2em] uppercase text-white/45">
                    {evt.tag}
                  </span>
                  <h3 className="text-white font-semibold mt-1.5 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                    {evt.blurb}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* [TESTIMONIALS placeholder] */}

          <div className="mt-12">
            <Link
              href="/press"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d2010] group"
            >
              View press & media kit
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INVESTMENT ────────────────────────────────────────────────────── */}
      <section id="investment" className="bg-[#f2dfd2] py-28 lg:py-40">
        <div className="max-w-6xl mx-auto px-6">

          {/* Headline + enquiry statement */}
          <div className="grid lg:grid-cols-2 gap-16 items-end border-b border-[#c9b8ab] pb-20 mb-20">
            <div>
              <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#7a5e52] mb-8">
                The Investment
              </p>
              <h2
                className="text-5xl md:text-6xl lg:text-7xl text-[#2b1f1a] leading-[1.05]"
                style={serifDisplay}
              >
                The right room<br />has no price<br />on the door.
              </h2>
            </div>
            <div>
              <p className="text-[#5c4a3f] leading-relaxed mb-6 text-lg">
                Investment details are shared privately with approved applicants. The full breakdown covers what is included, how the week is structured, and what to expect from the programme.
              </p>
              <p className="text-[#7a5e52] leading-relaxed mb-10 text-sm">
                To receive the programme deck, apply for your place or request it directly. The team will follow up promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={RETREAT_TICKET_URL}
                  className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
                >
                  Apply for your place
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:hello@atinuda.com?subject=Programme Deck Request"
                  className="inline-flex items-center gap-3 border border-[#2b1f1a] text-[#2b1f1a] text-sm tracking-wide px-8 py-4 hover:bg-[#2b1f1a] hover:text-white transition-colors"
                >
                  Request the programme deck
                </a>
              </div>
              <p className="text-[10px] tracking-[0.15em] nav-text text-[#9c8070] mt-6">
                LIMITED PLACES · BY APPLICATION ONLY
              </p>
            </div>
          </div>

          {/* What's included */}
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#7a5e52] mb-6">
                What&apos;s included
              </h3>
              <ul className="space-y-3" role="list">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#4b5563]">
                    <span
                      className="mt-2 w-1 h-1 rounded-full bg-[#0d2010] flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#7a5e52] mb-6">
                Not included
              </h3>
              <ul className="space-y-3" role="list">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#9c8070]">
                    <span
                      className="mt-2 w-1 h-1 rounded-full bg-[#c9b8ab] flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-[#081008] py-28 lg:py-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-14">
            <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-white/30 mb-5">
              Questions
            </p>
            <h2
              className="text-5xl md:text-6xl text-white"
              style={serifDisplay}
            >
              Common questions.
            </h2>
          </div>

          <FAQAccordion items={faqs} />

          <div className="mt-12 pt-10 border-t border-white/8">
            <p className="text-white/40 text-sm">
              Something not covered here?{' '}
              <Link
                href="/our-story"
                className="text-white/70 hover:text-white underline underline-offset-4 transition-colors"
              >
                Get in touch with the team.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-36 lg:py-52">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/Mauritius2.png')" }}
          />
          <div className="absolute inset-0 bg-[#0d2010]/85" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-7">
          <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-white/35">
            March 8–14, 2026 · Mauritius
          </p>

          <h2
            className="text-6xl md:text-7xl lg:text-8xl leading-[0.93] text-white"
            style={serifDisplay}
          >
            Mauritius<br />is calling.
          </h2>

          <p className="text-white/55 text-lg leading-relaxed max-w-md mx-auto">
            The 2026 cohort is forming now.{' '}
            {/* [BUSINESS DATA] Activate scarcity copy once seat count is confirmed */}
            The window to apply is open, for now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={RETREAT_TICKET_URL}
              className="px-8 py-4 bg-white text-[#0d2010] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors shadow-xl shadow-black/30"
            >
              Claim your retreat pass
            </Link>
            <Link
              href="/our-story"
              className="text-sm text-white/45 hover:text-white transition-colors"
            >
              Learn about Atinuda
            </Link>
          </div>
        </div>
      </section>

      {/* ── APP + COMMUNITY ───────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] py-24 lg:py-32" aria-label="App and community">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section header */}
          <div className="mb-14">
            <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-[#9ca3af] mb-5">
              Stay Connected
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#0d2010]"
              style={serifDisplay}
            >
              The retreat continues.
            </h2>
          </div>

          <div className="grid gap-px bg-[#e5e0da] md:grid-cols-3 rounded-2xl overflow-hidden">

            {/* The App */}
            <div className="bg-[#faf9f7] p-8 lg:p-10 flex flex-col gap-5">
              <p className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#9ca3af]">
                The App
              </p>
              <h3 className="text-2xl text-[#0d2010] leading-snug" style={serif}>
                Everything in one place.
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed flex-1">
                Tickets, live schedules, speaker profiles, venue guides, and your
                QR pass, all in the Atinuda app.
              </p>
              <div className="space-y-3">
                <Link
                  href="https://apps.apple.com/us/app/atinuda/id6755419370"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors"
                >
                  <Download size={13} aria-hidden="true" />
                  Download on iOS
                </Link>
                <p className="text-xs text-[#b0a8a0] pl-1">Android, coming soon</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#b0a8a0]">
                <ShieldCheck size={11} aria-hidden="true" />
                Secure payments via Flutterwave
              </div>
            </div>

            {/* The Community */}
            <div className="bg-[#faf9f7] p-8 lg:p-10 flex flex-col gap-5">
              <p className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#9ca3af]">
                The Circle
              </p>
              <h3 className="text-2xl text-[#0d2010] leading-snug" style={serif}>
                Stay in the room.
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed flex-1">
                The Atinuda circle stays connected between events, for
                announcements, early access, and drops.
              </p>
              {/* [TODO: Replace href with real WhatsApp community link] */}
              <Link
                href="/join-the-waitlist"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d2010]/25 text-[#0d2010] text-sm font-semibold hover:bg-[#0d2010] hover:text-white transition-all w-fit"
              >
                <MessageCircle size={13} aria-hidden="true" />
                Join the community
              </Link>
            </div>

            {/* The Newsletter */}
            <div className="bg-[#faf9f7] p-8 lg:p-10 flex flex-col gap-5">
              <p className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#9ca3af]">
                The Editorial
              </p>
              <h3 className="text-2xl text-[#0d2010] leading-snug" style={serif}>
                Ideas worth your inbox.
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed flex-1">
                Recaps, insights, speaker previews, and event access , 
                only for the Atinuda circle.
              </p>
              {/* [TODO: Replace href with real Flodesk newsletter link] */}
              <Link
                href="/join-the-waitlist"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d2010]/25 text-[#0d2010] text-sm font-semibold hover:bg-[#0d2010] hover:text-white transition-all w-fit"
              >
                <Sparkles size={13} aria-hidden="true" />
                Subscribe to the editorial
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
