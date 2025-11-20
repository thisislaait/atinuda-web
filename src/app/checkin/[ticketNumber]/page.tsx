// src/app/ticket/[ticketNumber]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

type TicketPayload = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location?: string | null;
  checkIn?: Record<string, boolean> | null;
  giftClaimed?: boolean;
};

type ApiResp = {
  ok: boolean;
  source?: 'tickets' | 'payments' | 'attendees';
  ticket?: TicketPayload | null;
  message?: string;
};

const CHECK_EVENTS = [
  { key: 'azizi', label: 'Azizi (Oct 6)' },
  { key: 'day1', label: 'Conference Day 1 (Oct 7)' },
  { key: 'day2', label: 'Conference Day 2 (Oct 8)' },
  { key: 'dinner', label: 'Dinner (Oct 8 — 6pm)' },
  { key: 'breakout', label: 'Breakout sessions (Oct 7)' },
  { key: 'masterclass', label: 'Masterclass (Oct 8)' },
  { key: 'gift', label: 'Gift claimed' },
] as const;

const normTicket = (value?: string) => {
  if (!value) return '';
  try {
    return decodeURIComponent(String(value)).toUpperCase().trim();
  } catch {
    return String(value).toUpperCase().trim();
  }
};

const makeTicketUrl = (ticketNumber: string) => {
  const site =
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')) ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return site ? `${site}/ticket/${encodeURIComponent(ticketNumber)}` : `/ticket/${encodeURIComponent(ticketNumber)}`;
};

export default function TicketPage(): React.ReactElement {
  const params = useParams<{ ticketNumber?: string | string[] }>();
  const rawTicketParam = Array.isArray(params?.ticketNumber) ? params.ticketNumber[0] : params?.ticketNumber;
  const ticketNumber = normTicket(rawTicketParam);

  const search = useSearchParams();
  const fallbackName = (search?.get('name') ?? '').trim();
  const slug = (search?.get('slug') ?? '').trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchTicket = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setResp(null);
    try {
      if (!ticketNumber) {
        setError('Invalid ticket link (no ticket number).');
        return;
      }

      const qs = new URLSearchParams({ ticketNumber });
      if (slug) qs.set('slug', slug);

      const res = await fetch(`/api/ticket-by-number?${qs.toString()}`, { cache: 'no-store' });
      const json = (await res.json()) as ApiResp;

      if (!res.ok || !json.ok || !json.ticket) {
        setError(json.message ?? 'Ticket not found.');
        return;
      }

      setResp(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketNumber, slug]);

  const toggleEvent = async (eventKey: string) => {
    if (!ticketNumber) return;

    const current =
      resp?.ticket?.checkIn?.[eventKey] ?? (eventKey === 'gift' ? resp?.ticket?.giftClaimed ?? false : false);
    const next = !current;

    if (actionInProgress === eventKey) return;

    setActionInProgress(eventKey);
    setMessage('');

    try {
      const res = await fetch('/api/checkins/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketNumber, event: eventKey, status: next }),
      });

      const body = await res.json();

      if (!res.ok || !body?.ok) {
        throw new Error(body?.message || `Check-in failed: ${res.status}`);
      }

      await fetchTicket();
      setMessage(next ? 'Checked in ✅' : 'Unchecked ✅');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg || 'Check-in failed');
    } finally {
      setActionInProgress(null);
    }
  };

  const checkDayNow = (dayKey: string) => toggleEvent(dayKey);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-sm text-slate-600">Loading ticket…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Ticket Lookup</h1>
        <p className="mt-2 text-slate-700">{error}</p>
        <p className="mt-1 text-xs text-slate-500">
          Ticket: <span className="font-mono">{ticketNumber || '—'}</span>
        </p>
        {fallbackName ? (
          <p className="mt-2 text-sm">
            Scanned name: <strong>{fallbackName}</strong>
          </p>
        ) : null}
      </div>
    );
  }

  if (!resp?.ticket) {
    return (
      <div className="p-8 text-center">
        <div>No ticket found.</div>
      </div>
    );
  }

  const ticket = resp.ticket;
  const checkedDay1 = Boolean(ticket.checkIn?.day1);
  const checkedDay2 = Boolean(ticket.checkIn?.day2);
  const ticketUrl = makeTicketUrl(ticket.ticketNumber);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketUrl)}`;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl text-amber-700 font-bold">Atinuda 5.0 Attendee</h1>

      <div className="rounded-lg border p-4 bg-white space-y-4 text-black">
        <div className="flex items-start gap-4">
          <div className="w-36 flex-shrink-0">
            <img src={qrSrc} alt="QR code" className="w-36 h-36 object-contain rounded-md border" />
            <div className="mt-2 text-xs text-slate-500 text-center">Scan at entrance</div>
          </div>

          <div className="flex-1">
            <div className="text-sm text-slate-600">Source</div>
            <div className="font-semibold">{resp.source ?? 'unknown'}</div>

            <div className="text-sm text-slate-600 mt-3">Name</div>
            <div className="font-semibold text-lg">{ticket.fullName || fallbackName || 'Guest'}</div>

            <div className="mt-3 text-sm text-slate-600">Email</div>
            <div>{ticket.email || '—'}</div>

            <div className="mt-3 text-sm text-slate-600">Ticket Number</div>
            <div className="font-mono">{ticket.ticketNumber}</div>

            <div className="mt-3 text-sm text-slate-600">Ticket Type</div>
            <div>{ticket.ticketType || '—'}</div>

            <div className="mt-3 text-sm text-slate-600">Location</div>
            <div>{ticket.location ?? '—'}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-600">Check-in status</div>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              type="button"
              onClick={() => toggleEvent('day1')}
              disabled={Boolean(actionInProgress)}
              aria-pressed={checkedDay1}
              className={`px-3 py-1 rounded-full text-sm ${
                checkedDay1 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } ${actionInProgress === 'day1' ? 'opacity-70' : ''}`}
            >
              {checkedDay1 ? '✅ Day 1' : '— Day 1'}
            </button>

            <button
              type="button"
              onClick={() => toggleEvent('day2')}
              disabled={Boolean(actionInProgress)}
              aria-pressed={checkedDay2}
              className={`px-3 py-1 rounded-full text-sm ${
                checkedDay2 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } ${actionInProgress === 'day2' ? 'opacity-70' : ''}`}
            >
              {checkedDay2 ? '✅ Day 2' : '— Day 2'}
            </button>

            {CHECK_EVENTS.filter((e) => e.key !== 'day1' && e.key !== 'day2').map(({ key, label }) => {
              const isChecked = Boolean(ticket.checkIn?.[key]) || (key === 'gift' ? Boolean(ticket.giftClaimed) : false);
              const inProgress = actionInProgress === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleEvent(key)}
                  disabled={inProgress}
                  aria-pressed={isChecked}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isChecked ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  } ${inProgress ? 'opacity-70' : ''}`}
                >
                  {isChecked ? `✅ ${label.split(' (')[0]}` : `— ${label.split(' (')[0]}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white text-black flex items-center justify-between">
        <div className="text-sm">{checkedDay1 || checkedDay2 ? '✅ Already checked in' : 'Not checked in'}</div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={actionInProgress !== null || checkedDay1 || checkedDay2}
            onClick={() => checkDayNow('day1')}
            className={`px-4 py-2 rounded-md ${
              checkedDay1 || checkedDay2 ? 'bg-emerald-600 text-white' : 'bg-[#1B365D] text-white hover:opacity-90'
            }`}
          >
            {actionInProgress === 'day1' ? 'Checking…' : checkedDay1 || checkedDay2 ? 'Checked' : 'Check Day 1'}
          </button>
        </div>
      </div>

      {message ? <div className="text-sm text-slate-600">{message}</div> : null}

      <div className="rounded-lg border p-4 bg-white text-black">
        <h3 className="font-semibold mb-2">Important Instructions</h3>
        <ul className="text-sm space-y-1 list-disc list-inside text-slate-700">
          <li>Present this QR code at the entrance</li>
          <li>Keep your ticket downloaded offline</li>
          <li>Arrive 30 minutes early</li>
          <li>Contact support if you encounter issues</li>
        </ul>
      </div>
    </div>
  );
}
