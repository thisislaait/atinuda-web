// // lib/firebaseAdmin.ts or js
// import admin from 'firebase-admin';
// import serviceAccount from '../serviceAccountKey.json'; // make sure the path is correct

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//   });
// }

// export const db = admin.firestore();


import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: "atinuda-5",
  // private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // clientId: process.env.FIREBASE_CLIENT_ID,
  // authUri: "https://accounts.google.com/o/oauth2/auth",
  // tokenUri: "https://oauth2.googleapis.com/token",
  // auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
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


