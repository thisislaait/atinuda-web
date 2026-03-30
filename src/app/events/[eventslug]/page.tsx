import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { retreatEvents, type ContentBlock } from '@/data/retreatEvents';

// ── Static params ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return retreatEvents.map((e) => ({ eventslug: e.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventslug: string }>;
}): Promise<Metadata> {
  const { eventslug } = await params;
  const event = retreatEvents.find((e) => e.slug === eventslug);
  if (!event) return {};
  return {
    title: `${event.title}: ${event.subtitle} | Atinuda Elevation 2026`,
    description: event.excerpt,
  };
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' } as const;

// ── Primitives ─────────────────────────────────────────────────────────────────

/**
 * Renders a real photo when `src` is provided, or a styled placeholder otherwise.
 * Swap the placeholder div for <Image> when assets are ready for other days.
 */
function ImgBlock({
  src,
  alt,
  caption,
  portrait = false,
  className = '',
}: {
  src?: string;
  alt: string;
  caption?: string;
  portrait?: boolean;
  className?: string;
}) {
  const aspectClass = portrait ? 'aspect-[3/4]' : 'aspect-[3/2]';
  return (
    <figure className={className}>
      <div className={`w-full ${aspectClass} relative overflow-hidden bg-[#ddd8d2]`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#aba49c] text-[10px] font-mono px-6 text-center leading-relaxed">
              [{alt}]
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-[11px] text-[#a09080] tracking-[0.05em] leading-relaxed italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function VenueCallout({ name, body }: { name: string; body: string }) {
  return (
    <aside className="my-14 p-6 lg:p-8 bg-[#f0ebe4] border border-[#e0d8cf] rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={11} className="text-[#0d2010]/40" aria-hidden="true" />
        <p className="nav-text text-[9px] tracking-[0.32em] uppercase text-[#a09080]">Venue</p>
      </div>
      <p className="text-xl font-semibold text-[#0d2010] mb-3" style={serif}>
        {name}
      </p>
      <p className="text-sm text-[#6b7280] leading-relaxed">{body}</p>
    </aside>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-14 py-10 border-t border-b border-[#d4cec8]">
      <p
        className="text-2xl md:text-[1.75rem] leading-[1.3] text-[#0d2010] max-w-[38ch]"
        style={serif}
      >
        {text}
      </p>
    </blockquote>
  );
}

/**
 * 2-col: landscape pairs — wide establishing or scene shots
 * 3-col: portrait trio — people, moments, detail shots
 */
function PhotoGrid({
  images,
  cols = 2,
}: {
  images: { src?: string; alt: string; caption?: string }[];
  cols?: 2 | 3;
}) {
  const aspectClass = cols === 3 ? 'aspect-[3/4]' : 'aspect-[4/3]';
  const gridClass = cols === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <div className={`grid ${gridClass} gap-1`}>
      {images.map((img, i) => (
        <figure key={i}>
          <div className={`w-full ${aspectClass} relative overflow-hidden bg-[#ddd8d2]`}>
            {img.src ? (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                sizes={cols === 3 ? '(max-width: 1024px) 33vw, 19vw' : '(max-width: 1024px) 50vw, 29vw'}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#aba49c] text-[10px] font-mono px-4 text-center leading-relaxed">
                  [{img.alt}]
                </span>
              </div>
            )}
          </div>
          {img.caption && (
            <figcaption className="mt-1.5 text-[10px] text-[#a09080] tracking-[0.04em] italic">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

// ── Block renderer ─────────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={idx} className="text-[#3a3230] text-[1.05rem] leading-[1.95] mb-8 max-w-[52ch]">
          {block.text}
        </p>
      );

    case 'h3':
      return (
        <h3
          key={idx}
          className="text-2xl md:text-3xl text-[#0d2010] mt-16 mb-5 max-w-[22ch]"
          style={serif}
        >
          {block.text}
        </h3>
      );

    case 'img':
      return (
        <ImgBlock
          key={idx}
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          portrait={block.portrait}
          className="my-12 -mx-8 md:-mx-12 lg:-mx-16"
        />
      );

    case 'grid':
      return (
        <div key={idx} className="my-12 -mx-8 md:-mx-12 lg:-mx-16">
          <PhotoGrid images={block.images} cols={block.cols} />
        </div>
      );

    case 'venue':
      return <VenueCallout key={idx} name={block.name} body={block.body} />;

    case 'pull':
      return <PullQuote key={idx} text={block.text} />;

    default:
      return null;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function EventPostPage({
  params,
}: {
  params: Promise<{ eventslug: string }>;
}) {
  const { eventslug } = await params;
  const event = retreatEvents.find((e) => e.slug === eventslug);
  if (!event) notFound();

  const currentIdx = retreatEvents.indexOf(event);
  const prev = retreatEvents[currentIdx - 1] ?? null;
  const next = retreatEvents[currentIdx + 1] ?? null;

  return (
    <div id="nohero">
      {/*
       * Two-panel editorial layout (desktop lg+):
       *   LEFT  58vw — scrollable: dark hero title → body content → nav → CTA
       *   RIGHT 42vw — sticky, full viewport height: hero photo anchors the page
       *
       * Mobile: right panel hidden, hero image appears inline after the title.
       */}
      <div className="lg:flex lg:items-start">

        {/* ── LEFT: scrollable content ─────────────────────────────────── */}
        <div className="lg:w-[58vw] lg:flex-shrink-0">

          {/* Dark hero — full viewport height on desktop */}
          <section className="bg-[#0d2010] min-h-[90vh] lg:min-h-screen pt-28 lg:pt-36 px-8 md:px-12 lg:px-16 pb-16 flex flex-col">
            <div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-[10px] text-white/25 hover:text-white/55 transition-colors nav-text tracking-[0.22em] uppercase"
              >
                <ArrowLeft size={10} aria-hidden="true" />
                All posts
              </Link>
            </div>

            {/* Title pushed to bottom */}
            <div className="mt-auto pt-16">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="nav-text text-[9px] tracking-[0.32em] uppercase text-white/25">
                  Day {event.day}
                </span>
                <span className="w-px h-3 bg-white/12" aria-hidden="true" />
                <span className="nav-text text-[9px] tracking-[0.28em] uppercase text-white/25">
                  {event.date}
                </span>
                <span className="nav-text text-[9px] tracking-[0.2em] uppercase text-white/35 bg-white/8 border border-white/10 px-2.5 py-1 rounded-full">
                  {event.tag}
                </span>
              </div>

              <h1
                className="text-[3.75rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.9] tracking-tight text-white mb-7"
                style={serif}
              >
                {event.title}
              </h1>

              <p className="text-white/35 text-xl italic leading-relaxed max-w-sm mb-4" style={serif}>
                {event.subtitle}
              </p>
              <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-white/18">
                {event.primaryVenue}
              </p>
            </div>
          </section>

          {/* Mobile: hero image inline (right panel hidden on mobile) */}
          <div className="lg:hidden">
            {event.heroImageSrc ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-[#1c2e1d]">
                <Image
                  src={event.heroImageSrc}
                  alt={event.heroImageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#1c2e1d] flex items-center justify-center">
                <span className="text-white/20 text-[10px] font-mono px-8 text-center">
                  [{event.heroImageAlt}]
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <section className="bg-[#faf9f7] px-8 md:px-12 lg:px-16 pt-14 pb-20 overflow-x-hidden">

            {/* Lead excerpt */}
            <p
              className="text-[#2b1f1a]/60 text-[1.3rem] md:text-[1.45rem] leading-[1.65] mb-10 max-w-[42ch] font-light"
              style={serif}
            >
              {event.excerpt}
            </p>

            {/* Rule + tag */}
            <div className="flex items-center gap-4 mb-14">
              <div className="w-8 h-px bg-[#c9b8ab]" />
              <span className="nav-text text-[9px] tracking-[0.3em] uppercase text-[#a09080]">
                {event.tag} · {event.date}
              </span>
            </div>

            {event.content.map((block, idx) => renderBlock(block, idx))}
          </section>

          {/* Post navigation */}
          <section className="bg-[#f0ebe4] border-t border-[#e0d8cf] px-8 md:px-12 lg:px-16 py-10">
            <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-[#a09080] mb-5">
              Continue reading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/events/${prev.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white/60 hover:bg-white transition-colors"
                >
                  <ArrowLeft
                    size={13}
                    className="text-[#b0a89e] group-hover:text-[#0d2010] mt-0.5 shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="nav-text text-[9px] tracking-[0.25em] uppercase text-[#a09080] mb-1.5">
                      Previous · Day {prev.day}
                    </p>
                    <p className="font-semibold text-[#0d2010] text-sm leading-snug" style={serif}>
                      {prev.title}
                    </p>
                    <p className="text-xs text-[#a09080] mt-0.5 italic">{prev.subtitle}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/events/${next.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white/60 hover:bg-white transition-colors sm:justify-end sm:text-right"
                >
                  <div>
                    <p className="nav-text text-[9px] tracking-[0.25em] uppercase text-[#a09080] mb-1.5">
                      Next · Day {next.day}
                    </p>
                    <p className="font-semibold text-[#0d2010] text-sm leading-snug" style={serif}>
                      {next.title}
                    </p>
                    <p className="text-xs text-[#a09080] mt-0.5 italic">{next.subtitle}</p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-[#b0a89e] group-hover:text-[#0d2010] mt-0.5 shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#0d2010] px-8 md:px-12 lg:px-16 py-20 lg:py-28">
            <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-white/22 mb-6">
              The Elevation Retreat · Next Edition
            </p>
            <h2
              className="text-4xl md:text-5xl leading-[1.05] text-white mb-6 max-w-[16ch]"
              style={serif}
            >
              You should have been there.<br />You can be next time.
            </h2>
            <p className="text-white/38 text-base leading-relaxed max-w-sm mb-10">
              The next cohort is forming now. Applications are open for those ready to elevate.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/retreat-ticket"
                className="px-7 py-3.5 rounded-full bg-white text-[#0d2010] text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Apply for your retreat pass
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white group transition-colors"
              >
                Read more from the retreat
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>

        </div>

        {/* ── RIGHT: sticky full-height hero image (desktop only) ────────── */}
        <div
          className="hidden lg:block lg:flex-1 sticky top-0 h-screen overflow-hidden"
          aria-hidden="true"
        >
          {event.heroImageSrc ? (
            <Image
              src={event.heroImageSrc}
              alt={event.heroImageAlt}
              fill
              className="object-cover object-center"
              sizes="42vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#1c2e1d] flex items-center justify-center">
              <span className="text-white/15 text-[10px] font-mono text-center px-10 leading-loose">
                [{event.heroImageAlt}]
              </span>
            </div>
          )}

          {/* Metadata strip over image */}
          <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
            <div className="w-6 h-px bg-white/30 mb-4" />
            <p className="nav-text text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
              {event.date}
            </p>
            <p className="text-sm text-white/55" style={serif}>
              {event.primaryVenue}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
