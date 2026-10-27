import { Router, raw } from "express";
import { randomUUID } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { adminAuth, firestore, bucket } from "./firebase.ts";
import { asyncRoute, requireAuth, requireAdmin, HttpError } from "./http.ts";
import {
  serialize,
  stamp,
  sessionFor,
  changeSubscription,
  fileAccess,
} from "./services.ts";
import {
  generatedSchemas,
  idSchema,
  noteSchema,
  productSchema,
  studyType,
  subscriptionActionSchema,
} from "../shared/contracts.ts";
import { BIBLE_BOOKS } from "../utils/bibleProgress.ts";
const router = Router();
router.post("/webhooks/payment", (_req, res) => {
  res
    .status(410)
    .json({ error: "Cobrança desativada. Nenhum acesso foi concedido." });
});
router.get("/health", (_req, res) => {
  res.json({ status: "ok", paymentsEnabled: false });
});
router.use(requireAuth);
router.get(
  "/session",
  asyncRoute(async (req, res) => {
    res.json(await sessionFor(req.user));
  }),
);
router.post(
  "/users/sync",
  asyncRoute(async (req, res) => {
    const ref = firestore.doc(`users/${req.user.uid}`);
    await firestore.runTransaction(async (tx) => {
      const old = await tx.get(ref);
      tx.set(
        ref,
        {
          uid: req.user.uid,
          email: req.user.email || "",
          displayName:
            old.data()?.displayName ??
            String(req.user.name || "").slice(0, 100),
          updatedAt: stamp(),
          ...(!old.exists ? { createdAt: stamp() } : {}),
        },
        { merge: true },
      );
    });
    res.json(await sessionFor(req.user));
  }),
);
router.patch(
  "/profile",
  asyncRoute(async (req, res) => {
    const data = z
      .object({ displayName: z.string().trim().min(1).max(100) })
      .strict()
      .parse(req.body);
    await firestore
      .doc(`users/${req.user.uid}`)
      .update({ ...data, updatedAt: stamp() });
    res.json(data);
  }),
);
router.get(
  "/products",
  asyncRoute(async (req, res) => {
    const [items, grants] = await Promise.all([
      firestore.collection("products").get(),
      firestore.collection(`users/${req.user.uid}/entitlements`).get(),
    ]);
    const owned = new Set(grants.docs.map((d) => d.id));
    res.json(
      items.docs
        .filter(
          (d) =>
            req.user.admin === true || !d.data().archived || owned.has(d.id),
        )
        .map((d) => {
          const { storagePath, ...data } = d.data();
          return {
            ...serialize(data),
            id: d.id,
            hasFile: !!storagePath,
            owned: owned.has(d.id),
          };
        }),
    );
  }),
);
router.post(
  "/products",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const data = productSchema.parse(req.body);
    const ref = firestore.collection("products").doc();
    await ref.create({
      ...data,
      archived: true,
      storagePath: null,
      createdAt: stamp(),
      updatedAt: stamp(),
    });
    res.status(201).json({ id: ref.id });
  }),
);
router.patch(
  "/products/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const ref = firestore.doc(`products/${idSchema.parse(req.params.id)}`);
    const data = productSchema.partial().strict().parse(req.body);
    await firestore.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new HttpError(404, "Produto não encontrado.");
      if (data.archived === false && !snap.data()?.storagePath)
        throw new HttpError(
          409,
          "Anexe um PDF antes de disponibilizar no catálogo.",
        );
      tx.update(ref, { ...data, updatedAt: stamp() });
    });
    res.json({ ok: true });
  }),
);
router.put(
  "/products/:id/pdf",
  requireAdmin,
  raw({ type: "application/pdf", limit: "25mb" }),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const ref = firestore.doc(`products/${id}`);
    if (!(await ref.get()).exists)
      throw new HttpError(404, "Produto não encontrado.");
    const data = req.body;
    if (
      !Buffer.isBuffer(data) ||
      data.length < 10 ||
      data.subarray(0, 5).toString() !== "%PDF-" ||
      !data.subarray(-1024).includes(Buffer.from("%%EOF"))
    )
      throw new HttpError(400, "Envie um arquivo PDF válido, de até 25 MB.");
    const storagePath = `products/${id}/${randomUUID()}.pdf`;
    await bucket.file(storagePath).save(data, {
      resumable: false,
      metadata: {
        contentType: "application/pdf",
        cacheControl: "private, no-store",
      },
    });
    try {
      await ref.update({ storagePath, updatedAt: stamp() });
    } catch (error) {
      await bucket
        .file(storagePath)
        .delete()
        .catch(() => {});
      throw error;
    }
    res.json({ ok: true });
  }),
);
router.get(
  "/products/:id/file",
  asyncRoute(async (req, res) => {
    const data = await fileAccess(req.user, idSchema.parse(req.params.id));
    const file = bucket.file(data.storagePath);
    const [metadata] = await file.getMetadata();
    if (Number(metadata.size) > 25 * 1024 * 1024)
      throw new HttpError(413, "Arquivo acima do limite.");
    const [bytes] = await file.download();
    res.set({
      "Content-Type": "application/pdf",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": 'inline; filename="material.pdf"',
    });
    res.send(bytes);
  }),
);
router.get(
  "/studies",
  asyncRoute(async (req, res) => {
    const result = await firestore
      .collection(`users/${req.user.uid}/studies`)
      .orderBy("updatedAt", "desc")
      .get();
    res.json(
      result.docs.map((d) => ({
        ...serialize(d.data()),
        savedAt: serialize(d.data().updatedAt),
        id: d.id,
      })),
    );
  }),
);
router.put(
  "/studies/:id",
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = z
      .object({ type: studyType, data: z.unknown() })
      .strict()
      .parse(req.body);
    const schema = generatedSchemas[input.type].extend({
      id: idSchema,
      createdAt: z.iso.datetime(),
    });
    const data: any = schema.parse(input.data);
    if (data.id !== id)
      throw new HttpError(400, "Identificador do estudo incompatível.");
    if (Buffer.byteLength(JSON.stringify(data)) > 200000)
      throw new HttpError(400, "Estudo acima do limite.");
    await firestore.doc(`users/${req.user.uid}/studies/${id}`).set({
      type: input.type,
      title: data.title || `Raio-X: ${data.verseReference}`,
      reference: data.biblicalText || data.verseReference,
      data,
      updatedAt: stamp(),
    });
    res.json({ ok: true });
  }),
);
router.delete(
  "/studies/:id",
  asyncRoute(async (req, res) => {
    await firestore
      .doc(`users/${req.user.uid}/studies/${idSchema.parse(req.params.id)}`)
      .delete();
    res.json({ ok: true });
  }),
);
router.get(
  "/notes",
  asyncRoute(async (req, res) => {
    const snap = await firestore
      .collection(`users/${req.user.uid}/notes`)
      .orderBy("updatedAt", "desc")
      .get();
    res.json(snap.docs.map((d) => ({ ...serialize(d.data()), id: d.id })));
  }),
);
router.put(
  "/notes/:id",
  asyncRoute(async (req, res) => {
    const data = noteSchema.parse(req.body);
    await firestore
      .doc(`users/${req.user.uid}/notes/${idSchema.parse(req.params.id)}`)
      .set({ ...data, updatedAt: stamp() });
    res.json({ ok: true });
  }),
);
router.delete(
  "/notes/:id",
  asyncRoute(async (req, res) => {
    await firestore
      .doc(`users/${req.user.uid}/notes/${idSchema.parse(req.params.id)}`)
      .delete();
    res.json({ ok: true });
  }),
);
router.get(
  "/reading",
  asyncRoute(async (req, res) => {
    const snap = await firestore
      .collection(`users/${req.user.uid}/reading`)
      .get();
    res.json(snap.docs.map((d) => d.id));
  }),
);
router.put(
  "/reading/:key",
  asyncRoute(async (req, res) => {
    const key = z
      .string()
      .regex(/^[a-z0-9]+:[0-9]{1,3}$/)
      .parse(req.params.key);
    const [bookId, chapter] = key.split(":");
    if (
      !BIBLE_BOOKS.some(
        (b) =>
          b.id === bookId &&
          Number(chapter) >= 1 &&
          Number(chapter) <= b.chaptersCount,
      )
    )
      throw new HttpError(400, "Capítulo inválido.");
    const { completed } = z
      .object({ completed: z.boolean() })
      .strict()
      .parse(req.body);
    const ref = firestore.doc(`users/${req.user.uid}/reading/${key}`);
    if (completed)
      await ref.set({ bookId, chapter: Number(chapter), completedAt: stamp() });
    else await ref.delete();
    res.json({ ok: true });
  }),
);
router.get(
  "/activity",
  asyncRoute(async (req, res) => {
    const snap = await firestore
      .collection(`users/${req.user.uid}/events`)
      .where("createdAt", ">=", Timestamp.fromMillis(Date.now() - 7 * 86400000))
      .get();
    res.json(snap.docs.map((d) => serialize(d.data())));
  }),
);
router.get(
  "/admin/users",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const page = await adminAuth.listUsers(
      100,
      typeof req.query.pageToken === "string" ? req.query.pageToken : undefined,
    );
    const result = await Promise.all(
      page.users.map(async (u) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        subscription:
          (await firestore.doc(`subscriptions/${u.uid}`).get()).data() || null,
      })),
    );
    res.json({ users: serialize(result), pageToken: page.pageToken || null });
  }),
);
router.post(
  "/admin/subscriptions/:uid",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const data = subscriptionActionSchema.parse(req.body);
    await changeSubscription(
      idSchema.parse(req.params.uid),
      data.action,
      data.reason,
      req.user.uid,
    );
    res.json({ ok: true });
  }),
);
router.post(
  "/admin/entitlements",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const { uid, productId, reason } = z
      .object({
        uid: idSchema,
        productId: idSchema,
        reason: z.string().trim().min(1).max(1000),
      })
      .strict()
      .parse(req.body);
    await adminAuth.getUser(uid);
    await firestore.runTransaction(async (tx) => {
      const product = await tx.get(firestore.doc(`products/${productId}`));
      if (
        !product.exists ||
        product.data()?.archived ||
        !product.data()?.storagePath
      )
        throw new HttpError(409, "Produto indisponível para novas concessões.");
      tx.set(firestore.doc(`users/${uid}/entitlements/${productId}`), {
        productId,
        source: "manual",
        grantedAt: stamp(),
      });
      tx.create(firestore.collection("adminAudit").doc(), {
        actorUid: req.user.uid,
        targetUid: uid,
        productId,
        reason,
        action: "grant-product",
        createdAt: stamp(),
      });
    });
    res.json({ ok: true });
  }),
);
router.get(
  "/admin/audit",
  requireAdmin,
  asyncRoute(async (_req, res) => {
    const snap = await firestore
      .collection("adminAudit")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })));
  }),
);
export default router;
