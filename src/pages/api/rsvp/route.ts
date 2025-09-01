import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";
import type { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  const snap = await adminDb
    .collection("Azizi")
    .orderBy("respondedAt", "desc")
    .limit(1000)
    .get();

  const items = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
    const data = d.data();
    return {
      id: d.id,
      rsvp: (typeof data.rsvp === "string" ? data.rsvp : null) as string | null,
      ticketNumber: (typeof data.ticketNumber === "string" ? data.ticketNumber : null) as string | null,
      mobile: (typeof data.mobile === "string" ? data.mobile : null) as string | null,
      name: (typeof data.name === "string" ? data.name : null) as string | null,
      company: (typeof data.company === "string" ? data.company : null) as string | null,
      respondedAt: data.respondedAt?.toDate?.()
        ? data.respondedAt.toDate().toISOString()
        : null,
    };
  });

  return NextResponse.json({ items });
}
