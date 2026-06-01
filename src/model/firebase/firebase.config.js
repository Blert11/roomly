// src/model/firebase/firebase.config.js
// ─────────────────────────────────────────────
// MODEL LAYER — Firebase initialisation only.
// Exports auth, db, storage.
// Only model/services files may import from here.
// ViewModels and Views must NEVER import this directly.
// ─────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQKMWWlszlpwsoiSvS2pTVskFh1uFh7QI",
  authDomain: "roomly-8f0a8.firebaseapp.com",
  projectId: "roomly-8f0a8",
  storageBucket: "roomly-8f0a8.firebasestorage.app",
  messagingSenderId: "1090430376819",
  appId: "1:1090430376819:web:b8b14bb1b70d4be4af4306",
  measurementId: "G-604BMD2RXD"
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
