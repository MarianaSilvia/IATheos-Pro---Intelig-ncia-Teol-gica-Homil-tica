export type OfflineBibleVerse = {
  number: number;
  text: string;
};

export type OfflineBibleChapter = {
  book: string;
  chapter: number;
  translation: string;
  verses?: OfflineBibleVerse[];
};

const STORAGE_KEY = "verbo-norte:offline-bible:v1";
export const MAX_OFFLINE_CHAPTERS = 30;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

export function offlineBibleKey(chapter: OfflineBibleChapter): string {
  return `${chapter.book}|${chapter.chapter}|${chapter.translation}`;
}

export function toggleOfflineBibleChapter(
  chapters: OfflineBibleChapter[],
  chapter: OfflineBibleChapter,
): OfflineBibleChapter[] {
  const key = offlineBibleKey(chapter);
  const exists = chapters.some((item) => offlineBibleKey(item) === key);
  return exists
    ? chapters.filter((item) => offlineBibleKey(item) !== key)
    : [...chapters, chapter].slice(-MAX_OFFLINE_CHAPTERS);
}

export function readOfflineBibleChapters(
  storage: StorageLike | null = browserStorage(),
): OfflineBibleChapter[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const value = item as OfflineBibleChapter;
      if (typeof value.book !== "string" || !value.book.trim() || !Number.isInteger(value.chapter) || value.chapter < 1 || typeof value.translation !== "string" || !value.translation.trim()) return [];
      const verses = Array.isArray(value.verses)
        ? value.verses.filter((verse): verse is OfflineBibleVerse => Boolean(verse && typeof verse === "object" && Number.isInteger((verse as OfflineBibleVerse).number) && (verse as OfflineBibleVerse).number > 0 && typeof (verse as OfflineBibleVerse).text === "string" && (verse as OfflineBibleVerse).text.trim())).map((verse) => ({ number: verse.number, text: verse.text.trim().slice(0, 12000) }))
        : undefined;
      return [{ book: value.book.trim(), chapter: value.chapter, translation: value.translation.trim(), ...(verses?.length ? { verses } : {}) }];
    }).slice(-MAX_OFFLINE_CHAPTERS);
  } catch {
    return [];
  }
}

export function writeOfflineBibleChapters(
  chapters: OfflineBibleChapter[],
  storage: StorageLike | null = browserStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(chapters));
    return true;
  } catch {
    return false;
  }
}

