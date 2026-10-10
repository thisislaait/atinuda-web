'use client';

const sd    = { fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' as const };
const INK   = '#1B1E1C';
const INK08 = 'rgba(27,30,28,0.08)';
const COPPER = '#b5622a';
const BGALT  = '#ECEEED';

const CITIES = ['Lagos', 'Mauritius', 'Accra', 'Rwanda', 'London', 'Dallas'];

const items = [...CITIES, ...CITIES];

export function StatsSection() {
  return (
    <section style={{
      background: BGALT,
      borderTop: `1px solid ${INK08}`,
      borderBottom: `1px solid ${INK08}`,
      padding: '80px 0',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        animation: 'marquee 22s linear infinite',
      }}>
        {items.map((city, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{
              ...sd,
              fontSize: 'clamp(3rem, 5.5vw, 6.5rem)',
              color: INK,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              padding: '0 52px',
              whiteSpace: 'nowrap',
            }}>
              {city}
            </span>
            <span style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: COPPER,
              flexShrink: 0,
            }} />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
