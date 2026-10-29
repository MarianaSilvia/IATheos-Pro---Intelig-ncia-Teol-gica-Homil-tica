/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Scroll,
  GraduationCap,
  Microscope,
  MessageSquareQuote,
  Bookmark,
  Presentation,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  User,
  Music,
} from "lucide-react";
import { UserRole } from "../utils/ecosystem";

export type TabType =
  | "dashboard"
  | "sermons"
  | "ebd"
  | "xray"
  | "bible_harp"
  | "store"
  | "chat"
  | "library"
  | "admin";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenPulpitMode: () => void;
  savedCount: number;
  userRole: UserRole;
  isProSubscriber: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPulpitMode,
  savedCount,
  userRole,
  isProSubscriber,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-amber-900/40 text-slate-100 shadow-xl backdrop-blur-md">
      {/* Top Ministerial Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-md ring-1 ring-amber-400/30 group-hover:scale-105 transition-transform">
              <img src="/brand/verbo-norte-logo.jpg" alt="Verbo Norte" className="w-full h-full rounded-xl object-cover" />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"
                title="Sessão autenticada"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent font-serif">
                  Verbo Norte
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Estudos teológicos e preparo ministerial
              </p>
            </div>
          </div>

          {/* Quick Presets, Role Switcher & Pulpit Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pulpit / Preaching Mode Button */}
            <button
              onClick={onOpenPulpitMode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
              title="Modo Púlpito: visualização limpa e ampliada para ministração e projeção"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Modo Púlpito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2">
          {/* Tab 0: Dashboard */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "dashboard"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Início (Painel)</span>
          </button>

          {/* Tab 1: Pregações */}
          <button
            onClick={() => setActiveTab("sermons")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "sermons"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Esboço de Pregação</span>
          </button>

          {/* Tab 2: EBD */}
          <button
            onClick={() => setActiveTab("ebd")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "ebd"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Apoio à EBD</span>
          </button>

          {/* Tab 3: Verse X-Ray */}
          <button
            onClick={() => setActiveTab("xray")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "xray"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Microscope className="w-4 h-4" />
            <span>Raio-X do Versículo</span>
          </button>

          {/* Tab 4: Bible & Harp */}
          <button
            onClick={() => setActiveTab("bible_harp")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "bible_harp"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bíblia & Harpa Cristã</span>
          </button>

          {/* Tab 5: Store (materiais digitais) */}
          <button
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "store"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Loja de materiais</span>
          </button>

          {/* Tab 6: Freeform Chat */}
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "chat"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Consultor Teológico</span>
          </button>

          {/* Tab 7: Library */}
          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "library"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Caderno</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* Tab 8: Admin Panel (Highlighted if Admin) */}
          {userRole === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "admin"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "text-indigo-300 hover:text-white hover:bg-indigo-900/40 border border-indigo-500/30"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Painel Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
