import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { FilmPlate } from '@/components/home/FilmPlate';
import { InterestForm } from '@/components/home/InterestForm';

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

const PILLARS = [
  { name: 'MICE & Business Events', line: 'New markets and destination competitiveness.' },
  { name: 'Creative Industries & Experience Design', line: 'Creative excellence and commercial thinking.' },
  { name: 'Social Events, Hospitality & Celebrations', line: 'Service excellence and lasting value.' },
  { name: 'Leadership, Enterprise & Investment', line: 'Strategies to scale and attract capital.' },
  { name: 'Technology, Innovation & Sustainability', line: 'Future-ready businesses and new efficiencies.' },
  { name: 'Talent, Education & Industry Development', line: 'Skills and pathways for the industry’s future.' },
];

// Photographs floating around the pillars, as in a collage. Positions are percentages of the section.
const COLLAGE = [
  { src: `${IMG}/H1C10415.jpg`, style: { left: '0', top: '6%', width: '17%' }, fade: false },
  { src: `${IMG}/GM5_1341.JPG`, style: { right: '4%', top: '2%', width: '14%' }, fade: true },
  { src: `${IMG}/new-images/IMG_7378L.jpg`, style: { right: '0', top: '34%', width: '18%' }, fade: false },
  { src: `${IMG}/ATINUDA%20DAY%202_130.jpg`, style: { left: '6%', top: '52%', width: '14%' }, fade: true },
  { src: `${IMG}/stf.jpg`, style: { left: '0', bottom: '4%', width: '16%' }, fade: false },
  { src: `${IMG}/new-images/IMG_7600L.jpg`, style: { right: '6%', bottom: '2%', width: '15%' }, fade: true },
];

const WAYS = [
  {
    when: '6–8 October 2027',
    tag: 'Delegates',
    title: 'Five passes, from the main stage to the Private Executive Leadership Session',
    body: 'Every pass opens the main-stage programme. Higher passes add the workshops, the Roundtable, Future Lab and African Room, the Executive Dinner Gala and reserved seating.',
    href: '/pricing',
    image: `${IMG}/new-images/IMG_0523L.jpg`,
    alt: 'Two delegates laughing together at Atinuda',
  },
  {
    when: 'Open now',
    tag: 'Sponsors',
    title: 'Bring your brand into the programme and its evenings',
    body: 'Sponsorship places a brand alongside the founders, executives and investors who lead Africa’s experience economy, shaped with our team around what you want to achieve.',
    href: '/become-a-sponsor',
    image: `${IMG}/ATINUDA%20DAY%202_487.jpg`,
    alt: 'A fragrance bar activation at Atinuda',
  },
  {
    when: 'Open now',
    tag: 'Partners',
    title: 'For the institutions, associations and media building the sector',
    body: 'Partners bring their communities and expertise into the programme and help carry its outcomes into the year that follows.',
    href: '/become-a-sponsor',
    image: `${IMG}/RBS13419.jpg`,
    alt: 'Two leaders in conversation at Atinuda',
  },
];

const FOOTER_MAIN = [
  { name: 'Home', path: '/' },
  { name: 'Atinuda 7.0', path: '/#theme' },
  { name: 'Attend', path: '/pricing' },
  { name: 'The Circle', path: '/membership' },
  { name: 'Partner with us', path: '/become-a-sponsor' },
  { name: 'Our Story', path: '/our-story' },
];
const FOOTER_SMALL = [
  [{ name: 'Privacy policy', path: '/privacy' }, { name: 'FAQ', path: '/faq' }, { name: 'Careers', path: '/careers' }],
  [{ name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Spark the Future', path: '/spark-the-future' }, { name: 'Press', path: '/press' }],
];

export default function HomePage() {
  return (
    <div style={{ background: BG }}>

      {/* ── 1. Hero ── */}
      <section className="hm-hero">
        <video className="hm-cover" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="https://res.cloudinary.com/p7gsmhew/video/upload/v1792169053/hero-video-hq.mp4" type="video/mp4" />
          <source src="/assets/motion/hero-video-new.mp4" type="video/mp4" />
        </video>
        <div className="hm-shade" />
        <div className="hm-hero-inner">
          <p className="hm-kicker" style={{ color: BG }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 6–8 October 2027</p>
          <h1 className="hm-display hm-hero-title">Tomorrow, Now.</h1>
          <a href="#theme" className="hm-btn hm-btn-white">Discover the 2027 theme</a>
        </div>
      </section>

      {/* ── 2. The theme, staggered ── */}
      <section id="theme" className="hm-wrap hm-stagger">
        <div className="hm-stagger-text">
          <p className="hm-kicker">The 2027 theme</p>
          <h2 className="hm-display hm-h2">The Architecture of Scale</h2>
          <p className="hm-body">
            Africa’s experience economy has the talent. It is still building what sits beneath it: financing, routes to market, intellectual property, training and shared standards. Atinuda 7.0 brings together the founders, executives and investors who can build them, for three days in Lagos.
          </p>
        </div>
        <figure className="hm-stagger-b">
          <div className="hm-img" style={{ aspectRatio: '3 / 4' }}>
            <Image src={`${IMG}/new-images/IMG_0964L.jpg`} alt="A keynote on the Atinuda main stage" fill sizes="(max-width: 860px) 100vw, 26vw" className="hm-cover" />
          </div>
          <figcaption className="hm-caption">The main stage carries the year’s conversations across six pillars, from MICE and business events to talent and education.</figcaption>
        </figure>
        <figure className="hm-stagger-c">
          <div className="hm-img" style={{ aspectRatio: '4 / 5' }}>
            <Image src={`${IMG}/new-images/ATINUDA%20DAY%203_600.jpg`} alt="A workshop session at Atinuda" fill sizes="(max-width: 860px) 100vw, 34vw" className="hm-cover" />
          </div>
          <figcaption className="hm-caption">Workshops and breakouts are kept small and practical, built to be used the week delegates return.</figcaption>
        </figure>
        <figure className="hm-stagger-d">
          <div className="hm-img" style={{ aspectRatio: '3 / 4' }}>
            <Image src={`${IMG}/new-images/IMG_7378L.jpg`} alt="Executives in conversation at an Atinuda roundtable" fill sizes="(max-width: 860px) 100vw, 42vw" className="hm-cover" />
          </div>
          <figcaption className="hm-caption">The Roundtable, Future Lab and African Room hold closed sessions for senior leaders. The Azizi Welcome Cocktail and the Executive Dinner Gala bring everyone together.</figcaption>
        </figure>
      </section>

      {/* ── 3. Motto and film ── */}
      <section className="hm-motto">
        <h2 className="hm-display hm-motto-title">Tomorrow is built now.</h2>
        <p className="hm-motto-sub">The future of Africa’s experience economy is being decided today, by the people at work on it.</p>
      </section>
      <div className="hm-film">
        <FilmPlate src="/assets/motion/hero-video.mp4" />
      </div>

      {/* ── 4. Six pillars, with a collage ── */}
      <section id="pillars" className="hm-collage">
        {COLLAGE.map((c) => (
          <div key={c.src} className="hm-float" style={{ ...c.style, opacity: c.fade ? 0.45 : 1 }} aria-hidden="true">
            <Image src={c.src} alt="" fill sizes="18vw" className="hm-cover" />
          </div>
        ))}
        <div className="hm-collage-text">
          <p className="hm-kicker">The conversations</p>
          <h2 className="hm-display hm-h2" style={{ margin: '14px 0 20px' }}>Six pillars</h2>
          <p className="hm-body" style={{ margin: '0 auto' }}>
            The programme is built around six pillars, each a part of the experience economy and the people who lead it.
          </p>
          <ul className="hm-pillar-list">
            {PILLARS.map((p) => (
              <li key={p.name}>
                <span className="hm-kicker" style={{ color: MUTED }}>{p.name}</span>
                <span className="hm-accent">{p.line}</span>
              </li>
            ))}
          </ul>
          <Link href="/pricing" className="hm-btn hm-btn-black">Explore the programme</Link>
        </div>
      </section>

      {/* ── 5. The Circle, with an overlapping card ── */}
      <section className="hm-wrap hm-feature">
        <div className="hm-feature-media">
          <div className="hm-img hm-feature-back">
            <Image src={`${IMG}/dinner.JPG`} alt="Guests at the Atinuda dinner" fill sizes="(max-width: 860px) 100vw, 48vw" className="hm-cover" />
          </div>
          <div className="hm-feature-card">
            <div className="hm-img" style={{ aspectRatio: '4 / 5' }}>
              <Image src={`${IMG}/new-images/IMG_7600L.jpg`} alt="Members at an Atinuda roundtable" fill sizes="22vw" className="hm-cover" />
            </div>
            <p className="hm-card-caption">Member dinners through the year</p>
          </div>
        </div>
        <div className="hm-feature-text">
          <p className="hm-kicker">Membership</p>
          <h2 className="hm-display hm-h2">The Circle</h2>
          <p className="hm-body">
            Atinuda continues between editions. Members of the Circle receive the first invitation to every edition, meet at dinners through the year and stay close to the people they met in Lagos.
          </p>
          <Link href="/membership" className="hm-btn hm-btn-black">Discover the Circle</Link>
        </div>
      </section>

      {/* ── 6. Take part ── */}
      <section className="hm-wrap hm-news">
        <h2 className="hm-news-title">Take part in Atinuda 7.0</h2>
        <div className="hm-news-grid">
          {WAYS.map((w) => (
            <Link key={w.tag} href={w.href} className="hm-news-card">
              <div className="hm-img" style={{ aspectRatio: '3 / 4' }}>
                <Image src={w.image} alt={w.alt} fill sizes="(max-width: 860px) 100vw, 31vw" className="hm-cover" />
              </div>
              <p className="hm-news-meta"><span>{w.when}</span><span className="hm-kicker">{w.tag}</span></p>
              <h3 className="hm-news-head">{w.title}</h3>
              <p className="hm-news-body">{w.body}</p>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Link href="/become-a-sponsor" className="hm-btn hm-btn-black">Partner with Atinuda</Link>
        </div>
      </section>

      {/* ── 7. Register ── */}
      <section className="hm-register">
        <Image src={`${IMG}/GM5_1315.JPG`} alt="" fill sizes="100vw" className="hm-cover" />
        <div className="hm-shade" style={{ background: 'rgba(15,15,15,0.55)' }} />
        <div className="hm-wrap" style={{ position: 'relative' }}>
          <h2 className="hm-display" style={{ color: BG, fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', marginBottom: '16px' }}>Hear it first</h2>
          <p className="hm-body" style={{ color: 'rgba(244,245,243,0.85)', marginBottom: '48px' }}>
            Register to hear first as the 2027 voices, sessions and evenings are announced.
          </p>
          <InterestForm />
        </div>
      </section>

      {/* ── 8. Footer ── */}
      <footer className="hm-footer">
        <div className="hm-footer-top">
          <Link href="/" aria-label="Atinuda home" className="hm-footer-logo">
            <Image src="/assets/images/blacklogo.png" alt="Atinuda" width={170} height={52} style={{ objectFit: 'contain' }} />
          </Link>
          <nav aria-label="Footer">
            <ul className="hm-footer-main">
              {FOOTER_MAIN.map((l) => <li key={l.name}><Link href={l.path}>{l.name}</Link></li>)}
            </ul>
            <div className="hm-footer-social">
              {[
                { href: 'https://instagram.com/atinuda_', Icon: Instagram, label: 'Instagram' },
                { href: 'https://linkedin.com/company/atinuda', Icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://twitter.com/atinuda_', Icon: Twitter, label: 'Twitter' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={18} /></a>
              ))}
            </div>
          </nav>
          <div className="hm-footer-small">
            {FOOTER_SMALL.map((group, i) => (
              <ul key={i}>
                {group.map((l) => <li key={l.name}><Link href={l.path}>{l.name}</Link></li>)}
              </ul>
            ))}
          </div>
        </div>
        <div className="hm-footer-base">
          <p>For enquiries:<br /><a href="mailto:hello@atinuda.com">hello@atinuda.com</a></p>
          <p>For press:<br /><a href="mailto:press@atinuda.com">press@atinuda.com</a></p>
          <p>Atinuda 7.0<br />Lagos, 6–8 October 2027</p>
          <p style={{ textAlign: 'right' }}>© {new Date().getFullYear()} Atinuda.<br />Produced by Oaken Events.</p>
        </div>
      </footer>

      <style>{`
        .hm-wrap { max-width: 1440px; margin: 0 auto; padding-left: clamp(24px, 3vw, 40px); padding-right: clamp(24px, 3vw, 40px); }
        .hm-kicker { font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK}; margin: 0; }
        .hm-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.02; letter-spacing: -0.015em; color: ${INK}; margin: 0; }
        .hm-accent { font-family: 'Orpheus Pro', Georgia, serif; font-weight: 400; line-height: 1.25; color: ${INK}; }
        .hm-h2 { font-size: clamp(2.6rem, 4.4vw, 3.8rem); margin: 10px 0 40px; }
        .hm-body { font-family: DIN, system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: #3A403C; margin: 0; max-width: 46ch; }
        .hm-caption { font-family: DIN, system-ui, sans-serif; font-size: 13px; line-height: 1.55; color: ${MUTED}; margin: 16px 0 0; max-width: 52ch; }
        .hm-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hm-img { position: relative; overflow: hidden; background: #ECEEED; }
        .hm-shade { position: absolute; inset: 0; background: rgba(10,10,10,0.38); }

        .hm-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; padding: 12px 32px; min-width: 220px; text-align: center; border-radius: 0; transition: opacity 0.25s ease; }
        .hm-btn:hover { opacity: 0.85; }
        .hm-btn-white { background: #FFFFFF; color: ${INK}; }
        .hm-btn-black { background: #0F0F0F; color: ${BG}; }

        .hm-hero { position: relative; height: 100svh; min-height: 620px; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; background: #0F0F0F; }
        .hm-hero-inner { position: relative; display: flex; flex-direction: column; align-items: center; padding: 0 24px; }
        .hm-hero-title { color: ${BG}; font-size: clamp(3.4rem, 8vw, 7.5rem); line-height: 0.95; margin: 18px 0 36px; }

        .hm-stagger { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(16px, 2vw, 32px); padding-top: clamp(140px, 16vw, 230px); padding-bottom: clamp(120px, 14vw, 200px); }
        .hm-stagger figure { margin: 0; }
        .hm-stagger-text { grid-column: 2 / span 4; grid-row: 1; }
        .hm-stagger-b { grid-column: 8 / span 3; grid-row: 1 / span 2; margin-top: 40px !important; }
        .hm-stagger-c { grid-column: 2 / span 4; grid-row: 2 / span 2; margin-top: clamp(80px, 12vw, 200px) !important; }
        .hm-stagger-d { grid-column: 7 / span 5; grid-row: 3 / span 2; margin-top: clamp(120px, 16vw, 260px) !important; }

        .hm-motto { background: #0F0F0F; text-align: center; padding: clamp(110px, 12vw, 170px) 24px 40px; }
        .hm-motto-title { color: ${BG}; font-size: clamp(3.4rem, 8.5vw, 8rem); line-height: 0.95; max-width: 11ch; margin: 0 auto; }
        .hm-motto-sub { font-family: DIN, system-ui, sans-serif; font-size: 15px; color: rgba(244,245,243,0.85); margin: 36px auto 0; max-width: 52ch; }
        .hm-film { background: linear-gradient(#0F0F0F 0 50%, ${BG} 50% 100%); padding: 40px clamp(24px, 3vw, 40px) 0; }

        .hm-collage { position: relative; min-height: 1100px; display: flex; align-items: center; justify-content: center; padding: clamp(140px, 14vw, 200px) 24px; overflow: hidden; }
        .hm-float { position: absolute; aspect-ratio: 4 / 3; overflow: hidden; }
        .hm-collage-text { position: relative; z-index: 1; text-align: center; max-width: 820px; display: flex; flex-direction: column; align-items: center; }
        .hm-pillar-list { list-style: none; margin: 56px 0 56px; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 56px; text-align: left; width: 100%; }
        .hm-pillar-list li { display: flex; flex-direction: column; gap: 8px; }
        .hm-pillar-list .hm-accent { font-size: 1.15rem; }

        .hm-feature { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 6vw, 120px); align-items: center; padding-top: clamp(80px, 10vw, 140px); padding-bottom: clamp(64px, 7vw, 100px); }
        .hm-feature-media { position: relative; }
        .hm-feature-back { aspect-ratio: 4 / 5; }
        .hm-feature-card { position: absolute; left: 18%; top: 14%; width: 62%; background: #FFFFFF; padding: clamp(24px, 4vw, 64px) clamp(24px, 4vw, 64px) 28px; }
        .hm-card-caption { font-family: DIN, system-ui, sans-serif; font-size: 15px; color: ${INK}; text-align: center; margin: 22px 0 0; }
        .hm-feature-text { max-width: 460px; }
        .hm-feature-text .hm-body { margin-bottom: 40px; }

        .hm-news { padding-top: clamp(32px, 4vw, 56px); padding-bottom: clamp(120px, 14vw, 180px); }
        .hm-news-title { font-family: DIN, system-ui, sans-serif; font-weight: 400; font-size: 20px; color: ${INK}; margin: 0 0 44px; }
        .hm-news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px 24px; }
        .hm-news-card { text-decoration: none; color: inherit; display: block; }
        .hm-news-card .hm-img img { transition: transform 1s ease; }
        .hm-news-card:hover .hm-img img { transform: scale(1.03); }
        .hm-news-meta { display: flex; gap: 10px; align-items: baseline; font-family: DIN, system-ui, sans-serif; font-size: 13px; color: ${MUTED}; margin: 20px 0 12px; }
        .hm-news-head { font-family: 'Orpheus Pro', Georgia, serif; font-weight: 400; font-size: 1.4rem; line-height: 1.3; color: ${INK}; margin: 0 0 12px; }
        .hm-news-body { font-family: DIN, system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: ${MUTED}; margin: 0; }

        .hm-register { position: relative; overflow: hidden; padding: clamp(140px, 18vw, 240px) 0 clamp(120px, 14vw, 200px); background: #0F0F0F; }

        .hm-footer { background: ${BG}; padding: clamp(120px, 14vw, 200px) clamp(24px, 3vw, 40px) 40px; }
        .hm-footer-top { display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 48px; max-width: 1440px; margin: 0 auto; }
        .hm-footer-main { list-style: none; margin: 0; padding: 0; }
        .hm-footer-main a { font-family: DIN, system-ui, sans-serif; font-size: clamp(1.8rem, 2.6vw, 2.4rem); line-height: 1.5; color: ${INK}; text-decoration: none; }
        .hm-footer-main a:hover { opacity: 0.6; }
        .hm-footer-social { display: flex; gap: 22px; margin-top: 56px; }
        .hm-footer-social a { color: ${INK}; display: flex; }
        .hm-footer-small { display: flex; flex-direction: column; gap: 36px; text-align: right; }
        .hm-footer-small ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .hm-footer-small a { font-family: DIN, system-ui, sans-serif; font-size: 14px; color: ${INK}; text-decoration: none; }
        .hm-footer-small a:hover { text-decoration: underline; }
        .hm-footer-base { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1440px; margin: clamp(80px, 9vw, 120px) auto 0; padding-top: 40px; border-top: 1px solid #DBDFDB; }
        .hm-footer-base p { font-family: DIN, system-ui, sans-serif; font-size: 13px; line-height: 1.6; color: ${INK}; margin: 0; }
        .hm-footer-base a { color: ${INK}; text-decoration: none; }

        @media (max-width: 860px) {
          .hm-stagger { display: flex; flex-direction: column; gap: 56px; }
          .hm-stagger figure { margin-top: 0 !important; }
          .hm-collage { min-height: 0; }
          .hm-float { display: none; }
          .hm-pillar-list { grid-template-columns: 1fr; }
          .hm-feature { grid-template-columns: 1fr; }
          .hm-news-grid { grid-template-columns: 1fr; }
          .hm-footer-top { grid-template-columns: 1fr; }
          .hm-footer-small { text-align: left; }
          .hm-footer-base { grid-template-columns: 1fr 1fr; }
          .hm-footer-base p:last-child { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
