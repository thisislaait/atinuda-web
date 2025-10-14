// pages/api/checkin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import { ATTENDEES } from "@/lib/attendee";

type CheckinGetResp =
  | { ok: true; ticketNumber: string; checked: boolean; at?: string | null; by?: string | null }
  | { ok: false; message: string };

type CheckinPostBody = { ticketNumber: string; checker?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<CheckinGetResp | { ok: boolean; message: string }>) {
  try {
    if (req.method === "GET") {
      const ticketNumber = String(req.query.ticketNumber || "").trim();
      if (!ticketNumber) return res.status(400).json({ ok: false, message: "ticketNumber is required" });

      const snap = await adminDb.collection("attendee_checkins").doc(ticketNumber).get();
      if (!snap.exists) {
        return res.status(200).json({ ok: true, ticketNumber, checked: false });
      }
      const d = snap.data() || {};
      return res.status(200).json({
        ok: true,
        ticketNumber,
        checked: Boolean(d.checked),
        at: d.at ? new Date(d.at._seconds * 1000).toISOString() : null,
        by: d.by ?? null,
      });
    }

    if (req.method === "POST") {
      const body = (req.body ?? {}) as CheckinPostBody;
      const ticketNumber = String(body.ticketNumber || "").trim();
      const checker = String(body.checker || "web").trim() || "web";
      if (!ticketNumber) return res.status(400).json({ ok: false, message: "ticketNumber is required" });

      // look up attendee from your library (CSV-backed)
      const attendee = ATTENDEES.find((a) => (a.ticketNumber || "").trim().toUpperCase() === ticketNumber.toUpperCase()) || null;

      const ref = adminDb.collection("attendee_checkins").doc(ticketNumber);
      await ref.set(
        {
          checked: true,
          by: checker,
          at: FieldValue.serverTimestamp(),
          // denormalize for convenience / exports
          ticketNumber,
          fullName: attendee?.fullName ?? null,
          email: attendee?.email ?? null,
          ticketType: attendee?.ticketType ?? null,
        },
        { merge: true }
      );

      return res.status(200).json({ ok: true, message: "Checked in" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  } catch (e) {
    console.error("checkin api error", e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
