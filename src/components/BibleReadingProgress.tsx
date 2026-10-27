/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BIBLE_BOOKS,
  BibleBookInfo,
  calculateBibleYearProgress,
  toggleChapterCompletion,
  setBookAllChapters,
  formatChapterKey,
  loadCompletedChapters,
  saveCompletedChapters,
  TOTAL_BIBLE_CHAPTERS,
} from '../utils/bibleProgress';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  Search,
  Check,
  RotateCcw,
  ExternalLink,
  Flame,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { TabType } from './Navbar';

interface BibleReadingProgressProps {
  onNavigateToBible?: (bookName: string, chapter: number) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const BibleReadingProgress: React.FC<BibleReadingProgressProps> = ({
  onNavigateToBible,
  onNavigateTab,
}) => {
  // Completed chapters stored as array of strings "bookId:chapter"
  const [completedChapters, setCompletedChapters] = useState<string[]>(() =>
    loadCompletedChapters()
  );

  // Active view tab: 'today' (quick daily goals) vs 'explorer' (all 66 books)
  const [activeTab, setActiveTab] = useState<'today' | 'explorer'>('today');

  // Book explorer state
  const [selectedBookId, setSelectedBookId] = useState<string>('rm'); // Default: Romanos
  const [bookFilter, setBookFilter] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    saveCompletedChapters(completedChapters);
  }, [completedChapters]);

  const stats = calculateBibleYearProgress(completedChapters);
  const completedSet = new Set(completedChapters);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  const handleToggle = (bookId: string, chapter: number, bookName?: string) => {
    const key = formatChapterKey(bookId, chapter);
    const isNowCompleted = !completedSet.has(key);
    const updated = toggleChapterCompletion(completedChapters, bookId, chapter);
    setCompletedChapters(updated);

    const name = bookName || BIBLE_BOOKS.find((b) => b.id === bookId)?.name || 'Capítulo';
    showToast(
      isNowCompleted
        ? `✅ ${name} ${chapter} marcado como concluído!`
        : `↩️ ${name} ${chapter} desmarcado.`
    );
  };

  const handleSetBookAll = (book: BibleBookInfo, complete: boolean) => {
    const updated = setBookAllChapters(completedChapters, book.id, complete);
    setCompletedChapters(updated);
    showToast(
      complete
        ? `🎉 Todos os ${book.chaptersCount} capítulos de ${book.name} foram marcados!`
        : `Todos os capítulos de ${book.name} foram desmarcados.`
    );
  };

  // Today's suggested readings from annual plan (Day 42/365)
  const todayReadings = [
    { bookId: 'rm', chapter: 5, label: 'Romanos 5' },
    { bookId: 'gl', chapter: 5, label: 'Gálatas 5' },
    { bookId: 'sl', chapter: 34, label: 'Salmos 34' },
    { bookId: 'pv', chapter: 3, label: 'Provérbios 3' },
  ];

  const handleCompleteAllToday = () => {
    let nextList = [...completedChapters];
    for (const r of todayReadings) {
      const key = formatChapterKey(r.bookId, r.chapter);
      if (!nextList.includes(key)) {
        nextList.push(key);
      }
    }
    setCompletedChapters(nextList);
    showToast('🙌 Glória a Deus! Todos os 4 capítulos de hoje foram concluídos!');
  };

  // Filtered books for the book explorer
  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    if (bookFilter === 'AT' && b.testament !== 'AT') return false;
    if (bookFilter === 'NT' && b.testament !== 'NT') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedBook =
    BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[0];

  // Selected book completed stats
  let selectedBookCompletedCount = 0;
  for (let c = 1; c <= selectedBook.chaptersCount; c++) {
    if (completedSet.has(formatChapterKey(selectedBook.id, c))) {
      selectedBookCompletedCount++;
    }
  }
  const selectedBookPercentage = Math.round(
    (selectedBookCompletedCount / selectedBook.chaptersCount) * 100
  );

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Subtle gold accent light in top right */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Floating toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Progresso de Leitura Bíblica no Ano
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Plano 365 Dias
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Acompanhamento interativo dos 1.189 capítulos das Sagradas Escrituras (39 livros AT • 27 livros NT)
            </p>
          </div>
        </div>

        {/* Top percentage pill & streak */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Bíblia Concluída
            </span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700">
                {stats.overallPercentage}%
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-500/40 flex flex-col items-center justify-center text-amber-800 font-mono font-bold shadow-xs">
            <span className="text-[10px] uppercase font-sans text-amber-600 font-semibold">Total</span>
            <span className="text-base font-extrabold leading-none">{stats.totalCompleted}</span>
            <span className="text-[9px] text-slate-400 leading-none mt-0.5">/ 1189</span>
          </div>
        </div>
      </div>

      {/* 2. GRAND VISUAL PROGRESS BAR & MILESTONES */}
      <div className="space-y-3 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Meta Geral do Ano:
            </span>
            <span className="font-mono font-bold text-amber-800 text-sm">
              {stats.totalCompleted} de {TOTAL_BIBLE_CHAPTERS} capítulos lidos
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Restam <strong>{stats.remainingChapters}</strong> caps</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              ~{stats.estimatedDaysToFinish} dias em ritmo regular (3.2 caps/dia)
            </span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="relative w-full h-5 bg-slate-200 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-300">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${Math.min(100, Math.max(1, stats.overallPercentage))}%` }}
          />
        </div>

        {/* Milestones markers: 25%, 50%, 75%, 100% */}
        <div className="grid grid-cols-4 text-[11px] text-slate-400 font-medium pt-0.5">
          <div className="text-left">
            <span className="text-slate-600 font-semibold">25%</span> (297 caps)
          </div>
          <div className="text-center">
            <span className="text-slate-600 font-semibold">50% Metade</span> (595 caps)
          </div>
          <div className="text-center">
            <span className="text-slate-600 font-semibold">75%</span> (892 caps)
          </div>
          <div className="text-right">
            <span className="text-slate-600 font-semibold">100% Bíblia Toda</span> (1189)
          </div>
        </div>

        {/* Testaments breakdown cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Antigo Testamento */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-serif">
                📜 Antigo Testamento (39 Livros)
              </span>
              <span className="font-mono font-bold text-amber-700">
                {stats.otCompleted} / {stats.otTotal} caps ({stats.otPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.otPercentage}%` }}
              />
            </div>
          </div>

          {/* Novo Testamento */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-serif">
                ✝️ Novo Testamento (27 Livros)
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {stats.ntCompleted} / {stats.ntTotal} caps ({stats.ntPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.ntPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SECTION TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Capítulos de Hoje (Plano Diário)</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'explorer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Explorador dos 66 Livros</span>
            </button>
          </div>

          {activeTab === 'today' && (
            <button
              onClick={handleCompleteAllToday}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Concluir Todos os de Hoje</span>
            </button>
          )}
        </div>

        {/* TAB 1: TODAY'S READINGS CHECKLIST */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {todayReadings.map((r) => {
                const isCompleted = completedSet.has(formatChapterKey(r.bookId, r.chapter));
                return (
                  <div
                    key={`${r.bookId}-${r.chapter}`}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isCompleted
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Leitura Diária
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            Lido
                          </span>
                        )}
                      </div>
                      <span className="font-bold font-serif text-base block text-slate-900">
                        {r.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(r.bookId, r.chapter, r.label)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-white border border-slate-300 text-slate-400 hover:text-emerald-600 hover:border-emerald-400'
                        }`}
                        title={isCompleted ? 'Desmarcar' : 'Marcar como concluído'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {onNavigateToBible && (
                        <button
                          onClick={() => {
                            const book = BIBLE_BOOKS.find((b) => b.id === r.bookId);
                            onNavigateToBible(book ? book.name : 'Romanos', r.chapter);
                          }}
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-600 hover:text-amber-700 flex items-center justify-center transition-colors"
                          title="Ler na Bíblia Online"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-slate-700 font-sans">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Dica de Disciplina Espiritual:</strong> Ao marcar seus capítulos aqui, seu progresso é sincronizado instantaneamente na barra de progresso da Bíblia inteira. Para marcar capítulos passados ou de outros livros, utilize a aba <strong>Explorador dos 66 Livros</strong> ao lado.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLORER OF ALL 66 BOOKS */}
        {activeTab === 'explorer' && (
          <div className="space-y-5">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {/* Testament Filters */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filtrar:
                </span>
                <button
                  onClick={() => setBookFilter('ALL')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    bookFilter === 'ALL'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Todos (66)
                </button>
                <button
                  onClick={() => setBookFilter('AT')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    bookFilter === 'AT'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Antigo Testamento (39)
                </button>
                <button
                  onClick={() => setBookFilter('NT')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    bookFilter === 'NT'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Novo Testamento (27)
                </button>
              </div>

              {/* Search Book Input */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar livro (ex: Romanos, Gênesis)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Horizontal Book Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {filteredBooks.map((b) => {
                let bookDone = 0;
                for (let c = 1; c <= b.chaptersCount; c++) {
                  if (completedSet.has(formatChapterKey(b.id, c))) {
                    bookDone++;
                  }
                }
                const isCurrent = b.id === selectedBook.id;
                const isFullyRead = bookDone === b.chaptersCount;

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBookId(b.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-md border border-slate-900'
                        : isFullyRead
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isFullyRead ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span>{b.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isCurrent
                          ? 'bg-slate-800 text-amber-300'
                          : isFullyRead
                          ? 'bg-emerald-200/60 text-emerald-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {bookDone}/{b.chaptersCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Book Interactive Chapter Grid */}
            <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-serif text-slate-900">
                      {selectedBook.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      {selectedBook.category} • {selectedBook.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedBookCompletedCount} de {selectedBook.chaptersCount} capítulos lidos ({selectedBookPercentage}%)
                  </p>
                </div>

                {/* Bulk Actions for this Book */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleSetBookAll(selectedBook, true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Marcar Livro Inteiro</span>
                  </button>

                  <button
                    onClick={() => handleSetBookAll(selectedBook, false)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>Desmarcar Livro</span>
                  </button>

                  {onNavigateToBible && (
                    <button
                      onClick={() => onNavigateToBible(selectedBook.name, 1)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>Abrir na Bíblia</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Chapter Number Buttons */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Clique no número do capítulo para marcar ou desmarcar:
                </span>

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((chapNum) => {
                    const isDone = completedSet.has(formatChapterKey(selectedBook.id, chapNum));
                    return (
                      <button
                        key={chapNum}
                        onClick={() => handleToggle(selectedBook.id, chapNum, selectedBook.name)}
                        className={`h-11 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 scale-100'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50'
                        }`}
                        title={`${selectedBook.name} ${chapNum} - ${isDone ? 'Concluído (clique para desmarcar)' : 'Pendente (clique para marcar)'}`}
                      >
                        <span className="text-xs leading-none">{chapNum}</span>
                        {isDone ? (
                          <Check className="w-3 h-3 text-emerald-200 mt-0.5" />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-sans leading-none mt-0.5">Cap</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER WITH QUICK LINK TO FULL BIBLE READER */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Suporte a múltiplas versões: ARC, NAA, NVI e King James Fiel (KJF).</span>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('bible_harp')}
            className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Ir para Leitor Completo da Bíblia & Harpa Cristã</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
