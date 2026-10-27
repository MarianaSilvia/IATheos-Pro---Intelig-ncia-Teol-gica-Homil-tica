/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleBookInfo {
  id: string;
  name: string;
  testament: 'AT' | 'NT';
  category: string;
  chaptersCount: number;
}

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // Antigo Testamento (39 livros, 929 capítulos)
  { id: 'gn', name: 'Gênesis', testament: 'AT', category: 'Pentateuco', chaptersCount: 50 },
  { id: 'ex', name: 'Êxodo', testament: 'AT', category: 'Pentateuco', chaptersCount: 40 },
  { id: 'lv', name: 'Levítico', testament: 'AT', category: 'Pentateuco', chaptersCount: 27 },
  { id: 'nm', name: 'Números', testament: 'AT', category: 'Pentateuco', chaptersCount: 36 },
  { id: 'dt', name: 'Deuteronômio', testament: 'AT', category: 'Pentateuco', chaptersCount: 34 },
  { id: 'js', name: 'Josué', testament: 'AT', category: 'Históricos', chaptersCount: 24 },
  { id: 'jz', name: 'Juízes', testament: 'AT', category: 'Históricos', chaptersCount: 21 },
  { id: 'rt', name: 'Rute', testament: 'AT', category: 'Históricos', chaptersCount: 4 },
  { id: '1sm', name: '1 Samuel', testament: 'AT', category: 'Históricos', chaptersCount: 31 },
  { id: '2sm', name: '2 Samuel', testament: 'AT', category: 'Históricos', chaptersCount: 24 },
  { id: '1rs', name: '1 Reis', testament: 'AT', category: 'Históricos', chaptersCount: 22 },
  { id: '2rs', name: '2 Reis', testament: 'AT', category: 'Históricos', chaptersCount: 25 },
  { id: '1cr', name: '1 Crônicas', testament: 'AT', category: 'Históricos', chaptersCount: 29 },
  { id: '2cr', name: '2 Crônicas', testament: 'AT', category: 'Históricos', chaptersCount: 36 },
  { id: 'ed', name: 'Esdras', testament: 'AT', category: 'Históricos', chaptersCount: 10 },
  { id: 'ne', name: 'Neemias', testament: 'AT', category: 'Históricos', chaptersCount: 13 },
  { id: 'et', name: 'Ester', testament: 'AT', category: 'Históricos', chaptersCount: 10 },
  { id: 'jo', name: 'Jó', testament: 'AT', category: 'Poéticos', chaptersCount: 42 },
  { id: 'sl', name: 'Salmos', testament: 'AT', category: 'Poéticos', chaptersCount: 150 },
  { id: 'pv', name: 'Provérbios', testament: 'AT', category: 'Poéticos', chaptersCount: 31 },
  { id: 'ec', name: 'Eclesiastes', testament: 'AT', category: 'Poéticos', chaptersCount: 12 },
  { id: 'ct', name: 'Cantares', testament: 'AT', category: 'Poéticos', chaptersCount: 8 },
  { id: 'is', name: 'Isaías', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 66 },
  { id: 'jr', name: 'Jeremias', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 52 },
  { id: 'lm', name: 'Lamentações', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 5 },
  { id: 'ez', name: 'Ezequiel', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 48 },
  { id: 'dn', name: 'Daniel', testament: 'AT', category: 'Profetas Maiores', chaptersCount: 12 },
  { id: 'os', name: 'Oséias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 14 },
  { id: 'jl', name: 'Joel', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'am', name: 'Amós', testament: 'AT', category: 'Profetas Menores', chaptersCount: 9 },
  { id: 'ob', name: 'Obadias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 1 },
  { id: 'jn', name: 'Jonas', testament: 'AT', category: 'Profetas Menores', chaptersCount: 4 },
  { id: 'mq', name: 'Miquéias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 7 },
  { id: 'na', name: 'Naum', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'hc', name: 'Habacuque', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'sf', name: 'Sofonias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 3 },
  { id: 'ag', name: 'Ageu', testament: 'AT', category: 'Profetas Menores', chaptersCount: 2 },
  { id: 'zc', name: 'Zacarias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 14 },
  { id: 'ml', name: 'Malaquias', testament: 'AT', category: 'Profetas Menores', chaptersCount: 4 },

  // Novo Testamento (27 livros, 260 capítulos)
  { id: 'mt', name: 'Mateus', testament: 'NT', category: 'Evangelhos', chaptersCount: 28 },
  { id: 'mc', name: 'Marcos', testament: 'NT', category: 'Evangelhos', chaptersCount: 16 },
  { id: 'lc', name: 'Lucas', testament: 'NT', category: 'Evangelhos', chaptersCount: 24 },
  { id: 'joao', name: 'João', testament: 'NT', category: 'Evangelhos', chaptersCount: 21 },
  { id: 'at', name: 'Atos', testament: 'NT', category: 'Histórico NT', chaptersCount: 28 },
  { id: 'rm', name: 'Romanos', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 16 },
  { id: '1co', name: '1 Coríntios', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 16 },
  { id: '2co', name: '2 Coríntios', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 13 },
  { id: 'gl', name: 'Gálatas', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 6 },
  { id: 'ef', name: 'Efésios', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 6 },
  { id: 'fp', name: 'Filipenses', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 4 },
  { id: 'cl', name: 'Colossenses', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 4 },
  { id: '1ts', name: '1 Tessalonicenses', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 5 },
  { id: '2ts', name: '2 Tessalonicenses', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 3 },
  { id: '1tm', name: '1 Timóteo', testament: 'NT', category: 'Cartas Pastorais', chaptersCount: 6 },
  { id: '2tm', name: '2 Timóteo', testament: 'NT', category: 'Cartas Pastorais', chaptersCount: 4 },
  { id: 'tt', name: 'Tito', testament: 'NT', category: 'Cartas Pastorais', chaptersCount: 3 },
  { id: 'fm', name: 'Filemom', testament: 'NT', category: 'Cartas Paulinas', chaptersCount: 1 },
  { id: 'hb', name: 'Hebreus', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 13 },
  { id: 'tg', name: 'Tiago', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 5 },
  { id: '1pe', name: '1 Pedro', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 5 },
  { id: '2pe', name: '2 Pedro', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 3 },
  { id: '1jo', name: '1 João', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 5 },
  { id: '2jo', name: '2 João', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 1 },
  { id: '3jo', name: '3 João', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 1 },
  { id: 'jd', name: 'Judas', testament: 'NT', category: 'Epístolas Gerais', chaptersCount: 1 },
  { id: 'ap', name: 'Apocalipse', testament: 'NT', category: 'Profético', chaptersCount: 22 },
];

export const TOTAL_BIBLE_CHAPTERS = 1189;
export const TOTAL_OT_CHAPTERS = 929;
export const TOTAL_NT_CHAPTERS = 260;

export interface BibleProgressStats {
  totalCompleted: number;
  totalChapters: number;
  overallPercentage: number;
  otCompleted: number;
  otTotal: number;
  otPercentage: number;
  ntCompleted: number;
  ntTotal: number;
  ntPercentage: number;
  remainingChapters: number;
  estimatedDaysToFinish: number;
}

export function formatChapterKey(bookId: string, chapter: number): string {
  return `${bookId}:${chapter}`;
}

export function parseChapterKey(key: string): { bookId: string; chapter: number } {
  const [bookId, chapStr] = key.split(':');
  return { bookId, chapter: parseInt(chapStr, 10) || 1 };
}

export function calculateBibleYearProgress(completedKeys: string[] | Set<string>): BibleProgressStats {
  const completedSet = completedKeys instanceof Set ? completedKeys : new Set(completedKeys);
  
  let otCompleted = 0;
  let ntCompleted = 0;

  for (const book of BIBLE_BOOKS) {
    for (let c = 1; c <= book.chaptersCount; c++) {
      const key = formatChapterKey(book.id, c);
      if (completedSet.has(key)) {
        if (book.testament === 'AT') {
          otCompleted++;
        } else {
          ntCompleted++;
        }
      }
    }
  }

  const totalCompleted = otCompleted + ntCompleted;
  const overallPercentage = TOTAL_BIBLE_CHAPTERS > 0
    ? Number(((totalCompleted / TOTAL_BIBLE_CHAPTERS) * 100).toFixed(1))
    : 0;

  const otPercentage = TOTAL_OT_CHAPTERS > 0
    ? Number(((otCompleted / TOTAL_OT_CHAPTERS) * 100).toFixed(1))
    : 0;

  const ntPercentage = TOTAL_NT_CHAPTERS > 0
    ? Number(((ntCompleted / TOTAL_NT_CHAPTERS) * 100).toFixed(1))
    : 0;

  const remainingChapters = Math.max(0, TOTAL_BIBLE_CHAPTERS - totalCompleted);
  const estimatedDaysToFinish = remainingChapters > 0 ? Math.ceil(remainingChapters / 3.25) : 0;

  return {
    totalCompleted,
    totalChapters: TOTAL_BIBLE_CHAPTERS,
    overallPercentage,
    otCompleted,
    otTotal: TOTAL_OT_CHAPTERS,
    otPercentage,
    ntCompleted,
    ntTotal: TOTAL_NT_CHAPTERS,
    ntPercentage,
    remainingChapters,
    estimatedDaysToFinish,
  };
}

export function toggleChapterCompletion(
  completedKeys: string[],
  bookId: string,
  chapter: number
): string[] {
  const key = formatChapterKey(bookId, chapter);
  const set = new Set(completedKeys);
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  return Array.from(set);
}

export function setBookAllChapters(
  completedKeys: string[],
  bookId: string,
  completed: boolean
): string[] {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return completedKeys;

  const set = new Set(completedKeys);
  for (let c = 1; c <= book.chaptersCount; c++) {
    const key = formatChapterKey(bookId, c);
    if (completed) {
      set.add(key);
    } else {
      set.delete(key);
    }
  }
  return Array.from(set);
}

const STORAGE_KEY = 'iatheos_bible_chapters_completed_v1';

export function getInitialSeedChapters(): string[] {
  const initialKeys: string[] = [];
  
  // Gênesis 1 a 25 (25 caps)
  for (let i = 1; i <= 25; i++) initialKeys.push(formatChapterKey('gn', i));
  // Salmos 1 a 35 (35 caps)
  for (let i = 1; i <= 35; i++) initialKeys.push(formatChapterKey('sl', i));
  // Provérbios 1 a 10 (10 caps)
  for (let i = 1; i <= 10; i++) initialKeys.push(formatChapterKey('pv', i));
  // Mateus 1 a 20 (20 caps)
  for (let i = 1; i <= 20; i++) initialKeys.push(formatChapterKey('mt', i));
  // Romanos 1 a 8 (8 caps)
  for (let i = 1; i <= 8; i++) initialKeys.push(formatChapterKey('rm', i));
  // Gálatas 1 a 6 (6 caps)
  for (let i = 1; i <= 6; i++) initialKeys.push(formatChapterKey('gl', i));

  return initialKeys;
}

export function loadCompletedChapters(): string[] {
  if (typeof window === 'undefined') return getInitialSeedChapters();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return getInitialSeedChapters();
}

export function saveCompletedChapters(keys: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}
