import React, {useEffect,useState} from "react";
import type {DigitalProduct} from "../utils/ecosystem";
import {materialLink} from "../lib/api";
 export function PdfReaderModal({product,onClose}:{product:DigitalProduct;onClose:()=>void}){
 const [url,setUrl]=useState("");const [error,setError]=useState("");const [attempt,setAttempt]=useState(0);const [status,setStatus]=useState<"loading"|"ready"|"error">("loading");
 useEffect(()=>{let active=true;setUrl("");setError("");setStatus("loading");materialLink(product.id).then(link=>{if(active){setUrl(link);setStatus("ready");}}).catch(e=>{if(active){setError(e instanceof Error ? e.message : "Não foi possível confirmar o acesso.");setStatus("error");}});return()=>{active=false;};},[product.id,attempt]);
 return <div role="dialog" aria-modal="true" aria-label={product.title} className="fixed inset-0 z-50 bg-slate-950/80 p-6 flex items-center justify-center">
  <div className="bg-white rounded-2xl p-8 max-w-lg space-y-5"><h2 className="text-2xl font-bold">{product.title}</h2>
  {status === "error" ? <div role="alert" className="rounded-xl bg-red-50 text-red-800 p-3 space-y-2"><p>{error}</p><button className="underline font-semibold" onClick={()=>setAttempt(a=>a+1)}>Tentar novamente</button></div> : status === "ready" && url ? <><p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3">Acesso confirmado. O material será aberto na nuvem externa.</p><a aria-label={`Abrir material ${product.title}`} className="block bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl text-center font-bold" href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Abrir material</a></> : <p role="status" className="rounded-xl bg-slate-50 text-slate-700 p-3">Conferindo seu direito de acesso…</p>}
  <button autoFocus onClick={onClose}>Fechar</button></div>
 </div>;
}
