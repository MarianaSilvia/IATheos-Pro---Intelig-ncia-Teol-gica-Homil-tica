import React, { useState } from "react";
import type { DigitalProduct } from "../utils/ecosystem";
export function StoreView({
  products,
  isProSubscriber,
  onOpenPdfReader,
}: {
  products: DigitalProduct[];
  isProSubscriber: boolean;
  onOpenPdfReader: (p: DigitalProduct) => void;
}) {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Biblioteca de materiais</h1>
      <p>
        A cobrança está desativada. Materiais pagos podem ser concedidos pelo
        administrador.
      </p>
      <label className="block">
        Buscar material
        <input
          className="block w-full border p-3 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products
          .filter((p) =>
            (p.title + " " + p.author)
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((p) => {
            const allowed =
              p.owned ||
              (!p.archived &&
                (p.price === 0 || (isProSubscriber && p.isFreeForSubscribers)));
            return (
              <article
                key={p.id}
                className="bg-white border p-5 rounded-2xl space-y-3"
              >
                {p.coverImage && (
                  <img
                    src={p.coverImage}
                    alt=""
                    className="w-full h-44 object-cover rounded-xl"
                  />
                )}
                <h2 className="font-serif text-xl font-bold">{p.title}</h2>
                <p>
                  {p.author} · {p.category} · {p.pages} páginas
                </p>
                <p className="text-sm text-slate-600">{p.description}</p>
                {p.archived && <p>Arquivado · acesso previamente concedido</p>}
                <button
                  disabled={!allowed || !p.hasFile}
                  className="bg-amber-600 text-white p-3 rounded-xl disabled:bg-slate-300"
                  onClick={() => onOpenPdfReader(p)}
                >
                  {allowed
                    ? "Ler / baixar PDF"
                    : "Solicitar acesso ao administrador"}
                </button>
              </article>
            );
          })}
      </div>
      {products.length === 0 && <p>Nenhum material disponível no momento.</p>}
    </div>
  );
}
