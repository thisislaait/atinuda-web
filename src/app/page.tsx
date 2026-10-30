import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atinuda 7.0 | Tomorrow, Now: The Architecture of Scale',
  description:
    'A leadership conference for Africa’s experience economy. Atinuda 7.0 brings the founders, executives, investors and policymakers building the sector’s architecture to Lagos, 6–8 October 2027.',
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

const CASE = [
  {
    n: 'I',
    title: 'The talent is proven.',
    body: 'Africa’s designers, hoteliers, producers and creative directors already deliver work that holds its own anywhere in the world. Excellence is not the open question.',
  },
  {
    n: 'II',
    title: 'The structures are not.',
    body: 'Capital rarely understands project-led businesses. Standards change from one city to the next. Most work is still won by referral rather than by a reputation that travels.',
  },
  {
    n: 'III',
    title: 'This decade decides which.',
    body: 'The businesses that formalise now will set the terms for everyone who follows them, at home and abroad.',
  },
];

const STRUCTURES = [
  { name: 'Financing structures', body: 'Capital designed for seasonal, project-led businesses: working capital that waits for the client to pay, and investors who know how to value a creative asset.' },
  { name: 'Distribution networks', body: 'Routes to clients that do not depend on who you already know, across cities, borders and the diaspora.' },
  { name: 'Intellectual property frameworks', body: 'Ways for designers, producers and creative directors to own, license and keep earning from what they create.' },
  { name: 'Training pipelines', body: 'A steady supply of skilled people, from the event floor and the hotel kitchen to the executive table.' },
  { name: 'Industry standards', body: 'Shared benchmarks for craft, contracts and service that a client can trust in Lagos, Accra or Nairobi.' },
];

const PROGRAMME = [
  { name: 'The main stage', body: 'Keynotes and conversations with the founders, executives and investors shaping the sector, across the six themes of the year.' },
  { name: 'Workshops and breakouts', body: 'Expert-led, practical sessions in small groups, built to be used the week you return.' },
  { name: 'The Roundtable, Future Lab and African Room', body: 'Closed, smaller formats where delegates work through the sector’s open questions with their peers.' },
  { name: 'The Azizi Welcome Cocktail', body: 'The first evening, when the community gathers before the programme begins.' },
  { name: 'The Executive Dinner Gala', body: 'An evening of curated dining and live performance that closes the conference.' },
  { name: 'The Private Executive Leadership Session', body: 'A separate, focused session away from the main venue for the most senior delegates.' },
];

const THEMES = [
  { pillar: 'MICE & Business Events', line: 'New markets and destination competitiveness.' },
  { pillar: 'Creative Industries & Experience Design', line: 'Creative excellence and commercial thinking.' },
  { pillar: 'Social Events, Hospitality & Celebrations', line: 'Service excellence and lasting value.' },
  { pillar: 'Leadership, Enterprise & Investment', line: 'Strategies to scale and attract capital.' },
  { pillar: 'Technology, Innovation & Sustainability', line: 'Future-ready businesses and new efficiencies.' },
  { pillar: 'Talent, Education & Industry Development', line: 'Skills and pathways for the industry’s future.' },
];

const PLACES = [
  {
    who: 'Delegates',
    line: 'For founders, executives and creative leaders.',
    body: 'Five passes, from selected main-stage sessions to the full programme with the Executive Dinner Gala and the Private Executive Leadership Session. Every delegate leaves with the relationships and the intelligence to act on what they heard.',
    expect: [
      'Main-stage conversations across the six themes of the year',
      'Practical workshops and curated small-group breakouts',
      'The Roundtable, Future Lab and African Room',
      'The Azizi Welcome Cocktail and the Executive Dinner Gala',
      'The Private Executive Leadership Session, for Amani and Adé guests',
    ],
    cta: 'Explore the passes',
    href: '/pricing',
    image: `${IMG}/new-images/IMG_0523L.jpg`,
    alt: 'Two delegates laughing together at Atinuda, Lagos',
  },
  {
    who: 'Sponsors',
    line: 'For brands that want to stand behind the sector’s growth.',
    body: 'Sponsorship places your brand inside the programme and the evenings, in front of the people who commission, invest in and lead Africa’s experience economy. Every sponsorship is shaped with our team around what you want to achieve.',
    expect: [
      'Presence across the programme, the evenings and the year’s conversation',
      'Association with the 2027 theme and the work it sets out to do',
      'Time with leaders in hospitality, design, events and investment',
      'A partnership shaped with our team around your objectives',
    ],
    cta: 'Enquire about sponsorship',
    href: '/become-a-sponsor',
    image: `${IMG}/ATINUDA%20DAY%202_487.jpg`,
    alt: 'Delegates at a fragrance bar activation at Atinuda',
  },
  {
    who: 'Partners',
    line: 'For institutions, associations, media and public bodies.',
    body: 'The architecture of scale is not built by one organisation. Partners bring their communities and expertise into the programme and help carry its outcomes into the year that follows.',
    expect: [
      'A role in shaping the sessions closest to your work',
      'A place for your members and community at the conference',
      'Recognition alongside the institutions building the sector',
      'A share in carrying the conference’s outcomes into the year ahead',
    ],
    cta: 'Become a partner',
    href: '/become-a-sponsor',
    image: `${IMG}/RBS13419.jpg`,
    alt: 'Two leaders in conversation at Atinuda',
  },
];

const VOICES = [
  { name: 'David Stark', role: 'Founder & Chief Creative Officer, David Stark Design and Production', image: '/assets/images/speaker_section/David%20Stark.jpg' },
  { name: 'TY Bello', role: 'Photographer & Recording Artist', image: '/assets/images/speaker_section/TY%20Bello.png' },
  { name: 'Preston Bailey', role: 'Founder & Creative Director, Preston Bailey Entertainment', image: '/assets/images/speaker_section/Preston%20Bailey.jpeg' },
  { name: 'Georgie Ndiranga', role: 'Business Journalist & Presenter, CNBC Africa', image: '/assets/images/speaker_section/Georgie%20Ndiranga.png' },
];
const MORE_VOICES = ['David Tutera', 'Marcy Blum', 'Lady Denta', 'Dr. Segun Awosanya', 'Simon Alexander Ong', 'Kamil Olufowobi'];

const FOOTER_NAV = [
  { heading: 'Atinuda 7.0', links: [{ name: 'The theme', path: '/#theme' }, { name: 'The programme', path: '/#programme' }, { name: 'Attend', path: '/pricing' }, { name: 'Voices', path: '/speakers' }] },
  { heading: 'Take part', links: [{ name: 'Sponsor', path: '/become-a-sponsor' }, { name: 'Partner', path: '/become-a-sponsor' }, { name: 'The Circle', path: '/membership' }] },
  { heading: 'Atinuda', links: [{ name: 'Our Story', path: '/our-story' }, { name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Spark the Future', path: '/spark-the-future' }, { name: 'Press', path: '/press' }, { name: 'Careers', path: '/careers' }, { name: 'Privacy', path: '/privacy' }] },
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
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.8)' }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 6–8 October 2027</p>
          <h1 className="hm-display hm-hero-title">Tomorrow, Now.</h1>
          <p className="hm-display hm-hero-sub">The Architecture of Scale</p>
          <p className="hm-accent" style={{ color: 'rgba(244,245,243,0.9)', fontSize: 'clamp(1.15rem, 1.6vw, 1.45rem)', maxWidth: '34ch', margin: '28px auto 0' }}>
            A leadership conference for Africa’s experience economy.
          </p>
          <a href="#theme" className="hm-textlink hm-textlink-light" style={{ marginTop: '48px' }}>Discover the theme</a>
        </div>
      </section>

      {/* ── The theme ── */}
      <section id="theme" className="hm-wrap hm-section hm-two">
        <div>
          <p className="hm-caps">The 2027 theme</p>
          <h2 className="hm-display hm-h2" style={{ marginBottom: 0 }}>The Architecture of Scale</h2>
        </div>
        <div className="hm-prose">
          <p>
            Africa’s experience economy has never been short of talent. What it has been short of is the architecture beneath that talent: the financing structures, distribution networks, intellectual property frameworks, training pipelines and industry standards that turn individual brilliance into institutions.
          </p>
          <p>
            Atinuda 7.0 is built around that gap. For three days in Lagos, the leaders already building this architecture meet to measure what is working, name what is missing and commit to what comes next.
          </p>
          <p>
            The sector has spent a decade being told its moment is coming. Tomorrow, Now declines to wait. The financing, standards and markets that will shape African hospitality, design and events in the next decade are being negotiated today, in boardrooms, ministries and studios, and the people in those conversations decide who benefits.
          </p>
          <p className="hm-display hm-pull">
            Tomorrow is not ahead of us. It is built by the decisions leaders make now.
          </p>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="hm-wrap hm-section" style={{ paddingTop: 0 }}>
        <p className="hm-caps">Why it matters</p>
        <div className="hm-grid3" style={{ marginTop: '40px' }}>
          {CASE.map((c) => (
            <div key={c.n} className="hm-col">
              <p className="hm-caps" style={{ color: MUTED }}>{c.n}</p>
              <h3 className="hm-accent" style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2rem)', margin: '18px 0 16px' }}>{c.title}</h3>
              <p className="hm-serif hm-body">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What scale requires ── */}
      <section className="hm-wrap hm-section" style={{ paddingTop: 0 }}>
        <div className="hm-two" style={{ alignItems: 'end', marginBottom: '64px' }}>
          <div>
            <p className="hm-caps">What scale requires</p>
            <h2 className="hm-display hm-h2" style={{ marginBottom: 0 }}>Five structures, built on purpose.</h2>
          </div>
          <p className="hm-serif hm-body" style={{ maxWidth: '46ch' }}>
            Talent becomes an industry when five things exist around it. Each is a thread through the 2027 programme, and each needs the people at Atinuda to build it.
          </p>
        </div>
        <ul className="hm-rows">
          {STRUCTURES.map((st, i) => (
            <li key={st.name}>
              <h3 className="hm-accent"><span className="hm-caps" style={{ color: MUTED, marginRight: '20px', verticalAlign: 'middle' }}>{String(i + 1).padStart(2, '0')}</span>{st.name}</h3>
              <p className="hm-serif hm-body">{st.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Plate ── */}
      <div className="hm-plate">
        <Image src={`${IMG}/H1C10404.jpg`} alt="Delegates meeting between sessions at Atinuda, Lagos" fill sizes="100vw" className="hm-cover" />
      </div>

      {/* ── The programme ── */}
      <section id="programme" className="hm-wrap hm-section">
        <div className="hm-two" style={{ alignItems: 'end', marginBottom: '64px' }}>
          <div>
            <p className="hm-caps">Inside Atinuda 7.0</p>
            <h2 className="hm-display hm-h2" style={{ marginBottom: 0 }}>Three days, by design.</h2>
          </div>
          <p className="hm-serif hm-body" style={{ maxWidth: '46ch' }}>
            Each part of the programme has one job: to move a conversation from what the sector knows to what it will do.
          </p>
        </div>
        <ul className="hm-rows">
          {PROGRAMME.map((p) => (
            <li key={p.name}>
              <h3 className="hm-accent">{p.name}</h3>
              <p className="hm-serif hm-body">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── The six themes ── */}
      <section className="hm-band">
        <div className="hm-wrap hm-section">
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.6)' }}>The conversations</p>
          <h2 className="hm-display hm-h2" style={{ color: BG }}>Six conversations for 2027.</h2>
          <ol className="hm-themes">
            {THEMES.map((t, i) => (
              <li key={t.pillar}>
                <span className="hm-caps" style={{ color: 'rgba(244,245,243,0.5)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="hm-caps" style={{ color: 'rgba(244,245,243,0.85)', letterSpacing: '0.18em' }}>{t.pillar}</span>
                <span className="hm-accent" style={{ color: BG, fontSize: 'clamp(1.3rem, 1.9vw, 1.7rem)' }}>{t.line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Why Lagos ── */}
      <section className="hm-split">
        <div className="hm-split-img">
          <Image src={`${IMG}/dinner.JPG`} alt="Guests at the Atinuda dinner, Lagos" fill sizes="(max-width: 860px) 100vw, 50vw" className="hm-cover" />
        </div>
        <div className="hm-split-text">
          <p className="hm-caps">Why Lagos</p>
          <h2 className="hm-display hm-h2" style={{ marginBottom: '32px' }}>The conversation, inside its market.</h2>
          <div className="hm-prose">
            <p>
              Lagos is where the continent’s appetite for celebration, hospitality and design is most concentrated. New hotels, venues, restaurants and brands open here every season, and the city’s calendar sets the standard much of West Africa follows.
            </p>
            <p>
              Holding Atinuda 7.0 in Lagos puts the people deciding the sector’s future in the city where those decisions play out first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Your place ── */}
      <section className="hm-wrap hm-section">
        <p className="hm-caps">Your place at Atinuda 7.0</p>
        <h2 className="hm-display hm-h2">Three ways to take part.</h2>
        <div className="hm-grid3">
          {PLACES.map((p) => (
            <article key={p.who}>
              <div className="hm-card-img">
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 860px) 100vw, 33vw" className="hm-cover" />
              </div>
              <h3 className="hm-display" style={{ fontSize: 'clamp(2rem, 2.8vw, 2.6rem)', margin: '28px 0 8px' }}>{p.who}</h3>
              <p className="hm-accent" style={{ fontSize: '1.2rem', margin: '0 0 16px' }}>{p.line}</p>
              <p className="hm-serif hm-body">{p.body}</p>
              <p className="hm-caps" style={{ marginTop: '32px', color: MUTED }}>What to look forward to</p>
              <ul className="hm-expect">
                {p.expect.map((e) => <li key={e}>{e}</li>)}
              </ul>
              <Link href={p.href} className="hm-textlink" style={{ marginTop: '28px' }}>{p.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Voices ── */}
      <section className="hm-wrap hm-section" style={{ paddingTop: 0 }}>
        <div className="hm-two" style={{ alignItems: 'end', marginBottom: '56px' }}>
          <div>
            <p className="hm-caps">Voices of past editions</p>
            <h2 className="hm-display hm-h2" style={{ marginBottom: 0 }}>In good company.</h2>
          </div>
          <p className="hm-serif hm-body" style={{ maxWidth: '46ch' }}>
            Atinuda has brought the global first rank of events, design and creative enterprise to Lagos. The 2027 voices will be announced through the year.
          </p>
        </div>
        <div className="hm-grid4">
          {VOICES.map((v) => (
            <figure key={v.name} style={{ margin: 0 }}>
              <div className="hm-portrait">
                <Image src={v.image} alt={v.name} fill sizes="(max-width: 860px) 50vw, 25vw" className="hm-cover" style={{ objectPosition: 'center top' }} />
              </div>
              <figcaption>
                <p className="hm-accent" style={{ fontSize: '1.4rem', marginTop: '18px' }}>{v.name}</p>
                <p className="hm-small">{v.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="hm-accent" style={{ color: MUTED, fontSize: '1.25rem', marginTop: '48px' }}>
          With {MORE_VOICES.join(', ')} and others.
        </p>
        <Link href="/speakers" className="hm-textlink" style={{ marginTop: '24px' }}>All voices</Link>
      </section>

      {/* ── The Circle ── */}
      <section className="hm-wrap hm-section hm-two" style={{ borderTop: '1px solid #DBDFDB' }}>
        <div>
          <p className="hm-caps">Membership</p>
          <h2 className="hm-display hm-h2" style={{ marginBottom: 0 }}>The Circle</h2>
        </div>
        <div className="hm-prose">
          <p>
            Atinuda does not end in October. Members of the Circle receive the first invitation to every edition, meet at member dinners through the year and stay close to the people they met in Lagos.
          </p>
          <Link href="/membership" className="hm-textlink">Discover the Circle</Link>
        </div>
      </section>

      {/* ── Closing and footer ── */}
      <section className="hm-closing">
        <Image src={`${IMG}/GM5_1315.JPG`} alt="" fill sizes="100vw" className="hm-cover" />
        <div className="hm-shade" style={{ background: 'rgba(15,15,15,0.78)' }} />
        <div className="hm-wrap" style={{ position: 'relative', textAlign: 'center' }}>
          <p className="hm-caps" style={{ color: 'rgba(244,245,243,0.65)' }}>Atinuda 7.0 &nbsp;·&nbsp; Tomorrow, Now</p>
          <h2 className="hm-display" style={{ color: BG, fontSize: 'clamp(2.8rem, 7vw, 6.4rem)', margin: '28px 0 52px' }}>Lagos, 6–8 October 2027.</h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pricing" className="hm-btn hm-btn-light">Attend</Link>
            <Link href="/become-a-sponsor" className="hm-btn hm-btn-outline">Partner with Atinuda</Link>
          </div>

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
        .hm-caps { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; color: ${INK}; margin: 0; }
        .hm-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.04; letter-spacing: -0.015em; color: ${INK}; margin: 0; }
        .hm-serif { font-family: DIN, system-ui, sans-serif; font-weight: 400; margin: 0; }
        .hm-accent { font-family: 'Orpheus Pro', Georgia, serif; font-weight: 400; line-height: 1.15; letter-spacing: 0; color: ${INK}; margin: 0; }
        .hm-h2 { font-size: clamp(2.4rem, 5vw, 4.4rem); margin: 22px 0 64px; max-width: 18ch; }
        .hm-body { font-size: 17px; line-height: 1.65; color: ${MUTED}; }
        .hm-small { font-family: DIN, system-ui, sans-serif; font-size: 13px; line-height: 1.55; color: ${MUTED}; margin: 6px 0 0; }
        .hm-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hm-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.45) 100%); }

        .hm-hero { position: relative; min-height: 100svh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #0F0F0F; text-align: center; }
        .hm-hero-inner { position: relative; padding: 120px clamp(24px, 5vw, 64px) 96px; display: flex; flex-direction: column; align-items: center; }
        .hm-hero-title { color: ${BG}; font-size: clamp(3.8rem, 11.5vw, 11rem); line-height: 0.92; letter-spacing: -0.025em; margin-top: 36px; }
        .hm-hero-sub { color: ${BG}; font-size: clamp(1.6rem, 3.4vw, 3rem); margin-top: 18px; opacity: 0.92; }

        .hm-textlink { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: ${INK}; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 6px; transition: opacity 0.25s ease; }
        .hm-textlink:hover { opacity: 0.6; }
        .hm-textlink-light { color: ${BG}; }
        .hm-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; text-decoration: none; padding: 17px 40px; border-radius: 0; transition: background 0.25s ease, color 0.25s ease; }
        .hm-btn-light { color: ${INK}; background: ${BG}; border: 1px solid ${BG}; }
        .hm-btn-light:hover { background: transparent; color: ${BG}; }
        .hm-btn-outline { color: ${BG}; background: transparent; border: 1px solid rgba(244,245,243,0.6); }
        .hm-btn-outline:hover { background: ${BG}; color: ${INK}; }

        .hm-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 48px clamp(40px, 7vw, 120px); align-items: start; }
        .hm-prose p { font-family: DIN, system-ui, sans-serif; font-size: clamp(18px, 1.45vw, 21px); line-height: 1.6; color: #3A403C; margin: 0 0 24px; }
        .hm-prose .hm-pull { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; font-size: clamp(1.7rem, 2.6vw, 2.4rem); line-height: 1.2; color: ${INK}; margin-top: 48px; padding-top: 40px; border-top: 1px solid #DBDFDB; }

        .hm-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 56px clamp(24px, 3vw, 40px); }
        .hm-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px 28px; }
        .hm-col { border-top: 1px solid ${INK}; padding-top: 24px; }
        .hm-plate { position: relative; height: clamp(440px, 82vh, 900px); overflow: hidden; }
        .hm-card-img { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: #ECEEED; }
        .hm-portrait { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: #ECEEED; }

        .hm-rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid ${INK}; }
        .hm-rows li { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 12px clamp(40px, 7vw, 120px); padding: 32px 0; border-bottom: 1px solid #DBDFDB; align-items: baseline; }
        .hm-rows h3 { font-size: clamp(1.45rem, 2vw, 1.85rem); }

        .hm-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 86vh; background: #ECEEED; }
        .hm-split-img { position: relative; min-height: 520px; overflow: hidden; }
        .hm-split-text { display: flex; flex-direction: column; justify-content: center; padding: clamp(64px, 8vw, 120px) clamp(24px, 6vw, 96px); }
        .hm-expect { list-style: none; margin: 14px 0 0; padding: 0; border-top: 1px solid #DBDFDB; }
        .hm-expect li { font-family: DIN, system-ui, sans-serif; font-size: 15px; line-height: 1.5; color: #3A403C; padding: 12px 0; border-bottom: 1px solid #E4E7E4; }
        .hm-band { background: #0F0F0F; }
        .hm-themes { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(244,245,243,0.25); }
        .hm-themes li { display: grid; grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1.3fr); gap: 8px 24px; align-items: baseline; padding: 28px 0; border-bottom: 1px solid rgba(244,245,243,0.12); }

        .hm-closing { position: relative; overflow: hidden; padding: clamp(140px, 18vw, 240px) 0 48px; background: #0F0F0F; }
        .hm-footer { margin-top: clamp(140px, 16vw, 220px); padding-top: 56px; border-top: 1px solid rgba(244,245,243,0.14); display: grid; grid-template-columns: auto 1fr; gap: 48px; text-align: left; }
        .hm-footer-nav { display: flex; justify-content: flex-end; gap: clamp(32px, 6vw, 88px); flex-wrap: wrap; }
        .hm-footer-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .hm-footer-nav a { font-family: DIN, system-ui, sans-serif; font-size: 14px; color: rgba(244,245,243,0.78); text-decoration: none; }
        .hm-footer-nav a:hover { color: ${BG}; }
        .hm-footer-base { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-top: 1px solid rgba(244,245,243,0.1); padding-top: 24px; }
        .hm-footer-base p { font-family: DIN, system-ui, sans-serif; font-size: 12px; color: rgba(244,245,243,0.5); margin: 0; }

        @media (max-width: 860px) {
          .hm-two, .hm-rows li, .hm-split { grid-template-columns: 1fr; }
          .hm-split-img { min-height: 0; aspect-ratio: 4 / 3; }
          .hm-grid3 { grid-template-columns: 1fr; }
          .hm-grid4 { grid-template-columns: repeat(2, 1fr); }
          .hm-themes li { grid-template-columns: 40px 1fr; }
          .hm-themes li > :last-child { grid-column: 2; }
          .hm-footer { grid-template-columns: 1fr; }
          .hm-footer-nav { justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}
