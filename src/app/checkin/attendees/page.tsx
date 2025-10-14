// app/checkin/attendees/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ATTENDEES } from "@/lib/attendee";

const h = React.createElement;

type StatusMap = Record<string, { checked: boolean; at?: string | null; by?: string | null }>;

export default function Page() {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ATTENDEES;
    return ATTENDEES.filter((a) => {
      return (
        (a.fullName || "").toLowerCase().includes(s) ||
        (a.email || "").toLowerCase().includes(s) ||
        (a.ticketNumber || "").toLowerCase().includes(s) ||
        (a.ticketType || "").toLowerCase().includes(s)
      );
    });
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/checkins");
        const j = await r.json();
        if (!cancelled && j.ok) setStatuses(j.statuses || {});
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function checkin(ticketNumber: string) {
    setBusyId(ticketNumber);
    setMsg("");
    try {
      const r = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber, checker: "list" }),
      });
      const j = await r.json();
      if (r.ok && j.ok) {
        setStatuses((prev) => ({ ...prev, [ticketNumber]: { checked: true, at: new Date().toISOString(), by: "list" } }));
      } else {
        setMsg(j?.message || "Failed to check in");
      }
    } catch {
      setMsg("Failed to check in");
    } finally {
      setBusyId(null);
    }
  }

  const header = h(
    "div",
    { className: "relative h-[200px] w-full" },
    h("div", { className: "absolute inset-0 bg-[url('/assets/images/elementtwo.png')] bg-cover bg-center" }),
    h("div", { className: "absolute inset-0 bg-black/40" }),
    h(
      "div",
      { className: "relative z-10 h-full flex items-center justify-center" },
      h("h1", { className: "text-white text-3xl md:text-5xl font-bold text-center" }, "Attendees — Check-in List")
    )
  );

  const controls = h(
    "div",
    { className: "max-w-6xl mx-auto px-4 py-4 flex items-center gap-3" },
    h("input", {
      value: q,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
      placeholder: "Search name, email, ticket #, type…",
      className: "w-full md:w-[480px] rounded-lg border border-slate-300 px-3 py-2",
    }),
    msg ? h("div", { className: "text-sm text-rose-600" }, msg) : null
  );

  const table = h(
    "div",
    { className: "max-w-6xl mx-auto px-4 pb-10" },
    h(
      "div",
      { className: "overflow-x-auto rounded-xl border border-slate-200 bg-white" },
      h(
        "table",
        { className: "min-w-full text-sm" },
        h(
          "thead",
          { className: "bg-slate-50" },
          h(
            "tr",
            null,
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Name"),
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Email"),
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Ticket #"),
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Type"),
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Checked In"),
            h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "")
          )
        ),
        h(
          "tbody",
          null,
          ...filtered.map((a) => {
            const st = statuses[a.ticketNumber] || { checked: false };
            return h(
              "tr",
              { key: a.ticketNumber, className: "border-t border-slate-100" },
              h("td", { className: "px-3 py-2" }, a.fullName || "—"),
              h("td", { className: "px-3 py-2 text-slate-700" }, a.email || "—"),
              h("td", { className: "px-3 py-2 font-mono" }, a.ticketNumber || "—"),
              h("td", { className: "px-3 py-2" }, a.ticketType || "—"),
              h(
                "td",
                { className: "px-3 py-2" },
                h(
                  "span",
                  {
                    className:
                      "inline-flex items-center rounded-full px-2.5 py-1 " +
                      (st.checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"),
                  },
                  st.checked ? "Yes" : "No"
                )
              ),
              h(
                "td",
                { className: "px-3 py-2 text-right" },
                h(
                  "button",
                  {
                    disabled: st.checked || busyId === a.ticketNumber,
                    onClick: () => checkin(a.ticketNumber),
                    className:
                      "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium " +
                      (st.checked || busyId === a.ticketNumber
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-[#1B365D] text-white hover:opacity-90"),
                  },
                  busyId === a.ticketNumber ? "Checking…" : st.checked ? "Checked" : "Check in"
                )
              )
            );
          })
        )
      )
    )
  );

  return h(React.Fragment, null, header, controls, table);
}
