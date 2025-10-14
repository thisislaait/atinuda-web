// // src/pages/api/checkins/check.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
// import fsPromises from "fs/promises";
// import path from "path";
// import os from "os";

// const BASE_DATA_DIR = path.join(process.cwd(), "data");
// const CHECKINS_FILENAME = "checkins.json";

// const ALLOWED_EVENTS = ["azizi", "day1", "day2", "dinner", "breakout", "masterclass", "gift"] as const;
// type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

// type CheckEntry = {
//   checked: true;
//   at: number;
//   scannerId: string | null;
//   note: string | null;
// };

// type CheckinsData = Record<string, Partial<Record<AllowedEvent, CheckEntry>>>;

// type RequestBody = {
//   ticketNumber?: unknown;
//   event?: unknown;
//   eventKey?: unknown;
//   status?: unknown;
//   scannerId?: unknown;
//   note?: unknown;
// };

// type ErrorResp = { ok: false; message: string };
// type SuccessResp = { ok: true; ticketNumber: string; event: AllowedEvent; status: boolean; storedIn: "data" | "tmp" | "memory"; at: number };

// function isString(v: unknown): v is string {
//   return typeof v === "string" && v.trim().length > 0;
// }
// function isBoolean(v: unknown): v is boolean {
//   return typeof v === "boolean";
// }
// function normalizeTicket(t: string): string {
//   return String(t || "").trim().toUpperCase();
// }

// async function readFromFile(filePath: string): Promise<CheckinsData> {
//   try {
//     const raw = await fsPromises.readFile(filePath, "utf8");
//     if (!raw) return {};
//     return JSON.parse(raw) as CheckinsData;
//   } catch {
//     return {};
//   }
// }

// async function atomicWrite(filePath: string, data: CheckinsData): Promise<void> {
//   const dir = path.dirname(filePath);
//   await fsPromises.mkdir(dir, { recursive: true });
//   const tmp = `${filePath}.tmp`;
//   await fsPromises.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
//   await fsPromises.rename(tmp, filePath);
// }

// const inMemoryStore: Map<string, Partial<Record<AllowedEvent, CheckEntry>>> = new Map();

// function resolveEventKey(body: RequestBody): string | null {
//   if (isString(body.event) && ALLOWED_EVENTS.includes(body.event as AllowedEvent)) return body.event as string;
//   if (isString(body.eventKey) && ALLOWED_EVENTS.includes(body.eventKey as AllowedEvent)) return body.eventKey as string;
//   return null;
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResp | ErrorResp>) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ ok: false, message: "Method not allowed. Use POST." });
//   }

//   const body = (req.body ?? {}) as RequestBody;

//   if (!isString(body.ticketNumber)) {
//     return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
//   }
//   const ticketNumber = normalizeTicket(body.ticketNumber as string);

//   const eventKey = resolveEventKey(body);
//   if (!eventKey) {
//     return res.status(400).json({ ok: false, message: `Invalid event. Must be one of: ${ALLOWED_EVENTS.join(", ")}` });
//   }
//   const event = eventKey as AllowedEvent;

//   const status = isBoolean(body.status) ? body.status : true;
//   const scannerId = isString(body.scannerId) ? body.scannerId : null;
//   const note = isString(body.note) ? body.note : null;
//   const at = Date.now();

//   // 1) Try project data dir (dev)
//   const dataFilePath = path.join(BASE_DATA_DIR, CHECKINS_FILENAME);

//   try {
//     let all: CheckinsData = {};
//     try {
//       all = await readFromFile(dataFilePath);
//     } catch {
//       all = {};
//     }

//     if (!all[ticketNumber]) all[ticketNumber] = {};

//     if (status) {
//       (all[ticketNumber] as Partial<Record<AllowedEvent, CheckEntry>>)[event] = {
//         checked: true,
//         at,
//         scannerId: scannerId ?? "unknown",
//         note: note ?? "",
//       };
//     } else {
//       if (all[ticketNumber] && (all[ticketNumber] as Record<string, unknown>)[event]) {
//         delete all[ticketNumber]![event];
//       }
//     }

//     try {
//       await atomicWrite(dataFilePath, all);
//       return res.status(200).json({ ok: true, ticketNumber, event, status, storedIn: "data", at });
//     } catch (err) {
//       console.warn("checkins: write to data dir failed, falling back:", (err as Error).message);
//     }
//   } catch (err) {
//     console.error("checkins: unexpected error writing to data dir:", err);
//   }

//   // 2) Try /tmp (serverless writable area)
//   try {
//     const tmpDir = os.tmpdir();
//     const tmpFilePath = path.join(tmpDir, `checkins-${process.env.NODE_ENV || "app"}.json`);
//     let tmpAll: CheckinsData = {};
//     try {
//       tmpAll = await readFromFile(tmpFilePath);
//     } catch {
//       tmpAll = {};
//     }

//     if (!tmpAll[ticketNumber]) tmpAll[ticketNumber] = {};

//     if (status) {
//       (tmpAll[ticketNumber] as Partial<Record<AllowedEvent, CheckEntry>>)[event] = {
//         checked: true,
//         at,
//         scannerId: scannerId ?? "unknown",
//         note: note ?? "",
//       };
//     } else {
//       if (tmpAll[ticketNumber] && (tmpAll[ticketNumber] as Record<string, unknown>)[event]) {
//         delete tmpAll[ticketNumber]![event];
//       }
//     }

//     await atomicWrite(tmpFilePath, tmpAll);
//     return res.status(200).json({ ok: true, ticketNumber, event, status, storedIn: "tmp", at });
//   } catch (err) {
//     console.warn("checkins: write to tmp failed, falling back to in-memory:", (err as Error).message);
//   }

//   // 3) In-memory fallback
//   try {
//     const prev = inMemoryStore.get(ticketNumber) || {};
//     const copy = { ...prev };

//     if (status) {
//       copy[event] = { checked: true, at, scannerId: scannerId ?? "unknown", note: note ?? "" };
//     } else {
//       if (copy && event in copy) {
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete (copy as any)[event];
//       }
//     }

//     inMemoryStore.set(ticketNumber, copy);
//     return res.status(200).json({ ok: true, ticketNumber, event, status, storedIn: "memory", at });
//   } catch (err) {
//     console.error("checkins: in-memory fallback failed:", err);
//     return res.status(500).json({ ok: false, message: "Failed to persist checkin" });
//   }
// }


import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin"; // your admin helper

const ALLOWED_EVENTS = new Set([
  "azizi","day1","day2","dinner","breakout","masterclass","gift",
] as const);
type AllowedEvent = typeof ALLOWED_EVENTS extends Set<infer U> ? U : never;

type ErrorResp   = { ok: false; message: string };
type SuccessResp = { ok: true; ticketNumber: string; event: string; status: boolean; at: number };

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResp | ErrorResp>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { ticketNumber, event, status } = req.body ?? {};

    if (!isStr(ticketNumber)) {
      return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
    }
    if (!isStr(event) || !ALLOWED_EVENTS.has(event as any)) {
      return res.status(400).json({ ok: false, message: "Invalid event key" });
    }
    if (typeof status !== "boolean") {
      return res.status(400).json({ ok: false, message: "Missing status (boolean)" });
    }

    const tn = ticketNumber.toString().trim().toUpperCase();
    const at = Date.now();

    // Find ticket by ticketNumber (create an index on tickets.ticketNumber if prompted)
    const snap = await adminDb.collection("tickets")
      .where("ticketNumber", "==", tn)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ ok: false, message: "Ticket not found" });
    }

    const ref = snap.docs[0].ref;

    // Build atomic update
    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
      // store last event toggle metadata if you like
      lastCheckinEvent: event,
      lastCheckinAtMs: at,
    };

    if (event === "gift") {
      // legacy compatibility
      updates["giftClaimed"] = status;
    } else {
      updates[`checkIn.${event}`] = status;
    }

    await ref.set(updates, { merge: true });

    return res.status(200).json({ ok: true, ticketNumber: tn, event, status, at });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
}
