// src/app/attendee-ticket/page.tsx
"use client";

import React from "react";
const h = React.createElement;

type PreviewRow = {
  email: string | null;
  fullName: string;
  ticketNumber: string;
  qrDataUrl: string;
  ticketType?: string;
  location?: string;
};

type PreviewResp = {
  total: number;
  previewCount: number;
  attendees: PreviewRow[];
};

type SendOneResult = {
  ok: boolean;
  sentTo?: string;
  ticketNumber?: string;
  message?: string;
};

/**
 * NOTE: fetching "all" attendees will cause the server to generate many QR images
 * and return many base64/data URLs. For hundreds+ attendees this is heavy — consider
 * generating PDFs/zip server-side and returning a download link instead.
 */

export default function AttendeeTicketPage(): React.ReactElement {
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState<"idle" | "dry" | "send">("idle");
  const [rows, setRows] = React.useState<PreviewRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [log, setLog] = React.useState<string>("");

  // track selected ticketNumbers in preview
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  // track per-ticket sending state & last result
  const [sendingTicket, setSendingTicket] = React.useState<string | null>(null);
  const [lastResultMap, setLastResultMap] = React.useState<Record<string, string>>({});

  // how many to request from the preview endpoint; default 24
  const [limit, setLimit] = React.useState<number>(24);

  // progress counters while sending
  const sendingProgressRef = React.useRef({ attempted: 0, sent: 0, failed: 0 });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setLog("");
        // request preview with current limit
        const res = await fetch(`/api/attendee-ticket?preview=1&limit=${Math.max(1, Math.floor(limit))}`, { cache: "no-store" });
        const json = (await res.json()) as PreviewResp;
        if (!mounted) return;
        setRows(json.attendees || []);
        setTotal(json.total || 0);
        // reset selections & results
        setSelected(new Set());
        setLastResultMap({});
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setLog(msg);
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [limit]);

  // helpers
  function toggleSelect(ticketNumber: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ticketNumber)) next.delete(ticketNumber);
      else next.add(ticketNumber);
      return next;
    });
  }

  function selectAllPreview() {
    setSelected(new Set(rows.map((r) => r.ticketNumber)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function sendSingle(ticketNumber: string, dryRun: boolean): Promise<SendOneResult> {
    try {
      const res = await fetch("/api/send-one-attendee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber, dryRun }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { ok: false, ticketNumber, message: json?.message ?? "Send failed" };
      }
      return { ok: true, ticketNumber, message: json?.message ?? "Sent" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, ticketNumber, message: msg };
    }
  }

  // send sequentially to avoid hitting SMTP provider limits and to give predictable logs
  async function sendSelected(dry: boolean) {
    if (selected.size === 0) {
      setLog("No attendee selected.");
      return;
    }

    setSending(dry ? "dry" : "send");
    setLog("");
    sendingProgressRef.current = { attempted: 0, sent: 0, failed: 0 };

    const list = Array.from(selected);
    const results: Array<SendOneResult & { index: number }> = [];

    for (let i = 0; i < list.length; i += 1) {
      const ticketNumber = list[i];
      sendingProgressRef.current.attempted += 1;
      // update small live log
      setLog((prev) =>
        `Sending ${sendingProgressRef.current.attempted}/${list.length} — ${ticketNumber}\n\n` + prev
      );

      // send and await
      // eslint-disable-next-line no-await-in-loop
      const r = await sendSingle(ticketNumber, dry);
      if (r.ok) sendingProgressRef.current.sent += 1;
      else sendingProgressRef.current.failed += 1;
      results.push({ ...r, index: i });

      // append to log with structured info and update lastResultMap
      setLastResultMap((prev) => ({ ...prev, [ticketNumber]: r.ok ? `✅ ${r.message}` : `❌ ${r.message}` }));
      setLog((prev) => {
        const prefix = r.ok ? "✅" : "❌";
        return `${prefix} [${ticketNumber}] ${r.message ?? ""}\n` + prev;
      });

      // tiny delay between sends (500ms) to reduce throttling
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500));
    }

    const summary = `Done. attempted=${sendingProgressRef.current.attempted} sent=${sendingProgressRef.current.sent} failed=${sendingProgressRef.current.failed}`;
    setLog((prev) => summary + "\n\n" + prev);
    setSending("idle");
  }

  // also provide convenience to send single card's email (this is the "one-click" behavior)
  async function sendCard(ticketNumber: string, dry: boolean) {
    // set UI state for single-card sending
    setSending(dry ? "dry" : "send");
    setSendingTicket(ticketNumber);
    setLog("");
    setLog(`Sending ${ticketNumber}...\n`);

    // call endpoint directly
    const r = await sendSingle(ticketNumber, dry);
    const prefix = r.ok ? "✅" : "❌";
    const message = `${prefix} [${ticketNumber}] ${r.message ?? ""}`;

    // update per-card last result and global log
    setLastResultMap((prev) => ({ ...prev, [ticketNumber]: message }));
    setLog((prev) => message + "\n\n" + prev);

    // small visual delay so user sees "Sending…" then result
    await new Promise((r) => setTimeout(r, 250));
    setSending("idle");
    setSendingTicket(null);
  }

  return h(
    "div",
    { className: "max-w-6xl mx-auto px-4 py-8" },
    h("h1", { className: "text-2xl font-bold" }, "Attendee Ticket Mailer"),
    h(
      "p",
      { className: "mt-1 text-sm text-slate-600" },
      total ? `Total attendees detected: ${total}` : "Loading count…"
    ),

    // controls
    h(
      "div",
      { className: "mt-4 flex flex-wrap items-center gap-2" },
      h(
        "button",
        {
          className:
            "rounded-md border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50",
          disabled: sending !== "idle" || loading,
          onClick: () => sendSelected(true),
        },
        sending === "dry" ? "Dry running selected…" : "Dry run selected"
      ),
      h(
        "button",
        {
          className:
            "rounded-md bg-[#1B365D] text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50",
          disabled: sending !== "idle" || loading,
          onClick: () => sendSelected(false),
        },
        sending === "send" ? "Sending selected…" : "Send selected"
      ),
      h(
        "div",
        { className: "ml-3 flex items-center gap-2" },
        h(
          "button",
          {
            className:
              "rounded-md border px-3 py-1 text-sm hover:bg-slate-50",
            disabled: loading,
            onClick: selectAllPreview,
          },
          "Select all preview"
        ),
        h(
          "button",
          {
            className: "rounded-md border px-3 py-1 text-sm hover:bg-slate-50",
            disabled: loading,
            onClick: clearSelection,
          },
          "Clear selection"
        ),
        // Load all control: only show if total is known and we haven't already loaded them
        total > 0 && rows.length < total
          ? h(
              "button",
              {
                className: "rounded-md border px-3 py-1 text-sm hover:bg-slate-50",
                disabled: loading,
                onClick: () => {
                  // set limit to total to fetch all attendees (may be heavy)
                  setLimit(total);
                },
              },
              `Load all (${total})`
            )
          : null
      )
    ),

    // preview grid
    h(
      "div",
      { className: "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" },
      loading
        ? h("div", { className: "text-sm text-black text-slate-600" }, "Loading preview…")
        : rows.map((r) =>
            h(
              "div",
              {
                key: (r.email || "no-email") + r.ticketNumber,
                className:
                  "rounded-lg border border-slate-200 p-4 bg-white flex flex-col text-black items-center",
              },
              // QR image
              h("img", {
                src: r.qrDataUrl,
                alt: "QR",
                className: "w-40 h-40 object-contain",
              }),
              // details
              h(
                "div",
                { className: "mt-2 text-center text-black" },
                h("div", { className: "font-semibold" }, r.fullName),
                h("div", { className: "text-sm text-slate-600" }, r.email || "—"),
                h(
                  "div",
                  { className: "text-sm font-mono mt-1" },
                  r.ticketNumber
                ),
                r.ticketType ? h("div", { className: "text-xs text-slate-500 mt-1" }, r.ticketType) : null,
                // show last result for this card if any
                lastResultMap[r.ticketNumber]
                  ? h("div", { className: "mt-2 text-xs" }, lastResultMap[r.ticketNumber])
                  : null
              ),
              // actions row
              h(
                "div",
                { className: "mt-3 flex gap-2" },
                // select toggle
                h(
                  "button",
                  {
                    className:
                      "rounded-md border px-3 py-1 text-sm hover:bg-slate-50",
                    onClick: () => toggleSelect(r.ticketNumber),
                  },
                  selected.has(r.ticketNumber) ? "Selected ✓" : "Select"
                ),
                // send single dry
                h(
                  "button",
                  {
                    className: "rounded-md border px-3 py-1 text-sm",
                    onClick: () => void sendCard(r.ticketNumber, true),
                    disabled: sending !== "idle" || sendingTicket === r.ticketNumber,
                  },
                  sendingTicket === r.ticketNumber && sending === "dry" ? "Sending…" : "Dry send"
                ),
                // send single live (one-click real-send)
                h(
                  "button",
                  {
                    className: "rounded-md bg-[#1B365D] text-white px-3 py-1 text-sm",
                    onClick: () => void sendCard(r.ticketNumber, false),
                    disabled: sending !== "idle" || sendingTicket === r.ticketNumber,
                  },
                  sendingTicket === r.ticketNumber && sending === "send" ? "Sending…" : "Send"
                )
              )
            )
          )
    ),

    // last result / log
    h(
      "div",
      { className: "mt-8" },
      h("h2", { className: "font-semibold mb-2" }, "Last result"),
      h(
        "pre",
        {
          className:
            "text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto max-h-64",
        },
        log || "No result yet."
      )
    )
  );
}
