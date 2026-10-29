import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = ["package-lock.json", "public/manifest.webmanifest", "public/sw.js", ".github/workflows/ci.yml"];
const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`Arquivos obrigatórios ausentes: ${missing.join(", ")}`);
  process.exit(1);
}

const envPath = path.join(root, ".env");
if (existsSync(envPath)) {
  const insecure = readFileSync(envPath, "utf8").split(/\r?\n/).filter((line) => /^VITE_.*(SECRET|GEMINI|INFINITEPAY|SERVICE_ROLE)/i.test(line));
  if (insecure.length > 0) {
    console.error("Segredos foram encontrados em variáveis VITE_, que ficam expostas ao navegador.");
    process.exit(1);
  }
}

const production = process.env.PREFLIGHT_PRODUCTION === "true";
const requiredProduction = ["PUBLIC_URL", "SUPABASE_URL", "SUPABASE_SECRET_KEY", "GEMINI_API_KEY"];
const missingProduction = requiredProduction.filter((name) => !process.env[name]);
if (production && missingProduction.length > 0) {
  console.error(`Variáveis de produção ausentes: ${missingProduction.join(", ")}`);
  process.exit(1);
}
if (production && !String(process.env.PUBLIC_URL).startsWith("https://")) {
  console.error("PUBLIC_URL de produção precisa usar HTTPS.");
  process.exit(1);
}

console.log(`Preflight aprovado (${production ? "produção" : "local"}). Segredos não foram exibidos.`);
if (!existsSync(path.join(root, "dist"))) console.warn("Aviso: dist/ ainda não existe; execute npm run build antes da publicação.");
