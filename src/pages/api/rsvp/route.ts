// FILE: src/app/api/rsvps/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const snap = await adminDb
    .collection("Azizi")
    .orderBy("respondedAt", "desc")
    .limit(1000)
    .get();

  const items = snap.docs.map(
    (d: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
      const data = d.data();
      return {
        id: d.id,
        rsvp: data.rsvp ?? null,
        ticketNumber: data.ticketNumber ?? null,
        mobile: data.mobile ?? null,
        eventName: data.eventName ?? null,
        eventDate: data.eventDate ?? null,
        eventVenue: data.eventVenue ?? null,
        respondedAt: data.respondedAt?.toDate?.()
          ? data.respondedAt.toDate().toISOString()
          : null,
      };
    }
  );

  return NextResponse.json({ items });
}

