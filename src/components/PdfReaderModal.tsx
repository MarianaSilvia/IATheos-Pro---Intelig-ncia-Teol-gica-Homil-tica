import React, {useEffect,useState} from "react";
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
