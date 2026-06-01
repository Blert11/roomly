// src/model/services/listings.service.js
// ─────────────────────────────────────────────
// MODEL LAYER — all Firestore + Firebase Storage operations for listings.
// Pure data functions. No JSX. No React. No UI.
// ViewModel calls these; View never touches Firebase.
// ─────────────────────────────────────────────

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/firebase.config";

// ── PRIVATE HELPER — upload one image, return download URL ────────────────

async function uploadImage(uri, storagePath) {
  const response = await fetch(uri);
  const blob     = await response.blob();
  const fileRef  = ref(storage, storagePath);

  await new Promise((resolve, reject) => {
    uploadBytesResumable(fileRef, blob).on("state_changed", null, reject, resolve);
  });

  return getDownloadURL(fileRef);
}

function sortNewestFirst(listings) {
  return [...listings].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}

// ── READ — all available listings, newest first (real-time) ───────────────

export function subscribeToListings(onData, onError) {
  const q = query(
    collection(db, "listings"),
    where("available", "==", true)
  );

  return onSnapshot(
    q,
    (snap) => onData(sortNewestFirst(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
    onError
  );
}

// ── READ — listings owned by one user (real-time) ─────────────────────────

export function subscribeToUserListings(ownerId, onData, onError) {
  const q = query(
    collection(db, "listings"),
    where("ownerId", "==", ownerId)
  );

  return onSnapshot(
    q,
    (snap) => onData(sortNewestFirst(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
    onError
  );
}

// ── CREATE ─────────────────────────────────────────────────────────────────
// imageUris is now an array of local URIs (up to 5).
// All images are uploaded in parallel before the Firestore document is written.

export async function createListing(fields, imageUris = []) {
  const {
    title,
    description,
    price,
    address,
    city,
    category,
    ownerId,
    ownerName,
    ownerPhotoURL,
    latitude,
    longitude,
  } = fields;

  // Upload all images in parallel
  const imageURLs = await Promise.all(
    imageUris.map((uri, index) => {
      const path = `listings/${ownerId}/${Date.now()}_${index}.jpg`;
      return uploadImage(uri, path);
    })
  );

  const docRef = await addDoc(collection(db, "listings"), {
    title,
    description,
    price:     Number(price),
    address,
    city:      city || "",
    category:  category || "other",
    ownerName: ownerName || "",
    ownerPhotoURL: ownerPhotoURL || null,
    latitude,
    longitude,
    imageURLs,           // array — may be empty, 1, or up to 5 URLs
    ownerId,
    available: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(docRef, { listingId: docRef.id });
  return docRef.id;
}

// ── UPDATE ─────────────────────────────────────────────────────────────────

export async function updateListing(listingId, fields) {
  await updateDoc(doc(db, "listings", listingId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

// ── DELETE ─────────────────────────────────────────────────────────────────

export async function deleteListing(listingId, imageURLs = []) {
  await Promise.allSettled(
    imageURLs.map(async (url) => {
      try { await deleteObject(ref(storage, url)); } catch { /* already gone */ }
    })
  );
  await deleteDoc(doc(db, "listings", listingId));
}

// ── UPLOAD — profile avatar ────────────────────────────────────────────────

export async function uploadAvatar(userId, uri) {
  return uploadImage(uri, `avatars/${userId}.jpg`);
}
