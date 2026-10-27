import { auth } from "./firebase";
export async function api<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error("Entre com sua conta Google.");
  const token = await user.getIdToken();
  if (auth.currentUser?.uid !== user.uid)
    throw new Error("A conta foi alterada. Tente novamente.");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Falha na solicitação (${response.status}).`);
  }
  return response.json();
}
export async function pdfFile(id: string): Promise<Blob> {
  const user = auth.currentUser;
  if (!user) throw new Error("Entre com Google.");
  const response = await fetch(`/api/products/${encodeURIComponent(id)}/file`, {
    signal: AbortSignal.timeout(60000),
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "PDF indisponível.");
  }
  if (auth.currentUser?.uid !== user.uid)
    throw new Error("A conta foi alterada.");
  return response.blob();
}
