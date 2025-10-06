// app/tickets/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import ticketsData from "@/lib/tickets"; // adjust path if needed

type FirestoreTs = { _seconds?: number; _nanoseconds?: number } | { seconds?: number; nanoseconds?: number };
type RawRecord = Record<string, any>;

type TicketRow = {
  id: string;
  ticketNumber: string;
  fullName: string;
  ticketType: string;
  email: string;
  status: string;
  location?: string;
  ticketIssued?: boolean | null;
  txRef?: string;
  timestamp?: Date | null;
  raw: RawRecord;
};

function firestoreTsToDate(ts?: FirestoreTs | null): Date | null {
  if (!ts) return null;
  const seconds = (ts as any)._seconds ?? (ts as any).seconds;
  const nanos = (ts as any)._nanoseconds ?? (ts as any).nanoseconds ?? 0;
  if (typeof seconds !== "number") return null;
  return new Date(seconds * 1000 + Math.floor(nanos / 1e6));
}

function formatDate(d?: Date | null) {
  if (!d) return "";
  return d.toLocaleString();
}

function normalizeRecords(data: Record<string, any>): TicketRow[] {
  return Object.entries(data).map(([key, val]) => {
    const tsObj = val.updatedAt ?? val.createdAt ?? null;
    const timestamp = firestoreTsToDate(tsObj);
    return {
      id: key,
      ticketNumber: val.ticketNumber ?? "-",
      fullName: val.fullName ?? "-",
      ticketType: val.ticketType ?? "-",
      email: val.email ?? val.emailLower ?? "-",
      status: val.status ?? (val.emailSent ? "email-sent" : "-"),
      location: val.location ?? "-",
      ticketIssued: typeof val.ticketIssued === "boolean" ? val.ticketIssued : null,
      txRef: val.txRef ?? "-",
      timestamp,
      raw: val
    };
  });
}

/* CSV helpers */
function rowsToCsv(rows: TicketRow[]) {
  const headers = [
    "ticketNumber",
    "fullName",
    "ticketType",
    "email",
    "status",
    "location",
    "ticketIssued",
    "txRef",
    "timestamp"
  ];
  const esc = (v: any) => {
    if (v == null) return "";
    const s = typeof v === "string" ? v : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };

  const lines = [headers.join(",")].concat(
    rows.map(r =>
      [
        esc(r.ticketNumber),
        esc(r.fullName),
        esc(r.ticketType),
        esc(r.email),
        esc(r.status),
        esc(r.location),
        esc(r.ticketIssued),
        esc(r.txRef),
        esc(r.timestamp ? r.timestamp.toISOString() : "")
      ].join(",")
    )
  );
  return lines.join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Th({ onClick, label, sortBy, sortDir, column }: { onClick: () => void; label: string; sortBy: any; sortDir: "asc" | "desc"; column: string; }) {
  const active = sortBy === column;
  return (
    <th
      onClick={onClick}
      style={{
        padding: "12px 14px",
        fontSize: 13,
        color: "#222",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap"
      }}
      title={`Sort by ${label}`}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span>{label}</span>
        <span style={{ color: active ? "#0b5fff" : "#bbb", fontSize: 12 }}>
          {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </div>
    </th>
  );
}

function generatePageNumbers(current: number, total: number) {
  const maxButtons = 7;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 14,
  verticalAlign: "top"
};

const paginationButtonStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer"
};

export default function Page(): React.ReactElement {
  const rows = useMemo(() => normalizeRecords(ticketsData), []);
  const [query, setQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<keyof TicketRow | null>("ticketNumber");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = rows.filter(r => {
      if (!q) return true;
      return (
        (r.ticketNumber || "").toLowerCase().includes(q) ||
        (r.fullName || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.ticketType || "").toLowerCase().includes(q) ||
        (r.location || "").toLowerCase().includes(q)
      );
    });

    if (sortBy) {
      arr.sort((a, b) => {
        if (sortBy === "timestamp") {
          const ta = a.timestamp?.getTime() ?? 0;
          const tb = b.timestamp?.getTime() ?? 0;
          return sortDir === "asc" ? ta - tb : tb - ta;
        }

        const A = (a as any)[sortBy];
        const B = (b as any)[sortBy];

        if (typeof A === "boolean" || typeof B === "boolean") {
          const av = A ? 1 : 0;
          const bv = B ? 1 : 0;
          return sortDir === "asc" ? av - bv : bv - av;
        }

        const sa = (A ?? "").toString().toLowerCase();
        const sb = (B ?? "").toString().toLowerCase();
        if (sa < sb) return sortDir === "asc" ? -1 : 1;
        if (sa > sb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return arr;
  }, [rows, query, sortBy, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(column: keyof TicketRow) {
    if (sortBy === column) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  }

  function exportCsvVisible() {
    const csv = rowsToCsv(filtered);
    downloadCsv(`atinuda-tickets-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, -apple-system, Helvetica, Arial" }}>
      <h2 style={{ margin: 0 }}>Atinuda — Tickets</h2>
      <p style={{ marginTop: 6, marginBottom: 18, color: "#666" }}>
        Showing <strong>{filtered.length}</strong> records — page {currentPage} / {totalPages}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search name, ticket #, email, type..."
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            minWidth: 320
          }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#444" }}>Page size</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            style={{ padding: 6, borderRadius: 6 }}
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <button
          onClick={() => { setQuery(""); setSortBy("ticketNumber"); setSortDir("asc"); setPage(1); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
        >
          Reset
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={exportCsvVisible}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #0b5fff", background: "#0b5fff", color: "#fff" }}
          >
            Export CSV (filtered)
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#fafafa", textAlign: "left" }}>
              <Th onClick={() => toggleSort("ticketNumber")} label="Ticket #" sortBy={sortBy} sortDir={sortDir} column="ticketNumber" />
              <Th onClick={() => toggleSort("fullName")} label="Name" sortBy={sortBy} sortDir={sortDir} column="fullName" />
              <Th onClick={() => toggleSort("ticketType")} label="Type" sortBy={sortBy} sortDir={sortDir} column="ticketType" />
              <Th onClick={() => toggleSort("email")} label="Email" sortBy={sortBy} sortDir={sortDir} column="email" />
              <Th onClick={() => toggleSort("status")} label="Status" sortBy={sortBy} sortDir={sortDir} column="status" />
              <Th onClick={() => toggleSort("location")} label="Location" sortBy={sortBy} sortDir={sortDir} column="location" />
              <Th onClick={() => toggleSort("ticketIssued")} label="Issued" sortBy={sortBy} sortDir={sortDir} column="ticketIssued" />
              <Th onClick={() => toggleSort("timestamp")} label="Timestamp" sortBy={sortBy} sortDir={sortDir} column="timestamp" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r => (
              <tr key={r.id} style={{ borderTop: "1px solid #f6f6f6" }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{r.ticketNumber}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{r.txRef}</div>
                </td>
                <td style={tdStyle}>{r.fullName}</td>
                <td style={tdStyle}>{r.ticketType}</td>
                <td style={tdStyle}><a href={`mailto:${r.email}`} style={{ color: "#0b5fff" }}>{r.email}</a></td>
                <td style={tdStyle}>{r.status}</td>
                <td style={tdStyle}>{r.location ?? "-"}</td>
                <td style={tdStyle}>{r.ticketIssued == null ? "-" : String(r.ticketIssued)}</td>
                <td style={tdStyle}>{formatDate(r.timestamp)}</td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 20, color: "#666" }}>No rows to show</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setPage(1)} disabled={currentPage === 1} style={paginationButtonStyle}>{"<<"}</button>
        <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} style={paginationButtonStyle}>Prev</button>

        {generatePageNumbers(currentPage, totalPages).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...paginationButtonStyle,
              fontWeight: p === currentPage ? 700 : 400,
              background: p === currentPage ? "#0b5fff" : undefined,
              color: p === currentPage ? "#fff" : undefined,
              borderColor: p === currentPage ? "#0b5fff" : "#ddd"
            }}
          >
            {p}
          </button>
        ))}

        <button onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={paginationButtonStyle}>Next</button>
        <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} style={paginationButtonStyle}>{">>"}</button>

        <div style={{ marginLeft: "auto", color: "#444" }}>
          {Math.min((currentPage - 1) * pageSize + 1, total)} - {Math.min(currentPage * pageSize, total)} of {total}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          table { min-width: 700px; }
        }
      `}</style>
    </div>
  );
}
