/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BiblicalTheme,
  DictionaryEntry,
  ConcordanceResult,
  CommunityPost,
  PersonalNote,
  searchBiblicalThemes,
  searchDictionary,
  INITIAL_BIBLICAL_THEMES,
  INITIAL_DICTIONARY_ENTRIES,
  INITIAL_CONCORDANCE_ENTRIES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_USER_NOTES,
} from '../utils/dashboard';
import {
  X,
  Search,
  BookOpen,
  Heart,
  MessageSquare,
  Sparkles,
  Bookmark,
  Share2,
  Plus,
  Send,
  ThumbsUp,
  Tag,
  Microscope,
  Scroll,
  ArrowRight,
  Shield,
  Home,
  Coins,
  Flame,
  HeartHandshake,
} from 'lucide-react';

interface DashboardModalsProps {
  modalType: 'themes' | 'dictionary' | 'concordance' | 'community' | 'notes' | null;
  onClose: () => void;
  onNavigateToSermon: (text: string, theme: string) => void;
  onNavigateToXray: (verse: string) => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  modalType,
  onClose,
  onNavigateToSermon,
  onNavigateToXray,
}) => {
  // Theme modal state
  const [themeSearch, setThemeSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<BiblicalTheme>(INITIAL_BIBLICAL_THEMES[0]);

  // Dictionary modal state
  const [dictSearch, setDictSearch] = useState('');
  const [selectedDictEntry, setSelectedDictEntry] = useState<DictionaryEntry>(INITIAL_DICTIONARY_ENTRIES[0]);

  // Concordance modal state
  const [concordanceSearch, setConcordanceSearch] = useState('graça');

  // Community state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [newPostVerse, setNewPostVerse] = useState('');

  // Personal Notes state
  const [notes, setNotes] = useState<PersonalNote[]>(INITIAL_USER_NOTES);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteRef, setNewNoteRef] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!modalType) return null;

  // Filtered data
  const filteredThemes = searchBiblicalThemes(INITIAL_BIBLICAL_THEMES, themeSearch);
  const filteredDict = searchDictionary(INITIAL_DICTIONARY_ENTRIES, dictSearch);

  const concordanceKey = concordanceSearch.trim().toLowerCase();
  const concordanceResult: ConcordanceResult =
    INITIAL_CONCORDANCE_ENTRIES[concordanceKey] || {
      word: concordanceSearch,
      totalOccurrences: 0,
      verses: [],
    };

  const handleLikePost = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    );
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: 'Mariana Silva',
      authorRole: 'Estudante da Bíblia',
      churchName: 'Comunidade IATheos',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      biblicalReference: newPostVerse.trim() || 'Romanos 5:1',
      topicTag: 'Reflexão Pessoal',
      content: newPostText.trim(),
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      postedAt: 'Agora mesmo',
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostVerse('');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const note: PersonalNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      biblicalReference: newNoteRef.trim() || 'Referência Geral',
      content: newNoteContent.trim(),
      highlightColor: 'amber',
      tags: ['Anotação', 'Devocional'],
      updatedAt: 'Agora mesmo',
    };

    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteRef('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              {modalType === 'themes' && <Tag className="w-4 h-4" />}
              {modalType === 'dictionary' && <BookOpen className="w-4 h-4" />}
              {modalType === 'concordance' && <Search className="w-4 h-4" />}
              {modalType === 'community' && <MessageSquare className="w-4 h-4" />}
              {modalType === 'notes' && <Bookmark className="w-4 h-4" />}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-slate-100">
                {modalType === 'themes' && 'Temas Bíblicos para o Cotidiano'}
                {modalType === 'dictionary' && 'Dicionário Teológico & Histórico'}
                {modalType === 'concordance' && 'Concordância Bíblica por Palavras'}
                {modalType === 'community' && 'Anotações Públicas • Comunidade IATheos'}
                {modalType === 'notes' && 'Minhas Anotações & Versículos Salvos'}
              </h2>
              <p className="text-xs text-slate-400">
                {modalType === 'themes' && 'Descubra passagens e orientações bíblicas categorizadas'}
                {modalType === 'dictionary' && 'Significados e origens de termos, personagens e locais bíblicos'}
                {modalType === 'concordance' && 'Localize onde cada termo ocorre no Antigo e Novo Testamento'}
                {modalType === 'community' && 'Compartilhe e comente insights teológicos da semana'}
                {modalType === 'notes' && 'Seu caderno pessoal vinculado às Escrituras'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ===================== 1. TEMAS BÍBLICOS ===================== */}
          {modalType === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left themes list */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    placeholder="Buscar tema (ansiedade, família, fé...)"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                        selectedTheme.id === t.id
                          ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                          {t.category}
                        </span>
                        <h4 className="font-bold text-sm font-serif">{t.name}</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right theme details */}
              <div className="md:col-span-7 space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                    {selectedTheme.category}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-slate-900 mt-1.5">
                    {selectedTheme.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {selectedTheme.description}
                  </p>
                </div>

                {/* Verses */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Versículos Fundamentais:
                  </span>
                  {selectedTheme.primaryVerses.map((v, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-amber-800">
                          {v.reference}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToXray(v.reference);
                          }}
                          className="text-[10px] font-bold text-indigo-700 hover:underline flex items-center gap-1"
                        >
                          <Microscope className="w-3 h-3" />
                          <span>Ver Raio-X</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-serif italic">
                        "{v.text}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSermon(selectedTheme.primaryVerses[0].reference, selectedTheme.name);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Scroll className="w-4 h-4" />
                    <span>Gerar Esboço de Sermão Sobre Este Tema</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== 2. DICIONÁRIO BÍBLICO ===================== */}
          {modalType === 'dictionary' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left search & list */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={dictSearch}
                    onChange={(e) => setDictSearch(e.target.value)}
                    placeholder="Buscar termo, local, personagem..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredDict.map((d) => (
                    <button
                      key={d.term}
                      onClick={() => setSelectedDictEntry(d)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                        selectedDictEntry.term === d.term
                          ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          {d.category}
                        </span>
                        <h4 className="font-bold text-sm font-serif">{d.term}</h4>
                        {d.originalTerm && (
                          <span className="text-[11px] text-amber-700 font-serif italic">
                            {d.originalTerm}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right definition display */}
              <div className="md:col-span-7 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                      {selectedDictEntry.category}
                    </span>
                    {selectedDictEntry.language && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {selectedDictEntry.language}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                    {selectedDictEntry.term}
                  </h3>
                  {selectedDictEntry.originalTerm && (
                    <p className="text-sm font-serif text-amber-900 font-semibold mt-0.5">
                      {selectedDictEntry.originalTerm}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Definição Teológica & Histórica:
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
                    {selectedDictEntry.definition}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Ocorrências & Referências Bíblicas:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDictEntry.scriptureReferences.map((ref, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-serif font-bold text-slate-700 shadow-xs"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== 3. CONCORDÂNCIA BÍBLICA ===================== */}
          {modalType === 'concordance' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={concordanceSearch}
                    onChange={(e) => setConcordanceSearch(e.target.value)}
                    placeholder="Digite uma palavra para ver concordância (ex: graça, esperança, paz)..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
                  <span className="font-semibold">Exemplos:</span>
                  {(['graça', 'esperança', 'shalom'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setConcordanceSearch(k)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-amber-50 font-medium"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {concordanceResult.totalOccurrences > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                    <span>
                      Termo: <strong className="text-slate-900 font-serif text-base">"{concordanceResult.word}"</strong>
                    </span>
                    <span className="font-bold text-amber-700">
                      {concordanceResult.totalOccurrences} ocorrências nas Escrituras
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {concordanceResult.verses.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-colors shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-amber-800">
                            {v.reference}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {v.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed">
                          "{v.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  Nenhum registro para "{concordanceSearch}". Experimente pesquisar por <strong>graça</strong>, <strong>esperança</strong> ou <strong>shalom</strong>.
                </div>
              )}
            </div>
          )}

          {/* ===================== 4. COMUNIDADE (ANOTAÇÕES PÚBLICAS) ===================== */}
          {modalType === 'community' && (
            <div className="space-y-5">
              {/* Publisher box */}
              <form onSubmit={handlePublishPost} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Compartilhar Reflexão com a Comunidade Ministerial:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newPostVerse}
                    onChange={(e) => setNewPostVerse(e.target.value)}
                    placeholder="Texto Bíblico de Referência (ex: Salmos 23:1)"
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-400 self-center hidden sm:block">
                    Tema da Semana: A Soberania em Tempos de Crise
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Escreva sua nota exegética, ilustração ou reflexão pastoral..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar no Feed</span>
                  </button>
                </div>
              </form>

              {/* Feed posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatarUrl}
                          alt={post.authorName}
                          className="w-9 h-9 rounded-full object-cover border border-amber-300"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {post.authorName}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            {post.authorRole} • {post.churchName || 'IATheos'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {post.biblicalReference}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {post.postedAt}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.isLiked ? 'text-amber-600 font-bold' : 'hover:text-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likesCount} Apoios</span>
                      </button>

                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.commentsCount} Comentários</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== 5. MINHAS ANOTAÇÕES & FAVORITOS ===================== */}
          {modalType === 'notes' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Seu Bloco de Notas Espiritual
                  </h3>
                  <p className="text-xs text-slate-500">
                    Anotações vinculadas aos textos bíblicos e sermões em preparo.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNote ? 'Cancelar' : 'Nova Anotação'}</span>
                </button>
              </div>

              {isAddingNote && (
                <form onSubmit={handleSaveNote} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Título da Anotação (ex: Oração no Getsêmani)"
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <input
                      type="text"
                      value={newNoteRef}
                      onChange={(e) => setNewNoteRef(e.target.value)}
                      placeholder="Referência Bíblica (ex: Lucas 22:39-46)"
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Escreva seus apontamentos..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                    >
                      Salvar Anotação
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {n.biblicalReference}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.updatedAt}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 font-serif">
                      {n.title}
                    </h4>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {n.content}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1">
                      {n.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
