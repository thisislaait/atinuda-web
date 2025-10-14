import type { NextApiRequest, NextApiResponse } from "next";
import { setChecked } from "@/utils/checkinsFile";

type Resp = { ok: true; message: string; storedIn: "preferred" | "tmp"; filePath: string } | { ok: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const { ticketNumber, checker } = (req.body ?? {}) as { ticketNumber?: unknown; checker?: unknown };
  const tn = typeof ticketNumber === "string" ? ticketNumber.trim() : String(ticketNumber ?? "").trim();
  const by = typeof checker === "string" && checker.trim() ? checker.trim() : "list";

  if (!tn) return res.status(400).json({ ok: false, message: "ticketNumber is required" });

  try {
    const { storedIn, filePath } = await setChecked(tn, by);
    return res.status(200).json({ ok: true, message: "Checked in", storedIn, filePath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ ok: false, message: msg });
  }
}



// import type { NextApiRequest, NextApiResponse } from "next";
// import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
// import { ATTENDEES } from "@/lib/attendee";
// import { getLocationText } from "@/utils/constants";

// type Resp = { ok: true; message: string } | { ok: false; message: string };

// const norm = (s: string) => String(s || "").trim().toUpperCase();

// export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ ok: false, message: "Method Not Allowed" });
//   }

//   const { ticketNumber, checker } = (req.body ?? {}) as { ticketNumber?: unknown; checker?: unknown };
//   const tn = norm(typeof ticketNumber === "string" ? ticketNumber : String(ticketNumber ?? ""));
//   const by = typeof checker === "string" && checker.trim() ? checker.trim() : "web";
//   if (!tn) return res.status(400).json({ ok: false, message: "ticketNumber is required" });

//   try {
//     const ref = adminDb.collection("tickets").doc(tn);
//     const doc = await ref.get();

//     if (!doc.exists) {
//       const a = ATTENDEES.find(x => norm(x.ticketNumber) === tn);
//       if (!a) return res.status(404).json({ ok: false, message: "Ticket not found" });
//       await ref.set({
//         ticketNumber: tn,
//         fullName: String(a.fullName || "Guest"),
//         email: String(a.email || ""),
//         ticketType: String(a.ticketType || "General Admission"),
//         location: getLocationText(String(a.ticketType || "")) || null,
//         createdFrom: "attendees_seed",
//         createdAt: FieldValue.serverTimestamp(),
//       }, { merge: true });
//     }

//     const now = Date.now();
//     await ref.set({
//       "checkIn.day1": true,
//       updatedAt: FieldValue.serverTimestamp(),
//       lastCheckinEvent: "day1",
//       lastCheckinAtMs: now,
//       lastCheckinBy: by,
//       scanCount: FieldValue.increment(1),
//     }, { merge: true });

//     return res.status(200).json({ ok: true, message: "Checked in" });
//   } catch (e: unknown) {
//     const msg = e instanceof Error ? e.message : String(e);
//     return res.status(500).json({ ok: false, message: msg });
//   }
// }


/**
 * POST /api/checkin
 * Body: { ticketNumber: string, event: string, status?: boolean, scannerId?: string, note?: string }
 *
 * event must be one of:
 *   'azizi' | 'day1' | 'day2' | 'dinner' | 'breakout' | 'masterclass' | 'gift'
 *
 * status: optional boolean, defaults to true (i.e. check-in). If false, will uncheck (undo).
 *
 * Response: { ok: true, alreadyCheckedIn: boolean, updated: { ...fields }, scanId?: string, ticketId, collection }
 */

// // src/pages/api/check-in.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { adminDb, FieldValue } from "@/utils/firebaseAdmin";

// const ALLOWED_EVENTS = ["azizi", "day1", "day2", "dinner", "breakout", "masterclass", "gift"] as const;
// type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

// type RequestBody = {
//   ticketNumber?: unknown;
//   event?: unknown;
//   status?: unknown;
//   scannerId?: unknown;
//   note?: unknown;
// };

// type FindResult = {
//   doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>;
//   collection: string;
// };

// type TxResult = {
//   scanId: string;
//   didUpdate: boolean;
//   currentCheck: boolean;
//   newCheck: boolean;
// };

// function isString(v: unknown): v is string {
//   return typeof v === "string" && v.trim().length > 0;
// }

// function isBoolean(v: unknown): v is boolean {
//   return typeof v === "boolean";
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ ok: false, message: "Method not allowed" });
//   }

//   const body = (req.body ?? {}) as RequestBody;

//   const ticketNumberRaw = body.ticketNumber;
//   const eventRaw = body.event;
//   const statusRaw = body.status;
//   const scannerIdRaw = body.scannerId;
//   const noteRaw = body.note;

//   if (!isString(ticketNumberRaw)) {
//     return res.status(400).json({ ok: false, message: "Missing or invalid ticketNumber" });
//   }
//   const ticketNumber = ticketNumberRaw.trim();

//   if (!isString(eventRaw) || !ALLOWED_EVENTS.includes(eventRaw as AllowedEvent)) {
//     return res
//       .status(400)
//       .json({ ok: false, message: `Missing or invalid event. Must be one of: ${ALLOWED_EVENTS.join(", ")}` });
//   }
//   const event = eventRaw as AllowedEvent;

//   const desiredStatus = isBoolean(statusRaw) ? statusRaw : true;
//   const scanner = isString(scannerIdRaw) ? scannerIdRaw.trim() : "unknown-scanner";
//   const note = isString(noteRaw) ? noteRaw.trim() : "";

//   try {
//     // Try to find the ticket in candidate collections
//     const findTicketDoc = async (): Promise<FindResult | null> => {
//       const collectionsToTry = ["payments", "tickets"];
//       for (const col of collectionsToTry) {
//         const snap = await adminDb.collection(col).where("ticketNumber", "==", ticketNumber).limit(1).get();
//         if (!snap.empty) {
//           return { doc: snap.docs[0], collection: col };
//         }
//       }
//       return null;
//     };

//     const found = await findTicketDoc();
//     if (!found) {
//       return res.status(404).json({ ok: false, message: "Ticket not found." });
//     }

//     const ticketRef = found.doc.ref;
//     const ticketId = ticketRef.id;
//     const collectionName = found.collection;

//     const isGift = event === "gift";
//     const ticketFieldPath = isGift ? "giftClaimed" : `checkIn.${event}`;

//     const result = (await adminDb.runTransaction(async (tx) => {
//       const snap = await tx.get(ticketRef);
//       if (!snap.exists) throw new Error("Ticket disappeared during transaction.");

//       const data = (snap.data() ?? {}) as Record<string, unknown>;
//       const currentCheck = isGift
//         ? Boolean(data.giftClaimed ?? false)
//         : Boolean(((data.checkIn as Record<string, unknown> | undefined) ?? {})[event] ?? false);

//       // build updates object
//       const updates: { [k: string]: unknown } = {
//         lastUpdatedBy: scanner,
//         lastUpdatedAt: FieldValue.serverTimestamp(),
//       };

//       let didUpdate = false;
//       if (currentCheck !== desiredStatus) {
//         // set desired status under dynamic path
//         updates[ticketFieldPath] = desiredStatus;
//         didUpdate = true;
//         tx.update(ticketRef, updates);
//       } else {
//         // still write the metadata for traceability
//         tx.update(ticketRef, updates);
//       }

//       // create scan audit doc
//       const scanRef = adminDb.collection("scans").doc();
//       const scanPayload: { [k: string]: unknown } = {
//         scannedTicketNumber: ticketNumber,
//         ticketId,
//         ticketCollection: collectionName,
//         scannerId: scanner,
//         event,
//         action: desiredStatus ? (didUpdate ? "checked-in" : "already-checked-in") : didUpdate ? "unchecked" : "already-unchecked",
//         note,
//         scannedAt: FieldValue.serverTimestamp(),
//       };
//       tx.set(scanRef, scanPayload);

//       const txResult: TxResult = {
//         scanId: scanRef.id,
//         didUpdate,
//         currentCheck,
//         newCheck: desiredStatus,
//       };

//       return txResult;
//     })) as TxResult;

//     return res.status(200).json({
//       ok: true,
//       alreadyCheckedIn: !result.didUpdate && result.currentCheck === result.newCheck,
//       ticketId,
//       collection: collectionName,
//       updated: {
//         field: ticketFieldPath,
//         value: result.newCheck,
//       },
//       scanId: result.scanId,
//     });
//   } catch (err: unknown) {
//     // safe error handling without `any`
//     console.error("Check-in API error:", err);
//     const message = err instanceof Error ? err.message : "Internal Server Error";
//     return res.status(500).json({ ok: false, message });
//   }
// }
