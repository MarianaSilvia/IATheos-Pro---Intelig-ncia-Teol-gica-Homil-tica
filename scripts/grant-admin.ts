import { config } from "../src/server/config.ts";
import { adminAuth } from "../src/server/firebase.ts";
const uid = process.argv[2];
if (!uid || !/^[A-Za-z0-9_-]{1,128}$/.test(uid))
  throw new Error("Usage: npm run admin:grant -- <UID>");
if (!config.local)
  throw new Error("Este comando está restrito ao emulador nesta etapa.");
const user = await adminAuth.getUser(uid);
await adminAuth.setCustomUserClaims(uid, { ...user.customClaims, admin: true });
console.log(
  `Permissão administrativa concedida no emulador para ${uid}. Saia e entre novamente.`,
);
