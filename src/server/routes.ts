import { Router } from "express";
import { z } from "zod";
import { asyncRoute, requireAuth, requireAdmin, HttpError, checked } from "./http.ts";
import { sessionFor, subscriptionData } from "./services.ts";
import { generatedSchemas, idSchema, noteSchema, productSchema, studyType, subscriptionActionSchema, externalLinkSchema } from "../shared/contracts.ts";
import { BIBLE_BOOKS } from "../utils/bibleProgress.ts";
import { serviceDatabase } from "./supabase.ts";
import { config } from "./config.ts";
import crypto from "node:crypto";
const router=Router();
const phoneSchema=z.string().trim().transform((value)=>value.replace(/\D/g,"")).refine((value)=>/^(?:55)?[1-9][0-9]{9,10}$/.test(value),"Informe um celular válido com DDD.").transform((value)=>value.startsWith("55")?value:`55${value}`);
router.post("/webhooks/payment",(_req,res)=>{res.status(410).json({error:"Use o webhook oficial da InfinitePay."});});
router.get("/health",(_req,res)=>{res.json({status:"ok",backend:"supabase",paymentsEnabled:Boolean(config.infinitePayApiKey),delivery:"external-link"});});
router.get("/public/products",asyncRoute(async(_req,res)=>{
 const db=serviceDatabase(); const rows=checked(await db.from("products").select("id,details,archived,has_link").eq("archived",false).eq("has_link",true));
 res.json(rows.map((p:any)=>({id:p.id,...p.details,archived:false,hasLink:true})));
}));
router.get("/public/subscription-plans",asyncRoute(async(_req,res)=>{
 const db=serviceDatabase(); const rows=checked(await db.from("subscription_plans").select("id,name,amount_cents,duration_days,checkout_url").eq("active",true).order("duration_days"));
 res.json(rows.map((p:any)=>({id:p.id,name:p.name,price:p.amount_cents/100,durationDays:p.duration_days,checkoutUrl:p.checkout_url||null})));
}));
router.post("/purchase-interest",asyncRoute(async(req,res)=>{
 const data=z.object({email:z.string().trim().toLowerCase().email().max(320),productId:idSchema,consent:z.literal(true)}).strict().parse(req.body);
 if(!config.infinitePayApiKey||!config.infinitePayHandle) throw new HttpError(503,"Checkout ainda não configurado. Tente novamente mais tarde.");
 const db=serviceDatabase();
 const product=checked(await db.from("products").select("id,details,archived,has_link").eq("id",data.productId).maybeSingle());
 if(!product||product.archived||!product.has_link) throw new HttpError(404,"Material indisponível.");
 const price=Number(product.details?.price); if(!Number.isFinite(price)||price<=0) throw new HttpError(400,"Este material não requer pagamento.");
 const lead=checked(await db.from("interest_leads").insert({email:data.email,product_id:data.productId,consent:true}).select("id").single());
 const order=checked(await db.from("payment_orders").insert({product_id:data.productId,lead_id:lead.id,amount_cents:Math.round(price*100),currency:"BRL",provider:"infinitepay"}).select("id").single());
 const payload={handle:config.infinitePayHandle,order_nsu:order.id,items:[{description:String(product.details?.title||"Material IATheos Pro"),quantity:1,price:Math.round(price*100)}],webhook_url:`${config.publicUrl}/api/webhooks/infinitepay`,redirect_url:`${config.publicUrl}/?order=${order.id}`};
 const response=await fetch("https://api.checkout.infinitepay.io/links",{method:"POST",headers:{"X-Api-Key":config.infinitePayApiKey,"Content-Type":"application/json"},body:JSON.stringify(payload)});
 if(!response.ok) throw new HttpError(503,"Não foi possível criar o checkout.");
 const result:any=await response.json(); const checkoutUrl=String(result.url||result.link||result.checkout_url||"");
 if(!checkoutUrl.startsWith("https://")) throw new HttpError(503,"Resposta inválida do checkout.");
 checked(await db.from("payment_orders").update({checkout_url:checkoutUrl}).eq("id",order.id));
 res.status(201).json({orderId:order.id,checkoutUrl});
}));
router.post("/subscription-interest",asyncRoute(async(req,res)=>{
 const data=z.object({email:z.string().trim().toLowerCase().email().max(320),phone:phoneSchema,planId:idSchema,consent:z.literal(true)}).strict().parse(req.body);
 const db=serviceDatabase();
 const plan=checked(await db.from("subscription_plans").select("id,name,amount_cents,duration_days,checkout_url").eq("id",data.planId).eq("active",true).maybeSingle());
 if(!plan) throw new HttpError(404,"Plano indisponível.");
 const apiKey=config.infinitePayApiKey; const handle=config.infinitePayHandle;
 if(!plan.checkout_url && (!apiKey || !handle)) throw new HttpError(503,"Checkout ainda não configurado. Tente novamente mais tarde.");
 const lead=checked(await db.from("interest_leads").insert({email:data.email,phone_e164:data.phone,plan_id:data.planId,consent:true}).select("id").single());
 const order=checked(await db.from("payment_orders").insert({lead_id:lead.id,plan_id:data.planId,order_kind:"subscription",amount_cents:plan.amount_cents,currency:"BRL",provider:"infinitepay"}).select("id").single());
 let checkoutUrl=String(plan.checkout_url||"");
 if(!checkoutUrl){
  const payload={handle:handle!,order_nsu:order.id,items:[{description:String(plan.name),quantity:1,price:plan.amount_cents}],webhook_url:`${config.publicUrl}/api/webhooks/infinitepay`,redirect_url:`${config.publicUrl}/?order=${order.id}`};
  const response=await fetch("https://api.checkout.infinitepay.io/links",{method:"POST",headers:{"X-Api-Key":apiKey!,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!response.ok) throw new HttpError(503,"Não foi possível criar o checkout.");
  const result:any=await response.json(); checkoutUrl=String(result.url||result.link||result.checkout_url||"");
 }
 if(!checkoutUrl.startsWith("https://")) throw new HttpError(503,"Resposta inválida do checkout.");
 checked(await db.from("payment_orders").update({checkout_url:checkoutUrl}).eq("id",order.id));
 res.status(201).json({orderId:order.id,checkoutUrl});
}));
router.post("/webhooks/infinitepay",asyncRoute(async(req,res)=>{
 if(!config.infinitePayWebhookSecret){res.status(503).json({error:"Webhook não configurado."});return;}
 const supplied=String(req.header("x-infinitepay-signature")||"");
 const expected=crypto.createHmac("sha256",config.infinitePayWebhookSecret).update((req as any).rawBody||"").digest("hex");
 if(!supplied||supplied.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))){res.status(401).json({error:"Webhook não autorizado."});return;}
 const data=z.object({order_nsu:z.string().uuid(),transaction_nsu:z.string().min(1).max(200),amount:z.coerce.number().int().nonnegative(),paid_amount:z.coerce.number().int().nonnegative().optional(),status:z.string().optional()}).passthrough().parse(req.body);
 if(data.status === "refunded") { const db=serviceDatabase(); checked(await db.rpc("mark_payment_refunded",{p_provider:"infinitepay",p_payment_id:data.transaction_nsu})); res.status(200).json({ok:true}); return; }
 if(data.status&&!["paid","settled"].includes(data.status)){res.status(200).json({ok:true,ignored:true});return;}
 const db=serviceDatabase();
 checked(await db.rpc("complete_verified_payment",{p_order_id:data.order_nsu,p_provider:"infinitepay",p_payment_id:data.transaction_nsu,p_amount_cents:data.paid_amount??data.amount}));
 res.status(200).json({ok:true});
}));
router.use(requireAuth);
router.get("/session",asyncRoute(async(req,res)=>{res.json(await sessionFor(req.db,req.user));}));
router.post("/users/sync",asyncRoute(async(req,res)=>{checked(await req.db.rpc("sync_profile"));res.json(await sessionFor(req.db,req.user));}));
router.patch("/profile",asyncRoute(async(req,res)=>{
 const data=z.object({displayName:z.string().trim().min(1).max(100)}).strict().parse(req.body);
 checked(await req.db.from("profiles").update({display_name:data.displayName}).eq("user_id",req.user.uid));res.json(data);
}));
router.get("/products",asyncRoute(async(req,res)=>{
 const items=checked(await req.db.from("products").select("*"));
 const grants=checked(await req.db.from("entitlements").select("product_id").eq("user_id",req.user.uid));
 const owned=new Set(grants.map(g=>g.product_id));
 res.json(items.map(p=>({id:p.id,...p.details,archived:p.archived,hasLink:p.has_link,owned:owned.has(p.id)})));
}));
router.get("/products/:id/link",asyncRoute(async(req,res)=>{
 const url=checked(await req.db.rpc("redeem_material",{p_product_id:idSchema.parse(req.params.id)}));
 res.set("Cache-Control","private, no-store").json({url:externalLinkSchema.parse(url)});
}));
router.post("/products",requireAdmin,asyncRoute(async(req,res)=>{
 const {downloadUrl,...input}=productSchema.extend({downloadUrl:externalLinkSchema}).parse(req.body);
 const id=checked(await req.db.rpc("save_product",{p_id:null,p_details:input,p_url:downloadUrl}));res.status(201).json({id});
}));
router.get("/admin/products/:id/link",requireAdmin,asyncRoute(async(req,res)=>{
 const url=checked(await req.db.rpc("redeem_material",{p_product_id:idSchema.parse(req.params.id)}));res.set("Cache-Control","private, no-store").json({url});
}));
router.post("/admin/product-cover",requireAdmin,asyncRoute(async(req,res)=>{
 const data=z.object({filename:z.string().trim().min(1).max(120),mimeType:z.enum(["image/png","image/jpeg","image/webp"]),data:z.string().regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/)}).strict().parse(req.body);
 const [,encoded]=data.data.split(",",2); const buffer=Buffer.from(encoded,"base64");
 if(buffer.length===0||buffer.length>2*1024*1024) throw new HttpError(400,"A capa deve ter no máximo 2 MB.");
 const valid=(data.mimeType==="image/png"&&buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(data.mimeType==="image/jpeg"&&buffer.subarray(0,3).equals(Buffer.from([255,216,255])))||(data.mimeType==="image/webp"&&buffer.subarray(0,4).toString()==="RIFF"&&buffer.subarray(8,12).toString()==="WEBP");
 if(!valid) throw new HttpError(400,"Arquivo de imagem inválido.");
 const extension=data.mimeType==="image/png"?"png":data.mimeType==="image/webp"?"webp":"jpg";
 const path=`${req.user.uid}/${crypto.randomUUID()}.${extension}`;
 const db=serviceDatabase(); const uploaded=await db.storage.from("product-covers").upload(path,buffer,{contentType:data.mimeType,cacheControl:"31536000",upsert:false});
 if(uploaded.error) throw new HttpError(502,"Não foi possível armazenar a capa.");
 const publicUrl=db.storage.from("product-covers").getPublicUrl(path).data.publicUrl;
 res.status(201).json({url:publicUrl});
}));
router.patch("/products/:id",requireAdmin,asyncRoute(async(req,res)=>{
 const {downloadUrl,...details}=productSchema.partial().extend({downloadUrl:externalLinkSchema.optional()}).strict().parse(req.body);
 checked(await req.db.rpc("save_product",{p_id:idSchema.parse(req.params.id),p_details:details,p_url:downloadUrl??null}));res.json({ok:true});
}));
router.get("/studies",asyncRoute(async(req,res)=>{
 const rows=checked(await req.db.from("studies").select("*").eq("user_id",req.user.uid).order("updated_at",{ascending:false}));
 res.json(rows.map(r=>({id:r.id,type:r.type,title:r.title,reference:r.reference,data:r.content,updatedAt:r.updated_at,savedAt:r.updated_at})));
}));
router.put("/studies/:id",asyncRoute(async(req,res)=>{
 const id=idSchema.parse(req.params.id);const input=z.object({type:studyType,data:z.unknown()}).strict().parse(req.body);
 const data:any=generatedSchemas[input.type].extend({id:idSchema,createdAt:z.iso.datetime()}).parse(input.data);
 if(data.id!==id||Buffer.byteLength(JSON.stringify(data))>200000)throw new HttpError(400,"Identificador incompatível ou estudo acima do limite.");
 checked(await req.db.from("studies").upsert({user_id:req.user.uid,id,type:input.type,title:data.title||`Raio-X: ${data.verseReference}`,reference:data.biblicalText||data.verseReference,content:data},{onConflict:"user_id,id"}));res.json({ok:true});
}));
router.delete("/studies/:id",asyncRoute(async(req,res)=>{checked(await req.db.from("studies").delete().eq("user_id",req.user.uid).eq("id",idSchema.parse(req.params.id)));res.json({ok:true});}));
router.get("/notes",asyncRoute(async(req,res)=>{
 const rows=checked(await req.db.from("notes").select("*").eq("user_id",req.user.uid).order("updated_at",{ascending:false}));
 res.json(rows.map(r=>({id:r.id,title:r.title,biblicalReference:r.biblical_reference,content:r.content,updatedAt:r.updated_at})));
}));
router.put("/notes/:id",asyncRoute(async(req,res)=>{
 const data=noteSchema.parse(req.body);checked(await req.db.from("notes").upsert({user_id:req.user.uid,id:idSchema.parse(req.params.id),title:data.title,biblical_reference:data.biblicalReference,content:data.content},{onConflict:"user_id,id"}));res.json({ok:true});
}));
router.delete("/notes/:id",asyncRoute(async(req,res)=>{checked(await req.db.from("notes").delete().eq("user_id",req.user.uid).eq("id",idSchema.parse(req.params.id)));res.json({ok:true});}));
router.get("/reading",asyncRoute(async(req,res)=>{const rows=checked(await req.db.from("reading").select("chapter_key").eq("user_id",req.user.uid));res.json(rows.map(r=>r.chapter_key));}));
router.put("/reading/:key",asyncRoute(async(req,res)=>{
 const key=z.string().regex(/^[a-z0-9]+:[0-9]{1,3}$/).parse(req.params.key);const [bookId,chapter]=key.split(":");
 if(!BIBLE_BOOKS.some(b=>b.id===bookId&&Number(chapter)>=1&&Number(chapter)<=b.chaptersCount))throw new HttpError(400,"Capítulo inválido.");
 const {completed}=z.object({completed:z.boolean()}).strict().parse(req.body);
 checked(completed?await req.db.from("reading").upsert({user_id:req.user.uid,chapter_key:key},{onConflict:"user_id,chapter_key"}):await req.db.from("reading").delete().eq("user_id",req.user.uid).eq("chapter_key",key));res.json({ok:true});
}));
router.get("/activity",asyncRoute(async(req,res)=>{
 const rows=checked(await req.db.from("generation_events").select("type,created_at").eq("user_id",req.user.uid).gte("created_at",new Date(Date.now()-7*86400000).toISOString()));res.json(rows.map(r=>({type:r.type,createdAt:r.created_at})));
}));
router.get("/admin/users",requireAdmin,asyncRoute(async(req,res)=>{
 const page=z.coerce.number().int().min(0).max(100000).parse(req.query.pageToken||0);
 const rows=checked(await req.db.from("profiles").select("user_id,email,display_name").order("user_id").range(page,page+99));
 const subs=checked(await req.db.from("subscriptions").select("*"));res.json({users:rows.map(u=>({uid:u.user_id,email:u.email,displayName:u.display_name,subscription:subscriptionData(subs.find(s=>s.user_id===u.user_id))})),pageToken:rows.length===100?String(page+100):null});
}));
router.get("/admin/orders",requireAdmin,asyncRoute(async(req,res)=>{
 const orders=checked(await req.db.from("payment_orders").select("id,user_id,product_id,plan_id,order_kind,amount_cents,currency,status,provider,provider_payment_id,created_at,paid_at,refunded_at,lead_id").order("created_at",{ascending:false}).limit(200));
 const leadIds=orders.map((o:any)=>o.lead_id).filter(Boolean); const leads=leadIds.length?checked(await req.db.from("interest_leads").select("id,email,phone_e164").in("id",leadIds)):[];
 const leadMap=new Map((leads as any[]).map((l)=>[l.id,l])); res.json((orders as any[]).map((o)=>({...o,email:leadMap.get(o.lead_id)?.email||null,phone:leadMap.get(o.lead_id)?.phone_e164||null})));
}));
router.post("/admin/subscriptions/:uid",requireAdmin,asyncRoute(async(req,res)=>{
 const data=subscriptionActionSchema.parse(req.body);checked(await req.db.rpc("change_subscription",{p_user_id:z.uuid().parse(req.params.uid),p_action:data.action,p_reason:data.reason}));res.json({ok:true});
}));
router.post("/admin/entitlements",requireAdmin,asyncRoute(async(req,res)=>{
 const data=z.object({uid:z.uuid(),productId:idSchema,reason:z.string().trim().min(1).max(1000)}).strict().parse(req.body);
 checked(await req.db.rpc("grant_material",{p_user_id:data.uid,p_product_id:data.productId,p_reason:data.reason}));res.json({ok:true});
}));
router.get("/admin/audit",requireAdmin,asyncRoute(async(req,res)=>{
 const rows=checked(await req.db.from("admin_audit").select("*").order("created_at",{ascending:false}).limit(100));res.json(rows.map(r=>({id:r.id,actorUid:r.actor_uid,targetUid:r.target_uid,productId:r.product_id,action:r.action,reason:r.reason,createdAt:r.created_at})));
}));
export default router;
