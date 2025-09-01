"use server";

import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import { z, ZodError } from "zod";
import type { DocumentData } from "firebase-admin/firestore";

export type ActionState = { ok: boolean; message: string };

const schema = z.object({
  ticketNumber: z.string().min(1, "Ticket number is required"),
  mobile: z.string().min(3, "Mobile is required"),
  rsvp: z.enum(["yes", "no", "maybe"]).default("no"),
});

// Helper: safely pick the first non-empty string from known keys
function pickString(
  obj: DocumentData | undefined,
  keys: readonly string[]
): string | null {
  if (!obj) return null;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

export async function submitRsvp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = schema.parse({
      ticketNumber: (formData.get("ticketNumber") as string | null)?.trim() || "",
      mobile: (formData.get("mobile") as string | null)?.trim() || "",
      rsvp: ((formData.get("rsvp") as string | null) || "no") as "yes" | "no" | "maybe",
    });

    // Enrich from payments by ticketNumber
    let payment: DocumentData | undefined;

    // Fast path: doc ID == ticketNumber
    const byId = await adminDb.collection("payments").doc(data.ticketNumber).get();
    if (byId.exists) {
      payment = byId.data();
    } else {
      const q = await adminDb
        .collection("payments")
        .where("ticketNumber", "==", data.ticketNumber)
        .limit(1)
        .get();
      if (!q.empty) {
        payment = q.docs[0].data();
      }
    }

    const name = pickString(payment, ["name", "fullName", "customerName"]);
    const company = pickString(payment, ["company", "organisation", "organization"]);

    await adminDb.collection("Azizi").add({
      rsvp: data.rsvp,
      ticketNumber: data.ticketNumber,
      mobile: data.mobile,
      name,
      company,
      respondedAt: FieldValue.serverTimestamp(),
    });

    return { ok: true, message: "Thank you — your RSVP has been recorded." };
  } catch (err) {
    const message =
      err instanceof ZodError
        ? err.issues[0]?.message ?? "Validation error"
        : err instanceof Error
        ? err.message
        : "Something went wrong.";
    return { ok: false, message };
  }
}
