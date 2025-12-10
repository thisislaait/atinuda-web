'use client';

import React from 'react';
import { ArrowRight, CalendarClock, Download, Image as ImageIcon, MapPin, MessageCircle, ShieldCheck, Sparkles, Ticket } from 'lucide-react';
import Link from 'next/link';
import BottomNav from '../components/layout/Nav/BottomNav';

const CTAButton = ({
  label,
  href = '#',
  primary = false,
}: {
  label: string;
  href?: string;
  primary?: boolean;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition ${
      primary
        ? 'bg-[#0B1220] text-white hover:bg-[#131b2f]'
        : 'bg-white/80 text-[#0B1220] border border-white/50 hover:bg-white'
    }`}
  >
    <Download size={16} />
    <span>{label}</span>
  </Link>
);

const statics = {
  features: [
    {
      title: 'Tickets & RSVP',
      desc: 'Buy and store passes, RSVP, and keep your QR handy at the door.',
      icon: Ticket,
    },
    {
      title: 'Schedule & Speakers',
      desc: 'Live itinerary, speaker lineup, and curated sessions in one view.',
      icon: CalendarClock,
    },
    {
      title: 'Guides & Lookbooks',
      desc: 'Venue, travel, and city guides with attire/lookbook inspiration.',
      icon: MapPin,
    },
    {
      title: 'Photos & Community',
      desc: 'Relive moments, share galleries, and connect via WhatsApp.',
      icon: ImageIcon,
    },
  ],
  events: [
    {
      title: 'Azizi Mixer 2025',
      blurb: 'Afrofuturist soirée with curated networking and live sets.',
      tag: 'Lagos',
      tone: 'from-[#0B1220] to-[#1f2c4a]',
    },
    {
      title: 'CEO Dinner 2025',
      blurb: 'Black-tie reception for founders, investors, and partners.',
      tag: 'Lagos',
      tone: 'from-[#1a1a1a] to-[#2e1c12]',
    },
    {
      title: 'Summit Day 1',
      blurb: 'Keynotes, panels, and masterclasses on luxury experiences.',
      tag: 'Conference',
      tone: 'from-[#0d1828] to-[#213d52]',
    },
    {
      title: 'Summit Day 2',
      blurb: 'Breakouts, showcases, and deal-making with global peers.',
      tag: 'Conference',
      tone: 'from-[#1b2438] to-[#2b3f56]',
    },
  ],
  posts: [
    {
      title: 'Designing unforgettable luxury events',
      tag: 'Insights',
      desc: 'How Atinuda curates immersive experiences across retreats and summits.',
    },
    {
      title: 'What we learned at Atinuda 2025',
      tag: 'Recap',
      desc: 'Highlights from speakers, partners, and the community.',
    },
    {
      title: 'Building community beyond the ballroom',
      tag: 'Community',
      desc: 'Connecting attendees year-round through the Atinuda app.',
    },
  ],
  collaborators: [
    'Logos',
    'build_cities',
    'Charter Cities Institute',
    'Kleros',
    'Waku',
    'Railgun',
    'ZuVillage',
  ],
  agenda: [
    { time: '10:00', title: 'Doors open', room: 'Main Stage' },
    { time: '10:30', title: 'Welcome remarks', room: 'Main Stage' },
    { time: '11:00', title: 'Keynote: Future of Luxury', room: 'Main Stage' },
    { time: '12:00', title: 'Panel: Experience Design', room: 'Demo Room' },
    { time: '13:00', title: 'Lunch & networking', room: 'Chill Zone' },
    { time: '14:00', title: 'Workshop: Community Growth', room: 'Round Table' },
  ],
  faqs: [
    { q: 'Where do I buy tickets?', a: 'All ticketing and RSVPs are handled in the Atinuda app. However, payment can also be made on the web' },
    { q: 'Will I get a QR pass?', a: 'Yes. After checkout your QR is stored in the app under Tickets.' },
    { q: 'Can I view the agenda?', a: 'Live itineraries and speaker details live in the app. A snapshot is shown below.' },
    { q: 'Is there a community group?', a: 'Join our WhatsApp community via the Explore section or the CTA below.' },
  ],
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="bg-gradient-to-b from-[#f8fafc] via-[#f1f4f9] to-[#eef2f8] text-[#0B1220]">
      {/* New hero banner with background image and PSC-style text */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('/assets/images/Mauritius2.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/55" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-16 lg:py-20 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm mx-auto" />
          <div className="space-y-3">
            <p className="text-xs tracking-[0.25em] text-white/70">ATINUDA RETREAT 2026</p>
            <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl leading-tight uppercase text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
              The Elevation
            </h1>
            <p className="text-sm tracking-[0.2em] uppercase text-white/70">Rise Within | Rise Together | Rise Beyond</p>
          </div>
          <div className="max-w-3xl mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 shadow-2xl shadow-black/30">
            <p className="text-base leading-relaxed text-white/85">
              A week-long leadership and creativity immersion in Mauritius for visionary founders, executives, and creators across Africa and the diaspora. Rise in a luxurious, intentional setting that blends strategy, wellness, culture, and networking. Inspired by Mauritius—a nation that rose from the ocean floor—every moment invites you to grow personally, lead together, and build a lasting legacy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button className="px-5 py-3 bg-white text-[#0B1220] text-sm font-semibold rounded-full border border-white/40 shadow-lg shadow-black/20 hover:bg-white/90 transition">
              Mauritius, March 8th - 14th 2026
            </button>
            <Link
              href="/retreat-ticket"
              className="px-5 py-3 bg-black/80 text-white text-sm font-semibold rounded-full border border-white/20 shadow-lg shadow-black/25 hover:bg-black transition"
            >
              Claim your spot
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 inset-x-0">
          <BottomNav />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f3f6fb] to-[#e9eef7]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-20 w-96 h-96 bg-[#9fb7ff]/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#ffb36c]/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.35),transparent_40%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="uppercase tracking-[0.25em] text-xs text-[#6b7280]">Atinuda App</p>
            <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl leading-tight">
              The luxury events companion for tickets, schedules, and community.
            </h1>
            <p className="text-[#475569] text-lg max-w-2xl">
              Keep everything for Atinuda in one place: buy tickets, store QR passes, view live
              itineraries, meet speakers, and unlock guides—all from the app.
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton label="Download on iOS (coming soon)" primary />
              <CTAButton label="Download on Android (coming soon)" />
              <Link
                href="#resource-hub"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7f41] hover:text-[#0B1220] transition"
              >
                Explore resources <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-[#6b7280]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="text-sm">Secure payments via Flutterwave</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles size={18} />
                <span className="text-sm">Curated for premium experiences</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto max-w-md rounded-3xl bg-white border border-white/60 shadow-2xl shadow-[#a5b4fc]/30 p-6 backdrop-blur">
              <div className="absolute -top-8 -left-6 w-32 h-32 bg-[#ffb36c]/20 blur-[70px]" />
              <div className="absolute -bottom-10 right-0 w-40 h-40 bg-[#9fb7ff]/20 blur-[90px]" />
              <div className="relative aspect-[3/5] rounded-2xl bg-gradient-to-br from-[#f5f7fb] via-[#eef2f8] to-[#e7ebf5] border border-[#e2e8f0] p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Today</p>
                  <div className="space-y-1">
                    <p className="text-sm text-[#475569]">Mauritius Retreat</p>
                    <p className="text-2xl font-semibold hero-text">Check-in window opens</p>
                    <p className="text-[#64748b] text-sm">Tap to view your QR pass</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-white border border-[#e2e8f0] px-4 py-3 shadow-sm">
                    <div>
                      <p className="text-xs text-[#6b7280]">Ticket</p>
                      <p className="font-semibold">Executive Pass</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6b7280]">Status</p>
                      <p className="text-emerald-600 font-semibold">Ready</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-white border border-[#e2e8f0] px-4 py-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#eef2f8] flex items-center justify-center">
                      <CalendarClock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Evening Welcome</p>
                      <p className="text-xs text-[#6b7280]">Bel Ombre · 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-white border border-[#e2e8f0] px-4 py-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#eef2f8] flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Venue guide</p>
                      <p className="text-xs text-[#6b7280]">Maps, transfers, concierge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statics.features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl bg-white border border-[#e5e7eb] p-5 shadow-sm flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#eef2f8] flex items-center justify-center">
              <f.icon size={18} />
            </div>
            <p className="font-semibold text-lg hero-text">{f.title}</p>
            <p className="text-sm text-[#475569]">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* <section className="bg-white text-[#0B1220] py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl font-semibold hero-text">Collaborators & Partners</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {statics.collaborators.map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-dashed border-[#d1d5db] px-4 py-8 text-center flex flex-col items-center gap-3 bg-white shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-[#f3f4f6] border border-[#e5e7eb]" />
                <p className="text-sm font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section id="resource-hub" className="bg-white text-[#0B1220] py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-[#7a7a7a]">Resources</p>
              <h2 className="text-3xl font-semibold hero-text">Event resources & past highlights</h2>
              <p className="text-[#4b5563] mt-2">
                Browse past events, static recaps, and blog posts while all live flows happen in the app.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] px-4 py-2 rounded-full border border-[#0B1220]/15 hover:bg-[#0B1220]/5 transition"
            >
              View press & media kit
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statics.events.map((evt) => (
              <div
                key={evt.title}
                className={`rounded-2xl p-5 text-white bg-gradient-to-br ${evt.tone} shadow-xl shadow-black/10`}
              >
                <div className="text-xs uppercase tracking-[0.15em] text-white/70">{evt.tag}</div>
                <h3 className="text-xl font-semibold mt-2 hero-text">{evt.title}</h3>
                <p className="text-sm text-white/80 mt-2">{evt.blurb}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/80">
                  <ArrowRight size={16} />
                  <span>View recap</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-[#0B1220] py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="flex flex-col gap-2">
            <p className="uppercase tracking-[0.2em] text-xs text-[#7a7a7a]">Agenda Preview</p>
            <h2 className="text-3xl font-semibold hero-text">Itinerary snapshot</h2>
            <p className="text-[#4b5563]">
              A PSC-inspired grid: time blocks across stages. Full, live schedule lives in the app.
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] border border-dashed border-[#d1d5db] rounded-3xl bg-white">
              <div className="grid grid-cols-3 border-b border-dashed border-[#d1d5db] text-xs uppercase tracking-[0.15em] text-[#6b7280]">
                <div className="px-4 py-3">Main Stage</div>
                <div className="px-4 py-3 border-l border-r border-dashed border-[#d1d5db]">Demo Room</div>
                <div className="px-4 py-3">Round Table</div>
              </div>
              <div className="grid grid-cols-3">
                {statics.agenda.map((item, idx) => (
                  <div
                    key={`${item.time}-${idx}`}
                    className={`px-4 py-5 border-b border-dashed border-[#d1d5db] ${
                      idx % 3 === 1 ? 'border-l border-r border-dashed border-[#d1d5db]' : ''
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">{item.time}</p>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-[#6b7280] mt-1">{item.room}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 bg-white text-[#0B1220] rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="uppercase tracking-[0.2em] text-xs text-[#6b7280]">Highlights</p>
            <h2 className="text-3xl font-semibold hero-text">Speakers, schedules, and curated content</h2>
            <p className="text-[#4b5563]">
              Get a feel for the experience: curated speaker lineup, day-by-day itineraries, and
              downloadable guides—all housed in the app with notifications and reminders.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="px-3 py-2 rounded-full bg-[#0B1220]/5 border border-[#0B1220]/10 text-sm flex items-center gap-2">
                <Sparkles size={14} /> Speaker lineup preview
              </div>
              <div className="px-3 py-2 rounded-full bg-[#0B1220]/5 border border-[#0B1220]/10 text-sm flex items-center gap-2">
                <CalendarClock size={14} /> Daily agenda
              </div>
              <div className="px-3 py-2 rounded-full bg-[#0B1220]/5 border border-[#0B1220]/10 text-sm flex items-center gap-2">
                <ImageIcon size={14} /> Lookbooks
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 flex-1">
            {['Speaker lineup', 'Day 1: Lagos Summit', 'Day 2: Masterclasses', 'Venue & travel'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#0B1220]/5 border border-[#0B1220]/10 p-4 min-h-[120px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                    <span className="w-2 h-2 rounded-full bg-[#ff7f41]" />
                    {item}
                  </div>
                  <p className="text-[#0B1220] font-semibold">
                    {item.includes('Day') ? 'Agenda preview' : 'Curated content'}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#0f1524] py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-white/60">Insights</p>
              <h2 className="text-3xl font-semibold hero-text">Blog & Static Posts</h2>
              <p className="text-white/70 mt-2">
                Read recaps, announcements, and evergreen guides while live flows move to the app.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              Visit all posts
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {statics.posts.map((post) => (
              <div key={post.title} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-xs uppercase tracking-[0.15em] text-white/60">{post.tag}</div>
                <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                <p className="text-sm text-white/70 mt-2">{post.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-white/80">
                  <ArrowRight size={16} />
                  <span>Read more</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-[#0B1220] py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 md:items-center">
          <div className="flex-1 space-y-4">
            <p className="uppercase tracking-[0.2em] text-xs text-[#7a7a7a]">Community</p>
            <h2 className="text-3xl font-semibold hero-text">Join the Atinuda circle</h2>
            <p className="text-[#4b5563]">
              Tap into announcements, drops, and event updates. Join the WhatsApp community or get
              our newsletter via Flodesk.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#131b2f] transition"
              >
                <MessageCircle size={16} />
                Join WhatsApp community
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0B1220]/15 text-sm font-semibold hover:bg-[#0B1220]/5 transition"
              >
                <Sparkles size={16} />
                Subscribe on Flodesk
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-3xl border border-[#0B1220]/10 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-6 shadow-xl">
              <p className="text-sm text-[#4b5563]">Resource hub</p>
              <h3 className="text-2xl font-semibold mt-2">Everything happens in the app</h3>
              <p className="text-[#4b5563] mt-3">
                Tickets, RSVPs, itineraries, speakers, venue guides, and photos—all from the Atinuda app.
                This site is your static home for recaps, press, and resource links.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#0B1220] font-semibold">
                <ArrowRight size={16} />
                View FAQs & support
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f1524] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-white/60">FAQ</p>
            <h2 className="text-3xl font-semibold hero-text">Answers at a glance</h2>
          </div>
          <div className="space-y-4">
            {statics.faqs.map((faq) => (
              <details
                key={faq.q}
                className="rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-3"
              >
                <summary className="cursor-pointer text-lg font-semibold hero-text list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-sm text-white/60">+</span>
                </summary>
                <p className="text-white/70 mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
