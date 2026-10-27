/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BIBLE_BOOKS,
  SAMPLE_BIBLE_CHAPTERS,
  INITIAL_HYMNS,
  Hymn,
  searchHymns,
} from '../utils/ecosystem';
import {
  BookOpen,
  Music,
  Search,
  Volume2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Microscope,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BibleAndHarpViewProps {
  onSendToVerseXray: (verseRef: string) => void;
}

export const BibleAndHarpView: React.FC<BibleAndHarpViewProps> = ({ onSendToVerseXray }) => {
  const [subTab, setSubTab] = useState<'bible' | 'harp'>('bible');

  // Bible state
  const [selectedBook, setSelectedBook] = useState('Romanos');
  const [selectedChapter, setSelectedChapter] = useState(5);
  const [selectedTranslation, setSelectedTranslation] = useState<'ARC' | 'NAA' | 'NVI' | 'KJF'>('NAA');
  const [fontSize, setFontSize] = useState(16);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Harpa state
  const [harpSearch, setHarpSearch] = useState('');
  const [selectedHymn, setSelectedHymn] = useState<Hymn>(INITIAL_HYMNS[0]);
  const [copiedHymn, setCopiedHymn] = useState(false);

  // Get current bible chapter data
  const bookKey = selectedBook === 'Romanos' ? 'ROM-5' : selectedBook === 'João' ? 'JHN-3' : 'ROM-5';
  const chapterData =
    SAMPLE_BIBLE_CHAPTERS[bookKey]?.[selectedTranslation as any] ||
    SAMPLE_BIBLE_CHAPTERS['ROM-5']['NAA'];

  const filteredHymns = searchHymns(INITIAL_HYMNS, harpSearch);

  const handleCopyVerse = (num: number, text: string) => {
    navigator.clipboard.writeText(`"${text}" (${selectedBook} ${selectedChapter}:${num} - ${selectedTranslation})`);
    setCopiedVerse(num);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleCopyHymn = () => {
    const fullText = `HARPA CRISTÃ - HINO ${selectedHymn.number}: ${selectedHymn.title}\n\nREFRÃO:\n${selectedHymn.chorus}\n\nESTROFES:\n${selectedHymn.stanzas.join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedHymn(true);
    setTimeout(() => setCopiedHymn(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Selector Subtabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('bible')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'bible'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Leitor das Sagradas Escrituras</span>
          </button>

          <button
            onClick={() => setSubTab('harp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'harp'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Harpa Cristã (Hinos Tradicionais)</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden md:block px-3">
          {subTab === 'bible' ? 'Múltiplas Traduções & Exegese' : 'Hinário Completo para Cultos'}
        </span>
      </div>

      {/* SUBTAB 1: BIBLE READER */}
      {subTab === 'bible' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Livro
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Romanos">Romanos (Epístola)</option>
                  <option value="João">João (Evangelho)</option>
                  <option value="Salmos">Salmos (Cânticos)</option>
                  <option value="Efésios">Efésios (Epístola)</option>
                  <option value="Atos">Atos dos Apóstolos</option>
                  <option value="Gênesis">Gênesis (Pentateuco)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Capítulo
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((c) => (
                    <option key={c} value={c}>
                      Capítulo {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tradução Bíblica
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
                  {(['ARC', 'NAA', 'NVI', 'KJF'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTranslation(t)}
                      className={`px-2.5 py-1 text-xs font-bold transition-colors rounded-lg ${
                        selectedTranslation === t
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Fonte:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFontSize(Math.max(13, fontSize - 1))}
                  className="px-2 py-0.5 text-xs text-slate-700 hover:bg-white rounded transition-colors font-bold"
                >
                  A-
                </button>
                <span className="text-xs font-mono text-slate-500 px-1">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="px-2 py-0.5 text-xs text-slate-700 hover:bg-white rounded transition-colors font-bold"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Scripture Viewer */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                  {selectedBook} {selectedChapter}
                </h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mt-1 inline-block">
                  Tradução Selecionada: {selectedTranslation}
                </span>
              </div>
            </div>

            {/* Verse-by-verse list */}
            <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
              {chapterData.verses.map((v) => (
                <div
                  key={v.number}
                  className="p-3.5 rounded-xl hover:bg-slate-50/80 transition-colors flex items-start gap-3 group border border-transparent hover:border-slate-200"
                >
                  <span className="font-mono font-bold text-amber-600 text-xs sm:text-sm pt-0.5 select-none w-6 flex-shrink-0 text-right">
                    {v.number}
                  </span>
                  <p className="flex-1 font-serif text-slate-800 leading-relaxed">
                    {v.text}
                  </p>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCopyVerse(v.number, v.text)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                      title="Copiar versículo com referência"
                    >
                      {copiedVerse === v.number ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onSendToVerseXray(`${selectedBook} ${selectedChapter}:${v.number}`)}
                      className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1"
                      title="Abrir este versículo no Raio-X dos Originais"
                    >
                      <Microscope className="w-3 h-3 text-amber-600" />
                      <span>Raio-X</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: HARPA CRISTÃ */}
      {subTab === 'harp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hymn List Sidebar */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="relative">
                <input
                  type="text"
                  value={harpSearch}
                  onChange={(e) => setHarpSearch(e.target.value)}
                  placeholder="Buscar hino por número (ex: 1, 15) ou título..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              {filteredHymns.map((h) => (
                <button
                  key={h.number}
                  onClick={() => setSelectedHymn(h)}
                  className={`w-full p-4 text-left transition-colors flex items-center justify-between gap-3 ${
                    selectedHymn.number === h.number
                      ? 'bg-amber-50/80 border-l-4 border-amber-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0">
                      #{h.number}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 font-serif line-clamp-1">
                        {h.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">{h.category}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Selected Hymn Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono font-extrabold text-sm shadow-sm">
                  Hino #{selectedHymn.number}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-slate-900">
                    {selectedHymn.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Autor: {selectedHymn.author || 'Tradicional'} • {selectedHymn.category}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyHymn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                title="Copiar letra para projeção ou boletim"
              >
                {copiedHymn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHymn ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {/* Historical Context Callout */}
            {selectedHymn.historicalContext && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Contexto Histórico:</strong> {selectedHymn.historicalContext}
                </p>
              </div>
            )}

            {/* Refrão / Coro */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border-l-4 border-amber-600 border-amber-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                [Coro / Refrão]:
              </span>
              <p className="font-serif italic text-base sm:text-lg text-amber-950 whitespace-pre-line leading-relaxed">
                {selectedHymn.chorus}
              </p>
            </div>

            {/* Stanzas */}
            <div className="space-y-6 pt-2">
              {selectedHymn.stanzas.map((stanza, idx) => (
                <div key={idx} className="space-y-1 pl-4 border-l-2 border-slate-200">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    Estrofe {idx + 1}
                  </span>
                  <p className="font-serif text-base text-slate-800 whitespace-pre-line leading-relaxed">
                    {stanza}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
