import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Eye,
  Music,
  Search,
  Sparkles,
} from "lucide-react";
import { BIBLE_BOOKS, formatChapterKey } from "../utils/bibleProgress";
import { INITIAL_HYMNS, searchHymns } from "../utils/ecosystem";
import { findBibleChapter } from "../utils/bibleContent";
import { api } from "../lib/api";
import {
  INITIAL_CONCORDANCE_ENTRIES,
  normalizeReferenceSearch,
} from "../utils/dashboard";
import {
  clearOfflineBibleChapters,
  readOfflineBibleChapters,
  toggleOfflineBibleChapter,
  offlineBibleKey,
  writeOfflineBibleChapters,
  type OfflineBibleChapter,
} from "../utils/offlineBible";
import {
  formatVerseReference,
  parseBibleReference,
  toggleVerseSelection,
} from "../utils/bibleSelection";

const TRANSLATIONS = ["ARC", "NAA", "NVI", "KJF"] as const;

type Props = {
  initialBook?: string;
  initialChapter?: number;
  initialReference?: string;
  onSendToVerseXray: (verse: string) => void;
  onSendToSermon?: (verse: string) => void;
  onSendToEbd?: (verse: string) => void;
  onSendToEditor?: (verse: string, text: string) => void;
  onOpenBible?: (reference: string) => void;
  onOpenDictionary?: (reference: string) => void;
  onOpenConcordance?: (reference: string) => void;
};

export function BibleAndHarpViewConnected({
  initialBook = "Romanos",
  initialChapter = 5,
  initialReference = "",
  onSendToVerseXray,
  onSendToSermon,
  onSendToEbd,
  onSendToEditor,
  onOpenBible,
  onOpenDictionary,
  onOpenConcordance,
}: Props) {
  const [tab, setTab] = useState<"bible" | "harp">("bible");
  const [book, setBook] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter);
  const [translation, setTranslation] =
    useState<(typeof TRANSLATIONS)[number]>("NAA");
  const [compareTranslation, setCompareTranslation] =
    useState<(typeof TRANSLATIONS)[number]>("ARC");
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<number[]>(() => {
    const parsed = parseBibleReference(initialReference);
    return parsed && parsed.book === initialBook && parsed.chapter === initialChapter
      ? parsed.verses ?? []
      : [];
  });
  const [fontSize, setFontSize] = useState(17);
  const [search, setSearch] = useState("");
  const [hymn, setHymn] = useState(INITIAL_HYMNS[0]);
  const [message, setMessage] = useState("");
  const [offlineChapters, setOfflineChapters] = useState<OfflineBibleChapter[]>(
    () => readOfflineBibleChapters(),
  );
  const [chapterRead, setChapterRead] = useState(false);
  const [readingBusy, setReadingBusy] = useState(false);
  const [readingSyncState, setReadingSyncState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [readingRetryValue, setReadingRetryValue] = useState<boolean | null>(null);
  const [comparisonSaving, setComparisonSaving] = useState(false);

  const selectedBook =
    BIBLE_BOOKS.find((item) => item.name === book) ?? BIBLE_BOOKS[0];
  const cachedOfflineChapter = offlineChapters.find(
    (item) =>
      item.book === book &&
      item.chapter === chapter &&
      item.translation === translation,
  );
  const data =
    findBibleChapter(book, chapter, translation) ??
    (cachedOfflineChapter?.verses
      ? { book, chapter, translation, verses: cachedOfflineChapter.verses }
      : null);
  const compareData = findBibleChapter(book, chapter, compareTranslation);
  const hymns = useMemo(() => searchHymns(INITIAL_HYMNS, search), [search]);
  const relatedReferences = useMemo(() => {
    if (!data || selectedVerses.length === 0) return [];
    const verseText = data.verses
      .filter((verse) => selectedVerses.includes(verse.number))
      .map((verse) => verse.text)
      .join(" ");
    const normalizedText = normalizeReferenceSearch(verseText);
    const currentReference = normalizeReferenceSearch(
      formatVerseReference(book, chapter, selectedVerses),
    );
    return Object.entries(INITIAL_CONCORDANCE_ENTRIES)
      .filter(
        ([term, entry]) =>
          normalizedText.includes(normalizeReferenceSearch(term)) ||
          normalizedText.includes(normalizeReferenceSearch(entry.word)),
      )
      .flatMap(([, entry]) => entry.verses.map((verse) => verse.reference))
      .filter(
        (reference, index, list) =>
          list.indexOf(reference) === index &&
          normalizeReferenceSearch(reference) !== currentReference,
      )
      .slice(0, 6);
  }, [book, chapter, data, selectedVerses]);

  useEffect(() => {
    let active = true;
    setChapterRead(false);
    setReadingSyncState("idle");
    setReadingRetryValue(null);
    void api<string[]>("/reading")
      .then((completed) => {
        if (active)
          setChapterRead(
            completed.includes(formatChapterKey(selectedBook.id, chapter)),
          );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [chapter, selectedBook.id]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Texto copiado.");
    } catch {
      setMessage("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  async function saveSelectedVerse() {
    if (!data || selectedVerses.length === 0) return;
    const verses = data.verses.filter((item) =>
      selectedVerses.includes(item.number),
    );
    if (!verses.length) return;
    const reference = formatVerseReference(book, chapter, selectedVerses);
    try {
      await api(`/notes/${crypto.randomUUID()}`, {
        method: "PUT",
        body: JSON.stringify({
          title: reference,
          biblicalReference: reference,
          content: `${verses.map((verse) => `${verse.number}. ${verse.text}`).join("\n\n")}\n\nTradução: ${translation}`,
        }),
      });
      setMessage("Versículo salvo nas suas notas.");
    } catch {
      setMessage("Não foi possível salvar a nota. Tente novamente.");
    }
  }

  function selectedPassageText(): string {
    if (!data || selectedVerses.length === 0) return "";
    const reference = formatVerseReference(book, chapter, selectedVerses);
    const text = data.verses
      .filter((verse) => selectedVerses.includes(verse.number))
      .map((verse) => `${verse.number}. ${verse.text}`)
      .join("\n\n");
    return `${text}\n\n(${reference} · ${translation})`;
  }

  function comparisonPassageText(): string {
    if (!data || !compareData) return "";
    const numbers = selectedVerses.length > 0
      ? selectedVerses
      : data.verses.map((verse) => verse.number);
    const formatVersion = (version: typeof data) => `${version.translation}\n${version.verses
      .filter((verse) => numbers.includes(verse.number))
      .map((verse) => `${verse.number}. ${verse.text}`)
      .join("\n")}`;
    return `${book} ${chapter}\n\n${formatVersion(data)}\n\n${formatVersion(compareData)}`;
  }

  function relatedReferenceText(reference: string): string {
    const parsed = parseBibleReference(reference);
    if (!parsed) return "";
    const relatedData = findBibleChapter(parsed.book, parsed.chapter, translation);
    if (!relatedData) return "";
    const verses = parsed.verses?.length
      ? relatedData.verses.filter((verse) => parsed.verses?.includes(verse.number))
      : relatedData.verses;
    return verses.map((verse) => `${verse.number}. ${verse.text}`).join("\n\n");
  }

  async function saveComparison() {
    const content = comparisonPassageText();
    if (!content || comparisonSaving) return;
    setComparisonSaving(true);
    const reference = formatVerseReference(book, chapter, selectedVerses);
    try {
      await api(`/notes/${crypto.randomUUID()}`, {
        method: "PUT",
        body: JSON.stringify({
          title: `Comparação: ${reference}`,
          biblicalReference: reference,
          content,
        }),
      });
      setMessage("Comparação salva nas suas notas.");
    } catch {
      setMessage("Não foi possível salvar a comparação. Tente novamente.");
    } finally {
      setComparisonSaving(false);
    }
  }

  async function saveHymn() {
    try {
      await api(`/notes/${crypto.randomUUID()}`, {
        method: "PUT",
        body: JSON.stringify({
          title: `Harpa Cristã ${hymn.number} — ${hymn.title}`,
          biblicalReference: `Harpa Cristã ${hymn.number}`,
          content: `# ${hymn.title}\n\n${hymn.chorus}\n\n${hymn.stanzas.join("\n\n")}`,
        }),
      });
      setMessage("Hino salvo nas suas notas.");
    } catch {
      setMessage("Não foi possível salvar o hino. Tente novamente.");
    }
  }

  function changeBook(nextBook: string) {
    setBook(nextBook);
    setChapter(1);
    setSelectedVerses([]);
  }

  function changeChapter(nextChapter: number) {
    setChapter(nextChapter);
    setSelectedVerses([]);
  }

  const currentOfflineChapter: OfflineBibleChapter = {
    book,
    chapter,
    translation,
    ...(data ? { verses: data.verses } : {}),
  };
  const currentOfflineKey = offlineBibleKey(currentOfflineChapter);
  const isCurrentChapterOffline = offlineChapters.some(
    (item) => offlineBibleKey(item) === currentOfflineKey,
  );

  function toggleCurrentChapterOffline() {
    const next = toggleOfflineBibleChapter(
      offlineChapters,
      currentOfflineChapter,
    );
    if (!writeOfflineBibleChapters(next)) {
      setMessage("Não foi possível guardar este capítulo para uso offline.");
      return;
    }
    setOfflineChapters(next);
    setMessage(
      next.some((item) => offlineBibleKey(item) === currentOfflineKey)
        ? "Capítulo disponível offline neste dispositivo."
        : "Capítulo removido do uso offline.",
    );
  }

  async function toggleChapterRead() {
    if (readingBusy) return;
    setReadingBusy(true);
    const completed = !chapterRead;
    setReadingSyncState("saving");
    setReadingRetryValue(null);
    try {
      await api(
        `/reading/${encodeURIComponent(formatChapterKey(selectedBook.id, chapter))}`,
        {
          method: "PUT",
          body: JSON.stringify({ completed }),
        },
      );
      setChapterRead(completed);
      setMessage(
        completed
          ? "Capítulo marcado como lido."
          : "Capítulo retirado do progresso.",
      );
      setReadingSyncState("saved");
    } catch {
      setMessage("Não foi possível atualizar o progresso. Tente novamente.");
      setReadingSyncState("error");
      setReadingRetryValue(completed);
    } finally {
      setReadingBusy(false);
    }
  }

  function removeOfflineChapter(chapterToRemove: OfflineBibleChapter) {
    const next = offlineChapters.filter(
      (item) => offlineBibleKey(item) !== offlineBibleKey(chapterToRemove),
    );
    if (!writeOfflineBibleChapters(next)) {
      setMessage("Não foi possível atualizar os capítulos offline.");
      return;
    }
    setOfflineChapters(next);
    setMessage("Capítulo removido do uso offline.");
  }

  function openOfflineChapter(chapterToOpen: OfflineBibleChapter) {
    setTab("bible");
    setBook(chapterToOpen.book);
    setChapter(chapterToOpen.chapter);
    setTranslation(chapterToOpen.translation as (typeof TRANSLATIONS)[number]);
    setSelectedVerses([]);
    setMessage(
      `Abrindo ${chapterToOpen.book} ${chapterToOpen.chapter} · ${chapterToOpen.translation}.`,
    );
  }

  function openXray(verses: number[]) {
    onSendToVerseXray(formatVerseReference(book, chapter, verses));
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("bible")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${tab === "bible" ? "bg-amber-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <BookOpen className="w-4 h-4" /> Leitor das Escrituras
          </button>
          <button
            type="button"
            onClick={() => setTab("harp")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${tab === "harp" ? "bg-amber-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Music className="w-4 h-4" /> Harpa Cristã
          </button>
        </div>
        <span className="text-xs text-slate-400 hidden md:block px-3">
          Acervo parcial disponível
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 flex items-start gap-2">
        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
        Bíblia e Harpa usam somente o conteúdo disponível e autorizado.
        Combinações ausentes são informadas sem inventar texto.
      </div>
      {message && <p role={readingSyncState === "error" ? "alert" : "status"} className={`text-sm ${readingSyncState === "error" ? "text-red-700" : "text-emerald-700"}`}>{message}{readingRetryValue !== null && <button type="button" className="ml-2 underline font-semibold" onClick={() => void toggleChapterRead()}>Tentar novamente</button>}</p>}
      {readingSyncState === "saving" && <p role="status" className="rounded-xl bg-amber-50 text-amber-800 p-3">Sincronizando progresso de leitura…</p>}
      {readingSyncState === "saved" && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 p-3">Progresso de leitura sincronizado.</p>}

      {offlineChapters.length > 0 && (
        <section
          aria-label="Capítulos disponíveis offline"
          className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-emerald-900">
                Leitura offline neste dispositivo
              </h2>
              <p className="text-xs text-slate-600">
                O texto público disponível é guardado localmente; notas, compras
                e dados privados não entram no cache.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                {offlineChapters.length} capítulo
                {offlineChapters.length === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                className="text-xs text-emerald-800 underline"
                onClick={() => {
                  if (!clearOfflineBibleChapters()) {
                    setMessage("Não foi possível limpar o cache offline.");
                    return;
                  }
                  setOfflineChapters([]);
                  setMessage("Cache bíblico offline limpo neste dispositivo.");
                }}
              >
                Limpar cache
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {offlineChapters.map((item) => (
              <div
                key={offlineBibleKey(item)}
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/60 pl-2 text-xs text-emerald-950"
              >
                <button
                  type="button"
                  className="py-1 font-semibold underline"
                  onClick={() => openOfflineChapter(item)}
                >
                  {item.book} {item.chapter} · {item.translation}
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-emerald-700"
                  aria-label={`Remover ${item.book} ${item.chapter} do offline`}
                  onClick={() => removeOfflineChapter(item)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "bible" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-end gap-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Livro
              <select
                className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold"
                value={book}
                onChange={(event) => changeBook(event.target.value)}
              >
                {BIBLE_BOOKS.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Capítulo
              <select
                className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold"
                value={chapter}
                onChange={(event) => changeChapter(Number(event.target.value))}
              >
                {Array.from(
                  { length: selectedBook.chaptersCount },
                  (_, index) => index + 1,
                ).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tradução
              <select
                className="block mt-1 px-3 py-2 rounded-xl border text-sm font-bold"
                value={translation}
                onChange={(event) =>
                  setTranslation(
                    event.target.value as (typeof TRANSLATIONS)[number],
                  )
                }
              >
                {TRANSLATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setCompareOpen((value) => !value)}
              className="px-3 py-2 rounded-xl border border-amber-300 text-amber-800 text-sm font-bold"
            >
              {compareOpen ? "Fechar comparação" : "Comparar versões"}
            </button>
            <button
              type="button"
              disabled={!data}
              onClick={toggleCurrentChapterOffline}
              className={`px-3 py-2 rounded-xl border text-sm font-bold disabled:opacity-50 ${isCurrentChapterOffline ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700"}`}
              title="Guarda o texto público local disponível; não armazena dados privados"
            >
              <Download className="w-4 h-4 inline mr-1" />
              {isCurrentChapterOffline
                ? "Disponível offline"
                : "Disponibilizar offline"}
            </button>
            <button
              type="button"
              disabled={readingBusy}
              onClick={() => void toggleChapterRead()}
              className={`px-3 py-2 rounded-xl border text-sm font-bold disabled:opacity-50 ${chapterRead ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700"}`}
            >
              <Check className="w-4 h-4 inline mr-1" />
              {chapterRead ? "Capítulo lido" : "Marcar como lido"}
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              Fonte{" "}
              <button
                type="button"
                onClick={() => setFontSize((value) => Math.max(13, value - 1))}
                className="px-2 py-1 border rounded"
              >
                A-
              </button>
              <span>{fontSize}px</span>
              <button
                type="button"
                onClick={() => setFontSize((value) => Math.min(26, value + 1))}
                className="px-2 py-1 border rounded"
              >
                A+
              </button>
            </div>
          </div>

          {compareOpen && (
            <div className="bg-slate-50 rounded-2xl border p-4">
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <p className="text-sm font-bold text-slate-700">
                  {book} {chapter}
                </p>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Versão de comparação
                  <select
                    className="block mt-1 px-3 py-2 rounded-xl border text-sm"
                    value={compareTranslation}
                    onChange={(event) =>
                      setCompareTranslation(
                        event.target.value as (typeof TRANSLATIONS)[number],
                      )
                    }
                  >
                    {TRANSLATIONS.filter((item) => item !== translation).map(
                      (item) => (
                        <option key={item}>{item}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              {data && compareData ? (
                <>
                <div className="grid md:grid-cols-2 gap-4">
                  {[data, compareData].map((version) => (
                    <article
                      key={version.translation}
                      className="bg-white rounded-xl border p-4"
                    >
                      <h2 className="font-bold text-amber-800 mb-3">
                        {version.translation}
                      </h2>
                      <div className="space-y-2 text-sm">
                        {version.verses
                          .filter((verse) => selectedVerses.length === 0 || selectedVerses.includes(verse.number))
                          .map((verse) => (
                          <p key={verse.number}>
                            <strong className="text-amber-700">
                              {verse.number}
                            </strong>{" "}
                            {verse.text}
                          </p>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void copy(comparisonPassageText())} className="rounded-xl border border-indigo-300 bg-white px-3 py-2 text-sm font-bold text-indigo-900">Copiar comparação</button>
                  <button type="button" disabled={comparisonSaving} onClick={() => void saveComparison()} className="rounded-xl bg-indigo-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">{comparisonSaving ? "Salvando…" : "Salvar nas notas"}</button>
                  {onSendToEditor && <button type="button" onClick={() => onSendToEditor(formatVerseReference(book, chapter, selectedVerses), comparisonPassageText())} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-bold text-white">Enviar ao Editor</button>}
                </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  A comparação só está disponível quando as duas versões
                  estiverem no acervo para este capítulo.
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                {book} {chapter}
              </h1>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                Tradução: {translation}
              </span>
            </div>
            {data ? (
              <div
                className="space-y-3 mt-6"
                style={{ fontSize: `${fontSize}px` }}
              >
                {data.verses.map((verse) => (
                  <div
                    key={verse.number}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedVerses.includes(verse.number)}
                    onClick={() =>
                      setSelectedVerses((current) =>
                        toggleVerseSelection(current, verse.number),
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedVerses((current) =>
                          toggleVerseSelection(current, verse.number),
                        );
                      }
                    }}
                    className={`p-3 rounded-xl hover:bg-slate-50 flex items-start gap-3 group cursor-pointer ${selectedVerses.includes(verse.number) ? "bg-amber-50 ring-1 ring-amber-300" : ""}`}
                  >
                    <span className="font-mono font-bold text-amber-600 text-sm pt-1 w-6 text-right">
                      {verse.number}
                    </span>
                    <p className="flex-1 font-serif text-slate-800 leading-relaxed">
                      {verse.text}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void copy(
                            `"${verse.text}" (${book} ${chapter}:${verse.number} - ${translation})`,
                          );
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Copiar"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openXray([verse.number]);
                        }}
                        className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold"
                        title="Abrir no Raio-X"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        Explicar com IA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p role="status" className="mt-6 text-slate-600">
                Texto indisponível para esta combinação de livro, capítulo e
                tradução.
              </p>
            )}
            {selectedVerses.length > 0 && data && (
              <section
                aria-label="Passagem ativa"
                className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-700">
                      Passagem ativa · {selectedVerses.length} versículo
                      {selectedVerses.length === 1 ? "" : "s"}
                    </span>
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      {formatVerseReference(book, chapter, selectedVerses)}
                    </h2>
                    <span className="text-xs text-slate-600">
                      Tradução: {translation}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedVerses([])}
                    className="text-xs text-slate-600 underline"
                  >
                    Limpar seleção
                  </button>
                </div>
                <p className="mt-3 font-serif leading-relaxed text-slate-800">
                  {data.verses
                    .filter((verse) => selectedVerses.includes(verse.number))
                    .map((verse) => `${verse.number}. ${verse.text}`)
                    .join(" ")}
                </p>
                {relatedReferences.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-700">
                      Referências relacionadas do acervo parcial
                    </span>
                    <div className="mt-2 space-y-2">
                      {relatedReferences.map((reference) => (
                        <div key={reference} className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-100 bg-white px-2 py-1.5">
                          <span className="text-xs font-semibold text-indigo-950">{reference}</span>
                          {onOpenBible && <button type="button" onClick={() => onOpenBible(reference)} className="text-[11px] font-semibold text-emerald-800 underline">Bíblia</button>}
                          <button type="button" onClick={() => onSendToVerseXray(reference)} className="text-[11px] font-semibold text-amber-800 underline">Raio‑X</button>
                          {onSendToEditor && <button type="button" onClick={() => onSendToEditor(reference, relatedReferenceText(reference))} className="text-[11px] font-semibold text-indigo-800 underline">Editor</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => void copy(selectedPassageText())}
                    className="rounded-lg border border-indigo-300 bg-white text-indigo-900 px-3 py-1.5 font-bold"
                  >
                    Copiar trecho
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveSelectedVerse()}
                    className="rounded-lg bg-slate-900 text-white px-3 py-1.5 font-bold"
                  >
                    Salvar nota
                  </button>
                  <button
                    type="button"
                    onClick={() => openXray(selectedVerses)}
                    className="rounded-lg bg-amber-100 text-amber-900 px-3 py-1.5 font-bold"
                  >
                    Raio‑X / explicar com IA
                  </button>
                  {onOpenBible && <button type="button" onClick={() => onOpenBible(formatVerseReference(book, chapter, selectedVerses))} className="rounded-lg bg-emerald-100 text-emerald-900 px-3 py-1.5 font-bold">Bíblia</button>}
                  {onSendToSermon && (
                    <button
                      type="button"
                      onClick={() =>
                        onSendToSermon(
                          formatVerseReference(book, chapter, selectedVerses),
                        )
                      }
                      className="rounded-lg bg-indigo-100 text-indigo-900 px-3 py-1.5 font-bold"
                    >
                      Sermão
                    </button>
                  )}
                  {onSendToEbd && (
                    <button
                      type="button"
                      onClick={() =>
                        onSendToEbd(
                          formatVerseReference(book, chapter, selectedVerses),
                        )
                      }
                      className="rounded-lg bg-emerald-100 text-emerald-900 px-3 py-1.5 font-bold"
                    >
                      EBD
                    </button>
                  )}
                  {onSendToEditor && (
                    <button
                      type="button"
                      onClick={() =>
                        onSendToEditor(
                          formatVerseReference(book, chapter, selectedVerses),
                          data.verses
                            .filter((verse) =>
                              selectedVerses.includes(verse.number),
                            )
                            .map((verse) => `${verse.number}. ${verse.text}`)
                            .join("\n\n"),
                        )
                      }
                      className="rounded-lg bg-violet-100 text-violet-900 px-3 py-1.5 font-bold"
                    >
                      Editor
                    </button>
                  )}
                  {onOpenDictionary && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenDictionary(
                          formatVerseReference(book, chapter, selectedVerses),
                        )
                      }
                      className="rounded-lg bg-white border border-indigo-200 text-indigo-900 px-3 py-1.5 font-bold"
                    >
                      Dicionário
                    </button>
                  )}
                  {onOpenConcordance && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenConcordance(
                          formatVerseReference(book, chapter, selectedVerses),
                        )
                      }
                      className="rounded-lg bg-white border border-indigo-200 text-indigo-900 px-3 py-1.5 font-bold"
                    >
                      Concordância
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border p-3 shadow-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-6 top-6" />
              <input
                aria-label="Buscar hino"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar hino por número ou título"
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm"
              />
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-y-auto max-h-[600px] divide-y">
              {hymns.map((item) => (
                <button
                  type="button"
                  key={item.number}
                  onClick={() => setHymn(item)}
                  className={`w-full text-left p-4 hover:bg-amber-50 ${hymn.number === item.number ? "bg-amber-50 border-l-4 border-amber-500" : ""}`}
                >
                  <span className="text-xs font-mono text-amber-700">
                    HINO {item.number}
                  </span>
                  <span className="block font-bold text-slate-800">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <article className="lg:col-span-7 bg-white rounded-3xl border shadow-lg p-6 sm:p-10">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
              Harpa Cristã · Hino {hymn.number}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
              {hymn.title}
            </h1>
            <div className="border-t my-6 pt-6 space-y-5 text-slate-800 leading-relaxed">
              <div>
                <span className="text-xs font-bold uppercase text-amber-700">
                  Refrão
                </span>
                <p className="whitespace-pre-wrap font-serif mt-2">
                  {hymn.chorus}
                </p>
              </div>
              {hymn.stanzas.map((stanza, index) => (
                <p key={index} className="whitespace-pre-wrap font-serif">
                  {stanza}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  void copy(
                    `HARPA CRISTÃ - HINO ${hymn.number}: ${hymn.title}\n\n${hymn.chorus}\n\n${hymn.stanzas.join("\n\n")}`,
                  )
                }
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Copiar hino
              </button>
              <button
                type="button"
                onClick={() => void saveHymn()}
                className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-sm font-bold"
              >
                Salvar nas notas
              </button>
              {onSendToEditor && (
                <button
                  type="button"
                  onClick={() =>
                    onSendToEditor(
                      `Harpa Cristã ${hymn.number}`,
                      `${hymn.chorus}\n\n${hymn.stanzas.join("\n\n")}`,
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-violet-100 text-violet-900 text-sm font-bold"
                >
                  Abrir no Editor
                </button>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
