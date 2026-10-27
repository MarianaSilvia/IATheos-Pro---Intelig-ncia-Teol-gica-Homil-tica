import { SAMPLE_BIBLE_CHAPTERS } from "./ecosystem";
export function findBibleChapter(
  book: string,
  chapter: number,
  translation: string,
) {
  return (
    Object.values(SAMPLE_BIBLE_CHAPTERS)
      .flatMap((translations) => Object.values(translations))
      .find(
        (item) =>
          item.book === book &&
          item.chapter === chapter &&
          item.translation === translation,
      ) || null
  );
}
