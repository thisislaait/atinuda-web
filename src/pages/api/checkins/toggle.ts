// pages/api/checkins/toggle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import { ATTENDEES } from "@/lib/attendee";
import { getLocationText } from "@/utils/constants";

const ALLOWED_EVENTS = ["azizi","day1","day2","dinner","breakout","masterclass","gift"] as const;
type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

type Success = {
  ok: true;
  ticketNumber: string;
  event: AllowedEvent;
  status: boolean;
  at: number;
  source: "tickets" | "upserted";
  checkIn: Record<string, boolean> | null;
  giftClaimed: boolean;
};
type Failure = { ok: false; message: string };

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const norm  = (s: string) => String(s || "").trim().toUpperCase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Success | Failure>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const body = req.body as { ticketNumber?: unknown; event?: unknown; status?: unknown } | undefined;
    const ticketNumber = isStr(body?.ticketNumber) ? body!.ticketNumber : null;
    const event        = isStr(body?.event) ? (body!.event as AllowedEvent) : null;
    const status       = typeof body?.status === "boolean" ? (body!.status as boolean) : null;

    if (!ticketNumber) return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
    if (!event || !ALLOWED_EVENTS.includes(event)) return res.status(400).json({ ok: false, message: "Invalid event key" });
    if (status === null) return res.status(400).json({ ok: false, message: "Missing status (boolean)" });

    const tn = norm(ticketNumber);
    const at = Date.now();

    // use doc id = ticket number
    let ref = adminDb.collection("tickets").doc(tn);
    let snap = await ref.get();

    // if absent, try query (handles legacy auto-ids)
    if (!snap.exists) {
      const q = await adminDb.collection("tickets").where("ticketNumber", "==", tn).limit(1).get();
      if (!q.empty) {
        ref = q.docs[0].ref;
        snap = await ref.get();
      }
    }

    // upsert from ATTENDEES if still not found
    let source: "tickets" | "upserted" = "tickets";
    if (!snap.exists) {
      const local = ATTENDEES.find(a => norm(a.ticketNumber) === tn);
      if (!local) return res.status(404).json({ ok: false, message: "Ticket not found" });
      source = "upserted";
      await ref.set({
        ticketNumber: tn,
        fullName: String(local.fullName || "Guest"),
        email: String(local.email || ""),
        ticketType: String(local.ticketType || "General Admission"),
        location: getLocationText(String(local.ticketType || "")) || null,
        createdFrom: "attendees_seed",
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    // apply toggle
    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
      lastCheckinEvent: event,
      lastCheckinAtMs: at,
      scanCount: FieldValue.increment(1),
    };
    if (event === "gift") updates["giftClaimed"] = status;
    else updates[`checkIn.${event}`] = status;

    await ref.set(updates, { merge: true });

    // read back merged flags for the UI
    const fresh = await ref.get();
    const d = fresh.data() as {
      checkIn?: Record<string, unknown>;
      giftClaimed?: boolean;
    } | undefined;

    const checkIn: Record<string, boolean> | null =
      d?.checkIn && typeof d.checkIn === "object"
        ? Object.fromEntries(Object.entries(d.checkIn).map(([k, v]) => [k, Boolean(v)]))
        : null;

    return res.status(200).json({
      ok: true,
      ticketNumber: tn,
      event,
      status,
      at,
      source,
      checkIn,
      giftClaimed: Boolean(d?.giftClaimed ?? false),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ ok: false, message: msg });
  }
}
