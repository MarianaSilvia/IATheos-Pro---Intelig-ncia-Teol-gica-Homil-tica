import assert from "node:assert/strict";
import test from "node:test";
import { readStudyContext, writeStudyContext } from "./studyContext";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

test("study context is isolated by user and survives a session reload", () => {
  const store = storage();
  assert.equal(writeStudyContext("user-a", { reference: "João 3:16" }, store), true);
  assert.deepEqual(readStudyContext("user-a", store), { reference: "João 3:16" });
  assert.equal(readStudyContext("user-b", store), null);
});

test("clearing study context removes the persisted value", () => {
  const store = storage();
  writeStudyContext("user-a", { reference: "Romanos 5:1", book: "Romanos", chapter: 5 }, store);
  assert.equal(writeStudyContext("user-a", null, store), true);
  assert.equal(readStudyContext("user-a", store), null);
});

