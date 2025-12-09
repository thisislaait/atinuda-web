// utils/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Firestore } from "firebase-admin/firestore";

/**
 * Lazily initialize Firebase Admin so builds don't explode when the service
 * account env var is missing locally. We only attempt to parse/use the creds
 * on first access, and throw a descriptive error then.
 */
let cachedDb: Firestore | null = null;

function parseServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 env var is not set");
  }

  const json = Buffer.from(b64, "base64").toString("utf8");
  try {
    return JSON.parse(json);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_B64 is not valid JSON: ${reason}`);
  }
}

function ensureDb(): Firestore {
  if (cachedDb) return cachedDb;

  const serviceAccount = parseServiceAccount();
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  cachedDb = getFirestore();
  return cachedDb;
}

// Proxy gives us a drop-in Firestore instance while still deferring init.
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const db = ensureDb();
    const value = Reflect.get(db as unknown as Record<string, unknown>, prop, receiver);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(db) : value;
  },
}) as Firestore;

export { ensureDb as getAdminDb, FieldValue };
