import { createClient } from "@supabase/supabase-js";
import { config } from "./config.ts";
export function userDatabase(token: string) {
  if (!config.publishableKey) throw new Error("Configure SUPABASE_PUBLISHABLE_KEY.");
  return createClient(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
export function serviceDatabase() {
  if (!config.secretKey) throw new Error("Configure SUPABASE_SECRET_KEY somente no servidor.");
  return createClient(config.url, config.secretKey, {auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }});
}
