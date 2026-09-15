import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export {admin};

/**
 * Parent-event catalog used by loyalty scoring.
 *
 * NOTE: duplicated from the app repo's src/data/events.ts until the shared
 * package exists (PRD-platform-uplift §4 A3). Keep slugs + endAtISO in sync.
 * Sub-experiences (ceo-dinner, azizi-mixer) are excluded — they never earn
 * points; their tickets live under their ticketHost event.
 */
export const PARENT_EVENTS: ReadonlyArray<{
  slug: string;
  name: string;
  endAtISO: string;
}> = [
  {
    slug: "local-to-global-2025",
    name: "LTG Summit",
    endAtISO: "2025-10-08T23:59:59Z",
  },
  {
    slug: "martitus-retreat-2026",
    name: "The Elevation",
    endAtISO: "2026-03-14T23:59:59Z",
  },
  {
    slug: "still-rising-2026",
    name: "Still Rising",
    endAtISO: "2026-08-19T22:00:00+01:00",
  },
  {
    slug: "atinuda-7-2026",
    name: "Atinuda 7.0",
    endAtISO: "2026-12-06T23:59:59+01:00",
  },
];

/** Loyalty point values — mirror of app src/features/loyalty/types.ts. */
export const LOYALTY_POINTS = {
  TICKET_PURCHASE: 500,
  REPEAT_ATTENDEE: 1000,
  PROFILE_COMPLETE: 100,
  REFERRAL: 300,
} as const;

/** Points required for active membership (Discover access). */
export const MEMBER_THRESHOLD = 420;

/**
 * True when the given ticket document counts as active.
 * Missing status is treated as active (legacy docs).
 * @param {FirebaseFirestore.DocumentData | undefined} data Ticket doc data.
 * @return {boolean} Whether the ticket is active.
 */
export function isTicketActive(
  data: FirebaseFirestore.DocumentData | undefined,
): boolean {
  if (!data) return false;
  return data.status == null || data.status === "active";
}

/**
 * Attendee docs are normally keyed by uid; legacy docs are keyed by email.
 * @param {string} id Document id.
 * @return {boolean} True when the id looks like an email address.
 */
export function isEmailLikeId(id: string): boolean {
  return id.includes("@");
}

/**
 * Admin check for callable functions: @atinuda.africa email, or an
 * admin/super_admin entry in users/{uid}.roles.
 * @param {string} uid Caller uid.
 * @param {string | undefined} email Caller token email.
 * @return {Promise<boolean>} Whether the caller is an admin.
 */
export async function isAdminIdentity(
  uid: string,
  email: string | undefined,
): Promise<boolean> {
  if (email && email.toLowerCase().endsWith("@atinuda.africa")) return true;
  const snap = await db.doc(`users/${uid}`).get();
  const roles = snap.exists ? (snap.data()?.roles as unknown) : null;
  return (
    Array.isArray(roles) &&
    (roles.includes("admin") || roles.includes("super_admin"))
  );
}
