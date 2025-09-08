// utils/firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';

// Decode the base64 private key first
const privateKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY_B64 || '',
  'base64'
).toString('utf8');

// Define the service account object
const serviceAccountJson = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_B64 || "",
  "base64"
).toString("utf8");

const serviceAccount = JSON.parse(serviceAccountJson);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminDb = getFirestore();

export { adminDb, FieldValue };