// app/admin/checkins/page.tsx
"use client";

import React, { useEffect, useState } from "react";

const h = React.createElement;

type Row = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt?: string | null;
};

export default function AdminCheckins(): React.ReactElement {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkins-list");
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setErr(json?.message || "Load failed");
        setRows([]);
      } else {
        setRows(json.rows as Row[]);
      }
    } catch {
      setErr("Network error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return h(
    "div",
    { className: "min-h-screen bg-slate-50 p-6" },
    h("div", { className: "max-w-6xl mx-auto" },
      h("div", { className: "text-2xl text-black font-bold mb-4" }, "Attendees — Check-In Status"),
      h("div", { className: "mb-4 flex items-center gap-3" },
        h("button", { onClick: () => void load(), className: "px-3 py-2 rounded-lg bg-slate-800 text-white" }, "Refresh"),
        loading ? h("span", { className: "text-sm text-slate-600" }, "Loading…") : null,
        err ? h("span", { className: "text-sm text-red-600" }, err) : null
      ),
      h(
        "div",
        { className: "overflow-auto border border-slate-200 rounded-xl bg-white" },
        h(
          "table",
          { className: "min-w-[800px] w-full text-sm" },
          h(
            "thead",
            { className: "bg-slate-100" },
            h(
              "tr",
              null,
              ["Name", "Email", "Type", "Ticket #", "Checked In", "Last Scan"].map((th) =>
                h("th", { key: th, className: "text-left px-3 py-2 font-semibold text-slate-700" }, th)
              )
            )
          ),
          h(
            "tbody",
            null,
            ...rows.map((r) =>
              h(
                "tr",
                { key: r.ticketNumber, className: "border-t border-slate-100" },
                h("td", { className: "px-3 py-2 font-medium text-slate-900" }, r.fullName),
                h("td", { className: "px-3 py-2 text-slate-700 break-all" }, r.email || "—"),
                h("td", { className: "px-3 py-2 text-slate-700" }, r.ticketType),
                h("td", { className: "px-3 py-2 text-slate-700 break-all" }, r.ticketNumber),
                h(
                  "td",
                  { className: "px-3 py-2" },
                  h(
                    "span",
                    {
                      className:
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold " +
                        (r.checkedIn ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"),
                    },
                    r.checkedIn ? "Yes" : "No"
                  )
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
