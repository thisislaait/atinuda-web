// src/pages/api/ticket-by-number.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/utils/firebaseAdmin";
import { ATTENDEES } from "@/lib/attendee";
import { getLocationText } from "@/utils/constants";
import { getTicketHostSlug } from "@/data/events";

type TicketPayload = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location?: string | null;
  checkIn?: Record<string, boolean> | null;
  giftClaimed?: boolean;
};
type TicketResp = { ok: boolean; source?: "tickets" | "attendees"; ticket?: TicketPayload; message?: string; };

type TicketDoc = {
  ticketNumber?: string; fullName?: string; name?: string; email?: string;
  ticketType?: string; giftClaimed?: boolean; checkIn?: Record<string, unknown>;
};

type EventAttendeeDoc = {
  ticketNumber?: string;
  ticketType?: string;
  email?: string;
  issuedToName?: string;
  checkIns?: Record<string, unknown>;
  giftClaimed?: boolean;
};

const norm = (s: string) => String(s || "").trim().toUpperCase();

async function fetchFromEventAttendees(eventSlug: string, ticketNumber: string): Promise<TicketPayload | null> {
  if (!eventSlug) return null;

  const attendeeCol = adminDb.collection("events").doc(eventSlug).collection("attendees");
  const q = await attendeeCol.where("ticketNumber", "==", ticketNumber).limit(1).get();
  if (q.empty) return null;

  const doc = q.docs[0];
  const data = doc.data() as EventAttendeeDoc;
  const ticketType = String(data.ticketType || "General Admission");
  const location = getLocationText(ticketType) || null;
  const rawChecks = data.checkIns && typeof data.checkIns === "object" ? data.checkIns : null;
  const checkIn = rawChecks
    ? Object.fromEntries(Object.entries(rawChecks).map(([key, value]) => [key, Boolean(value)]))
    : null;

  return {
    fullName: String(data.issuedToName || data.email || "Guest"),
    email: String(data.email || ""),
    ticketType,
    ticketNumber: String(data.ticketNumber || ticketNumber),
    location,
    checkIn,
    giftClaimed: Boolean(data.giftClaimed ?? false),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TicketResp>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const ticketNumber = norm(String(req.query.ticketNumber || ""));
  const eventSlugRaw = typeof req.query.slug === "string" ? req.query.slug : "";
  const normalizedSlug = eventSlugRaw.trim();
  const hostSlug = normalizedSlug ? getTicketHostSlug(normalizedSlug) : "";
  if (!ticketNumber) return res.status(400).json({ ok: false, message: "Missing ticketNumber" });

  try {
    if (hostSlug) {
      const eventTicket = await fetchFromEventAttendees(hostSlug, ticketNumber);
      if (eventTicket) {
        return res.status(200).json({ ok: true, source: "tickets", ticket: eventTicket });
      }
    }

    // A) doc by ID
    let snap = await adminDb.collection("tickets").doc(ticketNumber).get();
    // B) fallback query (older auto-ID docs)
    if (!snap.exists) {
      const q = await adminDb.collection("tickets").where("ticketNumber", "==", ticketNumber).limit(1).get();
      if (!q.empty) snap = await q.docs[0].ref.get();
    }

    if (snap.exists) {
      const d = snap.data() as TicketDoc;
      const ticketType = String(d.ticketType || "General Admission");
      const location = getLocationText(ticketType) || null;

      const rawCheck = d.checkIn && typeof d.checkIn === "object" ? d.checkIn : null;
      const checkIn = rawCheck
        ? Object.fromEntries(Object.entries(rawCheck).map(([k, v]) => [k, Boolean(v)]))
        : null;

      return res.status(200).json({
        ok: true,
        source: "tickets",
        ticket: {
          fullName: String(d.fullName || d.name || "Guest"),
          email: String(d.email || ""),
          ticketType,
          ticketNumber: String(d.ticketNumber || ticketNumber),
          location,
          checkIn,
          giftClaimed: Boolean(d.giftClaimed ?? false),
        },
      });
    }

    // Fallback to static list
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
