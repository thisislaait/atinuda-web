import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Atinuda 7.0 | The New Standard',
  description:
    "Atinuda 7.0 — the platform connecting Africa's most influential creators, founders, and executives. Join the waitlist.",
  openGraph: {
    title: 'Atinuda 7.0 | The New Standard',
    description: "A platform for Africa's most influential voices. Join the room.",
    images: [{ url: '/assets/images/Mauritius2.png' }],
  },
};

const sd = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const INK = '#1a1040';
const COPPER = '#b5622a';
const BG = '#faf9fe';

const PILLARS = [
  {
    number: '01',
    title: 'Creativity',
    body: 'Culture is the currency of the next decade. Atinuda centres the African creative economy — music, film, fashion, design — and the leaders building it at scale.',
  },
  {
    number: '02',
    title: 'Leadership',
    body: 'Executive panels, keynotes, and peer access designed for founders, C-suite, and the emerging voices shaping sectors across the continent and diaspora.',
  },
  {
    number: '03',
    title: 'Enterprise',
    body: 'Trade, investment, and brand activation opportunities that turn relationships forged in the room into commercial partnerships that outlast the moment.',
  },
];

const NOTABLES = [
  { name: 'Founders', descriptor: 'Early-stage to series-funded, building across tech, fashion, hospitality, and media.' },
  { name: 'Executives', descriptor: 'C-suite and senior leadership from global and African corporations operating on the continent.' },
  { name: 'Creatives', descriptor: 'Music, film, art, and brand directors whose work defines African culture for a global audience.' },
  { name: 'Investors', descriptor: 'GPs, LPs, and family offices actively deploying capital across African markets.' },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Retreat/landinghero.JPG"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(26,16,64,0.25) 0%, rgba(26,16,64,0.6) 55%, rgba(26,16,64,0.94) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 md:px-16 lg:px-20 pb-24 md:pb-36">
          <p
            className="nav-text uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.42)', marginBottom: '28px' }}
          >
            Atinuda 7.0
          </p>

          <h1
            style={{
              ...sd,
              fontSize: 'clamp(4rem, 10vw, 9.5rem)',
              lineHeight: '0.92',
              color: '#fff',
              marginBottom: '40px',
            }}
          >
            Tomorrow,<br />Now.
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-28">
            <p
              style={{
                fontSize: '17px',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.58)',
                maxWidth: '420px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
              }}
            >
              The platform that connects Africa&apos;s most influential creators, founders,
              and executives — on the continent, in the diaspora, and across the world.
            </p>
            <Link
              href="/7.0-waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: COPPER,
                color: '#fff',
                padding: '15px 36px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Join the Waitlist
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATFORM ──────────────────────────────────────────── */}
      <section style={{ background: BG, padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-start">

            <div className="md:sticky md:top-32">
              <p
                className="nav-text uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(26,16,64,0.32)', marginBottom: '32px' }}
              >
                The Platform
              </p>
              <h2
                style={{
                  ...sd,
                  fontSize: 'clamp(2.6rem, 4.5vw, 5rem)',
                  color: INK,
                  lineHeight: '1.06',
                }}
              >
                Not an event.<br />A platform.
              </h2>
            </div>

            <div style={{ paddingTop: '4px' }}>
              <p
                style={{
                  fontSize: '20px',
                  lineHeight: '1.75',
                  color: 'rgba(26,16,64,0.68)',
                  marginBottom: '28px',
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                }}
              >
                <em style={{ fontStyle: 'italic', color: INK, fontFamily: 'SaolDisplay, Georgia, serif' }}>Átinúdá</em> — to rise, to ascend, to be lifted by the work
                and the room you keep. Seven editions in, the name still says everything.
              </p>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.85',
                  color: 'rgba(26,16,64,0.5)',
                  marginBottom: '56px',
                  fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                }}
              >
                We built a summit. Then a retreat. Then a members community that spans five
                continents. Atinuda 7.0 is the next chapter — a platform year that brings
                Africa&apos;s creative and business leadership into one extended conversation,
                across multiple touchpoints, cities, and formats.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1px',
                  background: 'rgba(26,16,64,0.08)',
                }}
              >
                {[
                  { n: '7', label: 'Editions' },
                  { n: '6+', label: 'Cities' },
                  { n: '20+', label: 'Countries' },
                ].map(({ n, label }) => (
                  <div key={label} style={{ background: BG, padding: '32px 24px' }}>
                    <p style={{ ...sd, fontSize: '3.2rem', color: INK, lineHeight: 1 }}>{n}</p>
                    <p
                      className="nav-text uppercase"
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.25em',
                        color: 'rgba(26,16,64,0.32)',
                        marginTop: '10px',
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────── */}
      <section style={{ background: INK, padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div style={{ marginBottom: '72px' }}>
            <p
              className="nav-text uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.26)', marginBottom: '24px' }}
            >
              What We Build Around
            </p>
            <h2
              style={{
                ...sd,
                fontSize: 'clamp(2.6rem, 4vw, 4.5rem)',
                color: '#fff',
                lineHeight: '1.06',
              }}
            >
              Three pillars.<br />One room.
            </h2>
          </div>

          <div
            className="grid md:grid-cols-3"
            style={{ gap: '1px', background: 'rgba(255,255,255,0.06)' }}
          >
            {PILLARS.map((p) => (
              <div key={p.title} style={{ background: INK, padding: '52px 40px 60px' }}>
                <p
                  className="nav-text uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', marginBottom: '36px' }}
                >
                  {p.number}
                </p>
                <h3
                  style={{
                    ...sd,
                    fontSize: '2.5rem',
                    color: COPPER,
                    lineHeight: 1.1,
                    marginBottom: '20px',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(255,255,255,0.46)',
                  }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ROOM ──────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div style={{ marginBottom: '64px' }}>
            <p
              className="nav-text uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(26,16,64,0.3)', marginBottom: '24px' }}
            >
              The Room
            </p>
            <h2
              style={{
                ...sd,
                fontSize: 'clamp(2.6rem, 4vw, 4.5rem)',
                color: INK,
                lineHeight: '1.06',
              }}
            >
              Who&apos;s in the room.
            </h2>
          </div>

          {/* Image strip */}
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: '2px', marginBottom: '2px', height: '360px' }}
          >
            {[
              '/assets/images/azizi1.jpeg',
              '/assets/images/azizi3.jpeg',
              '/assets/images/azizi5.jpeg',
              '/assets/images/azizi7.jpeg',
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

          {/* Room descriptors */}
          <div
            className="grid md:grid-cols-4"
            style={{ gap: '1px', background: 'rgba(26,16,64,0.07)' }}
          >
            {NOTABLES.map((n) => (
              <div key={n.name} style={{ background: '#fff', padding: '36px 28px' }}>
                <p
                  style={{
                    ...sd,
                    fontSize: '1.35rem',
                    color: INK,
                    marginBottom: '12px',
                  }}
                >
                  {n.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                    fontSize: '13px',
                    lineHeight: '1.65',
                    color: 'rgba(26,16,64,0.45)',
                  }}
                >
                  {n.descriptor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7.0 CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: '160px 0' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Mauritius2.png"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,16,64,0.88)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <div style={{ maxWidth: '580px' }}>
            <p
              className="nav-text uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.32)', marginBottom: '36px' }}
            >
              Atinuda 7.0 · 2026
            </p>
            <h2
              style={{
                ...sd,
                fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                color: '#fff',
                lineHeight: '0.94',
                marginBottom: '36px',
              }}
            >
              Lagos will set<br />the standard<br />for influence.
            </h2>
            <p
              style={{
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '17px',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '52px',
                maxWidth: '400px',
              }}
            >
              The room is forming. The names are being placed.
              Register your interest now — and be the first to know
              when doors open.
            </p>
            <Link
              href="/7.0-waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: COPPER,
                color: '#fff',
                padding: '16px 40px',
                fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Register Interest
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
