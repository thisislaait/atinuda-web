import type { NextApiRequest, NextApiResponse } from 'next';
import { FieldPath } from 'firebase-admin/firestore';
import { adminDb } from '@/utils/firebaseAdmin';

const DEFAULT_EVENT_SLUG = 'martitus-retreat-2026';
const DEFAULT_LIMIT = 1000;
const MAX_LIMIT = 5000;

const SLOT_IDS = {
  day2: ['d2-wellness'],
  day4: ['d4-parallel-workshops-round-1', 'd4-parallel-workshops-round-2'],
  day5: ['d5-parallel-workshops-round-1', 'd5-parallel-workshops-round-2'],
  day6: ['d6-island-experience-day'],
} as const;

type AnyRecord = Record<string, unknown>;

type ExportRow = {
  first_name: string;
  last_name: string;
  ticket_number: string;
  day_2_session: string;
  day_4_sessions: string;
  day_5_sessions: string;
  day_6_session: string;
  travel_arrival_date: string;
  travel_departure_date: string;
  airline: string;
  hotel_name: string;
  size: string;
  bio: string;
};

type AttendeeLite = {
  id: string;
  userId: string;
  ticketNumber: string;
  issuedToName: string;
  logistics: AnyRecord;
  raw: AnyRecord;
};

type UserProfile = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  shortBio?: string;
  longBio?: string;
  bio?: string;
  shirtSize?: string;
  shoeSize?: string;
  size?: string;
};

type SlotMap = Record<string, { options: Record<string, string> }>;

type ApiResponse =
  | {
      ok: true;
      eventSlug: string;
      generatedAt: string;
      count: number;
      rows: ExportRow[];
    }
  | { ok: false; message: string };

function pickText(...values: unknown[]): string {
  for (const v of values) {
    if (v == null) continue;
    const text = String(v).trim();
    if (text) return text;
  }
  return '';
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const cleaned = pickText(fullName);
  if (!cleaned) return { firstName: '', lastName: '' };
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

function humanize(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!items.length) return [];

  const results: R[] = new Array(items.length);
  let idx = 0;

  async function runWorker() {
    while (true) {
      const current = idx;
      idx += 1;
      if (current >= items.length) return;
      results[current] = await worker(items[current] as T, current);
    }
  }

  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, () => runWorker());
  await Promise.all(runners);
  return results;
}

function toCsv(rows: ExportRow[]): string {
  const headers: Array<keyof ExportRow> = [
    'first_name',
    'last_name',
    'ticket_number',
    'day_2_session',
    'day_4_sessions',
    'day_5_sessions',
    'day_6_session',
    'travel_arrival_date',
    'travel_departure_date',
    'airline',
    'hotel_name',
    'size',
    'bio',
  ];

  const esc = (value: string) => {
    const safe = value.replace(/"/g, '""');
    return /[",\n]/.test(safe) ? `"${safe}"` : safe;
  };

  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((h) => esc(pickText(row[h]))).join(','));
  });

  return `${lines.join('\n')}\n`;
}

async function fetchSlotMap(eventSlug: string): Promise<SlotMap> {
  const out: SlotMap = {};
  const slotsSnap = await adminDb.collection('events').doc(eventSlug).collection('selectionSlots').get();

  await Promise.all(
    slotsSnap.docs.map(async (slotDoc) => {
      const options: Record<string, string> = {};
      const optionsSnap = await slotDoc.ref.collection('options').get();
      optionsSnap.forEach((optionDoc) => {
        const optionData = (optionDoc.data() ?? {}) as AnyRecord;
        options[optionDoc.id] = pickText(optionData.title, optionData.label, optionData.name, humanize(optionDoc.id));
      });
      out[slotDoc.id] = { options };
    }),
  );

  return out;
}

async function fetchUsersMap(userIds: string[]): Promise<Record<string, UserProfile>> {
  const unique = Array.from(new Set(userIds.map((id) => id.trim()).filter(Boolean)));
  if (!unique.length) return {};

  const out: Record<string, UserProfile> = {};
  const groups = chunk(unique, 30);

  for (const group of groups) {
    const snap = await adminDb.collection('users').where(FieldPath.documentId(), 'in', group).get();
    snap.forEach((doc) => {
      out[doc.id] = (doc.data() ?? {}) as UserProfile;
    });
  }

  return out;
}

async function fetchRegistrationsMap(userId: string): Promise<Record<string, AnyRecord>> {
  const out: Record<string, AnyRecord> = {};
  if (!userId) return out;

  const regSnap = await adminDb.collection('users').doc(userId).collection('registrations').get();
  regSnap.forEach((doc) => {
    out[doc.id] = (doc.data() ?? {}) as AnyRecord;
  });

  return out;
}

function resolveSelection(regDoc: AnyRecord | undefined, slotId: string, slotMap: SlotMap): string {
  if (!regDoc) return '';

  const optionTitle = pickText(regDoc.optionTitle, regDoc.title, regDoc.label, regDoc.name);
  if (optionTitle) return optionTitle;

  const optionId = pickText(regDoc.optionId, regDoc.optionKey, regDoc.choice, regDoc.selected);
  if (!optionId) return '';

  return pickText(slotMap[slotId]?.options?.[optionId], humanize(optionId));
}

function resolveDaySelections(
  slotIds: readonly string[],
  registrations: Record<string, AnyRecord>,
  slotMap: SlotMap,
): string {
  const values = slotIds
    .map((slotId, idx) => {
      const picked = resolveSelection(registrations[slotId], slotId, slotMap);
      if (!picked) return '';
      if (slotIds.length === 1) return picked;
      return `Round ${idx + 1}: ${picked}`;
    })
    .filter(Boolean);

  return values.join(' | ');
}

function makeRow(
  attendee: AttendeeLite,
  user: UserProfile | undefined,
  registrations: Record<string, AnyRecord>,
  slotMap: SlotMap,
): ExportRow {
  const attendeeName = splitName(attendee.issuedToName);
  const displayName = splitName(pickText(user?.displayName));

  const firstName = pickText(user?.firstName, attendeeName.firstName, displayName.firstName);
  const lastName = pickText(user?.lastName, attendeeName.lastName, displayName.lastName);

  const logistics = attendee.logistics || {};

  return {
    first_name: firstName,
    last_name: lastName,
    ticket_number: pickText(attendee.ticketNumber),
    day_2_session: resolveDaySelections(SLOT_IDS.day2, registrations, slotMap),
    day_4_sessions: resolveDaySelections(SLOT_IDS.day4, registrations, slotMap),
    day_5_sessions: resolveDaySelections(SLOT_IDS.day5, registrations, slotMap),
    day_6_session: resolveDaySelections(SLOT_IDS.day6, registrations, slotMap),
    travel_arrival_date: pickText(logistics.arrivalDate),
    travel_departure_date: pickText(logistics.checkOutDate, logistics.departureDate),
    airline: pickText(logistics.airline),
    hotel_name: pickText(logistics.hotelName),
    size: pickText(user?.shirtSize, user?.size, user?.shoeSize, attendee.raw.shirtSize, attendee.raw.size),
    bio: pickText(user?.shortBio, user?.longBio, user?.bio, attendee.raw.shortBio, attendee.raw.bio),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse | string>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const eventSlug =
    typeof req.query.event === 'string' && req.query.event.trim()
      ? req.query.event.trim()
      : DEFAULT_EVENT_SLUG;

  const rawLimit = Number(req.query.limit ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(rawLimit)))
    : DEFAULT_LIMIT;

  const format = typeof req.query.format === 'string' ? req.query.format.trim().toLowerCase() : 'json';

  try {
    const attendeesSnap = await adminDb.collection('events').doc(eventSlug).collection('attendees').get();

    let attendees = attendeesSnap.docs.map((docSnap) => {
      const data = (docSnap.data() ?? {}) as AnyRecord;
      return {
        id: docSnap.id,
        userId: pickText(data.userId, docSnap.id),
        ticketNumber: pickText(data.ticketNumber),
        issuedToName: pickText(data.issuedToName, data.issuedTo, data.fullName),
        logistics: (data.logistics ?? {}) as AnyRecord,
        raw: data,
      } as AttendeeLite;
    });

    attendees = attendees.slice(0, limit);

    const userIds = attendees.map((a) => a.userId).filter(Boolean);
    const [slotMap, userMap] = await Promise.all([fetchSlotMap(eventSlug), fetchUsersMap(userIds)]);

    const registrationsEntries = await mapWithConcurrency(attendees, 20, async (attendee) => {
      return {
        userId: attendee.userId,
        regs: await fetchRegistrationsMap(attendee.userId),
      };
    });

    const regsByUserId: Record<string, Record<string, AnyRecord>> = {};
    registrationsEntries.forEach((entry) => {
      regsByUserId[entry.userId] = entry.regs;
    });

    const rows = attendees
      .map((attendee) =>
        makeRow(attendee, userMap[attendee.userId], regsByUserId[attendee.userId] || {}, slotMap),
      )
      .sort((a, b) => {
        const aName = `${a.last_name} ${a.first_name}`.trim().toLowerCase();
        const bName = `${b.last_name} ${b.first_name}`.trim().toLowerCase();
        if (aName === bName) return a.ticket_number.localeCompare(b.ticket_number);
        return aName.localeCompare(bName);
      });

    res.setHeader('Cache-Control', 'no-store');

    if (format === 'csv') {
      const csv = toCsv(rows);
      const dateTag = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="full-attendees-${eventSlug}-${dateTag}.csv"`);
      return res.status(200).send(csv);
    }

    return res.status(200).json({
      ok: true,
      eventSlug,
      generatedAt: new Date().toISOString(),
      count: rows.length,
      rows,
    });
  } catch (error) {
    console.error('ERROR /api/full-attendees', error);
    return res.status(500).json({ ok: false, message: 'Server error exporting full attendees' });
  }
}
