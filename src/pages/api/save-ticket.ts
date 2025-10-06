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
interface SaveTicketBody { txRef: string; }

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

  const raw = req.body as Partial<SaveTicketBody> | undefined;
  const txRef = raw?.txRef;
  if (!isNonEmptyString(txRef)) {
    return res.status(400).json({ message: 'Missing required field: txRef' });
  }

  // Require same authenticated user as the order
  const authHeader = req.headers.authorization ?? '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) return res.status(401).json({ message: 'Missing auth token' });

  let requesterUid: string;
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    requesterUid = decoded.uid;
  } catch {
    return res.status(401).json({ message: 'Invalid auth token' });
  }

  try {
    // Load canonical order created in /api/flw/verify
    const orderRef = adminDb.collection('orders').doc(txRef);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return res.status(404).json({ message: 'Order not found for txRef.' });

    const order = orderSnap.data() as {
      status: 'pending' | 'paid' | 'failed';
      userId?: string | null;
      buyerEmail: string | null;
      buyerName: string | null;
      ticketType: string;
    };

    if (order.status !== 'paid') return res.status(409).json({ message: 'Order not paid. Ticket cannot be issued.' });
    if (!order.userId || order.userId !== requesterUid) return res.status(403).json({ message: 'Forbidden' });

    const fullName = (order.buyerName ?? '').trim() || 'Guest';
    const email = (order.buyerEmail ?? '').trim().toLowerCase();
    const ticketType = order.ticketType || 'General Admission';
    const location = getLocationText(ticketType);
    const emailLower = email;

    // Optional: role snapshot
    let rolesAtPurchase: Role[] | null = null;
    let primaryRoleAtPurchase: Role | null = null;
    try {
      const userSnap = await adminDb.collection('users').doc(requesterUid).get();
      const roles = (userSnap.exists
        ? ((userSnap.data()?.roles as Role[] | undefined) ?? ['attendee'])
        : ['attendee']) as Role[];
      rolesAtPurchase = roles;
      primaryRoleAtPurchase = pickPrimaryRole(roles);
    } catch {
      /* non-blocking */
    }

    // Idempotent ticket: tickets/{txRef}
    const ticketDocRef = adminDb.collection('tickets').doc(txRef);
    const pre = await ticketDocRef.get();
    if (pre.exists) {
      const t = pre.data()!;
      return res.status(200).json({
        message: 'Ticket already issued.',
        qrCode: t.qrCode ?? null,
        ticketNumber: t.ticketNumber,
        location: t.location,
        primaryRoleAtPurchase: t.primaryRoleAtPurchase ?? 'attendee',
        fullName, email, ticketType,
        emailSent: !!t.emailSent,
        alreadyIssued: true,
      });
    }

    // Create ticket
    // ✅ pass txRef to Option B generator
    const ticketNumber = generateTicketNumber(ticketType, txRef);
    const qrText = `https://www.atinuda.africa/ticket/${ticketNumber}?name=${encodeURIComponent(fullName)}`;

    await ticketDocRef.create({
      txRef,
      orderRef: orderRef.path,
      fullName,
      email,
      emailLower,
      uid: requesterUid,
      ticketType,
      ticketNumber,
      location,
      rolesAtPurchase: rolesAtPurchase ?? null,
      primaryRoleAtPurchase: primaryRoleAtPurchase ?? null,
      complimentary: false,
      checkIn: { azizi6th: false, day1: false, day2: false, gala8pm: false },
      emailSent: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Assets + email
    let qrCode: string | null = null;
    let emailSent = false;
    try {
      qrCode = await generateQRCode(qrText);
      const pdfBuffer = await generateTicketPDF(fullName, ticketNumber, qrCode, location);
      if (email) {
        await sendConfirmationEmail({ to: email, fullName, pdfBuffer, ticketType, ticketNumber, location });
        emailSent = true;
      }
    } catch (e) {
      console.error('❌ Ticket email/pdf error:', e);
    }

    // Update ticket & mark order/payments fulfilled
    await ticketDocRef.set({ emailSent, qrCode: qrCode ?? null, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await orderRef.set({ ticketIssued: true, ticketNumber, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await adminDb.collection('payments').doc(txRef).set(
      {
        txRef,
        status: 'paid',
        uid: requesterUid,
        email,
        emailLower,
        fullName,
        ticketType,
        ticketNumber,
        ticketIssued: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(200).json({
      message: 'Ticket issued successfully.',
      qrCode,
      ticketNumber,
      location,
      primaryRoleAtPurchase: primaryRoleAtPurchase ?? 'attendee',
      fullName,
      email,
      ticketType,
      emailSent, // for UI badge
    });
  } catch (err) {
    const code = (err as { code?: unknown })?.code;
    if (code === 6 || code === 'already-exists') {
      const snap = await adminDb.collection('tickets').doc((req.body as SaveTicketBody).txRef).get();
      const data = snap.data();
      return res.status(200).json({
        message: 'Ticket already issued.',
        qrCode: data?.qrCode ?? null,
        ticketNumber: data?.ticketNumber,
        location: data?.location,
        primaryRoleAtPurchase: data?.primaryRoleAtPurchase ?? 'attendee',
        fullName: data?.fullName ?? 'Guest',
        email: data?.email ?? '',
        ticketType: data?.ticketType ?? 'General Admission',
        emailSent: !!data?.emailSent,
        alreadyIssued: true,
      });
    }
    console.error('❌ save-ticket fatal:', err);
    return res.status(500).json({ message: 'Server error issuing ticket.' });
  }
}
