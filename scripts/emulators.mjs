import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const env = { ...process.env };
const pathKey =
  Object.keys(env).find((key) => key.toLowerCase() === "path") || "PATH";
// A portable JRE may be kept locally; it is ignored by Git and never installed globally.
if (existsSync(".java")) {
  const folder = readdirSync(".java", { withFileTypes: true }).find(
    (e) =>
      e.isDirectory() &&
      existsSync(path.join(".java", e.name, "bin", "java.exe")),
  );
  if (folder) {
    env.JAVA_HOME = path.resolve(".java", folder.name);
    env[pathKey] =
      path.join(env.JAVA_HOME, "bin") + path.delimiter + (env[pathKey] || "");
  }
}
env.FIREBASE_EMULATORS_PATH = path.resolve(".emulator-data/binaries");
const testing = process.argv[2] === "test";
const args = [
  testing ? "emulators:exec" : "emulators:start",
  "--project",
  "demo-iatheos",
  "--only",
  "auth,firestore,storage",
];
if (testing)
  args.push(
    "node node_modules/tsx/dist/cli.mjs --test --test-concurrency=1 tests/integration/*.test.ts",
  );
const child = spawn(
  process.execPath,
  ["node_modules/firebase-tools/lib/bin/firebase.js", ...args],
  { stdio: "inherit", env },
);
child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
