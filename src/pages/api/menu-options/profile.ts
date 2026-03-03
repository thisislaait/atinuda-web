import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { adminDb } from '@/utils/firebaseAdmin';
import type { ProfilePreview } from '@/lib/menu-options';

type ApiResponse = {
  matched: boolean;
  source?: string;
  profile?: ProfilePreview | null;
  error?: string;
};

const BodySchema = z.object({
  eventSlug: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

function normalize(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function extractNameParts(data: Record<string, unknown>): { firstName: string; lastName: string; fullName: string } {
  const firstName = String(data.firstName ?? '').trim();
  const lastName = String(data.lastName ?? '').trim();

  if (firstName || lastName) {
    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
    };
  }

  const full = String(data.displayName ?? data.name ?? data.fullName ?? '').trim();
  if (!full) return { firstName: '', lastName: '', fullName: '' };

  const bits = full.split(/\s+/).filter(Boolean);
  return {
    firstName: bits[0] ?? '',
    lastName: bits.length > 1 ? bits.slice(1).join(' ') : '',
    fullName: full,
  };
}

function toProfile(data: Record<string, unknown>, uid?: string): ProfilePreview {
  const names = extractNameParts(data);
  return {
    uid: uid ?? String(data.uid ?? data.userId ?? ''),
    firstName: names.firstName,
    lastName: names.lastName,
    displayName: String(data.displayName ?? names.fullName ?? ''),
    email: String(data.email ?? ''),
    company: String(data.company ?? data.organization ?? ''),
    phone: String(data.phone ?? ''),
    instagram: String(data.instagram ?? ''),
    linkedin: String(data.linkedin ?? ''),
    shortBio: String(data.shortBio ?? ''),
    longBio: String(data.longBio ?? ''),
    photoURL: String(data.photoURL ?? ''),
  };
}

function matchesName(data: Record<string, unknown>, first: string, last: string): boolean {
  const names = extractNameParts(data);
  return normalize(names.firstName) === first && normalize(names.lastName) === last;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ matched: false, error: 'Method Not Allowed' });
  }

  try {
    const parsed = BodySchema.parse(req.body);
    const firstNeedle = normalize(parsed.firstName);
    const lastNeedle = normalize(parsed.lastName);

    // 1) Prefer event attendees list.
    try {
      const attendeesSnap = await adminDb
        .collection('events')
        .doc(parsed.eventSlug)
        .collection('attendees')
        .limit(800)
        .get();

      for (const doc of attendeesSnap.docs) {
        const attendeeData = doc.data() as Record<string, unknown>;
        if (!matchesName(attendeeData, firstNeedle, lastNeedle)) continue;

        const uid = String(attendeeData.uid ?? attendeeData.userId ?? doc.id);
        const userSnap = await adminDb.collection('users').doc(uid).get();
        const userData = userSnap.exists ? (userSnap.data() as Record<string, unknown>) : {};
        const merged = { ...attendeeData, ...userData };

        return res.status(200).json({
          matched: true,
          source: 'event-attendees',
          profile: toProfile(merged, uid),
        });
      }
    } catch {
      // continue with user fallback
    }

    // 2) Attempt exact users queries.
    const hits: Array<{ id: string; data: Record<string, unknown> }> = [];
    const firstCandidates = Array.from(
      new Set([parsed.firstName.trim(), titleCase(parsed.firstName.trim())]),
    ).filter(Boolean);
    const lastCandidates = Array.from(
      new Set([parsed.lastName.trim(), titleCase(parsed.lastName.trim())]),
    ).filter(Boolean);

    for (const firstName of firstCandidates) {
      for (const lastName of lastCandidates) {
        try {
          const snap = await adminDb
            .collection('users')
            .where('firstName', '==', firstName)
            .where('lastName', '==', lastName)
            .limit(3)
            .get();

          snap.forEach((doc) => {
            hits.push({ id: doc.id, data: doc.data() as Record<string, unknown> });
          });
        } catch {
          // continue
        }
      }
    }

    for (const hit of hits) {
      if (matchesName(hit.data, firstNeedle, lastNeedle)) {
        return res.status(200).json({
          matched: true,
          source: 'users-exact',
          profile: toProfile(hit.data, hit.id),
        });
      }
    }

    // 3) Last fallback: limited scan.
    const allUsersSnap = await adminDb.collection('users').limit(1200).get();
    for (const doc of allUsersSnap.docs) {
      const data = doc.data() as Record<string, unknown>;
      if (!matchesName(data, firstNeedle, lastNeedle)) continue;

      return res.status(200).json({
        matched: true,
        source: 'users-fallback-scan',
        profile: toProfile(data, doc.id),
      });
    }

    return res.status(404).json({ matched: false, profile: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lookup failed';
    return res.status(400).json({ matched: false, error: message });
  }
}
