import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { speakers, totalSpeakers } from '@/data/speakers';
import SpeakerGrid from '@/components/speakers/SpeakerGrid';

export const metadata: Metadata = {
  title: 'Speakers, Atinuda Retreat 2026 | Mauritius',
  description: `Meet the ${totalSpeakers} speakers confirmed for the Atinuda Elevation Retreat 2026 in Mauritius. Founders, executives, creative directors, and global connectors.`,
};

export default function SpeakersPage() {
  return (
    <div id="nohero">
      {/* ── Page hero, B&W event photo as background ── */}
      <section className="relative overflow-hidden pt-32 pb-20 min-h-[380px] flex items-end">
        {/* Background photo */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/assets/images/speakers/atinuda-panel-bw.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay, dark at bottom where text sits, lighter at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2010] via-[#0d2010]/70 to-[#0d2010]/40" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <p className="nav-text text-xs tracking-[0.3em] uppercase text-white/40">
                Atinuda Retreat 2026 · Mauritius
              </p>
              <h1
                className="text-5xl md:text-6xl leading-tight text-white"
                style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}
              >
                The voices<br />in the room.
              </h1>
              <p className="text-white/60 text-base leading-relaxed">
                {totalSpeakers} speakers confirmed for March 2026. More to be announced.
              </p>
            </div>
            <Link
              href="/retreat-ticket"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0d2010] text-sm font-semibold hover:bg-white/90 transition-colors whitespace-nowrap self-start md:self-auto"
            >
              Claim your retreat pass
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Track legend ── */}
      <section className="bg-[#081008] border-b border-white/5 py-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(speakers.map((s) => s.track))).map((track) => (
              <span
                key={track}
                className="nav-text text-xs tracking-[0.15em] uppercase text-white/50 border border-white/10 px-3 py-1.5 rounded-full"
              >
                {track}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Speaker grid ── */}
      <section className="bg-[#faf9f7] py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SpeakerGrid speakers={speakers} />

          {/* More to be announced */}
          <div className="mt-14 pt-10 border-t border-[#e5e7eb] text-center space-y-3">
            <p
              className="text-2xl md:text-3xl text-[#0d2010]"
              style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}
            >
              More speakers to be announced.
            </p>
            <p className="text-sm text-[#6b7280]">
              Follow{' '}
              <a
                href="https://instagram.com/atinuda_"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#0d2010] transition-colors"
              >
                @atinuda_
              </a>{' '}
              for speaker drops and programme updates.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#f2dfd2] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="nav-text text-xs tracking-[0.3em] uppercase text-[#5a433a]">
            March 8–14, 2026 · Mauritius
          </p>
          <h2
            className="text-4xl md:text-5xl leading-tight text-[#2b1f1a]"
            style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}
          >
            Be in the room.
          </h2>
          <p className="text-[#5a433a] text-base max-w-md mx-auto">
            The retreat brings these voices together with you for seven days of
            leadership, learning, and connection in Mauritius.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/retreat-ticket"
              className="px-7 py-3.5 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors"
            >
              Claim your retreat pass
            </Link>
            <Link
              href="/#programme"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2b1f1a] group"
            >
              View the programme
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
