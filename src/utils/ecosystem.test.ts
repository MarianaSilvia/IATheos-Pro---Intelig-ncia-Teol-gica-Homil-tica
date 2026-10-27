import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from "../../tests/fixtures/ecosystem";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  canUserDownload,
  calculateAdminMetrics,
  searchHymns,
  INITIAL_HYMNS,
} from "./ecosystem.ts";

test("Digital product download permission logic", () => {
  const manual = INITIAL_PRODUCTS[0]; // isFreeForSubscribers: true
  const comentario = INITIAL_PRODUCTS[2]; // isFreeForSubscribers: false

  // Pro subscriber can download manual
  assert.equal(canUserDownload(manual, true, []), true);

  // Non-subscriber without ownership cannot download manual
  assert.equal(canUserDownload(manual, false, []), false);

  // Non-subscriber with ownership can download
  assert.equal(canUserDownload(manual, false, [manual.id]), true);

  // Pro subscriber cannot download comment if not free for subscribers, unless owned
  assert.equal(canUserDownload(comentario, true, []), false);
  assert.equal(canUserDownload(comentario, true, [comentario.id]), true);
});

test("Admin sales metrics calculation", () => {
  const metrics = calculateAdminMetrics(INITIAL_ORDERS);
  assert.ok(metrics.totalSales >= 4);
  assert.ok(metrics.totalRevenue > 150);
  assert.ok(metrics.averageTicket > 30);
});

test("Hymn search by number and keyword", () => {
  // Search by exact number
  const hymn15 = searchHymns(INITIAL_HYMNS, "15");
  assert.equal(hymn15.length, 1);
  assert.equal(hymn15[0].title, "Foi na Cruz");

  // Search by text in title or chorus
  const chuvas = searchHymns(INITIAL_HYMNS, "Graça");
  assert.ok(chuvas.length >= 1);
  assert.equal(chuvas[0].number, 1);
});
