import React from "react";
import { BibleReadingProgress } from "./BibleReadingProgress";
import { ActivitySummaryChart } from "./ActivitySummaryChart";
import type { TabType } from "./Navbar";
export function DashboardView({
  displayName,
  savedCount,
  onNavigateTab,
  onOpenModal,
  onNavigateToBible,
}: {
  displayName: string;
  savedCount: number;
  onNavigateTab: (tab: TabType) => void;
  onOpenModal: (
    type: "themes" | "dictionary" | "concordance" | "notes",
  ) => void;
  onNavigateToBible: (book: string, chapter: number) => void;
}) {
  return (
    <div className="space-y-7">
      <section className="bg-slate-900 text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-serif text-amber-200">
          Graça e paz, {displayName || "estudante"}!
        </h1>
        <p className="mt-3">
          {savedCount} estudos salvos no seu caderno ministerial.
        </p>
        <p className="mt-2 text-slate-400">
          {new Date().toLocaleDateString("pt-BR", { dateStyle: "long" })}
        </p>
      </section>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["sermons", "Criar sermão"],
          ["ebd", "Preparar aula EBD"],
          ["xray", "Raio-X do versículo"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            className="bg-white border rounded-2xl p-6 text-left font-bold hover:border-amber-600"
            onClick={() => onNavigateTab(tab as TabType)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {[
          ["themes", "Temas bíblicos"],
          ["dictionary", "Dicionário"],
          ["concordance", "Concordância"],
          ["notes", "Minhas notas"],
        ].map(([type, label]) => (
          <button
            key={type}
            className="bg-white border px-5 py-3 rounded-xl"
            onClick={() => onOpenModal(type as any)}
          >
            {label}
          </button>
        ))}
      </div>
      <BibleReadingProgress onNavigateToBible={onNavigateToBible} />
      <ActivitySummaryChart />
    </div>
  );
}
