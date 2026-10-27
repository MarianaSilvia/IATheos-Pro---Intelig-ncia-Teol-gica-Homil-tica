/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateLast7DaysActivities,
  calculateActivityStats,
} from "./activityMetrics";

test("generateLast7DaysActivities returns exactly 7 consecutive days", () => {
  const base = new Date("2026-10-27T12:00:00Z");
  const activities = generateLast7DaysActivities(base);

  assert.equal(activities.length, 7, "Must return 7 days of activities");
  assert.ok(activities[0].total >= 0, "Total activity must be non-negative");
  assert.ok(
    activities[6].total >= 0,
    "Latest day activity must be non-negative",
  );
});

test("calculateActivityStats computes correct sums and averages", () => {
  const mockActivities = [
    {
      dayKey: "21/10",
      dayLabel: "Seg",
      fullDate: "21 de Out",
      sermoes: 2,
      ebd: 1,
      estudos: 3,
      total: 6,
    },
    {
      dayKey: "22/10",
      dayLabel: "Ter",
      fullDate: "22 de Out",
      sermoes: 1,
      ebd: 2,
      estudos: 4,
      total: 7,
    },
  ];

  const stats = calculateActivityStats(mockActivities);

  assert.equal(stats.totalSermoes, 3);
  assert.equal(stats.totalEbd, 3);
  assert.equal(stats.totalEstudos, 7);
  assert.equal(stats.totalGeneral, 13);
  assert.equal(stats.mostActiveDay, "Ter");
  assert.equal(stats.averagePerDay, 6.5);
});
