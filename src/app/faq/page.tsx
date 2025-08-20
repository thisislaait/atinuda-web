'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiChevronDown, FiChevronUp} from 'react-icons/fi';

/**
 * FAQ DATA
 * Edit freely — content is grouped by category.
 * Dates/tiers match your app: Oct 6–8, 2025, Lagos; ticket tiers & APPOEMN discounts.
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
        a: "Atinuda is a multi-day creative industry experience featuring talks, workshops, and a dinner gala — happening October 6–8, 2025 in Lagos, Nigeria. The 2025 theme is “Local To Global – Creative Transformations.”",
      },
      {
        id: 'who-is-it-for',
        q: 'Who is it for?',
        a: 'Designers, brand builders, entrepreneurs, event & experiential pros, agencies, marketing teams, and ambitious students — basically anyone growing creative work and communities.',
      },
      {
        id: 'where-when',
        q: 'Where & when does it hold?',
        a: 'Lagos, Nigeria — October 6–8, 2025. Check-in opens 8:30 AM on conference days (10:00 AM – 6:00 PM). Dinner Gala is the evening of Oct 8.',
      },
    ],
  },
  {
    id: 'tickets',
    title: 'Tickets & Access',
    items: [
      {
        id: 'ticket-tiers',
        q: 'What does each ticket include?',
        a: [
          '• Conference Access – All main sessions (Oct 6–8).',
          '• Workshop Access – Hands-on expert sessions (limited seats).',
          '• Premium Experience – Conference + Workshop bundled rate.',
          '• Executive Access – Premium plus access to the private Executive Dinner.',
          '• Dinner Gala Only – Invitation to the evening Gala & Executive Dinner (Oct 8).',
        ].join('\n'),
      },
      {
        id: 'qr-tickets',
        q: 'How do I get my ticket/QR code?',
        a: 'After a successful payment you’ll land on a success page and receive an email with your ticket details. Your QR code is also generated and shown — bring it to check-in.',
      },
      {
        id: 'check-in',
        q: 'What happens at check-in?',
        a: 'Show your QR code (phone is fine) + ticket number. We scan and mark your access (Day 1/Day 2/Dinner).',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Discounts',
    items: [
      {
        id: 'how-to-pay',
        q: 'How do I pay?',
        a: "On the Ticket page, choose a tier and quantity, then proceed to Checkout. We process payments securely via Flutterwave (card, USSD, mobile money).",
      },
      {
        id: 'currency',
        q: 'What currency can I pay with?',
        a: 'You can switch between NGN or USD on the Ticket page. Your total updates automatically.',
      },
      {
        id: 'appoemn-discount',
        q: 'APPOEMN member discounts — how do they work?',
        a: 'During sign-up, tick “I’m an APPOEMN member” and enter your official APPOEMN Membership ID. If validated, you receive a one-time discount automatically at checkout: EXCO: 50% (APPO50-xxxxx), Members: 20% (APPO20-xxxxx). The discount applies automatically when you’re logged in and hasn’t been used.',
      },
      {
        id: 'refunds',
        q: 'What is the refund policy?',
        a: 'Tickets are non-refundable. If you can’t attend, you may transfer your ticket to someone else before the event. Contact support to update the name/email on the ticket.',
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
        a: 'Your QR ticket, a valid ID (optional, for name verification), and anything you need for note-taking. For workshops, bring your laptop if relevant.',
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

const BUY_TICKETS_URL = '/ticket-payment'; // update if needed

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
    const firstTen = CATEGORIES.flatMap((c) => c.items).slice(0, 10);
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: firstTen.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a.replace(/\n/g, '<br/>') },
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
          Local To Global – Creative Transformations
            </p>
            <h2 className="text-2xl md:text-3xl hero-text text-black font-bold mb-4">
          Answers to the most common questions
            </h2>
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
