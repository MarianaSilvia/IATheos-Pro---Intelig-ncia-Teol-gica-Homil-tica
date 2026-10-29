import { z } from "zod";
const text = (max = 12000) => z.string().trim().min(1).max(max);
const list = (schema: z.ZodType = text()) => z.array(schema).min(1).max(30);
const section = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();
export const studyType = z.enum(["sermon", "ebd", "xray"]);
export const sermonSchema = section({
  title: text(300),
  biblicalText: text(300),
  theme: text(300),
  sermonType: z.enum(["Expositivo", "Temático", "Textual"]),
  targetAudience: text(100),
  introduction: section({
    hook: text(),
    historicalContext: text(),
    problemSolved: text(),
  }),
  topics: z
    .array(
      section({
        number: z.number().int().positive(),
        subtitle: text(300),
        exegeticalExplanation: text(),
        practicalIllustration: text(),
        crossReferences: z.array(text(300)).max(20).optional(),
      }),
    )
    .min(3)
    .max(12),
  conclusionAndApplication: section({
    summary: text(),
    practicalCall: list(text(3000)),
  }),
  altarCallAndPrayer: section({
    prayerDirection: text(),
    suggestedPrayer: text(),
  }),
});
export const ebdSchema = section({
  title: text(300),
  biblicalText: text(300),
  targetAudience: z.enum([
    "Adultos",
    "Jovens",
    "Adolescentes",
    "Crianças",
    "Novos Convertidos",
    "Liderança",
  ]),
  lessonObjective: text(),
  icebreaker: section({
    title: text(300),
    description: text(),
    reflectiveQuestion: text(),
  }),
  contentPoints: list(
    section({
      pointNumber: z.number().int().positive(),
      title: text(300),
      scriptureReference: text(300),
      boardSummary: text(),
      teacherExplanation: text(),
    }),
  ),
  discussionQuestions: z.array(text(3000)).min(2).max(20),
  practicalConclusion: section({
    coreTakeaway: text(),
    weeklyChallenge: text(),
  }),
  teachingSummary: text().optional(),
  mindMap: section({
    root: text(300),
    branches: z.array(section({ title: text(300), points: z.array(text(500)).min(1).max(12) })).min(1).max(12),
  }).optional(),
});
export const xraySchema = section({
  verseReference: text(300),
  verseText: text(),
  translation: text(150),
  historicalCulturalContext: section({
    historicalSetting: text(),
    culturalBackground: text(),
    immediateLiteraryContext: text(),
    authorAndAudience: text(),
  }),
  originalKeywords: list(
    section({
      term: text(300),
      transliteration: text(300),
      strongCode: text(100),
      originalLanguage: z.enum([
        "Grego (Koiné)",
        "Hebraico Bíblico",
        "Aramaico",
      ]),
      rootWord: text(300),
      literalMeaning: text(),
      theologicalDepth: text(),
    }),
  ),
  crossReferences: list(section({ reference: text(300), connection: text() })),
  theologicalMeaningToday: section({
    hermeneuticalPrinciple: text(),
    contemporaryApplication: list(text(3000)),
    pastoralEncouragement: text(),
  }),
});
export const generatedSchemas = {
  sermon: sermonSchema,
  ebd: ebdSchema,
  xray: xraySchema,
};
export const themeApproachSchema = section({
  id: text(80),
  approach: z.enum(["Expositivo", "Temático", "Devocional", "EBD/Pastoral"]),
  title: text(300),
  biblicalText: text(300),
  objective: text(2000),
  targetAudience: text(200),
  description: text(3000),
});
export const themeOptionsSchema = section({
  theme: text(300),
  source: z.enum(["catalog", "ai"]),
  needsReview: z.boolean(),
  options: z.array(themeApproachSchema).min(1).max(8),
});
export const dictionaryResultSchema = section({
  term: text(300),
  mode: z.enum(["biblical", "general"]),
  category: text(120),
  definition: text(5000),
  synonyms: z.array(text(120)).max(20),
  originalTerm: z.string().trim().max(300).optional(),
  scriptureReferences: z.array(text(300)).max(20),
  source: z.enum(["catalog", "ai"]),
  needsReview: z.boolean(),
});
export const concordanceResultSchema = section({
  word: text(300),
  totalOccurrences: z.number().int().nonnegative(),
  availableOccurrences: z.number().int().nonnegative(),
  oldTestament: z.number().int().nonnegative(),
  newTestament: z.number().int().nonnegative(),
  verses: z.array(section({
    reference: text(300),
    snippet: text(5000),
    testament: z.enum(["AT", "NT"]),
  })).max(100),
});
export const externalLinkSchema = z.url().max(4096).refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && !["localhost","127.0.0.1","[::1]"].includes(url.hostname);
}, "Use um link HTTPS externo, sem usuário ou senha.");
export const idSchema = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
export const productSchema = section({
  title: text(300),
  author: text(200),
  category: z.enum([
    "Livro",
    "Revista EBD",
    "Comentário Bíblico",
    "Manual Pastoral",
    "Esboços",
  ]),
  description: text(6000),
  price: z.number().finite().min(0).max(100000),
  pages: z.number().int().min(1).max(10000),
  isFreeForSubscribers: z.boolean(),
  coverImage: z.union([
    z.literal(""),
    z.url().refine((s) => s.startsWith("https://")),
  ]),
  archived: z.boolean(),
});
export const noteSchema = section({
  title: text(300),
  biblicalReference: z.string().trim().max(300),
  content: text(12000),
});
export const subscriptionActionSchema = section({
  action: z.enum(["grant", "renew", "suspend", "activate"]),
  reason: text(1000),
});
export type ProductInput = z.infer<typeof productSchema>;
export interface Subscription {
  status: "active" | "suspended";
  expiresAt: string;
}
export interface Session {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  isProSubscriber: boolean;
  passwordInitialized?: boolean;
  subscription: Subscription | null;
}
export interface Note {
  id: string;
  title: string;
  biblicalReference: string;
  content: string;
  updatedAt: string;
}
export function hasActiveSubscription(
  sub: Subscription | null | undefined,
  now = Date.now(),
) {
  return sub?.status === "active" && Date.parse(sub.expiresAt) > now;
}
export function renewalExpiry(expiresAt?: string | null, now = Date.now()) {
  const prior = expiresAt ? Date.parse(expiresAt) : 0;
  return new Date(
    Math.max(now, Number.isFinite(prior) ? prior : 0) + 365 * 86400000,
  ).toISOString();
}
