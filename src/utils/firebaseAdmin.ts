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
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
 
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminDb = getFirestore();

export { adminDb, FieldValue };

// import { initializeApp, cert, getApps } from 'firebase-admin/app';
// import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

// if (!getApps().length) {
//   initializeApp({
//     credential: cert(serviceAccount),
//   });
// }

// const adminDb = getFirestore();

// export { adminDb, FieldValue };


// import { initializeApp, cert, getApps } from 'firebase-admin/app';
// import { getFirestore, FieldValue } from 'firebase-admin/firestore';
// import { ServiceAccount } from 'firebase-admin';

// if (!getApps().length) {
//   const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
//   const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
//   const projectId = process.env.FIREBASE_PROJECT_ID;

//   if (!privateKey || !clientEmail || !projectId) {
//     throw new Error(
//       'Missing Firebase credentials. Ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set correctly.'
//     );
//   }

//   const serviceAccount: ServiceAccount = {
//     privateKey,
//     clientEmail,
//     projectId,
//   };

//   initializeApp({
//     credential: cert(serviceAccount),
//   });
// }

// const adminDb = getFirestore();
// export { adminDb, FieldValue };


