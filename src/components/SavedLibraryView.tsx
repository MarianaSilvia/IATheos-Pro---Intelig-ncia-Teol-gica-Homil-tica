/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SermonOutline, EbdLesson, VerseXray } from '../utils/theology';
import {
  Bookmark,
  Scroll,
  GraduationCap,
  Microscope,
  Trash2,
  ExternalLink,
  Search,
  Download,
  BookOpen,
} from 'lucide-react';

export interface SavedItem {
  id: string;
  type: 'sermon' | 'ebd' | 'xray';
  title: string;
  reference: string;
  savedAt: string;
  data: SermonOutline | EbdLesson | VerseXray;
}

interface SavedLibraryViewProps {
  savedItems: SavedItem[];
  onSelectItem: (item: SavedItem) => void;
  onDeleteItem: (id: string) => void;
  onExportAll: () => void;
}

export const SavedLibraryView: React.FC<SavedLibraryViewProps> = ({
  savedItems,
  onSelectItem,
  onDeleteItem,
  onExportAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'sermon' | 'ebd' | 'xray'>('all');
  const [search, setSearch] = useState('');

  const filteredItems = savedItems.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.reference.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-700">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-slate-900">
              Caderno Ministerial & Estudos Salvos
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Seu acervo pessoal de sermões, lições para EBD e exegeses bíblicas prontas para ministração.
            </p>
          </div>
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={onExportAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-200 text-xs font-semibold transition-colors self-start sm:self-auto shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Acervo (JSON)</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, texto bíblico ou palavra-chave..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todos ({savedItems.length})
          </button>
          <button
            onClick={() => setFilter('sermon')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'sermon'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" /> Sermões
          </button>
          <button
            onClick={() => setFilter('ebd')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'ebd'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> EBD
          </button>
          <button
            onClick={() => setFilter('xray')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'xray'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" /> Raio-X
          </button>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            Nenhum estudo salvo nesta categoria
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Ao gerar novos sermões, lições para EBD ou análises de versículos, clique no botão "Salvar" para armazená-los em seu caderno.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.type === 'sermon'
                        ? 'bg-amber-100 text-amber-800'
                        : item.type === 'ebd'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {item.type === 'sermon' && <Scroll className="w-3 h-3" />}
                    {item.type === 'ebd' && <GraduationCap className="w-3 h-3" />}
                    {item.type === 'xray' && <Microscope className="w-3 h-3" />}
                    {item.type === 'sermon' ? 'Sermão' : item.type === 'ebd' ? 'Aula EBD' : 'Raio-X'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.savedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-amber-800 font-semibold font-serif">
                  {item.reference}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectItem(item)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Estudo</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir estudo do caderno"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
