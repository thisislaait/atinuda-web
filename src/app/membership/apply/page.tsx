'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const serifDisplay = { fontFamily: 'SaolDisplay, Georgia, serif', fontStyle: 'italic' as const };
const serif = { fontFamily: 'Orpheus Pro, "Playfair Display", serif' };

type FormData = {
  name: string;
  email: string;
  company: string;
  role: string;
  location: string;
  linkedin: string;
  attended: string;
  whyApply: string;
  referredBy: string;
};

const EMPTY: FormData = {
  name: '',
  email: '',
  company: '',
  role: '',
  location: '',
  linkedin: '',
  attended: '',
  whyApply: '',
  referredBy: '',
};

const inputClass =
  'w-full py-3 border-b border-[#c9b8ab] bg-transparent text-[#1a1a1a] placeholder-[#b0a49a] focus:outline-none focus:border-[#0d2010] transition-colors text-sm';

const selectClass =
  'w-full py-3 border-b border-[#c9b8ab] bg-transparent text-[#4a4a4a] focus:outline-none focus:border-[#0d2010] transition-colors text-sm appearance-none cursor-pointer';

const textareaClass =
  'w-full py-3 border-b border-[#c9b8ab] bg-transparent text-[#1a1a1a] placeholder-[#b0a49a] focus:outline-none focus:border-[#0d2010] transition-colors text-sm resize-none';

export default function MembershipApplyPage() {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'elevation_circle_applications'), {
        ...formData,
        submittedAt: new Date().toISOString(),
      });

      await fetch('https://formsubmit.co/ajax/hello@atinuda.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: 'Elevation Circle — Membership Application',
        }),
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
    <main id="nohero" className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* ── Two-panel layout ───────────────────────────────────── */}
      <div className="min-h-screen lg:grid lg:grid-cols-2">

        {/* Left: sticky image */}
        <div className="hidden lg:block relative">
          <div className="sticky top-0 h-screen">
            <Image
              src="/assets/images/Retreat/Finale/ATINUDA6_DAY6_46.JPG"
              fill
              className="object-cover"
              alt=""
              priority
            />
            <div className="absolute inset-0 bg-[#0d2010]/40" />
            <div className="absolute bottom-12 left-10 right-10 text-white">
              <p className="nav-text text-[9px] tracking-[0.25em] text-white/40 mb-4">
                THE ELEVATION CIRCLE
              </p>
              <p style={serif} className="text-2xl leading-snug">
                &ldquo;The most valuable thing we build isn&apos;t the programme. It&apos;s the room.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="px-8 md:px-12 lg:px-16 pt-32 pb-24">

          {done ? (
            /* ── Success ──────────────────────────────── */
            <div className="max-w-md">
              <p className="nav-text text-[10px] tracking-[0.25em] text-[#8a7e72] mb-8">
                APPLICATION RECEIVED
              </p>
              <h1 style={serifDisplay} className="text-5xl leading-tight mb-8">
                Thank you.
              </h1>
              <p className="text-[#4a4a4a] leading-relaxed mb-6">
                Your application has been received. Every application is reviewed by the programme team, and we will be in touch if there is a place for you in the Circle.
              </p>
              <p className="text-[#4a4a4a] leading-relaxed mb-12">
                Applications are reviewed on a rolling basis. The cohort is capped by design.
              </p>
              <Link
                href="/membership"
                className="inline-flex items-center gap-3 border border-[#1a1a1a] text-sm tracking-wide px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Back to membership
              </Link>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────── */
            <>
              <p className="nav-text text-[10px] tracking-[0.25em] text-[#8a7e72] mb-8">
                THE ELEVATION CIRCLE
              </p>
              <h1 style={serifDisplay} className="text-4xl md:text-5xl leading-tight mb-4">
                Apply for<br />membership.
              </h1>
              <p className="text-[#4a4a4a] leading-relaxed mb-14 max-w-sm">
                Applications are reviewed individually. There is no automated acceptance. Every member is chosen with care.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8 max-w-md">

                {/* Personal */}
                <fieldset className="space-y-6">
                  <legend className="nav-text text-[9px] tracking-[0.25em] text-[#8a7e72] mb-6 block">
                    01 — ABOUT YOU
                  </legend>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Company / organisation"
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
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn profile URL"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className={inputClass}
                  />
                </fieldset>

                {/* Atinuda history */}
                <fieldset className="space-y-6">
                  <legend className="nav-text text-[9px] tracking-[0.25em] text-[#8a7e72] mb-6 block">
                    02 — YOUR HISTORY WITH ATINUDA
                  </legend>
                  <select
                    required
                    value={formData.attended}
                    onChange={(e) => setFormData({ ...formData, attended: e.target.value })}
                    className={selectClass}
                  >
                    <option value="" disabled>Have you attended an Atinuda edition?</option>
                    <option value="Yes — multiple editions">Yes — multiple editions</option>
                    <option value="Yes — one edition">Yes — one edition</option>
                    <option value="No — but I am familiar with the programme">No — but I am familiar with the programme</option>
                    <option value="No — this is my first introduction">No — this is my first introduction</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Referred by (name of Atinuda member, if applicable)"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    className={inputClass}
                  />
                </fieldset>

                {/* Why */}
                <fieldset>
                  <legend className="nav-text text-[9px] tracking-[0.25em] text-[#8a7e72] mb-6 block">
                    03 — YOUR CASE
                  </legend>
                  <textarea
                    rows={5}
                    required
                    placeholder="Why are you applying, and what do you bring to the room? (200–400 words)"
                    value={formData.whyApply}
                    onChange={(e) => setFormData({ ...formData, whyApply: e.target.value })}
                    className={textareaClass}
                  />
                </fieldset>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 bg-[#0d2010] text-white text-sm tracking-wide px-8 py-4 hover:bg-[#1a3a1a] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting…' : 'Submit application'}
                    {!submitting && <ArrowRight size={14} />}
                  </button>
                </div>

                <p className="text-[10px] nav-text tracking-[0.12em] text-[#b0a49a] pt-2">
                  YOUR APPLICATION IS HELD IN STRICT CONFIDENCE AND NEVER SHARED OUTSIDE THE PROGRAMME TEAM.
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
