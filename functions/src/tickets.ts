// Ticket lifecycle callables (PRD-platform-uplift §5.1).
// Client writes to events/{slug}/attendees are locked down by rules;
// these callables are the server-side replacements.

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {admin, db} from "./shared";

const {FieldValue} = admin.firestore;

/**
 * Resolves the ticket-host slug for sub-events.
 * @param {string} slug Event slug.
 * @return {string} Host slug that owns the attendees collection.
 */
function ticketHostSlug(slug: string): string {
  if (slug === "ceo-dinner-2025-10-08") return "local-to-global-2025";
  if (slug === "azizi-mixer-2025-10-06") return "local-to-global-2025";
  return slug;
}

/**
 * Attaches a legacy ticket to the signed-in user's uid.
 *
 * Legacy/manual tickets were stored keyed (or looked up) by email. When the
 * owner signs in, this copies the ticket to attendees/{uid} so the app's
 * uid-keyed reads work. The email comes from the verified auth token — a
 * user can only ever attach a ticket carrying their own email.
 */
export const attachTicketByEmail = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const email = (auth.token.email ?? "").toLowerCase();
  if (!email) {
    throw new HttpsError("failed-precondition", "Account has no email.");
  }

  const rawSlug = String(
    (request.data as {eventSlug?: string} | undefined)?.eventSlug ?? "",
  ).trim();
  if (!rawSlug) {
    throw new HttpsError("invalid-argument", "eventSlug is required.");
  }
  const hostSlug = ticketHostSlug(rawSlug);
  const attendees = db.collection(`events/${hostSlug}/attendees`);

  const uidDoc = await attendees.doc(auth.uid).get();
  if (uidDoc.exists) {
    return {ok: true, found: true, alreadyAttached: true};
  }

  // Match either an email-keyed doc id or an email field, case-insensitively
  // where the data allows. Two reads keep this on existing indexes.
  let source: FirebaseFirestore.DocumentSnapshot | null = null;
  const byId = await attendees.doc(email).get();
  if (byId.exists) {
    source = byId;
  } else {
    const byField = await attendees
      .where("email", "==", auth.token.email)
      .limit(1)
      .get();
    if (!byField.empty) source = byField.docs[0];
  }
  if (!source) return {ok: true, found: false};

  const data = source.data() ?? {};
  await attendees.doc(auth.uid).set(
    {
      ...data,
      userId: auth.uid,
      email: auth.token.email,
      lastTxRef: `email-attach-${Date.now()}`,
      attachedFrom: source.id,
      attachedAt: FieldValue.serverTimestamp(),
    },
    {merge: true},
  );
  logger.info("ticket attached by email", {
    uid: auth.uid,
    hostSlug,
    source: source.id,
  });
  return {ok: true, found: true, ticketNumber: data.ticketNumber ?? null};
});

const STAFF_EMAIL_DOMAIN = "@atinuda.africa";
const RETREAT_HOST = "martitus-retreat-2026";

const WEB_CHECKIN_BASE = "https://www.atinuda.africa";

/**
 * Generates a ticket number matching the app's historical format.
 * @param {string} slug Host event slug.
 * @param {string} productKey Product key for the prefix.
 * @return {string} Ticket number.
 */
function generateTicketNumber(slug: string, productKey: string): string {
  const rand = `${Date.now().toString(36).slice(-4)}${Math.random()
    .toString(36)
    .slice(2, 6)}`.toUpperCase();
  if (slug === RETREAT_HOST) return `ATNMAU-${rand}`;
  const prefixes: Record<string, string> = {
    conference: "CONF",
    workshop: "WRK",
    premium: "PREM",
    executive: "EXEC",
    dinner: "DINE",
  };
  return `ATN-${prefixes[productKey] ?? "GEN"}-${rand}`;
}

/**
 * Issues (or upgrades to) a complimentary staff ticket.
 *
 * Replaces the client-side auto-issuance that keyed off the user's email
 * domain — the domain check now runs against the verified auth token, and
 * the ticket type/amount are fixed server-side.
 */
export const issueComplimentaryTicket = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const email = (auth.token.email ?? "").toLowerCase();
  if (!email.endsWith(STAFF_EMAIL_DOMAIN) || auth.token.email_verified !== true) {
    throw new HttpsError(
      "permission-denied",
      "Complimentary tickets are limited to verified staff accounts.",
    );
  }

  const data = (request.data ?? {}) as {
    eventSlug?: string;
    issuedToName?: string;
    eventName?: string;
    eventDateText?: string;
    eventCity?: string;
    eventCountry?: string;
  };
  const rawSlug = String(data.eventSlug ?? "").trim();
  if (!rawSlug) {
    throw new HttpsError("invalid-argument", "eventSlug is required.");
  }
  const hostSlug = ticketHostSlug(rawSlug);

  // Server-fixed spec — mirrors resolveComplimentaryTicketSpec in the app.
  const spec = hostSlug === RETREAT_HOST ?
    {ticketType: "Retreat Access", currency: "USD", amount: 2800, productKey: "main"} :
    {ticketType: "Executive Access", currency: "NGN", amount: 650000, productKey: "executive"};

  const ref = db.doc(`events/${hostSlug}/attendees/${auth.uid}`);
  const existing = (await ref.get()).data() ?? null;
  if (existing && existing.productKey === spec.productKey) {
    return {ok: true, ticketNumber: existing.ticketNumber ?? null, upgraded: false};
  }

  const ticketNumber = generateTicketNumber(hostSlug, spec.productKey);
  await ref.set(
    {
      userId: auth.uid,
      email: auth.token.email,
      issuedToName: data.issuedToName ?? existing?.issuedToName ?? auth.token.email,
      ticketNumber,
      ticketType: spec.ticketType,
      currency: spec.currency,
      amount: spec.amount,
      quantity: 1,
      unitAmount: spec.amount,
      purchasedAt: FieldValue.serverTimestamp(),
      status: "active",
      qrPayload:
        `${WEB_CHECKIN_BASE}/checkin/${encodeURIComponent(ticketNumber)}` +
        `?slug=${encodeURIComponent(hostSlug)}`,
      lastTxRef: `comp-${Date.now()}`,
      eventSlug: hostSlug,
      eventName: data.eventName ?? existing?.eventName ?? null,
      eventDateText: data.eventDateText ?? existing?.eventDateText ?? null,
      eventCity: data.eventCity ?? existing?.eventCity ?? null,
      eventCountry: data.eventCountry ?? existing?.eventCountry ?? null,
      productKey: spec.productKey,
      checkIns: existing?.checkIns ?? {},
    },
    {merge: true},
  );
  logger.info("complimentary ticket issued", {uid: auth.uid, hostSlug, ticketNumber});
  return {ok: true, ticketNumber, upgraded: Boolean(existing)};
});
