// // src/pages/api/checkins/check.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { ATTENDEES, type Attendee } from "@/lib/attendee";
// import { getLocationText } from "@/utils/constants";
// import { checkinsStore } from "@/lib/checkinsStore";

// type CheckBody = { ticketNumber?: string };

// type CheckOk = {
//   ok: true;
//   attendee: Attendee & { location?: string };
//   checkedIn: true;
//   checkedInAt: number;
// };

// type CheckError = { ok: false; message: string };

// type CheckResp = CheckOk | CheckError;

// function norm(t: string): string {
//   try {
//     return decodeURIComponent(String(t || "")).toUpperCase().trim();
//   } catch {
//     return String(t || "").toUpperCase().trim();
//   }
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse<CheckResp>) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ ok: false, message: "Method Not Allowed" });
//   }

//   const body = (req.body ?? {}) as CheckBody;
//   const ticket = norm(body.ticketNumber || "");
//   if (!ticket) {
//     return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
//   }

//   const att = ATTENDEES.find(a => norm(a.ticketNumber) === ticket);
//   if (!att) {
//     return res.status(200).json({ ok: false, message: "Not found" });
//   }

//   if (!checkinsStore.has(ticket)) {
//     checkinsStore.set(ticket, Date.now());
//   }

//   const attendeeWithLocation: Attendee & { location?: string } = {
//     ...att,
//     ticketType: att.ticketType || "",
//     location: getLocationText(att.ticketType || ""),
//   };

//   return res.status(200).json({
//     ok: true,
//     attendee: attendeeWithLocation,
//     checkedIn: true,
//     checkedInAt: checkinsStore.get(ticket)!,
//   });
// }


// src/pages/api/checkins/check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ATTENDEES, type Attendee } from "@/lib/attendee";
import { getLocationText } from "@/utils/constants";
import { checkinsStore } from "@/lib/checkinsStore";

type CheckBody = { ticketNumber?: unknown };

type CheckOk = {
  ok: true;
  attendee: Attendee & { location?: string };
  checkedIn: true;
  checkedInAt: number;
};

type CheckError = { ok: false; message: string };

type CheckResp = CheckOk | CheckError;

function norm(t: string): string {
  try {
    return decodeURIComponent(String(t || "")).toUpperCase().trim();
  } catch {
    return String(t || "").toUpperCase().trim();
  }
}

/**
 * A small typed wrapper to support either:
 * - a Map<string, number>, or
 * - an object with has/set/get methods (and optional init()).
 */
type StoreLike = {
  has(key: string): boolean;
  set(key: string, value: number): void;
  get(key: string): number | undefined;
  init?: () => Promise<void>;
};

function toStoreLike(s: unknown): StoreLike | null {
  if (!s) return null;
  // Map-like
  if (typeof (s as Map<string, number>).has === "function" && typeof (s as Map<string, number>).get === "function") {
    return s as unknown as StoreLike;
  }
  // object with methods
  if (
    typeof (s as { has?: unknown }).has === "function" &&
    typeof (s as { set?: unknown }).set === "function" &&
    typeof (s as { get?: unknown }).get === "function"
  ) {
    return s as unknown as StoreLike;
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CheckResp>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const body = (req.body ?? {}) as CheckBody;
  const rawTicket = typeof body.ticketNumber === "string" ? (body.ticketNumber as string) : String(body.ticketNumber ?? "");
  const ticket = norm(rawTicket || "");
  if (!ticket) {
    return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
  }

  const att = ATTENDEES.find((a) => norm(a.ticketNumber) === ticket);
  if (!att) {
    // keep 200 so caller can show friendly UI message; this mirrors existing behaviour you had
    return res.status(200).json({ ok: false, message: "Not found" });
  }

  // Normalize the imported checkinsStore to a typed shape
  const store = toStoreLike(checkinsStore);
  if (!store) {
    // if there's no usable store, return server error
    return res.status(500).json({ ok: false, message: "Checkins store unavailable" });
  }

  // call init if present (some implementations expose init())
  if (typeof store.init === "function") {
    try {
      // don't fail hard if init rejects — just attempt and continue
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await store.init();
    } catch {
      // ignore init errors, we'll still operate in-memory
    }
  }

  // If not already checked — mark the Unix ms timestamp
  if (!store.has(ticket)) {
    store.set(ticket, Date.now());
  }

  const checkedAt = store.get(ticket) ?? Date.now();

  const attendeeWithLocation: Attendee & { location?: string } = {
    ...att,
    ticketType: att.ticketType || "",
    location: getLocationText(att.ticketType || ""),
  };

  return res.status(200).json({
    ok: true,
    attendee: attendeeWithLocation,
    checkedIn: true,
    checkedInAt: checkedAt,
  });
}
