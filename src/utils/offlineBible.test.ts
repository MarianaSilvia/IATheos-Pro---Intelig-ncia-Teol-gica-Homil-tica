import assert from "node:assert/strict";
import test from "node:test";
import {
  offlineBibleKey,
  readOfflineBibleChapters,
  toggleOfflineBibleChapter,
  writeOfflineBibleChapters,
} from "./offlineBible";

const chapter = { book: "Romanos", chapter: 5, translation: "NAA" };

test("offline Bible chapters are toggled by book, chapter and translation", () => {
  assert.deepEqual(toggleOfflineBibleChapter([], chapter), [chapter]);
  assert.deepEqual(toggleOfflineBibleChapter([chapter], chapter), []);
  assert.equal(offlineBibleKey(chapter), "Romanos|5|NAA");
});

test("offline Bible storage ignores malformed entries and round-trips valid entries", () => {
  let value = "[{\"book\":\"Romanos\",\"chapter\":5,\"translation\":\"NAA\"},{\"book\":3}]";
  const storage = {
    getItem: () => value,
    setItem: (_key: string, next: string) => { value = next; },
  };
  assert.deepEqual(readOfflineBibleChapters(storage), [chapter]);
  assert.equal(writeOfflineBibleChapters([chapter], storage), true);
  assert.deepEqual(readOfflineBibleChapters(storage), [chapter]);
});
