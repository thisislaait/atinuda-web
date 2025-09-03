// pages/api/save-ticket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { generateQRCode } from '@/utils/qr';
import { generateTicketPDF } from '@/utils/pdf';
import { sendConfirmationEmail } from '@/utils/email';
import { getLocationText } from '@/utils/constants';
import { generateTicketNumber } from '@/utils/ticketNumber';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Gracefully handle invalid JSON
  let body: { fullName?: string; email?: string; ticketType?: string };
  try {
    body = req.body;
    if (typeof body !== 'object') throw new Error('Invalid body format');
  } catch (err) {
    return res.status(400).json({ message: 'Invalid request body format.', err });
  }

  const { fullName, email, ticketType } = req.body;
  const location = getLocationText(ticketType);

  console.log('[Incoming Request]', { fullName, email, ticketType });

  if (!fullName || !email || !ticketType) {
    return res.status(400).json({
      message: 'Missing required fields: fullName, email, or ticketType.',
    });
  }

  // ✅ NEW: normalize email once
  const emailLower = String(email).trim().toLowerCase();

  const ticketNumber = generateTicketNumber(ticketType);
  const qrText = `https://www.atinuda.africa/ticket/${ticketNumber}?name=${encodeURIComponent(fullName)}`;

  try {
    // ✅ NEW: try to find by normalized field first
    let existingTicketSnap = await adminDb
      .collection('payments')
      .where('emailLower', '==', emailLower)
      .limit(1)
      .get();

    // ✅ NEW: fallback for older docs that don't have emailLower yet
    if (existingTicketSnap.empty) {
      const legacySnap = await adminDb
        .collection('payments')
        .where('email', '==', email) // original case
        .limit(1)
        .get();

      if (!legacySnap.empty) {
        existingTicketSnap = legacySnap;

        // ✅ Optional backfill (non-blocking): add emailLower to old doc
        const docRef = legacySnap.docs[0].ref;
        docRef.set({ emailLower }, { merge: true }).catch(() => {});
      }
    }

    if (!existingTicketSnap.empty) {
      // ⚠️ Keep existing behavior (400) so nothing breaks downstream
      const existingTicket = existingTicketSnap.docs[0].data();
      return res.status(400).json({
        message: `A ticket has already been generated for "${email}".`,
        ticketNumber: existingTicket.ticketNumber,
        emailSent: existingTicket.emailSent,
        location: existingTicket.location, // small bonus: return location too
      });
    }

    // Generate QR + PDF (unchanged)
    const qrCode = await generateQRCode(qrText);
    const pdfBuffer = await generateTicketPDF(
      fullName,
      ticketNumber,
      qrCode,
      location
    );

    let emailSent = false;
    try {
      await sendConfirmationEmail({
        to: email,
        fullName,
        pdfBuffer,
        ticketType,
        ticketNumber,
        location,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
    }

    // ✅ NEW: persist normalized email alongside original
    const docRef = await adminDb.collection('payments').add({
      fullName,
      email,         // keep as-is for display
      emailLower,    // new field for fast, case-insensitive lookups
      ticketType,
      ticketNumber,
      location,
      emailSent,
      checkIn: {
        day1: false,
        day2: false,
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log('✅ Saved ticket with ID:', docRef.id);

    return res.status(200).json({
      message: 'Ticket saved and email sent successfully.',
      qrCode,
      ticketNumber,
      location,
    });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error processing ticket:', err);

    return res.status(500).json({
      message:
        'An unexpected error occurred while processing your ticket. Please try again later.',
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }
}
