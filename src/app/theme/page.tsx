import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: { absolute: 'Tomorrow, Now: The Architecture of Scale | Atinuda 7.0' },
  description:
    'The Atinuda 7.0 theme. Africa’s experience economy has the talent; Tomorrow, Now: The Architecture of Scale is about the financing, routes to market, intellectual property, training and standards that let it grow. Lagos, 5–7 October 2027.',
  openGraph: {
    title: 'Tomorrow, Now: The Architecture of Scale',
    description: 'The Atinuda 7.0 theme. Lagos, 5–7 October 2027.',
    images: [{ url: '/assets/images/summit/new-images/IMG_1181L.jpg' }],
  },
};

const BG = '#F4F5F3';
const INK = '#1B1E1C';
const MUTED = '#5A615C';
const NEW = '/assets/images/summit/new-images';

const STRUCTURES = [
  { name: 'Financing structures', body: 'Capital designed for seasonal, project-led businesses: working capital that waits for the client to pay, and investors who know how to value a creative asset.' },
  { name: 'Distribution networks', body: 'Routes to clients that do not depend on who you already know, across cities, borders and the diaspora.' },
  { name: 'Intellectual property frameworks', body: 'Ways for designers, producers and creative directors to own, license and keep earning from what they create.' },
  { name: 'Training pipelines', body: 'A steady supply of skilled people, from the event floor and the hotel kitchen to the executive table.' },
  { name: 'Industry standards', body: 'Shared benchmarks for craft, contracts and service that a client can trust in Lagos, Accra or Nairobi.' },
];

export default function ThemePage() {
  return (
    <div style={{ background: BG }}>

      {/* ── Hero ── */}
      <section className="th-hero">
        <Image src={`${NEW}/IMG_1181L.jpg`} alt="A panel session on the Atinuda main stage" fill priority sizes="100vw" className="th-cover" />
        <div className="th-shade" />
        <div className="th-hero-inner">
          <p className="th-caps" style={{ color: 'rgba(244,245,243,0.85)' }}>The Atinuda 7.0 theme</p>
          <h1 className="th-display th-hero-title">Tomorrow, Now.</h1>
          <p className="th-display th-hero-sub">The Architecture of Scale</p>
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="th-wrap th-statement">
        <p className="th-accent th-statement-text">
          Tomorrow is not ahead of us. It is built by the decisions leaders make now.
        </p>
      </section>

      {/* ── What the theme means ── */}
      <section className="th-wrap th-split">
        <div className="th-split-img">
          <Image src={`${NEW}/IMG_0964L.jpg`} alt="A keynote on the Atinuda main stage" fill sizes="(max-width: 860px) 100vw, 50vw" className="th-cover" />
        </div>
        <div className="th-split-text">
          <p className="th-label">What the theme means</p>
          <h2 className="th-display th-h2">The Architecture of Scale</h2>
          <p className="th-body">
            Africa’s experience economy has never been short of talent. What it has been short of is the architecture beneath that talent: the financing structures, distribution networks, intellectual property frameworks, training pipelines and industry standards that turn individual brilliance into institutions.
          </p>
          <p className="th-body">
            The sector has spent a decade being told its moment is coming. Tomorrow, Now declines to wait. The financing, standards and markets that will shape African hospitality, design and events in the next decade are being negotiated today, in boardrooms, ministries and studios, and the people in those conversations decide who benefits.
          </p>
        </div>
      </section>

      {/* ── Five structures ── */}
      <section className="th-wrap th-section">
        <p className="th-label-wrap"><span className="th-label">What scale requires</span></p>
        <h2 className="th-display th-h2" style={{ textAlign: 'center', margin: '18px auto 20px' }}>Five structures</h2>
        <p className="th-body" style={{ textAlign: 'center', margin: '0 auto 72px' }}>
          Talent becomes an industry when five things exist around it. Each runs through the 2027 programme.
        </p>
        <div className="th-grid">
          {STRUCTURES.map((st, i) => (
            <article key={st.name}>
              <p className="th-caps" style={{ color: '#b5622a' }}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className="th-accent" style={{ fontSize: '1.55rem', margin: '14px 0 12px' }}>{st.name}</h3>
              <p className="th-body">{st.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Where it is worked out ── */}
      <section className="th-wrap th-split th-split-rev">
        <div className="th-split-img">
          <Image src={`${NEW}/IMG_1282L.jpg`} alt="An address from the Atinuda stage" fill sizes="(max-width: 860px) 100vw, 50vw" className="th-cover" />
        </div>
        <div className="th-split-text">
          <p className="th-label">In Lagos, 5–7 October 2027</p>
          <h2 className="th-display th-h2">Where the theme is worked out</h2>
          <p className="th-body">
            Atinuda 7.0 brings the founders, executives, investors and policymakers already building this architecture to Lagos for three days. Main-stage conversations across six pillars, practical workshops, and closed sessions in the Roundtable, Future Lab and African Room each take one part of the theme and work it through.
          </p>
          <Link href="/#pillars" className="th-more">See the six pillars<span aria-hidden="true"> ›</span></Link>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="th-wrap th-closing">
        <p className="th-caps" style={{ color: MUTED }}>Atinuda 7.0 &nbsp;·&nbsp; Lagos &nbsp;·&nbsp; 5–7 October 2027</p>
        <h2 className="th-display" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.4rem)', margin: '22px 0 44px' }}>Be part of building it.</h2>
        <div className="th-ctas">
          <Link href="/pricing" className="th-btn th-btn-dark">Attend Atinuda 7.0</Link>
          <Link href="/become-a-sponsor" className="th-btn th-btn-line">Partner with us</Link>
        </div>
      </section>

      <style>{`
        .th-wrap { max-width: 1280px; margin: 0 auto; padding-left: clamp(24px, 5vw, 64px); padding-right: clamp(24px, 5vw, 64px); }
        .th-section { padding-top: clamp(96px, 11vw, 160px); padding-bottom: clamp(96px, 11vw, 160px); }
        .th-caps { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${INK}; margin: 0; }
        .th-label-wrap { text-align: center; margin: 0; }
        .th-label { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${INK}; margin: 0; padding-bottom: 4px; border-bottom: 2px solid #b5622a; }
        .th-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.04; letter-spacing: -0.015em; color: ${INK}; margin: 0; }
        .th-accent { font-family: 'Orpheus Pro', Georgia, serif; font-weight: 400; line-height: 1.25; color: ${INK}; margin: 0; }
        .th-h2 { font-size: clamp(2.4rem, 4.6vw, 4rem); margin: 18px 0 24px; }
        .th-body { font-family: DIN, system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: ${MUTED}; margin: 0 0 18px; max-width: 46ch; }
        .th-more { display: inline-block; margin-top: 12px; font-family: DIN, system-ui, sans-serif; font-size: 15px; color: ${INK}; text-decoration: none; }
        .th-more:hover { text-decoration: underline; text-underline-offset: 4px; }
        .th-cover { object-fit: cover; }

        .th-hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; overflow: hidden; background: #0F0F0F; }
        .th-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.2) 55%, rgba(10,10,10,0.3) 100%); }
        .th-hero-inner { position: relative; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(24px, 5vw, 64px) clamp(64px, 10vh, 112px); }
        .th-hero-title { color: ${BG}; font-size: clamp(3.8rem, 11vw, 10.5rem); line-height: 0.92; letter-spacing: -0.025em; margin-top: 24px; }
        .th-hero-sub { color: ${BG}; font-size: clamp(1.5rem, 3vw, 2.6rem); margin-top: 14px; }

        .th-statement { text-align: center; padding-top: clamp(112px, 13vw, 180px); padding-bottom: clamp(80px, 9vw, 120px); }
        .th-statement-text { font-size: clamp(1.8rem, 3.2vw, 2.9rem); max-width: 26ch; margin: 0 auto; }

        .th-split { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(32px, 4vw, 64px); align-items: center; padding-top: clamp(48px, 6vw, 80px); padding-bottom: clamp(48px, 6vw, 80px); }
        .th-split-rev .th-split-img { order: 2; }
        .th-split-img { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
        .th-split-text { padding: 0 clamp(0px, 3vw, 48px); }

        .th-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(56px, 6vw, 88px) clamp(32px, 4vw, 64px); }

        .th-closing { text-align: center; padding-top: clamp(120px, 14vw, 200px); padding-bottom: clamp(120px, 14vw, 200px); }
        .th-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .th-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; padding: 16px 34px; border-radius: 0; transition: background 0.25s ease, color 0.25s ease; }
        .th-btn-dark { color: ${BG}; background: ${INK}; border: 1px solid ${INK}; }
        .th-btn-dark:hover { background: transparent; color: ${INK}; }
        .th-btn-line { color: ${INK}; border: 1px solid ${INK}; }
        .th-btn-line:hover { background: ${INK}; color: ${BG}; }

        @media (max-width: 860px) {
          .th-split { grid-template-columns: 1fr; }
          .th-split-rev .th-split-img { order: 0; }
          .th-split-text { padding: 0; }
          .th-grid { grid-template-columns: 1fr; gap: 48px; }
          .th-ctas { flex-direction: column; align-items: stretch; max-width: 340px; margin: 0 auto; }
          .th-btn { text-align: center; }
        }
      `}</style>
    </div>
  );
}
