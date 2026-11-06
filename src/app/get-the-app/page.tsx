import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Passes are bought in the Atinuda app. Phones go straight to their store; desktop sees both.
const APP_STORE = 'https://apps.apple.com/ng/app/atinuda/id6755419370';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.laait.atinudaconferenceapp';

export const metadata: Metadata = {
  title: 'Get the Atinuda app',
  description: 'Atinuda 7.0 passes, tickets and the event programme live in the Atinuda app.',
};

const INK = '#1B1E1C';
const BG = '#F4F5F3';
const MUTED = '#5A615C';
const saol = { fontFamily: 'SaolDisplay, Georgia, serif' };
const sans = { fontFamily: '"Hanken Grotesk", system-ui, sans-serif' };

export default async function GetTheAppPage() {
  const ua = (await headers()).get('user-agent') ?? '';
  if (/iPhone|iPad|iPod/i.test(ua)) redirect(APP_STORE);
  if (/Android/i.test(ua)) redirect(PLAY_STORE);

  return (
    <main id="nohero" style={{ background: BG, minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '140px 24px 96px' }}>
        <p style={{ ...sans, fontSize: '11px', letterSpacing: '0.32em', textTransform: 'uppercase', color: MUTED, marginBottom: '28px' }}>
          Atinuda 7.0 &nbsp;·&nbsp; 5–7 October 2027 &nbsp;·&nbsp; Lagos
        </p>
        <h1 style={{ ...saol, fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', lineHeight: 1, color: INK, marginBottom: '24px' }}>
          Passes are reserved in the Atinuda app.
        </h1>
        <p style={{ ...sans, fontSize: '16px', lineHeight: 1.7, color: MUTED, marginBottom: '48px' }}>
          Choose your pass, add your group and pay in the app. Your ticket, the programme and check-in stay there too.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href={APP_STORE} style={btn}>App Store</a>
          <a href={PLAY_STORE} style={btn}>Google Play</a>
        </div>
        <p style={{ ...sans, fontSize: '13px', lineHeight: 1.7, color: MUTED, marginTop: '48px' }}>
          Booking for a company or association? Write to{' '}
          <a href="mailto:hello@atinuda.africa" style={{ color: INK }}>hello@atinuda.africa</a> and we will arrange the group directly.
        </p>
      </div>
    </main>
  );
}

const btn = {
  ...sans,
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.24em',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  padding: '17px 36px',
  color: BG,
  background: INK,
};
