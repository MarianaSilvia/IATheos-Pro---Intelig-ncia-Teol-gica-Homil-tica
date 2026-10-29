import { INITIAL_READING_PLAN } from "../../tests/fixtures/dashboard";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReadingProgress,
  searchBiblicalThemes,
  searchDictionary,
  toggleReadingCompleted,
  INITIAL_BIBLICAL_THEMES,
  INITIAL_DICTIONARY_ENTRIES,
  INITIAL_CONCORDANCE_ENTRIES,
  buildThemeApproaches,
  searchConcordance,
} from "./dashboard.ts";

test("Reading progress calculation", () => {
  const progress = calculateReadingProgress(INITIAL_READING_PLAN);
  assert.equal(progress.totalCount, 4);
  assert.equal(progress.completedCount, 2);
  assert.equal(progress.percentage, 50);

  const updatedPlan = toggleReadingCompleted(INITIAL_READING_PLAN, "r3");
  const updatedProgress = calculateReadingProgress(updatedPlan);
  assert.equal(updatedProgress.completedCount, 3);
  assert.equal(updatedProgress.percentage, 75);
});

test("Biblical theme search by keywords and verses", () => {
  const ansiedadeResults = searchBiblicalThemes(
    INITIAL_BIBLICAL_THEMES,
    "ansiedade",
  );
  assert.ok(ansiedadeResults.length >= 1);
  assert.equal(ansiedadeResults[0].id, "theme-ansiedade");

  const familiaResults = searchBiblicalThemes(
    INITIAL_BIBLICAL_THEMES,
    "casamento",
  );
  assert.ok(familiaResults.length >= 1);
  assert.equal(familiaResults[0].id, "theme-familia");
});

test("Theological dictionary search", () => {
  const melquisedeque = searchDictionary(
    INITIAL_DICTIONARY_ENTRIES,
    "Melquisedeque",
  );
  assert.ok(melquisedeque.length >= 1);
  assert.equal(melquisedeque[0].category, "Personagem");
  assert.ok(melquisedeque[0].definition.includes("Rei de Salém"));

  const koinonia = searchDictionary(INITIAL_DICTIONARY_ENTRIES, "comunhão");
  assert.ok(koinonia.length >= 1);
});

test("Biblical concordance entries exist", () => {
  const graca = INITIAL_CONCORDANCE_ENTRIES["graça"];
  assert.ok(graca);
  assert.ok(graca.totalOccurrences > 100);
  assert.ok(graca.verses.length >= 2);
});

test("Theme catalog exposes four preparation approaches", () => {
  const options = buildThemeApproaches(INITIAL_BIBLICAL_THEMES[0]);
  assert.equal(options.length, 4);
  assert.deepEqual(options.map((option) => option.approach), ["Expositivo", "Temático", "Devocional", "EBD/Pastoral"]);
  assert.ok(options.every((option) => option.biblicalText.length > 0));
});

test("Reference searches normalize accents and partial terms", () => {
  assert.equal(searchBiblicalThemes(INITIAL_BIBLICAL_THEMES, "  ANSIEDADE ").length, 1);
  assert.equal(searchDictionary(INITIAL_DICTIONARY_ENTRIES, "KOINO").length, 1);
  const result = searchConcordance(INITIAL_CONCORDANCE_ENTRIES, "GRACA");
  assert.ok(result);
  assert.equal(result?.word, "Graça");
  assert.equal(searchConcordance(INITIAL_CONCORDANCE_ENTRIES, "termo-inexistente"), null);
});
