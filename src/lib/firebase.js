// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBARd5UU7imlpmF87SBxTas6iSCM6YyQBA",
  authDomain: "spotify-clone-ca4d2.firebaseapp.com",
  projectId: "spotify-clone-ca4d2",
  storageBucket: "spotify-clone-ca4d2.appspot.com",
  messagingSenderId: "1090474330127",
  appId: "1:1090474330127:web:21543fb6ce2ff277953b7a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
