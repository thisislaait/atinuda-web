import * as admin from "firebase-admin";
import * as path from "path";

const serviceAccount = require(path.resolve(__dirname, "../service-account.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function backfill() {
  console.log("🔄 Starting enriched backfill…");

  try {
    const paymentsSnap = await db.collection("payments").get();
    let count = 0;

    for (const doc of paymentsSnap.docs) {
      const data = doc.data();
      if (!data.email) continue;

      const emailRaw = String(data.email);
      const emailLower = emailRaw.toLowerCase().trim();

      // Look for a matching user by emailLower first
      let userDoc = null;
      const byLower = await db
        .collection("users")
        .where("emailLower", "==", emailLower)
        .limit(1)
        .get();

      if (!byLower.empty) {
        userDoc = byLower.docs[0];
      } else {
        const byEmail = await db
          .collection("users")
          .where("email", "==", emailRaw)
          .limit(1)
          .get();
        if (!byEmail.empty) {
          userDoc = byEmail.docs[0];
        }
      }

      const userData = userDoc?.data() || {};
      const firstName =
        typeof userData.firstName === "string" ? userData.firstName : "";
      const lastName =
        typeof userData.lastName === "string" ? userData.lastName : "";
      const fullName =
        [firstName, lastName].filter(Boolean).join(" ") ||
        userData.fullName ||
        data.fullName ||
        "Attendee";

      const attendeeRef = db.collection("attendees_public").doc(userDoc?.id ?? doc.id);

      await attendeeRef.set(
        {
          fullName,
          company: userData.company || data.company || "",
          position: userData.position || userData.title || data.position || "",
          image: userData.avatarEmoji || userData.emoji || "👤",
          categories: Array.isArray(userData.categories)
            ? userData.categories.filter((c: any) => typeof c === "string")
            : Array.isArray(userData.interests)
            ? userData.interests.filter((c: any) => typeof c === "string")
            : [],
          email: emailLower,
          userId: userDoc?.id ?? null,
          createdAt: data.createdAt || new Date(),
        },
        { merge: true }
      );

      console.log(`✅ Added attendee: ${emailRaw}`);
      count++;
    }

    console.log(`🎉 Backfill complete! Wrote ${count} attendees_public docs`);
  } catch (err) {
    console.error("❌ Backfill failed", err);
  }
}

backfill();
