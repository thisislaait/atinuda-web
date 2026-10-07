'use client';

import Link from 'next/link';

const sd   = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK  = '#1B1E1C';
const BG   = '#F4F5F3';
const COPPER = '#b5622a';

const ATTENDEES = [
  { role: 'Fashion Founders',       desc: 'Designers and creative directors building Pan-African labels, studios and retail ecosystems.' },
  { role: 'Hospitality Executives', desc: 'Operators scaling hotels, restaurants and experience venues across African cities and diaspora markets.' },
  { role: 'Event Architects',       desc: "Producers and experience designers behind the continent's most influential gatherings and cultural productions." },
  { role: 'Capital Operators',      desc: "Fund managers and investors actively deploying into Africa's creative and experiential sectors." },
];

export function TheRoomSection() {
  return (
    <section style={{ background: BG, borderTop: `1px solid rgba(27,30,28,0.07)` }}>

      {/* ── Centered header ─────────────────────────────────── */}
      <div style={{
        padding: '120px clamp(28px, 5.5vw, 80px) 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <p style={{
          ...sans,
          fontSize: '10px',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: COPPER,
          marginBottom: '40px',
        }}>
          The Room
        </p>

        <h2 style={{
          ...sd,
          fontSize: 'clamp(2.6rem, 4.5vw, 5rem)',
          lineHeight: 1.06,
          color: INK,
          maxWidth: '720px',
          marginBottom: '28px',
        }}>
          Who is in the room.
        </h2>

        <p style={{
          ...sans,
          fontSize: '16px',
          lineHeight: '1.8',
          color: 'rgba(27,30,28,0.52)',
          maxWidth: '560px',
          marginBottom: '52px',
        }}>
          The sector&apos;s founders, creative directors and investors. Three days. One city. No casual agenda.
        </p>

        <Link
          href="https://www.atinuda.africa/membership/apply"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            border: `1px solid ${INK}`,
            background: 'transparent',
            color: INK,
            padding: '15px 52px',
            ...sans,
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Become a Member
        </Link>
      </div>

      {/* ── Attendee types ──────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(27,30,28,0.08)' }}>
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
      </div>

      <style>{`
        @media (max-width: 768px) {
          .room-grid { grid-template-columns: 1fr !important; }
          .attendee-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>

    </section>
  );
}
