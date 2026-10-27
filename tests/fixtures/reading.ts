import { formatChapterKey } from "../../src/utils/bibleProgress";
export function getInitialSeedChapters(): string[] {
  const initialKeys: string[] = [];

  // Gênesis 1 a 25 (25 caps)
  for (let i = 1; i <= 25; i++) initialKeys.push(formatChapterKey("gn", i));
  // Salmos 1 a 35 (35 caps)
  for (let i = 1; i <= 35; i++) initialKeys.push(formatChapterKey("sl", i));
  // Provérbios 1 a 10 (10 caps)
  for (let i = 1; i <= 10; i++) initialKeys.push(formatChapterKey("pv", i));
  // Mateus 1 a 20 (20 caps)
  for (let i = 1; i <= 20; i++) initialKeys.push(formatChapterKey("mt", i));
  // Romanos 1 a 8 (8 caps)
  for (let i = 1; i <= 8; i++) initialKeys.push(formatChapterKey("rm", i));
  // Gálatas 1 a 6 (6 caps)
  for (let i = 1; i <= 6; i++) initialKeys.push(formatChapterKey("gl", i));

  return initialKeys;
}
