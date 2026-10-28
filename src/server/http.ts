import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { userDatabase } from "./supabase.ts";
export interface Identity { uid: string; email: string; name: string; admin: boolean }
export interface AuthRequest extends Request { user: Identity; db: SupabaseClient }
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export function checked<T>(result: { data: T; error: any }): NonNullable<T> {
  if (result.error) {
    const code=result.error.code;
    const status=code==="42501"?403:code==="P0002"?404:code==="23505"?409:["23514","22023","22P02"].includes(code)?400:code==="P0001"?409:503;
    throw new HttpError(status,status===503?"Serviço indisponível. Tente novamente.":result.error.message);
  }
  return result.data as NonNullable<T>;
}
export const asyncRoute=(fn:(req:AuthRequest,res:Response)=>Promise<unknown>):RequestHandler=>(req,res,next)=> { Promise.resolve(fn(req as AuthRequest,res)).catch(next); };
export const requireAuth:RequestHandler=async(req,res,next)=> {
  const match=/^Bearer (\S+)$/.exec(req.headers.authorization||"");
  if(!match) { res.status(401).json({error:"Entre com sua conta Google."}); return; }
  try {
    const db=userDatabase(match[1]);
    const {data,error}=await db.auth.getUser(match[1]);
    if(error||!data.user) { res.status(401).json({error:"Sessão inválida. Entre novamente."}); return; }
    const admin=checked(await db.rpc("is_admin"));
    Object.assign(req,{db,user:{uid:data.user.id,email:data.user.email||"",name:String(data.user.user_metadata?.full_name||"").slice(0,100),admin:admin===true}}); next();
  } catch(error) { next(error); }
};
export const requireAdmin:RequestHandler=(req,res,next)=> {
  if((req as AuthRequest).user?.admin!==true) { res.status(403).json({error:"Acesso restrito ao administrador."}); return; } next();
};
export function handleError(error:unknown,_req:Request,res:Response,_next:NextFunction) {
  if(res.headersSent)return;
  if(error instanceof ZodError) {res.status(400).json({error:"Dados inválidos.",details:error.issues.map(i=>({path:i.path.join("."),message:i.message}))});return;}
  if(error instanceof HttpError){res.status(error.status).json({error:error.message});return;}
  if((error as any)?.type==="entity.too.large"){res.status(413).json({error:"Dados acima do limite permitido."});return;}
  console.error("API operation failed",error);res.status(503).json({error:"Serviço indisponível. Tente novamente; a operação não foi confirmada."});
}
