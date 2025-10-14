// src/pages/api/checkins-list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { ATTENDEES, type Attendee } from "@/lib/attendee";

const DATA_DIR = process.env.CHECKINS_DIR && process.env.CHECKINS_DIR.trim().length > 0
  ? process.env.CHECKINS_DIR
  : path.join(os.tmpdir(), "atinuda_data");
const CHECKINS_FILE = path.join(DATA_DIR, "checkins.json");

type CheckEntry = {
  checked?: boolean;
  at?: number;
  scannerId?: string;
  note?: string;
};

type CheckinsFileShape = Record<string, Record<string, CheckEntry>>;

type Row = {
  fullName: string;
  email: string | null;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt?: string | null;
};

async function readCheckins(): Promise<CheckinsFileShape> {
  try {
    const raw = await fs.readFile(CHECKINS_FILE, "utf8");
    if (!raw) return {};
    return JSON.parse(raw) as CheckinsFileShape;
  } catch {
    return {};
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  try {
    const checkins = await readCheckins();

    const derived: Record<string, { checkedIn: boolean; lastAt?: number }> = {};
    for (const [ticketNum, events] of Object.entries(checkins)) {
      const timestamps: number[] = [];
      let anyChecked = false;
      for (const entry of Object.values(events || {})) {
        if (entry && entry.checked) anyChecked = true;
        if (entry && typeof entry.at === "number") timestamps.push(entry.at);
      }
      derived[ticketNum.toUpperCase()] = {
        checkedIn: anyChecked,
        lastAt: timestamps.length ? Math.max(...timestamps) : undefined,
      };
    }

    const rows: Row[] = ATTENDEES.map((a: Attendee) => {
      const tn = String(a.ticketNumber || "").toUpperCase();
      const d = derived[tn];
      const checkedIn = Boolean(d?.checkedIn ?? false);
      const lastScanAt = d?.lastAt ? new Date(d.lastAt).toISOString() : null;
      return {
        fullName: String(a.fullName || "Guest"),
        email: a.email ? String(a.email) : null,
        ticketType: a.ticketType || "General Admission",
        ticketNumber: String(a.ticketNumber || ""),
        checkedIn,
        lastScanAt,
      };
    });

    return res.status(200).json({ ok: true, rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("checkins-list error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ ok: false, message });
  }
}
