import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Trigger 1: When a payment is created → add/update attendees_public
 */
export const syncPaymentToAttendee = onDocumentCreated(
  "payments/{paymentId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as Record<string, any>;
    if (!data?.email) return;

    const emailLower = String(data.email).toLowerCase().trim();

    // Try to find linked user
    const userQuery = await db
      .collection("users")
      .where("emailLower", "==", emailLower)
      .limit(1)
      .get();
    const userDoc = !userQuery.empty ? userQuery.docs[0] : null;

    const attendeeDoc = {
      userId: userDoc?.id ?? null,
      fullName:
        data.fullName ||
        `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
        (userDoc?.get("fullName") as string) ||
        "Attendee",
      company: data.company || (userDoc?.get("company") as string) || "",
      position:
        data.position ||
        data.title ||
        (userDoc?.get("position") as string) ||
        "",
      image:
        data.avatarEmoji ||
        data.emoji ||
        (userDoc?.get("emoji") as string) ||
        "👤",
      categories: Array.isArray(data.categories)
        ? data.categories
        : Array.isArray(data.interests)
        ? data.interests
        : (userDoc?.get("categories") as string[]) || [],
      emailLower,
      createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    };

    await db
      .collection("attendees_public")
      .doc(event.params.paymentId)
      .set(attendeeDoc, { merge: true });

    console.log(`✅ Synced attendee from payment: ${emailLower}`);
  }
);

/**
 * Trigger 2: When a user updates profile → update attendees_public
 */
export const syncUserToAttendee = onDocumentUpdated("users/{userId}", async (event) => {
  const after = event.data?.after?.data() as Record<string, any> | undefined;
  if (!after?.emailLower) return;

  const emailLower = String(after.emailLower).toLowerCase().trim();

  // Find all attendees with this emailLower
  const attendeeSnap = await db
    .collection("attendees_public")
    .where("emailLower", "==", emailLower)
    .get();

  if (attendeeSnap.empty) return;

  const updates = {
    userId: event.params.userId,
    fullName:
      after.fullName ||
      `${after.firstName || ""} ${after.lastName || ""}`.trim() ||
      "Attendee",
    company: after.company || "",
    position: after.position || after.title || "",
    image: after.avatarEmoji || after.emoji || "👤",
    categories: Array.isArray(after.categories)
      ? after.categories
      : Array.isArray(after.interests)
      ? after.interests
      : [],
  };

  const batch = db.batch();
  attendeeSnap.forEach((doc) => {
    batch.set(doc.ref, updates, { merge: true });
  });
  await batch.commit();

  console.log(`🔄 Synced user ${emailLower} → attendees_public`);
});


// functions/src/index.ts
// import * as admin from 'firebase-admin';
// import { onRequest } from 'firebase-functions/v2/https';
// import { SCHEDULE } from './schedule';

// try { admin.app(); } catch { admin.initializeApp(); }
// const db = admin.firestore();

// export const seedSessions = onRequest({ region: 'us-central1', cors: true }, async (_req, res) => {
//   try {
//     const batch = db.batch();
//     let upserts = 0;

//     for (const day of SCHEDULE) {
//       for (const s of day.sessions) {
//         const ref = db.collection('sessions').doc(s.id);
//         const snap = await ref.get();

//         const { registered, ...rest } = s; // ignore 'registered' from file
//         const base = {
//           ...rest,
//           speaker: s.speaker ?? null,
//           speakerId: s.speakerId ?? null,
//           capacity: s.capacity ?? null,
//         };

//         if (!snap.exists) {
//           batch.set(ref, { ...base, registeredCount: 0 }, { merge: true });
//         } else {
//           const existing = snap.data() || {};
//           batch.set(ref, { ...base, registeredCount: existing.registeredCount ?? 0 }, { merge: true });
//         }
//         upserts++;
//       }
//     }

//     await batch.commit();
//     res.status(200).json({ ok: true, upserts });
//   } catch (e: any) {
//     console.error(e);
//     res.status(500).json({ ok: false, error: e?.message || 'seed failed' });
//   }
// });
