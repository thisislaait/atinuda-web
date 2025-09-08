// pages/api/spark-apply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";

interface SparkApplyBody {
  ticket_number: string;
  solution: string;
  solution_link: string;
  year_incorporated: number;
  founder_structure: string;
  annual_revenue_usd: number;
  country: string;
  available_pitch_clinic: string; // could be "yes"/"no"
  received_funding: string;       // could be "yes"/"no"
  stage: "ideation" | "conceptualisation" | "mvp" | "growth";
}

interface PaymentDoc {
  fullName?: string;
  company?: string;
  email?: string;
  ticketNumber?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const {
      ticket_number,
      solution,
      solution_link,
      year_incorporated,
      founder_structure,
      annual_revenue_usd,
      country,
      available_pitch_clinic,
      received_funding,
      stage,
    } = req.body as SparkApplyBody;

    // ✅ Ensure ticket exists in payments
    const paymentsSnap = await adminDb
      .collection("payments")
      .where("ticketNumber", "==", ticket_number)
      .limit(1)
      .get();

    if (paymentsSnap.empty) {
      return res.status(400).json({
        ok: false,
        message: "Invalid ticket number. Please use a registered ticket.",
      });
    }

    const p = paymentsSnap.docs[0].data() as PaymentDoc;

    const applicantName = p.fullName ?? null;
    const email = p.email ?? null;
    const company = p.company ?? null;

    // ✅ Required field validation
    if (
      !ticket_number ||
      !solution ||
      !solution_link ||
      !year_incorporated ||
      !founder_structure ||
      !country ||
      !available_pitch_clinic ||
      !received_funding ||
      !stage
    ) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    // ✅ Save application
    await adminDb.collection("spark_applications").doc(ticket_number).set(
      {
        ticket_number,
        applicant_name: applicantName,
        company,
        email,
        solution,
        solution_link,
        year_incorporated: Number(year_incorporated),
        founder_structure,
        annual_revenue_usd: Number(annual_revenue_usd) || 0,
        country,
        available_pitch_clinic,
        received_funding,
        stage,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        source: "web_form",
        status: "submitted",
      },
      { merge: true }
    );

    return res
      .status(200)
      .json({ ok: true, message: "Application submitted successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    console.error("spark-apply POST error:", err);
    return res.status(500).json({ ok: false, message });
  }
}
