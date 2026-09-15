// Server-authoritative loyalty engine (PRD-platform-uplift §5.2).
// Replaces the client-side auto-award hooks. All history entry ids match
// the previous client/backfill ids, so re-running is always idempotent.

import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  admin,
  db,
  isAdminIdentity,
  isEmailLikeId,
  isTicketActive,
  LOYALTY_POINTS,
  MEMBER_THRESHOLD,
  PARENT_EVENTS,
} from "./shared";

const {FieldValue} = admin.firestore;

// ── Profile completion (port of app src/features/onboarding/profileLayers) ──

/**
 * Weighted profile completion percentage: 60% core + 40% discovery.
 * Must stay in sync with the app's computeProfileCompletion.
 * @param {FirebaseFirestore.DocumentData} d users/{uid} data.
 * @return {number} 0–100.
 */
function profileTotalPct(d: FirebaseFirestore.DocumentData): number {
  const has = (v: unknown): boolean =>
    typeof v === "string" && v.trim().length > 0;
  const core = [
    has(d.displayName),
    has(d.company),
    has(d.shortBio),
    has(d.photoURL),
    has(d.phone),
    has(d.instagram) || has(d.linkedin) || has(d.website),
  ];
  const discovery = [
    has(d.longBio),
    has(d.lookingFor),
    has(d.offering),
    has(d.clientType),
    has(d.funFacts),
    has(d.industries) || has(d.interests),
  ];
  const corePct = Math.round(
    (core.filter(Boolean).length / core.length) * 100,
  );
  const discPct = Math.round(
    (discovery.filter(Boolean).length / discovery.length) * 100,
  );
  return Math.round(corePct * 0.6 + discPct * 0.4);
}

// ── Award helpers ────────────────────────────────────────────────────────────

/**
 * Awards the ticket-purchase entry (and the repeat-attendee bonus when the
 * second parent event is crossed) for one user + one ended event.
 * Idempotent via fixed history ids.
 * @param {string} uid User id.
 * @param {string} slug Parent event slug.
 * @param {string} eventName Event display name.
 * @return {Promise<boolean>} True when new points were written.
 */
async function awardEventAttendance(
  uid: string,
  slug: string,
  eventName: string,
): Promise<boolean> {
  const acctRef = db.doc(`loyaltyAccounts/${uid}`);
  const entryRef = acctRef.collection("history").doc(`ticket_purchase_${slug}`);
  const bonusRef = acctRef.collection("history").doc("repeat_attendee");

  return db.runTransaction(async (tx) => {
    const [entry, bonus, acct] = await Promise.all([
      tx.get(entryRef),
      tx.get(bonusRef),
      tx.get(acctRef),
    ]);
    if (entry.exists) return false;

    const attended: string[] = acct.exists ?
      ((acct.data()?.eventsAttended as string[]) ?? []) :
      [];
    let pts = LOYALTY_POINTS.TICKET_PURCHASE;

    tx.set(entryRef, {
      type: "ticket_purchase",
      points: LOYALTY_POINTS.TICKET_PURCHASE,
      description: `Ticket — ${eventName}`,
      eventSlug: slug,
      createdAt: FieldValue.serverTimestamp(),
    });

    const willHave = new Set([...attended, slug]).size;
    if (!bonus.exists && attended.length < 2 && willHave >= 2) {
      pts += LOYALTY_POINTS.REPEAT_ATTENDEE;
      tx.set(bonusRef, {
        type: "repeat_attendee",
        points: LOYALTY_POINTS.REPEAT_ATTENDEE,
        description: "Repeat attendee bonus — 2nd parent event attended",
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    tx.set(
      acctRef,
      {
        userId: uid,
        pointsBalance: FieldValue.increment(pts),
        lifetimePoints: FieldValue.increment(pts),
        eventsAttended: FieldValue.arrayUnion(slug),
        updatedAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
    return true;
  });
}

/**
 * Runs attendance awards for every ended parent event.
 * @return {Promise<number>} Number of new awards written.
 */
async function sweepEndedEvents(): Promise<number> {
  const now = Date.now();
  let awarded = 0;
  for (const event of PARENT_EVENTS) {
    const end = Date.parse(event.endAtISO);
    if (!Number.isFinite(end) || end >= now) continue;

    const snap = await db
      .collection("events")
      .doc(event.slug)
      .collection("attendees")
      .get();
    for (const doc of snap.docs) {
      if (isEmailLikeId(doc.id)) continue; // legacy email-keyed docs
      if (!isTicketActive(doc.data())) continue;
      try {
        const wrote = await awardEventAttendance(
          doc.id,
          event.slug,
          event.name,
        );
        if (wrote) awarded++;
      } catch (err) {
        logger.error("awardEventAttendance failed", {
          uid: doc.id,
          slug: event.slug,
          err,
        });
      }
    }
  }
  return awarded;
}

// ── Triggers ─────────────────────────────────────────────────────────────────

/** Daily sweep: award points for ended events. 03:10 Lagos time. */
export const loyaltyDailySweep = onSchedule(
  {schedule: "10 3 * * *", timeZone: "Africa/Lagos"},
  async () => {
    const awarded = await sweepEndedEvents();
    logger.info("loyaltyDailySweep complete", {awarded});
  },
);

/** Admin-triggered sweep for immediate reconciliation. */
export const runLoyaltySweep = onCall(async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const ok = await isAdminIdentity(auth.uid, auth.token.email ?? undefined);
  if (!ok) throw new HttpsError("permission-denied", "Admins only.");
  const awarded = await sweepEndedEvents();
  return {ok: true, awarded};
});

/**
 * Membership grant: when a loyalty balance crosses the threshold, mark the
 * user an active member. users/{uid}.isActiveMember is a protected field —
 * only this function (Admin SDK) writes it.
 */
export const onLoyaltyAccountWritten = onDocumentWritten(
  "loyaltyAccounts/{uid}",
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;
    const balance = (after.data()?.pointsBalance as number) ?? 0;
    if (balance < MEMBER_THRESHOLD) return;

    const userRef = db.doc(`users/${event.params.uid}`);
    const user = await userRef.get();
    if (!user.exists || user.data()?.isActiveMember === true) return;
    await userRef.set({isActiveMember: true}, {merge: true});
    logger.info("membership granted", {uid: event.params.uid, balance});
  },
);

/** Profile-complete award: 100 pts once, when completion reaches 85%. */
export const onUserProfileWritten = onDocumentWritten(
  "users/{uid}",
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;
    const data = after.data() ?? {};
    if (profileTotalPct(data) < 85) return;

    const uid = event.params.uid;
    const acctRef = db.doc(`loyaltyAccounts/${uid}`);
    const entryRef = acctRef.collection("history").doc("profile_complete");

    await db.runTransaction(async (tx) => {
      const entry = await tx.get(entryRef);
      if (entry.exists) return;
      tx.set(entryRef, {
        type: "profile_complete",
        points: LOYALTY_POINTS.PROFILE_COMPLETE,
        description: "Profile completed",
        createdAt: FieldValue.serverTimestamp(),
      });
      tx.set(
        acctRef,
        {
          userId: uid,
          pointsBalance: FieldValue.increment(
            LOYALTY_POINTS.PROFILE_COMPLETE,
          ),
          lifetimePoints: FieldValue.increment(
            LOYALTY_POINTS.PROFILE_COMPLETE,
          ),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });
  },
);

/**
 * Referral credit: when a user's ticket becomes active and their user doc
 * carries referredBy, award the referrer once (validated server-side).
 * Replaces the client pendingReferrals write/claim dance; a claimed record
 * is still written for audit and for the referrer's history UI.
 */
export const onAttendeeTicketWritten = onDocumentWritten(
  "events/{eventSlug}/attendees/{attendeeId}",
  async (event) => {
    const {attendeeId} = event.params;
    if (isEmailLikeId(attendeeId)) return;

    const after = event.data?.after;
    const before = event.data?.before;
    if (!after?.exists || !isTicketActive(after.data())) return;
    // Only on first activation (create, or transition into active).
    if (before?.exists && isTicketActive(before.data())) return;

    const refereeSnap = await db.doc(`users/${attendeeId}`).get();
    if (!refereeSnap.exists) return;
    const referee = refereeSnap.data() ?? {};
    const referrerId = referee.referredBy as string | undefined;
    if (!referrerId || referrerId === attendeeId) return;

    const referrerSnap = await db.doc(`users/${referrerId}`).get();
    if (!referrerSnap.exists) return; // referrer must be a real member

    const acctRef = db.doc(`loyaltyAccounts/${referrerId}`);
    const entryRef = acctRef
      .collection("history")
      .doc(`referral_${attendeeId}`);
    const auditRef = acctRef.collection("pendingReferrals").doc(attendeeId);
    const refereeName =
      (referee.displayName as string | undefined) ?? "A new member";

    await db.runTransaction(async (tx) => {
      const entry = await tx.get(entryRef);
      if (entry.exists) return; // one credit per referee, ever
      tx.set(entryRef, {
        type: "referral",
        points: LOYALTY_POINTS.REFERRAL,
        description: `Referral — ${refereeName} joined`,
        refereeId: attendeeId,
        createdAt: FieldValue.serverTimestamp(),
      });
      tx.set(auditRef, {
        refereeId: attendeeId,
        refereeDisplayName: refereeName,
        status: "claimed",
        createdAt: FieldValue.serverTimestamp(),
        claimedAt: FieldValue.serverTimestamp(),
      });
      tx.set(
        acctRef,
        {
          userId: referrerId,
          pointsBalance: FieldValue.increment(LOYALTY_POINTS.REFERRAL),
          lifetimePoints: FieldValue.increment(LOYALTY_POINTS.REFERRAL),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });
    logger.info("referral credited", {referrerId, refereeId: attendeeId});
  },
);
