import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";

if (
  !process.env.FIRESTORE_EMULATOR_HOST ||
  !process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  !process.env.FIREBASE_STORAGE_EMULATOR_HOST
)
  throw new Error(
    "Run through npm run test:emulators. Cloud tests are forbidden.",
  );
process.env.USE_FIREBASE_EMULATORS = "true";
process.env.GEMINI_API_KEY = "test-key-no-real-provider";
const { createApp } = await import("../../src/server/app.ts");
const { adminAuth, firestore } = await import("../../src/server/firebase.ts");
const { config } = await import("../../src/server/config.ts");
const { INITIAL_SERMON } = await import("../fixtures/theology.ts");
const { takeAiSlot } = await import("../../src/server/services.ts");
let server: any;
let base = "";
let env: Awaited<ReturnType<typeof initializeTestEnvironment>>;
let a = "";
let b = "";
let admin = "";
let productId = "";
const fetchReal = globalThis.fetch;
let aiOutput = "Uma resposta teológica de teste.";
let providerCalls = 0;
globalThis.fetch = async (input: any, init?: any) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (url.includes("generativelanguage.googleapis.com")) {
    providerCalls++;
    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: { parts: [{ text: aiOutput }], role: "model" },
            finishReason: "STOP",
          },
        ],
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(url))
    throw new Error("External request blocked in tests: " + url);
  return fetchReal(input, init);
};
async function token(uid: string, isAdmin = false) {
  await adminAuth.createUser({
    uid,
    email: uid + "@example.test",
    displayName: uid,
    emailVerified: true,
  });
  if (isAdmin) await adminAuth.setCustomUserClaims(uid, { admin: true });
  const customToken = await adminAuth.createCustomToken(uid);
  const response = await fetch(
    "http://" +
      process.env.FIREBASE_AUTH_EMULATOR_HOST +
      "/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=demo-key",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    },
  );
  const data: any = await response.json();
  assert.ok(data.idToken, JSON.stringify(data));
  return data.idToken;
}
async function call(
  path: string,
  auth: string,
  method = "GET",
  body?: unknown,
) {
  return fetch(base + "/api" + path, {
    method,
    headers: {
      ...(auth ? { Authorization: "Bearer " + auth } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
before(async () => {
  assert.equal(config.projectId, "demo-iatheos");
  await firestore.recursiveDelete(firestore.collection("users"));
  const oldUsers = await adminAuth.listUsers();
  if (oldUsers.users.length)
    await adminAuth.deleteUsers(oldUsers.users.map((u) => u.uid));
  [a, b, admin] = await Promise.all([
    token("alice"),
    token("bob"),
    token("administrator", true),
  ]);
  server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  base = "http://127.0.0.1:" + server.address().port;
  env = await initializeTestEnvironment({
    projectId: "demo-iatheos",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: await readFile("storage.rules", "utf8"),
    },
  });
});
after(async () => {
  globalThis.fetch = fetchReal;
  await env?.cleanup();
  if (server)
    await new Promise<void>((resolve) => server.close(() => resolve()));
  await firestore.terminate();
});
test("API permissions, subscriptions, persistence, PDF and AI flows", async (t) => {
  await t.test(
    "visitors denied, buyers cannot administer, retired webhook never grants",
    async () => {
      assert.equal((await call("/studies", "")).status, 401);
      assert.equal((await call("/admin/users", "invalid-token")).status, 401);
      assert.equal((await call("/admin/users", a)).status, 403);
      assert.equal(
        (
          await call("/admin/subscriptions/alice", a, "POST", {
            action: "grant",
            reason: "Teste",
          })
        ).status,
        403,
      );
      assert.equal((await call("/products", a, "POST", {})).status, 403);
      assert.equal(
        (
          await call("/webhooks/payment", "", "POST", {
            email: "alice@example.test",
          })
        ).status,
        410,
      );
      assert.equal(
        (await firestore.doc("subscriptions/alice").get()).exists,
        false,
      );
      for (const auth of [a, b, admin])
        assert.equal((await call("/users/sync", auth, "POST")).status, 200);
      assert.equal(
        (await call("/profile", a, "PATCH", { displayName: "Nome editado" }))
          .status,
        200,
      );
      const synced = await (await call("/users/sync", a, "POST")).json();
      assert.equal(synced.displayName, "Nome editado");
      assert.equal(
        (
          await call("/profile", a, "PATCH", {
            displayName: "Alice",
            role: "admin",
          })
        ).status,
        400,
      );
    },
  );
  await t.test("grant, early renewal, suspension and expiry", async () => {
    assert.equal(
      (
        await call("/admin/subscriptions/alice", admin, "POST", {
          action: "grant",
          reason: "Teste local",
        })
      ).status,
      200,
    );
    const first: any = await (await call("/session", a)).json();
    assert.equal(first.isProSubscriber, true);
    assert.equal(
      (
        await call("/admin/subscriptions/alice", admin, "POST", {
          action: "renew",
          reason: "Renovação",
        })
      ).status,
      200,
    );
    const second: any = await (await call("/session", a)).json();
    assert.equal(
      Date.parse(second.subscription.expiresAt) -
        Date.parse(first.subscription.expiresAt),
      365 * 86400000,
    );
    assert.equal(
      (
        await call("/admin/subscriptions/alice", admin, "POST", {
          action: "suspend",
          reason: "Suspensão",
        })
      ).status,
      200,
    );
    assert.equal(
      (await (await call("/session", a)).json()).isProSubscriber,
      false,
    );
    assert.equal(
      (
        await call("/theology/chat", a, "POST", {
          message: "Teste",
          history: [],
        })
      ).status,
      403,
    );
    await call("/admin/subscriptions/alice", admin, "POST", {
      action: "activate",
      reason: "Reativar",
    });
    await firestore
      .doc("subscriptions/bob")
      .set({ status: "active", expiresAt: new Date(Date.now() - 10000) });
    assert.equal(
      (await (await call("/session", b)).json()).isProSubscriber,
      false,
    );
  });
  await t.test(
    "studies and notes persist across sessions and remain isolated",
    async () => {
      const study = { ...INITIAL_SERMON, id: "study-alice" };
      assert.equal(
        (
          await call("/studies/study-alice", a, "PUT", {
            type: "sermon",
            data: study,
          })
        ).status,
        200,
      );
      assert.equal((await (await call("/studies", a)).json()).length, 1);
      assert.equal((await (await call("/studies", b)).json()).length, 0);
      assert.equal(
        (
          await call("/notes/note-alice", a, "PUT", {
            title: "Nota",
            biblicalReference: "Rm 5",
            content: "Reflexão",
          })
        ).status,
        200,
      );
      assert.equal((await (await call("/notes", b)).json()).length, 0);
      assert.equal(
        (
          await call("/notes/note-alice", a, "PUT", {
            title: "Editada",
            biblicalReference: "",
            content: "Atualizada",
          })
        ).status,
        200,
      );
      assert.equal(
        (await (await call("/notes", a)).json())[0].title,
        "Editada",
      );
      await call("/notes/note-alice", a, "DELETE");
      await call("/studies/study-alice", a, "DELETE");
      assert.equal((await (await call("/studies", a)).json()).length, 0);
      assert.equal((await (await call("/notes", a)).json()).length, 0);
    },
  );
  await t.test(
    "chapter writes do not replace other chapters; zero survives reload",
    async () => {
      await Promise.all([
        call("/reading/rm%3A1", a, "PUT", { completed: true }),
        call("/reading/rm%3A2", a, "PUT", { completed: true }),
      ]);
      assert.equal((await (await call("/reading", a)).json()).length, 2);
      assert.deepEqual(await (await call("/reading", b)).json(), []);
      await call("/reading/rm%3A1", a, "PUT", { completed: false });
      await call("/reading/rm%3A2", a, "PUT", { completed: false });
      assert.deepEqual(await (await call("/reading", a)).json(), []);
      assert.equal(
        (await call("/reading/rm%3A99", a, "PUT", { completed: true })).status,
        400,
      );
    },
  );
  await t.test(
    "real PDF upload/delivery, invalid files denied and archive preserves grants",
    async () => {
      const result = await call("/products", admin, "POST", {
        title: "Material",
        author: "Autor",
        description: "PDF local de teste",
        category: "Livro",
        price: 0,
        pages: 1,
        isFreeForSubscribers: false,
        coverImage: "",
        archived: true,
      });
      assert.equal(result.status, 201);
      productId = (await result.json()).id;
      const upload = (data: Buffer) =>
        fetch(base + "/api/products/" + productId + "/pdf", {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + admin,
            "Content-Type": "application/pdf",
          },
          body: data as any,
        });
      assert.equal((await upload(Buffer.from("not a pdf"))).status, 400);
      assert.equal(
        (await upload(Buffer.alloc(25 * 1024 * 1024 + 1))).status,
        413,
      );
      const pdf = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF",
      );
      assert.equal((await upload(pdf)).status, 200);
      assert.equal(
        (await call("/products/" + productId + "/file", a)).status,
        403,
      );
      await call("/products/" + productId, admin, "PATCH", { archived: false });
      const file = await call("/products/" + productId + "/file", a);
      assert.equal(file.status, 200);
      assert.equal(file.headers.get("Content-Type"), "application/pdf");
      assert.deepEqual(Buffer.from(await file.arrayBuffer()), pdf);
      await call("/products/" + productId, admin, "PATCH", { archived: true });
      assert.equal(
        (await call("/products/" + productId + "/file", a)).status,
        200,
      );
      assert.equal(
        (await call("/products/" + productId + "/file", b)).status,
        403,
      );
      assert.equal(
        (
          await call("/admin/entitlements", admin, "POST", {
            uid: "bob",
            productId,
            reason: "Teste",
          })
        ).status,
        409,
      );
    },
  );
  await t.test(
    "Gemini missing config, validated output, errors, limits and real activity",
    async () => {
      const old = config.apiKey;
      config.apiKey = undefined;
      assert.equal(
        (
          await call("/theology/chat", a, "POST", {
            message: "Teste",
            history: [],
          })
        ).status,
        503,
      );
      config.apiKey = old;
      await firestore.doc("aiLimits/alice").delete();
      aiOutput = "Resposta teológica";
      assert.equal(
        (
          await call("/theology/chat", a, "POST", {
            message: "Pergunta",
            history: [],
          })
        ).status,
        200,
      );
      aiOutput = "{}";
      assert.equal(
        (await call("/theology/sermon", a, "POST", { biblicalText: "Rm 5" }))
          .status,
        502,
      );
      const { id, createdAt, ...body } = INITIAL_SERMON;
      aiOutput = JSON.stringify(body);
      const result = await call("/theology/sermon", a, "POST", {
        biblicalText: "Rm 5",
      });
      assert.equal(result.status, 200);
      assert.ok((await result.json()).id);
      await firestore.doc("aiLimits/bob").delete();
      await Promise.all(Array.from({ length: 5 }, () => takeAiSlot("bob")));
      await assert.rejects(() => takeAiSlot("bob"), /Limite/);
      const events = await (await call("/activity", a)).json();
      assert.equal(events.length, 2);
      assert.equal(providerCalls, 3);
    },
  );
});
test("Firestore and Storage rules reject ownership, field and authorization bypasses", async () => {
  const alice = env.authenticatedContext("alice", {
    email: "alice@example.test",
  });
  const bob = env.authenticatedContext("bob", { email: "bob@example.test" });
  const anon = env.unauthenticatedContext();
  const profile = doc(alice.firestore(), "users/alice");
  await assertSucceeds(getDoc(profile));
  await assertFails(getDoc(doc(bob.firestore(), "users/alice")));
  await assertFails(getDoc(doc(anon.firestore(), "users/alice")));
  await assertSucceeds(
    updateDoc(profile, {
      displayName: "Nome permitido",
      updatedAt: serverTimestamp(),
    }),
  );
  for (const data of [
    { role: "admin" },
    { isProSubscriber: true },
    { uid: "bob" },
    { email: "other@example.test" },
    { displayName: 42 },
    { displayName: "x".repeat(101) },
    { unexpected: "field" },
  ])
    await assertFails(
      updateDoc(profile, { ...data, updatedAt: serverTimestamp() }),
    );
  await assertFails(deleteDoc(profile));
  await assertFails(
    setDoc(doc(alice.firestore(), "users/bob"), {
      uid: "bob",
      email: "bob@example.test",
      displayName: "Bob",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    setDoc(doc(alice.firestore(), "users/alice/notes/injected"), {
      content: "x",
      ownerId: "bob",
    }),
  );
  await assertFails(
    setDoc(doc(alice.firestore(), "subscriptions/alice"), { status: "active" }),
  );
  await assertFails(getDoc(doc(anon.firestore(), "products/" + productId)));
  await assertFails(
    uploadBytes(
      ref(alice.storage(), "products/injected.pdf"),
      new Uint8Array([1, 2, 3]),
    ),
  );
  await assertFails(
    getBytes(ref(alice.storage(), "products/" + productId + "/any.pdf")),
  );
});
