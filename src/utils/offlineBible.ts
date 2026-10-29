export type OfflineBibleChapter = {
  book: string;
  chapter: number;
  translation: string;
};

const STORAGE_KEY = "verbo-norte:offline-bible:v1";

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
    : [...chapters, chapter];
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
    return parsed.filter((item): item is OfflineBibleChapter =>
      Boolean(
        item &&
          typeof item === "object" &&
          typeof (item as OfflineBibleChapter).book === "string" &&
          Number.isInteger((item as OfflineBibleChapter).chapter) &&
          typeof (item as OfflineBibleChapter).translation === "string",
      ),
    );
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

