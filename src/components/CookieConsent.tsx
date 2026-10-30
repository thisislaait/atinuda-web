'use client';

import { useState, useEffect } from 'react';

// The site sets no analytics or marketing cookies, so this is a notice, not a consent form.
// If tracking is ever added, it must read STORAGE_KEY and stay off until the visitor opts in.
const sans = { fontFamily: 'Hanken Grotesk, system-ui, sans-serif' };
const INK = '#1B1E1C';
const BG  = '#F4F5F3';
const STORAGE_KEY = 'atinuda_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage blocked: show nothing rather than a notice that can never be dismissed.
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        necessary: true, functional: false, statistical: false, marketing: false, timestamp: Date.now(),
      }));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: BG, borderTop: '1px solid #DBDFDB',
        padding: '14px 24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px 28px',
      }}
    >
      <p style={{ ...sans, fontSize: '13px', lineHeight: 1.5, color: '#5A615C', margin: 0 }}>
        This site uses only the cookies it needs to work. Nothing tracks you.{' '}
        <a href="/privacy" style={{ color: INK, textDecoration: 'underline' }}>Privacy</a>
      </p>
      <button
        onClick={dismiss}
        style={{
          ...sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase',
          color: BG, background: INK, border: 'none', borderRadius: 0, padding: '10px 22px', cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
}
