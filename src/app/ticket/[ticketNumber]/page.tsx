"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type TicketPayload = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location?: string | null;
  checkIn?: Record<string, boolean> | null;
  // allow optional giftClaimed compatibility
  giftClaimed?: boolean;
};

type ApiResp = {
  ok: boolean;
  source?: "tickets" | "payments" | "attendees";
  ticket?: TicketPayload | null;
  message?: string;
};

const CHECK_EVENTS = [
  { key: "azizi", label: "Azizi (Oct 6)" },
  { key: "day1", label: "Conference Day 1 (Oct 7)" },
  { key: "day2", label: "Conference Day 2 (Oct 8)" },
  { key: "dinner", label: "Dinner (Oct 8 — 6pm)" },
  { key: "breakout", label: "Breakout sessions (Oct 7)" },
  { key: "masterclass", label: "Masterclass (Oct 8)" },
  { key: "gift", label: "Gift claimed" },
] as const;

function normTicket(t: string | undefined): string {
  if (!t) return "";
  try {
    return decodeURIComponent(String(t)).toUpperCase().trim();
  } catch {
    return String(t).toUpperCase().trim();
  }
}

function makeTicketUrl(ticketNumber: string): string {
  const site =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")) ||
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!site) return `/ticket/${encodeURIComponent(ticketNumber)}`;
  return `${site}/ticket/${encodeURIComponent(ticketNumber)}`;
}

export default function TicketPage(): React.ReactElement {
  const params = useParams() as { ticketNumber?: string | string[] } | null;
  const rawParam = Array.isArray(params?.ticketNumber)
    ? params?.ticketNumber[0]
    : params?.ticketNumber;
  const ticketNumber = normTicket(rawParam);

  const search = useSearchParams();
  const fallbackName = (search?.get("name") ?? "").trim();
  const slug = (search?.get("slug") ?? "").trim();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  async function fetchTicket(): Promise<void> {
    setLoading(true);
    setError("");
    setMessage("");
    setResp(null);
    try {
      if (!ticketNumber) {
        setError("Invalid ticket link (no ticket number).");
        return;
      }
      const slug = (search?.get("slug") ?? "").trim();
      const qs = new URLSearchParams({ ticketNumber });
      if (slug) qs.set("slug", slug);

      const res = await fetch(`/api/ticket-by-number?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        // try parse JSON message, otherwise fallback to status
        let bodyText = "";
        try {
          const json = (await res.json()) as { message?: string } | null;
          bodyText = json?.message ?? "";
        } catch {
          bodyText = "";
        }
        throw new Error(bodyText || `Lookup failed: ${res.status}`);
      }
      const json = (await res.json()) as ApiResp;
      if (!json.ok || !json.ticket) {
        setError(json.message ?? "Ticket not found.");
        return;
      }
      setResp(json);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketNumber, slug]);

  /**
   * Toggle an event key (check / uncheck).
   * Sends { ticketNumber, event, status } where status = !current
   */
  async function toggleEvent(eventKey: string): Promise<void> {
    if (!ticketNumber) return;

    const currentlyChecked = Boolean(
      resp?.ticket?.checkIn?.[eventKey] ??
        (eventKey === "gift" ? resp?.ticket?.giftClaimed ?? false : false)
    );

    const desiredStatus = !currentlyChecked;

    // prevent duplicate requests for same key
    if (actionInProgress === eventKey) return;

    setActionInProgress(eventKey);
    setMessage("");

    // debug
    console.debug("toggleEvent:", eventKey, "currentlyChecked:", currentlyChecked, "desired:", desiredStatus);

    try {
      // <-- KEY CHANGE: send `event` (API expects `event`) not `eventKey`
      const res = await fetch("/api/checkins/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber, event: eventKey, status: desiredStatus, slug }),
      });

      // Handle non-JSON responses gracefully
      let jsonBody: unknown = null;
      try {
        jsonBody = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(
          text && text.length < 2000 ? text.replace(/\s+/g, " ").trim() : `Unexpected response (${res.status})`
        );
      }

      if (!res.ok) {
        // safely extract message if available
        let maybeMsg = `Check-in failed: ${res.status}`;
        if (
          typeof jsonBody === "object" &&
          jsonBody !== null &&
          "message" in jsonBody &&
          typeof (jsonBody as Record<string, unknown>).message === "string"
        ) {
          maybeMsg = (jsonBody as Record<string, unknown>).message as string;
        }
        throw new Error(maybeMsg);
      }

      // success -> refresh ticket to reflect check-in
      await fetchTicket();
      setMessage(desiredStatus ? "Checked in ✅" : "Unchecked ✅");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg || "Check-in failed");
    } finally {
      setActionInProgress(null);
    }
  }

  // convenience wrapper used by top-level "Check Day 1" button previously
  async function checkDayNow(dayKey: string) {
    await toggleEvent(dayKey);
  }

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
          Ticket: <span className="font-mono">{ticketNumber || "—"}</span>
        </p>
        {fallbackName ? (
          <p className="mt-2 text-sm">
            Scanned name: <strong>{fallbackName}</strong>
          </p>
        ) : null}
      </div>
    );
  }

  if (!resp || !resp.ticket) {
    return (
      <div className="p-8 text-center">
        <div>No ticket found.</div>
      </div>
    );
  }

  const t = resp.ticket;
  const checkedDay1 = Boolean(t.checkIn?.day1 ?? false);
  const checkedDay2 = Boolean(t.checkIn?.day2 ?? false);

  // Build QR image (public QR generation service) pointing to ticket page for scanning
  const ticketUrl = makeTicketUrl(t.ticketNumber);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketUrl)}`;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl text-amber-700 font-bold">Atinuda 5.0 Attendee </h1>

      <div className="rounded-lg border p-4 bg-white space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-36 flex-shrink-0">
            <img src={qrSrc} alt="QR code" className="w-36 h-36 object-contain rounded-md border" />
            <div className="mt-2 text-xs text-slate-500 text-center">Scan at entrance</div>
          </div>

          <div className="flex-1 text-black">
            <div className="text-sm text-slate-600">Source</div>
            <div className="font-semibold">{resp.source ?? "unknown"}</div>

            <div className="text-sm text-slate-600 mt-3">Name</div>
            <div className="font-semibold text-lg">{t.fullName || fallbackName || "Guest"}</div>

            <div className="mt-3 text-sm text-slate-600">Email</div>
            <div>{t.email || "—"}</div>

            <div className="mt-3 text-sm text-slate-600">Ticket Number</div>
            <div className="font-mono">{t.ticketNumber}</div>

            <div className="mt-3 text-sm text-slate-600">Ticket Type</div>
            <div>{t.ticketType || "—"}</div>

            <div className="mt-3 text-sm text-slate-600">Location</div>
            <div>{t.location ?? "—"}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-600">Check-in status</div>
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Day 1 & Day 2 explicit — clickable */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!actionInProgress) void toggleEvent("day1");
              }}
              disabled={Boolean(actionInProgress)}
              aria-pressed={checkedDay1}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                checkedDay1 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } ${actionInProgress === "day1" ? "opacity-70" : ""}`}
              title={checkedDay1 ? "Click to uncheck Day 1" : "Click to check Day 1"}
            >
              {checkedDay1 ? "✅ Day 1" : "— Day 1"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!actionInProgress) void toggleEvent("day2");
              }}
              disabled={Boolean(actionInProgress)}
              aria-pressed={checkedDay2}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                checkedDay2 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } ${actionInProgress === "day2" ? "opacity-70" : ""}`}
              title={checkedDay2 ? "Click to uncheck Day 2" : "Click to check Day 2"}
            >
              {checkedDay2 ? "✅ Day 2" : "— Day 2"}
            </button>

            {/* other events as clickable pills */}
            {CHECK_EVENTS.filter((e) => e.key !== "day1" && e.key !== "day2").map((e) => {
              const isChecked =
                Boolean(t.checkIn?.[e.key] ?? false) || (e.key === "gift" ? Boolean(t.giftClaimed ?? false) : false);
              const inProgress = actionInProgress === e.key;
              return (
                <button
                  key={e.key}
                  type="button"
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (!inProgress) void toggleEvent(e.key);
                  }}
                  disabled={Boolean(inProgress)}
                  aria-pressed={isChecked}
                  title={isChecked ? `${e.label} — checked` : `Click to toggle ${e.label}`}
                  className={`px-3 py-1 rounded-full text-sm inline-flex items-center gap-2 select-none ${
                    isChecked
                      ? "bg-red-100 text-red-800 cursor-default"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } ${inProgress ? "opacity-70" : ""}`}
                >
                  <span className="text-sm">{isChecked ? `✅ ${e.label.split(" (")[0]}` : `— ${e.label.split(" (")[0]}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg text-black border p-4 bg-white flex items-center justify-between">
        <div className="text-sm">{checkedDay1 || checkedDay2 ? "✅ Already checked in" : "Not checked in"}</div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={actionInProgress !== null || checkedDay1 || checkedDay2}
            onClick={() => void checkDayNow("day1")}
            className={
              "px-4 py-2 rounded-md " +
              (checkedDay1 || checkedDay2 ? "bg-emerald-600 text-white" : "bg-[#1B365D] text-white hover:opacity-90")
            }
          >
            {actionInProgress === "day1" ? "Checking…" : checkedDay1 || checkedDay2 ? "Checked" : "Check Day 1"}
          </button>
        </div>
      </div>

      {message ? <div className="text-sm text-slate-600">{message}</div> : null}

      <div className="rounded-lg text-black border p-4 bg-white">
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
