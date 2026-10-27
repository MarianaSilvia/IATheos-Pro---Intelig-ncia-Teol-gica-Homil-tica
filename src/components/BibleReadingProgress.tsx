import React, { useState } from "react";
import {
  BIBLE_BOOKS,
  calculateBibleYearProgress,
  formatChapterKey,
} from "../utils/bibleProgress";
import { useResource } from "../hooks/useResource";
import { api } from "../lib/api";
export function BibleReadingProgress({
  onNavigateToBible,
}: {
  onNavigateToBible?: (book: string, chapter: number) => void;
}) {
  const resource = useResource<string[]>("/reading", []);
  const [bookId, setBookId] = useState("rm");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const book = BIBLE_BOOKS.find((b) => b.id === bookId)!;
  const stats = calculateBibleYearProgress(resource.data);
  async function toggle(chapter: number) {
    if (busy || resource.loading) return;
    setBusy(true);
    setError("");
    const key = formatChapterKey(bookId, chapter);
    try {
      const completed = !resource.data.includes(key);
      await api("/reading/" + encodeURIComponent(key), {
        method: "PUT",
        body: JSON.stringify({ completed }),
      });
      await resource.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="bg-white rounded-3xl border p-6 space-y-4">
      <h2 className="text-xl font-serif font-bold">
        Progresso de leitura bíblica
      </h2>
      <p>
        {stats.totalCompleted} de {stats.totalChapters} capítulos ·{" "}
        {stats.overallPercentage}%
      </p>
      <progress
        aria-label="Progresso bíblico"
        className="w-full"
        max={1189}
        value={stats.totalCompleted}
      />
      {(error || resource.error) && (
        <p role="alert">
          {error || resource.error}{" "}
          <button onClick={() => void resource.reload()}>
            Tentar novamente
          </button>
        </p>
      )}
      <label>
        Livro{" "}
        <select
          className="border p-2 rounded-xl"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        >
          {BIBLE_BOOKS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {resource.loading ? (
        <p>Carregando progresso…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map(
            (chapter) => (
              <button
                key={chapter}
                aria-label={book.name + " " + chapter}
                aria-pressed={resource.data.includes(
                  formatChapterKey(bookId, chapter),
                )}
                disabled={busy}
                onClick={() => void toggle(chapter)}
                className={
                  "w-10 h-10 border rounded-xl " +
                  (resource.data.includes(formatChapterKey(bookId, chapter))
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-50")
                }
              >
                {chapter}
              </button>
            ),
          )}
        </div>
      )}
      <p className="text-sm text-slate-500">
        Marque ou desmarque os capítulos lidos. As alterações são confirmadas na
        nuvem.
      </p>
      {onNavigateToBible && (
        <button
          className="text-amber-700 underline"
          onClick={() => onNavigateToBible(book.name, 1)}
        >
          Abrir {book.name} na Bíblia
        </button>
      )}
    </section>
  );
}
