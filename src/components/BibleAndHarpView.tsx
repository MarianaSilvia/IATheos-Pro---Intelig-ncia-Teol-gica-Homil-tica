import React, { useState } from "react";
import { BIBLE_BOOKS } from "../utils/bibleProgress";
import { INITIAL_HYMNS, searchHymns } from "../utils/ecosystem";
import { findBibleChapter } from "../utils/bibleContent";
export function BibleAndHarpView({
  initialBook = "Romanos",
  initialChapter = 5,
  onSendToVerseXray,
}: {
  initialBook?: string;
  initialChapter?: number;
  onSendToVerseXray: (verse: string) => void;
}) {
  const [tab, setTab] = useState<"bible" | "harp">("bible");
  const [book, setBook] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter);
  const [translation, setTranslation] = useState("NAA");
  const [search, setSearch] = useState("");
  const [hymn, setHymn] = useState(INITIAL_HYMNS[0]);
  const [message, setMessage] = useState("");
  const selectedBook = BIBLE_BOOKS.find((b) => b.name === book)!;
  const data = findBibleChapter(book, chapter, translation);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Texto copiado.");
    } catch {
      setMessage("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Bíblia e Harpa Cristã</h1>
      <p className="bg-amber-50 p-4 rounded-xl">
        Acervo parcial: apenas os trechos e hinos já disponíveis. Capítulos
        completos e demais hinos serão adicionados em outra etapa.
      </p>
      <div className="flex gap-4">
        <button className="underline" onClick={() => setTab("bible")}>
          Bíblia
        </button>
        <button className="underline" onClick={() => setTab("harp")}>
          Harpa Cristã
        </button>
      </div>
      {message && <p role="status">{message}</p>}
      {tab === "bible" ? (
        <section className="bg-white border p-6 rounded-3xl space-y-5">
          <div className="flex flex-wrap gap-4">
            <label>
              Livro
              <select
                className="block border p-3 rounded-xl"
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1);
                }}
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.id}>{b.name}</option>
                ))}
              </select>
            </label>
            <label>
              Capítulo
              <select
                className="block border p-3 rounded-xl"
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
              >
                {Array.from(
                  { length: selectedBook.chaptersCount },
                  (_, i) => i + 1,
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tradução
              <select
                className="block border p-3 rounded-xl"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              >
                {["ARC", "NAA", "NVI", "KJF"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <h2 className="font-serif font-bold text-2xl">
            {book} {chapter} — {translation}
          </h2>
          {data ? (
            <>
              <p className="text-sm text-slate-500">
                Trecho disponível: versículos {data.verses[0].number}–
                {data.verses.at(-1)?.number}.
              </p>
              {data.verses.map((v) => (
                <article className="border-b py-4" key={v.number}>
                  <p className="font-serif text-lg">
                    <strong className="text-amber-700">{v.number} </strong>
                    {v.text}
                  </p>
                  <button
                    className="text-sm underline mr-5"
                    onClick={() =>
                      void copy(
                        v.text +
                          " (" +
                          data.book +
                          " " +
                          data.chapter +
                          ":" +
                          v.number +
                          " - " +
                          data.translation +
                          ")",
                      )
                    }
                  >
                    Copiar
                  </button>
                  <button
                    className="text-sm text-amber-700 underline"
                    onClick={() =>
                      onSendToVerseXray(
                        data.book + " " + data.chapter + ":" + v.number,
                      )
                    }
                  >
                    Raio-X
                  </button>
                </article>
              ))}
            </>
          ) : (
            <p role="status">
              Texto indisponível para este livro, capítulo e tradução no acervo
              atual.
            </p>
          )}
        </section>
      ) : (
        <section className="bg-white border rounded-3xl p-6 space-y-5">
          <label>
            Buscar entre {INITIAL_HYMNS.length} hinos disponíveis
            <input
              className="block border p-3 rounded-xl w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            {searchHymns(INITIAL_HYMNS, search).map((h) => (
              <button
                key={h.number}
                className="border p-3 rounded-xl"
                onClick={() => setHymn(h)}
              >
                {h.number} — {h.title}
              </button>
            ))}
          </div>
          <h2 className="font-serif font-bold text-2xl">
            {hymn.number} — {hymn.title}
          </h2>
          <p className="whitespace-pre-wrap">{hymn.chorus}</p>
          {hymn.stanzas.map((s, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {s}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
