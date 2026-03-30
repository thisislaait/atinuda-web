import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { retreatEvents } from '@/data/retreatEvents';

export const metadata: Metadata = {
  title: 'Inside the Elevation, Atinuda Retreat 2026 | Mauritius',
  description:
    'Six days. Six chapters. A behind-the-scenes record of the Atinuda Elevation Retreat 2026 in Mauritius, the people, the places, and what happened when the room came together.',
};

const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' } as const;

// Reusable image placeholder
function ImgPlaceholder({ alt, aspect = 'aspect-video' }: { alt: string; aspect?: string }) {
  return (
    <div
      className={`w-full ${aspect} bg-[#e8e4df] rounded-2xl flex items-center justify-center`}
      aria-label={alt}
      role="img"
    >
      <span className="text-[#b0a89e] text-xs font-mono px-4 text-center">[{alt}]</span>
    </div>
  );
}

export default function EventsPage() {
  const [featured, ...rest] = retreatEvents;

  return (
    <div id="nohero">
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-white/30 mb-6">
            Atinuda · Mauritius · March 2026
          </p>
          <h1
            className="text-6xl md:text-7xl lg:text-8xl leading-[0.93] text-white mb-8 max-w-3xl"
            style={serif}
          >
            Inside the<br />Elevation.
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-xl">
            Six days. Six chapters. A behind-the-scenes record of what happened
            when the most intentional leaders in Africa and the diaspora came
            together in Mauritius.
          </p>
        </div>
      </section>

      {/* ── Featured Post (Day 1) ─────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <Link href={`/events/${featured.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="nav-text text-[10px] tracking-[0.3em] uppercase text-[#9ca3af]">
                    Day {featured.day}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#d1cbc4]" aria-hidden="true" />
                  <span className="nav-text text-[10px] tracking-[0.25em] uppercase text-[#9ca3af]">
                    {featured.date}
                  </span>
                  <span className="nav-text text-[10px] tracking-[0.2em] uppercase bg-[#f2dfd2] text-[#7a5e52] px-2.5 py-1 rounded-full">
                    {featured.tag}
                  </span>
                </div>

                <h2
                  className="text-4xl md:text-5xl leading-tight text-[#0d2010] group-hover:text-[#1a3d1e] transition-colors"
                  style={serif}
                >
                  {featured.title}
                </h2>
                <p className="text-lg text-[#5a5a52] italic" style={serif}>
                  {featured.subtitle}
                </p>
                <p className="text-[#6b7280] text-sm leading-relaxed max-w-md">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0d2010] group-hover:gap-3 transition-all">
                  Read the full story
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <ImgPlaceholder alt={featured.heroImageAlt} aspect="aspect-[4/3]" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-[#e5e0da]" />
        </div>
      </div>

      {/* ── Remaining Posts Grid ──────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group flex flex-col gap-5"
              >
                {/* Thumbnail placeholder */}
                <div className="relative overflow-hidden rounded-2xl">
                  <ImgPlaceholder alt={event.heroImageAlt} aspect="aspect-[4/3]" />
                  {/* Day overlay */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-5xl text-white/25 leading-none select-none"
                      style={serif}
                      aria-hidden="true"
                    >
                      {String(event.day).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="nav-text text-[10px] tracking-[0.25em] uppercase text-[#9ca3af]">
                      {event.date}
                    </span>
                    <span className="nav-text text-[10px] tracking-[0.2em] uppercase bg-[#f2dfd2] text-[#7a5e52] px-2 py-0.5 rounded-full">
                      {event.tag}
                    </span>
                  </div>

                  <h3
                    className="text-2xl leading-snug text-[#0d2010] group-hover:text-[#1a3d1e] transition-colors"
                    style={serif}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm italic text-[#8c8478]" style={serif}>
                    {event.subtitle}
                  </p>
                  <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-3">
                    {event.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0d2010] group-hover:gap-2.5 transition-all pt-1">
                    Read
                    <ArrowRight size={12} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <p className="nav-text text-[10px] tracking-[0.35em] uppercase text-white/30">
            The Elevation Retreat · 2027 Edition
          </p>
          <h2 className="text-5xl md:text-6xl leading-tight text-white" style={serif}>
            The next cohort<br />is forming now.
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-md mx-auto">
            What you&apos;ve read happened for a room of people who chose to show up.
            The question is whether you&apos;ll be in the next one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/retreat-ticket"
              className="px-8 py-4 bg-white text-[#0d2010] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors shadow-xl shadow-black/30"
            >
              Apply for your retreat pass
            </Link>
            <Link
              href="/speakers"
              className="text-sm text-white/45 hover:text-white transition-colors"
            >
              Meet the speakers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
