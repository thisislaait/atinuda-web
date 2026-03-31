import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Corporate Responsibility',
  description:
    'Atinuda\'s commitment to youth entrepreneurship, accessible excellence, knowledge transfer, and local partnership across the African continent.',
  openGraph: { title: 'Corporate Responsibility | Atinuda', description: 'Building rooms that give back — Atinuda\'s community commitments.' },
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const PILLARS = [
  {
    number: '01',
    title: 'Youth entrepreneurship',
    body: 'Through Spark the Future, we give early-stage African entrepreneurs access to capital introductions, mentorship, and a live stage in front of the right room. It is a programme, not a gesture.',
  },
  {
    number: '02',
    title: 'Accessible excellence',
    body: 'The Elevation community actively sponsors emerging talent to attend each edition. The room should reflect all of Africa, which means it cannot be limited to those who can already afford a ticket.',
  },
  {
    number: '03',
    title: 'Knowledge transfer',
    body: 'Summit sessions, masterclasses, and recorded programming are made freely available through our digital platforms, taking the insights from a room of 60 and giving them to thousands.',
  },
  {
    number: '04',
    title: 'Local partnership',
    body: 'Every Atinuda edition prioritises local vendors, creatives, photographers, and producers. The economic impact of the event stays inside the continent it celebrates.',
  },
];

const STATS = [
  { value: '6', label: 'Editions held' },
  { value: '300+', label: 'Alumni across the diaspora' },
  { value: '20+', label: 'Countries represented' },
  { value: '10+', label: 'Start-ups pitched via Spark' },
];

export default function CorporateResponsibilityPage() {
  return (
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 pt-32 pb-20 max-w-7xl mx-auto">
        <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-8">CORPORATE RESPONSIBILITY</p>
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          <h1 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
            Building<br />rooms that<br />give back.
          </h1>
          <div>
            <p className="text-lg text-[#4a4a4a] leading-relaxed mb-6">
              Every gathering we build creates a ripple. We take that seriously. Our responsibility to the continent doesn&apos;t end when the event ends — it begins there.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed">
              Atinuda&apos;s community investment is not a CSR programme bolted on to a commercial enterprise. It is part of the same belief that drives every edition: that Africa deserves the best, and that building the best means bringing more people into the room.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <div className="border-t border-b border-[#e8e2da] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8e2da]">
        {STATS.map((s) => (
          <div key={s.label} className="px-8 py-10 text-center">
            <p style={serifDisplay} className="text-4xl md:text-5xl mb-2">{s.value}</p>
            <p className="nav-text text-[10px] tracking-[0.15em] text-[#8a7e72]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-12">OUR COMMITMENTS</p>
          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {PILLARS.map((p) => (
              <div key={p.number} className="bg-[#0d2010] p-10 hover:bg-[#122b14] transition-colors">
                <p className="nav-text text-[10px] tracking-[0.2em] text-white/30 mb-4">{p.number}</p>
                <p className="text-2xl mb-4 leading-snug">{p.title}</p>
                <p className="text-sm text-white/60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPARK THE FUTURE ─────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">FLAGSHIP PROGRAMME</p>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-8">
                Spark the Future
              </h2>
              <p className="text-[#4a4a4a] leading-relaxed mb-6">
                Spark the Future is Atinuda&apos;s annual pitch programme for early-stage African entrepreneurs. Each edition selects 10 ventures — focused on sustainability, technology, and innovation in the creative economy — for a live pitch competition held on stage at the Atinuda Summit.
              </p>
              <p className="text-[#4a4a4a] leading-relaxed mb-6">
                Finalists receive coaching, mentorship from industry leaders, and visibility in front of the most influential room in African creative enterprise. Winners receive investment introductions, partnership support, and a platform that most startups spend years trying to reach.
              </p>
              <p className="text-[#4a4a4a] leading-relaxed mb-10">
                Applications for the next edition open later in 2026. To register your interest or enquire about being a partner sponsor of the programme, contact us below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/spark-the-future"
                  className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
                >
                  View 2025 edition
                </Link>
                <a
                  href="mailto:hello@atinuda.com?subject=Spark the Future — Interest"
                  className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/assets/images/pitchposter.png"
                fill
                className="object-cover"
                alt="Spark the Future pitch competition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY INVESTMENT ─────────────────────────────────────── */}
      <section className="bg-[#f0ebe4] px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/Retreat/Together/ATINUDA6_DAY3_22.JPG"
              fill
              className="object-cover"
              alt="The Atinuda community in session"
            />
          </div>
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">COMMUNITY INVESTMENT</p>
            <h2 style={serif} className="text-3xl md:text-4xl leading-tight mb-6">
              Sponsored attendance for the next generation.
            </h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-6">
              Each Atinuda edition includes a number of fully or partially sponsored places, reserved for emerging leaders who have the calibre but not yet the capital.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed mb-8">
              These places are nominated by members of the community, endorsed by the programme team, and funded in part by commercial partnerships. If you would like to sponsor a place or nominate someone for the next edition, we would like to hear from you.
            </p>
            <a
              href="mailto:hello@atinuda.com?subject=Sponsored Seat Enquiry"
              className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              Enquire about sponsoring a seat
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p style={serifDisplay} className="text-4xl md:text-5xl mb-6 max-w-2xl mx-auto leading-tight">
            Interested in partnering with us on community impact?
          </p>
          <p className="text-[#4a4a4a] mb-10 max-w-xl mx-auto leading-relaxed">
            We work with a small number of partners whose values align with ours. If you are building something that belongs in this conversation, we want to talk.
          </p>
          <a
            href="mailto:hello@atinuda.com?subject=Community Partnership"
            className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
          >
            Start the conversation
          </a>
        </div>
      </section>

    </main>
  );
}
