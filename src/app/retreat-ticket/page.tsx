'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, Shield, Users } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase/config';

// ── Types ──────────────────────────────────────────────────────────────────────
type Currency = 'NGN' | 'USD';

type TicketProduct = {
  id: string;
  title?: string;
  description?: string;
  price: number;
  currency: Currency;
  key: string;
};

// ── Constants ──────────────────────────────────────────────────────────────────
const EVENT_SLUG = 'martitus-retreat-2026';
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' } as const;

const formatPrice = (price: number, currency: Currency) =>
  currency === 'NGN'
    ? `₦${price.toLocaleString('en-NG')}`
    : `$${price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

// Per-pass photo and copy config — swap photos to taste
const PASS_CONFIG: Record<string, { photo: string; inclusions: string[]; tagline: string }> = {
  default: {
    photo: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_35.JPG',
    inclusions: [
      'All keynotes & workshop sessions',
      'Daily wellness programming',
      'Curated dining & cultural experiences',
      'All evening gatherings & events',
      'Atinuda app access, itinerary & guides',
    ],
    tagline: 'Full access to the complete Elevation experience.',
  },
  group: {
    photo: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_45.JPG',
    inclusions: [
      'Full access for your group of 5+',
      'Reserved group seating at all sessions',
      'Dedicated group concierge throughout',
      'Curated dining & cultural experiences',
      'Atinuda app access, itinerary & guides',
    ],
    tagline: 'Bring your team. Elevate together.',
  },
};

const getConfig = (key: string) =>
  key.toLowerCase().includes('group') ? PASS_CONFIG.group : PASS_CONFIG.default;

// What's covered breakdown
const COVERS = [
  {
    title: 'Keynotes & Workshops',
    desc: "Two full summit days with Africa's most intentional voices on leadership, creativity, strategy, and wealth.",
  },
  {
    title: 'Wellness Programming',
    desc: 'Daily movement, spa access, guided sessions and a dedicated wellness day at LUX* Belle Mare.',
  },
  {
    title: 'Curated Dining',
    desc: "Private dinners across Mauritius's finest venues, from Inti Grand Baie to a gala closing night at Labourdonnais.",
  },
  {
    title: 'Island Experiences',
    desc: 'Island day across Casela, Valle, Rum and Pottery experience centres. Mauritius beyond the resort.',
  },
  {
    title: 'Evening Gatherings',
    desc: 'Nightly events designed to deepen relationships — from the welcome cocktail to the closing gala dinner.',
  },
  {
    title: 'Atinuda App Access',
    desc: 'Live itinerary, speaker profiles, venue guides, networking tools and your digital retreat pass.',
  },
];

const FAQS = [
  {
    q: 'Does the pass include flights and accommodation?',
    a: 'No. The retreat pass covers all programming, wellness, dining and events during the week. Flights and accommodation at The Oberoi are arranged and paid for separately.',
  },
  {
    q: 'How does the application process work?',
    a: 'After purchase, your application is reviewed by the Atinuda team. We curate the cohort carefully to ensure every delegate adds to the room. You will receive a confirmation within 5 business days.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Instalment plans are available for NGN purchases. Reach out to the team directly at hello@atinuda.com to arrange a payment schedule before completing checkout.',
  },
  {
    q: 'What is the refund policy?',
    a: 'Passes are non-refundable but fully transferable up to 30 days before the retreat begins. Contact the team to arrange a name transfer.',
  },
  {
    q: 'Is this the right retreat for me?',
    a: "The Elevation is designed for founders, executives, creative directors, and high-achieving professionals ready to invest in themselves at the highest level. If you're asking whether you belong — you probably do.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RetreatTicketsPage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [tickets, setTickets] = useState<TicketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'events', EVENT_SLUG, 'ticketProducts'));
        const snap = await getDocs(q);
        if (!mounted) return;
        const items: TicketProduct[] = snap.docs
          .map((doc) => {
            const data = doc.data() as Partial<TicketProduct>;
            const cur = (typeof data.currency === 'string'
              ? data.currency.toUpperCase()
              : '') as Currency;
            if (cur !== 'NGN' && cur !== 'USD') return null;
            const price =
              typeof data.price === 'number'
                ? data.price
                : typeof data.price === 'string'
                ? Number(data.price)
                : undefined;
            if (!Number.isFinite(price)) return null;
            return {
              id: doc.id,
              key: doc.id,
              title: data.title ?? doc.id,
              description: data.description,
              price: price as number,
              currency: cur,
            };
          })
          .filter(Boolean) as TicketProduct[];
        setTickets(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load passes');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(
    () =>
      tickets
        .filter((t) => t.currency === currency)
        .filter((t) =>
          currency === 'NGN'
            ? !t.key.toLowerCase().startsWith('test')
            : t.key === 'main-usd' || t.key === 'group-usd',
        ),
    [tickets, currency],
  );

  return (
    <div id="nohero">

      {/* ── Cinematic full-bleed hero ───────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-between overflow-hidden">

        {/* Full-bleed photo */}
        <Image
          src="/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_33.JPG"
          alt="The Elevation Retreat 2026, Mauritius"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* Gradient: light vignette top, heavy at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

        {/* Top: back link */}
        <div className="relative z-10 px-8 md:px-12 lg:px-16 pt-28 lg:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] text-white/40 hover:text-white/70 transition-colors nav-text tracking-[0.22em] uppercase"
          >
            <ArrowLeft size={10} aria-hidden="true" />
            Back to retreat
          </Link>
        </div>

        {/* Bottom: title block + frosted stats bar */}
        <div className="relative z-10">
          <div className="px-8 md:px-12 lg:px-16 pb-10">
            <p className="nav-text text-[9px] tracking-[0.38em] uppercase text-white/40 mb-5">
              Atinuda · The Elevation Retreat · Mauritius · 2026
            </p>
            <h1
              className="text-[3.25rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] leading-[0.88] tracking-tight text-white"
              style={serif}
            >
              Claim your<br />place.
            </h1>
          </div>

          {/* Frosted glass stats bar anchored to the very bottom */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/12 border-t border-white/12 bg-black/30 backdrop-blur-md">
            {[
              { value: '3rd', label: 'Edition' },
              { value: 'Mar 8–14', label: '2026' },
              { value: 'The Oberoi', label: 'Mauritius' },
              { value: 'Limited', label: 'Cohort' },
            ].map(({ value, label }) => (
              <div key={label} className="px-7 py-5">
                <p className="text-xl md:text-2xl text-white font-light" style={serif}>{value}</p>
                <p className="nav-text text-[9px] tracking-[0.28em] uppercase text-white/35 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pass selection ──────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] px-6 md:px-12 lg:px-16 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">

          {/* Header + currency toggle */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-4">
                Select your pass
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.1] text-[#0d2010]" style={serif}>
                Choose your<br />experience.
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <p className="nav-text text-[9px] tracking-[0.25em] uppercase text-[#a09080]">Currency</p>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#ede8e3] p-1">
                {(['NGN', 'USD'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      currency === c
                        ? 'bg-[#0d2010] text-white shadow-sm'
                        : 'text-[#7a6458] hover:text-[#0d2010]'
                    }`}
                  >
                    {c === 'NGN' ? '₦ NGN' : '$ USD'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-3 text-[#a09080] py-24">
              <div className="w-5 h-5 border-2 border-[#0d2010]/15 border-t-[#0d2010] rounded-full animate-spin" />
              <span className="text-sm">Loading passes...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#a09080] text-sm">
                No passes available in {currency} right now. Check back soon or contact{' '}
                <a href="mailto:hello@atinuda.com" className="underline text-[#0d2010]">
                  hello@atinuda.com
                </a>
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {filtered.map((t) => {
                const config = getConfig(t.key);
                const isGroup = t.key.toLowerCase().includes('group');

                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#e8e3dd] flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Photo */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={config.photo}
                        alt={t.title || 'Retreat pass'}
                        fill
                        className="object-cover object-center hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="nav-text text-[9px] tracking-[0.25em] uppercase bg-black/35 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full">
                          {isGroup ? 'Group Package' : 'Individual Pass'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-7 lg:p-8 flex flex-col flex-1 gap-6">

                      {/* Title + tagline */}
                      <div>
                        <h3 className="text-2xl text-[#0d2010] mb-1.5" style={serif}>
                          {t.title ?? (isGroup ? 'Group Pass' : 'Retreat Pass')}
                        </h3>
                        <p className="text-sm text-[#a09080] leading-snug">{config.tagline}</p>
                      </div>

                      {/* Price — the hero moment */}
                      <div className="py-6 border-t border-b border-[#f0ebe4]">
                        <p className="nav-text text-[9px] tracking-[0.28em] uppercase text-[#a09080] mb-2">
                          {isGroup ? 'From, per person' : 'Per person'}
                        </p>
                        <p
                          className="text-5xl lg:text-6xl text-[#0d2010] leading-none tracking-tight"
                          style={serif}
                        >
                          {formatPrice(t.price, t.currency)}
                        </p>
                      </div>

                      {/* Inclusions */}
                      <div className="flex-1">
                        <p className="nav-text text-[9px] tracking-[0.28em] uppercase text-[#a09080] mb-4">
                          What&apos;s included
                        </p>
                        <ul className="space-y-3">
                          {config.inclusions.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <Check
                                size={13}
                                className="text-[#0d2010] mt-0.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-sm text-[#3a3230] leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Exclusion note */}
                      <p className="text-xs text-[#b0a89e] leading-relaxed">
                        Flights and accommodation are not included.
                        {isGroup && ' Minimum group of 5 applies.'}
                      </p>

                      {/* CTA */}
                      <Link
                        href={`/tickets/${t.key}/checkout?q=1`}
                        className="flex items-center justify-center gap-2 bg-[#0d2010] text-white py-4 px-6 rounded-full text-sm font-semibold hover:bg-[#1a3d1e] active:scale-[0.98] transition-all"
                      >
                        Claim this pass
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>

                      {/* Trust signal */}
                      <div className="flex items-center justify-center gap-2">
                        <Shield size={11} className="text-[#c9b8ab]" aria-hidden="true" />
                        <span className="text-[11px] text-[#c9b8ab]">
                          Secure checkout · Payment processed safely
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cohort note */}
          <div className="mt-10 flex items-start sm:items-center justify-center gap-3">
            <Users size={13} className="text-[#b0a89e] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <p className="text-sm text-[#a09080] text-center">
              The Elevation is a curated, limited-cohort retreat. Every application is reviewed
              before a place is confirmed.
            </p>
          </div>
        </div>
      </section>

      {/* ── What your pass covers ───────────────────────────────────────────── */}
      <section className="bg-[#0d2010] px-6 md:px-12 lg:px-16 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-white/22 mb-5">
            Your pass covers
          </p>
          <h2 className="text-4xl md:text-5xl leading-[1.1] text-white mb-16 max-w-md" style={serif}>
            Seven days,<br />fully taken care of.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
            {COVERS.map(({ title, desc }) => (
              <div key={title} className="bg-[#0d2010] px-7 py-8 hover:bg-[#112614] transition-colors">
                <div className="w-5 h-px bg-[#2d5a32] mb-5" />
                <p className="text-base font-medium text-white mb-3" style={serif}>{title}</p>
                <p className="text-sm text-white/38 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Attendee faces ──────────────────────────────────────────────────── */}
      <section className="bg-[#f5f0eb] px-6 md:px-12 lg:px-16 py-20 lg:py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="lg:w-96 shrink-0">
              <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-5">
                Who you will meet
              </p>
              <h2 className="text-3xl md:text-4xl leading-[1.1] text-[#0d2010] mb-5" style={serif}>
                The room is the product.
              </h2>
              <p className="text-sm text-[#7a6458] leading-relaxed">
                Founders, executives, creative directors, investors, and cultural leaders from
                across Africa and the diaspora. Selected not just for what they have achieved,
                but for what they bring to the room.
              </p>
            </div>

            {/* Attendee photo strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mr-6 pr-6 lg:mr-0 lg:pr-0 lg:flex-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`relative flex-shrink-0 w-36 lg:flex-1 rounded-2xl overflow-hidden bg-[#ddd8d2] ${
                    n % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[2/3]'
                  }`}
                >
                  <Image
                    src={`/assets/images/Retreat/attendee${n}.${n === 2 || n === 3 || n === 4 || n === 5 ? 'jpg' : 'JPG'}`}
                    alt={`Elevation Retreat attendee`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 144px, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] px-6 md:px-12 lg:px-16 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-[#7a5e52] mb-5">
            Before you commit
          </p>
          <h2 className="text-3xl md:text-4xl text-[#0d2010] mb-12" style={serif}>
            Common questions.
          </h2>

          <div className="divide-y divide-[#e8e3dd]">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-7">
                <p className="text-base font-semibold text-[#0d2010] mb-2.5" style={serif}>{q}</p>
                <p className="text-sm text-[#7a6458] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#e8e3dd] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[#7a6458]">Still have questions?</p>
            <a
              href="mailto:hello@atinuda.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d2010] group"
            >
              hello@atinuda.com
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] px-6 md:px-12 lg:px-16 py-20 lg:py-28 relative overflow-hidden">
        {/* Background texture from a real photo */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_17.JPG"
            alt=""
            fill
            className="object-cover object-center"
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 bg-[#0d2010]/60" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="nav-text text-[9px] tracking-[0.35em] uppercase text-white/25 mb-6">
            The Elevation · Mauritius · March 2026
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white mb-8" style={serif}>
            The room is<br />waiting for you.
          </h2>
          <p className="text-white/40 text-lg leading-relaxed max-w-sm mx-auto mb-10" style={serif}>
            A limited cohort. A once-a-year experience. The only question is whether you are ready.
          </p>
          <button
            onClick={() => document.getElementById('passes')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-white text-[#0d2010] px-8 py-4 rounded-full text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            View passes
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </section>

    </div>
  );
}
