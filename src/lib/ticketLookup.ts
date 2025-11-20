'use server';

import { adminDb } from '@/utils/firebaseAdmin';
import { ATTENDEES } from '@/lib/attendee';
import { getLocationText } from '@/utils/constants';
import type { TicketPayload } from '@/types/tickets';

type TicketDoc = {
  ticketNumber?: string;
  fullName?: string;
  name?: string;
  email?: string;
  ticketType?: string;
  giftClaimed?: boolean;
  checkIn?: Record<string, unknown>;
};

const normalizeNumber = (value: string) => String(value || '').trim().toUpperCase();

async function fetchTicketFromFirestore(ticketNumber: string): Promise<TicketPayload | null> {
  let snap = await adminDb.collection('tickets').doc(ticketNumber).get();
  if (!snap.exists) {
    const q = await adminDb.collection('tickets').where('ticketNumber', '==', ticketNumber).limit(1).get();
    if (!q.empty) {
      snap = q.docs[0];
    }
  }

  if (!snap.exists) return null;

  const data = snap.data() as TicketDoc;
  const ticketType = String(data.ticketType || 'General Admission');
  const location = getLocationText(ticketType) || null;
  const rawCheckIns = data.checkIn && typeof data.checkIn === 'object' ? data.checkIn : null;
  const checkIn = rawCheckIns
    ? Object.fromEntries(Object.entries(rawCheckIns).map(([key, value]) => [key, Boolean(value)]))
    : null;

  return {
    fullName: String(data.fullName || data.name || 'Guest'),
    email: String(data.email || ''),
    ticketType,
    ticketNumber: String(data.ticketNumber || ticketNumber),
    location,
    checkIn,
    giftClaimed: Boolean(data.giftClaimed ?? false),
  };
}

function fallbackTicket(ticketNumber: string): TicketPayload | null {
  const match = ATTENDEES.find((record) => normalizeNumber(record.ticketNumber) === ticketNumber);
  if (!match) return null;

  const ticketType = match.ticketType || 'General Admission';
  const location = getLocationText(ticketType) || null;

  return {
    fullName: String(match.fullName || 'Guest'),
    email: String(match.email || ''),
    ticketType,
    ticketNumber: String(match.ticketNumber || ticketNumber),
    location,
    checkIn: null,
    giftClaimed: false,
  };
}

export async function lookupTicketByNumber(ticketNumberRaw: string): Promise<{ source: 'tickets' | 'attendees'; ticket: TicketPayload } | null> {
  const ticketNumber = normalizeNumber(ticketNumberRaw);
  if (!ticketNumber) return null;

  const firestoreTicket = await fetchTicketFromFirestore(ticketNumber);
  if (firestoreTicket) return { source: 'tickets', ticket: firestoreTicket };

  const staticTicket = fallbackTicket(ticketNumber);
  if (staticTicket) return { source: 'attendees', ticket: staticTicket };

  return null;
}
