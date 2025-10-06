'use client'

// pages/register.tsx
import React, { useState } from 'react';

type ApiResp =
  | { ok: true; id: string; name: string; email: string; company: string; message: string }
  | { ok: false; message: string };

export default function RegisterPage() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [breakouts, setBreakouts] = useState<string>('');
  const [workshops, setWorkshops] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResp | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResp(null);
    setLoading(true);

    try {
      // Split comma-separated input into arrays
      const breakoutsArr = breakouts
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const workshopsArr = workshops
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const r = await fetch('/api/register-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketNumber,
          selections: {
            breakouts: breakoutsArr,
            workshops: workshopsArr,
            notes,
          },
        }),
      });

      // Defensive JSON parsing and validation
      const parsed = await r.json().catch(() => null);
      if (!parsed || typeof parsed !== 'object' || !('ok' in parsed)) {
        setResp({ ok: false, message: 'Unexpected server response' });
      } else {
        // parsed has ok prop — cast to ApiResp safely
        setResp(parsed as ApiResp);
      }
    } catch (err: unknown) {
      // don't use `any` — handle unknown safely
      const msg = err instanceof Error ? err.message : String(err ?? 'Network error');
      setResp({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 520, margin: '40px auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Breakout & Workshop Registration</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>
        Enter your ticket number. We’ll auto-attach your name, email, and company from your payment.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Ticket Number
          <input
            required
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="e.g. ATN-12345"
            style={inputStyle}
          />
        </label>

        <label>
          Breakouts (comma separated)
          <input
            value={breakouts}
            onChange={(e) => setBreakouts(e.target.value)}
            placeholder="e.g. B1, B3"
            style={inputStyle}
          />
        </label>

        <label>
          Workshops (comma separated)
          <input
            value={workshops}
            onChange={(e) => setWorkshops(e.target.value)}
            placeholder="e.g. W2"
            style={inputStyle}
          />
        </label>

        <label>
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special needs or comments…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Submitting…' : 'Submit Registration'}
        </button>
      </form>

      {resp && (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          {resp.ok ? (
            <>
              <p style={{ margin: 0 }}>✅ {resp.message}</p>
              <p style={{ margin: '6px 0 0 0', color: '#444' }}>
                <strong>Name:</strong> {resp.name} <br />
                <strong>Email:</strong> {resp.email} <br />
                <strong>Company:</strong> {resp.company || '—'}
              </p>
            </>
          ) : (
            <p style={{ color: '#b91c1c', margin: 0 }}>❌ {resp.message}</p>
          )}
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  marginTop: 6,
  border: '1px solid #ddd',
  borderRadius: 8,
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  padding: '12px 14px',
  background: '#1B365D',
  color: '#fff',
  borderRadius: 8,
  border: 0,
  fontWeight: 700,
  cursor: 'pointer',
};
