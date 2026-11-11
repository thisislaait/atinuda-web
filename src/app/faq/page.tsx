'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiChevronDown, FiChevronUp} from 'react-icons/fi';
import { PRODUCTS, formatNaira, unitPrice } from '@/lib/atinuda7Checkout';

const PASS_LIST = PRODUCTS.filter((p) => p.kind !== 'test')
  .map((p) => `• ${p.name} (${formatNaira(unitPrice(p))}): ${p.summary}`)
  .join('\n');

/**
 * FAQ DATA
 * Edit freely — content is grouped by category. Passes and prices come from the checkout catalogue.
 */
type FaqItem = { id: string; q: string; a: string };
type FaqCategory = { id: string; title: string; items: FaqItem[] };

const CATEGORIES: FaqCategory[] = [
  {
    id: 'about',
    title: 'About Atinuda',
    items: [
      {
        id: 'what-is-atinuda',
        q: 'What is Atinuda?',
        a: "Sub-Saharan Africa’s definitive summit for the experiential economy. Atinuda 7.0, themed “Tomorrow, Now: The Architecture of Scale”, brings together fashion founders, hospitality executives, creative directors and sector investors for three days in Lagos.",
      },
      {
        id: 'where-when',
        q: 'When and where is Atinuda 7.0?',
        a: 'Lagos, Nigeria, on 5–7 October 2027. The venue will be announced here.',
      },
    ],
  },
  {
    id: 'tickets',
    title: 'Passes',
    items: [
      {
        id: 'ticket-tiers',
        q: 'What does each pass include?',
        a: `${PASS_LIST}\n\nThe pricing page compares every pass in full.`,
      },
      {
        id: 'qr-tickets',
        q: 'How do I get my pass?',
        a: 'Once your payment is confirmed, we email your ticket number and a link to your invitation, which you can download as a PDF. On instalments, your pass follows the final payment.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    items: [
      {
        id: 'how-to-pay',
        q: 'How do I pay?',
        a: 'Choose your pass on the pricing page and pay at checkout through Flutterwave, by card, bank transfer or USSD. Your pass is emailed as soon as the payment clears.',
      },
      {
        id: 'currency',
        q: 'What currency can I pay in?',
        a: 'Checkout charges in naira. If you pay with a card issued in another currency, your bank converts the amount at its own rate.',
      },
      {
        id: 'refunds',
        q: 'What is the refund policy?',
        a: 'Tickets are non-refundable. If you can’t attend, you may transfer your ticket to someone else before the event. Contact support to update the name/email on the ticket.',
      },
      {
        id: 'instalments',
        q: 'Can I pay in instalments?',
        a: 'Yes, on single-pass orders booked by 31 July 2027. You pay 50% at checkout, 25% after 30 days and 25% after 60 days, using a private link we email you. You keep the price you booked at while you stay on schedule, including the early bird rate, and your pass is issued after the final payment clears. If a payment is more than seven days late, your booking is cancelled and your place released.',
      },
    ],
  },
  {
    id: 'logistics',
    title: 'Logistics',
    items: [
      {
        id: 'what-to-bring',
        q: 'What should I bring?',
        a: 'Your ticket number or invitation, and anything you need for note-taking. For workshops, bring your laptop if relevant.',
      },
      {
        id: 'dress-code',
        q: 'Is there a dress code?',
        a: 'Conference/workshops: smart casual. Dinner Gala: cocktail / formal recommended.',
      },
      {
        id: 'accessibility',
        q: 'Accessibility & special accommodations',
        a: 'We aim to make Atinuda accessible. If you need assistance (mobility, hearing, visual, etc.), please reach out at least 7 days before the event.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Help & Support',
    items: [
      {
        id: 'didnt-get-email',
        q: 'I didn’t get my confirmation email — what do I do?',
        a: 'Check your spam/junk, and verify the email you used. If it’s still missing after 10 minutes, contact support with your full name and payment email.',
      },
      {
        id: 'name-typo',
        q: 'I made a typo in my name or email — can I fix it?',
        a: 'Yes. Contact support with the correct details and your ticket number so we can update your record and resend your ticket.',
      },
      {
        id: 'invoice',
        q: 'Can I get an invoice/receipt for my company?',
        a: 'Absolutely — reply to your confirmation email or contact support. Include your company name, address, and any tax details required.',
      },
    ],
  },
];

const BUY_TICKETS_URL = '/pricing';

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  // Flatten for search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (it) =>
          it.q.toLowerCase().includes(q) ||
          it.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  // SEO JSON-LD (top questions)
  const jsonLd = useMemo(() => {
    const all = CATEGORIES.flatMap((c) => c.items);
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: all.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    };
  }, []);

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    
    <div className="min-h-screen bg-white mt-20">

      {/* Hero + Search */}
      <section id='nohero' className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex-col items-center gap-3">
            <p className="text-sm uppercase tracking-widest text-[#ff7f41] mb-2">
          Atinuda 7.0, 5–7 October 2027, Lagos
            </p>
            <h1 className="text-2xl md:text-3xl hero-text text-black font-bold mb-4">
          Answers to the most common questions
            </h1>
          </div>
          <Link
            href={BUY_TICKETS_URL}
            className="hidden sm:inline-flex px-4 py-2 rounded bg-[#ff7f41] text-white text-sm hover:bg-gray-800"
          >
            Get Tickets
          </Link>
        </div>
  

        <div className="relative max-w-2xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: payments, discounts, workshops…"
            className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-gray-700"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        {filtered.length === 0 && (
          <div className="text-gray-600 text-sm mt-6">
            No results for “{query}”. Try different keywords.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((cat) => (
            <div key={cat.id} className="border border-gray-300 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                <h3 className="font-black text-[#ff7f41]">{cat.title}</h3>
              </div>
              <ul className="divide-y divide-gray-300">
                {cat.items.map((it) => {
                  const isOpen = open === it.id;
                  return (
                    <li key={it.id}>
                      <button
                        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50"
                        aria-expanded={isOpen}
                        onClick={() => toggle(it.id)}
                      >
                        <span className="font-medium text-black">{it.q}</span>
                        {isOpen ? (
                          <FiChevronUp className="mt-1 shrink-0 text-black" />
                        ) : (
                          <FiChevronDown className="mt-1 shrink-0 text-black" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-700 whitespace-pre-line">
                          {it.a}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact / CTA */}
        <div className="mt-10 rounded-2xl border p-6 bg-gray-50">
          <h4 className="font-semibold mb-2">Still need help?</h4>
          <p className="text-sm text-gray-700">
            Email <a className="underline" href="mailto:hello@atinuda.africa">hello@atinuda.africa</a> and include your
            full name, ticket type, and any screenshots if you had a payment issue.
          </p>
          <div className="mt-4">
            <Link
              href={BUY_TICKETS_URL}
              className="inline-flex px-4 py-2 rounded bg-[#ff7f41] text-white text-sm hover:bg-[#e66a30]"
            >
              Buy Tickets
            </Link>
          </div>
        </div>
      </section>

      {/* SEO: JSON-LD FAQ */}
      <script
        type="application/ld+json"
    
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
