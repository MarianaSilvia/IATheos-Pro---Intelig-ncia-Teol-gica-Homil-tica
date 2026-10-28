import "dotenv/config";
const url = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
const parsed = new URL(url);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
if (!local && (process.env.ALLOW_REMOTE_SUPABASE !== "true" || parsed.hostname !== "idrumlpdobiackcnhdas.supabase.co")) throw new Error("Supabase remoto não autorizado ou destino diferente de QI Store Pro.");
export const config = {
  local, url, publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "", secretKey: process.env.SUPABASE_SECRET_KEY || "",
  port: Number(process.env.PORT || 3000), host: process.env.HOST || (local ? "127.0.0.1" : "0.0.0.0"), model: process.env.GEMINI_MODEL || "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY,
  infinitePayApiKey: process.env.INFINITEPAY_API_KEY,
  infinitePayHandle: process.env.INFINITEPAY_HANDLE,
  infinitePayWebhookSecret: process.env.INFINITEPAY_WEBHOOK_SECRET,
  publicUrl: process.env.PUBLIC_URL || "http://localhost:3000",
};
