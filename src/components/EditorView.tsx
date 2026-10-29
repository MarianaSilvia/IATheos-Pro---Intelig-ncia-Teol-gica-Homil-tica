import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, Check, FilePenLine, FileText, Plus, Printer, Save } from "lucide-react";
import { api } from "../lib/api";
import type { EbdLesson, SermonOutline, VerseXray } from "../utils/theology";
import { formatEbdToMarkdown, formatSermonToMarkdown, formatVerseXrayToMarkdown } from "../utils/theology";
import type { EditorStudy } from "./SavedLibraryView";

type StudySource = SermonOutline | EbdLesson | VerseXray | null;
type EditorBlock = { title: string; body: string };

function parseBlocks(markdown: string): EditorBlock[] {
  const chunks = markdown.split(/\n(?=## )/).map((item) => item.trim()).filter(Boolean);
  return chunks.map((chunk, index) => {
    const lines = chunk.split("\n");
    const heading = lines[0].startsWith("#") ? lines[0].replace(/^#+\s*/, "").trim() : index === 0 ? "Introdução" : `Bloco ${index + 1}`;
    const body = lines[0].startsWith("#") ? lines.slice(1).join("\n").trim() : chunk;
    return { title: heading || `Bloco ${index + 1}`, body };
  });
}

function blocksToMarkdown(blocks: EditorBlock[]): string {
  return blocks.map((block, index) => `${index === 0 ? "#" : "##"} ${block.title.trim() || `Bloco ${index + 1}`}\n\n${block.body.trim()}`).join("\n\n").trim();
}

function sourceTitle(source: StudySource): string {
  if (!source) return "Novo estudo ministerial";
  return "title" in source ? source.title : `Raio-X: ${source.verseReference}`;
}

function sourceReference(source: StudySource): string {
  if (!source) return "";
  return "biblicalText" in source ? source.biblicalText : source.verseReference;
}

function sourceMarkdown(source: StudySource): string {
  if (!source) return "# Novo estudo ministerial\n\nComece a escrever suas ideias, referências e aplicações.";
  if ("sermonType" in source) return formatSermonToMarkdown(source);
  if ("lessonObjective" in source) return formatEbdToMarkdown(source);
  return formatVerseXrayToMarkdown(source);
}

export function EditorView({ source, savedStudy, initialReference = "", activeReference = "", initialText = "", initialContextOpen = false, onOpenReference, onOpenBible, onOpenDictionary, onOpenConcordance }: { source: StudySource; savedStudy?: EditorStudy; initialReference?: string; activeReference?: string; initialText?: string; initialContextOpen?: boolean; onOpenReference?: (reference: string) => void; onOpenBible?: (reference: string) => void; onOpenDictionary?: (reference: string) => void; onOpenConcordance?: (reference: string) => void }) {
  const connectedReferenceRef = useRef(initialReference || activeReference);
  const connectedReference = connectedReferenceRef.current;
  const seedTitle = savedStudy?.title ?? (source ? sourceTitle(source) : connectedReference ? `Estudo de ${connectedReference}` : sourceTitle(source));
  const seedReference = savedStudy?.reference ?? (source ? sourceReference(source) : connectedReference);
  const seedContent = savedStudy?.content ?? (source ? sourceMarkdown(source) : initialText ? `# Estudo de ${connectedReference}\n\nTexto-base:\n\n${initialText}\n\n## Observações\n\n` : sourceMarkdown(source));
  const [title, setTitle] = useState(seedTitle);
  const [reference, setReference] = useState(seedReference);
  const [content, setContent] = useState(seedContent);
  const [additionalReferences, setAdditionalReferences] = useState(savedStudy?.additionalReferences.join("; ") ?? "");
  const [referenceInput, setReferenceInput] = useState("");
  const [contextOpen, setContextOpen] = useState(initialContextOpen);
  const [authorAudience, setAuthorAudience] = useState(savedStudy?.context.authorAudience ?? "");
  const [historicalContext, setHistoricalContext] = useState(savedStudy?.context.historicalContext ?? "");
  const [literaryContext, setLiteraryContext] = useState(savedStudy?.context.literaryContext ?? "");
  const [keyTerms, setKeyTerms] = useState(savedStudy?.context.keyTerms ?? "");
  const [peoplePlacesEvents, setPeoplePlacesEvents] = useState(savedStudy?.context.peoplePlacesEvents ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [syncState, setSyncState] = useState<"idle" | "pending" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [organizeOpen, setOrganizeOpen] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const studyId = useRef(savedStudy?.id ?? (source && "id" in source ? `editor-${source.id}` : crypto.randomUUID()));
  const createdAt = useRef(savedStudy?.createdAt ?? new Date().toISOString());
  const seed = useMemo(() => seedTitle + seedReference + seedContent + (savedStudy?.id ?? ""), [seedTitle, seedReference, seedContent, savedStudy?.id]);

  useEffect(() => {
    setTitle(seedTitle);
    setReference(seedReference);
    setContent(seedContent);
    setAdditionalReferences(savedStudy?.additionalReferences.join("; ") ?? "");
    setReferenceInput("");
    setAuthorAudience(savedStudy?.context.authorAudience ?? "");
    setHistoricalContext(savedStudy?.context.historicalContext ?? "");
    setLiteraryContext(savedStudy?.context.literaryContext ?? "");
    setKeyTerms(savedStudy?.context.keyTerms ?? "");
    setPeoplePlacesEvents(savedStudy?.context.peoplePlacesEvents ?? "");
    setContextOpen(initialContextOpen);
    studyId.current = savedStudy?.id ?? (source && "id" in source ? `editor-${source.id}` : crypto.randomUUID());
    createdAt.current = savedStudy?.createdAt ?? new Date().toISOString();
    setSaved(false);
    setDirty(false);
    setSyncState("idle");
    setError("");
  }, [seed]);

  const markDirty = () => {
    setSaved(false);
    setDirty(true);
    setSyncState("pending");
    setError("");
  };

  const save = async (): Promise<boolean> => {
    if (busy || !title.trim() || !content.trim()) return false;
    if (!reference.trim()) {
      setError("Informe uma referência ou texto-base antes de salvar o estudo.");
      setSyncState("error");
      return false;
    }
    setBusy(true);
    setSyncState("saving");
    setError("");
    try {
      const cleanContent = content.replace(/\n\n<!-- verbo-norte-context -->[\s\S]*$/, "").trim();
      await api(`/studies/${studyId.current}`, {
        method: "PUT",
        body: JSON.stringify({
          type: "editor",
          data: {
            id: studyId.current,
            createdAt: createdAt.current,
            title: title.trim(),
            reference: reference.trim(),
            additionalReferences: references,
            content: cleanContent,
            context: { authorAudience, historicalContext, literaryContext, keyTerms, peoplePlacesEvents },
          },
        }),
      });
      setSaved(true);
      setDirty(false);
      setSyncState("saved");
      return true;
    } catch (e) {
      setError((e as Error).message);
      setSyncState("error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => { void save(); }, 1400);
    return () => window.clearTimeout(timer);
  }, [dirty, title, reference, content, additionalReferences, authorAudience, historicalContext, literaryContext, keyTerms, peoplePlacesEvents]);
  const references = additionalReferences.split(/[;,\n]/).map((item) => item.trim()).filter(Boolean);
  const addReference = () => {
    const next = referenceInput.trim();
    if (!next || references.some((item) => item.toLowerCase() === next.toLowerCase())) return;
    setAdditionalReferences([...references, next].join("; "));
    setReferenceInput("");
    markDirty();
  };

  const openOrganizer = () => {
    setBlocks(parseBlocks(content));
    setOrganizeOpen((value) => !value);
  };
  const updateBlock = (index: number, update: Partial<EditorBlock>) => {
    const next = blocks.map((block, itemIndex) => itemIndex === index ? { ...block, ...update } : block);
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    markDirty();
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    markDirty();
  };
  const addBlock = () => {
    const next = [...blocks, { title: "Novo bloco", body: "Escreva aqui o conteúdo deste bloco." }];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    markDirty();
  };
  const addPrivateNoteBlock = () => {
    const currentBlocks = blocks.length > 0 ? blocks : parseBlocks(content);
    const next = [...currentBlocks, { title: "Nota pessoal", body: "Registre aqui uma observação privada para este estudo." }];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setOrganizeOpen(true);
    markDirty();
  };
  const insertReferenceBlock = () => {
    const connected = reference.trim();
    if (!connected) return;
    const currentBlocks = blocks.length > 0 ? blocks : parseBlocks(content);
    if (currentBlocks.some((block) => block.body.includes(connected) || block.title.includes(connected))) {
      setOrganizeOpen(true);
      return;
    }
    const next = [...currentBlocks, { title: `Passagem bíblica — ${connected}`, body: `${connected}\n\nTexto e observações desta passagem serão desenvolvidos aqui.` }];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setOrganizeOpen(true);
    markDirty();
  };
  const insertAdditionalReference = (item: string) => {
    const currentBlocks = blocks.length > 0 ? blocks : parseBlocks(content);
    if (currentBlocks.some((block) => block.title === `Referência do acervo — ${item}`)) {
      setOrganizeOpen(true);
      return;
    }
    const next = [...currentBlocks, { title: `Referência do acervo — ${item}`, body: `${item}\n\nRegistre aqui a conexão, a observação e a aplicação desta referência. O texto bíblico deve ser conferido no leitor autorizado.` }];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setOrganizeOpen(true);
    markDirty();
  };
  const navigateFromStudy = async (callback: (reference: string) => void, nextReference = reference) => {
    if (dirty && !(await save())) return;
    const cleanReference = nextReference.trim();
    if (cleanReference) callback(cleanReference);
  };

  return (
    <section className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Editor ministerial</span>
          <h1 className="text-3xl font-serif font-bold">Organize sua mensagem</h1>
          <p className="text-sm text-slate-600">Edite um estudo gerado ou comece do zero. O conteúdo é salvo como estudo privado no Caderno Ministerial.</p>
        </div>
        <div className="flex gap-2 no-print">
          {reference.trim() && onOpenBible && <button type="button" onClick={() => void navigateFromStudy(onOpenBible)} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-900 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Bíblia</button>}
          {reference.trim() && onOpenReference && <button type="button" onClick={() => void navigateFromStudy(onOpenReference)} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900">Raio‑X</button>}
          {reference.trim() && onOpenDictionary && <button type="button" onClick={() => void navigateFromStudy(onOpenDictionary)} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-900">Dicionário</button>}
          {reference.trim() && onOpenConcordance && <button type="button" onClick={() => void navigateFromStudy(onOpenConcordance)} className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-violet-900">Concordância</button>}
          <button type="button" onClick={openOrganizer} className="rounded-xl border px-4 py-2 flex items-center gap-2"><FilePenLine className="w-4 h-4" /> {organizeOpen ? "Fechar blocos" : "Organizar blocos"}</button>
          {reference.trim() && <button type="button" onClick={insertReferenceBlock} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-900">Inserir passagem</button>}
          <button type="button" onClick={() => setContextOpen((value) => !value)} className="rounded-xl border px-4 py-2 flex items-center gap-2">{contextOpen ? "Fechar contexto" : "Contexto do estudo"}</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-2 flex items-center gap-2"><Printer className="w-4 h-4" /> Imprimir</button>
          <button type="button" disabled={busy} onClick={() => void save()} className="rounded-xl bg-amber-600 text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" /> {busy ? "Salvando…" : saved ? "Salvo" : "Salvar"}</button>
        </div>
      </div>
      {syncState === "error" && error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3">Falha ao sincronizar: {error} <button className="underline font-semibold" onClick={() => void save()}>Tentar novamente</button></p>}
      {syncState === "saving" && <p role="status" className="rounded-xl bg-amber-50 text-amber-800 p-3">Salvando alterações no Caderno…</p>}
      {syncState === "pending" && dirty && <p role="status" className="rounded-xl bg-slate-50 text-slate-700 p-3">Alterações pendentes. Salvamento automático em andamento…</p>}
      {syncState === "saved" && saved && !dirty && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3 flex items-center gap-2"><Check className="w-4 h-4" /> Sincronizado no Caderno Ministerial.</p>}
      {organizeOpen && <section className="bg-slate-50 rounded-2xl border p-4 space-y-3 no-print"><div className="flex items-center justify-between"><div><h2 className="font-bold">Blocos do estudo</h2><p className="text-xs text-slate-600">Reordene os tópicos e edite cada seção sem perder o Markdown salvo.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={addPrivateNoteBlock} className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 px-3 py-2 text-sm font-semibold">+ Nota pessoal</button><button type="button" onClick={addBlock} className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Novo bloco</button></div></div>{blocks.map((block, index) => <article key={`${index}-${block.title}`} className={`bg-white rounded-xl border p-3 space-y-2 ${block.title === "Nota pessoal" ? "border-indigo-200 bg-indigo-50/30" : ""}`}><div className="flex items-center gap-2"><input aria-label={`Título do bloco ${index + 1}`} value={block.title} onChange={(event) => updateBlock(index, { title: event.target.value })} className="flex-1 rounded-lg border p-2 font-semibold" /><button type="button" disabled={index === 0} onClick={() => moveBlock(index, -1)} className="p-2 border rounded-lg disabled:opacity-40" title="Mover para cima"><ArrowUp className="w-4 h-4" /></button><button type="button" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} className="p-2 border rounded-lg disabled:opacity-40" title="Mover para baixo"><ArrowDown className="w-4 h-4" /></button></div><textarea aria-label={`Conteúdo do bloco ${index + 1}`} value={block.body} onChange={(event) => updateBlock(index, { body: event.target.value })} className="w-full min-h-24 rounded-lg border p-3 text-sm" /></article>)}</section>}
      {contextOpen && <section className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-4 space-y-3 no-print"><div><h2 className="font-bold text-indigo-950">Contexto do estudo</h2><p className="text-xs text-slate-600">Registre informações confirmadas ou suas próprias observações. Revise antes de usar publicamente.</p></div><div className="grid md:grid-cols-2 gap-3"><label className="text-sm font-semibold">Autor e público<textarea value={authorAudience} onChange={(event) => { setAuthorAudience(event.target.value); markDirty(); }} placeholder="Ex.: autoria, destinatários e público da mensagem" className="mt-1 w-full min-h-20 rounded-lg border p-2 text-sm" /></label><label className="text-sm font-semibold">Contexto histórico<textarea value={historicalContext} onChange={(event) => { setHistoricalContext(event.target.value); markDirty(); }} placeholder="Período, situação e fatos relevantes" className="mt-1 w-full min-h-20 rounded-lg border p-2 text-sm" /></label><label className="text-sm font-semibold">Contexto literário<textarea value={literaryContext} onChange={(event) => { setLiteraryContext(event.target.value); markDirty(); }} placeholder="Gênero, estrutura e contexto imediato" className="mt-1 w-full min-h-20 rounded-lg border p-2 text-sm" /></label><label className="text-sm font-semibold">Termos importantes<textarea value={keyTerms} onChange={(event) => { setKeyTerms(event.target.value); markDirty(); }} placeholder="Palavras, conceitos ou termos originais confirmados" className="mt-1 w-full min-h-20 rounded-lg border p-2 text-sm" /></label></div><label className="block text-sm font-semibold">Personagens, lugares e eventos<textarea value={peoplePlacesEvents} onChange={(event) => { setPeoplePlacesEvents(event.target.value); markDirty(); }} placeholder="Registre somente informações verificadas" className="mt-1 w-full min-h-20 rounded-lg border p-2 text-sm" /></label></section>}
      <div className="bg-white rounded-3xl border shadow-sm p-5 sm:p-8 space-y-4">
        <label className="block text-sm font-semibold">Título<input value={title} onChange={(event) => { setTitle(event.target.value); markDirty(); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3 font-serif text-lg" /></label>
        <label className="block text-sm font-semibold">Texto ou referência bíblica<input required value={reference} onChange={(event) => { setReference(event.target.value); markDirty(); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3" /></label>
        {activeReference && !source && <p className="-mt-2 text-xs text-indigo-700">Passagem ativa conectada automaticamente: {activeReference}</p>}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3"><div><h2 className="text-sm font-bold text-indigo-900">Referências adicionais</h2><p className="text-xs text-slate-600">Adicione referências relacionadas e abra cada uma no módulo adequado. O conteúdo é conferido no acervo autorizado.</p></div><div className="flex gap-2"><input value={referenceInput} onChange={(event) => setReferenceInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addReference(); } }} placeholder="Ex.: João 3:16" className="flex-1 rounded-lg border p-2 text-sm" /><button type="button" onClick={addReference} className="rounded-lg bg-indigo-700 text-white px-3 py-2 text-sm font-bold">Adicionar</button></div>{references.length > 0 && <div className="space-y-2">{references.map((item) => <div key={item} className="flex flex-wrap items-center gap-1 rounded-lg bg-white border border-indigo-200 px-2 py-1 text-xs"><span className="font-semibold text-slate-800 mr-1">{item}</span><button type="button" onClick={() => insertAdditionalReference(item)} className="text-violet-800 underline font-semibold">Inserir no estudo</button><button type="button" onClick={() => onOpenBible?.(item)} className="text-emerald-800 underline font-semibold">Bíblia</button><button type="button" onClick={() => onOpenReference?.(item)} className="text-amber-800 underline font-semibold">Raio‑X</button><button type="button" onClick={() => onOpenDictionary?.(item)} className="text-indigo-800 underline font-semibold">Dicionário</button><button type="button" onClick={() => onOpenConcordance?.(item)} className="text-violet-800 underline font-semibold">Concordância</button><button type="button" onClick={() => { setAdditionalReferences(references.filter((referenceItem) => referenceItem !== item).join("; ")); markDirty(); }} aria-label={`Remover ${item}`} className="text-slate-500 hover:text-red-700 ml-auto">×</button></div>)}</div>}</div>
        <label className="block text-sm font-semibold">Conteúdo<textarea value={content} onChange={(event) => { setContent(event.target.value); markDirty(); }} maxLength={50000} className="mt-1 block w-full min-h-[520px] rounded-xl border p-4 font-mono text-sm leading-relaxed" /></label>
        <p className="text-xs text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Revise referências e aplicações antes de ensinar ou pregar.</p>
      </div>
    </section>
  );
}
