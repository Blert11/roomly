
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

// ── Email / Password ────────────────────────────────────────────────────────

export async function registerWithEmail(email, password, displayName = "") {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }
  try { await sendEmailVerification(result.user); } catch (_) { /* swallow */ }
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

export async function updateUserEmail(newEmail) {
  await updateEmail(auth.currentUser, newEmail);
}

// ── Auth state observer ─────────────────────────────────────────────────────

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Password reset ──────────────────────────────────────────────────────────

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Email verification ──────────────────────────────────────────────────────
// Sends a verification email to the currently signed-in user.

export async function resendVerificationEmail() {
  if (!auth.currentUser) throw new Error("Not signed in.");
  if (auth.currentUser.emailVerified) {
    throw new Error("Your email is already verified.");
  }
  await sendEmailVerification(auth.currentUser);
}

export async function reloadCurrentUser() {
  if (!auth.currentUser) throw new Error("Not signed in.");
  await auth.currentUser.reload();
  return auth.currentUser;
}

// ── Current user ────────────────────────────────────────────────────────────

export function getCurrentUser() {
  return auth.currentUser;
}
