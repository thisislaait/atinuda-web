// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW8rpC8B_cUeXAKss7ltq-Z9gf7KHeF3k",
  authDomain: "atinuda-5.firebaseapp.com",
  projectId: "atinuda-5",
  storageBucket: "atinuda-5.appspot.com",
  messagingSenderId: "133184710374",
  appId: "1:133184710374:web:3a1e16e91492a791f53d27",
  measurementId: "G-LNNT3DKYJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
