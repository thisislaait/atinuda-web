import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atinuda 7.0 | Tomorrow, Now: The Architecture of Scale',
  description:
    'A leadership conference for Africa’s experience economy. Atinuda 7.0 takes place in Lagos on 6–8 October 2027.',
  openGraph: {
    title: 'Atinuda 7.0 | Tomorrow, Now',
    description: 'The Architecture of Scale. A leadership conference for Africa’s experience economy. Lagos, 6–8 October 2027.',
    images: [{ url: '/assets/images/summit/H1C10404.jpg' }],
  },
};

const BG = '#F4F5F3';
const INK = '#1B1E1C';
const MUTED = '#5A615C';
const IMG = '/assets/images/summit';

const GALLERY = [
  { src: `${IMG}/new-images/IMG_0544L.jpg`, alt: 'Delegates seated together at Atinuda' },
  { src: `${IMG}/ATINUDA%20DAY%203_609.jpg`, alt: 'Delegates at an exhibitor stand' },
  { src: `${IMG}/new-images/IMG_1451L.jpg`, alt: 'Guests in the audience at Atinuda' },
  { src: `${IMG}/H1C10404.jpg`, alt: 'Delegates meeting between sessions' },
];

const PILLARS = [
  {
    name: 'MICE & Business Events',
    line: 'New markets and destination competitiveness.',
    body: 'For the people behind conferences, exhibitions, incentive travel, destinations and convention bureaus, and the markets they are opening across the global events economy.',
  },
  {
    name: 'Creative Industries & Experience Design',
    line: 'Creative excellence and commercial thinking.',
    body: 'For creative directors, designers, producers, florists and experiential agencies building lasting businesses on their ideas and intellectual property.',
  },
  {
    name: 'Social Events, Hospitality & Celebrations',
    line: 'Service excellence and lasting value.',
    body: 'For planners, venues, caterers and luxury providers raising the standard of celebration and hospitality, and the profitability behind it.',
  },
  {
    name: 'Leadership, Enterprise & Investment',
    line: 'Strategies to scale and attract capital.',
    body: 'For founders, executives and investors working on the governance, partnerships and capital that let a business grow and compete abroad.',
  },
  {
    name: 'Technology, Innovation & Sustainability',
    line: 'Future-ready businesses and new efficiencies.',
    body: 'For anyone rethinking how experiences are designed, produced and delivered, from event technology and AI to sustainable production.',
  },
  {
    name: 'Talent, Education & Industry Development',
    line: 'Skills and pathways for the industry’s future.',
    body: 'For educators, associations, mentors and emerging professionals building the skills and standards the industry will rely on.',
  },
];

const WAYS = [
  {
    label: 'Delegates',
    title: 'Attend Atinuda 7.0',
    body: 'Five passes, from selected main-stage sessions to the full programme and the Private Executive Leadership Session.',
    cta: 'Explore the passes',
    href: '/pricing',
    image: `${IMG}/new-images/IMG_0523L.jpg`,
    alt: 'Two delegates laughing together',
  },
  {
    label: 'Sponsors',
    title: 'Sponsor the conference',
    body: 'Bring your brand into the programme and its evenings, alongside the leaders of the sector.',
    cta: 'Enquire',
    href: '/become-a-sponsor',
    image: `${IMG}/ATINUDA%20DAY%202_487.jpg`,
    alt: 'A fragrance bar activation at Atinuda',
  },
  {
    label: 'Partners',
    title: 'Partner with Atinuda',
    body: 'For institutions, associations and media building the sector with us.',
    cta: 'Become a partner',
    href: '/become-a-sponsor',
    image: `${IMG}/RBS13419.jpg`,
    alt: 'Two leaders in conversation',
  },
];

const VOICES = [
  { name: 'Preston Bailey', image: '/assets/images/speaker_section/Preston%20Bailey.jpeg' },
  { name: 'TY Bello', image: '/assets/images/speaker_section/TY%20Bello.png' },
  { name: 'David Stark', image: '/assets/images/speaker_section/David%20Stark.jpg' },
  { name: 'Georgie Ndiranga', image: '/assets/images/speaker_section/Georgie%20Ndiranga.png' },
];

const FOOTER_NAV = [
  { heading: 'Atinuda 7.0', links: [{ name: 'The theme', path: '/#theme' }, { name: 'The programme', path: '/#programme' }, { name: 'Attend', path: '/pricing' }, { name: 'Voices', path: '/speakers' }] },
  { heading: 'Take part', links: [{ name: 'Sponsor', path: '/become-a-sponsor' }, { name: 'Partner', path: '/become-a-sponsor' }, { name: 'The Circle', path: '/membership' }] },
  { heading: 'Atinuda', links: [{ name: 'Our Story', path: '/our-story' }, { name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Spark the Future', path: '/spark-the-future' }, { name: 'Press', path: '/press' }, { name: 'Careers', path: '/careers' }, { name: 'Privacy', path: '/privacy' }] },
];

function Split({ id, label, title, children, link, href, image, alt, reverse }: {
  id?: string; label: string; title: string; children: React.ReactNode; link: string; href: string; image: string; alt: string; reverse?: boolean;
}) {
  return (
    <section id={id} className={`hm-wrap hm-split${reverse ? ' hm-split-rev' : ''}`}>
      <div className="hm-split-img">
        <Image src={image} alt={alt} fill sizes="(max-width: 860px) 100vw, 50vw" className="hm-cover" />
      </div>
      <div className="hm-split-text">
        <p className="hm-label">{label}</p>
        <h2 className="hm-display hm-h2">{title}</h2>
        <p className="hm-body">{children}</p>
        <Link href={href} className="hm-more">{link}<span aria-hidden="true"> ›</span></Link>
      </div>
    </section>
  );
}

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
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.85)' }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 6–8 October 2027</p>
          <h1 className="hm-display hm-hero-title">Tomorrow, Now.</h1>
          <p className="hm-display hm-hero-sub">The Architecture of Scale</p>
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="hm-wrap hm-statement">
        <p className="hm-accent hm-statement-text">
          Atinuda 7.0 is a leadership conference for Africa’s experience economy, bringing the founders, executives and investors who shape how the continent hosts and celebrates to Lagos for three days.
        </p>
        <a href="#theme" className="hm-more">About the theme<span aria-hidden="true"> ›</span></a>
      </section>

      {/* ── Gallery ── */}
      <section className="hm-wrap hm-gallery">
        {GALLERY.map((g) => (
          <div key={g.src} className="hm-gallery-img">
            <Image src={g.src} alt={g.alt} fill sizes="(max-width: 860px) 50vw, 25vw" className="hm-cover" />
          </div>
        ))}
      </section>

      {/* ── Theme ── */}
      <Split
        id="theme"
        label="The 2027 theme"
        title="The Architecture of Scale"
        link="Explore the programme"
        href="#programme"
        image={`${IMG}/new-images/IMG_0964L.jpg`}
        alt="A keynote on the main stage at Atinuda"
      >
        Africa’s experience economy has the talent. It is still building what sits beneath it: financing, routes to market, intellectual property, training and shared standards. Tomorrow, Now brings together the people who can build them, and asks them to begin in Lagos.
      </Split>

      {/* ── Programme ── */}
      <Split
        id="programme"
        label="The programme"
        title="Three days in Lagos"
        link="See what each pass includes"
        href="/pricing"
        image={`${IMG}/ATINUDA%20DAY%203_600.jpg`}
        alt="A workshop session at Atinuda"
        reverse
      >
        Main-stage conversations across six pillars, practical workshops, and smaller sessions in the Roundtable, Future Lab and African Room. Two evenings bring everyone together: the Azizi Welcome Cocktail and the Executive Dinner Gala.
      </Split>

      {/* ── The six pillars ── */}
      <section id="pillars" className="hm-wrap hm-section">
        <p className="hm-label-wrap"><span className="hm-label">The conversations</span></p>
        <h2 className="hm-display hm-h2" style={{ textAlign: 'center', margin: '18px auto 20px' }}>Six pillars</h2>
        <p className="hm-body" style={{ textAlign: 'center', margin: '0 auto 72px' }}>
          The programme is built around six pillars, each a part of the experience economy and the people who lead it.
        </p>
        <div className="hm-pillars">
          {PILLARS.map((p, i) => (
            <article key={p.name}>
              <p className="hm-caps" style={{ color: '#b5622a' }}>{String(i + 1).padStart(2, '0')}</p>
              <p className="hm-caps" style={{ marginTop: '14px', lineHeight: 1.6 }}>{p.name}</p>
              <h3 className="hm-accent" style={{ fontSize: '1.55rem', margin: '14px 0 12px' }}>{p.line}</h3>
              <p className="hm-body">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Ways to take part ── */}
      <section className="hm-wrap hm-section">
        <p className="hm-label-wrap"><span className="hm-label">Take part</span></p>
        <h2 className="hm-display hm-h2" style={{ textAlign: 'center', margin: '18px auto 64px' }}>Your place at Atinuda 7.0</h2>
        <div className="hm-cards">
          {WAYS.map((w) => (
            <article key={w.label}>
              <div className="hm-card-img">
                <Image src={w.image} alt={w.alt} fill sizes="(max-width: 860px) 100vw, 33vw" className="hm-cover" />
              </div>
              <p className="hm-caps" style={{ color: MUTED, marginTop: '24px' }}>{w.label}</p>
              <h3 className="hm-accent" style={{ fontSize: '1.6rem', margin: '10px 0 12px' }}>{w.title}</h3>
              <p className="hm-body">{w.body}</p>
              <Link href={w.href} className="hm-more">{w.cta}<span aria-hidden="true"> ›</span></Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Voices ── */}
      <section className="hm-wrap hm-statement" style={{ paddingTop: 0 }}>
        <p className="hm-label">Voices of past editions</p>
        <p className="hm-accent hm-statement-text" style={{ marginTop: '24px' }}>
          Preston Bailey, David Tutera, David Stark, Marcy Blum and TY Bello are among those who have spoken at Atinuda. The 2027 voices will be announced through the year.
        </p>
        <div className="hm-voices">
          {VOICES.map((v) => (
            <figure key={v.name}>
              <div className="hm-portrait">
                <Image src={v.image} alt={v.name} fill sizes="(max-width: 860px) 50vw, 20vw" className="hm-cover" style={{ objectPosition: 'center top' }} />
              </div>
              <figcaption className="hm-caps" style={{ marginTop: '14px' }}>{v.name}</figcaption>
            </figure>
          ))}
        </div>
        <Link href="/speakers" className="hm-more">All voices<span aria-hidden="true"> ›</span></Link>
      </section>

      {/* ── The Circle ── */}
      <Split
        label="Membership"
        title="The Circle"
        link="Discover the Circle"
        href="/membership"
        image={`${IMG}/dinner.JPG`}
        alt="Guests at the Atinuda dinner"
      >
        Members receive the first invitation to every edition and meet at dinners through the year, so the conversations started in Lagos carry on long after October.
      </Split>

      {/* ── Closing and footer ── */}
      <section className="hm-closing">
        <Image src={`${IMG}/GM5_1315.JPG`} alt="" fill sizes="100vw" className="hm-cover" />
        <div className="hm-shade" style={{ background: 'rgba(15,15,15,0.72)' }} />
        <div className="hm-wrap" style={{ position: 'relative', textAlign: 'center' }}>
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.75)' }}>Atinuda 7.0 &nbsp;·&nbsp; Tomorrow, Now</p>
          <h2 className="hm-display" style={{ color: BG, fontSize: 'clamp(2.8rem, 7vw, 6.4rem)', margin: '24px 0 48px' }}>Lagos, 6–8 October 2027</h2>
          <Link href="/pricing" className="hm-btn">Attend</Link>

          <footer className="hm-footer">
            <Link href="/" aria-label="Atinuda home">
              <Image src="/assets/images/whitelogo.png" alt="Atinuda" width={110} height={34} style={{ objectFit: 'contain' }} />
            </Link>
            <nav className="hm-footer-nav" aria-label="Footer">
              {FOOTER_NAV.map((col) => (
                <div key={col.heading}>
                  <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.5)', marginBottom: '16px' }}>{col.heading}</p>
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
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ color: 'rgba(244,245,243,0.6)', display: 'flex' }}>
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
        .hm-section { padding-top: clamp(96px, 11vw, 160px); padding-bottom: clamp(96px, 11vw, 160px); }
        .hm-caps { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${INK}; margin: 0; }
        .hm-label-wrap { text-align: center; margin: 0; }
        .hm-label { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${INK}; margin: 0; padding-bottom: 4px; border-bottom: 2px solid #b5622a; }
        .hm-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.04; letter-spacing: -0.015em; color: ${INK}; margin: 0; }
        .hm-accent { font-family: 'Orpheus Pro', Georgia, serif; font-weight: 400; line-height: 1.25; color: ${INK}; margin: 0; }
        .hm-h2 { font-size: clamp(2.4rem, 4.6vw, 4rem); margin: 18px 0 24px; }
        .hm-body { font-family: DIN, system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: ${MUTED}; margin: 0; max-width: 44ch; }
        .hm-more { display: inline-block; margin-top: 24px; font-family: DIN, system-ui, sans-serif; font-size: 15px; color: ${INK}; text-decoration: none; }
        .hm-more:hover { text-decoration: underline; text-underline-offset: 4px; }
        .hm-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hm-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 55%, rgba(10,10,10,0.3) 100%); }

        .hm-hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; overflow: hidden; background: #0F0F0F; }
        .hm-hero-inner { position: relative; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(24px, 5vw, 64px) clamp(64px, 10vh, 112px); }
        .hm-hero-title { color: ${BG}; font-size: clamp(3.8rem, 11vw, 10.5rem); line-height: 0.92; letter-spacing: -0.025em; margin-top: 24px; }
        .hm-hero-sub { color: ${BG}; font-size: clamp(1.5rem, 3vw, 2.6rem); margin-top: 14px; }

        .hm-statement { text-align: center; padding-top: clamp(112px, 13vw, 180px); padding-bottom: clamp(80px, 9vw, 120px); }
        .hm-statement-text { font-size: clamp(1.6rem, 2.7vw, 2.5rem); max-width: 30ch; margin: 0 auto; }

        .hm-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(12px, 2vw, 32px); padding-bottom: clamp(96px, 11vw, 160px); }
        .hm-gallery-img { position: relative; aspect-ratio: 1; overflow: hidden; }

        .hm-split { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(32px, 4vw, 64px); align-items: center; padding-top: clamp(48px, 6vw, 80px); padding-bottom: clamp(48px, 6vw, 80px); }
        .hm-split-rev .hm-split-img { order: 2; }
        .hm-split-img { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
        .hm-split-text { padding: 0 clamp(0px, 3vw, 48px); }

        .hm-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(56px, 6vw, 88px) clamp(32px, 4vw, 64px); }
        .hm-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px clamp(20px, 3vw, 40px); }
        .hm-card-img { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }

        .hm-voices { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(12px, 2vw, 32px); margin: 64px 0 8px; text-align: left; }
        .hm-voices figure { margin: 0; }
        .hm-portrait { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: #ECEEED; }

        .hm-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 17px 48px; color: ${INK}; background: ${BG}; border: 1px solid ${BG}; transition: background 0.25s ease, color 0.25s ease; }
        .hm-btn:hover { background: transparent; color: ${BG}; }

        .hm-closing { position: relative; overflow: hidden; margin-top: clamp(64px, 8vw, 120px); padding: clamp(140px, 18vw, 240px) 0 48px; background: #0F0F0F; }
        .hm-footer { margin-top: clamp(140px, 16vw, 220px); padding-top: 56px; display: grid; grid-template-columns: auto 1fr; gap: 48px; text-align: left; }
        .hm-footer-nav { display: flex; justify-content: flex-end; gap: clamp(32px, 6vw, 88px); flex-wrap: wrap; }
        .hm-footer-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .hm-footer-nav a { font-family: DIN, system-ui, sans-serif; font-size: 14px; color: rgba(244,245,243,0.8); text-decoration: none; }
        .hm-footer-nav a:hover { color: ${BG}; }
        .hm-footer-base { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding-top: 24px; }
        .hm-footer-base p { font-family: DIN, system-ui, sans-serif; font-size: 12px; color: rgba(244,245,243,0.55); margin: 0; }

        @media (max-width: 860px) {
          .hm-split { grid-template-columns: 1fr; }
          .hm-split-rev .hm-split-img { order: 0; }
          .hm-split-text { padding: 0; }
          .hm-cards { grid-template-columns: 1fr; }
          .hm-pillars { grid-template-columns: 1fr; gap: 48px; }
          .hm-gallery, .hm-voices { grid-template-columns: repeat(2, 1fr); }
          .hm-footer { grid-template-columns: 1fr; }
          .hm-footer-nav { justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}
