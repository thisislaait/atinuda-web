// pages/api/spark-apply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import type { DocumentData } from "firebase-admin/firestore";

type Stage = "ideation" | "conceptualisation" | "mvp" | "growth";

interface BodyCommon {
  // optional ticket
  ticket_number?: string;

  // always-required application fields
  solution?: string;
  solution_link?: string;
  year_incorporated?: number | string;
  founder_structure?: string;
  annual_revenue_usd?: number | string;
  country?: string;
  available_pitch_clinic?: "yes" | "no" | string;
  received_funding?: "yes" | "no" | string;
  stage?: Stage | string;

  // fallback identity (required IF ticket is missing or invalid)
  fallback_name?: string;
  fallback_company?: string;
  fallback_email?: string;
  fallback_mobile?: string;
  fallback_willing_attend?: "yes" | "no" | string;
}

interface PaymentDoc extends DocumentData {
  fullName?: string;
  name?: string;
  customerName?: string;
  company?: string;
  organisation?: string;
  organization?: string;
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
    const body = (req.body ?? {}) as BodyCommon;

    // --- Extract + normalize base fields ------------------------------------
    const ticket_number = String(body.ticket_number ?? "").trim();

    const solution = (body.solution ?? "").toString().trim();
    const solution_link = (body.solution_link ?? "").toString().trim();
    const year_incorporated_num = Number(body.year_incorporated);
    const founder_structure = (body.founder_structure ?? "").toString().trim();
    const annual_revenue_usd_num = Number(body.annual_revenue_usd ?? 0);
    const country = (body.country ?? "").toString().trim();
    const available_pitch_clinic = (body.available_pitch_clinic ?? "").toString().trim();
    const received_funding = (body.received_funding ?? "").toString().trim();
    const stage = (body.stage ?? "").toString().trim() as Stage;

    // Fallback identity
    const fallback_name = (body.fallback_name ?? "").toString().trim();
    const fallback_company = (body.fallback_company ?? "").toString().trim();
    const fallback_email = (body.fallback_email ?? "").toString().trim();
    const fallback_mobile = (body.fallback_mobile ?? "").toString().trim();
    const fallback_willing_attend = (body.fallback_willing_attend ?? "").toString().trim();

    // --- Validate base (always required) fields ------------------------------
    if (
      !solution ||
      !solution_link ||
      !year_incorporated_num ||
      !founder_structure ||
      !country ||
      !available_pitch_clinic ||
      !received_funding ||
      !stage
    ) {
      return res.status(400).json({ ok: false, message: "Missing required fields." });
    }

    // --- Try resolve identity via ticket (if provided) -----------------------
    let ticketVerified = false;
    let applicant_name: string | null = null;
    let company: string | null = null;
    let email: string | null = null;

    if (ticket_number) {
      // Fast path: docId == ticketNumber
      const byId = await adminDb.collection("payments").doc(ticket_number).get();
      let payment: PaymentDoc | undefined;

      if (byId.exists) {
        payment = byId.data() as PaymentDoc;
      } else {
        // Fallback query
        const q = await adminDb
          .collection("payments")
          .where("ticketNumber", "==", ticket_number)
          .limit(1)
          .get();
        if (!q.empty) payment = q.docs[0].data() as PaymentDoc;
      }

      if (payment) {
        ticketVerified = true;
        applicant_name =
          payment.fullName ??
          payment.name ??
          payment.customerName ??
          null;

        company =
          payment.company ??
          payment.organisation ??
          payment.organization ??
          null;

        email = payment.email ?? null;
      }
    }

    // --- If no/invalid ticket, require fallback identity ---------------------
    if (!ticketVerified) {
      if (!fallback_name || !fallback_company || !fallback_email || !fallback_mobile || !fallback_willing_attend) {
        return res.status(400).json({
          ok: false,
          message:
            "Please provide your Name, Company, Email, Mobile, and Willingness to attend if you do not have a valid ticket.",
        });
      }
      applicant_name = fallback_name;
      company = fallback_company;
      email = fallback_email;
    }

    // --- Build application record -------------------------------------------
    const docId = ticket_number || `no-ticket_${Date.now()}`; // stable key if ticket present; otherwise unique
    const payload = {
      ticket_number: ticket_number || null,
      ticket_verified: ticketVerified,
      applicant_name,
      company,
      email,
      fallback_mobile: !ticketVerified ? fallback_mobile : null,
      fallback_willing_attend: !ticketVerified ? fallback_willing_attend : null,

      solution,
      solution_link,
      year_incorporated: year_incorporated_num,
      founder_structure,
      annual_revenue_usd: isFinite(annual_revenue_usd_num) ? annual_revenue_usd_num : 0,
      country,
      available_pitch_clinic,
      received_funding,
      stage,

      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      source: "web_form",
      status: "submitted",
    };

    // --- Save (merge when ticket used; set if no ticket) ---------------------
    await adminDb
      .collection("spark_applications")
      .doc(docId)
      .set(payload, { merge: true });

    return res.status(200).json({ ok: true, message: "Application submitted successfully!" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    console.error("spark-apply POST error:", err);
    return res.status(500).json({ ok: false, message });
  }
}
