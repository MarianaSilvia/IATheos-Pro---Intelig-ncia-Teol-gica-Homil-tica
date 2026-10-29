import React, { useMemo, useState } from "react";
import { BookOpen, Check, Copy, Eye, Music, Search, Sparkles } from "lucide-react";
import { BIBLE_BOOKS } from "../utils/bibleProgress";
import { INITIAL_HYMNS, searchHymns } from "../utils/ecosystem";
import { findBibleChapter } from "../utils/bibleContent";

const TRANSLATIONS = ["ARC", "NAA", "NVI", "KJF"] as const;

type Props = {
  initialBook?: string;
  initialChapter?: number;
  onSendToVerseXray: (verse: string) => void;
};

export function BibleAndHarpViewConnected({
  initialBook = "Romanos",
  initialChapter = 5,
  onSendToVerseXray,
}: Props) {
  const [tab, setTab] = useState<"bible" | "harp">("bible");
  const [book, setBook] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter);
  const [translation, setTranslation] = useState<(typeof TRANSLATIONS)[number]>("NAA");
  const [compareTranslation, setCompareTranslation] = useState<(typeof TRANSLATIONS)[number]>("ARC");
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(17);
  const [search, setSearch] = useState("");
  const [hymn, setHymn] = useState(INITIAL_HYMNS[0]);
  const [message, setMessage] = useState("");

  const selectedBook = BIBLE_BOOKS.find((item) => item.name === book) ?? BIBLE_BOOKS[0];
  const data = findBibleChapter(book, chapter, translation);
  const compareData = findBibleChapter(book, chapter, compareTranslation);
  const hymns = useMemo(() => searchHymns(INITIAL_HYMNS, search), [search]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Texto copiado.");
    } catch {
      setMessage("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  function changeBook(nextBook: string) {
    setBook(nextBook);
    setChapter(1);
    setSelectedVerse(null);
  }

  function changeChapter(nextChapter: number) {
    setChapter(nextChapter);
    setSelectedVerse(null);
  }

  function openXray(verse: number) {
    onSendToVerseXray(`${book} ${chapter}:${verse}`);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setTab("bible")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${tab === "bible" ? "bg-amber-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
            <BookOpen className="w-4 h-4" /> Leitor das Escrituras
          </button>
          <button type="button" onClick={() => setTab("harp")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${tab === "harp" ? "bg-amber-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
            <Music className="w-4 h-4" /> Harpa Cristã
          </button>
        </div>
        <span className="text-xs text-slate-400 hidden md:block px-3">Acervo parcial disponível</span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 flex items-start gap-2">
        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
        Bíblia e Harpa usam somente o conteúdo disponível e autorizado. Combinações ausentes são informadas sem inventar texto.
      </div>
      {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}

      {tab === "bible" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-end gap-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Livro
              <select className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold" value={book} onChange={(event) => changeBook(event.target.value)}>
                {BIBLE_BOOKS.map((item) => <option key={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Capítulo
              <select className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold" value={chapter} onChange={(event) => changeChapter(Number(event.target.value))}>
                {Array.from({ length: selectedBook.chaptersCount }, (_, index) => index + 1).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tradução
              <select className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold" value={translation} onChange={(event) => setTranslation(event.target.value as (typeof TRANSLATIONS)[number])}>
                {TRANSLATIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => setCompareOpen((value) => !value)} className="px-3 py-2 rounded-xl border border-amber-300 text-amber-800 text-sm font-bold">
              {compareOpen ? "Fechar comparação" : "Comparar versões"}
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              Fonte <button type="button" onClick={() => setFontSize((value) => Math.max(13, value - 1))} className="px-2 py-1 border rounded">A-</button>
              <span>{fontSize}px</span>
              <button type="button" onClick={() => setFontSize((value) => Math.min(26, value + 1))} className="px-2 py-1 border rounded">A+</button>
            </div>
          </div>

          {compareOpen && (
            <div className="bg-slate-50 rounded-2xl border p-4">
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <p className="text-sm font-bold text-slate-700">{book} {chapter}</p>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Versão de comparação
                  <select className="block mt-1 px-3 py-2 rounded-xl border text-sm" value={compareTranslation} onChange={(event) => setCompareTranslation(event.target.value as (typeof TRANSLATIONS)[number])}>
                    {TRANSLATIONS.filter((item) => item !== translation).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              {data && compareData ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[data, compareData].map((version) => (
                    <article key={version.translation} className="bg-white rounded-xl border p-4">
                      <h2 className="font-bold text-amber-800 mb-3">{version.translation}</h2>
                      <div className="space-y-2 text-sm">{version.verses.map((verse) => <p key={verse.number}><strong className="text-amber-700">{verse.number}</strong> {verse.text}</p>)}</div>
                    </article>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-600">A comparação só está disponível quando as duas versões estiverem no acervo para este capítulo.</p>}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4"><h1 className="text-2xl sm:text-3xl font-extrabold font-serif">{book} {chapter}</h1><span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">Tradução: {translation}</span></div>
            {data ? <div className="space-y-3 mt-6" style={{ fontSize: `${fontSize}px` }}>
              {data.verses.map((verse) => <div key={verse.number} role="button" tabIndex={0} onClick={() => setSelectedVerse(verse.number)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedVerse(verse.number); }} className={`p-3 rounded-xl hover:bg-slate-50 flex items-start gap-3 group cursor-pointer ${selectedVerse === verse.number ? "bg-amber-50 ring-1 ring-amber-300" : ""}`}>
                <span className="font-mono font-bold text-amber-600 text-sm pt-1 w-6 text-right">{verse.number}</span><p className="flex-1 font-serif text-slate-800 leading-relaxed">{verse.text}</p>
                <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex items-center gap-1"><button type="button" onClick={(event) => { event.stopPropagation(); void copy(`"${verse.text}" (${book} ${chapter}:${verse.number} - ${translation})`); }} className="p-1 text-slate-400 hover:text-slate-700" title="Copiar"><Copy className="w-3.5 h-3.5" /></button><button type="button" onClick={(event) => { event.stopPropagation(); openXray(verse.number); }} className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold" title="Abrir no Raio-X"><Eye className="w-3 h-3 inline mr-1" />Raio-X</button></div>
              </div>)}
            </div> : <p role="status" className="mt-6 text-slate-600">Texto indisponível para esta combinação de livro, capítulo e tradução.</p>}
            {selectedVerse && <p className="mt-4 text-xs text-slate-500">Versículo {selectedVerse} selecionado. Use copiar ou Raio‑X para continuar o estudo.</p>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="lg:col-span-5 space-y-3"><div className="bg-white rounded-2xl border p-3 shadow-sm relative"><Search className="w-4 h-4 text-slate-400 absolute left-6 top-6" /><input aria-label="Buscar hino" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar hino por número ou título" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm" /></div><div className="bg-white rounded-2xl border shadow-sm overflow-y-auto max-h-[600px] divide-y">{hymns.map((item) => <button type="button" key={item.number} onClick={() => setHymn(item)} className={`w-full text-left p-4 hover:bg-amber-50 ${hymn.number === item.number ? "bg-amber-50 border-l-4 border-amber-500" : ""}`}><span className="text-xs font-mono text-amber-700">HINO {item.number}</span><span className="block font-bold text-slate-800">{item.title}</span></button>)}</div></div><article className="lg:col-span-7 bg-white rounded-3xl border shadow-lg p-6 sm:p-10"><span className="text-xs uppercase font-bold tracking-wider text-amber-700">Harpa Cristã · Hino {hymn.number}</span><h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">{hymn.title}</h1><div className="border-t my-6 pt-6 space-y-5 text-slate-800 leading-relaxed"><div><span className="text-xs font-bold uppercase text-amber-700">Refrão</span><p className="whitespace-pre-wrap font-serif mt-2">{hymn.chorus}</p></div>{hymn.stanzas.map((stanza, index) => <p key={index} className="whitespace-pre-wrap font-serif">{stanza}</p>)}</div><button type="button" onClick={() => void copy(`HARPA CRISTÃ - HINO ${hymn.number}: ${hymn.title}\n\n${hymn.chorus}\n\n${hymn.stanzas.join("\n\n")}`)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Copiar hino</button></article></div>
      )}
    </div>
  );
}
