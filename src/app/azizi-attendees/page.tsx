// src/app/azizi-attendees/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import aziziData from "@/lib/azizi"; // adjust if needed

type Meta = { id?: string; path?: string; createTime?: string; updateTime?: string };

type RawRecord = {
  ticketNumber?: string | null;
  name?: string | null;
  mobile?: string | null;
  company?: string | null;
  respondedAt?: string | null;
  rsvp?: string | null;
  __meta?: Meta;
  [k: string]: unknown;
};

type TicketRow = {
  id: string;
  ticketNumber: string;
  name: string;
  mobile: string;
  company: string;
  rsvp: string;
  respondedAt?: Date | null;
  raw: RawRecord;
};

function parseDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeRecords(data: Record<string, RawRecord>): TicketRow[] {
  return Object.entries(data).map(([id, rec]) => {
    const responded = parseDate(rec.respondedAt ?? rec.__meta?.updateTime ?? rec.__meta?.createTime);
    return {
      id,
      ticketNumber: rec.ticketNumber ?? "-",
      name: rec.name ?? "-",
      mobile: rec.mobile ?? "-",
      company: rec.company ?? "-",
      rsvp: rec.rsvp ?? "-",
      respondedAt: responded,
      raw: rec,
    };
  });
}

/* CSV helpers */
function escValue(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: TicketRow[]): string {
  const headers = ["ticketNumber", "name", "mobile", "company", "rsvp", "respondedAt"];
  const lines = [headers.join(",")].concat(
    rows.map((r) =>
      [
        escValue(r.ticketNumber),
        escValue(r.name),
        escValue(r.mobile),
        escValue(r.company),
        escValue(r.rsvp),
        escValue(r.respondedAt ? r.respondedAt.toISOString() : ""),
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

function Th({
  onClick,
  label,
  active,
  dir,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  dir?: "asc" | "desc";
}) {
  return (
    <th
      onClick={onClick}
      style={{
        padding: "10px 12px",
        fontSize: 13,
        color: "#222",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        textAlign: "left",
      }}
      title={`Sort by ${label}`}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span>{label}</span>
        <span style={{ color: active ? "#0b5fff" : "#bbb", fontSize: 12 }}>
          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </div>
    </th>
  );
}

function generatePageNumbers(current: number, total: number): number[] {
  const maxButtons = 7;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

const tdStyle: React.CSSProperties = { padding: "12px 14px", fontSize: 14, verticalAlign: "top" };
const paginationButtonStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

export default function Page(): React.ReactElement {
  const rows = useMemo(() => normalizeRecords(aziziData as Record<string, RawRecord>), []);
  const [query, setQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<keyof TicketRow | null>("ticketNumber");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = rows.filter((r) => {
      if (!q) return true;
      return (
        (r.ticketNumber || "").toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.mobile || "").toLowerCase().includes(q) ||
        (r.company || "").toLowerCase().includes(q) ||
        (r.rsvp || "").toLowerCase().includes(q)
      );
    });

    if (sortBy) {
      const key = sortBy;
      arr.sort((a, b) => {
        if (key === "respondedAt") {
          const ta = a.respondedAt?.getTime() ?? 0;
          const tb = b.respondedAt?.getTime() ?? 0;
          return sortDir === "asc" ? ta - tb : tb - ta;
        }
        const A = String((a as unknown as Record<string, unknown>)[key] ?? "").toLowerCase();
        const B = String((b as unknown as Record<string, unknown>)[key] ?? "").toLowerCase();
        if (A < B) return sortDir === "asc" ? -1 : 1;
        if (A > B) return sortDir === "asc" ? 1 : -1;
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
    if (sortBy === column) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  }

  function exportCsvVisible() {
    const csv = rowsToCsv(filtered);
    downloadCsv(`azizi-tickets-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, -apple-system, Helvetica, Arial" }}>
      <h2 style={{ margin: 0 }}>Azizi — Tickets</h2>
      <p style={{ marginTop: 6, marginBottom: 18, color: "#666" }}>
        Showing <strong>{filtered.length}</strong> records — page {currentPage} / {totalPages}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search ticket #, name, mobile, company, rsvp..."
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", minWidth: 320 }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#444" }}>Page size</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{ padding: 6, borderRadius: 6 }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            setQuery("");
            setSortBy("ticketNumber");
            setSortDir("asc");
            setPage(1);
          }}
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
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <Th onClick={() => toggleSort("ticketNumber")} label="Ticket #" active={sortBy === "ticketNumber"} dir={sortDir} />
              <Th onClick={() => toggleSort("name")} label="Name" active={sortBy === "name"} dir={sortDir} />
              <Th onClick={() => toggleSort("mobile")} label="Mobile" active={sortBy === "mobile"} dir={sortDir} />
              <Th onClick={() => toggleSort("company")} label="Company" active={sortBy === "company"} dir={sortDir} />
              <Th onClick={() => toggleSort("rsvp")} label="RSVP" active={sortBy === "rsvp"} dir={sortDir} />
              <Th onClick={() => toggleSort("respondedAt" as keyof TicketRow)} label="Responded At" active={sortBy === "respondedAt"} dir={sortDir} />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #f6f6f6" }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{r.ticketNumber}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{r.id}</div>
                </td>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>
                  {r.mobile ? (
                    <a href={r.mobile.match(/^(\+|0|\d)/) ? `tel:${r.mobile}` : `#`} style={{ color: "#0b5fff" }}>
                      {r.mobile}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={tdStyle}>{r.company ?? "-"}</td>
                <td style={tdStyle}>{r.rsvp}</td>
                <td style={tdStyle}>{r.respondedAt ? r.respondedAt.toLocaleString() : "-"}</td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, color: "#666" }}>
                  No rows to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setPage(1)} disabled={currentPage === 1} style={paginationButtonStyle}>
          {"<<"}
        </button>
        <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} style={paginationButtonStyle}>
          Prev
        </button>

        {generatePageNumbers(currentPage, totalPages).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...paginationButtonStyle,
              fontWeight: p === currentPage ? 700 : 400,
              background: p === currentPage ? "#0b5fff" : undefined,
              color: p === currentPage ? "#fff" : undefined,
              borderColor: p === currentPage ? "#0b5fff" : "#ddd",
            }}
          >
            {p}
          </button>
        ))}

        <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={paginationButtonStyle}>
          Next
        </button>
        <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} style={paginationButtonStyle}>
          {">>"}
        </button>

        <div style={{ marginLeft: "auto", color: "#444" }}>
          {Math.min((currentPage - 1) * pageSize + 1, total)} - {Math.min(currentPage * pageSize, total)} of {total}
        </div>
      </div>
    </div>
  );
}
