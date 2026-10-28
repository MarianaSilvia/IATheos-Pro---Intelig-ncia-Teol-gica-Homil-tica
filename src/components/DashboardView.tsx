import React from "react";
import { ArrowRight, BookOpen, GraduationCap, Microscope, Scroll, Search, Sparkles, Tag } from "lucide-react";
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30"><Sparkles className="w-3.5 h-3.5" /> Central ministerial</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif">Graça e paz, <span className="text-amber-300">{displayName || "estudante"}</span>!</h1>
            <p className="text-slate-300">Organize seus estudos, prepare mensagens e consulte seus recursos em um só lugar.</p>
          </div>
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-700 min-w-[220px]"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caderno ministerial</span><div className="text-3xl font-bold text-amber-300 mt-2">{savedCount}</div><span className="text-sm text-slate-400">estudos salvos</span><div className="text-xs text-slate-500 mt-3">{new Date().toLocaleDateString("pt-BR", { dateStyle: "long" })}</div></div>
        </div>
      </section>
      <section className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2"><span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">1</span><h2 className="text-lg sm:text-xl font-bold font-serif">Ferramentas de estudo</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[["sermons","Esboço de pregação","Gere uma mensagem homilética estruturada.",Scroll,"text-amber-700"],["ebd","Apoio à EBD","Prepare aulas com objetivos e aplicações.",GraduationCap,"text-emerald-700"],["xray","Raio-X do versículo","Explore contexto e conexões bíblicas.",Microscope,"text-indigo-700"]].map(([tab,label,description,Icon,color])=><button key={String(tab)} onClick={()=>onNavigateTab(tab as TabType)} className="bg-white rounded-2xl border border-slate-200 p-5 text-left shadow-sm hover:shadow-md hover:border-amber-400 transition-all group"><div className={`w-10 h-10 rounded-xl bg-slate-100 ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div><h3 className="font-bold mt-3">{String(label)}</h3><p className="text-xs text-slate-600 mt-1">{String(description)}</p><span className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-4">Abrir ferramenta <ArrowRight className="w-3.5 h-3.5" /></span></button>)}</div></section>
      <section className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2"><span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">2</span><h2 className="text-lg sm:text-xl font-bold font-serif">Pesquisa e organização</h2></div><div className="flex flex-wrap gap-3">{[["themes","Temas bíblicos",Tag],["dictionary","Dicionário",BookOpen],["concordance","Concordância",Search],["notes","Minhas notas",Scroll]].map(([type,label,Icon])=><button key={String(type)} className="bg-white border border-slate-200 px-5 py-3 rounded-xl flex items-center gap-2 hover:border-amber-400 hover:text-amber-700" onClick={()=>onOpenModal(type as any)}><Icon className="w-4 h-4" />{String(label)}</button>)}</div></section>
      <BibleReadingProgress onNavigateToBible={onNavigateToBible} />
      <ActivitySummaryChart />
    </div>
  );
}
