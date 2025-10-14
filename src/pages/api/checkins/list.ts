import type { NextApiRequest, NextApiResponse } from "next";
import { ATTENDEES } from "@/lib/attendee";
import { getAll } from "@/utils/checkinsStore";

type Row = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt: string | null;
};

const norm = (s: string) => String(s || "").trim().toUpperCase();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const status = await getAll();
  const rows: Row[] = ATTENDEES.map(a => {
    const tn = norm(a.ticketNumber);
    const s = status[tn];
    return {
      fullName: a.fullName || "",
      email: a.email || "",
      ticketType: a.ticketType || "",
      ticketNumber: a.ticketNumber,
      checkedIn: !!s?.checkedIn,
      lastScanAt: s?.lastScanAt ?? null,
    };
  });

  return res.status(200).json({ ok: true, total: rows.length, rows });
}
