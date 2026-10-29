import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { hasValidInfinitePaySignature } from "../../src/server/payment.ts";

test("InfinitePay webhook requires a valid HMAC signature", () => {
  const body = JSON.stringify({ order_nsu: "order", status: "paid" });
  const secret = "webhook-secret";
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(hasValidInfinitePaySignature(body, signature, secret), true);
  assert.equal(hasValidInfinitePaySignature(body, "", secret), false);
  assert.equal(hasValidInfinitePaySignature(body, "invalid", secret), false);
  assert.equal(hasValidInfinitePaySignature(body, signature, ""), false);
  assert.equal(hasValidInfinitePaySignature(`${body} `, signature, secret), false);
});

