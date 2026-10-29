export type StudyContext = {
  reference: string;
  book?: string;
  chapter?: number;
};

const STORAGE_PREFIX = "verbo-norte:study-context:v1:";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  return window.sessionStorage;
}

function keyFor(uid: string): string {
  return `${STORAGE_PREFIX}${uid}`;
}

export function readStudyContext(uid: string, storage: StorageLike | null = browserStorage()): StudyContext | null {
  if (!uid || !storage) return null;
  try {
    const raw = storage.getItem(keyFor(uid));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const value = parsed as Partial<StudyContext>;
    if (typeof value.reference !== "string" || !value.reference.trim() || value.reference.length > 300) return null;
    return {
      reference: value.reference.trim(),
      ...(typeof value.book === "string" && value.book.trim() ? { book: value.book.trim() } : {}),
      ...(Number.isInteger(value.chapter) && (value.chapter as number) > 0 ? { chapter: value.chapter as number } : {}),
    };
  } catch {
    return null;
  }
}

export function writeStudyContext(uid: string, context: StudyContext | null, storage: StorageLike | null = browserStorage()): boolean {
  if (!uid || !storage) return false;
  try {
    if (!context || !context.reference.trim()) storage.removeItem(keyFor(uid));
    else storage.setItem(keyFor(uid), JSON.stringify({ ...context, reference: context.reference.trim() }));
    return true;
  } catch {
    return false;
  }
}

