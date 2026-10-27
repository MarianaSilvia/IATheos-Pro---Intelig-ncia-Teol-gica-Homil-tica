/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SermonOutline, formatSermonToMarkdown } from '../utils/theology';
import {
  Scroll,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Cross,
  Compass,
  Flame,
  Presentation,
  RefreshCw,
} from 'lucide-react';

interface SermonViewProps {
  currentSermon: SermonOutline;
  onSaveSermon: (sermon: SermonOutline) => void;
  isSaved: boolean;
  onOpenPulpitMode: (content: SermonOutline) => void;
  onGenerateSermon: (params: {
    biblicalText: string;
    theme: string;
    sermonType: 'Expositivo' | 'Temático' | 'Textual';
    targetAudience: string;
    specificFocus: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const SermonView: React.FC<SermonViewProps> = ({
  currentSermon,
  onSaveSermon,
  isSaved,
  onOpenPulpitMode,
  onGenerateSermon,
  isLoading,
}) => {
  const [biblicalText, setBiblicalText] = useState(currentSermon.biblicalText);
  const [theme, setTheme] = useState(currentSermon.title);
  const [sermonType, setSermonType] = useState<'Expositivo' | 'Temático' | 'Textual'>(currentSermon.sermonType);
  const [targetAudience, setTargetAudience] = useState(currentSermon.targetAudience);
  const [specificFocus, setSpecificFocus] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleCopy = async () => {
    const md = formatSermonToMarkdown(currentSermon);
    await navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateSermon({
      biblicalText,
      theme,
      sermonType,
      targetAudience,
      specificFocus,
    });
  };

  const loadPreset = (t: string, p: string, type: 'Expositivo' | 'Temático' | 'Textual') => {
    setTheme(t);
    setBiblicalText(p);
    setSermonType(type);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Generator Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden no-print">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Scroll className="w-3.5 h-3.5" /> Módulo de Homilética
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
              Gerador de Esboços de Sermão
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Estruturação homilética rigorosa: Tema, Texto Base, Introdução, 3 Tópicos com Exegese e Ilustrações Práticas, Conclusão e Apelo.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{showConfig ? 'Ocultar Parâmetros' : 'Personalizar Novo Sermão'}</span>
              {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Generator Form */}
        {showConfig && (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Texto Base (Bíblico)
                </label>
                <input
                  type="text"
                  value={biblicalText}
                  onChange={(e) => setBiblicalText(e.target.value)}
                  placeholder="Ex: Romanos 5:3-5, Filipenses 4:4-7"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tema Central / Título Desejado
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: A Esperança Inabalável na Adversidade"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tipo de Sermão
                </label>
                <select
                  value={sermonType}
                  onChange={(e) => setSermonType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Expositivo">Expositivo (Versículo por versículo)</option>
                  <option value="Temático">Temático (Assunto central com passagens)</option>
                  <option value="Textual">Textual (Baseado nas cláusulas do texto)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Ocasião / Público-Alvo
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Culto da Família">Culto da Família</option>
                  <option value="Celebração Dominical">Celebração Dominical</option>
                  <option value="Santa Ceia do Senhor">Santa Ceia do Senhor</option>
                  <option value="Culto de Doutrina / Ensino">Culto de Doutrina / Ensino</option>
                  <option value="Culto de Jovens">Culto de Jovens</option>
                  <option value="Vigília e Oração">Vigília e Oração</option>
                  <option value="Culto Fúnebre (Consolação)">Culto Fúnebre (Consolação)</option>
                  <option value="Evangelístico">Culto Evangelístico</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Foco Específico ou Necessidade da Igreja (Opcional)
              </label>
              <input
                type="text"
                value={specificFocus}
                onChange={(e) => setSpecificFocus(e.target.value)}
                placeholder="Ex: Ênfase em consolo para famílias endividadas, ou incentivo a missões..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Sugestões Rápidas:</span>
              <button
                type="button"
                onClick={() => loadPreset('A Esperança Inabalável na Adversidade', 'Romanos 5:3-5', 'Expositivo')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-slate-700 transition-colors"
              >
                Romanos 5:3-5 (Esperança)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('O Pastor que Não Falha', 'Salmos 23:1-6', 'Expositivo')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-slate-700 transition-colors"
              >
                Salmos 23:1-6 (Provisão)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('Salvos pela Graça para Boas Obras', 'Efésios 2:8-10', 'Textual')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-slate-700 transition-colors"
              >
                Efésios 2:8-10 (Graça)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('A Paz que Guarda o Coração', 'Filipenses 4:4-7', 'Expositivo')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-slate-700 transition-colors"
              >
                Filipenses 4:4-7 (Paz)
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Construindo Exegese & Esboço...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Esboço Homilético</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sermon Document Display Area */}
      <article className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden transition-all">
        {/* Document Header & Ministerial Actions */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/70 via-white to-white border-b border-amber-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 no-print">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200">
                {currentSermon.sermonType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentSermon.targetAudience}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenPulpitMode(currentSermon)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-200 text-xs font-semibold transition-all shadow-sm"
                title="Abrir no Modo Púlpito com texto ampliado"
              >
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>Púlpito</span>
              </button>

              <button
                onClick={() => onSaveSermon(currentSermon)}
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
                title="Copiar esboço completo formatado"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Imprimir ou gerar PDF do esboço"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
            {currentSermon.title}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm sm:text-base text-amber-900 font-semibold font-serif">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>Texto Base: {currentSermon.biblicalText}</span>
          </div>

          {currentSermon.theme && (
            <p className="mt-1 text-xs sm:text-sm text-slate-600 italic">
              Ênfase: {currentSermon.theme}
            </p>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: INTRODUÇÃO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-600/40">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                I
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Introdução da Mensagem
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" /> Gancho de Atenção
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentSermon.introduction.hook}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Scroll className="w-3.5 h-3.5" /> Contexto Histórico
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentSermon.introduction.historicalContext}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Problema que o Texto Resolve
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentSermon.introduction.problemSolved}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: DESENVOLVIMENTO (3 TÓPICOS COM ILUSTRAÇÃO PRÁTICA) */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-600/40">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                II
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Desenvolvimento Homilético (3 Tópicos Principais)
              </h3>
            </div>

            <div className="space-y-6">
              {currentSermon.topics.map((topic) => (
                <div
                  key={topic.number}
                  className="rounded-2xl border border-slate-200/90 shadow-sm bg-white overflow-hidden transition-all hover:border-amber-300"
                >
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 font-extrabold text-slate-950 text-sm shadow">
                      {topic.number}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-amber-100">
                      {topic.subtitle}
                    </h4>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Exegetical Explanation */}
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Explicação Exegética & Fundamentação Bíblica:
                      </span>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
                        {topic.exegeticalExplanation}
                      </p>
                    </div>

                    {/* Practical Illustration */}
                    <div className="p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 border-amber-200/60">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Ilustração Prática (Analogia / Metáfora para o Pregador):</span>
                      </div>
                      <p className="text-sm sm:text-base text-amber-950 font-serif italic leading-relaxed">
                        "{topic.practicalIllustration}"
                      </p>
                    </div>

                    {/* Cross References */}
                    {topic.crossReferences && topic.crossReferences.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500 font-semibold">Referências Cruzadas:</span>
                        {topic.crossReferences.map((ref, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: CONCLUSÃO E APLICAÇÃO PRÁTICA */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-600/40">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                III
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Conclusão & Aplicação Prática para a Igreja Hoje
              </h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                {currentSermon.conclusionAndApplication.summary}
              </p>

              <div>
                <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  Diretrizes de Aplicação Prática:
                </span>
                <ul className="space-y-2">
                  {currentSermon.conclusionAndApplication.practicalCall.map((call, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{call}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 4: APELO E ORAÇÃO FINAL */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-amber-600/40">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                IV
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Apelo & Oração Final (Momento do Altar)
              </h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/30 to-amber-50 border border-amber-200/80 space-y-4">
              <div>
                <span className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Direcionamento para o Altar:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {currentSermon.altarCallAndPrayer.prayerDirection}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-white border border-amber-300 shadow-sm">
                <span className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cross className="w-3.5 h-3.5 text-amber-600" /> Sugestão de Oração Pastoral:
                </span>
                <blockquote className="text-sm sm:text-base text-slate-900 font-serif italic leading-relaxed border-l-2 border-amber-600 pl-3">
                  "{currentSermon.altarCallAndPrayer.suggestedPrayer}"
                </blockquote>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
