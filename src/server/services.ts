import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DecodedIdToken } from "firebase-admin/auth";
import { firestore, adminAuth } from "./firebase.ts";
import {
  hasActiveSubscription,
  renewalExpiry,
  type Subscription,
} from "../shared/contracts.ts";
import { HttpError } from "./http.ts";
export const stamp = () => FieldValue.serverTimestamp();
export function serialize(value: any): any {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, serialize(v)]),
    );
  return value;
}
export async function subscriptionFor(
  uid: string,
): Promise<Subscription | null> {
  const snap = await firestore.doc(`subscriptions/${uid}`).get();
  return snap.exists ? serialize(snap.data()) : null;
}
export async function sessionFor(user: DecodedIdToken) {
  const [subscription, profile] = await Promise.all([
    subscriptionFor(user.uid),
    firestore.doc(`users/${user.uid}`).get(),
  ]);
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: profile.data()?.displayName || user.name || user.email || "",
    isAdmin: user.admin === true,
    isProSubscriber: user.admin === true || hasActiveSubscription(subscription),
    subscription,
  };
}
export async function requirePro(user: DecodedIdToken) {
  if (
    user.admin !== true &&
    !hasActiveSubscription(await subscriptionFor(user.uid))
  )
    throw new HttpError(
      403,
      "Seu acesso está inativo. Solicite a liberação ao administrador.",
    );
}
export async function changeSubscription(
  uid: string,
  action: string,
  reason: string,
  actor: string,
) {
  await adminAuth.getUser(uid); // Only registered identities can receive access.
  const ref = firestore.doc(`subscriptions/${uid}`);
  const audit = firestore.collection("adminAudit").doc();
  await firestore.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    const old = current.exists ? serialize(current.data()) : null;
    if ((action === "activate" || action === "suspend") && !old)
      throw new HttpError(404, "Usuário sem assinatura concedida.");
    if (action === "activate" && Date.parse(old.expiresAt) <= Date.now())
      throw new HttpError(409, "A assinatura expirou. Use renovar.");
    const expiresAt = ["grant", "renew"].includes(action)
      ? renewalExpiry(old?.expiresAt)
      : old.expiresAt;
    const next = {
      uid,
      status: action === "suspend" ? "suspended" : "active",
      expiresAt: Timestamp.fromDate(new Date(expiresAt)),
      updatedAt: stamp(),
    };
    tx.set(ref, next);
    tx.create(audit, {
      actorUid: actor,
      targetUid: uid,
      action,
      reason,
      createdAt: stamp(),
    });
  });
}
export async function fileAccess(user: DecodedIdToken, productId: string) {
  const ref = firestore.doc(`products/${productId}`);
  const grantRef = firestore.doc(`users/${user.uid}/entitlements/${productId}`);
  return firestore.runTransaction(async (tx) => {
    const [product, grant, sub] = await Promise.all([
      tx.get(ref),
      tx.get(grantRef),
      tx.get(firestore.doc(`subscriptions/${user.uid}`)),
    ]);
    if (!product.exists || !product.data()?.storagePath)
      throw new HttpError(404, "PDF indisponível.");
    const data = product.data()!;
    const eligible =
      !data.archived &&
      (data.price === 0 ||
        (data.isFreeForSubscribers &&
          hasActiveSubscription(serialize(sub.data()))));
    if (user.admin !== true && !grant.exists && !eligible)
      throw new HttpError(403, "Você não possui acesso a este material.");
    if (user.admin !== true && !grant.exists)
      tx.create(grantRef, {
        productId,
        grantedAt: stamp(),
        source: data.price === 0 ? "free" : "subscription",
      });
    return data;
  });
}
export async function takeAiSlot(uid: string, now = Date.now()) {
  const ref = firestore.doc(`aiLimits/${uid}`);
  await firestore.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    const start = data?.windowStart?.toMillis?.() || 0;
    const count = now - start < 60000 ? Number(data?.count || 0) : 0;
    if (count >= 5)
      throw new HttpError(
        429,
        "Limite de 5 consultas por minuto. Aguarde e tente novamente.",
      );
    tx.set(ref, {
      windowStart: Timestamp.fromMillis(count ? start : now),
      count: count + 1,
    });
  });
}
