'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Site-wide footer for every page except the home page, which closes with its own section.
// Matches the home page footer: dark neutral, DIN, the same three link columns.

const LIGHT = '#F4F5F3';

const NAV_COLUMNS = [
  { heading: 'Atinuda 7.0', links: [{ name: 'The theme', path: '/#theme' }, { name: 'The pillars', path: '/#pillars' }, { name: 'Attend', path: '/pricing' }, { name: 'Voices', path: '/speakers' }] },
  { heading: 'Take part', links: [{ name: 'Sponsor', path: '/become-a-sponsor' }, { name: 'Partner', path: '/become-a-sponsor' }, { name: 'The Circle', path: '/membership' }] },
  { heading: 'Atinuda', links: [{ name: 'Our Story', path: '/our-story' }, { name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Spark the Future', path: '/spark-the-future' }, { name: 'Press', path: '/press' }, { name: 'Careers', path: '/careers' }, { name: 'Privacy', path: '/privacy' }] },
];

const SOCIAL = [
  { Icon: Instagram, href: 'https://instagram.com/atinuda_', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/atinuda', label: 'LinkedIn' },
  { Icon: Twitter, href: 'https://twitter.com/atinuda_', label: 'Twitter / X' },
];

const SummitFooter = () => {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="sf">
      <div className="sf-inner">
        <div className="sf-top">
          <Link href="/" aria-label="Atinuda home">
            <Image src="/assets/images/whitelogo.png" alt="Atinuda" width={110} height={34} style={{ objectFit: 'contain' }} />
          </Link>
          <nav className="sf-nav" aria-label="Footer">
            {NAV_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="sf-caps">{col.heading}</p>
                <ul>
                  {col.links.map((l) => <li key={l.name}><Link href={l.path}>{l.name}</Link></li>)}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="sf-base">
          <p>© {new Date().getFullYear()} Atinuda. Produced by Oaken Events.</p>
          <div style={{ display: 'flex', gap: '18px' }}>
            {SOCIAL.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .sf { background: #0F0F0F; color: ${LIGHT}; }
        .sf-inner { max-width: 1280px; margin: 0 auto; padding: clamp(80px, 10vw, 128px) clamp(24px, 5vw, 64px) 40px; }
        .sf-top { display: grid; grid-template-columns: auto 1fr; gap: 48px; }
        .sf-nav { display: flex; justify-content: flex-end; gap: clamp(32px, 6vw, 88px); flex-wrap: wrap; }
        .sf-caps { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.5); margin: 0 0 16px; }
        .sf-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .sf-nav a { font-family: DIN, system-ui, sans-serif; font-size: 14px; color: rgba(244,245,243,0.8); text-decoration: none; }
        .sf-nav a:hover { color: ${LIGHT}; }
        .sf-base { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-top: clamp(64px, 8vw, 96px); padding-top: 24px; border-top: 1px solid rgba(244,245,243,0.12); }
        .sf-base p { font-family: DIN, system-ui, sans-serif; font-size: 12px; color: rgba(244,245,243,0.55); margin: 0; }
        .sf-base a { color: rgba(244,245,243,0.6); display: flex; }
        .sf-base a:hover { color: ${LIGHT}; }
        @media (max-width: 760px) {
          .sf-top { grid-template-columns: 1fr; }
          .sf-nav { justify-content: flex-start; }
        }
      `}</style>
    </footer>
  );
};

export default SummitFooter;
