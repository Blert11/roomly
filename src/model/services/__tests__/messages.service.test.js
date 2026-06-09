// src/model/services/__tests__/messages.service.test.js
// Unit tests for the messages service.
// Firebase and notifications are fully mocked — no network calls.

jest.mock("../../firebase/firebase.config", () => ({
  db: { __mock: "firestore" },
}));

jest.mock("../notifications.service", () => ({
  sendPushNotification: jest.fn(() => Promise.resolve()),
}));

const mockAddDoc      = jest.fn(() => Promise.resolve({ id: "msg-new" }));
const mockUpdateDoc   = jest.fn(() => Promise.resolve());
const mockSetDoc      = jest.fn(() => Promise.resolve());
const mockGetDoc      = jest.fn();
const mockOnSnapshot  = jest.fn();
const mockServerTimestamp = jest.fn(() => "__SERVER_TS__");
const mockIncrement   = jest.fn((n) => ({ __increment: n }));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn((db, ...parts) => ({ __collection: parts.join("/") })),
  doc:        jest.fn((db, ...parts) => ({ __path: parts.join("/") })),
  query:      jest.fn((coll, ...constraints) => ({ __coll: coll, __constraints: constraints })),
  where:      jest.fn((field, op, value) => ({ __field: field, __op: op, __value: value })),
  orderBy:    jest.fn((field, dir) => ({ __orderBy: field, __dir: dir })),
  limit:      jest.fn((n) => ({ __limit: n })),
  addDoc:     (...args) => mockAddDoc(...args),
  updateDoc:  (...args) => mockUpdateDoc(...args),
  setDoc:     (...args) => mockSetDoc(...args),
  getDoc:     (...args) => mockGetDoc(...args),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  serverTimestamp: () => mockServerTimestamp(),
  increment:  (n) => mockIncrement(n),
}));

const {
  openOrCreateConversation,
  sendMessage,
  subscribeToConversations,
  subscribeToMessages,
  markConversationRead,
} = require("../messages.service");

beforeEach(() => {
  mockAddDoc.mockClear();
  mockUpdateDoc.mockClear();
  mockSetDoc.mockClear();
  mockGetDoc.mockClear();
  mockOnSnapshot.mockClear();
  jest.requireMock("../notifications.service").sendPushNotification.mockClear();
});

// ── openOrCreateConversation ──────────────────────────────────────────────

describe("openOrCreateConversation", () => {
  const alice = { uid: "alice", displayName: "Alice", photoURL: null };
  const bob   = { uid: "bob",   displayName: "Bob",   photoURL: null };

  it("throws when either user is missing", async () => {
    await expect(openOrCreateConversation(null, bob)).rejects.toThrow();
    await expect(openOrCreateConversation(alice, null)).rejects.toThrow();
  });

  it("throws when a user tries to message themselves", async () => {
    await expect(openOrCreateConversation(alice, alice)).rejects.toThrow(
      "You can't message yourself."
    );
  });

  it("creates a new conversation doc when none exists", async () => {
    const fakeDoc = {
      id: "alice__bob",
      data: () => ({
        participantIds: ["alice", "bob"],
        participantInfo: {},
        lastMessage: "",
        unread: { alice: 0, bob: 0 },
      }),
    };
    // First getDoc → conversation doesn't exist; second → fresh read after setDoc
    mockGetDoc
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({ ...fakeDoc, exists: () => true });

    const result = await openOrCreateConversation(alice, bob);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mockSetDoc.mock.calls[0];
    expect(payload.participantIds).toEqual(["alice", "bob"]);
    expect(payload.unread).toEqual({ alice: 0, bob: 0 });
    expect(result.id).toBe("alice__bob");
  });

  it("skips creation and only merges participantInfo when conversation already exists", async () => {
    const fakeDoc = {
      exists: () => true,
      data: () => ({ participantIds: ["alice", "bob"], participantInfo: {} }),
    };
    mockGetDoc
      .mockResolvedValueOnce(fakeDoc)
      .mockResolvedValueOnce(fakeDoc);

    await openOrCreateConversation(alice, bob);

    // setDoc is called once — with merge:true — to refresh participant info
    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    const [, , options] = mockSetDoc.mock.calls[0];
    expect(options).toEqual({ merge: true });
  });

  it("builds the conversation id by sorting uids and joining with __", async () => {
    const fakeDoc = {
      exists: () => true,
      data: () => ({}),
    };
    mockGetDoc.mockResolvedValue(fakeDoc);

    const { id } = await openOrCreateConversation(
      { uid: "zzz", displayName: "Z" },
      { uid: "aaa", displayName: "A" }
    );
    expect(id).toBe("aaa__zzz");
  });
});

// ── sendMessage ───────────────────────────────────────────────────────────

describe("sendMessage", () => {
  it("does nothing when the text is empty or whitespace", async () => {
    await sendMessage({ conversationId: "c1", senderId: "u1", receiverId: "u2", text: "   " });
    expect(mockAddDoc).not.toHaveBeenCalled();
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it("adds the message doc and updates the conversation", async () => {
    // getDoc calls inside the fire-and-forget push block — make them resolve quickly
    mockGetDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });

    await sendMessage({ conversationId: "c1", senderId: "u1", receiverId: "u2", text: "  Hello  " });

    // Message was stored
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    const [, msgPayload] = mockAddDoc.mock.calls[0];
    expect(msgPayload.senderId).toBe("u1");
    expect(msgPayload.text).toBe("Hello"); // trimmed

    // Conversation metadata was updated
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [, convPayload] = mockUpdateDoc.mock.calls[0];
    expect(convPayload.lastMessage).toBe("Hello");
    expect(convPayload.lastSenderId).toBe("u1");
    expect(convPayload["unread.u2"]).toEqual({ __increment: 1 });
  });

  it("does not throw when push notification lookup fails", async () => {
    mockGetDoc.mockRejectedValue(new Error("network failure"));

    await expect(
      sendMessage({ conversationId: "c1", senderId: "u1", receiverId: "u2", text: "Hi" })
    ).resolves.toBeUndefined();
  });
});

// ── subscribeToConversations ──────────────────────────────────────────────

describe("subscribeToConversations", () => {
  it("returns a no-op unsubscribe function when uid is falsy", () => {
    const unsub = subscribeToConversations(null, jest.fn(), jest.fn());
    expect(typeof unsub).toBe("function");
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("sorts conversations newest-first by lastMessageAt", () => {
    const onData = jest.fn();
    mockOnSnapshot.mockImplementationOnce((q, success) => {
      success({
        docs: [
          { id: "a", data: () => ({ lastMessageAt: { toMillis: () => 100 }, lastMessage: "old" }) },
          { id: "b", data: () => ({ lastMessageAt: { toMillis: () => 300 }, lastMessage: "newest" }) },
          { id: "c", data: () => ({ lastMessageAt: { toMillis: () => 200 }, lastMessage: "middle" }) },
        ],
      });
      return jest.fn();
    });

    subscribeToConversations("u1", onData, jest.fn());

    const sorted = onData.mock.calls[0][0];
    expect(sorted.map((c) => c.lastMessage)).toEqual(["newest", "middle", "old"]);
  });

  it("returns the Firestore unsubscribe function", () => {
    const unsubscribeSpy = jest.fn();
    mockOnSnapshot.mockImplementationOnce(() => unsubscribeSpy);
    const off = subscribeToConversations("u1", jest.fn(), jest.fn());
    expect(off).toBe(unsubscribeSpy);
  });
});

// ── subscribeToMessages ───────────────────────────────────────────────────

describe("subscribeToMessages", () => {
  it("returns a no-op when conversationId is falsy", () => {
    const unsub = subscribeToMessages(null, jest.fn(), jest.fn());
    expect(typeof unsub).toBe("function");
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("maps snapshot docs to objects and passes them to onData", () => {
    const onData = jest.fn();
    mockOnSnapshot.mockImplementationOnce((q, success) => {
      success({
        docs: [
          { id: "m1", data: () => ({ senderId: "alice", text: "Hey" }) },
          { id: "m2", data: () => ({ senderId: "bob",   text: "Hi"  }) },
        ],
      });
      return jest.fn();
    });

    subscribeToMessages("conv-1", onData, jest.fn());

    expect(onData).toHaveBeenCalledTimes(1);
    const msgs = onData.mock.calls[0][0];
    expect(msgs).toHaveLength(2);
    expect(msgs[0]).toMatchObject({ id: "m1", senderId: "alice", text: "Hey" });
  });
});

// ── markConversationRead ──────────────────────────────────────────────────

describe("markConversationRead", () => {
  it("does nothing when conversationId or uid is missing", async () => {
    await markConversationRead(null, "u1");
    await markConversationRead("c1", null);
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it("resets the unread counter for the given uid to 0", async () => {
    await markConversationRead("conv-1", "alice");
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload["unread.alice"]).toBe(0);
  });
});
