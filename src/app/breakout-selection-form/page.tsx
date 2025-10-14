// app/tickets/breakouts/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import SESSIONS from '@/lib/breakout'; // ensure this file exists and contains round===4 workshops

const h = React.createElement;

/* ----------------------
   Types
-----------------------*/
type Session = {
  id: string;
  round: 1 | 2 | 3 | 4;
  room?: string;
  track?: string;
  title: string;
  speakers: string[];
  moderator?: string;
  startsAt?: string;
};

type Selections = Record<'1' | '2' | '3' | '4', string | null>;

/* ----------------------
   Config
-----------------------*/
const WORKSHOP_PREFIXES = ['WRK', 'CONF', 'PREM'];

function roomLabel(r?: string) {
  return r ? `Location: Lagos Continental — ${r}` : 'Location: Lagos Continental';
}
function ticketPrefixAllowsWorkshop(ticketNumber?: string | null) {
  if (!ticketNumber) return false;
  const t = String(ticketNumber).toUpperCase().trim();
  const prefix = t.split(/[-_\s]/)[0];
  return WORKSHOP_PREFIXES.includes(prefix);
}

/* ----------------------
   Component (NO JSX)
-----------------------*/
export default function BreakoutsPage(): React.ReactElement {
  const sessions = (SESSIONS as unknown) as Session[];

  const sessionsByRound = useMemo(() => {
    const m = new Map<number, Session[]>();
    sessions.forEach((s) => {
      const arr = m.get(s.round) ?? [];
      arr.push(s);
      m.set(s.round, arr);
    });
    return m;
  }, [sessions]);

  // UI state
  const [ticketValue, setTicketValue] = useState<string>('');
  const [ticketValid, setTicketValid] = useState<boolean | null>(null);
  const [ticketChecking, setTicketChecking] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [selections, setSelections] = useState<Selections>({ '1': null, '2': null, '3': null, '4': null });

  const [submitting, setSubmitting] = useState<boolean>(false);

  const debounceRef = useRef<number | null>(null);
  const lastVerified = useRef<string | null>(null);
  const mounted = useRef(true);
  const [showWorkshops, setShowWorkshops] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  // debounced ticket verification
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const t = ticketValue.trim();
    if (!t) {
      setTicketValid(null);
      lastVerified.current = null;
      setShowWorkshops(false);
      return;
    }
    if (lastVerified.current === t) {
      setShowWorkshops(ticketPrefixAllowsWorkshop(t));
      return;
    }
    const id = window.setTimeout(() => void verifyTicket(t), 450);
    debounceRef.current = id;
    return () => {
      if (id) window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketValue]);

  async function verifyTicket(ticket: string) {
    if (!mounted.current) return;
    setTicketChecking(true);
    setTicketValid(null);
    try {
      const res = await fetch(`/api/verify-ticket?ticketNumber=${encodeURIComponent(ticket)}`);
      const data = await res.json();
      if (data?.ok) {
        setTicketValid(true);
        lastVerified.current = ticket;
        toast.success('Ticket verified.');
        // optional canonicalization
        let canonical = ticket;
        try {
          const dres = await fetch(`/api/ticket-details?ticketNumber=${encodeURIComponent(ticket)}`);
          if (dres.ok) {
            const details = await dres.json();
            if (details?.ok) {
              if (typeof details.name === 'string' && details.name.trim()) setName(details.name);
              if (typeof details.email === 'string' && details.email.trim()) setEmail(details.email);
              if (typeof details.ticketNumber === 'string' && details.ticketNumber.trim()) canonical = details.ticketNumber;
            }
          }
        } catch {
          // ignore optional endpoint errors
        }
        setShowWorkshops(ticketPrefixAllowsWorkshop(canonical));
      } else {
        setTicketValid(false);
        setShowWorkshops(false);
        toast.error('Ticket not found. You may continue with name/email.');
      }
    } catch (err) {
      setTicketValid(false);
      setShowWorkshops(false);
      toast.error('Ticket verification failed.');
      // eslint-disable-next-line no-console
      console.error('verifyTicket', err);
    } finally {
      if (mounted.current) setTicketChecking(false);
    }
  }

  function selectSession(roundKey: keyof Selections, sessionId: string) {
    setSelections((p) => ({ ...p, [roundKey]: sessionId }));
  }

  function validateBeforeSubmit(): string | null {
    const ok = ['1', '2', '3'].every((r) => Boolean(selections[r as keyof Selections]));
    if (!ok) return 'Select one session for each main round (Rounds 1, 2 & 3).';

    const needFallback = !ticketValue.trim() || ticketValid === false;
    if (needFallback) {
      if (!name.trim()) return 'Please provide name.';
      if (!email.trim()) return 'Please provide email.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please provide a valid email address.';
    return null;
  }

  async function handleSubmit(e: Event) {
    try {
      e.preventDefault();
    } catch {
      // ignore
    }
    const err = validateBeforeSubmit();
    if (err) {
      toast.error(err);
      return;
    }
    const payload = {
      ticket_number: ticketValue.trim() || null,
      name: name.trim() || null,
      email: email.trim() || null,
      selections,
    };
    const toastId = toast.loading('Saving selections…');
    try {
      setSubmitting(true);
      const res = await fetch('/api/breakouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body?.ok) {
        if (res.status === 409) {
          toast.dismiss(toastId);
          toast.error(body?.message ?? 'Selections already saved for this ticket.');
          return;
        }
        throw new Error(body?.message ?? 'Save failed');
      }
      toast.dismiss(toastId);
      toast.success('Saved — selections recorded.');
      // reset
      setTicketValue('');
      setTicketValid(null);
      lastVerified.current = null;
      setName('');
      setEmail('');
      setSelections({ '1': null, '2': null, '3': null, '4': null });
      setShowWorkshops(false);
    } catch (err) {
      toast.dismiss(toastId);
      const msg = err instanceof Error ? err.message : 'Save failed';
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error('submit', err);
    } finally {
      setSubmitting(false);
    }
  }

  /* ----------------------
     Render helpers (no JSX)
  -----------------------*/
  function sessionCard(session: Session, roundKey: keyof Selections) {
    const selected = selections[roundKey] === session.id;
    const border = selected ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white';
    return h(
      'label',
      { key: session.id, className: `block p-4 rounded-lg border ${border} cursor-pointer` },
      h(
        'div',
        { className: 'flex items-start gap-3' },
        h('input', {
          type: 'radio',
          name: `round-${String(roundKey)}`,
          checked: selected,
          onChange: () => selectSession(roundKey, session.id),
          className: 'mt-1',
        }),
        h(
          'div',
          { className: 'flex-1' },
          h('div', { className: 'font-semibold text-black' }, session.title),
          h(
            'div',
            { className: 'mt-1 text-orange-500 text-sm' },
            `Speakers: ${Array.isArray(session.speakers) ? session.speakers.join(', ') : ''}`,
            session.moderator ? h('span', { className: 'ml-2' }, ` — Moderator: ${session.moderator}`) : null
          ),
          h('div', { className: 'mt-2 text-sm text-slate-600' }, `${roomLabel(session.room)}${session.track ? ` · ${session.track}` : ''}`),
          session.startsAt ? h('div', { className: 'text-xs text-slate-500 mt-1' }, session.startsAt) : null
        )
      )
    );
  }

  /* ----------------------
     Page composition
     - Note: header removed per request — only hero + form
  -----------------------*/

  const hero = h(
    'div',
    { className: 'relative h-[320px] w-full sm:h-[380px] md:h-[420px]' },
    h(Image, { src: '/assets/images/elementtwo.png', alt: 'Ticket Banner', fill: true, className: 'object-cover', priority: true }),
    h('div', { className: 'absolute inset-0 z-10 bg-black/40' }),
    h('div', { className: 'absolute inset-0 z-20 flex items-center justify-center' }, h('h1', { className: 'text-center text-4xl font-bold text-white md:text-6xl' }, 'Breakout Registration'))
  );

  const form = h(
    'div',
    { className: 'max-w-5xl mx-auto px-4 py-8' },
    h(
      'form',
      {
        onSubmit: (ev: React.FormEvent) => {
          try {
            ev.preventDefault();
          } catch {
            // ignore
          }
          void handleSubmit(ev as unknown as Event);
        },
        className: 'grid gap-6',
      },
      // ticket input
      h(
        'div',
        null,
        h('label', { className: 'block text-sm font-medium text-black' }, 'Ticket number'),
        h(
          'div',
          { className: 'mt-1' },
          h('input', {
            value: ticketValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTicketValue(e.target.value),
            placeholder: 'e.g. PREM-ATIN83511',
            className: `w-full rounded-lg border px-3 py-2 ${ticketValid === false ? 'border-red-500' : 'border-slate-300'}`,
            'aria-label': 'ticket-number',
          })
        ),
        ticketChecking ? h('p', { className: 'text-xs text-slate-500 mt-1' }, 'Checking ticket…') : null,
        ticketValid === true && !ticketChecking ? h('p', { className: 'text-xs text-emerald-700 mt-1' }, 'Ticket valid.') : null,
        ticketValid === false ? h('p', { className: 'text-xs text-red-600 mt-1' }, 'Ticket not found. Provide name/email below.') : null
      ),

      // name + email
      h(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
        h(
          'div',
          null,
          h('label', { className: 'block text-sm font-medium text-black' }, 'Name'),
          h('input', {
            value: name,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
            name: 'name',
            placeholder: 'Full name',
            className: 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2',
          })
        ),
        h(
          'div',
          null,
          h('label', { className: 'block text-sm font-medium text-black' }, 'Email'),
          h('input', {
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
            name: 'email',
            type: 'email',
            placeholder: 'you@example.com',
            className: 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2',
          })
        )
      ),

      // rounds 1..3
      ...[1, 2, 3].map((round) =>
        h(
          'section',
          { key: `r-${round}` },
          h('h3', { className: 'font-semibold mb-2 text-black' }, round === 1 ? 'Round 1 — 12:00 – 2:10 PM' : round === 2 ? 'Round 2 — 2:45 – 3:45 PM' : 'Round 3 — 4:00 – 5:00 PM'),
          h('div', { className: 'grid gap-3' }, ...(sessionsByRound.get(round) ?? []).map((s) => sessionCard(s, String(round) as keyof Selections)))
        )
      ),

      // Day 2 workshops — conditional and separate header
      showWorkshops && (sessionsByRound.get(4) ?? []).length > 0
        ? h(
            'section',
            { key: 'day2', className: 'mt-8' },
            h('h2', { className: 'text-2xl font-bold mb-1 text-black' }, 'Day 2 — Workshops & Masterclasses (2:00 – 4:00 PM)'),
            h('p', { className: 'text-sm text-slate-600 mb-4' }, 'Visible only for WRK, EXEC, PREM ticket holders. Choose one workshop.'),
            h('div', { className: 'grid gap-3' }, ...(sessionsByRound.get(4) ?? []).map((s) => sessionCard(s, '4')))
          )
        : null,

      // consent
      h('label', { className: 'flex items-start text-black gap-3 text-sm' }, h('input', { type: 'checkbox', name: 'consent', required: true, className: 'mt-1' }), h('span', null, 'I agree to receive communications and confirm my selections.')),

      // actions
      h('div', { className: 'flex gap-3 justify-end' }, h('button', { type: 'button', className: 'rounded-lg border px-4 py-2' }, 'Cancel'), h('button', {
        type: 'submit',
        disabled: submitting,
        className: `rounded-lg px-5 py-2 text-white ${submitting ? 'bg-gray-400' : 'bg-[#1B365D]'}`,
        onClick: (ev: React.MouseEvent) => {
          try {
            ev.preventDefault();
          } catch {}
          void handleSubmit(ev.nativeEvent as unknown as Event);
        },
      }, submitting ? 'Saving…' : 'Save selections'))
    )
  );

  const page = h(React.Fragment, null, h(Toaster, { position: 'top-center' }), hero, form);
  return page;
}
