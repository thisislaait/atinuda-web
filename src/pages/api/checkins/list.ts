// pages/api/checkins/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ATTENDEES } from "@/lib/attendee";
import { getAll } from "@/utils/checkinsStore";
import { normalizeTicketNumber } from "@/utils/ticket";

type Row = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const status = await getAll();
  const rows: Row[] = ATTENDEES.map(a => {
    const tn = normalizeTicketNumber(a.ticketNumber);
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
