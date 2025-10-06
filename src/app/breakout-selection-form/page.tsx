"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SESSIONS from "@/lib/breakout";

/**
 * Types
 */
type Session = {
  id: string;
  round: number;
  room?: string;
  track?: string;
  title: string;
  speakers: string[];
  moderator?: string | null;
  startsAt?: string;
};

type Selections = Record<number, string | null>;

function roomLabel(room?: string) {
  return room ? `Location: Lagos Continental — ${room}` : "Location: Lagos Continental";
}

/* Full page component — paste this file as app/tickets/breakouts/page.tsx */
export default function BreakoutsPage() {
  // typed sessions (no `any`)
  const sessions = (SESSIONS as unknown) as Session[];

  const sessionsByRound = useMemo(() => {
    const map = new Map<number, Session[]>();
    sessions.forEach((s) => {
      const arr = map.get(s.round) ?? [];
      arr.push(s);
      map.set(s.round, arr);
    });
    return map;
  }, [sessions]);

  // Control whether the form area is visible; keep default true if you want it visible immediately
  const [open, setOpen] = useState(true);

  // ticket verification state
  const [ticketValue, setTicketValue] = useState("");
  const [ticketValid, setTicketValid] = useState<boolean | null>(null);
  const [ticketChecking, setTicketChecking] = useState(false);

  // identity fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // selections (one pick per round)
  const [selections, setSelections] = useState<Selections>({ 1: null, 2: null, 3: null });

  const [submitting, setSubmitting] = useState(false);

  // debounce timer and lastVerified cache
  const debounceRef = useRef<number | null>(null);
  const lastVerifiedRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Debounced auto-verify: triggers when ticketValue changes and user stops typing.
  useEffect(() => {
    // clear previous debounce
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const trimmed = ticketValue.trim();
    if (!trimmed) {
      // empty -> reset state & cache
      setTicketValid(null);
      lastVerifiedRef.current = null;
      return;
    }

    // if we've already verified this exact ticket, do nothing
    if (lastVerifiedRef.current === trimmed) {
      return;
    }

    // schedule verify after 600ms
    const timer = window.setTimeout(() => {
      void doVerify(trimmed);
    }, 600);
    debounceRef.current = timer;

    return () => {
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketValue]);

  // verify function uses your /api/verify-ticket unchanged; does NOT close UI
  async function doVerify(ticket: string) {
    if (!isMountedRef.current) return;

    setTicketChecking(true);
    setTicketValid(null);

    try {
      const res = await fetch(`/api/verify-ticket?ticketNumber=${encodeURIComponent(ticket)}`);
      const json = await res.json();

      if (json?.ok) {
        setTicketValid(true);
        lastVerifiedRef.current = ticket;
        toast.success("Ticket verified.");

        // Optional quiet autofill if you provide /api/ticket-details
        try {
          const detailsRes = await fetch(`/api/ticket-details?ticketNumber=${encodeURIComponent(ticket)}`);
          if (detailsRes.ok) {
            const detailsJson = await detailsRes.json();
            if (detailsJson?.ok) {
              if (typeof detailsJson.name === "string" && detailsJson.name.trim().length > 0) {
                setName(detailsJson.name);
              }
              if (typeof detailsJson.email === "string" && detailsJson.email.trim().length > 0) {
                setEmail(detailsJson.email);
              }
            }
          }
        } catch {
          // ignore — endpoint optional
        }
      } else {
        setTicketValid(false);
        toast.error("Ticket not found. You can continue and provide name/email.");
      }
    } catch {
      setTicketValid(false);
      toast.error("Ticket verification failed.");
    } finally {
      if (isMountedRef.current) setTicketChecking(false);
    }
  }

  function chooseSession(round: number, sessionId: string) {
    setSelections((prev) => ({ ...prev, [round]: sessionId }));
  }

  function showFallbackIdentity() {
    return ticketValue.trim().length === 0 || ticketValid === false;
  }

  function validateBeforeSubmit(): string | null {
    const anySelected = Object.values(selections).some(Boolean);
    if (!anySelected) return "Choose at least one breakout session (one per round).";

    if (showFallbackIdentity()) {
      if (!name.trim()) return "Please provide name.";
      if (!email.trim()) return "Please provide email.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please provide a valid email address.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

    const toastId = toast.loading("Saving selections…");
    try {
      setSubmitting(true);
      const res = await fetch("/api/breakouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        if (res.status === 409) {
          toast.dismiss(toastId);
          toast.error(json?.message ?? "Selections already saved for this ticket.");
        } else {
          throw new Error(json?.message ?? "Save failed");
        }
        return;
      }

      toast.dismiss(toastId);
      toast.success("Saved — your breakout selections are recorded.");

      // Do NOT automatically close the page; keep the UI available.
      // Reset the form
      setTicketValue("");
      setTicketValid(null);
      lastVerifiedRef.current = null;
      setName("");
      setEmail("");
      setSelections({ 1: null, 2: null, 3: null });
    } catch (error) {
      toast.dismiss(toastId);
      const msg = error instanceof Error ? error.message : "Save failed. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function sessionCard(s: Session, round: number) {
    const selected = selections[round] === s.id;
    return (
      <label
        key={s.id}
        className={`block p-4 rounded-lg border ${selected ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white"} cursor-pointer`}
      >
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name={`round-${round}`}
            checked={selected}
            onChange={() => chooseSession(round, s.id)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-semibold text-black">{s.title}</div>
            <div className="mt-1 text-orange-500 text-sm">
              Speakers: {s.speakers.join(", ")}
              {s.moderator ? <span className="ml-2"> — Moderator: {s.moderator}</span> : null}
            </div>
            <div className="mt-2 text-sm text-slate-600">{roomLabel(s.room)} · {s.track}</div>
            {s.startsAt && <div className="text-xs text-slate-500 mt-1">{s.startsAt}</div>}
          </div>
        </div>
      </label>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-[#0b5fff] text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Breakout sessions — sign up</h1>
          <p className="mt-2">Enter your ticket to auto-validate, then pick the sessions you want to attend.</p>
        </div>
      </div>

      {open && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Ticket */}
            <div>
              <label className="block text-sm font-medium">Ticket number (optional)</label>

              <div className="mt-1">
                <input
                  value={ticketValue}
                  onChange={(e) => setTicketValue(e.target.value)}
                  placeholder="e.g. PREM-ATIN83511"
                  className={`w-full rounded-lg border px-3 py-2 ${ticketValid === false ? "border-red-500" : "border-slate-300"}`}
                  aria-label="ticket-number"
                />
              </div>

              {ticketChecking && <p className="text-xs text-slate-500 mt-1">Checking ticket…</p>}
              {ticketValid === true && !ticketChecking && <p className="text-xs text-emerald-700 mt-1">Ticket valid.</p>}
              {ticketValid === false && <p className="text-xs text-red-600 mt-1">Ticket not found. Provide name/email below.</p>}
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Rounds */}
            {Array.from(sessionsByRound.keys())
              .sort()
              .map((round) => (
                <div key={round}>
                  <h3 className="font-semibold mb-2">
                    {round === 1 ? "Round 1 — 12:00 – 2:10 PM" : round === 2 ? "Round 2 — 2:45 – 3:45 PM" : "Round 3 — 4:00 – 5:00 PM"}
                  </h3>
                  <div className="grid gap-3">
                    {(sessionsByRound.get(round) ?? []).map((s) => sessionCard(s, round))}
                  </div>
                </div>
              ))}

            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="consent" required className="mt-1" />
              <span>I agree to receive communications and confirm my selections.</span>
            </label>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2">
                Hide
              </button>
              <button type="submit" disabled={submitting} className="rounded-lg bg-[#1B365D] px-5 py-2 text-white">
                {submitting ? "Saving…" : "Save selections"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
