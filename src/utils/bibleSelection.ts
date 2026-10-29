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

export function parseBibleReference(reference: string): { book: string; chapter: number } | null {
  const match = reference.trim().match(/^(.+?)\s+(\d+)(?::[\d,\-\s]+)?$/);
  if (!match) return null;
  const chapter = Number(match[2]);
  return Number.isInteger(chapter) && chapter > 0 ? { book: match[1].trim(), chapter } : null;
}

