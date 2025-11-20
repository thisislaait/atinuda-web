import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { getTicketHostSlug } from '@/data/events';

type Body = {
  ticketNumber?: string;
  event?: string;
  status?: boolean;
  slug?: string;
};

type ApiResp = { ok: boolean; message?: string };

const ALLOWED_EVENTS = new Set([
  'day1',
  'day2',
  'dinner',
  'azizi',
  'breakout',
  'masterclass',
  'gift',
]);

const normalizeTicket = (value?: string) => String(value || '').trim().toUpperCase();
const normalizeEvent = (value?: string) => String(value || '').trim().toLowerCase();

async function updateTicketDoc(ticketNumber: string, eventKey: string, status: boolean): Promise<boolean> {
  let snap = await adminDb.collection('tickets').doc(ticketNumber).get();
  if (!snap.exists) {
    const alt = await adminDb.collection('tickets').where('ticketNumber', '==', ticketNumber).limit(1).get();
    if (!alt.empty) {
      snap = await alt.docs[0].ref.get();
    }
  }

  if (!snap.exists) return false;

  await snap.ref.set(
    {
      checkIn: { [eventKey]: status },
      lastUpdatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return true;
}

async function updateEventAttendeeDoc(slug: string, ticketNumber: string, eventKey: string, status: boolean): Promise<boolean> {
  if (!slug) return false;
  const hostSlug = getTicketHostSlug(slug);

  const col = adminDb.collection('events').doc(hostSlug).collection('attendees');
  const q = await col.where('ticketNumber', '==', ticketNumber).limit(1).get();
  if (q.empty) return false;

  const ref = q.docs[0].ref;
  await ref.set(
    {
      checkIns: { [eventKey]: status },
      lastUpdatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const body = (req.body ?? {}) as Body;
  const ticketNumber = normalizeTicket(body.ticketNumber);
  const eventKeyRaw = normalizeEvent(body.event);
  const status = Boolean(body.status ?? true);
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

  if (!ticketNumber) {
    return res.status(400).json({ ok: false, message: 'ticketNumber is required' });
  }
  if (!eventKeyRaw || !ALLOWED_EVENTS.has(eventKeyRaw)) {
    return res.status(400).json({ ok: false, message: 'Invalid event key' });
  }

  try {
    const updatedTicket = await updateTicketDoc(ticketNumber, eventKeyRaw, status);
    const updatedAttendee = slug ? await updateEventAttendeeDoc(slug, ticketNumber, eventKeyRaw, status) : false;

    if (!updatedTicket && !updatedAttendee) {
      return res.status(404).json({ ok: false, message: 'Ticket not found' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ ok: false, message });
  }
}
