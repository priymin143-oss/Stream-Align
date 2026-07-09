import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  projectId: "empirical-virtue-h4dh4",
  appId: "1:477290790423:web:083e2b2f51306b51daa652",
  apiKey: "AIzaSyAK-76X2Tzt0qMJ_AsJJELwagLb5TP8iQQ",
  authDomain: "empirical-virtue-h4dh4.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-careerpathaicoun-ffd3fb54-45b7-4a7c-bfde-af1c7a6de606",
  storageBucket: "empirical-virtue-h4dh4.firebasestorage.app",
  messagingSenderId: "477290790423"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Standard OAuth custom scopes if needed, e.g. profile, email
googleProvider.addScope("profile");
googleProvider.addScope("email");

export { app, auth, googleProvider, signInWithPopup, signOut };
