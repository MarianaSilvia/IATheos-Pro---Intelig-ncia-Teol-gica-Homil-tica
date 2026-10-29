import React, { useEffect, useMemo, useState } from "react";
import { Check, FileText, Printer, Save } from "lucide-react";
import { api } from "../lib/api";
import type { EbdLesson, SermonOutline, VerseXray } from "../utils/theology";
import { formatEbdToMarkdown, formatSermonToMarkdown, formatVerseXrayToMarkdown } from "../utils/theology";

type StudySource = SermonOutline | EbdLesson | VerseXray | null;

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

export function EditorView({ source }: { source: StudySource }) {
  const [title, setTitle] = useState(sourceTitle(source));
  const [reference, setReference] = useState(sourceReference(source));
  const [content, setContent] = useState(sourceMarkdown(source));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const seed = useMemo(() => sourceTitle(source) + sourceReference(source), [source]);

  useEffect(() => {
    setTitle(sourceTitle(source));
    setReference(sourceReference(source));
    setContent(sourceMarkdown(source));
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

  return (
    <section className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Editor ministerial</span>
          <h1 className="text-3xl font-serif font-bold">Organize sua mensagem</h1>
          <p className="text-sm text-slate-600">Edite um estudo gerado ou comece do zero. O conteúdo é salvo como nota privada.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-2 flex items-center gap-2"><Printer className="w-4 h-4" /> Imprimir</button>
          <button type="button" disabled={busy} onClick={() => void save()} className="rounded-xl bg-amber-600 text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" /> {busy ? "Salvando…" : saved ? "Salvo" : "Salvar"}</button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3">{error} <button className="underline" onClick={() => void save()}>Tentar novamente</button></p>}
      {saved && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3 flex items-center gap-2"><Check className="w-4 h-4" /> Estudo salvo no caderno ministerial.</p>}
      <div className="bg-white rounded-3xl border shadow-sm p-5 sm:p-8 space-y-4">
        <label className="block text-sm font-semibold">Título<input value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3 font-serif text-lg" /></label>
        <label className="block text-sm font-semibold">Texto ou referência bíblica<input value={reference} onChange={(event) => { setReference(event.target.value); setSaved(false); }} maxLength={300} className="mt-1 block w-full rounded-xl border p-3" /></label>
        <label className="block text-sm font-semibold">Conteúdo<textarea value={content} onChange={(event) => { setContent(event.target.value); setSaved(false); }} maxLength={50000} className="mt-1 block w-full min-h-[520px] rounded-xl border p-4 font-mono text-sm leading-relaxed" /></label>
        <p className="text-xs text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Revise referências e aplicações antes de ensinar ou pregar.</p>
      </div>
    </section>
  );
}
