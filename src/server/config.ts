import "dotenv/config";
export function resolveHost(nodeEnv: string | undefined, configuredHost: string | undefined): string {
  return configuredHost || (nodeEnv === "production" ? "0.0.0.0" : "127.0.0.1");
}
export function resolvePublicUrl(configuredUrl: string | undefined, vercelUrl: string | undefined, fallback: string): string {
  const candidate = configuredUrl?.trim() || (vercelUrl?.trim() ? `https://${vercelUrl.trim()}` : fallback);
  return candidate.replace(/\/$/, "");
}
const url = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
const parsed = new URL(url);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
if (!local && (process.env.ALLOW_REMOTE_SUPABASE !== "true" || parsed.hostname !== "idrumlpdobiackcnhdas.supabase.co")) throw new Error("Supabase remoto não autorizado ou destino diferente de QI Store Pro.");
export const config = {
  local, url, publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "", secretKey: process.env.SUPABASE_SECRET_KEY || "",
  port: Number(process.env.PORT || 3000),
  // Keep local development on loopback while production hosts bind all interfaces.
  // HOST remains configurable for platforms that provide their own binding.
  host: resolveHost(process.env.NODE_ENV, process.env.HOST),
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY,
  infinitePayApiKey: process.env.INFINITEPAY_API_KEY,
  infinitePayHandle: process.env.INFINITEPAY_HANDLE,
  infinitePayWebhookSecret: process.env.INFINITEPAY_WEBHOOK_SECRET,
  // PUBLIC_URL is authoritative when configured. Vercel supplies VERCEL_URL
  // automatically, which prevents auth/payment links from falling back to
  // localhost when a deployment was created without an explicit domain.
  publicUrl: resolvePublicUrl(process.env.PUBLIC_URL, process.env.VERCEL_URL, "http://localhost:3000"),
};
