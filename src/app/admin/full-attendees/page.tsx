"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type FullAttendeeRow = {
  first_name: string;
  last_name: string;
  ticket_number: string;
  day_2_session: string;
  day_4_sessions: string;
  day_5_sessions: string;
  day_6_session: string;
  travel_arrival_date: string;
  travel_departure_date: string;
  airline: string;
  hotel_name: string;
  size: string;
  bio: string;
};

type ApiResp =
  | {
      ok: true;
      eventSlug: string;
      generatedAt: string;
      count: number;
      rows: FullAttendeeRow[];
    }
  | {
      ok: false;
      message?: string;
    };

const DEFAULT_EVENT = "martitus-retreat-2026";

const CSV_HEADERS: Array<keyof FullAttendeeRow> = [
  "first_name",
  "last_name",
  "ticket_number",
  "day_2_session",
  "day_4_sessions",
  "day_5_sessions",
  "day_6_session",
  "travel_arrival_date",
  "travel_departure_date",
  "airline",
  "hotel_name",
  "size",
  "bio",
];

function csvEscape(value: string): string {
  const safe = value.replace(/"/g, '""');
  return /[",\n]/.test(safe) ? `"${safe}"` : safe;
}

function toCsv(rows: FullAttendeeRow[]): string {
  const lines = [CSV_HEADERS.join(",")];

  for (const row of rows) {
    lines.push(
      CSV_HEADERS.map((header) => csvEscape(String(row[header] ?? ""))).join(","),
    );
  }

  return `${lines.join("\n")}\n`;
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminFullAttendeesPage() {
  const [eventSlug, setEventSlug] = useState(DEFAULT_EVENT);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<FullAttendeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ event: eventSlug, limit: "5000" });
      const res = await fetch(`/api/full-attendees?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as ApiResp;

      if (!res.ok || !data.ok) {
        setRows([]);
        setGeneratedAt("");
        setError(
          data.ok
            ? "Failed to load attendees."
            : data.message || "Failed to load attendees.",
        );
        return;
      }

      setRows(data.rows || []);
      setGeneratedAt(data.generatedAt || "");
    } catch {
      setRows([]);
      setGeneratedAt("");
      setError("Network error loading attendees.");
    } finally {
      setLoading(false);
    }
  }, [eventSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) => {
      return [
        row.first_name,
        row.last_name,
        row.ticket_number,
        row.day_2_session,
        row.day_4_sessions,
        row.day_5_sessions,
        row.day_6_session,
        row.travel_arrival_date,
        row.travel_departure_date,
        row.airline,
        row.hotel_name,
        row.size,
        row.bio,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query]);

  const exportCsv = useCallback(() => {
    if (!filtered.length) return;
    const csv = toCsv(filtered);
    const dayTag = new Date().toISOString().slice(0, 10);
    downloadCsv(`full-attendees-${eventSlug}-${dayTag}.csv`, csv);
  }, [filtered, eventSlug]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Full Attendees Spreadsheet
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {loading
                ? "Loading attendees..."
                : `${filtered.length} of ${rows.length} attendees${generatedAt ? ` • Updated ${new Date(generatedAt).toLocaleString()}` : ""}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={loading || filtered.length === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Event Slug
            </span>
            <input
              value={eventSlug}
              onChange={(e) => setEventSlug(e.target.value)}
              placeholder="martitus-retreat-2026"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ticket, sessions, hotel..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1800px] text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-3 py-2 font-semibold">First Name</th>
                <th className="px-3 py-2 font-semibold">Last Name</th>
                <th className="px-3 py-2 font-semibold">Ticket #</th>
                <th className="px-3 py-2 font-semibold">Day 2</th>
                <th className="px-3 py-2 font-semibold">Day 4</th>
                <th className="px-3 py-2 font-semibold">Day 5</th>
                <th className="px-3 py-2 font-semibold">Day 6</th>
                <th className="px-3 py-2 font-semibold">Arrival Date</th>
                <th className="px-3 py-2 font-semibold">Departure Date</th>
                <th className="px-3 py-2 font-semibold">Airline</th>
                <th className="px-3 py-2 font-semibold">Hotel</th>
                <th className="px-3 py-2 font-semibold">Size</th>
                <th className="px-3 py-2 font-semibold">Bio</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.ticket_number || `${row.first_name}-${row.last_name}`}
                  className="border-t border-slate-100 align-top"
                >
                  <td className="px-3 py-2 text-slate-900">{row.first_name || "-"}</td>
                  <td className="px-3 py-2 text-slate-900">{row.last_name || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.ticket_number || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.day_2_session || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.day_4_sessions || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.day_5_sessions || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.day_6_session || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.travel_arrival_date || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {row.travel_departure_date || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.airline || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.hotel_name || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.size || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.bio || "-"}</td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-3 py-6 text-center text-slate-500">
                    No attendees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
