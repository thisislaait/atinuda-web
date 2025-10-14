// app/checkins/page.tsx
"use client";

import React, { useEffect, useState } from "react";

const h = React.createElement;

type Row = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt: string | null;
};

export default function CheckinsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkins/list", { cache: "no-store" });
      const json = await res.json();
      if (json?.ok) setRows(json.rows as Row[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return h(
    "div",
    { className: "p-6" },
    h("div", { className: "max-w-6xl mx-auto" },
      h("h1", { className: "text-2xl font-bold mb-4" }, "Check-ins"),
      loading
        ? h("div", { className: "text-slate-600 animate-pulse" }, "Loading…")
        : h(
            "div",
            { className: "overflow-x-auto rounded-xl border border-slate-200 bg-white" },
            h(
              "table",
              { className: "min-w-full text-sm" },
              h(
                "thead",
                { className: "bg-slate-50 text-slate-700" },
                h("tr", null,
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Name"),
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Email"),
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Ticket"),
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Number"),
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Checked in"),
                  h("th", { className: "px-3 py-2 text-left font-semibold" }, "Last scan")
                )
              ),
              h(
                "tbody",
                null,
                ...rows.map((r) =>
                  h(
                    "tr",
                    { key: r.ticketNumber, className: "border-t border-slate-100" },
                    h("td", { className: "px-3 py-2 text-slate-900" }, r.fullName || ""),
                    h("td", { className: "px-3 py-2 text-slate-600" }, r.email || ""),
                    h("td", { className: "px-3 py-2 text-slate-700" }, r.ticketType || ""),
                    h("td", { className: "px-3 py-2 font-mono text-slate-800" }, r.ticketNumber),
                    h(
                      "td",
                      { className: "px-3 py-2" },
                      h("span", {
                        className:
                          "inline-flex px-2 py-1 rounded-full text-xs " +
                          (r.checkedIn ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"),
                      }, r.checkedIn ? "Yes" : "No")
                    ),
                    h("td", { className: "px-3 py-2 text-slate-500" }, r.lastScanAt ? new Date(r.lastScanAt).toLocaleString() : "—")
                  )
                )
              )
            )
          )
    )
  );
}
