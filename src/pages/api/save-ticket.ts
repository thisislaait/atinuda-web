// pages/api/save-ticket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { generateQRCode } from '@/utils/qr';
import { generateTicketPDF } from '@/utils/pdf';
import { sendConfirmationEmail } from '@/utils/email';
import { getLocationText } from '@/utils/constants';
import { generateTicketNumber } from '@/utils/ticketNumber';

type Role = 'attendee' | 'speaker' | 'organizer' | (string & {});

type SaveTicketBody = {
  fullName: string;
  email: string;
  ticketType: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function pickPrimaryRole(roles: Role[] | undefined): Role {
  if (!roles || roles.length === 0) return 'attendee';
  if (roles.includes('organizer')) return 'organizer';
  if (roles.includes('speaker')) return 'speaker';
  return roles[0];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Safely parse body
  const raw = req.body as Partial<SaveTicketBody> | unknown;

  if (
    typeof raw !== 'object' ||
    raw == null ||
    !isNonEmptyString((raw as Partial<SaveTicketBody>).fullName) ||
    !isNonEmptyString((raw as Partial<SaveTicketBody>).email) ||
    !isNonEmptyString((raw as Partial<SaveTicketBody>).ticketType)
  ) {
    return res
      .status(400)
      .json({ message: 'Missing required fields: fullName, email, ticketType.' });
  }

  const { fullName, email, ticketType } = raw as SaveTicketBody;

  // Now ticketType is definitely a string
  const location = getLocationText(ticketType);

  // Normalize email for consistent lookups
  const emailLower = email.trim().toLowerCase();

  // Try to resolve the UID (optional, best-effort)
  let uid: string | undefined;
  try {
    const authHeader = req.headers.authorization ?? '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (isNonEmptyString(idToken)) {
      const decoded = await getAuth().verifyIdToken(idToken);
      uid = decoded.uid;
    } else {
      const userRecord = await getAuth().getUserByEmail(emailLower).catch(() => null);
      if (userRecord) uid = userRecord.uid;
    }
  } catch {
    // Non-blocking
  }

  // Best-effort role snapshot
  let rolesAtPurchase: Role[] | null = null;
  let primaryRoleAtPurchase: Role | null = null;
  try {
    if (uid) {
      const userSnap = await adminDb.collection('users').doc(uid).get();
      const roles = (userSnap.exists
        ? ((userSnap.data()?.roles as Role[] | undefined) ?? ['attendee'])
        : ['attendee']) as Role[];
      rolesAtPurchase = roles;
      primaryRoleAtPurchase = pickPrimaryRole(roles);
    }
  } catch {
    // Non-blocking
  }

  const ticketNumber = generateTicketNumber(ticketType);
  const qrText = `https://www.atinuda.africa/ticket/${ticketNumber}?name=${encodeURIComponent(
    fullName
  )}`;

  try {
    // Check for existing ticket by normalized email first
    let existingSnap = await adminDb
      .collection('payments')
      .where('emailLower', '==', emailLower)
      .limit(1)
      .get();

    // Fallback for legacy docs (no emailLower)
    if (existingSnap.empty) {
      const legacy = await adminDb
        .collection('payments')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!legacy.empty) {
        existingSnap = legacy;
        // Non-blocking backfill of emailLower
        legacy.docs[0].ref.set({ emailLower }, { merge: true }).catch(() => {});
      }
    }

    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0].data();
      return res.status(400).json({
        message: `A ticket has already been generated for "${email}".`,
        ticketNumber: existing.ticketNumber,
        emailSent: existing.emailSent,
        location: existing.location,
      });
    }

    // Generate QR + PDF
    const qrCode = await generateQRCode(qrText);
    const pdfBuffer = await generateTicketPDF(fullName, ticketNumber, qrCode, location);

    // Try send email (non-blocking failure)
    let emailSent = false;
    try {
      await sendConfirmationEmail({
        to: email,
        fullName,
        pdfBuffer,
        ticketType,
        ticketNumber,
        location,
        // You can add role to your template later if wanted:
        // role: primaryRoleAtPurchase ?? undefined,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
    }

    // Save payment
    await adminDb.collection('payments').add({
      fullName,
      email,
      emailLower,
      uid: uid ?? null,
      ticketType,
      ticketNumber,
      location,
      emailSent,
      rolesAtPurchase: rolesAtPurchase ?? null,
      primaryRoleAtPurchase: primaryRoleAtPurchase ?? null,
      complimentary: false,
      checkIn: {
        azizi6th: false,
        day1: false,
        day2: false,
        gala8pm: false,
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: 'Ticket saved and email sent successfully.',
      qrCode,
      ticketNumber,
      location,
      primaryRoleAtPurchase: primaryRoleAtPurchase ?? 'attendee',
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
