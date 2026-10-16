'use client';

import { useState } from 'react';
import Image from 'next/image';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

type F = { name: string; email: string; phone: string; dob: string; company: string; role: string; location: string; howHeard: string };
const EMPTY: F = { name: '', email: '', phone: '', dob: '', company: '', role: '', location: '', howHeard: '' };

const cg = { fontFamily: '"Cormorant Garamond", Georgia, serif' };
const hg = { fontFamily: '"Hanken Grotesk", system-ui, sans-serif' };

export default function Atinuda7() {
  const [form, setForm] = useState<F>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await addDoc(collection(db, 'atinuda_70_waitlist'), {
        ...form,
        submittedAt: new Date().toISOString(),
      });
      await fetch('https://formsubmit.co/ajax/hello@atinuda.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: 'Atinuda 7.0 Interest Registration' }),
      });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...hg, background: '#fff', color: '#0a0a0a' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(10,10,10,0.07)',
      }}>
        <span style={{ ...cg, fontSize: '18px', fontWeight: 400, letterSpacing: '0.06em', color: '#0a0a0a' }}>
          Atinuda
        </span>
        <span style={{ fontSize: '10px', letterSpacing: '0.22em', fontWeight: 500, color: 'rgba(10,10,10,0.45)' }}>
          EST. 2015
        </span>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px' }}>
        <Image
          src="/assets/images/Retreat/Within/ATINUDA6_DAY2_5.JPG"
          alt="Atinuda 6.0, Mauritius"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          priority
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.04) 100%)',
        }} />

        {/* Hero text — bottom left */}
        <div style={{
          position: 'absolute', bottom: '64px', left: '64px', right: '64px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.28em', fontWeight: 500, color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
              ATINUDA VII &nbsp;·&nbsp; LAGOS, NIGERIA &nbsp;·&nbsp; 2027
            </p>
            <h1 style={{
              ...cg, fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(52px, 7vw, 96px)',
              color: '#ffffff', lineHeight: 0.92, letterSpacing: '-0.01em',
              margin: 0,
            }}>
              The room<br />you&apos;ve been<br />looking for.
            </h1>
          </div>
          <a href="#register" style={{
            ...hg, fontSize: '10px', letterSpacing: '0.22em', fontWeight: 500,
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px',
            alignSelf: 'flex-end', whiteSpace: 'nowrap',
          }}>
            REGISTER INTEREST ↓
          </a>
        </div>

        {/* Edition tag — top right */}
        <div style={{ position: 'absolute', top: '80px', right: '48px' }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            SEVENTH EDITION
          </p>
        </div>
      </section>

      {/* ── DATE STRIP ──────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(10,10,10,0.08)', borderBottom: '1px solid rgba(10,10,10,0.08)',
        padding: '18px 48px',
        display: 'flex', alignItems: 'center', gap: '48px', overflowX: 'auto',
      }}>
        {['6 – 8 OCTOBER 2027', 'LAGOS, NIGERIA', 'SEVENTH EDITION', 'APPLICATION BY INVITATION', 'EST. 2015'].map((item, i, arr) => (
          <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '48px', flexShrink: 0 }}>
            <span style={{ ...hg, fontSize: '10px', letterSpacing: '0.2em', fontWeight: 500, color: 'rgba(10,10,10,0.55)', whiteSpace: 'nowrap' }}>
              {item}
            </span>
            {i < arr.length - 1 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(10,10,10,0.2)', flexShrink: 0 }} />}
          </span>
        ))}
      </div>

      {/* ── SPLIT: TEXT LEFT / IMAGE RIGHT ──────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(64px,8vw,120px) clamp(48px,6vw,96px)',
        }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.24em', fontWeight: 500, color: 'rgba(10,10,10,0.4)', marginBottom: '32px' }}>
            WHAT IS ATINUDA
          </p>
          <h2 style={{
            ...cg, fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(36px, 3.5vw, 56px)', lineHeight: 1.1,
            color: '#0a0a0a', marginBottom: '32px', letterSpacing: '-0.01em',
          }}>
            Sub-Saharan Africa&apos;s definitive summit for the experiential economy.
          </h2>
          <p style={{ ...hg, fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(10,10,10,0.7)', maxWidth: '420px' }}>
            Three days of closed roundtables, private dinners and capital conversations. Delegates leave with the market intelligence, cross-border relationships and investment introductions that define how this sector grows.
          </p>
        </div>
        <div style={{ position: 'relative', minHeight: '560px' }}>
          <Image
            src="/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_17.JPG"
            alt="Atinuda 6.0"
            fill
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE PANEL ───────────────────────────── */}
      <section style={{ position: 'relative', height: '75vh', minHeight: '480px' }}>
        <Image
          src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_22.JPG"
          alt="Atinuda 6.0 finale"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)',
        }} />
        <div style={{ position: 'absolute', bottom: '48px', left: '64px', right: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.18em', fontWeight: 500, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
            Atinuda 6.0 &nbsp;·&nbsp; Oberoi Beach Resort, Mauritius &nbsp;·&nbsp; March 2026
          </p>
        </div>
      </section>

      {/* ── IMAGE MOSAIC ────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 3fr', gap: '3px', height: '420px' }}>
        {[
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_1.JPG',       pos: 'center' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_635.JPG',   pos: 'center top' },
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_406.JPG',        pos: 'center' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_12.JPG',        pos: 'center' },
        ].map(({ src, pos }, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src={src} alt="" fill sizes="25vw" style={{ objectFit: 'cover', objectPosition: pos }} />
          </div>
        ))}
      </section>

      {/* ── PULL QUOTE ──────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(80px,10vw,140px) clamp(48px,12vw,200px)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(10,10,10,0.08)',
      }}>
        <h2 style={{
          ...cg, fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(28px, 3.5vw, 52px)',
          lineHeight: 1.25, color: '#0a0a0a',
          maxWidth: '820px', margin: '0 auto 32px',
          letterSpacing: '-0.01em',
        }}>
          &ldquo;For three days, Africa&apos;s most active founders, operators and investors come together — not to be seen, but to build.&rdquo;
        </h2>
        <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.22em', fontWeight: 500, color: 'rgba(10,10,10,0.4)' }}>
          ATINUDA 6.0 &nbsp;·&nbsp; MAURITIUS
        </p>
      </section>

      {/* ── SPLIT: IMAGE LEFT / EXPERIENCE RIGHT ────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh' }}>
        <div style={{ position: 'relative', minHeight: '520px' }}>
          <Image
            src="/assets/images/Retreat/Creativity/ATINUDA6_DAY5_640.JPG"
            alt="Atinuda session"
            fill
            sizes="50vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(64px,8vw,120px) clamp(48px,6vw,96px)',
          background: '#0a0a0a',
        }}>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.24em', fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}>
            THE EXPERIENCE
          </p>
          <h2 style={{
            ...cg, fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(32px, 3vw, 48px)', lineHeight: 1.15,
            color: '#ffffff', marginBottom: '40px', letterSpacing: '-0.01em',
          }}>
            Three days built for the people actively building this continent.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
            {[
              ['Closed roundtables', 'Small-group sessions with operators and investors who have done what you are trying to do.'],
              ['Private dinners', 'Table conversations that go where panels cannot.'],
              ['Capital conversations', 'The relationships that define how this sector grows — made directly, not through intermediaries.'],
              ['Cross-border introductions', 'Delegates leave knowing the people their business needs in markets they are entering.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <p style={{ ...hg, fontSize: '11px', letterSpacing: '0.14em', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                  {title?.toUpperCase()}
                </p>
                <p style={{ ...hg, fontSize: '14px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p style={{ ...hg, fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>
            BY INVITATION ONLY
          </p>
        </div>
      </section>

      {/* ── SECOND IMAGE STRIP ──────────────────────────────── */}
      <section style={{ position: 'relative', height: '60vh', minHeight: '360px' }}>
        <Image
          src="/assets/images/Retreat/Together/ATINUDA6_DAY3_10.JPG"
          alt="Atinuda 6.0"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)',
        }} />
      </section>

      {/* ── WHO ATTENDS ─────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(80px,10vw,120px) clamp(48px,8vw,160px)',
        display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px',
        borderBottom: '1px solid rgba(10,10,10,0.08)',
      }}>
        <div>
          <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.24em', fontWeight: 500, color: 'rgba(10,10,10,0.4)', marginBottom: '20px' }}>
            WHO ATTENDS
          </p>
          <h2 style={{ ...cg, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(36px, 3vw, 48px)', lineHeight: 1.1, color: '#0a0a0a', margin: 0 }}>
            The continent&apos;s most active builders.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', alignContent: 'start' }}>
          {[
            'Fashion founders and creative directors',
            'Hospitality executives',
            'Sector investors and family offices',
            'Brand builders entering African markets',
            'Cross-border operators',
            'Media and cultural leaders',
          ].map((item) => (
            <div key={item} style={{ borderTop: '1px solid rgba(10,10,10,0.08)', padding: '20px 0', paddingRight: '24px' }}>
              <p style={{ ...hg, fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(10,10,10,0.75)', margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REGISTER ────────────────────────────────────────── */}
      <section id="register" style={{ padding: 'clamp(80px,10vw,120px) 48px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {done ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.24em', fontWeight: 500, color: 'rgba(10,10,10,0.4)', marginBottom: '28px' }}>
                ATINUDA 7.0
              </p>
              <h2 style={{ ...cg, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(44px, 5vw, 72px)', lineHeight: 0.92, color: '#0a0a0a', marginBottom: '28px' }}>
                You&apos;re on<br />the list.
              </h2>
              <p style={{ ...hg, fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
                We&apos;ll be in touch before applications open publicly.<br />The room is already building.
              </p>
            </div>
          ) : (
            <>
              <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.24em', fontWeight: 500, color: 'rgba(10,10,10,0.4)', marginBottom: '20px' }}>
                REGISTER YOUR INTEREST
              </p>
              <h2 style={{
                ...cg, fontStyle: 'italic', fontWeight: 300,
                fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.05,
                color: '#0a0a0a', marginBottom: '20px',
              }}>
                Want to be considered for 7.0?
              </h2>
              <p style={{ ...hg, fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(10,10,10,0.6)', marginBottom: '56px' }}>
                Registrants hear first when applications open — before any public announcement. We review every submission.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <Field label="Full name" value={form.name} onChange={set('name')} required />
                <Field label="Email address" type="email" value={form.email} onChange={set('email')} required />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  <Field label="Phone number" type="tel" value={form.phone} onChange={set('phone')} />
                  <Field label="Date of birth" placeholder="DD / MM / YYYY" value={form.dob} onChange={set('dob')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  <Field label="Company" value={form.company} onChange={set('company')} />
                  <Field label="Role / title" value={form.role} onChange={set('role')} />
                </div>

                <Field label="Where are you based?" value={form.location} onChange={set('location')} />

                {/* How did you hear */}
                <div>
                  <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.18em', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>
                    HOW DID YOU HEAR ABOUT ATINUDA
                  </p>
                  <div style={{ borderBottom: '1px solid rgba(10,10,10,0.25)', paddingBottom: '8px' }}>
                    <select
                      value={form.howHeard}
                      onChange={set('howHeard')}
                      style={{
                        ...hg, width: '100%', background: 'transparent', border: 'none',
                        fontSize: '15px', fontWeight: 300,
                        color: form.howHeard ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
                        outline: 'none', appearance: 'none', cursor: 'pointer', padding: 0,
                      }}
                    >
                      <option value="" disabled>Select</option>
                      <option value="Alumni referral">Alumni referral</option>
                      <option value="Social media">Social media</option>
                      <option value="Press / media">Press / media</option>
                      <option value="Previous attendee">I attended a previous edition</option>
                      <option value="Sponsorship prospectus">Sponsorship prospectus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p style={{ ...hg, fontSize: '13px', color: '#8B2020', fontWeight: 400 }}>{error}</p>
                )}

                <div style={{ paddingTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      ...hg, background: '#0a0a0a', color: '#ffffff',
                      border: 'none', padding: '18px 44px',
                      fontSize: '10px', letterSpacing: '0.22em', fontWeight: 600,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.5 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {submitting ? 'REGISTERING…' : 'REGISTER MY INTEREST'}
                  </button>
                </div>

                <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.12em', fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>
                  YOUR DETAILS ARE HELD PRIVATELY AND NEVER SHARED.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(10,10,10,0.08)',
        padding: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '20px',
      }}>
        <span style={{ ...cg, fontSize: '17px', fontWeight: 400, letterSpacing: '0.04em', color: '#0a0a0a' }}>
          Atinuda
        </span>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="mailto:hello@atinuda.com" style={{ ...hg, fontSize: '11px', letterSpacing: '0.14em', fontWeight: 500, color: 'rgba(10,10,10,0.5)', textDecoration: 'none' }}>
            hello@atinuda.com
          </a>
          <a href="https://instagram.com/atinuda" target="_blank" rel="noreferrer" style={{ ...hg, fontSize: '11px', letterSpacing: '0.14em', fontWeight: 500, color: 'rgba(10,10,10,0.5)', textDecoration: 'none' }}>
            INSTAGRAM
          </a>
        </div>
        <p style={{ ...hg, fontSize: '10px', letterSpacing: '0.14em', fontWeight: 500, color: 'rgba(10,10,10,0.3)', margin: 0 }}>
          © 2026 ATINUDA &nbsp;·&nbsp; EST. 2015
        </p>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 767px) {
          nav { padding: 0 24px !important; }
          .hero-text { bottom: 36px !important; left: 28px !important; right: 28px !important; flex-direction: column !important; gap: 24px !important; }
          section[style*="grid-template-columns: 1fr 1fr"] { display: block !important; }
          section[style*="grid-template-columns: 3fr"] { grid-template-columns: 1fr 1fr !important; height: 560px !important; }
          section[style*="grid-template-columns: 1fr 2fr"] { display: block !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          footer { flex-direction: column !important; gap: 16px !important; }
        }
        select option { background: #fff; color: #0a0a0a; }
        input::placeholder { color: rgba(10,10,10,0.35); }
        @media (prefers-color-scheme: dark) {
          body { background: #fff !important; color: #0a0a0a !important; }
        }
      `}</style>
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text', placeholder, required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <p style={{ fontFamily: '"Hanken Grotesk", system-ui, sans-serif', fontSize: '10px', letterSpacing: '0.18em', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>
        {label.toUpperCase()}
      </p>
      <div style={{ borderBottom: '1px solid rgba(10,10,10,0.25)', paddingBottom: '8px' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={{
            fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
            width: '100%', background: 'transparent', border: 'none',
            fontSize: '15px', fontWeight: 300, color: '#0a0a0a',
            outline: 'none', padding: 0,
          }}
        />
      </div>
    </div>
  );
}
