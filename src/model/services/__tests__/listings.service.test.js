// src/model/services/__tests__/listings.service.test.js
// Unit tests for the listings service.
// Firebase, Storage, and ImageManipulator are fully mocked.

jest.mock("../../firebase/firebase.config", () => ({
  db:      { __mock: "firestore" },
  storage: { __mock: "storage" },
}));

jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(() =>
    Promise.resolve({ uri: "compressed://image.webp" })
  ),
  SaveFormat: { WEBP: "webp", JPEG: "jpeg" },
}));

const mockAddDoc    = jest.fn();
const mockUpdateDoc = jest.fn(() => Promise.resolve());
const mockDeleteDoc = jest.fn(() => Promise.resolve());
const mockOnSnapshot = jest.fn();
const mockGetDownloadURL     = jest.fn(() => Promise.resolve("https://cdn.example.com/img.webp"));
const mockUploadBytesResumable = jest.fn();
const mockDeleteObject        = jest.fn(() => Promise.resolve());
const mockRef                 = jest.fn((storage, path) => ({ __path: path }));
const mockServerTimestamp     = jest.fn(() => "__SERVER_TS__");

jest.mock("firebase/firestore", () => ({
  collection:      jest.fn((db, name) => ({ __collection: name })),
  doc:             jest.fn((db, col, id) => ({ __col: col, __id: id })),
  query:           jest.fn((coll, ...c) => ({ __coll: coll, __constraints: c })),
  where:           jest.fn((f, op, v) => ({ __field: f, __op: op, __value: v })),
  addDoc:          (...a) => mockAddDoc(...a),
  updateDoc:       (...a) => mockUpdateDoc(...a),
  deleteDoc:       (...a) => mockDeleteDoc(...a),
  onSnapshot:      (...a) => mockOnSnapshot(...a),
  serverTimestamp: () => mockServerTimestamp(),
}));

jest.mock("firebase/storage", () => ({
  ref:                   (...a) => mockRef(...a),
  uploadBytesResumable:  (...a) => mockUploadBytesResumable(...a),
  getDownloadURL:        (...a) => mockGetDownloadURL(...a),
  deleteObject:          (...a) => mockDeleteObject(...a),
}));

// fetch is used inside uploadImage to turn a URI into a Blob.
global.fetch = jest.fn(() =>
  Promise.resolve({ blob: () => Promise.resolve(new Blob(["data"])) })
);

// uploadBytesResumable returns an upload task; we simulate immediate success.
mockUploadBytesResumable.mockImplementation(() => ({
  on: jest.fn((_event, _progress, _error, complete) => complete()),
}));

const {
  subscribeToListings,
  subscribeToUserListings,
  createListing,
  updateListing,
  updateListingWithImages,
  deleteListing,
} = require("../listings.service");

beforeEach(() => {
  mockAddDoc.mockClear();
  mockUpdateDoc.mockClear();
  mockDeleteDoc.mockClear();
  mockOnSnapshot.mockClear();
  mockDeleteObject.mockClear();
  mockGetDownloadURL.mockClear();
  global.fetch.mockClear();
});

// ── subscribeToListings ────────────────────────────────────────────────────

describe("subscribeToListings", () => {
  it("sorts listings newest-first by createdAt", () => {
    const onData = jest.fn();
    mockOnSnapshot.mockImplementationOnce((q, success) => {
      success({
        docs: [
          { id: "a", data: () => ({ title: "Oldest",  createdAt: { toMillis: () => 100 } }) },
          { id: "b", data: () => ({ title: "Newest",  createdAt: { toMillis: () => 300 } }) },
          { id: "c", data: () => ({ title: "Middle",  createdAt: { toMillis: () => 200 } }) },
        ],
      });
      return jest.fn();
    });

    subscribeToListings(onData, jest.fn());

    const sorted = onData.mock.calls[0][0];
    expect(sorted.map((l) => l.title)).toEqual(["Newest", "Middle", "Oldest"]);
  });

  it("returns the Firestore unsubscribe function", () => {
    const unsubscribeSpy = jest.fn();
    mockOnSnapshot.mockImplementationOnce(() => unsubscribeSpy);
    const off = subscribeToListings(jest.fn(), jest.fn());
    expect(off).toBe(unsubscribeSpy);
  });

  it("includes the document id in each listing object", () => {
    const onData = jest.fn();
    mockOnSnapshot.mockImplementationOnce((q, success) => {
      success({
        docs: [{ id: "listing-42", data: () => ({ title: "Studio", createdAt: { toMillis: () => 0 } }) }],
      });
      return jest.fn();
    });

    subscribeToListings(onData, jest.fn());

    expect(onData.mock.calls[0][0][0].id).toBe("listing-42");
  });
});

// ── subscribeToUserListings ───────────────────────────────────────────────

describe("subscribeToUserListings", () => {
  it("passes the ownerId filter and sorts results newest-first", () => {
    const onData = jest.fn();
    mockOnSnapshot.mockImplementationOnce((q, success) => {
      success({
        docs: [
          { id: "x", data: () => ({ ownerId: "u1", createdAt: { toMillis: () => 50  } }) },
          { id: "y", data: () => ({ ownerId: "u1", createdAt: { toMillis: () => 150 } }) },
        ],
      });
      return jest.fn();
    });

    subscribeToUserListings("u1", onData, jest.fn());

    const results = onData.mock.calls[0][0];
    expect(results[0].id).toBe("y"); // newer first
    expect(results[1].id).toBe("x");
  });
});

// ── createListing ─────────────────────────────────────────────────────────

describe("createListing", () => {
  const baseFields = {
    title:        "Cozy studio",
    description:  "Nice place",
    price:        "350",
    address:      "Str. Dëshmorët",
    city:         "Prishtinë",
    category:     "studio",
    ownerId:      "owner-1",
    ownerName:    "Alice",
    ownerPhotoURL: null,
    ownerPhone:   "+383 44 000 000",
    latitude:     42.66,
    longitude:    21.17,
  };

  beforeEach(() => {
    mockAddDoc.mockResolvedValue({ id: "new-listing-id" });
  });

  it("uploads each image and stores the resulting URLs in imageURLs", async () => {
    mockGetDownloadURL
      .mockResolvedValueOnce("https://cdn.example.com/1.webp")
      .mockResolvedValueOnce("https://cdn.example.com/2.webp");

    await createListing(baseFields, ["file://a.jpg", "file://b.jpg"]);

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.imageURLs).toEqual([
      "https://cdn.example.com/1.webp",
      "https://cdn.example.com/2.webp",
    ]);
  });

  it("creates the doc with an empty imageURLs array when no images are passed", async () => {
    await createListing(baseFields, []);

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.imageURLs).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("coerces price to a Number", async () => {
    await createListing({ ...baseFields, price: "450" }, []);

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(typeof payload.price).toBe("number");
    expect(payload.price).toBe(450);
  });

  it("sets available:true and serverTimestamp on createdAt/updatedAt", async () => {
    await createListing(baseFields, []);

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.available).toBe(true);
    expect(payload.createdAt).toBe("__SERVER_TS__");
    expect(payload.updatedAt).toBe("__SERVER_TS__");
  });

  it("writes back the listingId via updateDoc after addDoc", async () => {
    await createListing(baseFields, []);

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [, patch] = mockUpdateDoc.mock.calls[0];
    expect(patch.listingId).toBe("new-listing-id");
  });

  it("returns the new document id", async () => {
    const id = await createListing(baseFields, []);
    expect(id).toBe("new-listing-id");
  });

  it("defaults category to 'other' when not provided", async () => {
    const { category: _removed, ...noCategory } = baseFields;
    await createListing(noCategory, []);

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.category).toBe("other");
  });
});

// ── updateListing ─────────────────────────────────────────────────────────

describe("updateListing", () => {
  it("merges the provided fields and stamps updatedAt", async () => {
    await updateListing("listing-1", { title: "New title", price: 500 });

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [docRef, payload] = mockUpdateDoc.mock.calls[0];
    expect(docRef.__id).toBe("listing-1");
    expect(payload.title).toBe("New title");
    expect(payload.updatedAt).toBe("__SERVER_TS__");
  });
});

// ── updateListingWithImages ───────────────────────────────────────────────

describe("updateListingWithImages", () => {
  it("deletes removed images from Storage (best-effort)", async () => {
    await updateListingWithImages(
      "listing-1",
      { ownerId: "u1", price: 300 },
      { keptURLs: [], newURIs: [], removedURLs: ["https://cdn.example.com/old.webp"] }
    );

    expect(mockDeleteObject).toHaveBeenCalledTimes(1);
  });

  it("uploads new images and concatenates them after keptURLs", async () => {
    mockGetDownloadURL.mockResolvedValueOnce("https://cdn.example.com/new.webp");

    const imageURLs = await updateListingWithImages(
      "listing-1",
      { ownerId: "u1", price: 300 },
      {
        keptURLs:    ["https://cdn.example.com/kept.webp"],
        newURIs:     ["file://new.jpg"],
        removedURLs: [],
      }
    );

    expect(imageURLs).toEqual([
      "https://cdn.example.com/kept.webp",
      "https://cdn.example.com/new.webp",
    ]);
    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.imageURLs).toEqual(imageURLs);
  });

  it("coerces price to Number", async () => {
    await updateListingWithImages(
      "listing-1",
      { ownerId: "u1", price: "999" },
      {}
    );

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.price).toBe(999);
  });
});

// ── deleteListing ─────────────────────────────────────────────────────────

describe("deleteListing", () => {
  it("deletes all provided images from Storage then removes the Firestore doc", async () => {
    await deleteListing("listing-1", [
      "https://cdn.example.com/a.webp",
      "https://cdn.example.com/b.webp",
    ]);

    expect(mockDeleteObject).toHaveBeenCalledTimes(2);
    expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    const [docRef] = mockDeleteDoc.mock.calls[0];
    expect(docRef.__id).toBe("listing-1");
  });

  it("still deletes the Firestore doc even when no images are provided", async () => {
    await deleteListing("listing-2");

    expect(mockDeleteObject).not.toHaveBeenCalled();
    expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
  });

  it("does not throw if a Storage deletion fails (best-effort)", async () => {
    mockDeleteObject.mockRejectedValueOnce(new Error("already deleted"));

    await expect(
      deleteListing("listing-3", ["https://cdn.example.com/gone.webp"])
    ).resolves.toBeUndefined();

    expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
  });
});
