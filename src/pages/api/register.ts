// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";
import { generateQRCode } from "@/utils/qr";
import { generateTicketPDF } from "@/utils/pdf";
import { sendConfirmationEmail } from "@/utils/email";
import { getLocationText } from "@/utils/constants";
import { generateTicketNumber } from "@/utils/ticketNumber";

type RegisterBody = {
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  ticketType?: string;
};

type RegisterResponse = {
  ok: boolean;
  message?: string;
  txRef?: string;
  ticketNumber?: string;
  qrCode?: string | null;
  location?: string;
  ticketType?: string;
  emailSent?: boolean;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const body = req.body as Partial<RegisterBody> | undefined;
  if (!body) return res.status(400).json({ ok: false, message: "Missing body" });

  const fullName = isNonEmptyString(body.fullName) ? body.fullName.trim() : null;
  const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : null;
  const phone = isNonEmptyString(body.phone) ? body.phone.trim() : null;
  const company = isNonEmptyString(body.company) ? (body.company as string).trim() : null;
  const ticketType = isNonEmptyString(body.ticketType) ? (body.ticketType as string).trim() : "Conference Access";

  if (!fullName || !email || !phone) {
    return res.status(400).json({ ok: false, message: "Missing required fields: fullName, email, phone" });
  }

  // Create deterministic txRef for this registration
  const txRef = `REG-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // Build order payload (mark as paid so ticket can be issued)
  const orderData = {
    status: "paid" as const,
    userId: null as string | null,
    buyerEmail: email,
    buyerName: fullName,
    buyerPhone: phone,
    buyerCompany: company ?? null,
    ticketType,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    // Save order
    const orderRef = adminDb.collection("orders").doc(txRef);
    await orderRef.set(orderData);

    // Generate ticketNumber
    const ticketNumber = generateTicketNumber(ticketType, txRef);
    const location = getLocationText(ticketType);

    // Prepare ticket doc
    const ticketDoc = {
      txRef,
      orderRef: orderRef.path,
      fullName,
      email,
      emailLower: email,
      uid: null,
      ticketType,
      ticketNumber,
      location,
      rolesAtPurchase: null,
      primaryRoleAtPurchase: "attendee",
      complimentary: false,
      checkIn: { azizi6th: false, day1: false, day2: false, gala8pm: false },
      emailSent: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const ticketRef = adminDb.collection("tickets").doc(txRef);
    await ticketRef.create(ticketDoc);

    // Write a payments doc consistent with your other flows
    await adminDb.collection("payments").doc(txRef).set(
      {
        txRef,
        status: "paid",
        uid: null,
        email,
        emailLower: email,
        fullName,
        ticketType,
        ticketNumber,
        ticketIssued: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Generate assets (qr + pdf) and attempt to email
    let qrCode: string | null = null;
    let emailSent = false;
    try {
      const qrText = `https://www.atinuda.africa/ticket/${ticketNumber}?name=${encodeURIComponent(fullName)}`;
      qrCode = await generateQRCode(qrText);
      const pdfBuffer = await generateTicketPDF(fullName, ticketNumber, qrCode, location);
      if (email) {
        await sendConfirmationEmail({ to: email, fullName, pdfBuffer, ticketType, ticketNumber, location });
        emailSent = true;
      }
    } catch (assetErr) {
      console.error("Ticket asset/email error:", assetErr);
    }

    // Update ticket doc with qr and emailSent
    await ticketRef.set({ qrCode: qrCode ?? null, emailSent, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

    return res.status(200).json({
      ok: true,
      message: "Registration successful. Ticket issued.",
      txRef,
      ticketNumber,
      qrCode: qrCode ?? null,
      location,
      ticketType,
      emailSent,
    });
  } catch (err) {
    console.error("pages/api/register error:", err);
    // if doc already exists return conflict-like response
    try {
      const existing = await adminDb.collection("tickets").doc(txRef).get();
      if (existing.exists) {
        const d = existing.data();
        return res.status(200).json({
          ok: true,
          message: "Ticket already exists.",
          txRef,
          ticketNumber: d?.ticketNumber,
          qrCode: d?.qrCode ?? null,
          location: d?.location ?? getLocationText(ticketType),
          ticketType: ticketType,
          emailSent: !!d?.emailSent,
        });
      }
    } catch {
      // ignore secondary error
    }

    return res.status(500).json({ ok: false, message: "Server error issuing ticket." });
  }
}
