/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BIBLE_BOOKS,
  TOTAL_BIBLE_CHAPTERS,
  TOTAL_OT_CHAPTERS,
  TOTAL_NT_CHAPTERS,
  calculateBibleYearProgress,
  toggleChapterCompletion,
  setBookAllChapters,
  formatChapterKey,
  getInitialSeedChapters,
} from './bibleProgress';

test('Bible books collection is canonically complete with 66 books and 1189 chapters', () => {
  assert.equal(BIBLE_BOOKS.length, 66);
  
  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === 'AT');
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');

  assert.equal(otBooks.length, 39);
  assert.equal(ntBooks.length, 27);

  const otSum = otBooks.reduce((acc, b) => acc + b.chaptersCount, 0);
  const ntSum = ntBooks.reduce((acc, b) => acc + b.chaptersCount, 0);

  assert.equal(otSum, TOTAL_OT_CHAPTERS); // 929
  assert.equal(ntSum, TOTAL_NT_CHAPTERS); // 260
  assert.equal(otSum + ntSum, TOTAL_BIBLE_CHAPTERS); // 1189
});

test('calculateBibleYearProgress accurately computes percentages for OT, NT and total', () => {
  const seed = getInitialSeedChapters();
  // 25 + 35 + 10 + 20 + 8 + 6 = 104 chapters
  assert.equal(seed.length, 104);

  const stats = calculateBibleYearProgress(seed);
  assert.equal(stats.totalCompleted, 104);
  assert.equal(stats.totalChapters, 1189);
  assert.equal(stats.otCompleted, 70); // Gn 25 + Sl 35 + Pv 10 = 70
  assert.equal(stats.ntCompleted, 34); // Mt 20 + Rm 8 + Gl 6 = 34
  assert.equal(stats.remainingChapters, 1189 - 104);
  assert.ok(stats.overallPercentage > 8 && stats.overallPercentage < 10); // ~8.7%
  assert.ok(stats.estimatedDaysToFinish > 0);
});

test('toggleChapterCompletion adds and removes single chapter correctly', () => {
  let list: string[] = [];
  list = toggleChapterCompletion(list, 'rm', 5);
  assert.ok(list.includes('rm:5'));
  assert.equal(list.length, 1);

  // Toggle off
  list = toggleChapterCompletion(list, 'rm', 5);
  assert.ok(!list.includes('rm:5'));
  assert.equal(list.length, 0);
});

test('setBookAllChapters marks and unmarks entire book', () => {
  let list: string[] = [];
  // Galatians has 6 chapters
  list = setBookAllChapters(list, 'gl', true);
  assert.equal(list.length, 6);
  assert.ok(list.includes('gl:1'));
  assert.ok(list.includes('gl:6'));

  // Unmark Galatians
  list = setBookAllChapters(list, 'gl', false);
  assert.equal(list.length, 0);
});
