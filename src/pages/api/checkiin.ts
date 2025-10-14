// pages/api/checkin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";

type Body = {
  ticketNumber: string;
  eventKey?: string; // optional granular key, defaults to "general"
  status?: boolean; // true = checked, false = unchecked
  by?: string | null; // optional checker id/name
};

type ApiResp = {
  ok: boolean;
  updatedIn?: Array<"tickets" | "payments" | "checkins">;
  message?: string;
};

function norm(s: string) {
  return String(s || "").trim().toUpperCase();
}

const DEFAULT_KEY = "general"; // you can use "day1" if you want

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const body = (req.body ?? {}) as Body;
  const ticketNumber = norm(body.ticketNumber || "");
  const eventKey = String(body.eventKey || DEFAULT_KEY).trim();
  const status = typeof body.status === "boolean" ? body.status : true;
  const by = (body.by ?? null) as string | null;

  if (!ticketNumber) return res.status(400).json({ ok: false, message: "Missing ticketNumber" });

  const updated: ApiResp["updatedIn"] = [];

  try {
    // Update tickets.* where ticketNumber = X
    const tSnap = await adminDb.collection("tickets").where("ticketNumber", "==", ticketNumber).limit(1).get();
    if (!tSnap.empty) {
      const ref = tSnap.docs[0].ref;
      await ref.set(
        {
          checkIn: { [eventKey]: status },
          lastScanAt: FieldValue.serverTimestamp(),
          lastScanBy: by ?? null,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      updated.push("tickets");
    } else {
      // Update payments.* as fallback
      const pSnap = await adminDb.collection("payments").where("ticketNumber", "==", ticketNumber).limit(1).get();
      if (!pSnap.empty) {
        const ref = pSnap.docs[0].ref;
        await ref.set(
          {
            checkIn: { [eventKey]: status },
            lastScanAt: FieldValue.serverTimestamp(),
            lastScanBy: by ?? null,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        updated.push("payments");
      }
    }

    // Always record to checkins/{ticketNumber}
    const cRef = adminDb.collection("checkins").doc(ticketNumber);
    // We store an object per event key with checked, at, scannerId/note if desired.
    await cRef.set(
      {
        [eventKey]: {
          checked: status,
          at: FieldValue.serverTimestamp(),
          scannerId: by ?? "unknown",
          note: "",
        },
        lastScanAt: FieldValue.serverTimestamp(),
        lastScanBy: by ?? null,
      },
      { merge: true }
    );
    updated.push("checkins");

    return res.status(200).json({ ok: true, updatedIn: updated });
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("checkin error", err instanceof Error ? err.message : String(err));
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
