// app/api/spark-apply/route.ts
import { NextResponse } from "next/server";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const ticket_number = String(form.get("ticket_number") || "").trim();
    const solution = String(form.get("solution") || "").trim();
    const solution_link = String(form.get("solution_link") || "").trim();
    const year_incorporated = Number(form.get("year_incorporated"));
    const founder_structure = String(form.get("founder_structure") || "").trim();
    const annual_revenue_usd = Number(form.get("annual_revenue_usd") || 0);
    const pitch_deck_link = String(form.get("pitch_deck_link") || "").trim();

    if (
      !ticket_number ||
      !solution ||
      !solution_link ||
      !year_incorporated ||
      !founder_structure ||
      !pitch_deck_link
    ) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Enrich from your tickets collection
    let applicantName: string | null = null;
    let company: string | null = null;
    const paymentsSnap = await adminDb
      .collection("payments")
      .where("ticketNumber", "==", ticket_number)
      .limit(1)
      .get();

    if (!paymentsSnap.empty) {
      const p = paymentsSnap.docs[0].data();
      applicantName = p.name ?? p.fullName ?? null;
      company = p.company ?? p.organisation ?? null;
    }

    // Save application data in Firestore
    await adminDb.collection("spark_applications").doc(ticket_number).set(
      {
        ticket_number,
        applicant_name: applicantName,
        company,
        solution,
        solution_link,
        year_incorporated,
        founder_structure,
        annual_revenue_usd,
        pitch_deck_link,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        source: "web_form",
        status: "submitted",
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, message: "Application submitted!" });
  } catch (err: any) {
    console.error("spark-apply POST error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
