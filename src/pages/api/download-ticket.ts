// pages/api/download-ticket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/utils/firebaseAdmin';
import { generateQRCode } from '@/utils/qr';
import { generateTicketPDF } from '@/utils/pdf';

type DownloadBody = { txRef: string };

type TicketDoc = {
  uid?: string | null;
  fullName?: string;
  email?: string;
  ticketType?: string;
  ticketNumber?: string;
  location?: string;
  qrCode?: string | null; // optional if you stored it
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const body = req.body as Partial<DownloadBody> | undefined;
  const txRef = body?.txRef ?? '';
  if (!isNonEmptyString(txRef)) {
    return res.status(400).json({ message: 'Missing required field: txRef' });
  }

  // 🔐 Enforce that only the ticket owner can download
  const authHeader = req.headers.authorization ?? '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) return res.status(401).json({ message: 'Missing auth token' });

  const decoded = await getAuth().verifyIdToken(idToken).catch(() => null);
  if (!decoded?.uid) return res.status(401).json({ message: 'Invalid auth token' });

  try {
    // Load ticket by txRef (we issue tickets at tickets/{txRef})
    const ticketSnap = await adminDb.collection('tickets').doc(txRef).get();
    if (!ticketSnap.exists) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const t = ticketSnap.data() as TicketDoc;

    if (t.uid && t.uid !== decoded.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const fullName = (t.fullName ?? 'Guest').trim();
    const ticketNumber = t.ticketNumber ?? '';
    const location = t.location ?? 'TBA';

    if (!ticketNumber) {
      return res.status(409).json({ message: 'Ticket not fully issued yet.' });
    }

    // Use stored QR if available; otherwise regenerate deterministically
    const qrBase64 =
      t.qrCode ??
      (await generateQRCode(
        `https://www.atinuda.africa/ticket/${ticketNumber}?name=${encodeURIComponent(fullName)}`
      ));

    const pdfBuffer = await generateTicketPDF(fullName, ticketNumber, qrBase64, location);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Ticket-${ticketNumber}.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error('❌ download-ticket error for', txRef, err);
    return res.status(500).json({ message: 'Failed to generate ticket PDF.' });
  }
}
