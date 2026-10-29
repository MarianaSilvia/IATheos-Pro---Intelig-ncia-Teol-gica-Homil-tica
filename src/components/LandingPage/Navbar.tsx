/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, User, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenClientLogin: () => void;
  onGoToPricing: () => void;
  onEnterApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenClientLogin,
  onGoToPricing,
  onEnterApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-amber-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-['Cinzel',serif]">
                  Verbo Norte
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">
                Inteligência Teológica
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#recursos"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Recursos
          </a>
          <a
            href="#demonstracao"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Demonstração
          </a>
          <a
            href="#precos"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Pacote Anual
          </a>
          <button
            onClick={onOpenClientLogin}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-slate-300 cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-amber-400/80" />
            <span>Entrar</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Access */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onEnterApp}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Acessar Painel
          </button>
          <button
            onClick={onGoToPricing}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Garantir Acesso Anual</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-400 font-medium"
          >
            Recursos
          </a>
          <a
            href="#demonstracao"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-400 font-medium"
          >
            Demonstração
          </a>
          <a
            href="#precos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-400 font-medium"
          >
            Pacote Anual
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenClientLogin();
            }}
            className="w-full text-left py-2 text-amber-400 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Entrar por E-mail (Área do Cliente)</span>
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterApp();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl"
            >
              Acessar Painel do Usuário
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToPricing();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-950 bg-amber-400 rounded-xl shadow"
            >
              Garantir Acesso Anual
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
