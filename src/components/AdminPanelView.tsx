import React, { useMemo, useState } from "react";
import { api } from "../lib/api";
import { useResource } from "../hooks/useResource";
import type { DigitalProduct } from "../utils/ecosystem";
import type { ProductInput } from "../shared/contracts";
const blank: ProductInput = {
  title: "",
  author: "",
  description: "",
  category: "Livro",
  price: 0,
  pages: 1,
  isFreeForSubscribers: true,
  coverImage: "",
  archived: true,
};
export function AdminPanelView({
  products,
  onRefresh,
}: {
  products: DigitalProduct[];
  onRefresh: () => Promise<void>;
}) {
  const users = useResource<{ users: any[]; pageToken: string | null }>(
    "/admin/users",
    { users: [], pageToken: null },
  );
  const audit = useResource<any[]>("/admin/audit", []);
  const orders = useResource<any[]>("/admin/orders", []);
  const [adminTab, setAdminTab] = useState<"overview" | "subscribers" | "materials" | "audit">("overview");
  const [uid, setUid] = useState("");
  const [reason, setReason] = useState("");
  const [productId, setProductId] = useState("");
  const [form, setForm] = useState<ProductInput>(blank);
  const [editId, setEditId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [message, setMessage] = useState("");
  const metrics = useMemo(() => {
    const paid = orders.data.filter((order) => ["paid", "settled"].includes(String(order.status).toLowerCase()));
    const active = users.data.users.filter((user) => user.subscription?.status === "active").length;
    return {
      totalUsers: users.data.users.length,
      active,
      paid: paid.length,
      pending: orders.data.filter((order) => String(order.status).toLowerCase() === "pending").length,
      monthly: paid.filter((order) => order.plan_id === "monthly").length,
      annual: paid.filter((order) => order.plan_id === "annual").length,
      revenue: paid.reduce((total, order) => total + Number(order.amount_cents || 0), 0) / 100,
    };
  }, [orders.data, users.data.users]);
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await fn();
      setMessage("Operação confirmada.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const subscription = (action: string) =>
    void run(async () => {
      if (!uid || !reason.trim())
        throw new Error("Escolha um usuário e informe o motivo.");
      await api("/admin/subscriptions/" + uid, {
        method: "POST",
        body: JSON.stringify({ action, reason }),
      });
      await Promise.all([users.reload(), audit.reload()]);
    });
  const edit = (p: DigitalProduct) => void run(async () => {
    setEditId(p.id);
    setDownloadUrl("");
    setForm({
      title: p.title,
      author: p.author,
      description: p.description,
      category: p.category,
      price: p.price,
      pages: p.pages,
      isFreeForSubscribers: p.isFreeForSubscribers,
      coverImage: p.coverImage,
      archived: !!p.archived,
    });
    const data=await api<{url:string}>("/admin/products/"+p.id+"/link");
    setDownloadUrl(data.url);
  });
  const save = async () => {
    const payload={...form,downloadUrl};
    await api(editId?"/products/"+editId:"/products",{method:editId?"PATCH":"POST",body:JSON.stringify(payload)});
    await onRefresh();setEditId("");setForm(blank);setDownloadUrl("");
  };
  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-serif font-bold">Administração</h1>
      <p>Gestão de assinaturas, pedidos e concessões manuais de acesso.</p>
      <p>Últimas {audit.data.length} operações administrativas registradas.</p>
      {message && (
        <p role="status" className="bg-amber-50 p-3">
          {message}
        </p>
      )}
      {(users.error || audit.error || orders.error) && (
        <p role="alert">
          {users.error || audit.error || orders.error}{" "}
          <button
            onClick={() => {
              void users.reload();
               void audit.reload();
               void orders.reload();
            }}
          >
            Tentar novamente
          </button>
        </p>
      )}
      <nav aria-label="Seções administrativas" className="flex flex-wrap gap-2">
        {([
          ["overview", "Visão geral"],
          ["subscribers", "Assinantes"],
          ["materials", "Materiais da loja"],
          ["audit", "Auditoria"],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setAdminTab(value)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${adminTab === value ? "bg-indigo-700 text-white" : "bg-white text-slate-700 border"}`}>
            {label}
          </button>
        ))}
      </nav>
      {adminTab === "overview" && (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Assinantes ativos", metrics.active, "text-emerald-700"],
            ["Pagamentos confirmados", metrics.paid, "text-indigo-700"],
            ["Pagamentos pendentes", metrics.pending, "text-amber-700"],
            ["Plano mensal", metrics.monthly, "text-slate-800"],
            ["Plano anual", metrics.annual, "text-slate-800"],
            ["Receita confirmada", `R$ ${metrics.revenue.toFixed(2).replace(".", ",")}`, "text-slate-800"],
          ].map(([label, value, tone]) => (
            <article key={String(label)} className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <strong className={`text-2xl font-bold ${tone}`}>{value}</strong>
            </article>
          ))}
          <article className="sm:col-span-2 lg:col-span-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <h2 className="font-bold text-indigo-950">Acompanhamento comercial</h2>
            <p className="text-sm text-indigo-900 mt-1">Há {metrics.totalUsers} contas cadastradas. Os números acima consideram apenas pedidos confirmados pela InfinitePay; pedidos pendentes não liberam acesso.</p>
          </article>
        </section>
      )}
      {adminTab === "subscribers" && (
        <section className="bg-white border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Assinantes e clientes</h2><p className="text-sm text-slate-500">Visualização segura dos e-mails, situação e validade.</p></div><button type="button" className="text-sm underline" onClick={() => void users.reload()}>Atualizar</button></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3 pr-4">E-mail</th><th className="py-3 pr-4">Situação</th><th className="py-3 pr-4">Validade</th><th className="py-3">Contato</th></tr></thead><tbody>{users.data.users.map((user) => { const subscription = user.subscription; const active = subscription?.status === "active"; return <tr key={user.uid} className="border-b last:border-0"><td className="py-3 pr-4 font-medium">{user.email || user.uid}</td><td className="py-3 pr-4"><span className={`rounded-full px-2 py-1 text-xs ${active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{subscription?.status || "sem acesso"}</span></td><td className="py-3 pr-4">{subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("pt-BR") : "—"}</td><td className="py-3"><button type="button" className="text-indigo-700 underline" onClick={() => void navigator.clipboard?.writeText(user.email || "")}>Copiar e-mail</button></td></tr>; })}</tbody></table></div>
        </section>
      )}
      {adminTab !== "materials" && adminTab !== "audit" && <section className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">Acesso de usuários cadastrados</h2>
        <label className="block">
          Usuário
          <select
            className="block border p-3 w-full rounded-xl"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          >
            <option value="">Selecione</option>
            {users.data.users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.email || u.uid} —{" "}
                {u.subscription
                  ? u.subscription.status +
                    " até " +
                    new Date(u.subscription.expiresAt).toLocaleDateString(
                      "pt-BR",
                    )
                  : "Sem acesso"}
              </option>
            ))}
          </select>
        </label>
        {users.data.pageToken && (
          <button
            onClick={() =>
              void run(async () => {
                const next = await api<{
                  users: any[];
                  pageToken: string | null;
                }>(
                  "/admin/users?pageToken=" +
                    encodeURIComponent(users.data.pageToken!),
                );
                users.setData((prev) => ({
                  users: [...prev.users, ...next.users],
                  pageToken: next.pageToken,
                }));
              })
            }
          >
            Carregar mais usuários
          </button>
        )}
        <label className="block">
          Motivo
          <input
            maxLength={1000}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block border rounded-xl p-3 w-full"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            ["grant", "Conceder 365 dias"],
            ["renew", "Renovar +365 dias"],
            ["suspend", "Suspender"],
            ["activate", "Reativar"],
          ].map(([action, label]) => (
            <button
              disabled={busy}
              key={action}
              className="bg-slate-900 text-white rounded-xl p-3 disabled:opacity-50"
              onClick={() => subscription(action)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="block">
          Material para concessão individual
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border p-2 ml-3"
          >
            <option value="">Selecione</option>
            {products
              .filter((p) => !p.archived && p.hasLink)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
          </select>
        </label>
        <button
          disabled={busy}
          onClick={() =>
            void run(async () => {
              if (!uid || !productId || !reason.trim())
                throw new Error("Informe usuário, material e motivo.");
              await api("/admin/entitlements", {
                method: "POST",
                body: JSON.stringify({ uid, productId, reason }),
              });
              await audit.reload();
            })
          }
          className="text-amber-700 underline"
        >
          Conceder material ao usuário
        </button>
      </section>}
      {adminTab === "materials" && <><form
        className="bg-white border rounded-2xl p-6 grid sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void run(save);
        }}
      >
        <h2 className="sm:col-span-2 text-xl font-bold">
          {editId ? "Editar material" : "Cadastrar material"}
        </h2>
        {[
          ["title", "Título"],
          ["author", "Autor"],
          ["description", "Descrição"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              required={key !== "coverImage"}
              maxLength={key === "description" ? 6000 : 300}
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="block border rounded-xl p-3 w-full"
            />
          </label>
        ))}
        <label>
          Capa do material (PNG, JPG ou WebP; até 2 MB)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy || coverUploading}
            className="block border rounded-xl p-3 w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) { setMessage("A capa deve ter no máximo 2 MB."); e.currentTarget.value = ""; return; }
              setCoverUploading(true);
              const reader = new FileReader();
              reader.onload = async () => {
                try {
                  const result = await api<{url:string}>("/admin/product-cover", { method: "POST", body: JSON.stringify({ filename: file.name, mimeType: file.type, data: String(reader.result) }) });
                  setForm((current) => ({ ...current, coverImage: result.url }));
                  setMessage("Capa enviada. Salve o material para confirmar o cadastro.");
                } catch (error) { setMessage((error as Error).message); }
                finally { setCoverUploading(false); }
              };
              reader.onerror = () => { setMessage("Não foi possível ler a imagem."); setCoverUploading(false); };
              reader.readAsDataURL(file);
            }}
          />
          {coverUploading && <span className="text-sm text-slate-600">Enviando capa…</span>}
          {form.coverImage && <img src={form.coverImage} alt="Prévia da capa" className="mt-2 h-36 w-24 rounded object-cover border" />}
        </label>
        <label>
          Categoria
          <select
            className="block border p-3 w-full"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as ProductInput["category"],
              })
            }
          >
            {[
              "Livro",
              "Revista EBD",
              "Comentário Bíblico",
              "Manual Pastoral",
              "Esboços",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Preço de referência (R$)
          <input
            className="block border p-3 w-full"
            type="number"
            min="0"
            max="100000"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Páginas
          <input
            className="block border p-3 w-full"
            type="number"
            min="1"
            max="10000"
            value={form.pages}
            onChange={(e) =>
              setForm({ ...form, pages: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Link HTTPS de download (nuvem externa)
          <input aria-label="Link direto do material no Google Drive" className="block border p-3 w-full" type="url" required maxLength={4096} value={downloadUrl} onChange={e=>setDownloadUrl(e.target.value)} />
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.isFreeForSubscribers}
            onChange={(e) =>
              setForm({ ...form, isFreeForSubscribers: e.target.checked })
            }
          />{" "}
          Incluído na assinatura
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.archived}
            onChange={(e) => setForm({ ...form, archived: e.target.checked })}
          />{" "}
          Arquivado / rascunho
        </label>
        <button
          disabled={busy}
          className="bg-amber-600 text-white p-3 rounded-xl disabled:opacity-50"
        >
          {busy ? "Salvando…" : "Salvar material"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditId("");
            setForm(blank);
            setDownloadUrl("");
          }}
        >
          Novo cadastro
        </button>
      </form>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Catálogo</h2>
        {products.map((p) => (
          <article
            className="bg-white border rounded-xl p-4 flex flex-wrap gap-4 justify-between"
            key={p.id}
          >
            <span>
              {p.title} · {p.archived ? "Arquivado" : "Disponível"} ·{" "}
              {p.hasLink ? "Link cadastrado" : "Sem link"}
            </span>
            <div className="flex gap-4">
              <button className="underline" onClick={() => edit(p)}>
                Editar
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await api("/products/" + p.id, {
                      method: "PATCH",
                      body: JSON.stringify({ archived: !p.archived }),
                    });
                    await onRefresh();
                  })
                }
              >
                {p.archived ? "Disponibilizar" : "Arquivar"}
              </button>
            </div>
          </article>
        ))}
      </section></>}
      {adminTab === "audit" && <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-bold">Histórico administrativo</h2>
        {audit.data.map((a) => (
          <p key={a.id} className="border-b py-3 text-sm">
            {new Date(a.createdAt).toLocaleString("pt-BR")} · {a.action} ·{" "}
            {a.targetUid} · {a.reason} · responsável: {a.actorUid}
          </p>
        ))}
      </section>}
    </div>
  );
}
