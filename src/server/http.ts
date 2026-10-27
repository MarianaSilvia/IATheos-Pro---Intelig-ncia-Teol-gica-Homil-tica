import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { ZodError } from "zod";
import { adminAuth } from "./firebase.ts";
export interface AuthRequest extends Request {
  user: DecodedIdToken;
}
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const asyncRoute =
  (fn: (req: AuthRequest, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as AuthRequest, res)).catch(next);
  };
export const requireAuth: RequestHandler = async (req, res, next) => {
  const match = /^Bearer (\S+)$/.exec(req.headers.authorization || "");
  if (!match) {
    res.status(401).json({ error: "Entre com sua conta Google." });
    return;
  }
  try {
    (req as AuthRequest).user = await adminAuth.verifyIdToken(match[1], true);
    next();
  } catch {
    res.status(401).json({ error: "Sessão inválida. Entre novamente." });
  }
};
export const requireAdmin: RequestHandler = (req, res, next) => {
  if ((req as AuthRequest).user?.admin !== true) {
    res.status(403).json({ error: "Acesso restrito ao administrador." });
    return;
  }
  next();
};
export function handleError(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (res.headersSent) return;
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Dados inválidos.",
      details: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if ((error as { code?: string })?.code === "auth/user-not-found") {
    res.status(404).json({ error: "Usuário não cadastrado." });
    return;
  }
  if ((error as any)?.type === "entity.too.large") {
    res
      .status(413)
      .json({ error: "Arquivo ou dados acima do limite permitido." });
    return;
  }
  console.error("API operation failed:", error);
  res.status(503).json({
    error:
      "Serviço indisponível. Tente novamente; a operação não foi confirmada.",
  });
}
