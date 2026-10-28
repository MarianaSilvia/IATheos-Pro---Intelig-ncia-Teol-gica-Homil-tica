/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenClientLogin: () => void;
  onGoToPricing: () => void;
  onEnterApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenClientLogin,
  onGoToPricing,
  onEnterApp,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-slate-900">
          {/* Brand */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-white font-['Cinzel',serif] tracking-tight">
                IATheos Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O ecossistema inteligente de inteligência artificial teológica, exegese dos textos originais, didática bíblica e homilética para o ministério contemporâneo.
            </p>
          </div>

          {/* Nav mirror */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <a href="#recursos" className="hover:text-amber-400 transition-colors">
              Recursos
            </a>
            <a href="#demonstracao" className="hover:text-amber-400 transition-colors">
              Demonstração
            </a>
            <a href="#precos" className="hover:text-amber-400 transition-colors">
              Pacote Anual
            </a>
            <button
              onClick={onOpenClientLogin}
              className="hover:text-amber-400 transition-colors cursor-pointer text-slate-300"
            >
              Área do Cliente (E-mail)
            </button>
            <button
              onClick={onEnterApp}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Acessar Painel
            </button>
          </div>
        </div>

        {/* Biblical Quote & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="italic text-slate-400 text-center sm:text-left">
            "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho." — Salmos 119:105
          </div>

          <div className="text-center sm:text-right">
            © {new Date().getFullYear()} IATheos Pro. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
