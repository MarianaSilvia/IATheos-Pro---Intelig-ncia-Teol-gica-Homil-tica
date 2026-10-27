import React, { useState } from "react";
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
  const [uid, setUid] = useState("");
  const [reason, setReason] = useState("");
  const [productId, setProductId] = useState("");
  const [form, setForm] = useState<ProductInput>(blank);
  const [editId, setEditId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
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
  const edit = (p: DigitalProduct) => {
    setEditId(p.id);
    setFile(null);
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
  };
  const save = async () => {
    let id = editId;
    if (
      file &&
      (file.type !== "application/pdf" || file.size > 25 * 1024 * 1024)
    )
      throw new Error("Escolha um PDF de até 25 MB.");
    if (!id) {
      if (!file) throw new Error("Anexe o PDF do novo material.");
      const created = await api<{ id: string }>("/products", {
        method: "POST",
        body: JSON.stringify(form),
      });
      id = created.id;
      setEditId(id);
    } else
      await api("/products/" + id, {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          archived: file ? true : form.archived,
        }),
      });
    if (file)
      await api("/products/" + id + "/pdf", {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: file,
      });
    await api("/products/" + id, {
      method: "PATCH",
      body: JSON.stringify({ archived: form.archived }),
    });
    await onRefresh();
    setEditId("");
    setForm(blank);
    setFile(null);
  };
  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-serif font-bold">Administração</h1>
      <p>Concessões manuais de acesso. Cobranças desativadas.</p>
      <p>Últimas {audit.data.length} operações administrativas registradas.</p>
      {message && (
        <p role="status" className="bg-amber-50 p-3">
          {message}
        </p>
      )}
      {(users.error || audit.error) && (
        <p role="alert">
          {users.error || audit.error}{" "}
          <button
            onClick={() => {
              void users.reload();
              void audit.reload();
            }}
          >
            Tentar novamente
          </button>
        </p>
      )}
      <section className="bg-white border rounded-2xl p-6 space-y-4">
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
              .filter((p) => !p.archived && p.hasFile)
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
      </section>
      <form
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
          ["coverImage", "URL HTTPS da capa (opcional)"],
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
          PDF (até 25 MB)
          <input
            key={editId || "new"}
            className="block"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
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
            setFile(null);
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
              {p.hasFile ? "PDF anexado" : "Sem PDF"}
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
      </section>
      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-bold">Histórico administrativo</h2>
        {audit.data.map((a) => (
          <p key={a.id} className="border-b py-3 text-sm">
            {new Date(a.createdAt).toLocaleString("pt-BR")} · {a.action} ·{" "}
            {a.targetUid} · {a.reason} · responsável: {a.actorUid}
          </p>
        ))}
      </section>
    </div>
  );
}
