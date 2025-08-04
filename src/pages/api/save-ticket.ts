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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, email, ticketType } = req.body;
  const location = getLocationText(ticketType);

  console.log('[Incoming Request]', req.body);

  if (!fullName || !email || !ticketType) {
    return res.status(400).json({
      message: 'Missing required fields: fullName, email, or ticketType.',
    });
  }

  const ticketNumber = generateTicketNumber(ticketType);

  const qrText = `https://atinuda.africa/ticket/${ticketNumber}`;

  try {
    // ✅ Check if a ticket already exists for this email
    const existingTicketSnap = await adminDb
      .collection('payments')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingTicketSnap.empty) {
      const existingTicket = existingTicketSnap.docs[0].data();
      return res.status(400).json({
        message: `A ticket has already been generated for "${email}".`,
        ticketNumber: existingTicket.ticketNumber,
        emailSent: existingTicket.emailSent,
      });
    }

    // ✅ Generate QR code and PDF
    const qrCode = await generateQRCode(qrText); // Make sure this is a full data URL
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
        location
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // ✅ Save ticket to Firestore
    const docRef = await adminDb.collection('payments').add({
      fullName,
      email,
      ticketType,
      ticketNumber,
      location,
      emailSent,
      checkIn: {
      day1: false,
      day2: false
    },
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log('Saved ticket with ID:', docRef.id);

    // ✅ Return success response including QR code
    return res.status(200).json({
      message: 'Ticket saved and email sent successfully.',
      qrCode,
      ticketNumber,
      location,
    });
  } catch (error: any) {
    console.error('Error processing ticket:', error);
    return res.status(500).json({
      message:
        'An unexpected error occurred while processing your ticket. Please try again later.',
      error: error?.message || 'Unknown error',
    });
  }
}
