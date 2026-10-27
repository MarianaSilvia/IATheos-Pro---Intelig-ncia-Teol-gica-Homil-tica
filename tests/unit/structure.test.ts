import { test } from "node:test";
import assert from "node:assert/strict";
import {
  productSchema,
  noteSchema,
  sermonSchema,
  hasActiveSubscription,
  renewalExpiry,
} from "../../src/shared/contracts.ts";
import { INITIAL_SERMON } from "../fixtures/theology.ts";
import { findBibleChapter } from "../../src/utils/bibleContent.ts";
import { loadCompletedChapters } from "../../src/utils/bibleProgress.ts";
import { generateLast7DaysActivities } from "../../src/utils/activityMetrics.ts";
test("renewal preserves remaining time; suspended and expired access is denied", () => {
  const now = Date.parse("2026-01-01T00:00:00Z");
  assert.equal(
    renewalExpiry("2026-02-01T00:00:00Z", now),
    "2027-02-01T00:00:00.000Z",
  );
  assert.equal(
    renewalExpiry("2020-01-01T00:00:00Z", now),
    "2027-01-01T00:00:00.000Z",
  );
  assert.equal(
    hasActiveSubscription(
      { status: "suspended", expiresAt: "2027-01-01T00:00:00Z" },
      now,
    ),
    false,
  );
  assert.equal(
    hasActiveSubscription(
      { status: "active", expiresAt: "2026-01-01T00:00:00Z" },
      now,
    ),
    false,
  );
});
test("schemas accept free products and reject privilege injection, malformed AI and invalid notes", () => {
  const valid = {
    title: "Material",
    author: "Autor",
    category: "Livro",
    description: "Descrição",
    price: 0,
    pages: 1,
    isFreeForSubscribers: false,
    coverImage: "",
    archived: true,
  };
  assert.equal(productSchema.parse(valid).price, 0);
  assert.equal(
    productSchema.safeParse({ ...valid, role: "admin" }).success,
    false,
  );
  assert.equal(productSchema.safeParse({ ...valid, price: -1 }).success, false);
  assert.equal(
    noteSchema.safeParse({
      title: "Nota",
      biblicalReference: "",
      content: "",
      ownerId: "other",
    }).success,
    false,
  );
  const { id, createdAt, ...sermon } = INITIAL_SERMON;
  assert.equal(sermonSchema.safeParse(sermon).success, true);
  assert.equal(
    sermonSchema.safeParse({ ...sermon, introduction: { hook: "incompleto" } })
      .success,
    false,
  );
});
test("Bible lookup never returns a different chapter or translation", () => {
  assert.equal(findBibleChapter("Romanos", 5, "NAA")?.chapter, 5);
  assert.equal(findBibleChapter("Salmos", 5, "NAA"), null);
  assert.equal(findBibleChapter("João", 3, "UNKNOWN"), null);
  assert.equal(findBibleChapter("Romanos", 1, "NAA"), null);
});
test("empty stored progress stays empty; activity starts at zero", () => {
  const original = (globalThis as any).window;
  (globalThis as any).window = { localStorage: { getItem: () => "[]" } };
  try {
    assert.deepEqual(loadCompletedChapters(), []);
  } finally {
    (globalThis as any).window = original;
  }
  const date = new Date("2026-10-27T12:00:00Z");
  assert.equal(
    generateLast7DaysActivities(date).reduce((s, d) => s + d.total, 0),
    0,
  );
  assert.equal(
    generateLast7DaysActivities(date, [
      { type: "sermon", createdAt: date.toISOString() },
    ]).at(-1)?.sermoes,
    1,
  );
});
