import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { SCHEDULE, Session } from '../../functions/src/schedule';

// 🔑 Use the same Firebase config as in your app
const firebaseConfig = {
  apiKey: "AIzaSyCW8rpC8B_cUeXAKss7ltq-Z9gf7KHeF3k",
  authDomain: "atinuda-5.firebaseapp.com",
  projectId: "atinuda-5",
  storageBucket: "atinuda-5.appspot.com",
  messagingSenderId: "133184710374",
  appId: "1:133184710374:web:3a1e16e91492a791f53d27",
  measurementId: "G-LNNT3DKYJE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedSessions() {
  for (const day of SCHEDULE) {
    for (const s of day.sessions) {
      const ref = doc(db, 'sessions', s.id);

      // 🚫 don’t store `registered` from schedule.ts
      const { registered, ...rest } = s as Session;

      await setDoc(
        ref,
        {
          ...rest,
          registeredCount: 0, // start clean, Firestore will track live
        },
        { merge: true }
      );

      console.log(`✅ Seeded: ${s.title} (${s.id})`);
    }
  }
  console.log('🎉 All sessions seeded successfully.');
}

seedSessions().catch((err) => {
  console.error('❌ Error seeding sessions:', err);
});
