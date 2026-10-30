import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import {
  BigWord, FloatingCta, PillarStack, PinnedSteps, RevealStatement, ScrollProgress, ZoomPanel,
  type PillarPanel, type Step,
} from '@/components/home/Parallax';
import { parallaxStyles } from '@/components/home/parallaxStyles';

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

const DARK = '#0E0F0E';
const LIGHT = '#F4F5F3';
const IMG = '/assets/images/summit';
const NEW = `${IMG}/new-images`;

const STEPS: Step[] = [
  {
    label: 'The 2027 theme',
    title: 'The Architecture of Scale',
    body: 'Africa’s experience economy has the talent. It is still building what sits beneath it: financing, routes to market, intellectual property, training and shared standards. Tomorrow, Now brings together the people who can build them, and asks them to begin in Lagos.',
    cta: 'Attend Atinuda 7.0',
    href: '/pricing',
    image: `${NEW}/IMG_0964L.jpg`,
    alt: 'A keynote on the main stage at Atinuda',
  },
  {
    label: 'The programme',
    title: 'Three days in Lagos',
    body: 'Main-stage conversations across six pillars, practical workshops, and smaller sessions in the Roundtable, Future Lab and African Room. Two evenings bring everyone together: the Azizi Welcome Cocktail and the Executive Dinner Gala.',
    cta: 'See what each pass includes',
    href: '/pricing',
    image: `${NEW}/ATINUDA%20DAY%203_600.jpg`,
    alt: 'A workshop session at Atinuda',
  },
  {
    label: 'Voices of past editions',
    title: 'In good company',
    body: 'Preston Bailey, David Tutera, David Stark, Marcy Blum and TY Bello are among those who have spoken at Atinuda. The 2027 voices will be announced through the year.',
    cta: 'All voices',
    href: '/speakers',
    image: `${NEW}/IMG_0741L.jpg`,
    alt: 'A speaker on stage at Atinuda',
  },
];

const PILLARS: PillarPanel[] = [
  {
    name: 'MICE & Business Events',
    line: 'New markets and destination competitiveness.',
    body: 'For the people behind conferences, exhibitions, incentive travel, destinations and convention bureaus, and the markets they are opening across the global events economy.',
    image: `${IMG}/H1C10415.jpg`,
    alt: 'A full hall of delegates at Atinuda',
  },
  {
    name: 'Creative Industries & Experience Design',
    line: 'Creative excellence and commercial thinking.',
    body: 'For creative directors, designers, producers, florists and experiential agencies building lasting businesses on their ideas and intellectual property.',
    image: `${IMG}/ATINUDA%20DAY%202_130.jpg`,
    alt: 'A delegate in front of the Atinuda patterned backdrop',
  },
  {
    name: 'Social Events, Hospitality & Celebrations',
    line: 'Service excellence and lasting value.',
    body: 'For planners, venues, caterers and luxury providers raising the standard of celebration and hospitality, and the profitability behind it.',
    image: `${IMG}/GM5_1341.JPG`,
    alt: 'Guests celebrating together at the Atinuda gala',
  },
  {
    name: 'Leadership, Enterprise & Investment',
    line: 'Strategies to scale and attract capital.',
    body: 'For founders, executives and investors working on the governance, partnerships and capital that let a business grow and compete abroad.',
    image: `${NEW}/IMG_7378L.jpg`,
    alt: 'Executives in conversation at an Atinuda roundtable',
  },
  {
    name: 'Technology, Innovation & Sustainability',
    line: 'Future-ready businesses and new efficiencies.',
    body: 'For anyone rethinking how experiences are designed, produced and delivered, from event technology and AI to sustainable production.',
    image: `${IMG}/stf.jpg`,
    alt: 'Spark the Future finalists on stage at Atinuda',
  },
  {
    name: 'Talent, Education & Industry Development',
    line: 'Skills and pathways for the industry’s future.',
    body: 'For educators, associations, mentors and emerging professionals building the skills and standards the industry will rely on.',
    image: `${NEW}/IMG_7600L.jpg`,
    alt: 'A workshop roundtable at Atinuda',
  },
];

const WAYS = [
  {
    label: 'Delegates',
    title: 'Attend Atinuda 7.0',
    body: 'Five passes, from selected main-stage sessions to the full programme and the Private Executive Leadership Session.',
    cta: 'Explore the passes',
    href: '/pricing',
    image: `${NEW}/IMG_0523L.jpg`,
    alt: 'Two delegates laughing together',
  },
  {
    label: 'Sponsors',
    title: 'Sponsor the conference',
    body: 'Bring your brand into the programme and its evenings, alongside the leaders of the sector.',
    cta: 'Enquire about sponsorship',
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
  {
    label: 'Membership',
    title: 'The Circle',
    body: 'Members receive the first invitation to every edition and meet at dinners through the year, so the conversations started in Lagos carry on long after October.',
    cta: 'Discover the Circle',
    href: '/membership',
    image: `${IMG}/dinner.JPG`,
    alt: 'Guests at the Atinuda dinner',
  },
];

const FOOTER_NAV = [
  { heading: 'Atinuda 7.0', links: [{ name: 'The theme', path: '/#theme' }, { name: 'The pillars', path: '/#pillars' }, { name: 'Attend', path: '/pricing' }, { name: 'Voices', path: '/speakers' }] },
  { heading: 'Take part', links: [{ name: 'Sponsor', path: '/become-a-sponsor' }, { name: 'Partner', path: '/become-a-sponsor' }, { name: 'The Circle', path: '/membership' }] },
  { heading: 'Atinuda', links: [{ name: 'Our Story', path: '/our-story' }, { name: 'Local to Global 2025', path: '/local-to-global-summit-2025' }, { name: 'Spark the Future', path: '/spark-the-future' }, { name: 'Press', path: '/press' }, { name: 'Careers', path: '/careers' }, { name: 'Privacy', path: '/privacy' }] },
];

export default function HomePage() {
  return (
    <div id="top" className="hm" style={{ background: DARK, color: LIGHT }}>
      <ScrollProgress />
      <FloatingCta href="/pricing" label="Attend Atinuda 7.0" />

      {/* ── Hero ── */}
      <section className="hm-hero">
        <video className="hm-cover" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="https://res.cloudinary.com/p7gsmhew/video/upload/v1792169053/hero-video-hq.mp4" type="video/mp4" />
          <source src="/assets/motion/hero-video-new.mp4" type="video/mp4" />
        </video>
        <div className="hm-shade" />
        <div className="hm-hero-inner">
          <p className="px-kicker" style={{ color: 'rgba(244,245,243,0.85)' }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 6–8 October 2027</p>
          <h1 className="px-display hm-hero-title">Tomorrow, Now.</h1>
          <p className="px-display hm-hero-sub">The Architecture of Scale</p>
          <div className="hm-ctas">
            <Link href="/pricing" className="px-btn px-btn-solid">Attend Atinuda 7.0</Link>
            <Link href="/become-a-sponsor" className="px-btn px-btn-line">Partner with us</Link>
          </div>
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="hm-statement">
        <RevealStatement text="Atinuda 7.0 is a leadership conference for Africa’s experience economy, bringing the founders, executives and investors who shape how the continent hosts and celebrates to Lagos for three days." />
      </section>

      {/* ── Theme, programme and voices ── */}
      <div id="theme">
        <PinnedSteps steps={STEPS} />
      </div>

      {/* ── Six pillars ── */}
      <div id="pillars">
        <BigWord
          word="Six pillars"
          sub="The programme is built around six pillars, each a part of the experience economy and the people who lead it."
          images={[`${NEW}/IMG_1181L.jpg`, `${IMG}/ATINUDA%20DAY%202_560.jpg`]}
        />
        <PillarStack pillars={PILLARS} cta="Attend Atinuda 7.0" href="/pricing" />
      </div>

      {/* ── Ways to take part ── */}
      {WAYS.map((w) => (
        <ZoomPanel key={w.label} label={w.label} title={w.title} body={w.body} cta={w.cta} href={w.href} image={w.image} alt={w.alt} />
      ))}

      {/* ── Closing and footer ── */}
      <section className="hm-closing">
        <p className="px-kicker">Atinuda 7.0 &nbsp;·&nbsp; Tomorrow, Now</p>
        <h2 className="px-display hm-closing-title">Lagos, 6–8 October 2027</h2>
        <div className="hm-ctas" style={{ justifyContent: 'center' }}>
          <Link href="/pricing" className="px-btn px-btn-solid">Attend Atinuda 7.0</Link>
          <Link href="/become-a-sponsor" className="px-btn px-btn-line">Partner with us</Link>
        </div>
        <a href="#top" className="hm-top">Back to top</a>

        <footer className="hm-footer">
          <Link href="/" aria-label="Atinuda home">
            <Image src="/assets/images/whitelogo.png" alt="Atinuda" width={110} height={34} style={{ objectFit: 'contain' }} />
          </Link>
          <nav className="hm-footer-nav" aria-label="Footer">
            {FOOTER_NAV.map((col) => (
              <div key={col.heading}>
                <p className="px-kicker" style={{ marginBottom: '16px', color: 'rgba(244,245,243,0.5)' }}>{col.heading}</p>
                <ul>
                  {col.links.map((l) => <li key={l.name}><Link href={l.path}>{l.name}</Link></li>)}
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
      </section>

      <style>{`
        ${parallaxStyles}
        .hm-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hm-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,15,14,0.85) 0%, rgba(14,15,14,0.2) 55%, rgba(14,15,14,0.35) 100%); }

        .hm-hero { position: relative; min-height: 100svh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
        .hm-hero-inner { position: relative; display: flex; flex-direction: column; align-items: center; padding: 120px 24px 80px; }
        .hm-hero-title { font-size: clamp(3.8rem, 11vw, 10.5rem); line-height: 0.92; letter-spacing: -0.025em; margin-top: 24px; }
        .hm-hero-sub { font-size: clamp(1.5rem, 3vw, 2.6rem); margin-top: 14px; }
        .hm-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 44px; }

        .hm-statement { padding: clamp(140px, 18vw, 260px) 24px; }

        .hm-closing { padding: clamp(140px, 18vw, 240px) clamp(24px, 5vw, 64px) 40px; text-align: center; }
        .hm-closing-title { font-size: clamp(2.8rem, 7vw, 6.4rem); margin: 22px 0 8px; }
        .hm-top { display: inline-block; margin-top: 56px; font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.6); text-decoration: none; }
        .hm-top:hover { color: ${LIGHT}; }

        .hm-footer { max-width: 1280px; margin: clamp(120px, 14vw, 200px) auto 0; padding-top: 56px; border-top: 1px solid rgba(244,245,243,0.12); display: grid; grid-template-columns: auto 1fr; gap: 48px; text-align: left; }
        .hm-footer-nav { display: flex; justify-content: flex-end; gap: clamp(32px, 6vw, 88px); flex-wrap: wrap; }
        .hm-footer-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .hm-footer-nav a { font-family: DIN, system-ui, sans-serif; font-size: 14px; color: rgba(244,245,243,0.8); text-decoration: none; }
        .hm-footer-nav a:hover { color: ${LIGHT}; }
        .hm-footer-base { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding-top: 24px; }
        .hm-footer-base p { font-family: DIN, system-ui, sans-serif; font-size: 12px; color: rgba(244,245,243,0.55); margin: 0; }

        @media (max-width: 860px) {
          .hm-ctas { flex-direction: column; align-items: stretch; width: 100%; max-width: 340px; }
          .hm-ctas .px-btn { text-align: center; }
          .hm-footer { grid-template-columns: 1fr; }
          .hm-footer-nav { justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}
