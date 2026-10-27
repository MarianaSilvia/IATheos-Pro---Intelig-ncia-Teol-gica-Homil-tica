import "dotenv/config";
const local = process.env.USE_FIREBASE_EMULATORS !== "false";
if (!local && process.env.ALLOW_REMOTE_FIREBASE !== "true") {
  throw new Error(
    "Remote Firebase is disabled. Use the emulators, or explicitly configure ALLOW_REMOTE_FIREBASE after reviewing the target project.",
  );
}
export const config = {
  local,
  projectId: local ? "demo-iatheos" : process.env.FIREBASE_PROJECT_ID,
  databaseId: local ? "(default)" : process.env.FIRESTORE_DATABASE_ID,
  bucket: local
    ? "demo-iatheos.appspot.com"
    : process.env.FIREBASE_STORAGE_BUCKET,
  port: Number(process.env.PORT || 3000),
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
};
if (!config.projectId || !config.databaseId || !config.bucket)
  throw new Error("Firebase configuration is incomplete.");
if (local) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
  process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
}
