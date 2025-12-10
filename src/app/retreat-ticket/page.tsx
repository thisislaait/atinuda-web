'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Loader2, Shield } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Currency = 'NGN' | 'USD';

type TicketProduct = {
  id: string;
  title?: string;
  description?: string;
  price: number;
  currency: Currency;
  key: string;
};

const EVENT_SLUG = 'martitus-retreat-2026';

const formatPrice = (price: number, currency: Currency) => {
  if (currency === 'NGN') {
    return `₦${price.toLocaleString('en-NG')}`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
};

const imageForProduct = (key: string) => {
  const lower = key.toLowerCase();
  if (lower.includes('group')) return '/assets/images/Conference.png';
  return '/assets/images/Mauritius2.png';
};

export default function RetreatTicketsPage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [tickets, setTickets] = useState<TicketProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
            const currency = (typeof data.currency === 'string' ? data.currency.toUpperCase() : '') as Currency;
            if (currency !== 'NGN' && currency !== 'USD') return null;
            const numericPrice =
              typeof data.price === 'number'
                ? data.price
                : typeof data.price === 'string'
                ? Number(data.price)
                : undefined;
            if (!Number.isFinite(numericPrice)) return null;
            return {
              id: doc.id,
              key: doc.id,
              title: data.title ?? doc.id,
              description: data.description,
              price: numericPrice,
              currency,
            };
          })
          .filter(Boolean) as TicketProduct[];
        setTickets(items);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load tickets';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      tickets
        .filter((t) => t.currency === currency)
        .filter((t) => {
          if (currency === 'NGN') {
            return !t.key.toLowerCase().startsWith('test');
          }
          // USD: only main-usd and group-usd
          return t.key === 'main-usd' || t.key === 'group-usd';
        }),
    [tickets, currency],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f1528] to-[#0b1220] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('/assets/images/Mauritius2.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-[#0b1220]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 lg:pb-24 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/70">Tickets</p>
          <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl leading-tight">Secure your spot</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
            Choose your pass for ATINUDA Retreat 2026. Toggle currencies, pick your tier, and join a curated week of leadership,
            creativity, and community in Mauritius.
          </p>
          <p className="text-sm text-white/70 max-w-3xl mx-auto">
            Passes include programming, hospitality, wellness and culture experiences during the retreat. Flights and accommodation
            are not included.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 p-1 shadow-lg shadow-black/30">
            {(['NGN', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  currency === c ? 'bg-white text-[#0b1220]' : 'text-white/80 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading && (
          <div className="flex items-center justify-center gap-3 text-white/70 py-10">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading ticket options…</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white/5 border border-white/10 text-white/70 px-4 py-3 rounded-xl">
            No tickets found for {currency}. Check back soon.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((t) => {
            const isGroup = t.key.toLowerCase().includes('group');
            return (
              <div
                key={t.id}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/25"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-16 w-40 h-40 bg-white/5 blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#ff7f41]/10 blur-3xl" />
                </div>
                <div className="relative">
                  <div className="h-48 w-full overflow-hidden">
                    <Image
                      src={imageForProduct(t.key)}
                      alt={t.title || 'Ticket image'}
                      width={1200}
                      height={600}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                          {isGroup ? 'Group Package' : 'Main Pass'}
                        </p>
                        <h3 className="text-2xl font-semibold hero-text">{t.title ?? t.key}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60">Starting from</p>
                        <p className="text-2xl font-bold">{formatPrice(t.price, t.currency)}</p>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">
                      {t.description ??
                        (isGroup
                          ? 'For teams of 5+ looking to co-create, collaborate, and enjoy shared perks.'
                          : 'Full access to programming, wellness, culture, and networking all week.')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(isGroup
                        ? ['Shared experiences', 'Reserved seating', 'Group concierge', 'Flights & lodging not included']
                        : ['All sessions', 'Wellness & culture', 'Daily hospitality', 'Flights & lodging not included']
                      ).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm text-white/80 border border-white/10"
                        >
                          <CheckCircle size={14} /> {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Shield size={16} />
                        Secure checkout in-app
                      </div>
                      <Link
                        href={`/tickets/${t.key}/checkout?q=1`}
                        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-white text-[#0b1220] hover:bg-white/90 transition"
                      >
                        Continue <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
