/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VerseXray, formatVerseXrayToMarkdown } from "../utils/theology";
import {
  Microscope,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Printer,
  ChevronDown,
  ChevronUp,
  Languages,
  History,
  Link,
  Heart,
  RefreshCw,
  Search,
} from "lucide-react";

interface VerseXrayViewProps {
  currentXray: VerseXray;
  onSaveXray: (xray: VerseXray) => void;
  isSaved: boolean;
  onGenerateXray: (params: {
    verseReference: string;
    translation: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const VerseXrayView: React.FC<VerseXrayViewProps> = ({
  currentXray,
  onSaveXray,
  isSaved,
  onGenerateXray,
  isLoading,
}) => {
  const [verseReference, setVerseReference] = useState(
    currentXray.verseReference,
  );
  const [translation, setTranslation] = useState(currentXray.translation);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleCopy = async () => {
    const md = formatVerseXrayToMarkdown(currentXray);
    await navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateXray({ verseReference, translation });
  };

  const loadPreset = (v: string) => {
    setVerseReference(v);
    onGenerateXray({ verseReference: v, translation });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden no-print">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Microscope className="w-3.5 h-3.5" /> Módulo de Raio-X do
              Versículo
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-indigo-100">
              Exegese Simplificada & Originais Bíblicos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Análise profunda nos manuscritos originais em Grego Koiné e
              Hebraico Bíblico: etimologia, raízes, léxico de Strong e
              significado para a igreja hoje.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {showConfig ? "Ocultar Busca" : "Analisar Outro Versículo"}
              </span>
              {showConfig ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search & Config Form */}
        {showConfig && (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Referência do Versículo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                    placeholder="Ex: João 3:16, Romanos 12:2, Efésios 2:8, Gênesis 1:1"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tradução Bíblica
                </label>
                <select
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Almeida Revista e Atualizada (ARA)">
                    Almeida Revista e Atualizada (ARA)
                  </option>
                  <option value="Nova Versão Internacional (NVI)">
                    Nova Versão Internacional (NVI)
                  </option>
                  <option value="Almeida Revista e Corrigida (ARC)">
                    Almeida Revista e Corrigida (ARC)
                  </option>
                  <option value="Bíblia King James Atualizada (BKJ)">
                    Bíblia King James (BKJ)
                  </option>
                  <option value="Nova Almeida Atualizada (NAA)">
                    Nova Almeida Atualizada (NAA)
                  </option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">
                Versículos Sugeridos:
              </span>
              <button
                type="button"
                onClick={() => loadPreset("João 3:16")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-lg text-slate-700 transition-colors"
              >
                João 3:16 (Amor & Vida Eterna)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("Romanos 12:2")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-lg text-slate-700 transition-colors"
              >
                Romanos 12:2 (Metamorphousthe & Aion)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("Salmos 23:1")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-lg text-slate-700 transition-colors"
              >
                Salmos 23:1 (Yahweh Rohi)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("Efésios 2:8-9")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-lg text-slate-700 transition-colors"
              >
                Efésios 2:8-9 (Charis & Dōron)
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executando Raio-X dos Originais...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Realizar Raio-X Exegético</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Main Display Document */}
      <article className="print-document bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden transition-all">
        {/* Header with Verse & Reference */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-indigo-50/70 via-white to-white border-b border-indigo-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 no-print">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 border border-indigo-200">
                Raio-X Exegético
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentXray.translation}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onSaveXray(currentXray)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSaved
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
                title="Salvar no Caderno Ministerial"
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-emerald-600 text-emerald-600" : "text-slate-500"}`}
                />
                <span>{isSaved ? "Salvo" : "Salvar"}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Copiar Raio-X formatado em Markdown"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
                <span>{isCopied ? "Copiado!" : "Copiar"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Imprimir análise exegética"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {currentXray.verseReference}
          </h2>

          <div className="mt-4 p-5 rounded-2xl bg-slate-900 text-white shadow-inner border border-slate-800">
            <blockquote className="text-base sm:text-lg lg:text-xl font-serif italic text-amber-200 leading-relaxed">
              "{currentXray.verseText}"
            </blockquote>
          </div>
        </div>

        <div className="print-content p-6 sm:p-8 space-y-8">
          {/* SECTION 1: CONTEXTO HISTÓRICO-CULTURAL */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-600/40">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <History className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Contexto Histórico-Cultural & Literário
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Cenário Histórico da Época:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {currentXray.historicalCulturalContext.historicalSetting}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Pano de Fundo Cultural & Mentalidade:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {currentXray.historicalCulturalContext.culturalBackground}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
                  Contexto Literário Imediato:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {
                    currentXray.historicalCulturalContext
                      .immediateLiteraryContext
                  }
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
                  Autor Inspirado & Destinatários:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {currentXray.historicalCulturalContext.authorAndAudience}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: PALAVRAS-CHAVE NOS ORIGINAIS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-600/40">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Languages className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                Palavras-Chave nos Originais (Grego / Hebraico)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {currentXray.originalKeywords.map((word, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-400 hover:shadow-md"
                >
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                        {word.term}
                      </span>
                      <span className="ml-2 text-xs text-slate-300 italic">
                        ({word.transliteration})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Strong: {word.strongCode}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {word.originalLanguage}
                      </span>
                      <span className="text-slate-500">Raiz:</span>
                      <span className="font-mono font-medium text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {word.rootWord}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Significado Literal:
                      </span>
                      <p className="text-sm font-semibold text-slate-900">
                        {word.literalMeaning}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                        Profundidade Teológica / Nuance:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {word.theologicalDepth}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: REFERÊNCIAS CRUZADAS */}
          {currentXray.crossReferences &&
            currentXray.crossReferences.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-600/40">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    <Link className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                    Referências Cruzadas Cruciais
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentXray.crossReferences.map((cr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <span className="text-xs font-bold text-indigo-800 font-serif block">
                        {cr.reference}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {cr.connection}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* SECTION 4: O QUE O TEXTO SIGNIFICA PARA NÓS HOJE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-600/40">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                O Que o Texto Significa para Nós Hoje (Hermenêutica Viva)
              </h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/50 border border-indigo-200/80 space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                  Princípio Hermenêutico Atemporal:
                </span>
                <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed">
                  {currentXray.theologicalMeaningToday.hermeneuticalPrinciple}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Aplicações Contemporâneas:
                </span>
                <ul className="space-y-2">
                  {currentXray.theologicalMeaningToday.contemporaryApplication.map(
                    (app, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm sm:text-base text-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{app}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-indigo-300 shadow-sm">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                  Encorajamento Pastoral:
                </span>
                <p className="text-sm sm:text-base text-slate-800 font-serif italic leading-relaxed">
                  "{currentXray.theologicalMeaningToday.pastoralEncouragement}"
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
