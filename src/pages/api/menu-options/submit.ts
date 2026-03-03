import type { NextApiRequest, NextApiResponse } from 'next';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { adminDb } from '@/utils/firebaseAdmin';
import { BEL_OMBRE_OPTIONS, LABOURDONNAIS_OPTIONS, type ProfilePreview } from '@/lib/menu-options';

type ApiResponse = {
  ok: boolean;
  entryId?: string;
  writes?: string[];
  error?: string;
};

const validBelStarter = new Set(BEL_OMBRE_OPTIONS.starter);
const validBelMain = new Set(BEL_OMBRE_OPTIONS.main);
const validBelDessert = new Set(BEL_OMBRE_OPTIONS.dessert);
const validLabStarter = new Set(LABOURDONNAIS_OPTIONS.starter);
const validLabMain = new Set(LABOURDONNAIS_OPTIONS.main);

const BodySchema = z.object({
  eventSlug: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  profile: z
    .object({
      uid: z.string().optional().nullable(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      displayName: z.string().optional(),
      email: z.string().optional(),
      company: z.string().optional(),
      phone: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      shortBio: z.string().optional(),
      longBio: z.string().optional(),
      photoURL: z.string().optional(),
    })
    .nullable()
    .optional(),
  belombre: z.object({
    starter: z.string().min(1),
    main: z.string().min(1),
    dessert: z.string().min(1),
  }),
  labourdonnais: z.object({
    starter: z.string().min(1),
    main: z.string().min(1),
  }),
});

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const parsed = BodySchema.parse(req.body);

    if (!validBelStarter.has(parsed.belombre.starter as (typeof BEL_OMBRE_OPTIONS.starter)[number])) {
      return res.status(400).json({ ok: false, error: 'Invalid Bel Ombre starter option' });
    }
    if (!validBelMain.has(parsed.belombre.main as (typeof BEL_OMBRE_OPTIONS.main)[number])) {
      return res.status(400).json({ ok: false, error: 'Invalid Bel Ombre main option' });
    }
    if (!validBelDessert.has(parsed.belombre.dessert as (typeof BEL_OMBRE_OPTIONS.dessert)[number])) {
      return res.status(400).json({ ok: false, error: 'Invalid Bel Ombre dessert option' });
    }
    if (!validLabStarter.has(parsed.labourdonnais.starter as (typeof LABOURDONNAIS_OPTIONS.starter)[number])) {
      return res.status(400).json({ ok: false, error: 'Invalid Labourdonnais starter option' });
    }
    if (!validLabMain.has(parsed.labourdonnais.main as (typeof LABOURDONNAIS_OPTIONS.main)[number])) {
      return res.status(400).json({ ok: false, error: 'Invalid Labourdonnais main option' });
    }

    const profile = (parsed.profile ?? null) as ProfilePreview | null;
    const entryIdFromProfile = profile?.uid?.trim() || '';
    const fallbackId = `${normalize(parsed.firstName)}-${normalize(parsed.lastName)}`;
    const entryId = entryIdFromProfile || fallbackId;

    const menuRoot = adminDb.collection('events').doc(parsed.eventSlug).collection('menuoption');
    const belRef = menuRoot.doc('belombre');
    const labRef = menuRoot.doc('labourdonnais');

    const common = {
      eventSlug: parsed.eventSlug,
      firstName: parsed.firstName.trim(),
      lastName: parsed.lastName.trim(),
      profileUid: profile?.uid ?? null,
      profileSnapshot: profile ?? null,
      source: 'web-menu-form',
      updatedAt: FieldValue.serverTimestamp(),
    };

    const batch = adminDb.batch();

    batch.set(
      belRef,
      {
        venue: 'belombre',
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    batch.set(
      belRef.collection('entries').doc(entryId),
      {
        ...common,
        createdAt: FieldValue.serverTimestamp(),
        venue: 'belombre',
        selections: {
          starter: parsed.belombre.starter,
          main: parsed.belombre.main,
          dessert: parsed.belombre.dessert,
        },
      },
      { merge: true },
    );

    batch.set(
      labRef,
      {
        venue: 'labourdonnais',
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    batch.set(
      labRef.collection('entries').doc(entryId),
      {
        ...common,
        createdAt: FieldValue.serverTimestamp(),
        venue: 'labourdonnais',
        selections: {
          starter: parsed.labourdonnais.starter,
          main: parsed.labourdonnais.main,
        },
      },
      { merge: true },
    );

    await batch.commit();

    return res.status(200).json({
      ok: true,
      entryId,
      writes: [
        `events/${parsed.eventSlug}/menuoption/belombre/entries/${entryId}`,
        `events/${parsed.eventSlug}/menuoption/labourdonnais/entries/${entryId}`,
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submit failed';
    return res.status(400).json({ ok: false, error: message });
  }
}
