'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const sd = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };

type F = { name: string; email: string; phone: string; dob: string; company: string; role: string; location: string; howHeard: string };
const EMPTY: F = { name: '', email: '', phone: '', dob: '', company: '', role: '', location: '', howHeard: '' };

export default function Atinuda7() {
  const [form, setForm] = useState<F>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'atinuda_70_waitlist'), {
        ...form,
        submittedAt: new Date().toISOString(),
      });
      await fetch('https://formsubmit.co/ajax/hello@atinuda.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: 'Atinuda 7.0 — Interest Registration' }),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#faf9fe' }}>

      {/* ── HERO SPREAD ─────────────────────────────────── */}
      <section className="hero-spread" style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Left: stacked editorial images */}
        <div className="hero-images" style={{ width: '52%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>

          <div style={{ flex: '1 1 0', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
            <Image
              src="/assets/images/Retreat/Together/ATINUDA6_DAY3_35.JPG"
              alt="Atinuda 6.0, Mauritius"
              fill
              sizes="52vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              priority
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', height: '34%', flexShrink: 0 }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_45.JPG"
                alt=""
                fill
                sizes="26vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/assets/images/Retreat/Skill/ATINUDA6_DAY4_425.JPG"
                alt=""
                fill
                sizes="26vw"
                style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
          </div>
        </div>

        {/* Right: editorial copy */}
        <div className="hero-copy" style={{
          flex: 1,
          background: '#faf9fe',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 64px 52px 72px',
        }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.24em', color: 'rgba(26,16,64,0.38)' }}>
            ATINUDA VII &nbsp;<span style={{ color: '#b5622a' }}>7.0</span>&nbsp; LAGOS — 2027
          </p>

          <div>
            <h1 style={{ ...sd, fontSize: 'clamp(44px,5.5vw,78px)', color: '#1a1040', lineHeight: 0.94, letterSpacing: '-1px', marginBottom: '28px' }}>
              The room<br />you&apos;ve been<br />looking for.
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(26,16,64,0.50)', lineHeight: 1.85, maxWidth: '280px', marginBottom: '48px' }}>
              Three days of immersive programming, private dialogue, and unexpected connection — for Africa&apos;s most intentional builders, creatives, and leaders.
            </p>
            <a
              href="#register"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '11px', letterSpacing: '0.16em', color: '#1a1040', textDecoration: 'none', borderBottom: '1px solid rgba(26,16,64,0.2)', paddingBottom: '3px' }}
            >
              REGISTER INTEREST <ArrowDown size={13} />
            </a>
          </div>

          <div style={{ borderTop: '1px solid rgba(26,16,64,0.09)', paddingTop: '24px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(26,16,64,0.32)' }}>
              EST. 2015 &nbsp;·&nbsp; SEVENTH EDITION
            </p>
          </div>
        </div>
      </section>

      {/* ── IMAGE STRIP ─────────────────────────────────── */}
      <div className="strip-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 3fr', height: '300px', gap: '2px', background: '#e4e0f2' }}>
        {[
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_5.JPG',        pos: 'center' },
          { src: '/assets/images/Retreat/FirstLight/ATINUDA6_DAY1_17.JPG',   pos: 'center' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_635.JPG',  pos: 'center top' },
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_22.JPG',       pos: 'center' },
        ].map(({ src, pos }, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src={src} alt="" fill sizes="25vw" style={{ objectFit: 'cover', objectPosition: pos }} />
          </div>
        ))}
      </div>

      {/* Strip caption */}
      <div style={{ background: '#faf9fe', padding: '14px 48px', borderBottom: '1px solid rgba(26,16,64,0.07)' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(26,16,64,0.30)', fontStyle: 'italic' }}>
          Atinuda 6.0 &mdash; Oberoi Beach Resort, Mauritius. March 2026.
        </p>
      </div>

      {/* ── REGISTER SECTION ────────────────────────────── */}
      <section id="register" style={{ padding: '96px 0 112px', background: '#faf9fe' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 32px' }}>

          {done ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(26,16,64,0.32)', marginBottom: '24px' }}>ATINUDA 7.0</p>
              <h2 style={{ ...sd, fontSize: '60px', color: '#1a1040', lineHeight: 0.94, marginBottom: '24px' }}>
                You&apos;re on<br />the list.
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(26,16,64,0.46)', lineHeight: 1.85 }}>
                We&apos;ll be in touch before applications open publicly. The room is already building.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#b5622a', marginBottom: '24px' }}>
                REGISTER INTEREST
              </p>
              <h2 style={{ ...sd, fontSize: 'clamp(40px,4.5vw,56px)', color: '#1a1040', lineHeight: 0.96, marginBottom: '20px' }}>
                Be in the room.
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(26,16,64,0.46)', lineHeight: 1.85, marginBottom: '52px' }}>
                Tell us you want to be considered. Registrants hear first when applications open — before any public announcement.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                <InputField label="Full name" value={form.name} onChange={set('name')} required />
                <InputField label="Email address" type="email" value={form.email} onChange={set('email')} required />

                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <InputField label="Phone number" type="tel" value={form.phone} onChange={set('phone')} />
                  <InputField label="Date of birth" type="text" placeholder="DD / MM / YYYY" value={form.dob} onChange={set('dob')} />
                </div>

                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <InputField label="Company" value={form.company} onChange={set('company')} />
                  <InputField label="Role / title" value={form.role} onChange={set('role')} />
                </div>

                <InputField label="Where are you based?" value={form.location} onChange={set('location')} />

                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(26,16,64,0.38)', marginBottom: '10px' }}>
                    HOW DID YOU HEAR ABOUT ATINUDA
                  </p>
                  <div style={{ borderBottom: '1px solid rgba(26,16,64,0.16)', paddingBottom: '6px' }}>
                    <select
                      value={form.howHeard}
                      onChange={set('howHeard')}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '14px',
                        color: form.howHeard ? '#1a1040' : 'rgba(26,16,64,0.32)',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                        padding: 0,
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

                <div style={{ paddingTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: '#1a1040',
                      color: '#faf9fe',
                      border: 'none',
                      padding: '18px 40px',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {submitting ? 'REGISTERING…' : 'REGISTER MY INTEREST'}
                    {!submitting && <ArrowRight size={13} />}
                  </button>
                </div>

                <p style={{ fontSize: '10px', letterSpacing: '0.10em', color: 'rgba(26,16,64,0.22)' }}>
                  YOUR DETAILS ARE HELD PRIVATELY AND NEVER SHARED.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .hero-spread { flex-direction: column !important; min-height: unset !important; }
          .hero-images { width: 100% !important; height: 72vw !important; }
          .hero-copy { padding: 40px 28px 48px !important; }
          .strip-grid { grid-template-columns: 1fr 1fr !important; height: 480px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 899px) {
          .hero-spread { flex-direction: column !important; min-height: unset !important; }
          .hero-images { width: 100% !important; height: 56vw !important; }
          .hero-copy { padding: 48px 48px 56px !important; }
        }
        select option { background: #faf9fe; color: #1a1040; }
        input::placeholder { color: rgba(26,16,64,0.28); }
      `}</style>
    </div>
  );
}

function InputField({
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
      <p style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(26,16,64,0.38)', marginBottom: '10px' }}>
        {label.toUpperCase()}
      </p>
      <div style={{ borderBottom: '1px solid rgba(26,16,64,0.16)', paddingBottom: '6px' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontSize: '14px',
            color: '#1a1040',
            outline: 'none',
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}
