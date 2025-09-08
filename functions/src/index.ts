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
