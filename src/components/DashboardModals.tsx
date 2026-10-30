import React, { useEffect, useState } from "react";
import {
  INITIAL_BIBLICAL_THEMES,
  INITIAL_DICTIONARY_ENTRIES,
  INITIAL_GENERAL_DICTIONARY_ENTRIES,
  buildThemeApproaches,
  searchBiblicalThemes,
  searchDictionary,
  searchGeneralDictionary,
  normalizeReferenceSearch,
} from "../utils/dashboard";
import { useResource } from "../hooks/useResource";
import { api } from "../lib/api";
import type { Note } from "../shared/contracts";
type ThemeOptions = { theme: string; source: "catalog" | "ai"; needsReview: boolean; options: Array<{ id: string; approach: string; title: string; biblicalText: string; objective: string; targetAudience: string; description: string }> };
type DictionaryResult = { term: string; mode: "biblical" | "general"; category: string; definition: string; synonyms: string[]; originalTerm?: string; scriptureReferences: string[]; source: "catalog" | "ai"; needsReview: boolean };
type ConcordanceData = { word: string; totalOccurrences: number; availableOccurrences: number; oldTestament: number; newTestament: number; verses: Array<{ reference: string; snippet: string; testament: "AT" | "NT" }>; available: boolean };
export function DashboardModals({
  modalType,
  onClose,
  onNavigateToSermon,
  onNavigateToXray,
  onNavigateToBible,
  onNavigateToConcordance,
  onNavigateToEditor,
  onSaveReferenceNote,
  initialSearch = "",
  contextReference = "",
  returnToEditor = false,
}: {
  modalType: "themes" | "dictionary" | "concordance" | "notes" | null;
  onClose: () => void;
  onNavigateToSermon: (text: string, theme: string) => void;
  onNavigateToXray: (verse: string) => void;
  onNavigateToBible?: (reference: string) => void;
  onNavigateToConcordance?: (term: string) => void;
  onNavigateToEditor?: (reference: string, content: string) => void;
  onSaveReferenceNote?: (reference: string, content: string, title?: string) => void | Promise<void>;
  initialSearch?: string;
  contextReference?: string;
  returnToEditor?: boolean;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [dictionaryMode, setDictionaryMode] = useState<"biblical" | "general">("biblical");
  const [themeOptions, setThemeOptions] = useState<Record<string, ThemeOptions>>({});
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResult | null>(null);
  const [concordance, setConcordance] = useState<ConcordanceData | null>(null);
  const [busy, setBusy] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setSearch(initialSearch);
    setDictionaryMode("biblical");
    setThemeOptions({});
    setDictionaryResult(null);
    setConcordance(null);
    setError("");
  }, [modalType, initialSearch]);
  const runThemeSearch = async () => {
    if (!search.trim()) return;
    setBusy(true); setError("");
    try { const result = await api<ThemeOptions>("/theology/theme-options", { method: "POST", body: JSON.stringify({ theme: search.trim() }) }); setThemeOptions((current) => ({ ...current, [search.trim().toLowerCase()]: result })); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  const runDictionarySearch = async () => {
    if (!search.trim()) return;
    setBusy(true); setError("");
    try { setDictionaryResult(await api<DictionaryResult>("/theology/dictionary", { method: "POST", body: JSON.stringify({ term: search.trim(), mode: dictionaryMode }) })); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  const runConcordanceSearch = async () => {
    if (!search.trim()) return;
    setBusy(true); setError("");
    try { setConcordance(await api<ConcordanceData>(`/reference/concordance?q=${encodeURIComponent(search.trim())}`)); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  const saveReferenceNote = async (reference: string, content: string, title?: string) => {
    if (!onSaveReferenceNote || savingNote) return;
    setSavingNote(true);
    try {
      await onSaveReferenceNote(reference, content, title);
    } finally {
      setSavingNote(false);
    }
  };
  if (!modalType) return null;
  const localThemes = searchBiblicalThemes(INITIAL_BIBLICAL_THEMES, search);
  const localDictionary: DictionaryResult[] = dictionaryMode === "biblical"
    ? searchDictionary(INITIAL_DICTIONARY_ENTRIES, search).map((entry) => ({ ...entry, mode: "biblical", synonyms: [], source: "catalog", needsReview: false }))
    : searchGeneralDictionary(INITIAL_GENERAL_DICTIONARY_ENTRIES, search).map((entry) => ({ term: entry.term, mode: "general", category: entry.category, definition: entry.definition, synonyms: entry.synonyms, scriptureReferences: [], source: "catalog", needsReview: false }));
  const cachedTheme = themeOptions[search.trim().toLowerCase()];
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
          <div className="flex items-center gap-3">
            {returnToEditor && <button type="button" onClick={onClose} className="text-indigo-700 font-semibold underline">Voltar ao Editor</button>}
            <button onClick={onClose} autoFocus>
              Fechar
            </button>
          </div>
        </div>
        {modalType === "notes" ? (
          <NotesPanel />
        ) : (
          <>
            <p className="text-sm text-slate-500">Acervo parcial verificado. Consultas ausentes podem usar o Gemini no servidor.</p>
            {contextReference && <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-950"><strong>Passagem ativa:</strong> {contextReference}. Digite abaixo o termo que deseja pesquisar.</div>}
            {modalType === "dictionary" && <div className="flex gap-2"><button type="button" className={`px-3 py-2 rounded-xl text-sm ${dictionaryMode === "biblical" ? "bg-amber-600 text-white" : "border"}`} onClick={() => { setDictionaryMode("biblical"); setDictionaryResult(null); }}>Dicionário bíblico</button><button type="button" className={`px-3 py-2 rounded-xl text-sm ${dictionaryMode === "general" ? "bg-amber-600 text-white" : "border"}`} onClick={() => { setDictionaryMode("general"); setDictionaryResult(null); }}>Dicionário geral</button></div>}
            <form onSubmit={(event) => { event.preventDefault(); if (modalType === "themes") void runThemeSearch(); else if (modalType === "dictionary") void runDictionarySearch(); else if (modalType === "concordance") void runConcordanceSearch(); }}>
              <label>Buscar<input className="block border p-3 w-full rounded-xl" value={search} onChange={(e) => { setSearch(e.target.value); setError(""); setConcordance(null); setDictionaryResult(null); }} placeholder={modalType === "themes" ? "Ex.: ansiedade, família, esperança" : modalType === "dictionary" ? "Ex.: graça, discipulado ou uma palavra geral" : "Ex.: graça, esperança ou shalom"} /></label>
              <button disabled={busy || !search.trim()} className="mt-3 bg-slate-900 text-white rounded-xl px-4 py-2 disabled:opacity-50">{busy ? "Consultando…" : "Pesquisar"}</button>
            </form>
            {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3">{error} <button className="underline" onClick={() => { if (modalType === "themes") void runThemeSearch(); else if (modalType === "dictionary") void runDictionarySearch(); else void runConcordanceSearch(); }}>Tentar novamente</button></p>}
            {modalType === "themes" && localThemes.map((theme) => { const expandedByAi = Boolean(cachedTheme && normalizeReferenceSearch(cachedTheme.theme) === normalizeReferenceSearch(theme.name)); const options = expandedByAi ? cachedTheme.options : buildThemeApproaches(theme); return <article key={theme.id} className="border rounded-xl p-4 space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{theme.name}</h3><span className={`text-xs ${expandedByAi ? "text-indigo-700" : "text-emerald-700"}`}>{expandedByAi ? "Sugestões ampliadas por IA · revise" : "Acervo Verbo Norte"}</span></div><p>{theme.description}</p><div className="grid sm:grid-cols-2 gap-3">{options.map((option) => <div key={option.id} className="border rounded-xl p-3 bg-slate-50"><span className="text-xs font-bold uppercase text-amber-700">{option.approach}</span><h4 className="font-semibold mt-1">{option.title}</h4><p className="text-sm mt-1">{option.description}</p><p className="text-xs text-slate-600 mt-2"><strong>Texto:</strong> {option.biblicalText}</p><p className="text-xs text-slate-600"><strong>Objetivo:</strong> {option.objective}</p><p className="text-xs text-slate-600"><strong>Público:</strong> {option.targetAudience}</p><button className="text-amber-700 underline text-sm mt-2" onClick={() => onNavigateToSermon(option.biblicalText, option.title)}>Preparar pregação</button></div>)}</div>{!expandedByAi && <button type="button" disabled={busy} onClick={() => void runThemeSearch()} className="text-sm text-indigo-700 underline disabled:opacity-50">{busy ? "Ampliando com Gemini…" : "Ampliar opções com Gemini"}</button>}</article>; })}
            {modalType === "themes" && !localThemes.length && !cachedTheme && search.trim() && <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-4 space-y-2"><p className="font-semibold text-indigo-950">Esse tema não está no acervo local.</p><p className="text-sm text-indigo-900">O Gemini fará a pesquisa e criará quatro opções de preparação para este tema, identificadas como conteúdo gerado por IA.</p><button type="button" disabled={busy} className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" onClick={() => void runThemeSearch()}>{busy ? "Pesquisando com Gemini…" : "Pesquisar e criar com Gemini"}</button></div>}
            {modalType === "themes" && cachedTheme && !localThemes.length && <article className="border rounded-xl p-4 space-y-3"><div className="flex justify-between"><h3 className="font-bold">{cachedTheme.theme}</h3><span className="text-xs text-indigo-700">Sugestão gerada por IA · revise</span></div><div className="grid sm:grid-cols-2 gap-3">{cachedTheme.options.map((option) => <div key={option.id} className="border rounded-xl p-3"><span className="text-xs font-bold uppercase text-amber-700">{option.approach}</span><h4 className="font-semibold">{option.title}</h4><p className="text-sm">{option.description}</p><p className="text-xs mt-2"><strong>Texto:</strong> {option.biblicalText}</p><button className="text-amber-700 underline text-sm mt-2" onClick={() => onNavigateToSermon(option.biblicalText, option.title)}>Preparar pregação</button></div>)}</div></article>}
            {modalType === "dictionary" && localDictionary.map((entry) => <article key={entry.term} className="border rounded-xl p-4"><div className="flex justify-between gap-3"><h3 className="font-bold">{entry.term}</h3><span className="text-xs text-emerald-700">Acervo Verbo Norte · {entry.category}</span></div><p className="mt-2">{entry.definition}</p>{entry.synonyms.length > 0 && <p className="text-sm mt-2"><strong>Sinônimos:</strong> {entry.synonyms.join(", ")}</p>}{entry.originalTerm && <p className="text-sm text-slate-600 mt-2">Original: {entry.originalTerm}</p>}{entry.scriptureReferences.map((v) => <span key={v} className="inline-flex items-center gap-2 m-2"><button className="text-amber-700 underline" onClick={() => onNavigateToXray(v)}>Raio‑X {v}</button>{onNavigateToBible && <button className="text-emerald-700 underline" onClick={() => onNavigateToBible(v)}>Bíblia</button>}</span>)}<div className="mt-3 flex flex-wrap gap-3">{onNavigateToConcordance && <button type="button" className="text-sm text-violet-700 underline" onClick={() => onNavigateToConcordance(entry.term)}>Abrir na Concordância</button>}{onNavigateToEditor && <button type="button" className="text-sm text-emerald-700 underline" onClick={() => onNavigateToEditor(entry.scriptureReferences[0] || entry.term, `${entry.term}\n\n${entry.definition}`)}>Usar no Editor</button>}{onSaveReferenceNote && <button type="button" disabled={savingNote} className="text-sm text-indigo-700 underline disabled:opacity-50" onClick={() => void saveReferenceNote(entry.term, `${entry.definition}${entry.synonyms.length ? `\n\nSinônimos: ${entry.synonyms.join(", ")}` : ""}`, `Dicionário: ${entry.term}`)}>{savingNote ? "Salvando…" : "Salvar definição nas notas"}</button>}</div></article>)}
            {modalType === "dictionary" && !localDictionary.length && search.trim() && !dictionaryResult && <div className="border rounded-xl p-4"><p>Nenhuma entrada encontrada no acervo local.</p><button className="text-amber-700 underline mt-2" disabled={busy} onClick={() => void runDictionarySearch()}>Consultar Gemini</button></div>}
            {modalType === "dictionary" && dictionaryResult && <article className="border rounded-xl p-4"><div className="flex justify-between gap-3"><h3 className="font-bold">{dictionaryResult.term}</h3><span className="text-xs text-indigo-700">{dictionaryResult.source === "ai" ? "Definição gerada por IA · revise" : "Acervo Verbo Norte"}</span></div><p className="mt-2">{dictionaryResult.definition}</p>{dictionaryResult.synonyms.length > 0 && <p className="text-sm mt-2"><strong>Sinônimos:</strong> {dictionaryResult.synonyms.join(", ")}</p>}{dictionaryResult.originalTerm && <p className="text-sm text-slate-600 mt-2">Original: {dictionaryResult.originalTerm}</p>}{dictionaryResult.scriptureReferences.map((v) => <span key={v} className="inline-flex items-center gap-2 m-2"><button className="text-amber-700 underline" onClick={() => onNavigateToXray(v)}>Raio‑X {v}</button>{onNavigateToBible && <button className="text-emerald-700 underline" onClick={() => onNavigateToBible(v)}>Bíblia</button>}</span>)}<div className="mt-3 flex flex-wrap gap-3">{onNavigateToConcordance && <button type="button" className="text-sm text-violet-700 underline" onClick={() => onNavigateToConcordance(dictionaryResult.term)}>Abrir na Concordância</button>}{onNavigateToEditor && <button type="button" className="text-sm text-emerald-700 underline" onClick={() => onNavigateToEditor(dictionaryResult.scriptureReferences[0] || dictionaryResult.term, `${dictionaryResult.term}\n\n${dictionaryResult.definition}`)}>Usar no Editor</button>}{onSaveReferenceNote && <button type="button" disabled={savingNote} className="text-sm text-indigo-700 underline disabled:opacity-50" onClick={() => void saveReferenceNote(dictionaryResult.term, `${dictionaryResult.definition}${dictionaryResult.synonyms.length ? `\n\nSinônimos: ${dictionaryResult.synonyms.join(", ")}` : ""}`, `Dicionário: ${dictionaryResult.term}`)}>{savingNote ? "Salvando…" : "Salvar definição nas notas"}</button>}</div></article>}
            {modalType === "concordance" && concordance && (concordance.available ? <><div className="rounded-xl bg-slate-50 p-4 text-sm">{concordance.word}: <strong>{concordance.availableOccurrences}</strong> ocorrências disponíveis · AT: {concordance.oldTestament} · NT: {concordance.newTestament}</div>{concordance.verses.map((verse) => <article key={verse.reference} className="border p-4 rounded-xl"><div className="flex flex-wrap items-center gap-2"><button className="text-amber-700 underline" onClick={() => onNavigateToXray(verse.reference)}>Raio‑X {verse.reference}</button>{onNavigateToBible && <button className="text-emerald-700 underline" onClick={() => onNavigateToBible(verse.reference)}>Bíblia</button>}<span className="text-xs text-slate-500">{verse.testament}</span></div><p>{verse.snippet}</p><div className="mt-2 flex flex-wrap gap-3">{onNavigateToEditor && <button type="button" className="text-sm text-emerald-700 underline" onClick={() => onNavigateToEditor(verse.reference, verse.snippet)}>Usar no Editor</button>}{onSaveReferenceNote && <button type="button" disabled={savingNote} className="text-sm text-indigo-700 underline disabled:opacity-50" onClick={() => void saveReferenceNote(verse.reference, verse.snippet, `Concordância: ${concordance.word}`)}>{savingNote ? "Salvando…" : "Salvar ocorrência nas notas"}</button>}</div></article>)}</> : <p>Esta palavra ainda não está disponível na concordância parcial.</p>)}
            {modalType === "concordance" && !concordance && !search.trim() && <p>Digite uma palavra para pesquisar na concordância parcial.</p>}
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
  const [syncState, setSyncState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setSyncState("saving");
    try {
      await fn();
      await resource.reload();
      setSyncState("saved");
    } catch (e) {
      setError((e as Error).message);
      setSyncState("error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section>
      <h3 className="text-xl font-bold">Minhas notas</h3>
      {syncState === "saving" && <p role="status" className="rounded-xl bg-amber-50 text-amber-800 p-3">Sincronizando nota…</p>}
      {syncState === "saved" && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3">Nota sincronizada com segurança.</p>}
      {(error || resource.error) && (
        <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3">
          {error || resource.error}{" "}
          <button className="underline font-semibold" onClick={() => { setSyncState("saving"); setError(""); void resource.reload().then(() => setSyncState("saved")).catch((e) => { setError((e as Error).message); setSyncState("error"); }); }}>
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
            setSyncState("idle");
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
              setSyncState("idle");
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
