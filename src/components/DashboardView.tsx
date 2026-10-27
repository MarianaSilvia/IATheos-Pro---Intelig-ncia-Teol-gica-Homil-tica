/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DailyReadingPlan,
  INITIAL_READING_PLAN,
} from '../utils/dashboard';
import { BibleReadingProgress } from './BibleReadingProgress';
import {
  Sparkles,
  BookOpen,
  Scroll,
  Microscope,
  Music,
  ShoppingBag,
  GraduationCap,
  Tag,
  Search,
  CheckCircle2,
  Circle,
  Flame,
  Calendar,
  MessageSquare,
  Bookmark,
  Users,
  ArrowRight,
  TrendingUp,
  Heart,
  Presentation,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { TabType } from './Navbar';

interface DashboardViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenModal: (type: 'themes' | 'dictionary' | 'concordance' | 'community' | 'notes') => void;
  onNavigateToSermon: (text: string, theme: string) => void;
  onNavigateToXray: (verse: string) => void;
  onOpenPulpitMode: () => void;
  isProSubscriber: boolean;
  savedCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenModal,
  onNavigateToSermon,
  onNavigateToXray,
  onOpenPulpitMode,
  isProSubscriber,
  savedCount,
}) => {
  const [readingPlan] = useState<DailyReadingPlan>(INITIAL_READING_PLAN);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. WELCOME HERO & DEVOTIONAL VERSE OF THE DAY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Central do Obreiro & Estudante
              </span>
              {isProSubscriber && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Assinante Pro Ativo
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-slate-100 tracking-tight">
              Graça e paz, <span className="text-amber-300">Mariana</span>! 👋
            </h1>

            {/* Versículo do Dia Highlight Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold font-serif">
                <span>VERSÍCULO DO DIA: ROMANOS 5:5</span>
                <span className="text-slate-400 text-[11px] font-sans">27 de Outubro</span>
              </div>
              <blockquote className="text-sm sm:text-base text-slate-200 font-serif italic leading-relaxed">
                "Ora, a esperança não nos decepciona, porque o amor de Deus é derramado em nosso coração pelo Espírito Santo, que nos foi outorgado."
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
                <button
                  onClick={() => onNavigateToXray('Romanos 5:5')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold flex items-center gap-1.5 border border-amber-400/30 transition-colors"
                >
                  <Microscope className="w-3.5 h-3.5" />
                  <span>Raio-X nos Originais</span>
                </button>

                <button
                  onClick={() => onNavigateToSermon('Romanos 5:3-5', 'A Esperança Inabalável na Adversidade')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Scroll className="w-3.5 h-3.5" />
                  <span>Preparar Sermão</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-slate-950/70 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 min-w-[280px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Seu Progresso Espiritual
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Sequência</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {readingPlan.streakDays} dias
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Plano Anual</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  Dia {readingPlan.day}/365
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estudos no Caderno:</span>
              <span className="font-bold text-amber-300 font-mono">{savedCount} salvos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMPONENTE DE PROGRESSO DE LEITURA BÍBLICA NO ANO (BARRA VISUAL & MARCAÇÃO DE CAPÍTULOS) */}
      <BibleReadingProgress
        onNavigateTab={onNavigateTab}
        onNavigateToBible={(bookName, chapter) => onNavigateTab('bible_harp')}
      />

      {/* 3. CARTÕES DE ACESSO RÁPIDO ("ENCARTES") - 4 GRUPOS */}
      <div className="space-y-8">
        {/* GRUPO 1: FERRAMENTAS DE ESTUDO E IA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Ferramentas de Estudo Teológico & IA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Criador de Esboços */}
            <div
              onClick={() => onNavigateTab('sermons')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scroll className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-amber-700 transition-colors">
                  Criador de Esboços de Sermões
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gere sermões com tema, texto base, introdução, 3 tópicos com ilustrações exegéticas, conclusão e apelo de altar.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 pt-2 border-t border-slate-100">
                <span>Criar Esboço Homilético</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Temas Bíblicos */}
            <div
              onClick={() => onOpenModal('themes')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Temas Bíblicos
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Versículos e estudos agrupados por temas do cotidiano: Ansiedade, Família, Fé inabalável, Finanças e Oração.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
                <span>Explorar Temas da Vida</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Dicionário Bíblico */}
            <div
              onClick={() => onOpenModal('dictionary')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Dicionário Bíblico
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Catálogo de termos antigos, locais bíblicos, personagens e conceitos teológicos explicados em profundidade.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-700 pt-2 border-t border-slate-100">
                <span>Consultar Termos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Concordância Bíblica */}
            <div
              onClick={() => onOpenModal('concordance')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-purple-700 transition-colors">
                  Concordância Bíblica
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Localize onde palavras específicas ocorrem nas Escrituras com contagem e textos do AT e NT.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 pt-2 border-t border-slate-100">
                <span>Pesquisar Ocorrências</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* GRUPO 2: LEITURA E DEVOCIONAL DIÁRIO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Leitura e Devocional Diário
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Bíblia Sagrada Online */}
            <div
              onClick={() => onNavigateTab('bible_harp')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-amber-700 transition-colors">
                  Bíblia Sagrada Online
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Leitor completo com múltiplas versões em português (ARC, NAA, NVI, KJF), controle de fonte e ponte com o Raio-X.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 pt-2 border-t border-slate-100">
                <span>Abrir Leitor Bíblico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Harpa Cristã */}
            <div
              onClick={() => onNavigateTab('bible_harp')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-rose-700 transition-colors">
                  Harpa Cristã
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Coletânea de hinos tradicionais com busca por número ou letra, refrão destacado e contexto histórico dos autores.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 pt-2 border-t border-slate-100">
                <span>Cantar & Louvar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Raio-X do Versículo */}
            <div
              onClick={() => onNavigateTab('xray')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Microscope className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Raio-X do Versículo
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exegese nos originais grego e hebraico com números Strong, contexto cultural e aplicação hermenêutica viva.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-700 pt-2 border-t border-slate-100">
                <span>Analisar Versículo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* GRUPO 3: GESTÃO PESSOAL E COMUNIDADE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Gestão Pessoal & Comunidade Ministerial
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Minhas Anotações */}
            <div
              onClick={() => onOpenModal('notes')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-amber-700 transition-colors">
                  Minhas Anotações & Favoritos
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bloco de notas pessoal e lista de versículos salvos vinculados aos estudos e sermões ministeriais.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 pt-2 border-t border-slate-100">
                <span>Acessar Bloco de Notas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Anotações Públicas (Comunidade) */}
            <div
              onClick={() => onOpenModal('community')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-blue-700 transition-colors">
                  Anotações Públicas (Comunidade)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Feed interativo onde membros da comunidade compartilham reflexões sobre o tema bíblico semanal.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 pt-2 border-t border-slate-100">
                <span>Ver Feed Comunitário</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Consultor Teológico Livre */}
            <div
              onClick={() => onNavigateTab('chat')}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base font-serif text-slate-900 group-hover:text-teal-700 transition-colors">
                  Consultor Teológico IA
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tire dúvidas hermenêuticas, passagens difíceis (*crux interpretum*) e alianças bíblicas em tempo real.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-teal-700 pt-2 border-t border-slate-100">
                <span>Iniciar Consulta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* GRUPO 4: E-COMMERCE E INFOPRODUTOS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-amber-600/30 pb-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              E-Commerce, Infoprodutos & Apoio à EBD
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Loja de PDFs e Livros */}
            <div
              onClick={() => onNavigateTab('store')}
              className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg font-serif text-slate-900 group-hover:text-amber-700 transition-colors">
                  Biblioteca de Arquivos (Loja de PDFs)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Vitrine com livros teológicos, comentários bíblicos, revistas da EBD e manuais pastorais em PDF disponíveis para aquisição e download.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 pt-3 border-t border-slate-200">
                <span>Explorar Livraria Digital</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Apoio à EBD */}
            <div
              onClick={() => onNavigateTab('ebd')}
              className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg font-serif text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Apoio à Escola Bíblica Dominical (EBD)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gerador didático para professores: objetivos de aula, dinâmicas de quebra-gelo, pontos para quadro/slides e perguntas para debate.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-3 border-t border-slate-200">
                <span>Preparar Aula da EBD</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
