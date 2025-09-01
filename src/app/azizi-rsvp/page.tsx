/* FILE: src/app/azizi-rsvp/page.tsx */
import Image from "next/image";
import RsvpForm from "@/components/ui/RsvpForm";
import { submitRsvp } from "./action";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Azizi by Atinuda — RSVP",
  description: "RSVP to Azizi by Atinuda — the library, Victoria Island • October 6th 2025",
};

const IMAGE_PATHS = Array.from({ length: 6 }, (_, i) => `/assets/images/azizi${i + 1}.jpeg`);
const TILE_HEIGHTS = [180, 260, 210, 320, 200, 300, 230, 280, 220, 340, 240, 300];

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <div className="relative h-[320px] w-full sm:h-[380px] md:h-[420px]">
        <Image src="/assets/images/elementtwo.png" alt="Ticket Banner" fill className="object-cover" priority />
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-center text-4xl hero-text font-bold text-white md:text-6xl">RSVP To Azizi</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6 lg:p-10">
        <div className="grid items-start gap-7 lg:grid-cols-2">
          {/* Left — Masonry grid */}
          <section aria-label="Event moodboard" className="[&>*]:mb-4 columns-1 sm:columns-2 lg:columns-3" style={{ columnGap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const src = IMAGE_PATHS[i % IMAGE_PATHS.length];
              return (
                <div key={`${src}-${i}`} className="inline-block w-full break-inside-avoid overflow-hidden rounded-xl bg-[#111318] shadow-xl">
                  <div className="relative w-full" style={{ height: TILE_HEIGHTS[i % TILE_HEIGHTS.length] }}>
                    <Image
                      src={src}
                      alt={`Azizi gallery ${i + 1}`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      priority={i < 3}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Right — Card with form */}
          <section className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0 -z-10">
              <Image src="/assets/images/elementthree.png" alt="" fill className="object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-white/40 to-white/80" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-2 text-white">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/70" />
                    <span className="text-xs tracking-widest">COCKTAIL MIXER</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold leading-none">Azizi by Atinuda</h2>
                  <p className="mt-1 text-sm">the library, Victoria Island • October 6th 2025</p>
                </div>
                <div className="flex h-36 w-[110px] flex-col items-center justify-center rounded-2xl bg-[#ff7f41] text-4xl font-black leading-none text-white shadow-xl">
                  <div>06</div>
                  <div>10</div>
                  <div className="mt-1 text-xs font-semibold tracking-widest opacity-90">2025</div>
                </div>
              </div>

              <RsvpForm action={submitRsvp} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
