import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("PWA manifest identifies Verbo Norte and includes install icons", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "public", "manifest.webmanifest"), "utf8")) as {
    name?: string;
    short_name?: string;
    display?: string;
    start_url?: string;
    icons?: Array<{ src?: string; sizes?: string }>;
  };
  assert.equal(manifest.name, "Verbo Norte");
  assert.equal(manifest.short_name, "Verbo Norte");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/");
  assert.ok(manifest.icons?.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons?.some((icon) => icon.sizes === "512x512"));
});

test("service worker never caches private API requests", async () => {
  const serviceWorker = await readFile(path.join(root, "public", "sw.js"), "utf8");
  assert.match(serviceWorker, /url\.pathname\.startsWith\("\/api\/"\)/);
});

