import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

const NAV_COLUMNS = [
  {
    heading: 'The Platform',
    links: [
      { name: 'Our Story', path: '/our-story' },
      { name: 'Local To Global Summit', path: '/local-to-global-summit-2025' },
      { name: 'Elevation Retreat', path: '/' },
      { name: 'Spark the Future', path: '/spark-the-future' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { name: 'Membership', path: '/membership' },
      { name: 'Join the Waitlist', path: '/join-the-waitlist' },
      { name: 'Corporate Responsibility', path: '/corporate-responsibility' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Legal', path: '/legal' },
    ],
  },
];

const SOCIAL = [
  { Icon: Instagram, href: 'https://instagram.com/atinuda_', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/atinuda', label: 'LinkedIn' },
  { Icon: Twitter, href: 'https://twitter.com/atinuda_', label: 'Twitter / X' },
];

const SummitFooter = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0d2010] text-white">

      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/elementthree.png"
          alt=""
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[#0d2010]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">

        {/* ── Top rule + wordmark ─────────────────────────── */}
        <div className="pt-20 pb-16 border-b border-white/10">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/whitelogo.png"
              alt="Atinuda"
              width={140}
              height={44}
              className="object-contain"
            />
          </Link>
        </div>

        {/* ── Nav columns ─────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-12 py-16 border-b border-white/10">
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="nav-text text-[9px] tracking-[0.25em] text-white/30 mb-6 uppercase">
                {col.heading}
              </p>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-white/70 hover:text-white transition-colors text-sm leading-none"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-10">
          <p className="nav-text text-[10px] tracking-[0.15em] text-white/30">
            © {new Date().getFullYear()} ATINUDA. PRODUCED BY OAKEN EVENTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SummitFooter;
