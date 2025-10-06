// pages/api/breakouts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/utils/firebaseAdmin";

type Selections = Record<number | string, string | null>;

type BreakoutPayload = {
  ticket_number: string | null;
  name: string | null;
  email: string | null;
  selections: Selections;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  let payload: BreakoutPayload;
  try {
    payload = req.body as BreakoutPayload;
    // Basic validation
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ ok: false, message: "Invalid payload" });
    }
    if (!payload.selections || typeof payload.selections !== "object") {
      return res.status(400).json({ ok: false, message: "Missing selections" });
    }
  } catch {
    return res.status(400).json({ ok: false, message: "Malformed JSON" });
  }

  // Choose a deterministic doc id when ticket_number exists, otherwise generate one
  const docId = payload.ticket_number && payload.ticket_number.trim().length > 0
    ? payload.ticket_number.trim()
    : adminDb.collection("breakoutSelections").doc().id;

  const ref = adminDb.collection("breakoutSelections").doc(docId);

  try {
    // Transaction to enforce first-write-wins
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) {
        // Abort by throwing a plain object (we catch it below).
        throw { status: 409, message: "Selections already saved for this ticket" };
      }

      const docData = {
        ticketNumber: payload.ticket_number ?? null,
        name: payload.name ?? null,
        email: payload.email ?? null,
        selections: payload.selections,
        createdAt: new Date().toISOString(),
        source: "web-form"
      };

      tx.set(ref, docData);
    });

    return res.status(200).json({ ok: true, message: "Saved" });
  } catch (err: unknown) {
    // Handle the conflict path (our thrown object)
    if (err && typeof err === "object" && "status" in err && (err as any).status === 409) {
      return res.status(409).json({ ok: false, message: (err as any).message ?? "Already saved" });
    }

    console.error("pages/api/breakouts error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
