// pages/api/tickets/by-number.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';

type TicketDoc = {
  fullName?: string;
  name?: string;
  customerName?: string;
  email?: string;
  emailLower?: string;
  company?: string | null;
  organisation?: string | null;
  organization?: string | null;
  ticketType?: string;
  ticketNumber?: string;
  ticket_number?: string;
};

function toDisplayName(d: TicketDoc) {
  return d.fullName ?? d.name ?? d.customerName ?? '';
}
function toCompany(d: TicketDoc) {
  return d.company ?? d.organisation ?? d.organization ?? '';
}
function getStoredTicket(d: TicketDoc) {
  return d.ticketNumber ?? d.ticket_number ?? '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const raw = String(req.query.ticketNumber ?? '').trim();
  if (!raw) {
    return res.status(400).json({ ok: false, message: 'Missing ticketNumber.' });
  }

  // Normalize (users sometimes type extra spaces or lower/upper)
  const tn = raw.replace(/\s+/g, '').toUpperCase();

  try {
    // Helper to shape response
    const respond = (doc: TicketDoc) =>
      res.status(200).json({
        ok: true,
        fullName: toDisplayName(doc),
        email: doc.email ?? doc.emailLower ?? '',
        company: toCompany(doc),
        ticketType: doc.ticketType ?? 'General Admission',
        ticketNumber: getStoredTicket(doc) || raw,
      });

    // ---------- 1) Direct docId lookup (payments) ----------
    const payDoc = await adminDb.collection('payments').doc(tn).get();
    if (payDoc.exists) return respond(payDoc.data() as TicketDoc);

    // ---------- 2) Field lookups (payments) ----------
    let snap = await adminDb.collection('payments').where('ticketNumber', '==', tn).limit(1).get();
    if (snap.empty) {
      snap = await adminDb.collection('payments').where('ticket_number', '==', tn).limit(1).get();
    }
    if (!snap.empty) {
      return respond(snap.docs[0].data() as TicketDoc);
    }

    // ---------- 3) Direct docId lookup (tickets) ----------
    const ticDoc = await adminDb.collection('tickets').doc(tn).get();
    if (ticDoc.exists) return respond(ticDoc.data() as TicketDoc);

    // ---------- 4) Field lookups (tickets) ----------
    let tSnap = await adminDb.collection('tickets').where('ticketNumber', '==', tn).limit(1).get();
    if (tSnap.empty) {
      tSnap = await adminDb.collection('tickets').where('ticket_number', '==', tn).limit(1).get();
    }
    if (!tSnap.empty) {
      return respond(tSnap.docs[0].data() as TicketDoc);
    }

    // Nothing found
    return res.status(404).json({ ok: false, message: 'No ticket found for that number.' });
  } catch (err) {
    console.error('by-number error:', err);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
}
