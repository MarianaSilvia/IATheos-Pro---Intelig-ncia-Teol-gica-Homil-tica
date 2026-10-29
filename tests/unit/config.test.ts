import assert from "node:assert/strict";
import test from "node:test";
import { resolveHost, resolvePublicUrl } from "../../src/server/config.ts";

test("server binds safely by environment", () => {
  assert.equal(resolveHost(undefined, undefined), "127.0.0.1");
  assert.equal(resolveHost("development", undefined), "127.0.0.1");
  assert.equal(resolveHost("production", undefined), "0.0.0.0");
  assert.equal(resolveHost("production", "10.0.0.4"), "10.0.0.4");
});

test("public URLs prefer explicit configuration and never fall back to localhost on Vercel", () => {
  assert.equal(resolvePublicUrl("https://verbo-norte.example/", "deployment.vercel.app", "http://localhost:3000"), "https://verbo-norte.example");
  assert.equal(resolvePublicUrl(undefined, "deployment.vercel.app", "http://localhost:3000"), "https://deployment.vercel.app");
  assert.equal(resolvePublicUrl(undefined, undefined, "http://localhost:3000"), "http://localhost:3000");
});

