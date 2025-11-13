"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai--short-video-gen-6a247.firebaseapp.com",
  projectId: "ai--short-video-gen-6a247",
  storageBucket: "ai--short-video-gen-6a247.firebasestorage.app",
  messagingSenderId: "139429922939",
  appId: "1:139429922939:web:f09c3e65159173ef3dbade",
  measurementId: "G-K13N1LLZYN"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export default app;
