import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { ticketNumber } = req.query;
  if (!ticketNumber || typeof ticketNumber !== "string") {
    return res.status(400).json({ ok: false, message: "Missing ticket number" });
  }

  try {
    const snap = await adminDb
      .collection("payments")
      .where("ticketNumber", "==", ticketNumber.trim())
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(200).json({ ok: false, message: "Ticket not found" });
    }

    return res.status(200).json({ ok: true, message: "Valid ticket" });
  } catch (err: any) {
    console.error("verify-ticket error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
