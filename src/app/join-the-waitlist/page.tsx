'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

type FormData = {
  name: string;
  company: string;
  role: string;
  email: string;
  location: string;
  howHeard: string;
};

const EMPTY: FormData = {
  name: '',
  company: '',
  role: '',
  email: '',
  location: '',
  howHeard: '',
};

const inputClass =
  'w-full py-3 border-b border-white/25 bg-transparent text-white placeholder-white/40 focus:outline-none focus:border-white/70 transition-colors text-sm';

const selectClass =
  'w-full py-3 border-b border-white/25 bg-transparent text-white/70 focus:outline-none focus:border-white/70 transition-colors text-sm appearance-none cursor-pointer';

export default function JoinWaitlist() {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'atinuda_2027_waitlist'), {
        ...formData,
        submittedAt: new Date().toISOString(),
      });

      await fetch('https://formsubmit.co/ajax/hello@atinuda.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, _subject: 'Atinuda 2027 — Waitlist' }),
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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_22.JPG"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0d2010]/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-32">

        {done ? (
          /* ── Success state ────────────────────────── */
          <div className="text-center text-white">
            <p className="nav-text text-[10px] tracking-[0.25em] text-white/40 mb-8">
              ATINUDA 2027
            </p>
            <h1 style={serifDisplay} className="text-5xl md:text-6xl leading-tight mb-8">
              You&apos;re on the list.
            </h1>
            <p className="text-white/60 leading-relaxed max-w-sm mx-auto">
              We&apos;ll be in touch when the seventh edition is announced. In the meantime, the room is already building.
            </p>
          </div>
        ) : (
          /* ── Form ─────────────────────────────────── */
          <>
            <p className="nav-text text-[10px] tracking-[0.25em] text-white/40 mb-8">
              ATINUDA 2027 — SEVENTH EDITION
            </p>
            <h1 style={serifDisplay} className="text-4xl md:text-5xl text-white leading-[1.1] mb-4">
              The seventh edition<br />is coming.
            </h1>
            <p className="text-white/55 text-sm leading-relaxed mb-12 max-w-sm">
              Destination and dates to be announced. Register your interest to be first in line when we open applications.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Role / title"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={inputClass}
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Where are you based?"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={inputClass}
              />
              <select
                value={formData.howHeard}
                onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
                className={selectClass}
              >
                <option value="" disabled>How did you hear about Atinuda?</option>
                <option value="Alumni referral">Alumni referral</option>
                <option value="Social media">Social media</option>
                <option value="Press / media">Press / media</option>
                <option value="Previous attendee">I attended a previous edition</option>
                <option value="Other">Other</option>
              </select>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-3 bg-white text-[#0d2010] text-sm tracking-wide px-8 py-4 hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering…' : 'Register my interest'}
                  {!submitting && <ArrowRight size={14} />}
                </button>
              </div>

              <p className="text-[10px] nav-text tracking-[0.12em] text-white/25 pt-2">
                YOUR DETAILS ARE HELD PRIVATELY AND NEVER SHARED.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
