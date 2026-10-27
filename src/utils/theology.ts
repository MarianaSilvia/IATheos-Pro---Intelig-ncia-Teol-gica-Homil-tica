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
  sermonType: 'Expositivo' | 'Temático' | 'Textual';
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
  targetAudience: 'Adultos' | 'Jovens' | 'Adolescentes' | 'Crianças' | 'Novos Convertidos' | 'Liderança';
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
  createdAt: string;
}

export interface OriginalWord {
  term: string; // e.g. "ἠγάπησεν" or "חֶסֶד"
  transliteration: string; // e.g. "ēgapēsen" or "chesed"
  strongCode: string; // e.g. "G25" or "H2617"
  originalLanguage: 'Grego (Koiné)' | 'Hebraico Bíblico' | 'Aramaico';
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
export function validateSermonStructure(sermon: Partial<SermonOutline>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!sermon.title?.trim()) errors.push('Título ou Tema Central é obrigatório');
  if (!sermon.biblicalText?.trim()) errors.push('Texto Base é obrigatório');
  if (!sermon.introduction?.hook || !sermon.introduction?.historicalContext || !sermon.introduction?.problemSolved) {
    errors.push('Introdução deve conter gancho de atenção, contexto histórico e o problema resolvido');
  }
  if (!sermon.topics || sermon.topics.length < 3) {
    errors.push('O desenvolvimento deve conter exatamente ou no mínimo 3 tópicos principais');
  } else {
    sermon.topics.forEach((t, i) => {
      if (!t.subtitle?.trim()) errors.push(`Tópico ${i + 1} precisa de subtítulo forte`);
      if (!t.exegeticalExplanation?.trim()) errors.push(`Tópico ${i + 1} precisa de explicação exegética`);
      if (!t.practicalIllustration?.trim()) errors.push(`Tópico ${i + 1} precisa de ilustração prática`);
    });
  }
  if (!sermon.conclusionAndApplication?.summary || !sermon.conclusionAndApplication?.practicalCall?.length) {
    errors.push('Conclusão e aplicação prática são obrigatórias com diretrizes de ação');
  }
  if (!sermon.altarCallAndPrayer?.suggestedPrayer?.trim()) {
    errors.push('Sugestão de oração final/apelo é obrigatória');
  }
  return { isValid: errors.length === 0, errors };
}

export function validateEbdStructure(lesson: Partial<EbdLesson>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!sermonTitleCheck(lesson.title)) errors.push('Título da aula é obrigatório');
  if (!lesson.biblicalText?.trim()) errors.push('Texto bíblico da aula é obrigatório');
  if (!lesson.lessonObjective?.trim()) errors.push('Objetivo da aula é obrigatório');
  if (!lesson.icebreaker?.reflectiveQuestion?.trim()) errors.push('Quebra-gelo com pergunta reflexiva é obrigatório');
  if (!lesson.contentPoints || lesson.contentPoints.length === 0) {
    errors.push('Explicação do texto com pontos didáticos para quadro/projeção é obrigatória');
  }
  if (!lesson.discussionQuestions || lesson.discussionQuestions.length < 2) {
    errors.push('São necessárias no mínimo 2 perguntas para debate em classe');
  }
  if (!lesson.practicalConclusion?.coreTakeaway?.trim()) {
    errors.push('Conclusão prática com aplicação na vida do aluno é obrigatória');
  }
  return { isValid: errors.length === 0, errors };
}

function sermonTitleCheck(title?: string): boolean {
  return typeof title === 'string' && title.trim().length > 0;
}

export function validateVerseXrayStructure(xray: Partial<VerseXray>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!xray.verseReference?.trim()) errors.push('Referência do versículo é obrigatória');
  if (!xray.historicalCulturalContext?.historicalSetting?.trim()) {
    errors.push('Contexto histórico-cultural é obrigatório');
  }
  if (!xray.originalKeywords || xray.originalKeywords.length === 0) {
    errors.push('Palavras-chave nos originais (grego/hebraico) com raízes e significados são obrigatórias');
  }
  if (!xray.theologicalMeaningToday?.contemporaryApplication?.length) {
    errors.push('Significado e aplicação hermenêutica para hoje são obrigatórios');
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
${s.topics.map((t) => `### Tópico ${t.number}: ${t.subtitle}
- **Explicação Exegética:** ${t.exegeticalExplanation}
- **Ilustração Prática:** *"${t.practicalIllustration}"*
${t.crossReferences?.length ? `- **Referências Cruzadas:** ${t.crossReferences.join(', ')}` : ''}`).join('\n\n')}

---

## 3. CONCLUSÃO E APLICAÇÃO PRÁTICA
${s.conclusionAndApplication.summary}

**Aplicações Práticas para a Igreja Hoje:**
${s.conclusionAndApplication.practicalCall.map((c) => `- ${c}`).join('\n')}

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

---

## 🧊 INTRODUÇÃO / QUEBRA-GELO
**${l.icebreaker.title}**
${l.icebreaker.description}
*Pergunta Reflexiva:* "${l.icebreaker.reflectiveQuestion}"

---

## 📖 CONTEÚDO DA AULA (PONTOS PARA O QUADRO/SLIDES)
${l.contentPoints.map((p) => `### ${p.pointNumber}. ${p.title} (${p.scriptureReference})
- **Síntese para o Quadro:** \`${p.boardSummary}\`
- **Explicação do Professor:** ${p.teacherExplanation}`).join('\n\n')}

---

## 💬 PERGUNTAS PARA DEBATE EM CLASSE
${l.discussionQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

---

## 💡 CONCLUSÃO PRÁTICA
- **Ponto Central:** ${l.practicalConclusion.coreTakeaway}
- **Desafio Semanal:** ${l.practicalConclusion.weeklyChallenge}
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

## 🔤 PALAVRAS-CHAVE NOS ORIGINAIS (${x.originalKeywords[0]?.originalLanguage || 'Originais'})
${x.originalKeywords.map((w) => `### ${w.term} (${w.transliteration}) — [${w.strongCode}]
- **Idioma / Raiz:** ${w.originalLanguage} | Raiz: \`${w.rootWord}\`
- **Significado Literal:** ${w.literalMeaning}
- **Profundidade Teológica:** ${w.theologicalDepth}`).join('\n\n')}

---

## 🔗 REFERÊNCIAS CRUZADAS CHAVE
${x.crossReferences.map((cr) => `- **${cr.reference}:** ${cr.connection}`).join('\n')}

---

## ⚡ O QUE O TEXTO SIGNIFICA PARA NÓS HOJE
- **Princípio Hermenêutico:** ${x.theologicalMeaningToday.hermeneuticalPrinciple}
- **Aplicações Contemporâneas:**
${x.theologicalMeaningToday.contemporaryApplication.map((app) => `  - ${app}`).join('\n')}
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
export const INITIAL_SERMON: SermonOutline = {
  id: 'sermon-romanos-5-3-5',
  title: 'A Esperança Inabalável na Adversidade',
  biblicalText: 'Romanos 5:3-5 (ARA)',
  theme: 'Perseverança, Esperança Cristã e Amor Derramado pelo Espírito',
  sermonType: 'Expositivo',
  targetAudience: 'Culto da Família / Celebração Dominical',
  introduction: {
    hook: 'Vivemos em uma cultura que foge da dor a qualquer custo. O mundo nos diz que sofrimento é sinônimo de fracasso ou ausência de bênção. No entanto, o apóstolo Paulo nos apresenta um paradoxo revolucionário: gloriar-se nas próprias tribulações. Como alguém pode encontrar regozijo em meio ao pranto?',
    historicalContext: 'Escrita por Paulo por volta de 57 d.C. a partir de Corinto, a epístola aos Romanos se dirige a uma igreja sob a sombra do Império Romano, onde os cristãos enfrentavam marginalização social, tensões religiosas e o prenúncio de ferozes perseguições.',
    problemSolved: 'O texto responde à crise existencial do crente que indaga: "Deus me abandonou na fornalha da aflição?". Paulo mostra que a tribulação não é um labirinto sem saída, mas um laboratório divino onde Deus forja caráter inabalável.',
  },
  topics: [
    {
      number: 1,
      subtitle: 'A Tribulação como Matriz Formadora da Paciência (v. 3)',
      exegeticalExplanation: 'No grego, a palavra traduzida por tribulação é thlipsis (θλῖψις), que significa literalmente compressão, aperto extremo ou o peso de uma pedra de moinho esmagando grãos. Paulo afirma que essa pressão não destrói o crente justificado, mas produz hypomonē (ὑπομονή) — a capacidade divina de permanecer firme debaixo da carga sem recuar.',
      practicalIllustration: 'Pense na prensa de azeitonas no Getsêmani: a azeitona precisa ser esmagada sob pedras pesadas para que o precioso azeite puro seja extraído. Da mesma forma, Deus permite o peso da aflição não para esmagar a nossa vida, mas para extrair a unção da paciência e da dependência.',
      crossReferences: ['Tiago 1:2-4', '2 Coríntios 4:17', '1 Pedro 1:6-7'],
    },
    {
      number: 2,
      subtitle: 'A Forja do Caráter Aprovado e a Certeza da Esperança (v. 4)',
      exegeticalExplanation: 'A paciência produz dokimē (δοκιμή), termo metalúrgico usado para a prata ou ouro que passou pela fornalha ardente e saiu purificado de toda escória. É o "caráter testado e comprovado". Essa integridade forjada no fogo gera elpis (ἐλπίς) — não um mero otimismo humano incerto ("espero que dê certo"), mas a convicção ancorada na fidelidade imutável de Deus.',
      practicalIllustration: 'Imagine uma espada nas mãos de um mestre ferreiro: o ferro bruto não serve para a batalha; precisa ser colocado no fogo incandescente e golpeado repetidas vezes na bigorna. Quando você vê o ferreiro martelando, ele não está destruindo o metal, está temperando a lâmina para que nunca se quebre em combate.',
      crossReferences: ['Jó 23:10', 'Provérbios 17:3', 'Zacarias 13:9'],
    },
    {
      number: 3,
      subtitle: 'A Esperança que Não Decepciona Ancorada no Amor de Deus (v. 5)',
      exegeticalExplanation: 'Paulo assegura que esta esperança ou kataischynei (οὐ καταισχύνει) — "não nos envergonha", não nos deixa frustrados ou desiludidos. A razão? O amor de Deus agapē (ἀγάπη) foi ekkechytai (ἐκκέχυται) — derramado em torrente abundante, inundando nosso coração pelo Espírito Santo que nos foi dado. Não temos apenas uma promessa no papel, temos o Penhor divino selado em nossa alma.',
      practicalIllustration: 'Como uma mãe que segura a mão do filho pequeno em meio a uma violenta tempestade de trovões: os relâmpagos continuam faiscando e o vento sopra forte, mas a criança não se desespera porque sente o aperto seguro da mão materna e ouve a voz que diz "eu estou aqui com você". O amor de Deus é a âncora que nos mantém seguros em mar revolto.',
      crossReferences: ['Romanos 8:35-39', 'Hebreus 6:19', 'Efésios 1:13-14'],
    },
  ],
  conclusionAndApplication: {
    summary: 'A adversidade não tem a palavra final na vida do justificado por Cristo. Deus transforma o peso da tribulação em paciência perseverante, a paciência em caráter aprovado, e o caráter na mais reluzente esperança.',
    practicalCall: [
      'Pare de enxergar sua provação atual como castigo; passe a encará-la como sala de aula do Espírito Santo.',
      'Quando o aperto (thlipsis) vier, declare em oração que Deus está produzindo perseverança sólida em sua alma.',
      'Alimente sua esperança diária na contemplação do amor de Deus derramado no Calvário e selado pelo Consolador.',
    ],
  },
  altarCallAndPrayer: {
    prayerDirection: 'Convide à frente ou a colocar a mão sobre o coração todos os irmãos que entraram na casa de Deus sob pesado fardo emocional, luto, enfermidade ou crise financeira. Ministre que a esperança de Deus não deixará ninguém desamparado.',
    suggestedPrayer: 'Senhor Deus dos Exércitos, Pai bendito de nosso Senhor Jesus Cristo: Tu conheces o peso das pedras que têm pressionado o coração do Teu povo. Mas nós nos recusamos a murmurar! Declaramos hoje que o nosso sofrimento está sendo transformado pelo Teu poder em ouro refinado. Derrama de novo, pelo Espírito Santo, a torrente do Teu amor incondicional sobre cada alma aflita. Renova a nossa esperança e faz-nos sair daqui inabaláveis. Em nome de Jesus, Amém!',
  },
  createdAt: '2026-10-27T10:25:00.000Z',
};

export const INITIAL_VERSE_XRAY: VerseXray = {
  id: 'xray-joao-3-16',
  verseReference: 'João 3:16',
  verseText: 'Porque Deus amou ao mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
  translation: 'Almeida Revista e Atualizada (ARA)',
  historicalCulturalContext: {
    historicalSetting: 'O versículo está inserido no coração do encontro noturno entre Jesus e Nicodemos em Jerusalém durante a Páscoa judaica (c. 30 d.C.). Nicodemos era membro do Sinédrio, mestre renomado da Lei e fariseu zeloso.',
    culturalBackground: 'O judaísmo rabínico do primeiro século ensinava amplamente que o amor pactual de Yahweh era reservado a Israel e aos prosélitos, enquanto os gentios e as nações pagãs seriam objeto de ira no Dia do Senhor. Ao anunciar que Deus amou o "mundo" (kosmos) e enviou Seu Filho para salvar e não para condenar, Jesus rompe drasticamente com o nacionalismo e exclusivismo religioso vigente.',
    immediateLiteraryContext: 'Jesus acabara de citar o episódio de Números 21:8-9 (a serpente de bronze levantada no deserto por Moisés para salvar os picados por serpentes venenosas), estabelecendo a tipologia de Sua própria crucificação: "assim importa que o Filho do Homem seja levantado" (v. 14).',
    authorAndAudience: 'O apóstolo João redige seu evangelho teológico (c. 85-90 d.C.) com o propósito explícito de que os leitores creiam que Jesus é o Cristo, o Filho de Deus, e que, crendo, tenham vida em seu nome (Jo 20:31).',
  },
  originalKeywords: [
    {
      term: 'ἠγάπησεν',
      transliteration: 'ēgapēsen',
      strongCode: 'G25',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'agapaō (ἀγαπάω)',
      literalMeaning: 'Amou com amor volitivo, sacrificial, incondicional e altruísta.',
      theologicalDepth: 'O verbo está no tempo Aoristo do indicativo ativo, expressando uma ação pontual, consumada e decisiva na história — concretizada de forma cabal na entrega do Filho na Cruz. Não é um amor baseado no valor do objeto amado, mas na essência do Deus que é Amor.',
    },
    {
      term: 'οὕτως',
      transliteration: 'houtōs',
      strongCode: 'G3779',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'houtō (οὕτω)',
      literalMeaning: 'De tal maneira, deste modo específico, com tamanha intensidade demonstrada.',
      theologicalDepth: 'Indica tanto o grau infinito quanto o método da manifestação do amor divino. Deus não apenas amou em sentimento; Ele amou de tal modo que agiu de forma suprema: entregou Sua dádiva mais preciosa.',
    },
    {
      term: 'τὸν κόσμον',
      transliteration: 'ton kosmon',
      strongCode: 'G2889',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'kosmos (κόσμος)',
      literalMeaning: 'O mundo, a humanidade caída e rebelada em oposição a Deus.',
      theologicalDepth: 'Em João, kosmos frequentemente denota a ordem humana alienada de Deus, chafurdada em trevas. Isso exalta a graça escandalosa: Deus não amou um mundo piedoso e justo, amou um mundo hostil, decadente e necessitado de redenção.',
    },
    {
      term: 'τὸν μονογενῆ',
      transliteration: 'ton monogenē',
      strongCode: 'G3439',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'monogenēs (monos: único + genos: espécie/origem)',
      literalMeaning: 'Único em Seu gênero, sem par, de natureza ímpar e singular.',
      theologicalDepth: 'Não significa "único gerado" no sentido de criação cronológica (como pregavam os arianos), mas a unicidade eterna do Filho com o Pai. É a mesma palavra usada na Septuaginta para Isaque como filho amado e singular de Abraão (Gn 22:2).',
    },
    {
      term: 'πᾶς ὁ πιστεύων',
      transliteration: 'pas ho pisteuōn',
      strongCode: 'G4100',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'pisteuō (πιστεύω)',
      literalMeaning: 'Todo aquele que está continuamente crendo / confiando integralmente.',
      theologicalDepth: 'Particípio presente ativo. Não denota mera concordância intelectual momentânea (assensus), mas uma fé viva de dependência, entrega e lealdade contínua a Cristo (fiducia). É a porta universal aberta a qualquer ser humano.',
    },
    {
      term: 'ζωὴν αἰώνιον',
      transliteration: 'zōēn aiōnion',
      strongCode: 'G2222 / G166',
      originalLanguage: 'Grego (Koiné)',
      rootWord: 'zōē (vida divina, espiritual) + aiōnios (eterna, da era vindoura)',
      literalMeaning: 'Vida eterna, a vida incriada de Deus compartilhada com o homem.',
      theologicalDepth: 'Zōē em João não é mera existência biológica (bios) prolongada para sempre, mas a posse presente da comunhão íntima com o Deus vivo que começa no ato da fé e transcende a morte física.',
    },
  ],
  crossReferences: [
    {
      reference: 'Romanos 5:8',
      connection: 'Deus prova o seu próprio amor para conosco pelo fato de ter Cristo morrido por nós, sendo nós ainda pecadores.',
    },
    {
      reference: '1 João 4:9-10',
      connection: 'Nisto se manifestou o amor de Deus em nós: em haver Deus enviado o seu Filho unigênito ao mundo, para vivermos por meio dele.',
    },
    {
      reference: 'Gênesis 22:2',
      connection: 'O sacrifício tipológico de Isaque, o filho amado de Abraão, que prefigurava a entrega do Filho de Deus no Monte Moriá/Calvário.',
    },
  ],
  theologicalMeaningToday: {
    hermeneuticalPrinciple: 'O centro do Evangelho não é o esforço humano para alcançar a Deus através de méritos e moralismo, mas a iniciativa graciosa de Deus em dar o Seu melhor para resgatar os que estavam perdidos.',
    contemporaryApplication: [
      'Segurança de Salvação: A salvação é dádiva (charis) recebida pela fé contínua em Jesus, e não uma conquista pessoal que dependa de nossas obras imperfeitas.',
      'Missão Global e Inclusão: Se Deus amou o kosmos, nossa igreja não pode ter acepção de pessoas. Não há tribo, etnia ou pecador que esteja além do alcance da graça.',
      'A Gravidade da Escolha: Há apenas dois destinos eternos apresentados no texto — "perecer" (apollymi, ruína eterna) ou "ter a vida eterna". O Evangelho deve ser proclamado com urgência santa.',
    ],
    pastoralEncouragement: 'Se você já duvidou do amor de Deus por causa de circunstâncias difíceis, olhe para a Cruz. Deus não poupou o Seu próprio Filho por amor a você. A sua garantia eterna está fincada no sacrifício consumado do Calvário.',
  },
  createdAt: '2026-10-27T10:25:00.000Z',
};

export const INITIAL_EBD_LESSON: EbdLesson = {
  id: 'ebd-atos-12-oracao-de-joelhos',
  title: 'O Poder da Oração de Joelhos: Quando a Igreja Clama, as Cadeias Caem',
  biblicalText: 'Atos 12:1-17 (ARA)',
  targetAudience: 'Adultos',
  lessonObjective: 'Capacitar os alunos adultos a compreenderem a eficácia, a urgência e a perseverança da oração comunitária fervorosa, demonstrando que nenhuma prisão terrena resiste à soberania de Deus acionada pela intercessão.',
  icebreaker: {
    title: 'A Porta Trancada e a Chave Esquecida',
    description: 'Leve para a classe uma corrente ou um cadeado grosso trancado. Pergunte à classe: "Qual é a situação mais aparentemente impossível e sem saída que você já enfrentou na sua família, saúde ou ministério?". Deixe dois alunos responderem brevemente.',
    reflectiveQuestion: 'Quando todos os recursos humanos, políticos e jurídicos falham, em que direção seus joelhos se dobram primeiro?',
  },
  contentPoints: [
    {
      pointNumber: 1,
      title: 'A Tempestade Política e a Prisão de Pedro',
      scriptureReference: 'Atos 12:1-4',
      boardSummary: '• Crise: Tiago decapitado | • Perseguição: Herodes Agripa I | • Pedro preso sob 4 escoltas de 4 soldados | • Cenário: Impossibilidade humana total',
      teacherExplanation: 'Herodes Agripa I, buscando aprovação popular entre as elites judaicas, ordenou o martírio de Tiago e encarcerou o apóstolo Pedro. Ele cercou Pedro de segurança máxima: 16 soldados romanos em revezamento, duas correntes ligadas aos guardas e portas de ferro. Humanamente, a execução na manhã seguinte era inevitável.',
    },
    {
      pointNumber: 2,
      title: 'A Oração Incessante da Igreja: O "Mas" Divino',
      scriptureReference: 'Atos 12:5',
      boardSummary: '• "Pedro, pois, estava guardado no cárcere; MAS a igreja orava a Deus por ele fervorosamente." | • Palavra grega: EKTEINÕS (com tensão máxima, agonia de parto)',
      teacherExplanation: 'O versículo 5 contém o maior contraste do livro de Atos: de um lado, o aparato do Império Romano com espadas e correntes; do outro lado, a igreja reunida de joelhos. O termo grego ektenōs (ἐκτενῶς) é a mesma palavra usada para descrever a oração agonizante de Jesus no Getsêmani. Não era uma prece formal ou sonolenta, mas um clamor esticado até o limite da alma.',
    },
    {
      pointNumber: 3,
      title: 'A Intervenção Sobrenatural e a Queda das Algemas',
      scriptureReference: 'Atos 12:6-11',
      boardSummary: '• Paz de Pedro dormindo entre guardas | • Luz celestial resplandecente | • As cadeias caíram dos pulsos | • O portão de ferro abriu-se por si mesmo',
      teacherExplanation: 'Na véspera de sua execução, Pedro dormia tão profundamente que o anjo precisou tocá-lo no lado para acordá-lo. Isso demonstra a paz que excede o entendimento! Quando o anjo tocou, as correntes caíram sem barulho de arrombamento, e o temível portão de ferro que dava para a cidade abriu-se de forma miraculosa (automatos). Deus não precisa de chaves para libertar os Seus.',
    },
    {
      pointNumber: 4,
      title: 'A Surpresa na Casa de Maria e a Lição da Fé Prática',
      scriptureReference: 'Atos 12:12-17',
      boardSummary: '• Reunião de oração na casa de Maria | • Rode reconhece a voz de Pedro | • Incredulidade momentânea: "Estás louca!" | • Testemunho público do livramento',
      teacherExplanation: 'A igreja orava com fervor, mas quando a jovem Rode anunciou que Pedro batia à porta, disseram que ela estava louca. Este detalhe bíblico traz imenso consolo: Deus não responde apenas à fé perfeita de gigantes espirituais, mas à oração sincera de crentes frágeis que perseveram juntos!',
    },
  ],
  discussionQuestions: [
    'Por que muitas vezes oramos insistentemente por um milagre e, quando Deus começa a responder, temos dificuldade de acreditar (assim como a igreja na casa de Maria)?',
    'Qual é a diferença prática entre orar de forma rotineira e protocolar versus orar "ektenōs" (com fervor sacrificial e perseverança contínua)?',
    'Quais "portões de ferro" na vida da nossa congregação ou sociedade hoje exigem que nos reunamos em vigílias e clamores comunitários?',
  ],
  practicalConclusion: {
    coreTakeaway: 'A oração comunitária fervorosa é a arma mais poderosa da Igreja. Governos passam, prisões desmoronam e inimigos caem, mas o clamor dos santos sobe diante do trono do Todo-Poderoso.',
    weeklyChallenge: 'Estabeleça nesta semana um compromisso: forme uma dupla de oração com outro irmão da classe e dediquem 15 minutos diários de joelhos intercedendo especificamente por uma causa considerada "impossível".',
  },
  createdAt: '2026-10-27T10:25:00.000Z',
};
