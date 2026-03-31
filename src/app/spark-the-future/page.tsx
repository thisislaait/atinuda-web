import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Spark the Future — Pitch Programme',
  description:
    'An annual pitch programme for early-stage African entrepreneurs working in sustainability, technology, and the creative economy. 10 ventures. One stage. Live in front of active investors.',
  openGraph: { title: 'Spark the Future | Atinuda', description: '10 ventures. One stage. Live in front of active investors and 300+ African leaders.' },
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const WHY = [
  {
    title: 'A stage, not a platform',
    body: 'Finalists pitch live to the Atinuda audience — 60 of the most connected leaders in African business and creative enterprise. There is no algorithm. Just a room.',
  },
  {
    title: 'Investor access',
    body: 'Active funds and angels looking specifically for African creative-economy ventures attend the finals as judges and guests. Introductions are warm and contextualised.',
  },
  {
    title: 'Mentor network',
    body: 'A dedicated pitch clinic with programme speakers and partners to pressure-test your model, story, and opportunity before the live audience.',
  },
  {
    title: 'Partnership support',
    body: 'Past editions have included brand partnerships with Nord Motors. Each cohort enters the programme with access to the resources of the year\'s partner network.',
  },
];

const EDITIONS = [
  {
    year: '2025',
    edition: 'Edition 01',
    theme: 'Sustainability & Technology in the Events Ecosystem',
    partner: 'Nord Motors',
    venue: 'Atinuda Summit, Lagos',
    date: 'October 8, 2025',
    finalists: '10',
    href: '/spark-the-future-2025',
  },
];

export default function SparkTheFuturePage() {
  return (
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="min-h-[80vh] flex flex-col lg:flex-row">
        <div className="lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-20 pt-32 pb-20">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-8">A PROGRAMME BY ATINUDA</p>
          <h1 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">
            Spark the<br />Future.
          </h1>
          <p className="text-lg text-[#4a4a4a] max-w-md leading-relaxed mb-6">
            An annual pitch programme for early-stage African entrepreneurs working in sustainability, technology, and the creative economy.
          </p>
          <p className="text-[#4a4a4a] max-w-md leading-relaxed mb-10">
            10 ventures. One stage. The most consequential room in African creative enterprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:hello@atinuda.com?subject=Spark the Future — 2026 Interest"
              className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
            >
              Register interest for 2026
            </a>
            <Link
              href="/spark-the-future-2025"
              className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              View 2025 edition
            </Link>
          </div>
        </div>
        <div className="lg:w-[45%] relative min-h-[60vw] lg:min-h-0 bg-[#0d2010] flex items-center justify-center p-12">
          <div className="relative w-full max-w-sm aspect-[3/4]">
            <Image
              src="/assets/images/pitchposter.png"
              fill
              className="object-contain"
              alt="Spark the Future programme poster"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ───────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-6">THE PROGRAMME</p>
            <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-8">
              Ten ventures.<br />One week.<br />Doors that don&apos;t close.
            </h2>
          </div>
          <div className="space-y-6 text-white/70 text-sm leading-relaxed">
            <p>
              Spark the Future selects 10 early-stage ventures each year for a live pitch competition held on stage at the Atinuda Summit. Each venture is focused on innovation within the creative economy — sustainability, technology, experience design, or the infrastructure that powers events and culture.
            </p>
            <p>
              Finalists receive coaching from industry leaders, access to the Atinuda mentor network, and the opportunity to pitch live in front of active investors and the 300+ member Atinuda community.
            </p>
            <p>
              Winners receive investment introductions, partnership agreements with the programme&apos;s corporate sponsor, and a platform that most startups spend years trying to reach.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY APPLY ────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-12">WHY APPLY</p>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY.map((w, i) => (
              <div key={i} className="border border-[#e8e2da] rounded-2xl p-8 hover:border-[#0d2010] transition-colors">
                <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-2xl mb-3">{w.title}</p>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAST EDITIONS ────────────────────────────────────────────── */}
      <section className="bg-[#f0ebe4] px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-10">PAST EDITIONS</p>
          {EDITIONS.map((ed) => (
            <Link
              key={ed.year}
              href={ed.href}
              className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 bg-white rounded-3xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex-none">
                <p style={serifDisplay} className="text-5xl text-[#0d2010]">{ed.year}</p>
                <p className="nav-text text-[9px] tracking-[0.15em] text-[#8a7e72] mt-1">{ed.edition}</p>
              </div>
              <div className="flex-1">
                <p className="text-xl mb-2 group-hover:text-[#0d2010] transition-colors">{ed.theme}</p>
                <div className="flex flex-wrap gap-4 text-xs text-[#8a7e72]">
                  <span>{ed.venue}</span>
                  <span>·</span>
                  <span>{ed.date}</span>
                  <span>·</span>
                  <span>{ed.finalists} finalists</span>
                  <span>·</span>
                  <span>Partner: {ed.partner}</span>
                </div>
              </div>
              <div className="flex-none">
                <span className="inline-flex items-center gap-2 text-sm border border-[#0d2010] text-[#0d2010] px-5 py-2.5 rounded-full group-hover:bg-[#0d2010] group-hover:text-white transition-colors">
                  View edition
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 2026 COMING SOON ─────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">SPARK THE FUTURE 2026</p>
            <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-6">
              Applications open<br />later in 2026.
            </h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-6">
              The 2026 edition of Spark the Future will be announced alongside the next Atinuda Summit. We are currently accepting expressions of interest from early-stage ventures and potential programme partners.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed mb-10">
              To be first in line when applications open, or to enquire about corporate partnership of the programme, send us a note.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:hello@atinuda.com?subject=Spark the Future 2026 — Venture Interest"
                className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
              >
                Register my venture
              </a>
              <a
                href="mailto:hello@atinuda.com?subject=Spark the Future 2026 — Partnership"
                className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Partner with us
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Who should apply', value: 'Early-stage African ventures building in the creative economy — events, culture, experience, sustainability, tech.' },
              { label: 'What you need', value: 'Minimum 12 months of operation, a clear thesis on innovation, and the confidence to pitch it live.' },
              { label: 'What you get', value: 'A stage, a network, coaching, investment introductions, and a corporate partnership.' },
            ].map((item) => (
              <div key={item.label} className="border border-[#e8e2da] rounded-2xl p-6">
                <p className="nav-text text-[9px] tracking-[0.15em] text-[#8a7e72] mb-2">{item.label.toUpperCase()}</p>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
