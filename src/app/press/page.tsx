import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press & Media',
  description:
    'Press coverage, brand assets, and media enquiries for Atinuda — Africa\'s premier leadership and creative excellence platform. Contact press@atinuda.com.',
  openGraph: { title: 'Press & Media | Atinuda', description: 'Press coverage and media resources for Atinuda.' },
};

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const COVERAGE = [
  {
    publication: 'BellaNaija',
    category: 'Feature',
    title: 'Atinuda Evolves Into A Global Leadership Retreat: Mauritius Is the Chosen Destination For 2026',
    date: 'January 2026',
    href: 'https://www.bellanaija.com/2026/01/atinuda6-0-mauritius-retreat/',
  },
  {
    publication: 'BellaNaija',
    category: 'Feature',
    title: "Atinuda 5.0: A Celebration of Africa's Creative Transformation",
    date: 'January 2026',
    href: 'https://www.bellanaija.com/2026/01/the-atinuda-experience/',
  },
  {
    publication: 'ThisDay Live',
    category: 'Feature',
    title: "Atinuda 5.0: The Summit Powering Africa's Global Creative Ascent",
    date: 'October 2025',
    href: 'https://www.thisdaylive.com/2025/10/17/atinuda-5-0-the-summit-powering-africas-global-creative-ascent/',
  },
  {
    publication: 'ThisDay Live',
    category: 'Preview',
    title: "Atinuda 5.0 Summit to Spotlight Africa's Creative Transformation in Lagos",
    date: 'October 2025',
    href: 'https://www.thisdaylive.com/2025/10/07/atinuda-5-0-summit-to-spotlight-africas-creative-transformation-in-lagos/',
  },
  {
    publication: 'BellaNaija',
    category: 'News',
    title: 'Konga CEO Urges Nigerian Entrepreneurs to Think Global at Atinuda 5.0',
    date: 'October 2025',
    href: 'https://www.bellanaija.com/2025/10/konga-ceo-entrepreneurs-atinuda/',
  },
  {
    publication: 'Independent Nigeria',
    category: 'Feature',
    title: 'ATINUDA Set To Celebrate 5th Anniversary, Urges Africans To Turn Creative Ideas Into Global Brands',
    date: 'October 2025',
    href: 'https://independent.ng/atinuda-set-to-celebrate-5th-anniversary-urges-africans-to-turn-creative-ideas-into-global-brands/',
  },
  {
    publication: 'See Mauritius',
    category: 'Partnership',
    title: 'Mauritius Hosts ATINUDA 2026: A Week of Luxury, Learning and Connection',
    date: 'March 2026',
    href: 'https://www.facebook.com/SeeMauritius/posts/mauritius-hosts-atinuda-2026-this-week-atinuda-is-week-of-luxury-learning-and-con/1400450628778762/',
  },
  {
    publication: 'BellaNaija',
    category: 'Profile',
    title: 'Oaken Event presents Atinuda 2: All You Need to Know about the 5-Star Event Conference',
    date: 'June 2017',
    href: 'https://www.bellanaija.com/2017/06/oaken-events-presents-atinuda-2-get-breakdown-3-part-experience-conference-attendants-gorgeous-speakers/',
  },
];

const BOILERPLATE = `Atinuda is a pan-African leadership and creative excellence platform founded in 2015. Through its annual Summit and Elevation programme, Atinuda brings together Africa's most prominent founders, executives, and cultural leaders for high-standard programming, peer access, and events that hold their standard edition after edition. Now in its sixth edition, the 2026 Elevation gathered an invitation-only cohort of leaders from across the continent and diaspora for seven days of keynotes, workshops, and programming in Mauritius. Atinuda is produced by Oaken Events and headquartered in Lagos, Nigeria.`;

export default function PressPage() {
  return (
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 pt-32 pb-16 border-b border-[#e8e2da]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-4">PRESS & MEDIA</p>
            <h1 style={serifDisplay} className="text-5xl md:text-6xl lg:text-7xl leading-tight">
              In the press.
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-[#4a4a4a] text-sm leading-relaxed mb-4">
              For media enquiries, interview requests, or press access to an Atinuda event, contact our communications team.
            </p>
            <a
              href="mailto:press@atinuda.com"
              className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1a1a1a] pb-0.5 hover:text-[#4a4a4a] hover:border-[#4a4a4a] transition-colors"
            >
              press@atinuda.com
            </a>
          </div>
        </div>
      </section>

      {/* ── COVERAGE LIST ────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-10">SELECTED COVERAGE</p>
          <div className="divide-y divide-[#e8e2da]">
            {COVERAGE.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-start gap-4 py-7 hover:bg-[#f0ebe4] -mx-4 px-4 transition-colors rounded-lg"
              >
                <div className="flex-none sm:w-48">
                  <p className="nav-text text-[10px] tracking-[0.15em] text-[#4a4a4a] font-medium">{item.publication}</p>
                  <p className="text-xs text-[#aaa] mt-1">{item.date}</p>
                </div>
                <div className="flex-1">
                  <span className="inline-block nav-text text-[9px] tracking-[0.15em] text-[#8a7e72] bg-[#e8e2da] px-2 py-0.5 rounded mb-3">
                    {item.category}
                  </span>
                  <p className="text-lg md:text-xl leading-snug group-hover:text-[#0d2010] transition-colors">
                    {item.title}
                  </p>
                </div>
                <div className="flex-none self-center pt-6 sm:pt-0">
                  <ExternalLink size={14} className="text-[#ccc] group-hover:text-[#0d2010] transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOILERPLATE ──────────────────────────────────────────────── */}
      <section className="bg-[#0d2010] text-white px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-6">FOR EDITORIAL USE</p>
            <h2 style={serif} className="text-3xl md:text-4xl mb-6 leading-tight">About Atinuda</h2>
            <p className="text-white/70 text-sm leading-relaxed">{BOILERPLATE}</p>
          </div>
          <div className="space-y-10">
            <div>
              <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-5">QUICK FACTS</p>
              <dl className="space-y-3 text-sm">
                {[
                  ['Founded', '2015'],
                  ['Headquarters', 'Lagos, Nigeria'],
                  ['Current edition', 'Elevation Retreat 6.0 — Mauritius, March 2026'],
                  ['Format', 'Invitation-only 7-day retreat + annual summit'],
                  ['Alumni community', '300+ leaders across Africa and diaspora'],
                  ['Produced by', 'Oaken Events'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="text-white/40 w-36 flex-none">{label}</dt>
                    <dd className="text-white/80">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="nav-text text-[10px] tracking-[0.2em] text-white/40 mb-4">MEDIA CONTACT</p>
              <p className="text-sm text-white/60 mb-3">Press enquiries, coverage requests, media accreditation:</p>
              <a href="mailto:press@atinuda.com" className="text-white font-medium hover:text-white/70 transition-colors">
                press@atinuda.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND ASSETS ─────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="nav-text text-[10px] tracking-[0.2em] text-[#8a7e72] mb-6">BRAND ASSETS</p>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={serif} className="text-3xl md:text-4xl mb-6 leading-tight">
                Logos, images,<br />approved photography.
              </h2>
              <p className="text-[#4a4a4a] leading-relaxed mb-8">
                High-resolution brand assets, approved retreat photography, and speaker headshots are available for editorial use. Please credit all imagery: <em>Photography courtesy of Atinuda / Oaken Events.</em>
              </p>
              <a
                href="mailto:press@atinuda.com?subject=Brand Assets Request"
                className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors"
              >
                Request press assets
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Logo files', desc: 'SVG + PNG, black & white' },
                { label: 'Retreat photography', desc: 'High-res, licensed for press' },
                { label: 'Speaker headshots', desc: 'All 2026 cohort speakers' },
              ].map((asset) => (
                <div key={asset.label} className="bg-[#f0ebe4] rounded-2xl p-6 text-center">
                  <div className="w-8 h-8 bg-[#0d2010] rounded-full mx-auto mb-4" />
                  <p className="text-xs font-medium mb-1 leading-tight">{asset.label}</p>
                  <p className="text-[10px] text-[#8a7e72] leading-tight">{asset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
