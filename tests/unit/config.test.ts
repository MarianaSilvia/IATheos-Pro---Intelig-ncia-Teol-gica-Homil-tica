import assert from "node:assert/strict";
import test from "node:test";
import { resolveHost } from "../../src/server/config.ts";

test("server binds safely by environment", () => {
  assert.equal(resolveHost(undefined, undefined), "127.0.0.1");
  assert.equal(resolveHost("development", undefined), "127.0.0.1");
  assert.equal(resolveHost("production", undefined), "0.0.0.0");
  assert.equal(resolveHost("production", "10.0.0.4"), "10.0.0.4");
});

