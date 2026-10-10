'use client';

import Image from 'next/image';
import Link from 'next/link';

const sd   = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK  = '#1B1E1C';
const BG   = '#F4F5F3';

const ATTENDEES = [
  { role: 'Design Founders',        desc: 'Designers and creative directors building Pan-African labels, studios and retail ecosystems.' },
  { role: 'Hospitality Executives', desc: 'Operators scaling hotels, restaurants and experience venues across African cities and diaspora markets.' },
  { role: 'Event Architects',       desc: "Producers and experience designers behind the continent's most influential gatherings and cultural productions." },
  { role: 'Capital Operators',      desc: "Fund managers and investors actively deploying into Africa's creative and experiential sectors." },
];

export function TheRoomSection() {
  return (
    <section style={{ background: BG }}>

      {/* ── Split: editorial text + image ────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '42fr 58fr',
        minHeight: '640px',
      }}
        className="room-split"
      >

        {/* Left — text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px clamp(28px, 4vw, 64px)',
          borderRight: '1px solid rgba(27,30,28,0.07)',
        }}>
          <div style={{ width: '1px', height: '48px', background: 'rgba(27,30,28,0.2)', marginBottom: '40px' }} />

          <h2 style={{
            ...sd,
            fontSize: 'clamp(2.6rem, 4vw, 5.4rem)',
            lineHeight: 1.04,
            color: INK,
            maxWidth: '520px',
            marginBottom: '28px',
          }}>
            Four kinds of people build this sector.
          </h2>

          <p style={{
            ...sans,
            fontSize: '14px',
            lineHeight: 1.85,
            color: 'rgba(27,30,28,0.5)',
            maxWidth: '380px',
            marginBottom: '48px',
          }}>
            Design founders, hospitality executives, creative directors and sector investors. The same room, three days.
          </p>

          <Link
            href="https://www.atinuda.africa/membership/apply"
            style={{
              display: 'inline-block',
              border: `1px solid ${INK}`,
              background: 'transparent',
              color: INK,
              padding: '15px 48px',
              ...sans,
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              textDecoration: 'none',
              alignSelf: 'flex-start',
            }}
          >
            Become a Member
          </Link>
        </div>

        {/* Right — image */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '480px' }}>
          <Image
            src="/assets/images/summit/new-images/IMG_7600L.jpg"
            alt="Atinuda Summit"
            fill
            sizes="58vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

      </div>

      {/* ── Attendee rows ─────────────────────────────────────── */}
      {/* <div style={{ borderTop: '1px solid rgba(27,30,28,0.08)' }}>
        {ATTENDEES.map((a) => (
          <div
            key={a.role}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '40px',
              padding: '32px clamp(28px, 5.5vw, 80px)',
              borderBottom: '1px solid rgba(27,30,28,0.07)',
              alignItems: 'start',
            }}
            className="attendee-row"
          >
            <p style={{ ...sd, fontSize: 'clamp(1.4rem, 2vw, 2rem)', color: INK, lineHeight: 1 }}>{a.role}</p>
            <p style={{ ...sans, fontSize: '14px', lineHeight: 1.8, color: 'rgba(27,30,28,0.5)' }}>{a.desc}</p>
          </div>
        ))}
      </div> */}

      <style>{`
        @media (max-width: 768px) {
          .room-split { grid-template-columns: 1fr !important; }
          .attendee-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>

    </section>
  );
}
