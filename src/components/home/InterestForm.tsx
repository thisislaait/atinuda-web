'use client';

import { useState } from 'react';

// Register-interest form on the home page. Posts to the existing /api/pre-signup route,
// which requires name, email and phone.
export function InterestForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/pre-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return <p className="if-done">Thank you. You will hear from us first as the 2027 programme is announced.</p>;
  }

  return (
    <form className="if" onSubmit={submit}>
      {(['name', 'email', 'phone'] as const).map((k) => (
        <label key={k} className="if-field">
          <span className="if-sr">{k === 'name' ? 'Full name' : k === 'email' ? 'Email' : 'Phone'}</span>
          <input
            required
            type={k === 'email' ? 'email' : k === 'phone' ? 'tel' : 'text'}
            autoComplete={k === 'name' ? 'name' : k === 'email' ? 'email' : 'tel'}
            placeholder={k === 'name' ? 'Your name' : k === 'email' ? 'Your email' : 'Your phone'}
            value={form[k]}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          />
        </label>
      ))}
      <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Register'}</button>
      {state === 'error' && <p className="if-error" role="alert">That did not go through. Please try again.</p>}
      <style>{`
        .if { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 24px; align-items: end; max-width: 860px; }
        .if-field { display: block; }
        .if-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .if input { width: 100%; background: transparent; border: 0; border-bottom: 1px solid rgba(244,245,243,0.55); padding: 10px 0; font-family: DIN, system-ui, sans-serif; font-size: 15px; color: #F4F5F3; outline: none; border-radius: 0; }
        .if input::placeholder { color: rgba(244,245,243,0.6); text-transform: uppercase; letter-spacing: 0.14em; font-size: 12px; }
        .if input:focus { border-bottom-color: #F4F5F3; }
        .if button { background: transparent; border: 0; color: #F4F5F3; font-family: DIN, system-ui, sans-serif; font-size: 15px; padding: 10px 0; cursor: pointer; }
        .if button:disabled { opacity: 0.35; }
        .if-error { grid-column: 1 / -1; font-family: DIN, system-ui, sans-serif; font-size: 14px; color: #F4F5F3; margin: 0; }
        .if-done { font-family: DIN, system-ui, sans-serif; font-size: 16px; color: #F4F5F3; margin: 0; }
        @media (max-width: 760px) { .if { grid-template-columns: 1fr; } .if button { justify-self: start; } }
      `}</style>
    </form>
  );
}
