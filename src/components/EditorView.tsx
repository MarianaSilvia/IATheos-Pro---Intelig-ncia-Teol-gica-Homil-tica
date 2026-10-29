import React, { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, FilePenLine, FileText, Plus, Printer, Save } from "lucide-react";
import { api } from "../lib/api";
import type { EbdLesson, SermonOutline, VerseXray } from "../utils/theology";
import { formatEbdToMarkdown, formatSermonToMarkdown, formatVerseXrayToMarkdown } from "../utils/theology";

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

export function EditorView({ source, initialReference = "", initialText = "" }: { source: StudySource; initialReference?: string; initialText?: string }) {
  const seedTitle = source ? sourceTitle(source) : initialReference ? `Estudo de ${initialReference}` : sourceTitle(source);
  const seedReference = source ? sourceReference(source) : initialReference;
  const seedContent = source ? sourceMarkdown(source) : initialText ? `# Estudo de ${initialReference}\n\nTexto-base:\n\n${initialText}\n\n## Observações\n\n` : sourceMarkdown(source);
  const [title, setTitle] = useState(seedTitle);
  const [reference, setReference] = useState(seedReference);
  const [content, setContent] = useState(seedContent);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [organizeOpen, setOrganizeOpen] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const seed = useMemo(() => seedTitle + seedReference + seedContent, [seedTitle, seedReference, seedContent]);

  useEffect(() => {
    setTitle(seedTitle);
    setReference(seedReference);
    setContent(seedContent);
    setSaved(false);
    setError("");
  }, [seed]);

  const save = async () => {
    if (!title.trim() || !content.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api(`/notes/${crypto.randomUUID()}`, {
        method: "PUT",
        body: JSON.stringify({ title: title.trim(), biblicalReference: reference.trim(), content: content.trim() }),
      });
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const openOrganizer = () => {
    setBlocks(parseBlocks(content));
    setOrganizeOpen((value) => !value);
  };
  const updateBlock = (index: number, update: Partial<EditorBlock>) => {
    const next = blocks.map((block, itemIndex) => itemIndex === index ? { ...block, ...update } : block);
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setSaved(false);
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setSaved(false);
  };
  const addBlock = () => {
    const next = [...blocks, { title: "Novo bloco", body: "Escreva aqui o conteúdo deste bloco." }];
    setBlocks(next);
    setContent(blocksToMarkdown(next));
    setSaved(false);
  };

  return (
    <section className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Editor ministerial</span>
          <h1 className="text-3xl font-serif font-bold">Organize sua mensagem</h1>
          <p className="text-sm text-slate-600">Edite um estudo gerado ou comece do zero. O conteúdo é salvo como nota privada.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button type="button" onClick={openOrganizer} className="rounded-xl border px-4 py-2 flex items-center gap-2"><FilePenLine className="w-4 h-4" /> {organizeOpen ? "Fechar blocos" : "Organizar blocos"}</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-2 flex items-center gap-2"><Printer className="w-4 h-4" /> Imprimir</button>
          <button type="button" disabled={busy} onClick={() => void save()} className="rounded-xl bg-amber-600 text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" /> {busy ? "Salvando…" : saved ? "Salvo" : "Salvar"}</button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3">{error} <button className="underline" onClick={() => void save()}>Tentar novamente</button></p>}
      {saved && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3 flex items-center gap-2"><Check className="w-4 h-4" /> Estudo salvo no caderno ministerial.</p>}
      {organizeOpen && <section className="bg-slate-50 rounded-2xl border p-4 space-y-3 no-print"><div className="flex items-center justify-between"><div><h2 className="font-bold">Blocos do estudo</h2><p className="text-xs text-slate-600">Reordene os tópicos e edite cada seção sem perder o Markdown salvo.</p></div><button type="button" onClick={addBlock} className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Novo bloco</button></div>{blocks.map((block, index) => <article key={`${index}-${block.title}`} className="bg-white rounded-xl border p-3 space-y-2"><div className="flex items-center gap-2"><input aria-label={`Título do bloco ${index + 1}`} value={block.title} onChange={(event) => updateBlock(index, { title: event.target.value })} className="flex-1 rounded-lg border p-2 font-semibold" /><button type="button" disabled={index === 0} onClick={() => moveBlock(index, -1)} className="p-2 border rounded-lg disabled:opacity-40" title="Mover para cima"><ArrowUp className="w-4 h-4" /></button><button type="button" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} className="p-2 border rounded-lg disabled:opacity-40" title="Mover para baixo"><ArrowDown className="w-4 h-4" /></button></div><textarea aria-label={`Conteúdo do bloco ${index + 1}`} value={block.body} onChange={(event) => updateBlock(index, { body: event.target.value })} className="w-full min-h-24 rounded-lg border p-3 text-sm" /></article>)}</section>}
      <div className="bg-white rounded-3xl border shadow-sm p-5 sm:p-8 space-y-4">
        <label className="block text-sm font-semibold">Título<input value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3 font-serif text-lg" /></label>
        <label className="block text-sm font-semibold">Texto ou referência bíblica<input value={reference} onChange={(event) => { setReference(event.target.value); setSaved(false); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3" /></label>
        <label className="block text-sm font-semibold">Conteúdo<textarea value={content} onChange={(event) => { setContent(event.target.value); setSaved(false); }} maxLength={50000} className="mt-1 block w-full min-h-[520px] rounded-xl border p-4 font-mono text-sm leading-relaxed" /></label>
        <p className="text-xs text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Revise referências e aplicações antes de ensinar ou pregar.</p>
      </div>
    </section>
  );
}
