import { NextResponse } from 'next/server';
import { FieldValue, adminDb } from '@/utils/firebaseAdmin';
import { speakerSlotSessions } from '@/data/speakerSlots';

const FIRESTORE_WRITE_TIMEOUT_MS = 12000;

type RouteContext = {
  params: Promise<{ eventslug: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  });
}

function isTransportTimeoutError(message: string): boolean {
  const upper = message.toUpperCase();
  return (
    upper.includes('DEADLINE_EXCEEDED') ||
    upper.includes('WAITING FOR LB PICK') ||
    upper.includes('FIRESTORE WRITE TIMEOUT')
  );
}

export async function POST(req: Request, context: RouteContext) {
  const params = await context.params;
  const eventSlug = typeof params.eventslug === 'string' ? params.eventslug.trim() : '';
  if (!eventSlug) {
    return NextResponse.json({ ok: false, message: 'Missing event slug.' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const firstName = normalizeName(payload.firstName);
  const lastName = normalizeName(payload.lastName);
  if (!firstName || !lastName) {
    return NextResponse.json(
      { ok: false, message: 'Firstname and lastname are required.' },
      { status: 400 }
    );
  }

  if (!isRecord(payload.selections)) {
    return NextResponse.json({ ok: false, message: 'Selections are required.' }, { status: 400 });
  }

  const selections = payload.selections as Record<string, unknown>;

  let sessionsSelected: Array<{
    sessionId: string;
    sessionLabel: string;
    sessionHeading: string;
    optionId: string;
    track: string;
    topic: string;
    speaker: string;
  }>;

  try {
    sessionsSelected = speakerSlotSessions.map((session) => {
      const selectedRaw = selections[session.id];
      const selectedOptionId = typeof selectedRaw === 'string' ? selectedRaw.trim() : '';
      if (!selectedOptionId) {
        throw new Error(`Please select one workshop for ${session.label}.`);
      }

      const selectedOption = session.options.find((option) => option.id === selectedOptionId);
      if (!selectedOption) {
        throw new Error(`Invalid workshop selected for ${session.label}.`);
      }

      return {
        sessionId: session.id,
        sessionLabel: session.label,
        sessionHeading: session.heading,
        optionId: selectedOption.id,
        track: selectedOption.track,
        topic: selectedOption.topic,
        speaker: selectedOption.speaker,
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid workshop selections.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  try {
    const slotRef = adminDb
      .collection('events')
      .doc(eventSlug)
      .collection('Speakerslots')
      .doc();

    await withTimeout(
      slotRef.set({
        id: slotRef.id,
        eventSlug,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        selections: sessionsSelected,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        source: 'speaker-slots-form',
      }),
      FIRESTORE_WRITE_TIMEOUT_MS,
      'Firestore write timeout.'
    );

    return NextResponse.json({ ok: true, id: slotRef.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save workshop selections.';
    if (isTransportTimeoutError(message)) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Temporary Firestore connectivity issue. Please retry in a few seconds.',
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
