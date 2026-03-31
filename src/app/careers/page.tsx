import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join the team building Africa\'s most consequential leadership platform. Open roles at Atinuda — produced by Oaken Events, Lagos.',
  openGraph: { title: 'Careers | Atinuda', description: 'Build Africa\'s most consequential leadership platform with us.' },
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const VALUES = [
  {
    number: '01',
    title: 'We make decisions deliberately.',
    body: 'Every decision, from the venue to the speaker to the typeface, is made on purpose. We are not in the business of good enough.',
  },
  {
    number: '02',
    title: 'We care about the room.',
    body: 'The community is the product. We think deeply about who belongs in it, how to serve them, and what it costs to get it wrong.',
  },
  {
    number: '03',
    title: 'We take Africa seriously.',
    body: 'Not as a market. Not as a story. As a seat at the table that has been earned and deserves the same standard as anywhere else on earth.',
  },
  {
    number: '04',
    title: 'We do hard things well.',
    body: 'Logistics, copy, relationships, finance — we bring the same attention to every discipline. If it touches the brand, it matters.',
  },
];

const OPENINGS = [
  {
    title: 'Partnerships & Sponsorship Associate',
    type: 'Full-time',
    location: 'Lagos, Nigeria',
    body: 'Drive commercial relationships with brands seeking access to the Elevation community. You understand what value looks like from both sides of a partnership agreement.',
  },
  {
    title: 'Community & Experience Manager',
    type: 'Full-time',
    location: 'Lagos, Nigeria',
    body: 'Own the member experience between events — digital community, member dinners, year-round programming. You have high standards and the operational rigour to execute against them.',
  },
  {
    title: 'Creative & Content Lead',
    type: 'Contract / Freelance',
    location: 'Remote',
    body: 'Own the visual and written output of the brand. You think in stories, work fast, and understand the difference between content that converts and content that builds.',
  },
];

export default function CareersPage() {
  return (
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 pt-32 pb-20 max-w-7xl mx-auto">
        <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-8">CAREERS</p>
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          <h1 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
            We build<br />with builders.
          </h1>
          <div>
            <p className="text-lg text-[#4a4a4a] leading-relaxed mb-6">
              Atinuda is a small, deliberate team building something genuinely consequential. We are not looking for people who want a job. We are looking for people who want to be part of building the most important leadership platform Africa has produced.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed">
              If that sounds like you, the roles below are a starting point. If your skills don&apos;t map neatly to any of them but you believe you belong here, the talent pool is exactly that.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-12">HOW WE WORK</p>
          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {VALUES.map((v) => (
              <div key={v.number} className="bg-[#0d2010] p-10">
                <p className="nav-text text-[10px] tracking-[0.2em] text-white/30 mb-4">{v.number}</p>
                <p className="text-2xl mb-4 leading-snug">{v.title}</p>
                <p className="text-sm text-white/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES ───────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-12">OPEN ROLES</p>
          <div className="space-y-6">
            {OPENINGS.map((role, i) => (
              <div key={i} className="border border-[#e8e2da] rounded-2xl p-8 hover:border-[#0d2010] transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <h2 className="text-2xl md:text-3xl group-hover:text-[#0d2010] transition-colors">
                    {role.title}
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    <span className="nav-text text-[9px] tracking-[0.15em] text-[#8a7e72] bg-[#f0ebe4] px-3 py-1.5 rounded-full">
                      {role.type}
                    </span>
                    <span className="nav-text text-[9px] tracking-[0.15em] text-[#8a7e72] bg-[#f0ebe4] px-3 py-1.5 rounded-full">
                      {role.location}
                    </span>
                  </div>
                </div>
                <p className="text-[#4a4a4a] leading-relaxed mb-6">{role.body}</p>
                <a
                  href={`mailto:careers@atinuda.com?subject=Application: ${role.title}`}
                  className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1a1a1a] pb-0.5 hover:text-[#4a4a4a] hover:border-[#4a4a4a] transition-colors"
                >
                  Apply for this role
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TALENT POOL ──────────────────────────────────────────────── */}
      <section className="bg-[#f0ebe4] px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">TALENT POOL</p>
            <h2 style={serif} className="text-4xl md:text-5xl leading-tight mb-6">
              Don&apos;t see the right role?
            </h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-8">
              We hire slowly and deliberately, which means the right role for you may not be open today. Send us your CV and a short note on what you&apos;d build here. When the right moment comes, we&apos;ll know where to look.
            </p>
            <a
              href="mailto:careers@atinuda.com?subject=Talent Pool — General Application"
              className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
            >
              Join the talent pool
            </a>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/Retreat/Together/ATINUDA6_DAY3_17.JPG"
              fill
              className="object-cover"
              alt="Atinuda team at work"
            />
          </div>
        </div>
      </section>

    </main>
  );
}
