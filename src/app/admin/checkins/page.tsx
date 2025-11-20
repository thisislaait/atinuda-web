"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";

type Row = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt?: string | null;
};

type ApiResponse =
  | { ok: true; rows: Row[] }
  | { ok: false; message?: string };

export default function AdminCheckins(): JSX.Element {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkins-list");
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.ok) {
        setRows([]);
        setError(json.ok ? "Failed to load rows." : json.message ?? "Load failed.");
        return;
      }
      setRows(json.rows);
    } catch {
      setRows([]);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto space-y-4 max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-900">Attendees — Check-In Status</h1>
          </div>
          <button
            type="button"
            onClick={() => void loadRows()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Refresh
          </button>
        </header>

        <div className="flex items-center gap-3 text-sm">
          {loading && <span className="text-slate-600">Loading…</span>}
          {error && <span className="text-red-600">{error}</span>}
        </div>

        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Ticket #</th>
                <th className="px-3 py-2 font-semibold">Checked In</th>
                <th className="px-3 py-2 font-semibold">Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.ticketNumber} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{row.fullName}</td>
                  <td className="px-3 py-2 text-slate-700 break-all">{row.email || "—"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.ticketType}</td>
                  <td className="px-3 py-2 text-slate-700 break-all">{row.ticketNumber}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        row.checkedIn ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.checkedIn ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {row.lastScanAt ? new Date(row.lastScanAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
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
