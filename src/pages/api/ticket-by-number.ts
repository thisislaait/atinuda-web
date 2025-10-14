// // src/pages/api/ticket-by-number.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import path from "path";
// import os from "os";
// import fs from "fs/promises";
// import { ATTENDEES } from "@/lib/attendee";
// import { getLocationText } from "@/utils/constants";

// const DATA_DIR = process.env.CHECKINS_DIR && process.env.CHECKINS_DIR.trim().length > 0
//   ? process.env.CHECKINS_DIR
//   : path.join(os.tmpdir(), "atinuda_data");
// const CHECKINS_FILE = path.join(DATA_DIR, "checkins.json");

// type TicketPayload = {
//   fullName: string;
//   email: string;
//   ticketType: string;
//   ticketNumber: string;
//   location?: string | null;
//   checkIn?: Record<string, boolean> | null;
// };

// type TicketResp = {
//   ok: boolean;
//   source?: "tickets" | "payments" | "attendees";
//   ticket?: TicketPayload;
//   message?: string;
// };

// function normTicketNumber(s: string): string {
//   return String(s || "").trim().toUpperCase();
// }

// async function readCheckins(): Promise<Record<string, Record<string, { checked?: boolean; at?: number }>>> {
//   try {
//     const raw = await fs.readFile(CHECKINS_FILE, "utf8");
//     if (!raw) return {};
//     return JSON.parse(raw);
//   } catch {
//     return {};
//   }
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse<TicketResp>) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).json({ ok: false, message: "Method Not Allowed" });
//   }

//   const ticketNumber = normTicketNumber(String(req.query.ticketNumber || ""));
//   if (!ticketNumber) {
//     return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
//   }

//   try {
//     // find in local attendees fallback
//     const local = ATTENDEES.find((x) => normTicketNumber(x.ticketNumber) === ticketNumber);
//     if (local) {
//       const ticketType = local.ticketType || "General Admission";
//       const location = getLocationText(ticketType) || null;

//       // read checkins and merge flags
//       const checkins = await readCheckins();
//       const rawEntry = checkins[ticketNumber] ?? null;
//       const checkIn: Record<string, boolean> | null = rawEntry
//         ? Object.fromEntries(Object.entries(rawEntry).map(([k, v]) => [k, Boolean(v?.checked ?? false)]))
//         : null;

//       return res.status(200).json({
//         ok: true,
//         source: "attendees",
//         ticket: {
//           fullName: String(local.fullName || "Guest"),
//           email: String(local.email || ""),
//           ticketType,
//           ticketNumber: String(local.ticketNumber || ticketNumber),
//           location,
//           checkIn,
//         },
//       });
//     }

//     return res.status(404).json({ ok: false, message: "Ticket not found" });
//   } catch (err) {
//     console.error("ticket-by-number error", err);
//     const message = err instanceof Error ? err.message : "Server error";
//     return res.status(500).json({ ok: false, message });
//   }
// }

// pages/api/ticket-by-number.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/utils/firebaseAdmin";
import { ATTENDEES } from "@/lib/attendee";
import { getLocationText } from "@/utils/constants";

type TicketPayload = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location?: string | null;
  checkIn?: Record<string, boolean> | null;
  giftClaimed?: boolean;
};

type TicketResp = {
  ok: boolean;
  source?: "tickets" | "attendees";
  ticket?: TicketPayload;
  message?: string;
};

type TicketDoc = {
  ticketNumber?: string;
  fullName?: string;
  name?: string;
  email?: string;
  ticketType?: string;
  giftClaimed?: boolean;
  checkIn?: Record<string, unknown>;
};

const norm = (s: string) => String(s || "").trim().toUpperCase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TicketResp>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const ticketNumber = norm(String(req.query.ticketNumber || ""));
  if (!ticketNumber) {
    return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
  }

  try {
    // 1) Firestore lookup
    const snap = await adminDb
      .collection("tickets")
      .where("ticketNumber", "==", ticketNumber)
      .limit(1)
      .get();

    if (!snap.empty) {
      const d = snap.docs[0].data() as TicketDoc;

      const ticketType = String(d.ticketType || "General Admission");
      const location = getLocationText(ticketType) || null;

      const rawCheck = d.checkIn && typeof d.checkIn === "object" ? d.checkIn : null;
      const checkInObj: Record<string, boolean> | null = rawCheck
        ? Object.fromEntries(
            Object.entries(rawCheck).map(([k, v]) => [k, Boolean(v)])
          )
        : null;

      const payload: TicketPayload = {
        fullName: String(d.fullName || d.name || "Guest"),
        email: String(d.email || ""),
        ticketType,
        ticketNumber: String(d.ticketNumber || ticketNumber),
        location,
        checkIn: checkInObj,
        giftClaimed: Boolean(d.giftClaimed ?? false),
      };

      return res.status(200).json({ ok: true, source: "tickets", ticket: payload });
    }

    // 2) Fallback to generated attendees
    const local = ATTENDEES.find((x) => norm(x.ticketNumber) === ticketNumber);
    if (local) {
      const ticketType = local.ticketType || "General Admission";
      const location = getLocationText(ticketType) || null;

      return res.status(200).json({
        ok: true,
        source: "attendees",
        ticket: {
          fullName: String(local.fullName || "Guest"),
          email: String(local.email || ""),
          ticketType,
          ticketNumber: String(local.ticketNumber || ticketNumber),
          location,
          checkIn: null,
          giftClaimed: false,
        },
      });
    }

    return res.status(404).json({ ok: false, message: "Ticket not found" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ ok: false, message });
  }
}
