/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SermonTopic {
  number: number;
  subtitle: string;
  exegeticalExplanation: string;
  practicalIllustration: string;
  crossReferences?: string[];
}

export interface SermonOutline {
  id: string;
  title: string;
  biblicalText: string;
  theme: string;
  sermonType: "Expositivo" | "Temático" | "Textual";
  targetAudience: string;
  introduction: {
    hook: string;
    historicalContext: string;
    problemSolved: string;
  };
  topics: SermonTopic[];
  conclusionAndApplication: {
    summary: string;
    practicalCall: string[];
  };
  altarCallAndPrayer: {
    prayerDirection: string;
    suggestedPrayer: string;
  };
  createdAt: string;
}

export interface EbdLesson {
  id: string;
  title: string;
  biblicalText: string;
  targetAudience:
    | "Adultos"
    | "Jovens"
    | "Adolescentes"
    | "Crianças"
    | "Novos Convertidos"
    | "Liderança";
  lessonObjective: string;
  icebreaker: {
    title: string;
    description: string;
    reflectiveQuestion: string;
  };
  contentPoints: Array<{
    pointNumber: number;
    title: string;
    scriptureReference: string;
    boardSummary: string; // Para passar no quadro ou projetar
    teacherExplanation: string;
  }>;
  discussionQuestions: string[];
  practicalConclusion: {
    coreTakeaway: string;
    weeklyChallenge: string;
  };
  teachingSummary?: string;
  mindMap?: { root: string; branches: Array<{ title: string; points: string[] }> };
  createdAt: string;
}

export interface OriginalWord {
  term: string; // e.g. "ἠγάπησεν" or "חֶסֶד"
  transliteration: string; // e.g. "ēgapēsen" or "chesed"
  strongCode: string; // e.g. "G25" or "H2617"
  originalLanguage: "Grego (Koiné)" | "Hebraico Bíblico" | "Aramaico";
  rootWord: string;
  literalMeaning: string;
  theologicalDepth: string;
}

export interface VerseXray {
  id: string;
  verseReference: string;
  verseText: string;
  translation: string;
  historicalCulturalContext: {
    historicalSetting: string;
    culturalBackground: string;
    immediateLiteraryContext: string;
    authorAndAudience: string;
  };
  originalKeywords: OriginalWord[];
  crossReferences: Array<{
    reference: string;
    connection: string;
  }>;
  theologicalMeaningToday: {
    hermeneuticalPrinciple: string;
    contemporaryApplication: string[];
    pastoralEncouragement: string;
  };
  createdAt: string;
}

/**
 * Validation functions for pure logic testing
 */
export function validateSermonStructure(sermon: Partial<SermonOutline>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!sermon.title?.trim())
    errors.push("Título ou Tema Central é obrigatório");
  if (!sermon.biblicalText?.trim()) errors.push("Texto Base é obrigatório");
  if (
    !sermon.introduction?.hook ||
    !sermon.introduction?.historicalContext ||
    !sermon.introduction?.problemSolved
  ) {
    errors.push(
      "Introdução deve conter gancho de atenção, contexto histórico e o problema resolvido",
    );
  }
  if (!sermon.topics || sermon.topics.length < 3) {
    errors.push(
      "O desenvolvimento deve conter exatamente ou no mínimo 3 tópicos principais",
    );
  } else {
    sermon.topics.forEach((t, i) => {
      if (!t.subtitle?.trim())
        errors.push(`Tópico ${i + 1} precisa de subtítulo forte`);
      if (!t.exegeticalExplanation?.trim())
        errors.push(`Tópico ${i + 1} precisa de explicação exegética`);
      if (!t.practicalIllustration?.trim())
        errors.push(`Tópico ${i + 1} precisa de ilustração prática`);
    });
  }
  if (
    !sermon.conclusionAndApplication?.summary ||
    !sermon.conclusionAndApplication?.practicalCall?.length
  ) {
    errors.push(
      "Conclusão e aplicação prática são obrigatórias com diretrizes de ação",
    );
  }
  if (!sermon.altarCallAndPrayer?.suggestedPrayer?.trim()) {
    errors.push("Sugestão de oração final/apelo é obrigatória");
  }
  return { isValid: errors.length === 0, errors };
}

export function validateEbdStructure(lesson: Partial<EbdLesson>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!sermonTitleCheck(lesson.title))
    errors.push("Título da aula é obrigatório");
  if (!lesson.biblicalText?.trim())
    errors.push("Texto bíblico da aula é obrigatório");
  if (!lesson.lessonObjective?.trim())
    errors.push("Objetivo da aula é obrigatório");
  if (!lesson.icebreaker?.reflectiveQuestion?.trim())
    errors.push("Quebra-gelo com pergunta reflexiva é obrigatório");
  if (!lesson.contentPoints || lesson.contentPoints.length === 0) {
    errors.push(
      "Explicação do texto com pontos didáticos para quadro/projeção é obrigatória",
    );
  }
  if (!lesson.discussionQuestions || lesson.discussionQuestions.length < 2) {
    errors.push("São necessárias no mínimo 2 perguntas para debate em classe");
  }
  if (!lesson.practicalConclusion?.coreTakeaway?.trim()) {
    errors.push(
      "Conclusão prática com aplicação na vida do aluno é obrigatória",
    );
  }
  return { isValid: errors.length === 0, errors };
}

function sermonTitleCheck(title?: string): boolean {
  return typeof title === "string" && title.trim().length > 0;
}

export function validateVerseXrayStructure(xray: Partial<VerseXray>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!xray.verseReference?.trim())
    errors.push("Referência do versículo é obrigatória");
  if (!xray.historicalCulturalContext?.historicalSetting?.trim()) {
    errors.push("Contexto histórico-cultural é obrigatório");
  }
  if (!xray.originalKeywords || xray.originalKeywords.length === 0) {
    errors.push(
      "Palavras-chave nos originais (grego/hebraico) com raízes e significados são obrigatórias",
    );
  }
  if (!xray.theologicalMeaningToday?.contemporaryApplication?.length) {
    errors.push(
      "Significado e aplicação hermenêutica para hoje são obrigatórios",
    );
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Text formatting converters (Markdown exports for pastors and teachers)
 */
export function formatSermonToMarkdown(s: SermonOutline): string {
  return `# ${s.title}
**Texto Base:** ${s.biblicalText}
**Tipo de Sermão:** ${s.sermonType} | **Ocasião/Público:** ${s.targetAudience}

---

## 1. INTRODUÇÃO
- **Gancho de Atenção:** ${s.introduction.hook}
- **Contexto Histórico:** ${s.introduction.historicalContext}
- **Problema que o Texto Resolve:** ${s.introduction.problemSolved}

---

## 2. DESENVOLVIMENTO
${s.topics
  .map(
    (t) => `### Tópico ${t.number}: ${t.subtitle}
- **Explicação Exegética:** ${t.exegeticalExplanation}
- **Ilustração Prática:** *"${t.practicalIllustration}"*
${t.crossReferences?.length ? `- **Referências Cruzadas:** ${t.crossReferences.join(", ")}` : ""}`,
  )
  .join("\n\n")}

---

## 3. CONCLUSÃO E APLICAÇÃO PRÁTICA
${s.conclusionAndApplication.summary}

**Aplicações Práticas para a Igreja Hoje:**
${s.conclusionAndApplication.practicalCall.map((c) => `- ${c}`).join("\n")}

---

## 4. APELO E ORAÇÃO FINAL
- **Direcionamento para o Altar:** ${s.altarCallAndPrayer.prayerDirection}
- **Oração Sugerida:**
> "${s.altarCallAndPrayer.suggestedPrayer}"
`;
}

export function formatEbdToMarkdown(l: EbdLesson): string {
  return `# EBD: ${l.title}
**Texto Base:** ${l.biblicalText} | **Faixa Etária:** ${l.targetAudience}

---

## 🎯 OBJETIVO DA AULA
${l.lessonObjective}

${l.teachingSummary ? `---\n\n## RESUMO DA REVISTA\n${l.teachingSummary}\n` : ""}

---

## 🧊 INTRODUÇÃO / QUEBRA-GELO
**${l.icebreaker.title}**
${l.icebreaker.description}
*Pergunta Reflexiva:* "${l.icebreaker.reflectiveQuestion}"

---

## 📖 CONTEÚDO DA AULA (PONTOS PARA O QUADRO/SLIDES)
${l.contentPoints
  .map(
    (p) => `### ${p.pointNumber}. ${p.title} (${p.scriptureReference})
- **Síntese para o Quadro:** \`${p.boardSummary}\`
- **Explicação do Professor:** ${p.teacherExplanation}`,
  )
  .join("\n\n")}

---

## 💬 PERGUNTAS PARA DEBATE EM CLASSE
${l.discussionQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}

---

## 💡 CONCLUSÃO PRÁTICA
- **Ponto Central:** ${l.practicalConclusion.coreTakeaway}
- **Desafio Semanal:** ${l.practicalConclusion.weeklyChallenge}

${l.mindMap ? `---\n\n## MAPA MENTAL\n**${l.mindMap.root}**\n${l.mindMap.branches.map((branch) => `- ${branch.title}\n${branch.points.map((point) => `  - ${point}`).join("\\n")}`).join("\\n")}` : ""}
`;
}

export function formatVerseXrayToMarkdown(x: VerseXray): string {
  return `# Raio-X do Versículo: ${x.verseReference}
> "${x.verseText}" (${x.translation})

---

## 🏛️ CONTEXTO HISTÓRICO-CULTURAL
- **Cenário Histórico:** ${x.historicalCulturalContext.historicalSetting}
- **Pano de Fundo Cultural:** ${x.historicalCulturalContext.culturalBackground}
- **Contexto Literário Imediato:** ${x.historicalCulturalContext.immediateLiteraryContext}
- **Autor e Destinatários:** ${x.historicalCulturalContext.authorAndAudience}

---

## 🔤 PALAVRAS-CHAVE NOS ORIGINAIS (${x.originalKeywords[0]?.originalLanguage || "Originais"})
${x.originalKeywords
  .map(
    (w) => `### ${w.term} (${w.transliteration}) — [${w.strongCode}]
- **Idioma / Raiz:** ${w.originalLanguage} | Raiz: \`${w.rootWord}\`
- **Significado Literal:** ${w.literalMeaning}
- **Profundidade Teológica:** ${w.theologicalDepth}`,
  )
  .join("\n\n")}

---

## 🔗 REFERÊNCIAS CRUZADAS CHAVE
${x.crossReferences.map((cr) => `- **${cr.reference}:** ${cr.connection}`).join("\n")}

---

## ⚡ O QUE O TEXTO SIGNIFICA PARA NÓS HOJE
- **Princípio Hermenêutico:** ${x.theologicalMeaningToday.hermeneuticalPrinciple}
- **Aplicações Contemporâneas:**
${x.theologicalMeaningToday.contemporaryApplication.map((app) => `  - ${app}`).join("\n")}
- **Encorajamento Pastoral:** ${x.theologicalMeaningToday.pastoralEncouragement}
`;
}

/**
 * DEFAULT HIGH-FIDELITY THEOLOGICAL RECORDS
 * Exact match for the user's initial prompts:
 * 1. Sermon: "A Esperança Inabalável na Adversidade" - Romanos 5:3-5
 * 2. Verse X-Ray: João 3:16
 * 3. EBD Lesson: "O Poder da Oração de Joelhos" - Atos 12:1-17 (Adultos)
 */
