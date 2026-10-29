const baseUrl = String(process.env.SMOKE_BASE_URL || "").trim().replace(/\/$/, "");

if (!baseUrl || !/^https:\/\//i.test(baseUrl)) {
  console.error("Uso: SMOKE_BASE_URL=https://seu-dominio npm run smoke:production");
  process.exit(2);
}

const checks = [
  ["health", "/api/health", (body, response) => response.status === 200 && body?.status === "ok" && typeof body?.version === "string"],
  ["manifest PWA", "/manifest.webmanifest", (body, response) => response.status === 200 && body?.name === "Verbo Norte"],
  ["catálogo público", "/api/public/products", (body, response) => response.status === 200 && Array.isArray(body)],
  ["planos públicos", "/api/public/subscription-plans", (body, response) => response.status === 200 && Array.isArray(body)],
  ["rota privada protegida", "/api/session", (_body, response) => response.status === 401],
];

let failed = false;
for (const [label, path, predicate] of checks) {
  try {
    const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: "application/json" } });
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { /* only status is relevant for non-JSON responses */ }
    if (!predicate(body, response)) {
      failed = true;
      console.error(`✖ ${label}: resposta inesperada (${response.status})`);
      continue;
    }
    console.log(`✔ ${label}`);
  } catch (error) {
    failed = true;
    console.error(`✖ ${label}: ${(error instanceof Error ? error.message : String(error))}`);
  }
}

if (failed) process.exit(1);
console.log("Smoke test de produção aprovado.");
