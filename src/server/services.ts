import type { SupabaseClient } from "@supabase/supabase-js";
import { hasActiveSubscription, type Subscription } from "../shared/contracts.ts";
import { checked, HttpError, type Identity } from "./http.ts";
export function subscriptionData(row:any):Subscription|null { return row?{status:row.status,expiresAt:row.expires_at}:null; }
export async function subscriptionFor(db:SupabaseClient,uid:string) {return subscriptionData(checked(await db.from("subscriptions").select("status,expires_at").eq("user_id",uid).maybeSingle()));}
export async function sessionFor(db:SupabaseClient,user:Identity) {
  const [subscription,profile]=await Promise.all([subscriptionFor(db,user.uid),db.from("profiles").select("display_name").eq("user_id",user.uid).maybeSingle().then(checked)]);
  return {uid:user.uid,email:user.email,displayName:profile?.display_name||user.name||user.email,isAdmin:user.admin,isProSubscriber:user.admin||hasActiveSubscription(subscription),passwordInitialized:user.passwordInitialized,subscription};
}
export async function requirePro(db:SupabaseClient,user:Identity) {
  if(!user.admin&&!hasActiveSubscription(await subscriptionFor(db,user.uid)))throw new HttpError(403,"Seu acesso está inativo. Solicite a liberação ao administrador.");
}
export async function takeAiSlot(db:SupabaseClient) {
  const result=await db.rpc("take_ai_slot");
  if(result.error?.message==="Limite de 5 consultas por minuto.")throw new HttpError(429,result.error.message);
  checked(result);
}
