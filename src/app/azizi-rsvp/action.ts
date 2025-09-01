"use server";

import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import { z } from "zod";

export type ActionState = { ok: boolean; message: string };

const schema = z.object({
  ticketNumber: z.string().min(1, "Ticket number is required"),
  mobile: z.string().min(3, "Mobile is required"),
  rsvp: z.enum(["yes", "no", "maybe"]).default("no"),
});

export async function submitRsvp(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = {
      ticketNumber: (formData.get("ticketNumber") as string | null)?.trim() || "",
      mobile: (formData.get("mobile") as string | null)?.trim() || "",
      rsvp: ((formData.get("rsvp") as string | null) || "no") as "yes" | "no" | "maybe",
    };

    const data = schema.parse(raw);

    await adminDb.collection("Azizi").add({
      ...data,
      eventName: "Azizi by Atinuda",
      eventDate: "2025-10-06",
      eventVenue: "the library, Victoria Island",
      respondedAt: FieldValue.serverTimestamp(),
    });

    return { ok: true, message: "Thank you — your RSVP has been recorded." };
  } catch (err: unknown) {
    console.error(err);
    const message =
      typeof err === "object" && err !== null && "issues" in err
        ? (err as any).issues?.[0]?.message ?? "Validation error"
        : err instanceof Error
        ? err.message
        : "Something went wrong.";
    return { ok: false, message };
  }
}
