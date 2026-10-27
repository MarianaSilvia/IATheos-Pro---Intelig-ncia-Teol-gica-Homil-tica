import { test } from "node:test";
import assert from "node:assert/strict";
import { renewalExpiry, hasActiveSubscription } from "../shared/contracts";
test("grant without existing subscription lasts 365 days", () => {
  const now = Date.parse("2026-01-01T00:00:00Z");
  assert.equal(renewalExpiry(null, now), "2027-01-01T00:00:00.000Z");
  assert.equal(hasActiveSubscription(null, now), false);
});
