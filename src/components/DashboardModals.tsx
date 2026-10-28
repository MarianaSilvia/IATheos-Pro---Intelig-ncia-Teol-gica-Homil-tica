import React, { useState } from "react";
import {
  INITIAL_BIBLICAL_THEMES,
  INITIAL_DICTIONARY_ENTRIES,
  INITIAL_CONCORDANCE_ENTRIES,
  searchBiblicalThemes,
  searchDictionary,
} from "../utils/dashboard";
import { useResource } from "../hooks/useResource";
import { api } from "../lib/api";
import type { Note } from "../shared/contracts";
export function DashboardModals({
  modalType,
  onClose,
  onNavigateToSermon,
  onNavigateToXray,
}: {
  modalType: "themes" | "dictionary" | "concordance" | "notes" | null;
  onClose: () => void;
  onNavigateToSermon: (text: string, theme: string) => void;
  onNavigateToXray: (verse: string) => void;
}) {
  const [search, setSearch] = useState("");
  if (!modalType) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ferramentas de estudo"
      className="fixed inset-0 z-50 bg-black/70 p-4 grid place-items-center"
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-serif text-2xl">Ferramentas de estudo</h2>
          <button onClick={onClose} autoFocus>
            Fechar
          </button>
        </div>
        {modalType === "notes" ? (
          <NotesPanel />
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Acervo de referência parcial.
            </p>
            <label>
              Buscar
              <input
                className="block border p-3 w-full rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            {modalType === "themes" &&
              searchBiblicalThemes(INITIAL_BIBLICAL_THEMES, search).map((t) => (
                <article key={t.id} className="border rounded-xl p-4">
                  <h3 className="font-bold">{t.name}</h3>
                  <p>{t.description}</p>
                  <button
                    className="text-amber-700 underline"
                    onClick={() =>
                      onNavigateToSermon(t.primaryVerses[0].reference, t.name)
                    }
                  >
                    Preparar pregação
                  </button>
                </article>
              ))}
            {modalType === "dictionary" &&
              searchDictionary(INITIAL_DICTIONARY_ENTRIES, search).map((d) => (
                <article key={d.term} className="border rounded-xl p-4">
                  <h3 className="font-bold">{d.term}</h3>
                  <p>{d.definition}</p>
                  {d.scriptureReferences.map((v) => (
                    <button
                      key={v}
                      className="m-2 text-amber-700 underline"
                      onClick={() => onNavigateToXray(v)}
                    >
                      {v}
                    </button>
                  ))}
                </article>
              ))}
            {modalType === "concordance" &&
              (INITIAL_CONCORDANCE_ENTRIES[
                search.trim().toLowerCase()
              ]?.verses.map((v) => (
                <article key={v.reference} className="border p-4 rounded-xl">
                  <button
                    className="text-amber-700 underline"
                    onClick={() => onNavigateToXray(v.reference)}
                  >
                    {v.reference}
                  </button>
                  <p>{v.snippet}</p>
                </article>
              )) || <p>Nenhum resultado neste acervo parcial.</p>)}
          </>
        )}
      </div>
    </div>
  );
}
function NotesPanel() {
  const resource = useResource<Note[]>("/notes", []);
  const [form, setForm] = useState({
    title: "",
    biblicalReference: "",
    content: "",
  });
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
      await resource.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section>
      <h3 className="text-xl font-bold">Minhas notas</h3>
      {(error || resource.error) && (
        <p role="alert">
          {error || resource.error}{" "}
          <button onClick={() => void resource.reload()}>
            Tentar novamente
          </button>
        </p>
      )}
      <form
        className="space-y-3 my-5"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            await api("/notes/" + (id || crypto.randomUUID()), {
              method: "PUT",
              body: JSON.stringify(form),
            });
            setId("");
            setForm({ title: "", biblicalReference: "", content: "" });
          });
        }}
      >
        {[
          ["title", "Título"],
          ["biblicalReference", "Referência bíblica"],
        ].map(([key, label]) => (
          <label className="block" key={key}>
            {label}
            <input
              required={key === "title"}
              maxLength={300}
              className="block border p-2 rounded-xl w-full"
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="block">
          Anotação
          <textarea
            required
            maxLength={12000}
            className="block border p-2 rounded-xl w-full min-h-28"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </label>
        <button
          disabled={busy}
          className="bg-amber-600 text-white px-5 py-2 rounded-xl"
        >
          Salvar nota
        </button>
        <button
          type="button"
          className="ml-4"
          onClick={() => {
            setId("");
            setForm({ title: "", biblicalReference: "", content: "" });
          }}
        >
          Nova nota
        </button>
      </form>
      {resource.loading && <p>Carregando…</p>}
      {resource.data.map((n) => (
        <article key={n.id} className="border p-4 rounded-xl my-3">
          <h4 className="font-bold">{n.title}</h4>
          <p>{n.biblicalReference}</p>
          <p className="whitespace-pre-wrap">{n.content}</p>
          <button
            className="underline mr-5"
            onClick={() => {
              setId(n.id);
              setForm({
                title: n.title,
                biblicalReference: n.biblicalReference,
                content: n.content,
              });
            }}
          >
            Editar
          </button>
          <button
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await api("/notes/" + n.id, { method: "DELETE" });
              })
            }
          >
            Excluir
          </button>
        </article>
      ))}
    </section>
  );
}
