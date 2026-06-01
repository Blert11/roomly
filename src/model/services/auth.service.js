// src/model/services/auth.service.js
// ─────────────────────────────────────────────
// MODEL LAYER — all Firebase Authentication calls.
// Pure data functions. No JSX. No React. No UI.
// ViewModel calls these; View never touches Firebase.
// ─────────────────────────────────────────────

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

// ── Email / Password ────────────────────────────────────────────────────────

export async function registerWithEmail(email, password, displayName = "") {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }
  return result.user;
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut() {
  await signOut(auth);
}

// ── Google Sign-In ──────────────────────────────────────────────────────────

export async function loginWithGoogle(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  const result     = await signInWithCredential(auth, credential);
  return result.user;
}

// ── Profile update ──────────────────────────────────────────────────────────

export async function updateUserProfile(fields) {
  await updateProfile(auth.currentUser, fields);
}

// ── Auth state observer ─────────────────────────────────────────────────────

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Current user ────────────────────────────────────────────────────────────

export function getCurrentUser() {
  return auth.currentUser;
}
