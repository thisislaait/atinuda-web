// Server-only. Stores the receipts bank transfer buyers attach. Buyers upload with their order's
// token, and only signed-in staff can read them, through this server.
//
// The storage rules let anyone read and list this bucket (a catch-all rule the public galleries
// use), so every file is encrypted here first and named at random. The key is derived from the
// service account secret: replacing that account makes stored receipts unreadable.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'crypto';
import { getStorage } from 'firebase-admin/storage';
import { getAdminDb } from '@/utils/firebaseAdmin';

const BUCKET = 'atinuda-5.firebasestorage.app';
export const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;

const TYPES: { type: string; ext: string; matches: (b: Buffer) => boolean }[] = [
  { type: 'image/jpeg', ext: 'jpg', matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: 'image/png', ext: 'png', matches: (b) => b.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' },
  { type: 'image/webp', ext: 'webp', matches: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  { type: 'application/pdf', ext: 'pdf', matches: (b) => b.subarray(0, 5).toString() === '%PDF-' },
];

// Goes by the file's contents, never the name or type the browser claims.
export const detectReceiptType = (bytes: Buffer) => TYPES.find((t) => t.matches(bytes)) ?? null;

const IV_BYTES = 12;
const TAG_BYTES = 16;

function encryptionKey() {
  const secret = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!secret) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 env var is not set');
  return Buffer.from(hkdfSync('sha256', secret, 'atinuda', 'transfer-receipts', 32));
}

function encrypt(bytes: Buffer) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const body = Buffer.concat([cipher.update(bytes), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]);
}

function decrypt(stored: Buffer) {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), stored.subarray(0, IV_BYTES));
  decipher.setAuthTag(stored.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
  return Buffer.concat([decipher.update(stored.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]);
}

function bucket() {
  getAdminDb();
  return getStorage().bucket(BUCKET);
}

export async function saveReceipt(bytes: Buffer) {
  // The name says nothing about the buyer or order, because the bucket can be listed.
  const path = `transfer-receipts/${randomBytes(16).toString('hex')}.bin`;
  await bucket().file(path).save(encrypt(bytes), {
    resumable: false,
    contentType: 'application/octet-stream',
    metadata: { cacheControl: 'private, no-store' },
  });
  return path;
}

export async function readReceipt(path: string) {
  const [stored] = await bucket().file(path).download();
  return decrypt(stored);
}

export const deleteReceipt = (path: string) => bucket().file(path).delete({ ignoreNotFound: true });
