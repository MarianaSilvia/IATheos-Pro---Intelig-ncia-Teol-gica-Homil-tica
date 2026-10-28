import {test} from "node:test";
import assert from "node:assert/strict";
import {createApp} from "../../src/server/app.ts";
import {externalLinkSchema} from "../../src/shared/contracts.ts";
import {parseAiResult} from "../../src/server/ai.ts";
import {checked,HttpError} from "../../src/server/http.ts";
test("public endpoints report Supabase and no request can simulate a purchase",async()=>{
 const server=createApp().listen(0,"127.0.0.1");await new Promise<void>(r=>server.once("listening",r));
 const address=server.address() as {port:number};const url=`http://127.0.0.1:${address.port}`;
 try{
  const health=await fetch(url+"/api/health").then(r=>r.json());assert.equal(health.backend,"supabase");assert.equal(health.paymentsEnabled,false);assert.equal(health.delivery,"external-link");
  for(const path of ["/session","/notes","/studies","/reading","/products","/products/example/link","/admin/users"]){assert.equal((await fetch(url+"/api"+path)).status,401,path);}
  assert.equal((await fetch(url+"/api/webhooks/payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"paid",uid:"attacker",productId:"anything"})})).status,410);
 }finally{await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
test("external links reject executable schemes and embedded credentials",()=>{
 for(const value of ["javascript:alert(1)","http://files.example.org/a.pdf","https://user:password@files.example.org/a.pdf","https://localhost/a.pdf","https://127.0.0.1/a.pdf"]){assert.equal(externalLinkSchema.safeParse(value).success,false,value);}
 assert.equal(externalLinkSchema.parse("https://files.example.org/download?id=123"),"https://files.example.org/download?id=123");
});
test("malformed Gemini and failed DB writes remain recoverable errors",()=>{
 assert.throws(()=>parseAiResult("sermon","{}"),e=>e instanceof HttpError&&e.status===502);
 assert.throws(()=>parseAiResult("xray",""),e=>e instanceof HttpError&&e.status===502);
 assert.throws(()=>checked({data:null,error:{code:"42501",message:"Denied"}}),e=>e instanceof HttpError&&e.status===403);
 assert.throws(()=>checked({data:null,error:{code:"08006",message:"private connection detail"}}),e=>e instanceof HttpError&&e.status===503&&!e.message.includes("private"));
});
