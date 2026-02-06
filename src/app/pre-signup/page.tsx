'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function PreSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/pre-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || 'Failed to submit');
      }
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error('pre-signup submit failed', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div
      className="relative min-h-screen text-white flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/images/cheers.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220]/85 via-[#0b1220]/70 to-[#0b1220]/85 backdrop-blur-[2px]" />

      <div className="relative max-w-lg w-full">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl shadow-black/30 p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">The Elevation Retreat 2026</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
            Get Your Exclusive Access
          </h1>
          <p className="mt-3 text-white/70">
            Drop your contact info so we can reserve your place and follow up with next steps.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
                placeholder="Adaeze Bello"
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-white/70 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
                  placeholder="+234 801 234 5678"
                  required
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-200">{error}</div>}
            {status === 'success' && (
              <div className="text-sm text-emerald-200">Got it — we’ll be in touch shortly.</div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-[#0b1220] font-semibold px-4 py-3 shadow-lg shadow-black/20 hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {status === 'submitting' ? 'Sending...' : 'Send my details'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/50">
          Your info is used only to coordinate retreat access and updates.
        </p>
      </div>
    </div>
  );
}
