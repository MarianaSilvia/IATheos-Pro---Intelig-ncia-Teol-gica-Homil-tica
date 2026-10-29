import assert from "node:assert/strict";
import test from "node:test";
import { formatVerseReference, parseBibleReference, toggleVerseSelection } from "./bibleSelection";

test("toggles and keeps selected verses ordered", () => {
  assert.deepEqual(toggleVerseSelection([3, 1], 2), [1, 2, 3]);
  assert.deepEqual(toggleVerseSelection([1, 2, 3], 2), [1, 3]);
});

test("formats single, contiguous and disjoint verse selections", () => {
  assert.equal(formatVerseReference("João", 3, [16]), "João 3:16");
  assert.equal(formatVerseReference("João", 3, [18, 16, 17]), "João 3:16-18");
  assert.equal(formatVerseReference("João", 3, [16, 18]), "João 3:16,18");
});

test("parses references with books that contain spaces", () => {
  assert.deepEqual(parseBibleReference("1 Coríntios 13:4-7"), { book: "1 Coríntios", chapter: 13, verses: [4, 5, 6, 7] });
  assert.deepEqual(parseBibleReference("João 3"), { book: "João", chapter: 3 });
  assert.equal(parseBibleReference("não é referência"), null);
});

test("parses selected verse ranges for restoring the active passage", () => {
  assert.deepEqual(parseBibleReference("João 3:16-18"), { book: "João", chapter: 3, verses: [16, 17, 18] });
  assert.deepEqual(parseBibleReference("Salmos 23:1,3"), { book: "Salmos", chapter: 23, verses: [1, 3] });
});

