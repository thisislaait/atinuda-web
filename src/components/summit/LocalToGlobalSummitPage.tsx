'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Check } from 'lucide-react';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };
const EASE = [0.22, 1, 0.36, 1] as const;

// ── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    label: 'Main Stage',
    title: 'Keynotes & panels.',
    desc: 'High-impact conversations with founders, executives, investors, and government leaders. Themes run across business strategy, creative industries, technology, and expansion from Africa.',
    img: '/assets/images/summit/ATINUDA DAY 2_507.jpg',
    href: '/summit/tickets',
  },
  {
    label: 'Five Breakout Rooms',
    title: 'Workshop tracks.',
    desc: 'Smaller groups, direct instruction, and practical tools. Choose one track for the afternoon — Finance, Events Scaling, Legal, Sustainability, or Luxury.',
    img: '/assets/images/summit/H1C10404.jpg',
    href: '/summit/tickets',
  },
  {
    label: 'By Invitation or Executive Ticket',
    title: 'The Executive Dinner Gala.',
    desc: 'Black-tie seated dinner. Live performance, curated introductions, and an evening that consistently runs past midnight.',
    img: '/assets/images/summit/dinner.JPG',
    href: '/summit/tickets',
  },
  {
    label: 'Pitch Finals',
    title: 'Spark the Future.',
    desc: 'Ten ventures on the main stage pitching to active investors. One of the highest-energy sessions of the day.',
    img: '/assets/images/summit/stf.jpg',
    href: '/summit/tickets',
  },
];

const PROGRAMME = [
  { time: '09:30', title: 'Registration & National Anthem', type: 'arrival' },
  { time: '09:35', title: 'Opening Remarks', note: 'Ayiri Oladunmoye · Oaken Events', type: 'note' },
  { time: '09:45', title: 'Finance: Exit Strategies & Smart Money Moves', note: 'Hon. Sam Egube · Lagos State Government', type: 'keynote' },
  { time: '10:00', title: 'Preparing Your Business for Acquisition or Succession', note: 'Fireside conversation · Main Stage', type: 'session' },
  { time: '10:20', title: 'Strategic Partnerships & Policy Frameworks', note: 'Charles Odii · Director General, SMEDAN', type: 'keynote' },
  { time: '10:40', title: 'Event Economies & Government as Co-creators', note: "Examining Detty December and the billions in Nigeria's event industry", type: 'session' },
  { time: '11:05', title: 'Entrepreneurial Resilience', note: 'Leo Stan Ekeh · Chairman, Zinox Group', type: 'keynote' },
  { time: '11:30', title: "Lagos as Africa's Creative & Business Hub", note: 'Special Address · Governor Babajide Sanwo-Olu', type: 'special' },
  { time: '12:00', title: 'Breakout Workshop Tracks', note: 'Five parallel sessions · Main Stage · Victoria · Abuja · Atlas · Kano', type: 'workshop' },
  { time: '14:45', title: 'The Future of Money: Mastering Financial Intelligence', note: 'Main Stage panel', type: 'session' },
  { time: '17:00', title: 'Cocktail Reception', type: 'break' },
  { time: '19:00', title: 'Executive Dinner Gala', note: 'Black-tie. By invitation or Executive ticket.', type: 'gala' },
];

type Speaker = {
  img: string;
  name: string;
  title: string;
  company: string;
  country: string;
  session: string;
  bio: string;
};

const SPEAKERS: Speaker[] = [
  { img: '/assets/images/summit-speakers/yewande.jpg', name: 'Yewande Zacchaeus', title: 'Chair', company: 'Eventful / Coker Creative', country: 'Nigeria', session: 'Summit Chair', bio: 'Yewande Zacchaeus is the founder of Eventful Ltd and creative director of Coker Creative. One of Nigeria\'s most respected event industry leaders, she has shaped the country\'s premium events landscape for over two decades.' },
  { img: '/assets/images/summit-speakers/temilola.jpg', name: 'Temilola Adepetun', title: 'Founder', company: 'Out of Africa Lifestyle', country: 'Nigeria', session: 'Preparing Your Business for Acquisition or Succession', bio: 'Temilola Adepetun is the founder of Out of Africa Lifestyle, a premium travel and lifestyle company that takes African experiences to global audiences.' },
  { img: '/assets/images/summit-speakers/kamil.jpg', name: 'Kamil Olufowobi', title: 'Founder & Chairman', company: 'MIPAD', country: 'USA', session: 'Global Diaspora as Market & Investor', bio: 'Kamil Olufowobi is the founder and chairman of Most Influential People of African Descent (MIPAD), a global recognition and advocacy platform operating across 40+ countries.' },
  { img: '/assets/images/summit-speakers/samke.jpg', name: 'Samke Mhlongo', title: 'Wealth Coach', company: 'The Next Chapter', country: 'South Africa', session: 'Investing Wisely for Long-term Growth', bio: 'Samke Mhlongo is a leading personal finance and wealth coach across sub-Saharan Africa. She is the founder of The Next Chapter Wealth and author of several personal finance publications.' },
  { img: '/assets/images/summit-speakers/dolapo.jpg', name: 'Dolapo Fasawe', title: 'Executive Coordinator', company: "Office of the First Lady, Lagos", country: 'Nigeria', session: 'The Power of Innovation', bio: 'Dolapo Fasawe serves as Executive Coordinator at the Office of the First Lady of Lagos State, driving social impact programmes across the state.' },
  { img: '/assets/images/summit-speakers/lilian.jpg', name: 'Lilian Olubi', title: 'CEO', company: 'EFG Hermes Nigeria', country: 'Nigeria', session: 'Event Economies & Government as Co-creators', bio: 'Lilian Olubi is the Chief Executive Officer of EFG Hermes Nigeria, a leading investment bank. She brings deep expertise in capital markets, investment strategy, and financial services.' },
  { img: '/assets/images/summit-speakers/martin.jpg', name: 'Dr. Martin Kwende', title: 'Founder', company: 'Kwende Foundation', country: 'Ghana', session: 'Embedding Sustainability in Corporate DNA', bio: 'Dr. Martin Kwende is the founder of the Kwende Foundation, driving innovation and sustainable development across West Africa through education and enterprise.' },
  { img: '/assets/images/summit-speakers/osayi.jpg', name: 'Osayi Alile', title: 'CEO', company: 'ACT Foundation', country: 'Nigeria', session: 'Leadership with Purpose', bio: 'Osayi Alile is the CEO of Aspire Coronation Trust Foundation, one of Nigeria\'s most respected philanthropic institutions championing social impact and youth development.' },
  { img: '/assets/images/summit-speakers/kelvin.jpg', name: 'Kelvin Okafor', title: 'Artist & Founder', company: 'Kelvin Okafor Studios', country: 'UK', session: 'The Creative Economy as Capital', bio: 'Kelvin Okafor is a world-renowned hyperrealist artist based in the UK, celebrated internationally for his incredibly lifelike pencil portraits of global icons.' },
  { img: '/assets/images/summit-speakers/ezinne.jpg', name: 'Ezinne Chinkata', title: 'Fashion Entrepreneur', company: 'Zinkata', country: 'Nigeria', session: 'Scaling Events: Operational Excellence', bio: 'Ezinne Chinkata is the founder of Zinkata, a fashion brand celebrating African identity through luxury ready-to-wear and bespoke design.' },
  { img: '/assets/images/summit-speakers/bisola.jpg', name: 'Bisola Borha Arigbe', title: 'CEO', company: 'Truly Scumptious', country: 'Nigeria', session: 'Scaling Events: Operational Excellence', bio: 'Bisola Borha Arigbe is the CEO of Truly Scumptious, a luxury hospitality and catering company that has delivered some of Nigeria\'s most prestigious events.' },
  { img: '/assets/images/summit-speakers/frank.jpg', name: 'Frank Oshodi Richard', title: 'Creative Director', company: 'House of Bunor', country: 'Nigeria', session: 'African Brands Going Global', bio: 'Frank Oshodi Richard is the Creative Director of House of Bunor, bringing Nigerian craftsmanship and artisanship to global luxury markets.' },
];

const PARTNERS = [
  '/assets/images/Atafo2.png',
  '/assets/images/bellanaija.png',
  '/assets/images/livvytwist.png',
  '/assets/images/landmark.png',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
  y = 20,
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
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProgrammeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    keynote: 'text-[#ff7f41] bg-[#ff7f41]/8',
    special: 'text-[#ff7f41] bg-[#ff7f41]/12 border border-[#ff7f41]/20',
    gala: 'text-[#0d1e2c]/50 bg-[#0d1e2c]/5',
    session: 'text-[#0d1e2c]/35 bg-[#0d1e2c]/4',
    workshop: 'text-[#0d1e2c]/35 bg-[#0d1e2c]/4',
    break: 'text-[#0d1e2c]/25',
    arrival: 'text-[#0d1e2c]/25',
    note: 'text-[#0d1e2c]/25',
  };
  const label: Record<string, string> = {
    keynote: 'Keynote',
    special: 'Special Address',
    gala: 'Gala',
    session: 'Session',
    workshop: 'Workshops',
    break: 'Reception',
    arrival: 'Arrival',
    note: 'Remarks',
  };
  return (
    <span className={`nav-text text-[8px] tracking-[0.14em] uppercase px-2.5 py-1 ${styles[type] ?? ''}`}>
      {label[type] ?? type}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LocalToGlobalSummitPage() {
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [partnerImg, setPartnerImg] = useState(0);
  const [partnerFade, setPartnerFade] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setPartnerFade(true);
      setTimeout(() => {
        setPartnerImg((p) => (p + 1) % PARTNERS.length);
        setPartnerFade(false);
      }, 500);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <main id="nohero" className="bg-white text-[#0d1e2c]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden">
        <Image
          src="/assets/images/Tourism2.jpg"
          alt="Local To Global Summit"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1f2340]/62" />

        <div className="relative z-10 px-8 md:px-16 max-w-4xl mx-auto">
          <motion.p
            className="nav-text text-[10px] tracking-[0.38em] text-[#ff7f41]/80 mb-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            LOCAL TO GLOBAL · CREATIVE TRANSFORMATIONS
          </motion.p>

          <div className="overflow-hidden mb-6">
            <motion.h1
              style={serifDisplay}
              className="text-[clamp(1.5rem,5vw,4rem)] leading-[0.9] text-white tracking-tight"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.06, ease: EASE }}
            >
              Africa&apos;s leading<br />summit{' '}
              <span className="text-[#ff7f41]">2025</span>
            </motion.h1>
          </div>

          <motion.p
            className="text-white/55 leading-relaxed max-w-2xl mx-auto mb-10 text-sm md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Every year, 400+ founders, executives, investors, and creative leaders gather at Atinuda to connect, collaborate, and elevate their craft. Lagos, October 2025.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
          >
            <Link
              href="/summit/tickets"
              className="inline-flex items-center justify-center gap-3 bg-[#ff7f41] text-white nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:bg-white hover:text-[#0d1e2c] transition-all duration-300"
            >
              GET YOUR TICKET
            </Link>
            <a
              href="#programme"
              className="inline-flex items-center justify-center gap-3 border border-white/20 text-white/55 nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:border-white/55 hover:text-white transition-all duration-300"
            >
              SEE THE PROGRAMME <ArrowRight size={11} />
            </a>
          </motion.div>
        </div>

        {/* Bottom nav strip */}
        <div className="absolute bottom-0 inset-x-0 bg-[#1B365D]/40 backdrop-blur-sm border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 flex justify-around items-center py-4">
            {[
              { label: 'Download Summit Report', href: '/assets/docs/summit-report.pdf' },
              { label: 'Become A Sponsor', href: '/become-a-sponsor' },
              { label: 'Invite Only', href: '/azizi-rsvp' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-text text-[10px] tracking-[0.18em] text-white/70 hover:text-white transition-colors uppercase relative group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-20 lg:py-28 border-b border-[#e5e0da]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-16 lg:gap-24 items-start">

          {/* Left: editorial */}
          <div>
            <Reveal>
              <p className="nav-text text-[9px] tracking-[0.35em] text-[#ff7f41] mb-7">THE SUMMIT</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-8">
                Two days a year.<br />The right room.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid md:grid-cols-2 gap-8 border-t border-[#e5e0da] pt-8">
                <p className="text-[#0d1e2c]/65 leading-relaxed">
                  The Local To Global Summit runs across two days each year in Lagos. Founders, executives, investors, and creative leaders come to hear from people who have built real businesses and can say something worth the room's time.
                </p>
                <p className="text-[#0d1e2c]/45 leading-relaxed text-sm">
                  Since 2015, six editions have drawn 400+ delegates each year. The format holds: main-stage keynotes in the morning, workshop breakout tracks in the afternoon, the Spark the Future pitch finals, and the Executive Dinner Gala in the evening.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: event facts sidebar with orange rule */}
          <Reveal delay={0.12}>
            <div className="relative pl-7 border-l-2 border-[#ff7f41]">
              <p className="nav-text text-[9px] tracking-[0.3em] text-[#ff7f41] mb-6">2025 EDITION</p>
              <div className="space-y-5 text-sm text-[#0d1e2c]/60 leading-relaxed">
                <div>
                  <p className="nav-text text-[8px] tracking-[0.2em] text-[#0d1e2c]/30 mb-1">DATE</p>
                  <p className="text-[#0d1e2c]/80">October 6–8, 2025</p>
                </div>
                <div>
                  <p className="nav-text text-[8px] tracking-[0.2em] text-[#0d1e2c]/30 mb-1">LOCATION</p>
                  <p className="text-[#0d1e2c]/80">Lagos, Nigeria</p>
                </div>
                <div>
                  <p className="nav-text text-[8px] tracking-[0.2em] text-[#0d1e2c]/30 mb-1">FORMAT</p>
                  <p className="text-[#0d1e2c]/80">Full-day conference<br />+ Executive Dinner Gala</p>
                </div>
                <div>
                  <p className="nav-text text-[8px] tracking-[0.2em] text-[#0d1e2c]/30 mb-1">TICKETS</p>
                  <p className="text-[#0d1e2c]/80">Conference Pass from ₦295,000<br />Executive Pass from ₦650,000</p>
                </div>
              </div>
              <Link
                href="/summit/tickets"
                className="inline-flex items-center gap-2 mt-7 nav-text text-[9px] tracking-[0.18em] text-[#ff7f41] hover:text-[#0d1e2c] transition-colors"
              >
                SECURE YOUR PLACE <ArrowRight size={10} />
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── WHAT TO EXPECT ────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] px-8 md:px-16 lg:px-20 py-20 lg:py-28 border-b border-[#e5e0da]">
        <div className="max-w-7xl mx-auto">

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="nav-text text-[9px] tracking-[0.35em] text-[#ff7f41] mb-4">WHAT TO EXPECT</p>
                <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight">
                  Four ways<br />the summit works.
                </h2>
              </div>
              <Link
                href="/summit/tickets"
                className="nav-text text-[9px] tracking-[0.2em] text-[#0d1e2c]/35 hover:text-[#0d1e2c] transition-colors flex items-center gap-2 self-end"
              >
                GET ACCESS <ArrowRight size={10} />
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-px bg-[#e5e0da]">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={exp.title} delay={i * 0.07}>
                <motion.div
                  className="group bg-[#faf9f7] hover:bg-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={exp.img}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-600"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-7 md:p-8">
                    <p className="nav-text text-[9px] tracking-[0.22em] text-[#ff7f41] mb-2">{exp.label.toUpperCase()}</p>
                    <h3 style={serif} className="text-2xl text-[#0d1e2c] leading-snug mb-3">{exp.title}</h3>
                    <p className="text-sm text-[#0d1e2c]/55 leading-relaxed mb-5">{exp.desc}</p>
                    <Link
                      href={exp.href}
                      className="inline-flex items-center gap-2 nav-text text-[9px] tracking-[0.2em] text-[#0d1e2c]/40 hover:text-[#ff7f41] transition-colors"
                    >
                      GET ACCESS <ArrowRight size={9} />
                    </Link>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ─────────────────────────────────────────────────────── */}
      <section id="programme" className="px-8 md:px-16 lg:px-20 py-20 lg:py-28 border-b border-[#e5e0da]">
        <div className="max-w-7xl mx-auto">

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="nav-text text-[9px] tracking-[0.35em] text-[#ff7f41] mb-4">THE DAY</p>
                <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight">
                  2025 programme.
                </h2>
              </div>
              <p className="nav-text text-[8px] tracking-[0.15em] text-[#0d1e2c]/25 max-w-xs leading-relaxed self-end">
                TIMES AND SPEAKERS FROM THE 2025 EDITION. FULL SCHEDULE AVAILABLE IN THE ATINUDA APP.
              </p>
            </div>
          </Reveal>

          <div>
            {PROGRAMME.map((item, i) => (
              <Reveal key={i} delay={i * 0.025}>
                <div
                  className={`group grid grid-cols-[72px_1fr] md:grid-cols-[100px_1fr_120px] gap-x-6 md:gap-x-10 py-5 border-t items-baseline transition-colors duration-300 ${
                    item.type === 'gala'    ? 'border-[#ff7f41]/20 hover:bg-[#ff7f41]/3' :
                    item.type === 'special' ? 'border-[#ff7f41]/15 hover:bg-[#ff7f41]/3' :
                    'border-[#e5e0da] hover:bg-[#faf9f7]'
                  }`}
                >
                  <span className="nav-text text-[9px] tracking-[0.1em] text-[#0d1e2c]/30">{item.time}</span>
                  <div>
                    <p className={`leading-snug mb-1 transition-colors duration-300 text-sm md:text-base ${
                      item.type === 'special' || item.type === 'gala'
                        ? 'text-[#0d1e2c]'
                        : 'text-[#0d1e2c]/70 group-hover:text-[#0d1e2c]'
                    }`}>
                      {item.title}
                    </p>
                    {item.note && (
                      <p className="nav-text text-[10px] tracking-[0.12em] text-[#0d1e2c]/60 mt-1">{item.note}</p>
                    )}
                  </div>
                  <div className="hidden md:flex justify-end">
                    <ProgrammeBadge type={item.type} />
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-[#e5e0da]" />
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/summit/tickets"
                className="inline-flex items-center gap-3 bg-[#ff7f41] text-white nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:bg-[#0d1e2c] transition-all duration-300"
              >
                REGISTER TO ATTEND
              </Link>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-3 border border-[#0d1e2c]/15 text-[#0d1e2c]/45 nav-text text-[10px] tracking-[0.18em] px-8 py-4 hover:border-[#0d1e2c]/40 hover:text-[#0d1e2c] transition-all duration-300"
              >
                ABOUT ATINUDA
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SPEAKERS ──────────────────────────────────────────────────────── */}
      <section className="relative px-8 md:px-16 lg:px-20 py-20 lg:py-28 border-b border-[#e5e0da] overflow-hidden">
        {/* dinner.JPG faded background */}
        <Image
          src="/assets/images/elementseven.png"
          alt=""
          fill
          className="object-cover object-center opacity-[0.4]"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto">

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="nav-text text-[9px] tracking-[0.35em] text-[#ff7f41] mb-4">THE VOICES</p>
                <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight">
                  2025 speakers.
                </h2>
              </div>
              <p className="text-[#0d1e2c]/35 text-sm leading-relaxed max-w-xs md:text-right self-end">
                A selection of the 25+ speakers across the 2025 edition. Click any card to read more.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e5e0da]">
            {SPEAKERS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <motion.button
                  onClick={() => setActiveSpeaker(s)}
                  className="group text-left w-full bg-white/90 hover:bg-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7f41]"
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.name}
                      fill
                      className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-600"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Hover reveal strip */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7f41] origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  </div>
                  <div className="p-4 pb-5">
                    <p className="text-[#0d1e2c] text-sm font-medium leading-snug">{s.name}</p>
                    <p className="text-[11px] text-[#0d1e2c]/60 mt-0.5 leading-snug">{s.title}</p>
                    <p className="text-[11px] text-[#ff7f41] mt-0.5 leading-snug">{s.company}</p>
                    <p className="nav-text text-[9px] tracking-[0.14em] text-[#0d1e2c]/30 mt-2 group-hover:text-[#0d1e2c]/55 transition-colors">
                      READ MORE →
                    </p>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS + SPONSOR ────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-20 lg:py-28 border-t border-[#e5e0da]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: fading partner portrait carousel — full bleed, 4:5 ratio */}
          <Reveal>
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] text-[#0d1e2c]/30 mb-8">PARTNERS & MEDIA</p>
              <div className="relative aspect-[4/5] overflow-hidden">
                {PARTNERS.map((logo, i) => (
                  <div
                    key={logo}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: i === partnerImg ? (partnerFade ? 0 : 1) : 0 }}
                  >
                    <Image src={logo} alt="Partner" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                {PARTNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPartnerImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === partnerImg ? 'bg-[#ff7f41]' : 'bg-[#0d1e2c]/20'}`}
                    aria-label={`Partner ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: sponsor content */}
          <Reveal delay={0.1}>
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] text-[#ff7f41] mb-6">PARTNERSHIP</p>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-5">
                Become<br />a sponsor.
              </h2>
              <div className="w-10 h-px bg-[#0d1e2c]/20 mb-6" />
              <p className="text-[#0d1e2c]/55 leading-relaxed mb-3">
                Sponsorship packages include main-stage visibility, delegate access, brand placement, and co-produced activations. A small number of partnerships are available each edition.
              </p>
              <p className="text-[#0d1e2c]/35 text-sm leading-relaxed mb-8">
                The audience is senior and pays to attend. Brand access here is not incidental.
              </p>
              <div className="space-y-3 mb-10">
                {['Title Partner', 'Programme Partner', 'Executive Dinner Partner', 'Spark the Future Partner'].map((tier) => (
                  <div key={tier} className="flex items-center gap-3">
                    <Check size={12} className="text-[#ff7f41] flex-shrink-0" />
                    <span className="text-sm text-[#0d1e2c]/60">{tier}</span>
                  </div>
                ))}
              </div>
              <Link href="/become-a-sponsor">
                <motion.span
                  className="inline-flex items-center gap-3 border border-[#0d1e2c]/20 text-[#0d1e2c] nav-text text-[10px] tracking-[0.18em] px-8 py-4 cursor-pointer overflow-hidden relative group"
                  whileHover="hover"
                >
                  <motion.span
                    className="absolute inset-0 bg-[#ff7f41] origin-left"
                    variants={{ hover: { scaleX: 1 } }}
                    initial={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={{ transformOrigin: 'left' }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    REQUEST SPONSORSHIP PACK
                  </span>
                </motion.span>
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── SPEAKER MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0d1e2c]/70 flex items-center justify-center p-6 md:p-10"
            onClick={() => setActiveSpeaker(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="bg-white max-w-3xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#0d1e2c]/40 hover:text-[#0d1e2c] transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Image */}
              <div className="md:w-2/5 relative aspect-[3/4] md:aspect-auto flex-shrink-0">
                <Image
                  src={activeSpeaker.img}
                  alt={activeSpeaker.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                <p className="nav-text text-[9px] tracking-[0.25em] text-[#ff7f41] mb-4">{activeSpeaker.session.toUpperCase()}</p>
                <h3 style={serifDisplay} className="text-3xl md:text-4xl text-[#0d1e2c] leading-tight mb-1">
                  {activeSpeaker.name}
                </h3>
                <p className="text-[#0d1e2c]/50 text-sm mb-1">{activeSpeaker.title}</p>
                <p className="nav-text text-[9px] tracking-[0.14em] text-[#ff7f41]/70 mb-6">{activeSpeaker.company.toUpperCase()} · {activeSpeaker.country.toUpperCase()}</p>
                <div className="w-8 h-px bg-[#ff7f41] mb-6" />
                <p className="text-[#0d1e2c]/60 text-sm leading-relaxed">{activeSpeaker.bio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
