// // app/checkin/attendees/page.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { ATTENDEES } from "@/lib/attendee";

// const h = React.createElement;

// type StatusMap = Record<string, { checked: boolean; at?: string | null; by?: string | null }>;

// export default function Page() {
//   const [statuses, setStatuses] = useState<StatusMap>({});
//   const [q, setQ] = useState("");
//   const [busyId, setBusyId] = useState<string | null>(null);
//   const [msg, setMsg] = useState<string>("");

//   const filtered = useMemo(() => {
//     const s = q.trim().toLowerCase();
//     if (!s) return ATTENDEES;
//     return ATTENDEES.filter((a) => {
//       return (
//         (a.fullName || "").toLowerCase().includes(s) ||
//         (a.email || "").toLowerCase().includes(s) ||
//         (a.ticketNumber || "").toLowerCase().includes(s) ||
//         (a.ticketType || "").toLowerCase().includes(s)
//       );
//     });
//   }, [q]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const r = await fetch("/api/checkins");
//         const j = await r.json();
//         if (!cancelled && j.ok) setStatuses(j.statuses || {});
//       } catch {
//         // ignore
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   async function checkin(ticketNumber: string) {
//     setBusyId(ticketNumber);
//     setMsg("");
//     try {
//       const r = await fetch("/api/checkin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ticketNumber, checker: "list" }),
//       });
//       const j = await r.json();
//       if (r.ok && j.ok) {
//         setStatuses((prev) => ({ ...prev, [ticketNumber]: { checked: true, at: new Date().toISOString(), by: "list" } }));
//       } else {
//         setMsg(j?.message || "Failed to check in");
//       }
//     } catch {
//       setMsg("Failed to check in");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   const header = h(
//     "div",
//     { className: "relative h-[200px] w-full" },
//     h("div", { className: "absolute inset-0 bg-[url('/assets/images/elementtwo.png')] bg-cover bg-center" }),
//     h("div", { className: "absolute inset-0 bg-black/40" }),
//     h(
//       "div",
//       { className: "relative z-10 h-full flex items-center justify-center" },
//       h("h1", { className: "text-white text-3xl md:text-5xl font-bold text-center" }, "Attendees — Check-in List")
//     )
//   );

//   const controls = h(
//     "div",
//     { className: "max-w-6xl mx-auto px-4 py-4 flex items-center gap-3" },
//     h("input", {
//       value: q,
//       onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
//       placeholder: "Search name, email, ticket #, type…",
//       className: "w-full md:w-[480px] rounded-lg border border-slate-300 px-3 py-2",
//     }),
//     msg ? h("div", { className: "text-sm text-rose-600" }, msg) : null
//   );

//   const table = h(
//     "div",
//     { className: "max-w-6xl mx-auto px-4 pb-10" },
//     h(
//       "div",
//       { className: "overflow-x-auto rounded-xl border border-slate-200 bg-white" },
//       h(
//         "table",
//         { className: "min-w-full text-sm" },
//         h(
//           "thead",
//           { className: "bg-slate-50" },
//           h(
//             "tr",
//             null,
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Name"),
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Email"),
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Ticket #"),
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Type"),
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "Checked In"),
//             h("th", { className: "px-3 py-2 text-left font-semibold text-slate-700" }, "")
//           )
//         ),
//         h(
//           "tbody",
//           null,
//           ...filtered.map((a) => {
//             const st = statuses[a.ticketNumber] || { checked: false };
//             return h(
//               "tr",
//               { key: a.ticketNumber, className: "border-t border-slate-100" },
//               h("td", { className: "px-3 py-2 text-black" }, a.fullName || "—"),
//               h("td", { className: "px-3 py-2 text-slate-700" }, a.email || "—"),
//               h("td", { className: "px-3 py-2 font-mono text-black" }, a.ticketNumber || "—"),
//               h("td", { className: "px-3 py-2 text-black" }, a.ticketType || "—"),
//               h(
//                 "td",
//                 { className: "px-3 py-2" },
//                 h(
//                   "span",
//                   {
//                     className:
//                       "inline-flex items-center rounded-full px-2.5 py-1 " +
//                       (st.checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"),
//                   },
//                   st.checked ? "Yes" : "No"
//                 )
//               ),
//               h(
//                 "td",
//                 { className: "px-3 py-2 text-right" },
//                 h(
//                   "button",
//                   {
//                     disabled: st.checked || busyId === a.ticketNumber,
//                     onClick: () => checkin(a.ticketNumber),
//                     className:
//                       "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium " +
//                       (st.checked || busyId === a.ticketNumber
//                         ? "bg-slate-200 text-slate-500 cursor-not-allowed"
//                         : "bg-[#1B365D] text-white hover:opacity-90"),
//                   },
//                   busyId === a.ticketNumber ? "Checking…" : st.checked ? "Checked" : "Check in"
//                 )
//               )
//             );
//           })
//         )
//       )
//     )
//   );

//   return h(React.Fragment, null, header, controls, table);
// }


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
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkBusy, setBulkBusy] = useState(false);

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
    return () => { cancelled = true; };
  }, []);

  function isChecked(ticketNumber: string): boolean {
    return Boolean(statuses[ticketNumber]?.checked);
  }

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

  const allFilteredIds = filtered.map((a) => a.ticketNumber);
  const allFilteredUnchecked = allFilteredIds.filter((id) => !isChecked(id));
  const selectedIds = Object.entries(selected)
    .filter(([id, on]) => on && allFilteredIds.includes(id) && !isChecked(id))
    .map(([id]) => id);

  function toggleSelect(id: string) {
    if (isChecked(id)) return; // already checked; no need to select
    setSelected((p) => ({ ...p, [id]: !p[id] }));
  }

  function selectAllFiltered() {
    const next: Record<string, boolean> = { ...selected };
    allFilteredUnchecked.forEach((id) => { next[id] = true; });
    setSelected(next);
  }

  function clearSelected() {
    setSelected({});
  }

  async function bulkCheckin() {
    if (selectedIds.length === 0) return;
    setBulkBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/checkins/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumbers: selectedIds, checker: "bulk" }),
      });
      const j = await r.json();
      if (r.ok && j.ok) {
        const nowIso = new Date().toISOString();
        setStatuses((prev) => {
          const copy = { ...prev };
          selectedIds.forEach((id) => {
            copy[id] = { checked: true, at: nowIso, by: "bulk" };
          });
          return copy;
        });
        clearSelected();
      } else {
        setMsg(j?.message || "Bulk check-in failed");
      }
    } catch {
      setMsg("Bulk check-in failed");
    } finally {
      setBulkBusy(false);
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
    { className: "max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3" },
    h("input", {
      value: q,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
      placeholder: "Search name, email, ticket #, type…",
      className: "w-full md:w-[420px] rounded-lg border border-slate-300 px-3 py-2",
    }),
    h("button", {
      type: "button",
      onClick: selectAllFiltered,
      disabled: allFilteredUnchecked.length === 0,
      className:
        "rounded-md px-3 py-2 text-sm font-medium " +
        (allFilteredUnchecked.length === 0 ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-800 hover:bg-slate-200"),
    }, `Select all (filtered${q ? "" : ""})`),
    h("button", {
      type: "button",
      onClick: bulkCheckin,
      disabled: selectedIds.length === 0 || bulkBusy,
      className:
        "rounded-md px-3 py-2 text-sm font-medium " +
        (selectedIds.length === 0 || bulkBusy ? "bg-slate-200 text-slate-500" : "bg-[#1B365D] text-white hover:opacity-90"),
    }, bulkBusy ? "Checking…" : `Check in selected (${selectedIds.length})`),
    h("button", {
      type: "button",
      onClick: clearSelected,
      disabled: Object.values(selected).every(Boolean) === false && selectedIds.length === 0,
      className:
        "rounded-md px-3 py-2 text-sm font-medium " +
        (selectedIds.length === 0 ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-800 hover:bg-slate-200"),
    }, "Clear selection"),
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
            h("th", { className: "px-3 py-2" }, ""), // checkbox col
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
            const disabled = st.checked || busyId === a.ticketNumber;
            const selectedOn = Boolean(selected[a.ticketNumber]);
            return h(
              "tr",
              { key: a.ticketNumber, className: "border-t border-slate-100" },
              h("td", { className: "px-3 py-2 align-middle" },
                h("input", {
                  type: "checkbox",
                  checked: selectedOn,
                  disabled: st.checked, // don't select already-checked rows
                  onChange: () => toggleSelect(a.ticketNumber),
                })
              ),
              h("td", { className: "px-3 py-2 text-black" }, a.fullName || "—"),
              h("td", { className: "px-3 py-2 text-slate-700" }, a.email || "—"),
              h("td", { className: "px-3 py-2 font-mono text-black" }, a.ticketNumber || "—"),
              h("td", { className: "px-3 py-2 text-black" }, a.ticketType || "—"),
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
                    disabled,
                    onClick: () => checkin(a.ticketNumber),
                    className:
                      "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium " +
                      (disabled
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
