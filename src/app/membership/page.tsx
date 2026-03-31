import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Elevation Circle — Membership',
  description:
    'Year-round access to Africa\'s most consequential leadership community. The Elevation Circle gives permanent members priority access, exclusive programming, and the connections built in the room.',
  openGraph: { title: 'The Elevation Circle | Atinuda', description: 'Year-round access to Africa\'s most consequential leadership community.' },
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const BENEFITS = [
  {
    title: 'Priority access',
    body: 'First invitation to each new Elevation edition before the public announcement. Your place is never uncertain.',
  },
  {
    title: 'The alumni network',
    body: 'Permanent access to the Elevation community — founders, executives, and creative leaders from 20+ countries who have all been in the same room.',
  },
  {
    title: 'Member dinners',
    body: 'Intimate gatherings hosted in Lagos, London, and Accra throughout the year. The conversation continues between editions.',
  },
  {
    title: 'Executive programming',
    body: 'Masterclasses, peer roundtables, and strategy sessions available exclusively to Circle members.',
  },
  {
    title: 'The private community',
    body: 'Access to the Elevation network — where the real conversations happen, resources are shared, and the right introductions get made.',
  },
  {
    title: 'Legacy pricing',
    body: "Founding members lock in their event pricing at the rate they joined. The investment grows. Your rate doesn't.",
  },
];

export default function MembershipPage() {
  return (
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-20 pt-32 pb-20">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-8">THE ELEVATION CIRCLE</p>
          <h1 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">
            The week<br />ends.<br />The room<br />stays open.
          </h1>
          <p className="text-lg text-[#4a4a4a] max-w-md leading-relaxed mb-10">
            Membership is how the community continues between editions. Year-round access to the people, the programming, and the conversations that started in the room.
          </p>
          <Link
            href="/membership/apply"
            className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 w-fit hover:bg-[#1a3a1a] transition-colors"
          >
            Apply for membership
          </Link>
        </div>
        <div className="lg:w-[45%] relative min-h-[70vw] lg:min-h-0">
          <Image
            src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_46.JPG"
            fill
            className="object-cover"
            alt="The Elevation 2026 cohort at Château de Labourdonnais"
            priority
          />
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────── */}
      <div className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-20">
        <p style={serif} className="text-2xl md:text-3xl lg:text-4xl flex-1 leading-snug">
          &ldquo;The most valuable thing we build isn&apos;t the programme. It&apos;s the room.&rdquo;
        </p>
        <p className="text-sm text-white/60 md:max-w-xs leading-relaxed">
          The Elevation Circle gives you permanent access to a room that gets more valuable every year.
        </p>
      </div>

      {/* ── WHAT IT MEANS ────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">WHAT MEMBERSHIP MEANS</p>
            <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-8">
              A standing<br />in the room.
            </h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-6">
              The Elevation Circle is not a points programme or a digital newsletter. You become a permanent member of a community that is, by structure, closed to the public.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed mb-6">
              Every person in the Circle has been in the room. They&apos;ve sat through sessions that ran long because no one wanted to stop, built relationships in three-minute connection windows, and understood — firsthand — what it means when a gathering is designed with genuine intention. Membership is the recognition of that shared experience, and the infrastructure to keep building on it.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed">
              What makes the Circle valuable is what made the gathering valuable: the curation. One room. One standard. No exceptions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/assets/images/Retreat/Together/ATINUDA6_DAY3_8.JPG"
                fill
                className="object-cover"
                alt="The cohort in session"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden lg:mt-10">
              <Image
                src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_35.JPG"
                fill
                className="object-cover"
                alt="The Gala, Château de Labourdonnais"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS GRID ────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-6">WHAT YOU GET</p>
          <h2 style={serifDisplay} className="text-4xl md:text-5xl mb-16 max-w-xl leading-tight">
            Six things that make the difference.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-[#0d2010] p-8 hover:bg-[#122b14] transition-colors">
                <p className="nav-text text-[10px] tracking-[0.2em] text-white/30 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-xl mb-3">{b.title}</p>
                <p className="text-sm text-white/60 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-hidden" aria-hidden="true">
        {[
          '/assets/images/Retreat/Within/ATINUDA6_DAY2_46.JPG',
          '/assets/images/Retreat/Together/ATINUDA6_DAY3_20.JPG',
          '/assets/images/Retreat/Skill/ATINUDA6_DAY4_445.JPG',
          '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_669.JPG',
          '/assets/images/Retreat/Finale/ATINUDA6_DAY6_31.JPG',
          '/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_41.JPG',
        ].map((src, i) => (
          <div key={i} className="relative flex-none w-[35vw] md:w-[22vw] lg:w-[17vw] aspect-[3/4]">
            <Image src={src} fill className="object-cover" alt="" />
          </div>
        ))}
      </div>

      {/* ── WHO CAN APPLY ────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">WHO CAN APPLY</p>
          <div className="grid lg:grid-cols-2 gap-16">
            <h2 style={serifDisplay} className="text-4xl md:text-5xl leading-tight">
              Membership is open to Elevation alumni and a small number of founding applicants.
            </h2>
            <div className="space-y-6 text-[#4a4a4a]">
              <p className="leading-relaxed">
                If you&apos;ve attended an Atinuda Elevation edition, your application is straightforward. You&apos;re already in the room. Membership formalises that and gives you year-round access to what was built there.
              </p>
              <p className="leading-relaxed">
                If you haven&apos;t yet attended, a small number of founding memberships are available to individuals who demonstrate the vision, standing, and intent that defines the Elevation community. This is not an open application. It is a considered one.
              </p>
              <p className="leading-relaxed">
                Applications are reviewed on a rolling basis. The cohort is capped by design. Curation is not a marketing choice — it is the product.
              </p>
              <Link
                href="/membership/apply"
                className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors mt-2"
              >
                Begin your application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_22.JPG"
          fill
          className="object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        <div className="relative z-10 px-8 md:px-16 lg:px-20 py-20 text-white max-w-3xl">
          <p className="nav-text text-[10px] tracking-[0.2em] text-white/50 mb-6">THE ELEVATION CIRCLE</p>
          <h2 style={serifDisplay} className="text-4xl md:text-6xl leading-tight mb-8">
            Your place in the<br />room is waiting.
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-lg leading-relaxed">
            Apply for founding membership and stay inside the most consequential leadership community building Africa&apos;s next chapter.
          </p>
          <Link
            href="/membership/apply"
            className="inline-flex items-center gap-3 bg-white text-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-white/90 transition-colors"
          >
            Apply for membership
          </Link>
        </div>
      </section>

    </main>
  );
}
