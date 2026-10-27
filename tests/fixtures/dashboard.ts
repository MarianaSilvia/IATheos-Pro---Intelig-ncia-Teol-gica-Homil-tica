import type { DailyReadingPlan } from "../../src/utils/dashboard";
export const INITIAL_READING_PLAN: DailyReadingPlan = {
  day: 42,
  totalDays: 365,
  date: "27 de Outubro",
  title: "A Nova Aliança e os Frutos do Espírito",
  readings: [
    { id: "r1", reference: "Romanos 5:1-11", completed: true },
    { id: "r2", reference: "Gálatas 5:16-26", completed: true },
    { id: "r3", reference: "Salmos 34:1-10", completed: false },
    { id: "r4", reference: "Provérbios 3:5-6", completed: false },
  ],
  streakDays: 7,
  devotionalText:
    "A paz com Deus mediante nosso Senhor Jesus Cristo não é uma trégua temporária com o pecado, mas o estabelecimento perpétuo do favor celestial sobre nossa vida. Hoje, guarde o seu coração no amor que foi derramado pelo Espírito Santo.",
};
