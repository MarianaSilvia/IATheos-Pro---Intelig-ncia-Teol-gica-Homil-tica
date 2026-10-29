import { useEffect, useRef, useState } from "react";
import { supabase, authClient } from "../lib/supabase";
import { api } from "../lib/api";
import type { Session } from "../shared/contracts";
export function useSession(){
 const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [signingIn,setSigningIn]=useState(false);
 const version=useRef(0);const identity=useRef<string|null>(null);const loginInFlight=useRef(false);
 async function refresh(){
  const seq=++version.current;setError("");
  try{
   const client=authClient();const {data,error:authError}=await client.auth.getSession();if(authError)throw authError;
   const uid=data.session?.user.id||null;
   if(identity.current!==uid){setSession(null);setLoading(true);identity.current=uid;}
   if(!uid){setSession(null);return;}
   const result=await api<Session>("/users/sync",{method:"POST"});if(seq===version.current)setSession(result);
  }catch(e){if(seq===version.current){setSession(null);setError((e as Error).message);}}
  finally{if(seq===version.current)setLoading(false);}
 }
 useEffect(()=>{
  if(!supabase){void refresh();return;}
  // Do not await other auth methods inside the SDK's auth-state lock.
  const {data}=supabase.auth.onAuthStateChange((_event,current)=>{
   const uid=current?.user.id||null;if(identity.current!==uid){version.current++;identity.current=uid;setSession(null);setLoading(!!uid);}
   setTimeout(()=>{void refresh();},0);
  });
  return()=>{version.current++;data.subscription.unsubscribe();};
 },[]);
 const runAuth=async (work:()=>Promise<{error:any}>)=>{if(loginInFlight.current)return false;loginInFlight.current=true;setSigningIn(true);setError("");try{const {error}=await work();if(error)throw error;return true;}catch(e){const message=(e as Error).message;setError(message);throw new Error(message);}finally{loginInFlight.current=false;setSigningIn(false);}};
 const magicLinkRedirect = () => {
  // In production always return to the origin that issued the request. This
  // prevents a stale VITE_PUBLIC_APP_URL (for example localhost) from making
  // the confirmation link land outside the deployed application.
  if (import.meta.env.PROD) return window.location.origin;
  return import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;
 };
 return {session,loading,error,signingIn,refresh,
  loginAdmin:async(email:string,password:string)=>runAuth(()=>authClient().auth.signInWithPassword({email,password})),
  loginBuyer:async(email:string,password:string)=>runAuth(()=>authClient().auth.signInWithPassword({email,password})),
  setBuyerPassword:async(password:string)=>{const client=authClient();const {data,error}=await client.auth.updateUser({password,data:{...( (await client.auth.getUser()).data.user?.user_metadata||{}),password_initialized:true}});if(error)throw error;if(!data.user)throw new Error("Sessão não encontrada.");await refresh();},
  requestMagicLink:async(email:string)=>runAuth(()=>authClient().auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:magicLinkRedirect()}})),
  logout:async()=>{version.current++;setSession(null);identity.current=null;try{const {error}=await authClient().auth.signOut();if(error)throw error;}catch(e){setError((e as Error).message);}}
 };
}
