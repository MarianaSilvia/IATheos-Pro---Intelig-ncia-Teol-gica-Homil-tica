/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyReadingPlan {
  day: number;
  totalDays: number;
  date: string;
  title: string;
  readings: Array<{
    id: string;
    reference: string;
    completed: boolean;
  }>;
  streakDays: number;
  devotionalText: string;
}

export interface BiblicalTheme {
  id: string;
  name: string;
  category: "Vida Pessoal" | "Vida Cristã" | "Família" | "Doutrina";
  description: string;
  primaryVerses: Array<{
    reference: string;
    text: string;
  }>;
  studyPrompt: string;
}

export interface DictionaryEntry {
  term: string;
  originalTerm?: string;
  language?: "Grego" | "Hebraico" | "Aramaico";
  category: "Personagem" | "Local" | "Conceito Teológico" | "Objeto/Costume";
  definition: string;
  scriptureReferences: string[];
}

export interface GeneralDictionaryEntry {
  term: string;
  category: string;
  definition: string;
  synonyms: string[];
}

export interface ConcordanceResult {
  word: string;
  totalOccurrences: number;
  verses: Array<{
    reference: string;
    snippet: string;
    testament: "AT" | "NT";
  }>;
}

export interface ThemeApproach {
  id: string;
  approach: "Expositivo" | "Temático" | "Devocional" | "EBD/Pastoral";
  title: string;
  biblicalText: string;
  objective: string;
  targetAudience: string;
  description: string;
}

export function normalizeReferenceSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function firstNameFromIdentity(displayName: string, email = ""): string {
  const name = displayName.trim().replace(/\s+/g, " ");
  if (name && !name.includes("@")) return name.split(" ")[0];
  const fallback = email.trim().split("@")[0].replace(/[._-]+/g, " ").trim();
  return fallback ? fallback.split(/\s+/)[0] : "estudante";
}

export function buildThemeApproaches(theme: BiblicalTheme): ThemeApproach[] {
  const [first, second, third] = theme.primaryVerses;
  return [
    { id: `${theme.id}-expositivo`, approach: "Expositivo", title: `${theme.name}: exposição do texto`, biblicalText: first.reference, objective: `Expor o sentido e a aplicação de ${first.reference} no contexto da vida cristã.`, targetAudience: "Culto geral", description: theme.description },
    { id: `${theme.id}-tematico`, approach: "Temático", title: `${theme.name}: princípios para hoje`, biblicalText: `${first.reference}; ${second?.reference || first.reference}`, objective: `Organizar os principais princípios bíblicos relacionados a ${theme.name.toLowerCase()}.`, targetAudience: "Jovens e adultos", description: theme.studyPrompt },
    { id: `${theme.id}-devocional`, approach: "Devocional", title: `${theme.name}: uma palavra para o coração`, biblicalText: second?.reference || first.reference, objective: "Conduzir a uma reflexão pessoal, oração e prática da Palavra.", targetAudience: "Pequenos grupos e devocionais", description: theme.description },
    { id: `${theme.id}-ebd`, approach: "EBD/Pastoral", title: `${theme.name}: aula e aplicação pastoral`, biblicalText: third?.reference || second?.reference || first.reference, objective: "Transformar o tema em uma aula participativa com perguntas e aplicações.", targetAudience: "EBD e liderança", description: theme.studyPrompt },
  ];
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  churchName?: string;
  avatarUrl: string;
  biblicalReference: string;
  topicTag: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  postedAt: string;
}

export interface PersonalNote {
  id: string;
  biblicalReference: string;
  title: string;
  content: string;
  highlightColor: "amber" | "emerald" | "blue" | "rose" | "purple";
  tags: string[];
  updatedAt: string;
}

export const INITIAL_BIBLICAL_THEMES: BiblicalTheme[] = [
  {
    id: "theme-ansiedade",
    name: "Ansiedade e Paz de Espírito",
    category: "Vida Pessoal",
    description:
      "Como lançar os fardos existenciais sobre o Senhor e desfrutar da paz que excede todo entendimento.",
    primaryVerses: [
      {
        reference: "Filipenses 4:6-7",
        text: "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições...",
      },
      {
        reference: "1 Pedro 5:7",
        text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
      },
      {
        reference: "Mateus 6:33-34",
        text: "Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas.",
      },
    ],
    studyPrompt:
      "Esboço expositivo sobre o remédio bíblico contra o pânico e a ansiedade contemporânea.",
  },
  {
    id: "theme-familia",
    name: "Família, Casamento e Aliança",
    category: "Família",
    description:
      "Princípios inegociáveis para lares fortes, criação de filhos segundo o Senhor e restauração conjugal.",
    primaryVerses: [
      {
        reference: "Josué 24:15",
        text: "Eu e a minha casa serviremos ao Senhor.",
      },
      {
        reference: "Efésios 5:25",
        text: "Maridos, amai vossa mulher, como também Cristo amou a igreja e a si mesmo se entregou por ela.",
      },
      {
        reference: "Salmos 127:1",
        text: "Se o Senhor não edificar a casa, em vão trabalham os que a edificam.",
      },
    ],
    studyPrompt:
      "Como blindar a família contra o relativismo moral da sociedade pós-moderna.",
  },
  {
    id: "theme-fe-perseveranca",
    name: "Fé Inabalável & Perseverança",
    category: "Vida Cristã",
    description:
      "A convicção das coisas que se esperam e o combustível espiritual para suportar as fornalhas da vida.",
    primaryVerses: [
      {
        reference: "Hebreus 11:1",
        text: "Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.",
      },
      {
        reference: "Romanos 5:3-5",
        text: "Nos gloriamos nas próprias tribulações, sabendo que a tribulação produz perseverança...",
      },
      { reference: "Habacuque 2:4", text: "O justo viverá pela sua fé." },
    ],
    studyPrompt:
      "A distinção entre fé bíblica viva e mero pensamento positivo humano.",
  },
  {
    id: "theme-financas",
    name: "Mordomia Cristã e Finanças",
    category: "Vida Pessoal",
    description:
      "Generosidade, honestidade, planejamento financeiro e confiança na providência de Yahweh Jireh.",
    primaryVerses: [
      {
        reference: "Malaquias 3:10",
        text: "Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa...",
      },
      {
        reference: "1 Timóteo 6:10",
        text: "Porque o amor do dinheiro é raiz de todos os males...",
      },
      {
        reference: "Provérbios 3:9-10",
        text: "Honra ao Senhor com os teus bens e com as primícias de toda a tua renda.",
      },
    ],
    studyPrompt:
      "Princípios bíblicos para sair do endividamento e prosperar com integridade.",
  },
  {
    id: "theme-oracao",
    name: "Oração Fervorosa e Intercessão",
    category: "Vida Cristã",
    description:
      "O canal sobrenatural de comunhão e a chave que move a mão do Deus Todo-Poderoso.",
    primaryVerses: [
      { reference: "1 Tessalonicenses 5:17", text: "Orai sem cessar." },
      {
        reference: "Atos 12:5",
        text: "Pedro, pois, estava guardado no cárcere; mas a igreja orava a Deus por ele fervorosamente.",
      },
      {
        reference: "Tiago 5:16",
        text: "A oração de um justo é poderosa e eficaz.",
      },
    ],
    studyPrompt: "O clamor no secreto que produz livramentos públicos.",
  },
];

export const INITIAL_DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    term: "Melquisedeque",
    originalTerm: "מַלְכִּי־צֶדֶק (Malki-Tsedeq)",
    language: "Hebraico",
    category: "Personagem",
    definition:
      'Rei de Salém (antiga Jerusalém) e sacerdote do Deus Altíssimo (El Elyon). Seu nome significa "Rei de Justiça" e "Rei de Paz". Ele recebeu os dízimos de Abraão e o abençoou com pão e vinho. No Salmo 110 e em Hebreus 7, é a tipologia profética suprema do sacerdócio eterno de Jesus Cristo.',
    scriptureReferences: ["Gênesis 14:18-20", "Salmos 110:4", "Hebreus 7:1-17"],
  },
  {
    term: "Getsêmani",
    originalTerm: "Γεθσημανί (Gethsēmani) / גַּת שְׁמָנֵי (Gath-Shemanim)",
    language: "Aramaico",
    category: "Local",
    definition:
      'Significa literalmente "Prensa de Azeite". Jardim situado no sopé do Monte das Oliveiras, a leste de Jerusalém. Foi o local onde o Senhor Jesus viveu Sua agonia suprema antes da prisão, suando gotas de sangue e submetendo Sua vontade ao Pai.',
    scriptureReferences: ["Mateus 26:36", "Marcos 14:32", "Lucas 22:39-44"],
  },
  {
    term: "Koinonia",
    originalTerm: "κοινωνία (koinōnia)",
    language: "Grego",
    category: "Conceito Teológico",
    definition:
      "Comunhão íntima, participação conjunta, sociedade fraternal e compartilhamento sacrificial. Descreve a vida orgânica da Igreja primitiva em Atos 2:42.",
    scriptureReferences: ["Atos 2:42", "1 Coríntios 10:16", "1 João 1:3-7"],
  },
  {
    term: "Propiciação",
    originalTerm: "ἱλασμός (hilasmos) / כַּפֹּרֶת (kapporeth)",
    language: "Grego",
    category: "Conceito Teológico",
    definition:
      "O ato pelo qual a justa e santa ira de Deus contra o pecado é aplacada e satisfeita mediante o sacrifício expiatório de Cristo na cruz.",
    scriptureReferences: [
      "Romanos 3:25",
      "Hebreus 2:17",
      "1 João 2:2",
      "1 João 4:10",
    ],
  },
  {
    term: "Shekinah",
    originalTerm: "שְׁכִינָה (Sh’khinah)",
    language: "Hebraico",
    category: "Conceito Teológico",
    definition:
      'Termo derivado do hebraico shakan ("habitar"). Denota a presença manifesta e visível da glória de Deus habitando no meio do Seu povo.',
    scriptureReferences: ["Êxodo 40:34-35", "1 Reis 8:10-11", "Ezequiel 10:4"],
  },
];

/**
 * Pequeno acervo editorial para termos gerais usados no estudo.
 * Consultas fora desta lista continuam podendo usar o Gemini no servidor,
 * sempre identificadas como conteúdo gerado por IA.
 */
export const INITIAL_GENERAL_DICTIONARY_ENTRIES: GeneralDictionaryEntry[] = [
  {
    term: "Contexto",
    category: "Estudo e linguagem",
    definition:
      "Conjunto de circunstâncias, informações e relações que ajudam a compreender o sentido de uma palavra, texto ou acontecimento.",
    synonyms: ["cenário", "conjuntura", "ambiente"],
  },
  {
    term: "Discernimento",
    category: "Comportamento",
    definition:
      "Capacidade de distinguir, avaliar e escolher entre possibilidades com atenção aos fatos, às consequências e aos valores envolvidos.",
    synonyms: ["critério", "juízo", "clareza"],
  },
  {
    term: "Resiliência",
    category: "Comportamento",
    definition:
      "Capacidade de atravessar dificuldades, adaptar-se às circunstâncias e retomar um caminho de ação sem ignorar os aprendizados do processo.",
    synonyms: ["adaptação", "superação", "perseverança"],
  },
];

export const INITIAL_CONCORDANCE_ENTRIES: Record<string, ConcordanceResult> = {
  graça: {
    word: "Graça",
    totalOccurrences: 156,
    verses: [
      {
        reference: "Efésios 2:8",
        snippet:
          "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.",
        testament: "NT",
      },
      {
        reference: "Romanos 5:2",
        snippet:
          "Por intermédio de quem obtivemos igualmente acesso, pela fé, a esta graça na qual estamos firmes.",
        testament: "NT",
      },
      {
        reference: "2 Coríntios 12:9",
        snippet:
          "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.",
        testament: "NT",
      },
      {
        reference: "Gênesis 6:8",
        snippet: "Porém Noé achou graça aos olhos do Senhor.",
        testament: "AT",
      },
    ],
  },
  esperança: {
    word: "Esperança",
    totalOccurrences: 142,
    verses: [
      {
        reference: "Romanos 5:5",
        snippet:
          "Ora, a esperança não nos decepciona, porque o amor de Deus é derramado em nosso coração pelo Espírito Santo.",
        testament: "NT",
      },
      {
        reference: "Hebreus 6:19",
        snippet:
          "A qual temos por âncora da alma, segura e firme, e que penetra além do véu.",
        testament: "NT",
      },
      {
        reference: "Jeremias 29:11",
        snippet:
          "Porque eu bem sei os pensamentos que penso de vós, diz o Senhor... para vos dar o fim que esperais.",
        testament: "AT",
      },
    ],
  },
  shalom: {
    word: "Paz (Shalom)",
    totalOccurrences: 237,
    verses: [
      {
        reference: "Números 6:26",
        snippet: "O Senhor levante sobre ti o seu rosto e te dê a paz.",
        testament: "AT",
      },
      {
        reference: "Isaías 9:6",
        snippet:
          "E o seu nome será Maravilhoso Conselheiro, Deus Forte, Pai da Eternidade, Príncipe da Paz.",
        testament: "AT",
      },
      {
        reference: "João 14:27",
        snippet:
          "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.",
        testament: "NT",
      },
      {
        reference: "Filipenses 4:7",
        snippet:
          "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos.",
        testament: "NT",
      },
    ],
  },
};

export function calculateReadingProgress(plan: DailyReadingPlan): {
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  const completedCount = plan.readings.filter((r) => r.completed).length;
  const totalCount = plan.readings.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return { completedCount, totalCount, percentage };
}

export function searchBiblicalThemes(
  themes: BiblicalTheme[],
  query: string,
): BiblicalTheme[] {
  const q = normalizeReferenceSearch(query);
  if (!q) return themes;
  return themes.filter(
    (t) =>
      normalizeReferenceSearch(t.name).includes(q) ||
      normalizeReferenceSearch(t.description).includes(q) ||
      normalizeReferenceSearch(t.category).includes(q) ||
      t.primaryVerses.some(
        (v) =>
          normalizeReferenceSearch(v.reference).includes(q) ||
          normalizeReferenceSearch(v.text).includes(q),
      ),
  );
}

export function searchDictionary(
  entries: DictionaryEntry[],
  query: string,
): DictionaryEntry[] {
  const q = normalizeReferenceSearch(query);
  if (!q) return entries;
  return entries.filter(
    (e) =>
      normalizeReferenceSearch(e.term).includes(q) ||
      normalizeReferenceSearch(e.definition).includes(q) ||
      normalizeReferenceSearch(e.category).includes(q) ||
      normalizeReferenceSearch(e.originalTerm || "").includes(q),
  );
}

export function searchGeneralDictionary(
  entries: GeneralDictionaryEntry[],
  query: string,
): GeneralDictionaryEntry[] {
  const normalized = normalizeReferenceSearch(query);
  if (!normalized) return [];
  return entries.filter((entry) => {
    const haystack = [entry.term, entry.category, entry.definition, ...entry.synonyms]
      .map(normalizeReferenceSearch)
      .join(" ");
    return haystack.includes(normalized);
  });
}

export function searchConcordance(
  entries: Record<string, ConcordanceResult>,
  query: string,
): ConcordanceResult | null {
  const q = normalizeReferenceSearch(query);
  if (!q) return null;
  const queryForms = new Set([q]);
  if (q.endsWith("es") && q.length > 4) queryForms.add(q.slice(0, -2));
  if (q.endsWith("s") && q.length > 3) queryForms.add(q.slice(0, -1));
  const matches = (value: string) => {
    const normalized = normalizeReferenceSearch(value);
    return [...queryForms].some((form) => normalized.includes(form));
  };
  const entry = Object.entries(entries).find(([key, value]) =>
    matches(key) || matches(value.word),
  )?.[1];
  if (!entry) return null;
  return { ...entry, verses: entry.verses.filter((verse) => matches(`${verse.reference} ${verse.snippet}`) || matches(entry.word)) };
}

export function toggleReadingCompleted(
  plan: DailyReadingPlan,
  readingId: string,
): DailyReadingPlan {
  const nextReadings = plan.readings.map((r) =>
    r.id === readingId ? { ...r, completed: !r.completed } : r,
  );
  return { ...plan, readings: nextReadings };
}
