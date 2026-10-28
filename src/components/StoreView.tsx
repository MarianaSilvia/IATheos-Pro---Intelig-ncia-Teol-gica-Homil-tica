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
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Biblioteca de materiais</h1>
      <p>
        Os arquivos ficam em uma nuvem externa. O acesso é liberado após a
        confirmação da assinatura ou por concessão administrativa.
      </p>
      <label className="block">
        Buscar material
        <input
          className="block w-full border p-3 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                className="bg-white border p-3 sm:p-4 rounded-2xl space-y-3 shadow-sm"
              >
                {p.coverImage ? (
                  <img src={p.coverImage} alt={`Capa de ${p.title}`} className="w-full aspect-[3/4] object-cover rounded-xl" />
                ) : (
                  <div className="w-full aspect-[3/4] rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-500 text-center p-2">Capa indisponível</div>
                )}
                <div className="space-y-2">
                  <h2 className="font-serif text-base sm:text-lg font-bold leading-tight line-clamp-2">{p.title}</h2>
                  <p className="font-semibold text-amber-700">{p.price > 0 ? `R$ ${p.price.toFixed(2).replace(".", ",")}` : "Grátis"}</p>
                  <button type="button" className="text-sm underline text-slate-700" aria-expanded={expandedProductId === p.id} onClick={() => setExpandedProductId(expandedProductId === p.id ? null : p.id)}>
                    {expandedProductId === p.id ? "Ocultar detalhes" : "Acessar detalhes"}
                  </button>
                </div>
                {expandedProductId === p.id && (
                  <div className="border-t pt-3 space-y-3 text-sm text-slate-600">
                    <p>{p.description}</p>
                    <p>{p.author} · {p.category} · {p.pages} páginas</p>
                    {p.archived && <p>Arquivado · acesso previamente concedido</p>}
                    <button
                      disabled={!allowed || !p.hasLink}
                      className="w-full bg-amber-600 text-white p-3 rounded-xl disabled:bg-slate-300"
                      onClick={() => onOpenPdfReader(p)}
                    >
                      {allowed ? "Acessar download" : "Solicitar acesso ao administrador"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
      </div>
      {products.length === 0 && <p>Nenhum material disponível no momento.</p>}
    </div>
  );
}
