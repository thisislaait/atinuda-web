// Gives an existing or new Firebase account access to the staff pages.
//   node --env-file=.env.local scripts/grant-staff-access.mjs person@atinuda.africa
// A new account has no password: the person uses "Set or reset password" on /staff/payments.
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const emails = process.argv.slice(2);
if (emails.length === 0) {
  console.error('Give at least one email address.');
  process.exit(1);
}

const account = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8'));
initializeApp({ credential: cert(account) });
const auth = getAuth();

for (const email of emails) {
  const user = await auth.getUserByEmail(email).catch((err) => {
    if (err.code === 'auth/user-not-found') return auth.createUser({ email });
    throw err;
  });
  // Claims replace each other, so keep whatever the account already holds.
  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
  console.log(`${email}: staff access granted`);
}
