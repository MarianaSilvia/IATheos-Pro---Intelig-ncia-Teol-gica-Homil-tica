/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SermonOutline } from "../utils/theology";
import {
  X,
  Type,
  Sun,
  Moon,
  BookOpen,
  Maximize2,
  Minimize2,
  Lightbulb,
  Cross,
  ChevronRight,
} from "lucide-react";

interface PulpitModeModalProps {
  sermon: SermonOutline;
  onClose: () => void;
}

export const PulpitModeModal: React.FC<PulpitModeModalProps> = ({
  sermon,
  onClose,
}) => {
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<"parchment" | "dark" | "light">(
    "parchment",
  );

  const themeStyles = {
    parchment: "bg-[#faf6ee] text-[#1e1b18] border-[#e8decb]",
    dark: "bg-[#0f172a] text-[#f1f5f9] border-[#1e293b]",
    light: "bg-[#ffffff] text-[#0f172a] border-[#e2e8f0]",
  };

  const cardStyles = {
    parchment: "bg-[#f4eedf] border-[#dfd4be]",
    dark: "bg-[#1e293b] border-[#334155]",
    light: "bg-[#f8fafc] border-[#e2e8f0]",
  };

  const accentStyles = {
    parchment: "text-amber-800 border-amber-600",
    dark: "text-amber-400 border-amber-500",
    light: "text-amber-700 border-amber-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
            Modo Púlpito
          </span>
          <h2 className="text-sm sm:text-base font-bold font-serif text-amber-100 truncate max-w-xs sm:max-w-md">
            {sermon.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Font Controls */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Diminuir fonte"
            >
              A-
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Aumentar fonte"
            >
              A+
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setTheme("parchment")}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                theme === "parchment"
                  ? "bg-amber-900/60 text-amber-200 font-bold"
                  : "text-slate-400"
              }`}
              title="Pergaminho (Ideal para leitura)"
            >
              Pergaminho
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                theme === "dark"
                  ? "bg-slate-700 text-white font-bold"
                  : "text-slate-400"
              }`}
              title="Modo Escuro"
            >
              Escuro
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                theme === "light"
                  ? "bg-slate-200 text-slate-900 font-bold"
                  : "text-slate-400"
              }`}
              title="Modo Claro"
            >
              Claro
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition-colors"
            title="Fechar Modo Púlpito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preaching Body */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 transition-colors ${themeStyles[theme]}`}
      >
        <div
          className="max-w-4xl mx-auto space-y-8"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Title Header */}
          <div className="border-b-2 pb-6 border-current opacity-90 space-y-2">
            <span
              className={`text-xs font-bold uppercase tracking-widest block ${accentStyles[theme]}`}
            >
              Texto Sagrado: {sermon.biblicalText}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
              {sermon.title}
            </h1>
            <p className="text-sm opacity-75 italic">
              {sermon.sermonType} • {sermon.targetAudience}
            </p>
          </div>

          {/* INTRODUÇÃO */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-sans">
                I
              </span>
              Introdução
            </h2>

            <div
              className={`p-5 rounded-2xl border ${cardStyles[theme]} space-y-3`}
            >
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider opacity-60">
                  Gancho de Atenção:
                </span>
                <p className="leading-relaxed font-sans">
                  {sermon.introduction.hook}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-current/10">
                <span className="text-xs uppercase font-bold tracking-wider opacity-60">
                  Contexto Histórico:
                </span>
                <p className="leading-relaxed font-sans">
                  {sermon.introduction.historicalContext}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-current/10">
                <span className="text-xs uppercase font-bold tracking-wider opacity-60">
                  Problema Resolvido:
                </span>
                <p className="leading-relaxed font-sans font-medium">
                  {sermon.introduction.problemSolved}
                </p>
              </div>
            </div>
          </section>

          {/* 3 TÓPICOS PRINCIPAIS */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-sans">
                II
              </span>
              Desenvolvimento
            </h2>

            <div className="space-y-6">
              {sermon.topics.map((t) => (
                <div
                  key={t.number}
                  className={`p-6 rounded-2xl border ${cardStyles[theme]} space-y-4`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow">
                      {t.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-serif leading-snug">
                      {t.subtitle}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider opacity-60">
                      Exegese & Conteúdo:
                    </span>
                    <p className="leading-relaxed font-sans">
                      {t.exegeticalExplanation}
                    </p>
                  </div>

                  {/* Highlighted Illustration */}
                  <div
                    className={`p-4 rounded-xl border-l-4 border-amber-500 bg-amber-500/10 space-y-1`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" /> Ilustração Prática para
                      o Altar:
                    </span>
                    <p className="font-serif italic leading-relaxed">
                      "{t.practicalIllustration}"
                    </p>
                  </div>

                  {t.crossReferences && t.crossReferences.length > 0 && (
                    <div className="text-xs opacity-75 font-mono pt-1">
                      Textos: {t.crossReferences.join(" • ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CONCLUSÃO & APLICAÇÃO */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-sans">
                III
              </span>
              Conclusão & Aplicação Prática
            </h2>

            <div
              className={`p-6 rounded-2xl border ${cardStyles[theme]} space-y-4`}
            >
              <p className="leading-relaxed font-semibold">
                {sermon.conclusionAndApplication.summary}
              </p>
              <ul className="space-y-2">
                {sermon.conclusionAndApplication.practicalCall.map(
                  (call, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <ChevronRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{call}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </section>

          {/* APELO & ORAÇÃO */}
          <section className="space-y-4 pb-12">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-sans">
                IV
              </span>
              Apelo & Oração do Altar
            </h2>

            <div
              className={`p-6 rounded-2xl border-2 border-amber-500/60 ${cardStyles[theme]} space-y-4`}
            >
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-600 block mb-1">
                  Direcionamento Pastoral:
                </span>
                <p className="leading-relaxed font-sans">
                  {sermon.altarCallAndPrayer.prayerDirection}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-current/20 bg-current/5 space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider opacity-60 flex items-center gap-1.5">
                  <Cross className="w-3.5 h-3.5 text-amber-500" /> Oração
                  Sugerida:
                </span>
                <blockquote className="font-serif italic leading-relaxed">
                  "{sermon.altarCallAndPrayer.suggestedPrayer}"
                </blockquote>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
