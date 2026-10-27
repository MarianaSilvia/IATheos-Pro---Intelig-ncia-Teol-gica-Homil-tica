import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
const require = createRequire(import.meta.url);
const auth = require("firebase-tools/lib/auth.js");
const rules = require("firebase-tools/lib/gcp/rules.js");
const storage = require("firebase-tools/lib/gcp/storage.js");
const { FirestoreApi } = require("firebase-tools/lib/firestore/api.js");
const config = JSON.parse(
  readFileSync(new URL("../firebase.remote.json", import.meta.url), "utf8"),
);
const project = "possible-zephyr-zxctm";
const projectNumber = "616747257260";
const database =
  "ai-studio-iatheosprointeli-6684e688-953f-4a8e-817e-4611e2daeff1";
const bucket = "possible-zephyr-zxctm.firebasestorage.app";
const dryRun = process.argv.includes("--dry-run");
const firestoreOnly = process.argv.includes("--firestore-only");
for (const key of [
  "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST",
  "FIREBASE_STORAGE_EMULATOR_HOST",
])
  if (process.env[key])
    throw new Error(
      "Remova as variáveis dos emuladores antes de sincronizar a nuvem.",
    );
if (
  config.firestore[0].database !== database ||
  config.storage[0].bucket !== bucket
)
  throw new Error("Destino remoto diferente do projeto revisado.");
const account = auth.getGlobalDefaultAccount();
if (!account)
  throw new Error(
    "Faça login no Firebase CLI antes de sincronizar. Não coloque tokens no código.",
  );
auth.setRefreshToken(account.tokens.refresh_token);
const api = new FirestoreApi();
const metadata = await api.getDatabase(project, database);
if (
  metadata.databaseEdition !== "ENTERPRISE" ||
  metadata.type !== "FIRESTORE_NATIVE" ||
  metadata.name !== "projects/" + project + "/databases/" + database
)
  throw new Error("Banco remoto diferente do Enterprise Native verificado.");
const firestoreFiles = [
  { name: "firestore.rules", content: readFileSync("firestore.rules", "utf8") },
];
const storageFiles = [
  { name: "storage.rules", content: readFileSync("storage.rules", "utf8") },
];
const indexes = JSON.parse(
  readFileSync("firestore.remote.indexes.json", "utf8"),
);
indexes.indexes = indexes.indexes.map((index) =>
  FirestoreApi.processIndex(structuredClone(index)),
);
api.validateSpec(indexes);
const [releases, currentIndexes, buckets] = await Promise.all([
  rules.listAllReleases(project),
  api.listIndexes(project, database),
  storage.listBuckets(project),
]);
const hasStorage = buckets.some((b) => b.name === bucket);
const releaseName =
  "projects/" + project + "/releases/cloud.firestore/" + database;
const previous = releases.find((r) => r.name === releaseName);
if (!previous)
  throw new Error(
    "O banco não possui o release esperado. Nenhum recurso novo será criado automaticamente.",
  );
const previousFiles = await rules.getRulesetContent(previous.rulesetName);
const previousStorage = releases.find(
  (r) =>
    r.name === "projects/" + project + "/releases/firebase.storage/" + bucket,
);
if (previousStorage) {
  const content = await rules.getRulesetContent(previousStorage.rulesetName);
  if (content.length !== 1 || content[0].content !== storageFiles[0].content)
    throw new Error(
      "O bucket possui regras diferentes. Revise os consumidores antes de substituir regras compartilhadas.",
    );
}
for (const files of [
  firestoreFiles,
  ...(hasStorage && !firestoreOnly ? [storageFiles] : []),
]) {
  const result = await rules.testRuleset(project, files);
  const errors = (result.body.issues || []).filter(
    (i) => i.severity === "ERROR",
  );
  if (errors.length) throw new Error(JSON.stringify(errors));
}
const missing = indexes.indexes.filter(
  (spec) =>
    !currentIndexes.some((index) =>
      api.indexMatchesSpec(index, spec, "ENTERPRISE"),
    ),
);
const changed =
  previousFiles.length !== 1 ||
  previousFiles[0].content !== firestoreFiles[0].content;
const summary = {
  project,
  database,
  edition: metadata.databaseEdition,
  location: metadata.locationId,
  firestoreRulesChanged: changed,
  indexesToCreate: missing.length,
  existingIndexes: currentIndexes.length,
  storage: hasStorage ? "available" : "blocked-starter-bucket-unavailable",
  dryRun,
};
console.log(JSON.stringify(summary, null, 2));
if (dryRun) process.exit(0);
mkdirSync(".emulator-data/cloud-backups", { recursive: true });
writeFileSync(
  ".emulator-data/cloud-backups/firestore-" + Date.now() + ".json",
  JSON.stringify(
    { release: previous, files: previousFiles, indexes: currentIndexes },
    null,
    2,
  ),
);
let firestoreRuleset = previous.rulesetName;
if (changed) {
  firestoreRuleset = await rules.createRuleset(
    project,
    firestoreFiles,
    "firestore.googleapis.com/projects/" +
      projectNumber +
      "/databases/" +
      database,
  );
  await rules.updateRelease(
    project,
    firestoreRuleset,
    "cloud.firestore/" + database,
  );
}
for (const index of missing)
  await api.createIndex(
    project,
    FirestoreApi.processIndex(structuredClone(index)),
    database,
  );
if (hasStorage && !firestoreOnly && !previousStorage) {
  const name = await rules.createRuleset(project, storageFiles);
  await rules.createRelease(project, name, "firebase.storage/" + bucket);
}
const confirmed = (await rules.listAllReleases(project)).find(
  (r) => r.name === releaseName,
);
if (confirmed?.rulesetName !== firestoreRuleset)
  throw new Error("A versão remota das regras não foi confirmada.");
const finalIndexes = await api.listIndexes(project, database);
const hash = createHash("sha256")
  .update(firestoreFiles[0].content)
  .digest("hex");
console.log(
  JSON.stringify(
    {
      status: hasStorage || firestoreOnly ? "complete" : "partial",
      firestoreRuleset,
      firestoreRulesSha256: hash,
      indexes: finalIndexes.map((i) => ({ name: i.name, state: i.state })),
      storage: hasStorage ? "synchronized" : "pending-project-upgrade",
    },
    null,
    2,
  ),
);
if (!hasStorage && !firestoreOnly) process.exitCode = 2;
