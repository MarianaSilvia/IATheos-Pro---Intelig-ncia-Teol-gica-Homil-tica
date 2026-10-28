import { Router } from "express";
import { z } from "zod";
import { asyncRoute, requireAuth, requireAdmin, HttpError, checked } from "./http.ts";
import { sessionFor, subscriptionData } from "./services.ts";
import { generatedSchemas, idSchema, noteSchema, productSchema, studyType, subscriptionActionSchema, externalLinkSchema } from "../shared/contracts.ts";
import { BIBLE_BOOKS } from "../utils/bibleProgress.ts";
const router=Router();
router.post("/webhooks/payment",(_req,res)=>{res.status(410).json({error:"Cobrança desativada. Nenhum acesso foi concedido."});});
router.get("/health",(_req,res)=>{res.json({status:"ok",backend:"supabase",paymentsEnabled:false,delivery:"external-link"});});
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
