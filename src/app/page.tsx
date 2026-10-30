import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atinuda | Africa’s experiential economy',
  description:
    'Atinuda is the community of design founders, hospitality executives, creative directors and sector investors who shape how the continent hosts and celebrates. Atinuda 7.0, Lagos, 6–8 October 2027.',
  openGraph: {
    title: 'Atinuda',
    description: 'Among the people building Africa’s experiential economy. Atinuda 7.0, Lagos, 6–8 October 2027.',
    images: [{ url: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_674.JPG' }],
  },
};

const BG = '#F4F5F3';
const INK = '#1B1E1C';
const MUTED = '#5A615C';
const DEEP = '#0d2010';
const COPPER = '#b5622a';

const MEMBERS = [
  { title: 'Design founders', body: 'Designers and founders building Pan-African labels, studios and retail ecosystems.' },
  { title: 'Hospitality executives', body: 'Operators scaling hotels, restaurants and experience venues across African cities and diaspora markets.' },
  { title: 'Creative directors', body: 'Producers and experience designers behind the continent’s most influential gatherings and cultural productions.' },
  { title: 'Sector investors', body: 'Fund managers and investors deploying capital into Africa’s creative and experiential sectors.' },
];

const VOICES = [
  { name: 'David Stark', role: 'Founder & Chief Creative Officer, David Stark Design and Production', image: '/assets/images/speaker_section/David%20Stark.jpg' },
  { name: 'TY Bello', role: 'Photographer & Recording Artist', image: '/assets/images/speaker_section/TY%20Bello.png' },
  { name: 'Preston Bailey', role: 'Founder & Creative Director, Preston Bailey Entertainment', image: '/assets/images/speaker_section/Preston%20Bailey.jpeg' },
  { name: 'Georgie Ndiranga', role: 'Business Journalist & Presenter, CNBC Africa', image: '/assets/images/speaker_section/Georgie%20Ndiranga.png' },
];

const CONVERSATIONS = [
  { pillar: 'MICE & Business Events', line: 'New markets and destination competitiveness.' },
  { pillar: 'Creative Industries & Experience Design', line: 'Creative excellence and commercial thinking.' },
  { pillar: 'Social Events, Hospitality & Celebrations', line: 'Service excellence and lasting value.' },
  { pillar: 'Leadership, Enterprise & Investment', line: 'Strategies to scale and attract capital.' },
  { pillar: 'Technology, Innovation & Sustainability', line: 'Future-ready businesses and new efficiencies.' },
  { pillar: 'Talent, Education & Industry Development', line: 'Skills and pathways for the industry’s future.' },
];

const EDITIONS = [
  { name: 'Local to Global Summit', meta: 'Lagos · 2025', href: '/local-to-global-summit-2025', image: '/assets/images/summit/new-images/IMG_1451L.jpg' },
  { name: 'The Elevation Retreat', meta: 'Mauritius · 2026', href: '/elevation-2026', image: '/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_31.JPG' },
  { name: 'Spark the Future', meta: 'Pitch programme', href: '/spark-the-future', image: '/assets/images/summit/new-images/ATINUDA%20DAY%203_355.jpg' },
];

const FOOTER_NAV = [
  { heading: 'Atinuda', links: [{ name: 'Our Story', path: '/our-story' }, { name: 'The Circle', path: '/membership' }, { name: 'Attend', path: '/pricing' }] },
  { heading: 'Editions', links: [{ name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Elevation 2026', path: '/elevation-2026' }, { name: 'Spark the Future', path: '/spark-the-future' }] },
  { heading: 'Company', links: [{ name: 'Partner with us', path: '/become-a-sponsor' }, { name: 'Press', path: '/press' }, { name: 'Careers', path: '/careers' }, { name: 'Privacy', path: '/privacy' }] },
];

export default function HomePage() {
  return (
    <div style={{ background: BG }}>

      {/* ── Hero ── */}
      <section className="hm-hero">
        <video className="hm-cover" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="https://res.cloudinary.com/p7gsmhew/video/upload/v1792169053/hero-video-hq.mp4" type="video/mp4" />
          <source src="/assets/motion/hero-video-new.mp4" type="video/mp4" />
        </video>
        <div className="hm-shade" />
        <div className="hm-hero-inner">
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.75)' }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 6–8 October 2027</p>
          <h1 className="hm-display" style={{ color: BG, fontSize: 'clamp(2.6rem, 6vw, 5.6rem)', maxWidth: '15ch', margin: '28px 0 44px' }}>
            Among the people building Africa’s experiential economy.
          </h1>
          <a href="#atinuda-7" className="hm-btn hm-btn-light">Discover Atinuda 7.0</a>
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="hm-wrap hm-statement">
        <p className="hm-lede">
          Atinuda is the community of design founders, hospitality executives, creative directors and sector investors who shape how the continent hosts and celebrates. Each October its members gather in Lagos for three days, and leave with the relationships, intelligence and introductions that carry them through the year.
        </p>
        <p className="hm-display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)', color: INK, maxWidth: '22ch', margin: '72px auto 0' }}>
          To belong to Atinuda is to be known by the people whose decisions move this sector.
        </p>
      </section>

      {/* ── Image ── */}
      <div className="hm-plate">
        <Image src="/assets/images/Retreat/Creativity/ATINUDA6_DAY5_674.JPG" alt="Two delegates embracing at the Elevation Retreat, Mauritius" fill sizes="100vw" className="hm-cover" style={{ objectPosition: 'center 35%' }} />
      </div>

      {/* ── Who belongs ── */}
      <section className="hm-wrap hm-section">
        <p className="hm-caps" style={{ color: COPPER }}>Who belongs</p>
        <h2 className="hm-display hm-h2">Four disciplines, one community.</h2>
        <div className="hm-grid4 hm-members">
          {MEMBERS.map((m) => (
            <div key={m.title} className="hm-col">
              <h3 className="hm-display" style={{ fontSize: '1.6rem', color: INK, marginBottom: '14px' }}>{m.title}</h3>
              <p className="hm-body">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Voices ── */}
      <section className="hm-wrap hm-section" style={{ paddingTop: 0 }}>
        <div className="hm-head-row">
          <div>
            <p className="hm-caps" style={{ color: COPPER }}>Voices of past editions</p>
            <h2 className="hm-display hm-h2">The company you keep.</h2>
          </div>
          <Link href="/speakers" className="hm-link">All voices</Link>
        </div>
        <div className="hm-grid4">
          {VOICES.map((v) => (
            <figure key={v.name} style={{ margin: 0 }}>
              <div className="hm-portrait">
                <Image src={v.image} alt={v.name} fill sizes="(max-width: 760px) 50vw, 25vw" className="hm-cover" style={{ objectPosition: 'center top' }} />
              </div>
              <figcaption>
                <p className="hm-display" style={{ fontSize: '1.35rem', color: INK, marginTop: '18px' }}>{v.name}</p>
                <p className="hm-small">{v.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Atinuda 7.0 ── */}
      <section id="atinuda-7" className="hm-split">
        <div className="hm-split-img">
          <Image src="/assets/images/summit/new-images/IMG_0523L.jpg" alt="Delegates in conversation at Atinuda, Lagos" fill sizes="(max-width: 900px) 100vw, 50vw" className="hm-cover" />
        </div>
        <div className="hm-split-text">
          <p className="hm-caps" style={{ color: COPPER }}>Atinuda 7.0 &nbsp;·&nbsp; 6–8 October 2027 &nbsp;·&nbsp; Lagos</p>
          <h2 className="hm-display hm-h2">The Architecture of Scale.</h2>
          <p className="hm-body" style={{ fontSize: '16px', maxWidth: '460px' }}>
            Africa’s creative sector has never lacked talent. What it has lacked is the architecture beneath it: the financing structures, distribution networks, IP frameworks and industry standards that turn individual brilliance into sector strength.
          </p>
          <p className="hm-body" style={{ fontSize: '16px', maxWidth: '460px', marginTop: '18px' }}>
            Atinuda 7.0 gathers the people building that architecture for three days of closed roundtables, private dinners and capital conversations.
          </p>
          <Link href="/pricing" className="hm-btn hm-btn-dark" style={{ marginTop: '40px' }}>Attend Atinuda 7.0</Link>
        </div>
      </section>

      {/* ── Conversations ── */}
      <section className="hm-wrap hm-section">
        <p className="hm-caps" style={{ color: COPPER }}>The conversations</p>
        <h2 className="hm-display hm-h2">What the community is working on.</h2>
        <ol className="hm-list">
          {CONVERSATIONS.map((c, i) => (
            <li key={c.pillar}>
              <span className="hm-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="hm-pillar">{c.pillar}</span>
              <span className="hm-display hm-line">{c.line}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The Circle ── */}
      <section className="hm-split hm-split-rev" style={{ background: DEEP }}>
        <div className="hm-split-img">
          <Image src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_35.JPG" alt="Members walking together at the Elevation Retreat" fill sizes="(max-width: 900px) 100vw, 50vw" className="hm-cover" />
        </div>
        <div className="hm-split-text">
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.6)' }}>Membership</p>
          <h2 className="hm-display hm-h2" style={{ color: BG }}>The Circle.</h2>
          <p className="hm-body" style={{ fontSize: '16px', maxWidth: '440px', color: 'rgba(244,245,243,0.78)' }}>
            Membership is how Atinuda continues between editions: the first invitation to every gathering, member dinners in Lagos, London and Accra, and year-round access to the people you met there.
          </p>
          <Link href="/membership" className="hm-btn hm-btn-light" style={{ marginTop: '40px' }}>Enter the Circle</Link>
        </div>
      </section>

      {/* ── Editions ── */}
      <section className="hm-wrap hm-section">
        <p className="hm-caps" style={{ color: COPPER }}>Editions</p>
        <h2 className="hm-display hm-h2">Where Atinuda has gathered.</h2>
        <div className="hm-grid3">
          {EDITIONS.map((e) => (
            <Link key={e.name} href={e.href} className="hm-edition">
              <div className="hm-edition-img">
                <Image src={e.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className="hm-cover" />
              </div>
              <p className="hm-display" style={{ fontSize: '1.45rem', color: INK, marginTop: '20px' }}>{e.name}</p>
              <p className="hm-small">{e.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Closing and footer ── */}
      <section className="hm-closing">
        <Image src="/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_60.JPG" alt="" fill sizes="100vw" className="hm-cover" />
        <div className="hm-shade" style={{ background: 'rgba(13,32,16,0.82)' }} />
        <div className="hm-wrap" style={{ position: 'relative', textAlign: 'center' }}>
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.6)' }}>Atinuda 7.0</p>
          <h2 className="hm-display" style={{ color: BG, fontSize: 'clamp(2.8rem, 7vw, 6.4rem)', margin: '28px 0 48px' }}>Lagos, October 2027.</h2>
          <Link href="/pricing" className="hm-btn hm-btn-light">Attend</Link>

          <footer className="hm-footer">
            <Link href="/" aria-label="Atinuda home">
              <Image src="/assets/images/whitelogo.png" alt="Atinuda" width={110} height={34} style={{ objectFit: 'contain' }} />
            </Link>
            <nav className="hm-footer-nav" aria-label="Footer">
              {FOOTER_NAV.map((col) => (
                <div key={col.heading}>
                  <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.45)', marginBottom: '16px' }}>{col.heading}</p>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.name}><Link href={l.path}>{l.name}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="hm-footer-base">
              <p>© {new Date().getFullYear()} Atinuda. Produced by Oaken Events.</p>
              <div style={{ display: 'flex', gap: '18px' }}>
                {[
                  { href: 'https://instagram.com/atinuda_', Icon: Instagram, label: 'Instagram' },
                  { href: 'https://linkedin.com/company/atinuda', Icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://twitter.com/atinuda_', Icon: Twitter, label: 'Twitter' },
                ].map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ color: 'rgba(244,245,243,0.55)', display: 'flex' }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </section>

      <style>{`
        .hm-wrap { max-width: 1280px; margin: 0 auto; padding-left: clamp(24px, 5vw, 64px); padding-right: clamp(24px, 5vw, 64px); }
        .hm-section { padding-top: clamp(96px, 12vw, 168px); padding-bottom: clamp(96px, 12vw, 168px); }
        .hm-caps { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; margin: 0; }
        .hm-display { font-family: SaolDisplay, Georgia, serif; font-weight: 400; line-height: 1.08; letter-spacing: -0.01em; margin: 0; }
        .hm-h2 { font-size: clamp(2.2rem, 4.4vw, 3.8rem); color: ${INK}; margin: 22px 0 56px; max-width: 20ch; }
        .hm-body { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 15px; line-height: 1.7; color: ${MUTED}; margin: 0; }
        .hm-small { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 13px; line-height: 1.55; color: ${MUTED}; margin: 6px 0 0; }
        .hm-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hm-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,14,12,0.72) 0%, rgba(10,14,12,0.25) 55%, rgba(10,14,12,0.35) 100%); }

        .hm-hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; overflow: hidden; background: #0F0F0F; }
        .hm-hero-inner { position: relative; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(24px, 5vw, 64px) clamp(72px, 10vh, 120px); }

        .hm-btn { display: inline-block; font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; text-decoration: none; padding: 17px 40px; border-radius: 0; transition: opacity 0.25s ease, background 0.25s ease, color 0.25s ease; }
        .hm-btn-light { color: ${INK}; background: ${BG}; border: 1px solid ${BG}; }
        .hm-btn-light:hover { background: transparent; color: ${BG}; }
        .hm-btn-dark { color: ${BG}; background: ${INK}; border: 1px solid ${INK}; }
        .hm-btn-dark:hover { background: transparent; color: ${INK}; }
        .hm-link { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${INK}; text-decoration: none; border-bottom: 1px solid ${INK}; padding-bottom: 4px; white-space: nowrap; }

        .hm-statement { text-align: center; padding-top: clamp(112px, 14vw, 200px); padding-bottom: clamp(112px, 14vw, 200px); }
        .hm-lede { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: clamp(17px, 1.5vw, 20px); line-height: 1.75; color: #3A403C; max-width: 680px; margin: 0 auto; }

        .hm-plate { position: relative; height: clamp(420px, 78vh, 860px); overflow: hidden; }

        .hm-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px 32px; }
        .hm-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 32px; }
        .hm-col { border-top: 1px solid #DBDFDB; padding-top: 28px; }
        .hm-head-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
        .hm-portrait { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: #ECEEED; filter: grayscale(0.15); }

        .hm-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 88vh; background: ${BG}; }
        .hm-split-rev .hm-split-img { order: 2; }
        .hm-split-img { position: relative; min-height: 520px; overflow: hidden; }
        .hm-split-text { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(64px, 8vw, 120px) clamp(24px, 6vw, 96px); }
        .hm-split-text .hm-h2 { margin-bottom: 32px; }

        .hm-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid #DBDFDB; }
        .hm-list li { display: grid; grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1.2fr); gap: 24px; align-items: baseline; padding: 28px 0; border-bottom: 1px solid #E4E7E4; }
        .hm-num { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.2em; color: ${COPPER}; }
        .hm-pillar { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 15px; font-weight: 600; color: ${INK}; }
        .hm-line { font-size: clamp(1.25rem, 1.8vw, 1.6rem); color: #3A403C; }

        .hm-edition { text-decoration: none; display: block; }
        .hm-edition-img { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: #ECEEED; }
        .hm-edition-img img { transition: transform 1.2s ease; }
        .hm-edition:hover .hm-edition-img img { transform: scale(1.03); }

        .hm-closing { position: relative; overflow: hidden; padding: clamp(120px, 16vw, 220px) 0 48px; }
        .hm-footer { margin-top: clamp(120px, 14vw, 200px); padding-top: 56px; border-top: 1px solid rgba(244,245,243,0.14); display: grid; grid-template-columns: auto 1fr; gap: 48px; text-align: left; }
        .hm-footer-nav { display: flex; justify-content: flex-end; gap: clamp(32px, 6vw, 88px); flex-wrap: wrap; }
        .hm-footer-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .hm-footer-nav a { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 14px; color: rgba(244,245,243,0.78); text-decoration: none; }
        .hm-footer-nav a:hover { color: ${BG}; }
        .hm-footer-base { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-top: 1px solid rgba(244,245,243,0.1); padding-top: 24px; }
        .hm-footer-base p { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 12px; color: rgba(244,245,243,0.5); margin: 0; }

        @media (max-width: 900px) {
          .hm-split { grid-template-columns: 1fr; min-height: 0; }
          .hm-split-rev .hm-split-img { order: 0; }
          .hm-split-img { min-height: 0; aspect-ratio: 4 / 3; }
          .hm-grid4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .hm-grid3 { grid-template-columns: 1fr; }
          .hm-list li { grid-template-columns: 40px 1fr; gap: 6px 16px; }
          .hm-list .hm-line { grid-column: 2; }
          .hm-head-row { flex-direction: column; align-items: flex-start; }
          .hm-head-row .hm-link { margin: -32px 0 40px; }
          .hm-footer { grid-template-columns: 1fr; }
          .hm-footer-nav { justify-content: flex-start; }
        }
        @media (max-width: 520px) {
          .hm-grid4.hm-members { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hm-edition-img img { transition: none; }
        }
      `}</style>
    </div>
  );
}
