'use client';

import { useState, useEffect } from 'react';

const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK    = '#1B1E1C';
const BG     = '#F4F5F3';
const BGALT  = '#ECEEED';
const FOREST = '#28503E';
const STORAGE_KEY = 'atinuda_cookie_consent';

type Prefs = { functional: boolean; statistical: boolean; marketing: boolean };

export function CookieConsent() {
  const [visible, setVisible]   = useState(false);
  const [prefs, setPrefs]       = useState<Prefs>({ functional: false, statistical: false, marketing: false });

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const save = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      necessary: true,
      functional:  accepted ? true : prefs.functional,
      statistical: accepted ? true : prefs.statistical,
      marketing:   accepted ? true : prefs.marketing,
      timestamp: Date.now(),
    }));
    setVisible(false);
  };

  const toggle = (key: keyof Prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(27,30,28,0.55)',
        zIndex: 9998,
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        background: BG,
        width: 'min(480px, calc(100vw - 32px))',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
      }}>

        {/* Body */}
        <div style={{ padding: '40px 40px 0' }}>
          <p style={{ ...sans, fontSize: '20px', fontWeight: 600, color: INK, marginBottom: '20px', lineHeight: 1.2 }}>
            You control your data.
          </p>

          <p style={{ ...sans, fontSize: '13px', color: 'rgba(27,30,28,0.62)', lineHeight: 1.75, marginBottom: '12px' }}>
            We and our partners use cookies and similar technologies to collect data about you for various purposes.
          </p>
          <p style={{ ...sans, fontSize: '13px', color: 'rgba(27,30,28,0.62)', lineHeight: 1.75, marginBottom: '12px' }}>
            By clicking &lsquo;Accept all&rsquo; you consent to all purposes. You can also select purposes via the toggles below and click &lsquo;Save settings&rsquo;.
          </p>
          <p style={{ ...sans, fontSize: '13px', color: 'rgba(27,30,28,0.62)', lineHeight: 1.75, marginBottom: '24px' }}>
            You can withdraw your consent at any time. Read more in our cookie and privacy policy via the link.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <a href="/privacy" style={{ ...sans, fontSize: '13px', color: INK, textDecoration: 'underline' }}>Cookie &amp; Privacy Policy</a>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 40px 32px' }}>
          <button
            onClick={() => save(false)}
            style={{
              ...sans,
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              background: BGALT,
              color: INK,
              border: '1px solid rgba(27,30,28,0.15)',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            {prefs.functional || prefs.statistical || prefs.marketing ? 'Accept Selected' : 'Reject All'}
          </button>
          <button
            onClick={() => save(true)}
            style={{
              ...sans,
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              background: INK,
              color: BG,
              border: 'none',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            Accept All
          </button>
        </div>

        {/* Category toggles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(27,30,28,0.08)',
        }}>
          {/* Necessary — always on */}
          <CategoryToggle label="Necessary" on={true} locked />
          <CategoryToggle label="Functional"  on={prefs.functional}  onToggle={() => toggle('functional')} />
          <CategoryToggle label="Statistical" on={prefs.statistical} onToggle={() => toggle('statistical')} />
          <CategoryToggle label="Marketing"   on={prefs.marketing}   onToggle={() => toggle('marketing')} />
        </div>


      </div>
    </>
  );
}

function CategoryToggle({
  label, on, locked, onToggle,
}: {
  label: string;
  on: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '20px 12px',
      borderRight: '1px solid rgba(27,30,28,0.08)',
    }}>
      <p style={{ ...sans, fontSize: '11px', color: 'rgba(27,30,28,0.55)', textAlign: 'center', lineHeight: 1.3 }}>{label}</p>
      <button
        onClick={locked ? undefined : onToggle}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: on ? FOREST : 'rgba(27,30,28,0.15)',
          border: 'none',
          padding: '2px',
          cursor: locked ? 'default' : 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
        aria-label={`Toggle ${label}`}
      >
        <span style={{
          display: 'block',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: '2px',
          left: on ? '22px' : '2px',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}
