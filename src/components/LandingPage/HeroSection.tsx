/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Mic,
  Languages,
} from 'lucide-react';

interface HeroSectionProps {
  onGoToPricing: () => void;
  onGoToDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToPricing,
  onGoToDemo,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-950 text-white">
      {/* Background radial gradients for Modern Christian atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/10 via-blue-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Subtle biblical inspirational kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-medium shadow-sm backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>"Lâmpada para os meus pés é a tua palavra e luz para o meu caminho" · Sl 119:105</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 font-['Cinzel',serif] leading-[1.15] text-balance">
            A Inteligência Artificial a serviço da{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Palavra de Deus.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl text-balance">
            Organize esboços de pregação, aulas de EBD e estudos bíblicos com IA responsável, acervo parcial identificado e ferramentas conectadas para a sua preparação ministerial.
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onGoToPricing}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Quero Assinar o Plano Anual</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToDemo}
              className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>Ver Demonstração ao Vivo</span>
            </button>
          </div>

          {/* Frase de Apoio Bíblica */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 italic max-w-xl">
            <span>
              "Visto como o Seu divino poder nos deu tudo o que diz respeito à vida e à piedade..." — 2 Pedro 1:3
            </span>
          </div>

          {/* Proof Metric Strip */}
          <div className="pt-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                Acervo parcial
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Textos e hinos exibidos conforme disponibilidade e licença
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                Estudo conectado
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Bíblia, seleção, notas, temas e ferramentas no mesmo fluxo
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                Harpa parcial
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Busca e cópia dos hinos cadastrados no acervo
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                Gemini no servidor
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Respostas estruturadas, limitadas e sujeitas à revisão
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
