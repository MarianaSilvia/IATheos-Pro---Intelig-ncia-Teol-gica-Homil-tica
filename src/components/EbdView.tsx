/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EbdLesson, formatEbdToMarkdown } from '../utils/theology';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Printer,
  ChevronDown,
  ChevronUp,
  Target,
  Smile,
  HelpCircle,
  Award,
  RefreshCw,
  Layers,
  MessageCircle,
} from 'lucide-react';

interface EbdViewProps {
  currentLesson: EbdLesson;
  onSaveLesson: (lesson: EbdLesson) => void;
  isSaved: boolean;
  onGenerateLesson: (params: {
    biblicalText: string;
    theme: string;
    targetAudience: 'Adultos' | 'Jovens' | 'Adolescentes' | 'Crianças' | 'Novos Convertidos' | 'Liderança';
    lessonDuration: string;
    emphasis: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const EbdView: React.FC<EbdViewProps> = ({
  currentLesson,
  onSaveLesson,
  isSaved,
  onGenerateLesson,
  isLoading,
}) => {
  const [biblicalText, setBiblicalText] = useState(currentLesson.biblicalText);
  const [theme, setTheme] = useState(currentLesson.title);
  const [targetAudience, setTargetAudience] = useState<EbdLesson['targetAudience']>(currentLesson.targetAudience);
  const [lessonDuration, setLessonDuration] = useState('50 minutos');
  const [emphasis, setEmphasis] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleCopy = async () => {
    const md = formatEbdToMarkdown(currentLesson);
    await navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateLesson({
      biblicalText,
      theme,
      targetAudience,
      lessonDuration,
      emphasis,
    });
  };

  const loadPreset = (t: string, p: string, aud: EbdLesson['targetAudience']) => {
    setTheme(t);
    setBiblicalText(p);
    setTargetAudience(aud);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Generator Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden no-print">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" /> Módulo de Apoio à EBD
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-emerald-100">
              Planejador Didático para Escola Bíblica
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Didática cristã aplicada por faixa etária: Objetivo, Quebra-Gelo, Pontos para Quadro/Slides, Perguntas para Debate e Desafio Semanal.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showConfig ? 'Ocultar Parâmetros' : 'Nova Aula para EBD'}</span>
              {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Form */}
        {showConfig && (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Texto Bíblico Base
                </label>
                <input
                  type="text"
                  value={biblicalText}
                  onChange={(e) => setBiblicalText(e.target.value)}
                  placeholder="Ex: Atos 12:1-17, Daniel 1:1-21"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tema da Aula
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: O Poder da Oração de Joelhos"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faixa Etária / Classe
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Adultos">Adultos</option>
                  <option value="Jovens">Jovens (18 a 30 anos)</option>
                  <option value="Adolescentes">Adolescentes (12 a 17 anos)</option>
                  <option value="Crianças">Crianças / Infantil</option>
                  <option value="Novos Convertidos">Novos Convertidos / Discipulado</option>
                  <option value="Liderança">Liderança / Obreiros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Duração da Aula
                </label>
                <select
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="45 minutos">45 minutos</option>
                  <option value="50 minutos">50 minutos (Padrão)</option>
                  <option value="1 hora">1 hora</option>
                  <option value="1 hora e 20 minutos">1 hora e 20 minutos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Ênfase Didática Específica (Opcional)
              </label>
              <input
                type="text"
                value={emphasis}
                onChange={(e) => setEmphasis(e.target.value)}
                placeholder="Ex: Foco em aplicação prática no ambiente de trabalho ou escola..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Sugestões de Aulas:</span>
              <button
                type="button"
                onClick={() => loadPreset('O Poder da Oração de Joelhos', 'Atos 12:1-17', 'Adultos')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-lg text-slate-700 transition-colors"
              >
                Atos 12 (Oração de Joelhos - Adultos)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('Integridade na Babilônia Moderna', 'Daniel 1:1-21', 'Jovens')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-lg text-slate-700 transition-colors"
              >
                Daniel 1 (Integridade - Jovens)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('O Bom Samaritano: Amor em Ação', 'Lucas 10:25-37', 'Crianças')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-lg text-slate-700 transition-colors"
              >
                Lucas 10 (Amor Prático - Crianças)
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Elaborando Plano Didático...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Plano de Aula EBD</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lesson Document Display Area */}
      <article className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden transition-all">
        {/* Document Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/70 via-white to-white border-b border-emerald-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 no-print">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200">
                Classe: {currentLesson.targetAudience}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Escola Bíblica Dominical
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onSaveLesson(currentLesson)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
                title="Salvar no Caderno Ministerial"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : 'text-slate-500'}`} />
                <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Copiar plano completo formatado"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Imprimir lição da EBD"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
            {currentLesson.title}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm sm:text-base text-emerald-900 font-semibold font-serif">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>Texto Base: {currentLesson.biblicalText}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* OBJETIVO DA AULA */}
          <section className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Objetivo da Aula (O que os alunos devem aprender e viver):
              </span>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                {currentLesson.lessonObjective}
              </p>
            </div>
          </section>

          {/* INTRODUÇÃO / QUEBRA-GELO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-600/40">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Introdução / Quebra-Gelo da Classe
              </h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Smile className="w-4 h-4 text-emerald-600" />
                <span>Dinâmica: {currentLesson.icebreaker.title}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {currentLesson.icebreaker.description}
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 font-serif italic text-sm sm:text-base">
                <strong>Pergunta Reflexiva Inicial:</strong> "{currentLesson.icebreaker.reflectiveQuestion}"
              </div>
            </div>
          </section>

          {/* CONTEÚDO DA AULA (PONTOS PARA O QUADRO/SLIDES) */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-600/40">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Explicação do Texto (Pontos para o Quadro & Ministração)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {currentLesson.contentPoints.map((point) => (
                <div
                  key={point.pointNumber}
                  className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden transition-all hover:border-emerald-300"
                >
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500 font-bold text-slate-950 text-xs flex items-center justify-center">
                        {point.pointNumber}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-emerald-100">
                        {point.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                      {point.scriptureReference}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Board summary for teacher to write/project */}
                    <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm border border-slate-800">
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
                        [Síntese para passar na Lousa ou Projetar no Slide]:
                      </span>
                      {point.boardSummary}
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Explicação para o Professor Ensinar:
                      </span>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {point.teacherExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PERGUNTAS PARA DEBATE EM CLASSE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-600/40">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Perguntas para Debate e Participação dos Alunos
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentLesson.discussionQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 transition-colors hover:bg-emerald-50/50"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 font-medium">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CONCLUSÃO PRÁTICA E DESAFIO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-600/40">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Conclusão Prática & Desafio Semanal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Ponto Central Inegociável:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
                  {currentLesson.practicalConclusion.coreTakeaway}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Desafio Prático da Semana:
                </span>
                <p className="text-sm sm:text-base text-emerald-950 leading-relaxed">
                  {currentLesson.practicalConclusion.weeklyChallenge}
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
