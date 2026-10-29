export function toggleVerseSelection(selected: number[], verse: number): number[] {
  const next = selected.includes(verse)
    ? selected.filter((item) => item !== verse)
    : [...selected, verse];
  return next.sort((a, b) => a - b);
}

export function formatVerseReference(book: string, chapter: number, verses: number[]): string {
  const ordered = [...new Set(verses)].sort((a, b) => a - b);
  if (ordered.length === 0) return `${book} ${chapter}`;
  if (ordered.length === 1) return `${book} ${chapter}:${ordered[0]}`;
  const contiguous = ordered.every((verse, index) => index === 0 || verse === ordered[index - 1] + 1);
  return `${book} ${chapter}:${ordered[0]}${contiguous ? `-${ordered[ordered.length - 1]}` : `,${ordered.slice(1).join(",")}`}`;
}

export function parseBibleReference(reference: string): { book: string; chapter: number; verses?: number[] } | null {
  const match = reference.trim().match(/^(.+?)\s+(\d+)(?::([\d,\-\s]+))?$/);
  if (!match) return null;
  const chapter = Number(match[2]);
  if (!Number.isInteger(chapter) || chapter <= 0) return null;
  const verses = match[3]
    ? [...new Set(match[3].split(/[,\s]+/).flatMap((part) => {
        const range = part.split("-").map(Number);
        if (range.length === 2 && Number.isInteger(range[0]) && Number.isInteger(range[1]) && range[0] > 0 && range[1] >= range[0]) {
          return Array.from({ length: range[1] - range[0] + 1 }, (_, index) => range[0] + index);
        }
        return Number.isInteger(range[0]) && range[0] > 0 ? [range[0]] : [];
      }))].sort((a, b) => a - b)
    : [];
  return { book: match[1].trim(), chapter, ...(verses.length > 0 ? { verses } : {}) };
}

