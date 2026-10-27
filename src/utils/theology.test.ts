import {
  INITIAL_SERMON,
  INITIAL_VERSE_XRAY,
  INITIAL_EBD_LESSON,
} from "../../tests/fixtures/theology";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  validateSermonStructure,
  validateEbdStructure,
  validateVerseXrayStructure,
  formatSermonToMarkdown,
  formatEbdToMarkdown,
  formatVerseXrayToMarkdown,
} from "./theology.ts";

test("Initial Sermon satisfies all homiletical requirements", () => {
  const result = validateSermonStructure(INITIAL_SERMON);
  assert.equal(
    result.isValid,
    true,
    `Validation failed: ${result.errors.join(", ")}`,
  );
  assert.equal(
    INITIAL_SERMON.topics.length,
    3,
    "Must have exactly 3 main topics",
  );
  INITIAL_SERMON.topics.forEach((topic) => {
    assert.ok(topic.subtitle.length > 5, "Subtitle must be strong");
    assert.ok(
      topic.exegeticalExplanation.length > 20,
      "Exegetical explanation must be in-depth",
    );
    assert.ok(
      topic.practicalIllustration.length > 20,
      "Practical illustration must be detailed",
    );
  });
});

test("Sermon validator detects missing components", () => {
  const invalidSermon = {
    title: "",
    biblicalText: "Romanos 5:3-5",
    topics: [],
  };
  const result = validateSermonStructure(invalidSermon);
  assert.equal(result.isValid, false);
  assert.ok(
    result.errors.length >= 3,
    "Should catch title, topics and intro errors",
  );
});

test("Initial Verse X-Ray satisfies exegesis and root-word requirements", () => {
  const result = validateVerseXrayStructure(INITIAL_VERSE_XRAY);
  assert.equal(
    result.isValid,
    true,
    `Validation failed: ${result.errors.join(", ")}`,
  );
  assert.ok(
    INITIAL_VERSE_XRAY.originalKeywords.length >= 3,
    "Must contain multiple Greek/Hebrew root words",
  );

  const agapao = INITIAL_VERSE_XRAY.originalKeywords.find(
    (k) => k.strongCode === "G25",
  );
  assert.ok(agapao, "Must find G25 agapao");
  assert.equal(agapao?.originalLanguage, "Grego (Koiné)");
  assert.ok(
    agapao?.theologicalDepth.includes("Aoristo"),
    "Should explain Greek grammatical depth",
  );
});

test("Initial EBD Lesson satisfies pedagogical Sunday School requirements", () => {
  const result = validateEbdStructure(INITIAL_EBD_LESSON);
  assert.equal(
    result.isValid,
    true,
    `Validation failed: ${result.errors.join(", ")}`,
  );
  assert.equal(INITIAL_EBD_LESSON.targetAudience, "Adultos");
  assert.ok(
    INITIAL_EBD_LESSON.discussionQuestions.length >= 2,
    "Must have at least 2 discussion questions",
  );
  assert.ok(
    INITIAL_EBD_LESSON.contentPoints.length >= 3,
    "Must have didactic points for board/projection",
  );
});

test("Markdown formatters produce rich exportable text", () => {
  const sermonMd = formatSermonToMarkdown(INITIAL_SERMON);
  assert.ok(sermonMd.includes("A Esperança Inabalável na Adversidade"));
  assert.ok(sermonMd.includes("Tópico 1:"));
  assert.ok(sermonMd.includes("Ilustração Prática:"));
  assert.ok(sermonMd.includes("Oração Sugerida:"));

  const ebdMd = formatEbdToMarkdown(INITIAL_EBD_LESSON);
  assert.ok(ebdMd.includes("OBJETIVO DA AULA"));
  assert.ok(ebdMd.includes("QUEBRA-GELO"));
  assert.ok(ebdMd.includes("PERGUNTAS PARA DEBATE"));

  const xrayMd = formatVerseXrayToMarkdown(INITIAL_VERSE_XRAY);
  assert.ok(xrayMd.includes("PALAVRAS-CHAVE NOS ORIGINAIS"));
  assert.ok(xrayMd.includes("G25"));
});
