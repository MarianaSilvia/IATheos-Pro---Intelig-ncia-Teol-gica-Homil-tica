import { authClient } from "./supabase";
export async function api<T=any>(path:string,options:RequestInit={}):Promise<T>{
 const client=authClient();const {data,error}=await client.auth.getSession();
 if(error||!data.session)throw new Error("Entre com sua conta Google.");
 const uid=data.session.user.id;
 const headers=new Headers(options.headers);headers.set("Authorization",`Bearer ${data.session.access_token}`);
 if(options.body&&!headers.has("Content-Type"))headers.set("Content-Type","application/json");
 const response=await fetch(`/api${path}`,{...options,headers,signal:options.signal||AbortSignal.timeout(30000)});
 if((await client.auth.getSession()).data.session?.user.id!==uid)throw new Error("A conta foi alterada. Tente novamente.");
 if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||`Falha na solicitação (${response.status}).`);}
 return response.json();
}
export async function materialLink(id:string):Promise<string>{return (await api<{url:string}>(`/products/${encodeURIComponent(id)}/link`)).url;}
