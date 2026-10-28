import fs from 'node:fs';
const put=(p,s)=>fs.writeFileSync(p,s);
const edit=(p,fn)=>put(p,fn(fs.readFileSync(p,'utf8')));
edit('src/shared/contracts.ts',s=>s.replace('export const idSchema',`export const externalLinkSchema = z.url().max(4096).refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && !["localhost","127.0.0.1","[::1]"].includes(url.hostname);
}, "Use um link HTTPS externo, sem usuário ou senha.");
export const idSchema`));
edit('src/server/ai.ts',s=>s.replace('requirePro, takeAiSlot, stamp','requirePro, takeAiSlot').replace('import { firestore } from "./firebase.ts";','import { serviceDatabase } from "./supabase.ts";\nimport { checked } from "./http.ts";').replace('await requirePro(req.user);','await requirePro(req.db, req.user);').replace('await takeAiSlot(req.user.uid);','if (!config.secretKey) throw new HttpError(503, "Configure a chave privada do servidor para registrar gerações reais.");\n      await takeAiSlot(req.db);').replace(/await firestore\s*\.collection\(`users\/\$\{req.user.uid\}\/events`\)\s*\.add\(\{ type: chat \? "chat" : type, createdAt: stamp\(\) \}\);/,'checked(await serviceDatabase().from("generation_events").insert({user_id:req.user.uid,type:chat?"chat":type}));'));
edit('server.ts',s=>s.replace('IATheos Pro:','QI Store Pro:').replace('Firebase ${config.local ? "emulators" : "remote"}','Supabase ${config.local ? "local" : "remoto"}'));
edit('src/utils/ecosystem.ts',s=>s.replace('hasFile?: boolean;','hasLink?: boolean;'));
edit('src/components/StoreView.tsx',s=>s.replaceAll('p.hasFile','p.hasLink').replace('Ler / baixar PDF','Acessar download').replace('A cobrança está desativada. Materiais pagos podem ser concedidos pelo','Os arquivos ficam em uma nuvem externa. A cobrança está desativada; o acesso pode ser concedido pelo'));
edit('src/components/AdminPanelView.tsx',s=>{
 s=s.replace('const [file, setFile] = useState<File | null>(null);','const [downloadUrl, setDownloadUrl] = useState("");');
 s=s.replace('setFile(null);','setDownloadUrl("");');
 s=s.replace('const edit = (p: DigitalProduct) => {','const edit = (p: DigitalProduct) => void run(async () => {');
 const start=s.indexOf('  const save = async () => {');const end=s.indexOf('  return (',start);
 s=s.slice(0,start)+`  const save = async () => {
    const payload={...form,downloadUrl};
    await api(editId?"/products/"+editId:"/products",{method:editId?"PATCH":"POST",body:JSON.stringify(payload)});
    await onRefresh();setEditId("");setForm(blank);setDownloadUrl("");
  };
`+s.slice(end);
 s=s.replace('  };\n  const save =',`    const data=await api<{url:string}>("/admin/products/"+p.id+"/link");
    setDownloadUrl(data.url);
  });
  const save =`);
 s=s.replaceAll('p.hasFile','p.hasLink').replaceAll('PDF anexado','Link cadastrado').replaceAll('Sem PDF','Sem link');
 s=s.replace(/PDF \(até 25 MB\)[\s\S]*?<\/label>/,`Link HTTPS de download (nuvem externa)
          <input className="block border p-3 w-full" type="url" required maxLength={4096} value={downloadUrl} onChange={e=>setDownloadUrl(e.target.value)} />
        </label>`);
 return s;
});
put('src/components/PdfReaderModal.tsx',`import React, {useEffect,useState} from "react";
import type {DigitalProduct} from "../utils/ecosystem";
import {materialLink} from "../lib/api";
export function PdfReaderModal({product,onClose}:{product:DigitalProduct;onClose:()=>void}){
 const [url,setUrl]=useState("");const [error,setError]=useState("");const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setUrl("");setError("");materialLink(product.id).then(link=>{if(active)setUrl(link);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[product.id,attempt]);
 return <div role="dialog" aria-modal="true" aria-label={product.title} className="fixed inset-0 z-50 bg-slate-950/80 p-6 flex items-center justify-center">
  <div className="bg-white rounded-2xl p-8 max-w-lg space-y-5"><h2 className="text-2xl font-bold">{product.title}</h2>
  {error?<p role="alert">{error} <button onClick={()=>setAttempt(a=>a+1)}>Tentar novamente</button></p>:url?<><p>Seu acesso foi confirmado. O download será aberto na nuvem externa.</p><a className="block bg-amber-600 text-white p-3 rounded-xl text-center" href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Abrir link de download</a></>:<p role="status">Conferindo acesso…</p>}
  <button autoFocus onClick={onClose}>Fechar</button></div>
 </div>;
}
`);
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.name='qi-store-pro';delete pkg.overrides;
for(const k of ['firebase','firebase-admin'])delete pkg.dependencies[k];
for(const k of ['firebase-tools','@firebase/rules-unit-testing'])delete pkg.devDependencies[k];
pkg.dependencies['@supabase/supabase-js']='2.118.0';
for(const k of ['firebase:sync','firebase:check','emulators','test:emulators'])delete pkg.scripts[k];
pkg.scripts['test:integration']='tsx --test tests/integration/api.test.ts';pkg.scripts['supabase:start']='supabase start';pkg.scripts['supabase:stop']='supabase stop';pkg.scripts['supabase:test']='supabase test db';
put('package.json',JSON.stringify(pkg,null,2)+'\n');
const obsolete=['src/server/firebase.ts','src/lib/firebase.ts','scripts/emulators.mjs','scripts/sync-firebase.mjs','tests/integration/firebase.test.ts','tests/browser/session.html','firebase.json','firebase.remote.json','firestore.rules','storage.rules','firestore.indexes.json','firestore.remote.indexes.json','firebase-applet-config.json','.firebaserc'];
for(const p of obsolete){if(fs.existsSync(p))fs.unlinkSync(p);}
