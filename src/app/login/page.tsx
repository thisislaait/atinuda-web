/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search?.get('next') ?? '';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  // reset-password UI
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  // keep the reset email in sync if user typed in the main email box
  useEffect(() => {
    if (!showReset) return;
    if (!resetEmail) setResetEmail(form.email);
  }, [showReset, form.email, resetEmail]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      const next = search?.get('next');
      router.push(next ? decodeURIComponent(next) : '/tickets/mine');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  const handleSendReset = async () => {
    setResetMsg('');
    setError('');
    if (!resetEmail || !/^\S+@\S+\.\S+$/.test(resetEmail)) {
      setResetMsg('Please enter a valid email address.');
      return;
    }
    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetMsg('Password reset link sent. Check your email.');
    } catch (err: any) {
      setResetMsg(err?.message || 'Unable to send reset email right now.');
    } finally {
      setResetLoading(false);
    }
  };

  const inputBase =
    'input bg-white text-slate-900 placeholder-slate-400 caret-black';
  // If your global .input class clashes, the text-* and bg-* here will override it.

  return (
    <>
      <section
        id="nohero"
        className="min-h-screen relative flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-[url('/assets/images/elementthree.png')] bg-cover bg-center opacity-25 z-0" />
        <div className="max-w-md w-full relative bg-white shadow-md rounded-lg p-8 text-black">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              className={inputBase}
              value={form.email}
              required
            />

            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                onChange={handleChange}
                placeholder="Password"
                className={`${inputBase} pr-12`}
                value={form.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-9 px-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
              Login
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4">
            {!showReset ? (
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-blue-600 underline"
              >
                Forgot password?
              </button>
            ) : (
              <div className="mt-2 grid gap-2">
                <label className="text-xs text-slate-600">Reset password email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputBase} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleSendReset}
                    disabled={resetLoading}
                    className="whitespace-nowrap rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {resetLoading ? 'Sending…' : 'Send link'}
                  </button>
                </div>
                {!!resetMsg && (
                  <p className="text-xs text-slate-600">{resetMsg}</p>
                )}
              </div>
            )}
          </div>

          <p className="mt-6 text-sm text-center">
            Don’t have an account?{' '}
            <a
              href={nextParam ? `/signup?next=${encodeURIComponent(nextParam)}` : '/signup'}
              className="text-blue-600 underline"
            >
              Create one
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="p-6 text-white/70">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
