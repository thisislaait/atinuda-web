import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story | Atinuda',
  description:
    'Atinuda builds the rooms that change what is possible for African leadership. The story behind the community, the summits, and the people who show up.',
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const } as const;
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' } as const;

// Edition history — update dates/locations for editions 1 and 2 when confirmed
const EDITIONS = [
  {
    number: '01',
    name: 'The First Gathering',
    location: 'Africa',          // TODO: replace with real location
    year: '2024',                // TODO: replace with real year
    note: 'The idea became real. A small, selected cohort. Proof that the right room with the right people was a product in itself.',
    image: '/assets/images/azizi1.jpeg',
  },
  {
    number: '02',
    name: 'The Expansion',
    location: 'Africa',          // TODO: replace with real location
    year: '2025',                // TODO: replace with real year
    note: 'A second edition. A bigger room. The same standard. More leaders, deeper sessions, more clarity about what Atinuda is building.',
    image: '/assets/images/azizi5.jpeg',
  },
  {
    number: '03',
    name: 'The Elevation',
    location: 'Mauritius',
    year: '2026',
    note: 'Seven days at The Oberoi, Mauritius. The most ambitious edition yet — keynotes, workshops, wellness, cultural experiences, and a cohort that raised the bar again.',
    image: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_30.JPG',
  },
];

const BELIEFS = [
  {
    n: '01',
    title: 'The room is the product.',
    body: 'Every session, venue, and experience is designed around one outcome: who you leave knowing, and who you become in the process. The agenda matters. The room matters more.',
  },
  {
    n: '02',
    title: 'Depth over breadth, always.',
    body: "We are not building a conference. We are building a room where the right people can go further together than they could alone. That requires fewer people, more intention, and no shortcuts.",
  },
  {
    n: '03',
    title: 'Africa-centred, globally executed.',
    body: "Created by Africans, attended by Africans, then taken to the world. The roots are not the story — the work and the people doing it are.",
  },
  {
    n: '04',
    title: 'Curation over scale.',
    body: 'We will never choose a bigger room over a better one. Every delegate is selected for what they bring to the group, not solely for their title or résumé. That standard does not change.',
  },
  {
    n: '05',
    title: 'The relationships outlast the week.',
    body: 'We measure success by what happens after the programme ends. The collaborations, the calls, the partnerships, the accountability. That is the actual product.',
  },
];

export default function OurStoryPage() {
  return (
    <div id="nohero">

      {/* ── Typographic hero — cream, no photo, pure statement ─────────────── */}
      <section className="bg-[#faf9f7] pt-36 lg:pt-44 pb-20 lg:pb-28 px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-16 lg:gap-20">

            {/* Left: the statement */}
            <div className="lg:flex-1">
              <p className="nav-text text-[9px] tracking-[0.38em] uppercase text-[#7a5e52] mb-10">
                Our Story
              </p>
              <h1
                className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.9] tracking-tight text-[#0d2010]"
                style={serifDisplay}
              >
                We build the<br />rooms that<br />change what&apos;s<br />possible.
              </h1>
            </div>

            {/* Right: staggered photo collage — intimate, not cinematic */}
            <div className="lg:w-[42%] shrink-0">
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#ddd8d2]">
                  <Image
                    src="/assets/images/Retreat/attendee2.jpg"
                    alt="Elevation Retreat attendee"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 40vw, 21vw"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-10">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#ddd8d2]">
                    <Image
                      src="/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_41.JPG"
                      alt="The Elevation Retreat, Mauritius"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 40vw, 21vw"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#ddd8d2]">
                    <Image
                      src="/assets/images/Retreat/attendee4.jpg"
                      alt="Elevation Retreat attendee"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 40vw, 21vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Thin rule + founding line ───────────────────────────────────────── */}
      <div className="bg-[#faf9f7] px-8 md:px-12 lg:px-20 xl:px-28 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-[#d4cec8] pt-10 flex flex-col md:flex-row md:items-start gap-10">
            <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-[#a09080] shrink-0 md:w-32 pt-0.5">
              Founded
            </p>
            <p
              className="text-2xl md:text-3xl leading-[1.4] text-[#0d2010] max-w-2xl font-light"
              style={serif}
            >
              {/* TODO: Fill in founding year and founder name */}
              Atinuda was built on a single, stubborn belief: that the most ambitious leaders
              in Africa and the diaspora deserve a gathering that matches what they are doing,
              not a standard conference, not a holiday, something that earns its own category.
            </p>
          </div>
        </div>
      </div>

      {/* ── The origin story ────────────────────────────────────────────────── */}
      <section className="bg-white px-8 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">

            {/* Left: label + image */}
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-8">
                Who we are
              </p>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e3dd]">
                <Image
                  src="/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_44.JPG"
                  alt="Atinuda community"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 28vw"
                />
              </div>
            </div>

            {/* Right: story body */}
            <div className="flex flex-col justify-center max-w-2xl">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-[#0d2010] mb-10"
                style={serifDisplay}
              >
                An event company that<br />is really a community.
              </h2>
              <div className="space-y-6 text-[#3a3230] text-[1.05rem] leading-[1.9]">
                <p>
                  Atinuda produces high-calibre gatherings across summits, retreats,
                  private dinners, and workshops. The format varies. The standard does not.
                  Every event is organised around one outcome: the right people in the same
                  room, with sufficient time and structure to make it count.
                </p>
                <p>
                  The identity is pan-African. The ambition is global. Quality is
                  non-negotiable. We do not grow by increasing headcount. We grow by
                  raising what the room is worth.
                </p>
                <p>
                  {/* TODO: Add founder personal note / origin story here */}
                  The Atinuda community spans founders, executives, creative directors,
                  investors, and cultural leaders from Nigeria, Ghana, Kenya, South Africa,
                  the UK, and beyond. They are high-achievers who understand that the most
                  valuable investment they can make is in the people they sit next to.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-12">
                <div className="w-8 h-px bg-[#c9b8ab]" />
                <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-[#a09080]">
                  3rd Edition · Mauritius 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we believe — dark manifesto ───────────────────────────────── */}
      <section className="bg-[#0d2010] px-8 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-white/22 mb-5">
            What we believe
          </p>
          <h2
            className="text-4xl md:text-5xl leading-[1.05] text-white mb-16 max-w-lg"
            style={serifDisplay}
          >
            The principles that<br />shape every room we build.
          </h2>

          <div className="space-y-0">
            {BELIEFS.map(({ n, title, body }, i) => (
              <div
                key={n}
                className={`grid md:grid-cols-[5rem_1fr_1fr] gap-6 lg:gap-12 py-8 ${
                  i < BELIEFS.length - 1 ? 'border-b border-white/8' : ''
                }`}
              >
                <span className="nav-text text-[11px] tracking-[0.2em] text-white/20 pt-1">{n}</span>
                <h3
                  className="text-xl md:text-2xl text-white leading-snug"
                  style={serif}
                >
                  {title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The three editions ──────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] px-8 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-5">
            The journey
          </p>
          <h2
            className="text-4xl md:text-5xl leading-[1.05] text-[#0d2010] mb-16 max-w-md"
            style={serifDisplay}
          >
            Three editions.<br />One standard.
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-[#e8e3dd] rounded-2xl overflow-hidden">
            {EDITIONS.map(({ number, name, location, year, note, image }) => (
              <div key={number} className="bg-[#faf9f7] flex flex-col">
                {/* Edition image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2010]/60 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-white/50 mb-0.5">
                      Edition {number}
                    </p>
                    <p className="text-white text-sm font-medium">{year} · {location}</p>
                  </div>
                </div>

                {/* Edition text */}
                <div className="p-6 lg:p-7 flex-1">
                  <h3 className="text-lg text-[#0d2010] mb-3">{name}</h3>
                  <p className="text-sm text-[#7a6458] leading-relaxed">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The people — photo mosaic ───────────────────────────────────────── */}
      <section className="bg-[#f0ebe4] px-8 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-5">
                The community
              </p>
              <h2
                className="text-4xl md:text-5xl leading-[1.05] text-[#0d2010] max-w-sm"
                style={serifDisplay}
              >
                Who you will find in the room.
              </h2>
            </div>
            <p className="text-sm text-[#7a6458] leading-relaxed max-w-sm lg:text-right">
              Founders, executives, creative directors, investors, and cultural leaders
              from across Africa and the diaspora. Selected for what they bring,
              selected for what they bring to the group, not solely their titles.
            </p>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/assets/images/Retreat/attendee1.JPG', aspect: 'aspect-[3/4]', offset: '' },
              { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_38.JPG', aspect: 'aspect-[3/4]', offset: 'md:mt-10' },
              { src: '/assets/images/Retreat/attendee3.jpg', aspect: 'aspect-[3/4]', offset: '' },
              { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_43.JPG', aspect: 'aspect-[3/4]', offset: 'md:mt-10' },
              { src: '/assets/images/cheers.jpeg', aspect: 'aspect-[4/3] md:aspect-[3/2]', offset: '' },
              { src: '/assets/images/Retreat/attendee5.jpg', aspect: 'aspect-[3/4]', offset: 'hidden md:block' },
              { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_42.JPG', aspect: 'aspect-[4/3]', offset: 'hidden md:block' },
              { src: '/assets/images/Retreat/attendee2.jpg', aspect: 'aspect-[3/4]', offset: 'hidden md:block md:mt-10' },
            ].map(({ src, aspect, offset }, i) => (
              <div
                key={i}
                className={`relative ${aspect} rounded-2xl overflow-hidden bg-[#ddd8d2] ${offset}`}
              >
                <Image
                  src={src}
                  alt="Atinuda community member"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 45vw, 22vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── By the numbers ──────────────────────────────────────────────────── */}
      <section className="bg-white px-8 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-24 border-b border-[#e8e3dd]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e3dd] rounded-2xl overflow-hidden">
            {[
              { value: '3', label: 'Editions' },
              { value: '3+', label: 'Countries' },
              { value: 'Curated', label: 'Every cohort' },
              { value: '2026', label: 'Next edition' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white px-8 py-10">
                <p
                  className="text-5xl md:text-6xl text-[#0d2010] leading-none mb-3"
                  style={serifDisplay}
                >
                  {value}
                </p>
                <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-[#a09080]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] px-8 md:px-12 lg:px-20 xl:px-28 py-24 lg:py-32 relative overflow-hidden">
        {/* Ghosted background texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <Image
            src="/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_17.JPG"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#0d2010]/70 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-white/22 mb-6">
                Be part of what&apos;s next
              </p>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl leading-[0.95] text-white"
                style={serifDisplay}
              >
                The next room<br />is being built.<br />Your seat is waiting.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-white/40 text-base leading-relaxed max-w-sm">
                Applications for the next edition of the Atinuda Elevation Retreat are open.
                The cohort is selected. Places are limited. If this is the room you have been looking for, the application is the next step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/retreat-ticket"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#0d2010] px-7 py-4 rounded-full text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  Apply for a retreat pass
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:hello@atinuda.com"
                  className="inline-flex items-center justify-center gap-2 text-sm text-white/45 hover:text-white transition-colors group"
                >
                  Send us a message
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
