# Roomly

A cross-platform mobile application for browsing and booking rooms and apartments, built with React Native (Expo) and Firebase.

---

## Features

| Module | Description |
|---|---|
| **Authentication** | Email/password sign-up & login, Google OAuth, email verification, forgot password |
| **Listings / Booking** | Browse, search, filter, and post room listings with up to 10 photos and Google Maps location |
| **Messaging** | Real-time 1-on-1 chat between users with unread counters |
| **Favorites** | Save and manage favourite listings, synced in real time |
| **Push Notifications** | Device-level push notifications via Expo when a new message arrives |

---

## Tech Stack

- **Framework**: React Native + Expo (~54)
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Navigation**: React Navigation v7 (Bottom Tabs + Native Stack)
- **External APIs**: Google Maps (Places Autocomplete, Geocoding), Google OAuth
- **Testing**: Jest + jest-expo + React Testing Library

---

## Architecture — MVVM

```
src/
├── context/          # Global state (AuthContext)
├── model/
│   ├── config/       # Firebase, Maps, Google OAuth configuration
│   ├── firebase/     # Firebase app initialisation
│   └── services/     # Business logic — Firestore & Storage calls
│       └── __tests__ # Unit tests for service layer
├── viewmodel/        # Custom React hooks — state + effects, no JSX
├── view/
│   ├── components/   # Reusable UI pieces (ImageSlider, ListingCard, …)
│   └── screens/      # Screen components — presentation only
└── navigation/       # Stack and tab navigator definitions
```

**Model** — pure service functions that talk to Firebase. No UI references.  
**ViewModel** — custom hooks (`useAuthViewModel`, `useChatViewModel`, …) that own state and orchestrate service calls.  
**View** — screen components that import a ViewModel hook and render its data.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- A Firebase project with Firestore, Authentication, and Storage enabled

### Install

```bash
npm install
```

### Run

```bash
# Start Expo dev server
npm start

# Android
npm run android

# iOS
npm run ios
```

### Run Tests

```bash
npm test
```

---

## Environment / Configuration

API keys live in source files under `src/model/config/`. For production, move these to environment variables or Expo's `extra` config in `app.json`.

| File | Contents |
|---|---|
| `src/model/firebase/firebase.config.js` | Firebase project credentials |
| `src/model/config/maps.config.js` | Google Maps API key |
| `src/model/config/google-auth.config.js` | Google OAuth client IDs (Web, iOS, Android) |

---

## Testing

Unit tests cover the service layer (Model):

| Test file | What it covers |
|---|---|
| `auth.service.test.js` | Registration, email verification, forgot password |
| `favorites.service.test.js` | Add/remove favorites, real-time subscription, sort order |
| `messages.service.test.js` | Open/create conversation, send message, subscriptions, mark read |
| `listings.service.test.js` | Create listing (image upload, field coercion), update, delete, subscriptions |

All tests mock Firebase and native modules — no network required.

---

## Project Requirements Coverage

| Requirement | Status |
|---|---|
| User Authentication (email, Google, verification, forgot password) | Done |
| Core Feature Set — 3+ modules (Listings, Messaging, Favorites) | Done |
| API Integration (Firebase REST, Google Maps, Google OAuth, Expo Push) | Done |
| Responsive UI/UX (mobile-first, bottom tab navigation) | Done |
| Push / Local Notifications | Done |
| Clean Architecture (MVVM) | Done |
| Unit Testing (4 test files, service layer) | Done |
