/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SermonOutline,
  EbdLesson,
  VerseXray,
  INITIAL_SERMON,
  INITIAL_EBD_LESSON,
  INITIAL_VERSE_XRAY,
} from './utils/theology';
import {
  DigitalProduct,
  DigitalOrder,
  UserRole,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from './utils/ecosystem';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DashboardModals } from './components/DashboardModals';
import { SermonView } from './components/SermonView';
import { EbdView } from './components/EbdView';
import { VerseXrayView } from './components/VerseXrayView';
import { BibleAndHarpView } from './components/BibleAndHarpView';
import { StoreView } from './components/StoreView';
import { AdminPanelView } from './components/AdminPanelView';
import { TheologicalChatView } from './components/TheologicalChatView';
import { SavedLibraryView, SavedItem } from './components/SavedLibraryView';
import { PulpitModeModal } from './components/PulpitModeModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { CheckCircle, ShieldCheck, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [isProSubscriber, setIsProSubscriber] = useState(true);

  // Theological modules state
  const [currentSermon, setCurrentSermon] = useState<SermonOutline>(INITIAL_SERMON);
  const [currentLesson, setCurrentLesson] = useState<EbdLesson>(INITIAL_EBD_LESSON);
  const [currentXray, setCurrentXray] = useState<VerseXray>(INITIAL_VERSE_XRAY);
  const [isPulpitOpen, setIsPulpitOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dashboard modal state
  const [activeDashboardModal, setActiveDashboardModal] = useState<
    'themes' | 'dictionary' | 'concordance' | 'community' | 'notes' | null
  >(null);

  // E-commerce & PDF Store state
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    try {
      const stored = localStorage.getItem('iatheos_products');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<DigitalOrder[]>(() => {
    try {
      const stored = localStorage.getItem('iatheos_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  const [ownedProductIds, setOwnedProductIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('iatheos_owned_products');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ['prod-manual-homiletica'];
  });

  const [readingProduct, setReadingProduct] = useState<DigitalProduct | null>(null);

  // Ministerial Saved Library state
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('iatheos_saved_library');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: INITIAL_SERMON.id,
        type: 'sermon',
        title: INITIAL_SERMON.title,
        reference: INITIAL_SERMON.biblicalText,
        savedAt: INITIAL_SERMON.createdAt,
        data: INITIAL_SERMON,
      },
      {
        id: INITIAL_VERSE_XRAY.id,
        type: 'xray',
        title: `Raio-X: ${INITIAL_VERSE_XRAY.verseReference}`,
        reference: INITIAL_VERSE_XRAY.verseReference,
        savedAt: INITIAL_VERSE_XRAY.createdAt,
        data: INITIAL_VERSE_XRAY,
      },
      {
        id: INITIAL_EBD_LESSON.id,
        type: 'ebd',
        title: INITIAL_EBD_LESSON.title,
        reference: INITIAL_EBD_LESSON.biblicalText,
        savedAt: INITIAL_EBD_LESSON.createdAt,
        data: INITIAL_EBD_LESSON,
      },
    ];
  });

  // LocalStorage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('iatheos_saved_library', JSON.stringify(savedItems));
    } catch (e) {
      console.error(e);
    }
  }, [savedItems]);

  useEffect(() => {
    try {
      localStorage.setItem('iatheos_products', JSON.stringify(products));
      localStorage.setItem('iatheos_orders', JSON.stringify(orders));
      localStorage.setItem('iatheos_owned_products', JSON.stringify(ownedProductIds));
    } catch (e) {
      console.error(e);
    }
  }, [products, orders, ownedProductIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleUserRole = () => {
    const nextRole: UserRole = userRole === 'buyer' ? 'admin' : 'buyer';
    setUserRole(nextRole);
    if (nextRole === 'admin') {
      setActiveTab('admin');
      showToast('Perfil alterado para: Administrador do Ecossistema');
    } else {
      setActiveTab('dashboard');
      showToast('Perfil alterado para: Comprador / Assinante');
    }
  };

  // E-Commerce handlers
  const handlePurchaseProduct = (
    productId: string,
    method: 'PIX' | 'Cartão de Crédito' | 'Assinatura Pro'
  ) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    if (!ownedProductIds.includes(productId)) {
      setOwnedProductIds([...ownedProductIds, productId]);
    }

    const newOrder: DigitalOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      productId,
      productTitle: targetProduct.title,
      customerName: 'marianabsilva1987@gmail.com',
      customerEmail: 'marianabsilva1987@gmail.com',
      pricePaid: method === 'Assinatura Pro' ? 0 : targetProduct.price,
      paymentMethod: method,
      status: 'Concluído',
      purchasedAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    showToast(`Material "${targetProduct.title}" liberado em sua biblioteca!`);
  };

  const handleAddProduct = (newProdData: Omit<DigitalProduct, 'id' | 'downloadsCount' | 'rating'>) => {
    const newProduct: DigitalProduct = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      downloadsCount: 0,
      rating: 5.0,
    };
    setProducts([newProduct, ...products]);
    showToast(`Material "${newProduct.title}" cadastrado com sucesso no catálogo!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    showToast('Material removido do catálogo digital.');
  };

  // Sermons & Studies Save Handlers
  const isSermonSaved = savedItems.some((item) => item.id === currentSermon.id);
  const isLessonSaved = savedItems.some((item) => item.id === currentLesson.id);
  const isXraySaved = savedItems.some((item) => item.id === currentXray.id);

  const handleSaveSermon = (sermon: SermonOutline) => {
    if (isSermonSaved) {
      setSavedItems(savedItems.filter((item) => item.id !== sermon.id));
      showToast('Esboço removido do caderno.');
    } else {
      const newItem: SavedItem = {
        id: sermon.id,
        type: 'sermon',
        title: sermon.title,
        reference: sermon.biblicalText,
        savedAt: new Date().toISOString(),
        data: sermon,
      };
      setSavedItems([newItem, ...savedItems]);
      showToast('Esboço de sermão salvo com sucesso no Caderno Ministerial!');
    }
  };

  const handleSaveLesson = (lesson: EbdLesson) => {
    if (isLessonSaved) {
      setSavedItems(savedItems.filter((item) => item.id !== lesson.id));
      showToast('Aula de EBD removida do caderno.');
    } else {
      const newItem: SavedItem = {
        id: lesson.id,
        type: 'ebd',
        title: lesson.title,
        reference: lesson.biblicalText,
        savedAt: new Date().toISOString(),
        data: lesson,
      };
      setSavedItems([newItem, ...savedItems]);
      showToast('Plano de aula salvo com sucesso no Caderno Ministerial!');
    }
  };

  const handleSaveXray = (xray: VerseXray) => {
    if (isXraySaved) {
      setSavedItems(savedItems.filter((item) => item.id !== xray.id));
      showToast('Análise de versículo removida do caderno.');
    } else {
      const newItem: SavedItem = {
        id: xray.id,
        type: 'xray',
        title: `Raio-X: ${xray.verseReference}`,
        reference: xray.verseReference,
        savedAt: new Date().toISOString(),
        data: xray,
      };
      setSavedItems([newItem, ...savedItems]);
      showToast('Raio-X do versículo salvo no Caderno Ministerial!');
    }
  };

  const handleDeleteSavedItem = (id: string) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
    showToast('Item excluído do acervo ministerial.');
  };

  const handleSelectSavedItem = (item: SavedItem) => {
    if (item.type === 'sermon') {
      setCurrentSermon(item.data as SermonOutline);
      setActiveTab('sermons');
    } else if (item.type === 'ebd') {
      setCurrentLesson(item.data as EbdLesson);
      setActiveTab('ebd');
    } else if (item.type === 'xray') {
      setCurrentXray(item.data as VerseXray);
      setActiveTab('xray');
    }
    showToast(`Carregado: ${item.title}`);
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `iatheos_caderno_ministerial_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Acervo ministerial exportado em formato JSON.');
  };

  const handleQuickLoad = (type: 'sermon' | 'xray' | 'ebd') => {
    if (type === 'sermon') {
      setCurrentSermon(INITIAL_SERMON);
      setActiveTab('sermons');
      showToast('Carregado: Sermão Romanos 5:3-5');
    } else if (type === 'xray') {
      setCurrentXray(INITIAL_VERSE_XRAY);
      setActiveTab('xray');
      showToast('Carregado: Raio-X João 3:16');
    } else if (type === 'ebd') {
      setCurrentLesson(INITIAL_EBD_LESSON);
      setActiveTab('ebd');
      showToast('Carregado: Aula EBD Atos 12:1-17');
    }
  };

  const handleSendToVerseXray = (verseRef: string) => {
    handleGenerateXray({ verseReference: verseRef, translation: 'Almeida Revista e Atualizada (ARA)' });
    setActiveTab('xray');
  };

  // API Call: Generate Sermon
  const handleGenerateSermon = async (params: {
    biblicalText: string;
    theme: string;
    sermonType: 'Expositivo' | 'Temático' | 'Textual';
    targetAudience: string;
    specificFocus: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/theology/sermon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Falha na comunicação com o servidor de homilética');
      const data: SermonOutline = await response.json();
      setCurrentSermon(data);
      showToast('Novo esboço de sermão estruturado com sucesso!');
    } catch (err: any) {
      console.error(err);
      showToast(`Erro ao gerar sermão: ${err.message || 'Tente novamente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Generate EBD Lesson
  const handleGenerateLesson = async (params: {
    biblicalText: string;
    theme: string;
    targetAudience: 'Adultos' | 'Jovens' | 'Adolescentes' | 'Crianças' | 'Novos Convertidos' | 'Liderança';
    lessonDuration: string;
    emphasis: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/theology/ebd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Falha na comunicação com o servidor de didática');
      const data: EbdLesson = await response.json();
      setCurrentLesson(data);
      showToast('Novo plano para EBD gerado com sucesso!');
    } catch (err: any) {
      console.error(err);
      showToast(`Erro ao gerar aula para EBD: ${err.message || 'Tente novamente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Generate Verse X-Ray
  const handleGenerateXray = async (params: { verseReference: string; translation: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/theology/verse-xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Falha na comunicação com o servidor de exegese');
      const data: VerseXray = await response.json();
      setCurrentXray(data);
      showToast('Raio-X do versículo realizado com sucesso!');
    } catch (err: any) {
      console.error(err);
      showToast(`Erro ao analisar versículo: ${err.message || 'Tente novamente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Freeform Theological Chat
  const handleSendMessage = async (msg: string, history: any[]) => {
    const response = await fetch('/api/theology/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history }),
    });
    if (!response.ok) throw new Error('Erro na resposta do consultor teológico');
    const data = await response.json();
    return data.reply;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-amber-500/40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pulpit Mode Fullscreen Modal */}
      {isPulpitOpen && (
        <PulpitModeModal
          sermon={currentSermon}
          onClose={() => setIsPulpitOpen(false)}
        />
      )}

      {/* PDF Reader Modal */}
      {readingProduct && (
        <PdfReaderModal
          product={readingProduct}
          onClose={() => setReadingProduct(null)}
        />
      )}

      {/* Dashboard Modals (Themes, Dictionary, Concordance, Community, Notes) */}
      <DashboardModals
        modalType={activeDashboardModal}
        onClose={() => setActiveDashboardModal(null)}
        onNavigateToSermon={(text, theme) => {
          handleGenerateSermon({
            biblicalText: text,
            theme,
            sermonType: 'Expositivo',
            targetAudience: 'Culto Geral',
            specificFocus: '',
          });
          setActiveTab('sermons');
        }}
        onNavigateToXray={(verse) => {
          handleSendToVerseXray(verse);
        }}
      />

      {/* Main Navbar with Role Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPulpitMode={() => setIsPulpitOpen(true)}
        onQuickLoad={handleQuickLoad}
        savedCount={savedItems.length}
        userRole={userRole}
        onToggleUserRole={handleToggleUserRole}
        isProSubscriber={isProSubscriber}
      />

      {/* Role Notice Indicator Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {userRole === 'admin' ? (
              <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Modo Administrador: Você tem controle sobre o catálogo de PDFs, relatórios financeiros e vendas.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <User className="w-3.5 h-3.5" /> Modo Comprador / Assinante Pro: Acesso a ferramentas de IA, leitura da Bíblia, Harpa e compras digitais.
              </span>
            )}
          </div>
          <button
            onClick={handleToggleUserRole}
            className="text-[11px] underline hover:text-white transition-colors"
          >
            {userRole === 'admin' ? 'Alternar para Visão de Usuário' : 'Alternar para Painel Admin'}
          </button>
        </div>
      </div>

      {/* Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenModal={(type) => setActiveDashboardModal(type)}
            onNavigateToSermon={(text, theme) => {
              handleGenerateSermon({
                biblicalText: text,
                theme,
                sermonType: 'Expositivo',
                targetAudience: 'Culto Geral',
                specificFocus: '',
              });
              setActiveTab('sermons');
            }}
            onNavigateToXray={(verse) => {
              handleSendToVerseXray(verse);
            }}
            onOpenPulpitMode={() => setIsPulpitOpen(true)}
            isProSubscriber={isProSubscriber}
            savedCount={savedItems.length}
          />
        )}

        {activeTab === 'sermons' && (
          <SermonView
            currentSermon={currentSermon}
            onSaveSermon={handleSaveSermon}
            isSaved={isSermonSaved}
            onOpenPulpitMode={() => setIsPulpitOpen(true)}
            onGenerateSermon={handleGenerateSermon}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'ebd' && (
          <EbdView
            currentLesson={currentLesson}
            onSaveLesson={handleSaveLesson}
            isSaved={isLessonSaved}
            onGenerateLesson={handleGenerateLesson}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'xray' && (
          <VerseXrayView
            currentXray={currentXray}
            onSaveXray={handleSaveXray}
            isSaved={isXraySaved}
            onGenerateXray={handleGenerateXray}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'bible_harp' && (
          <BibleAndHarpView onSendToVerseXray={handleSendToVerseXray} />
        )}

        {activeTab === 'store' && (
          <StoreView
            products={products}
            ownedProductIds={ownedProductIds}
            isProSubscriber={isProSubscriber}
            onPurchaseProduct={handlePurchaseProduct}
            onOpenPdfReader={(prod) => setReadingProduct(prod)}
          />
        )}

        {activeTab === 'chat' && (
          <TheologicalChatView
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'library' && (
          <SavedLibraryView
            savedItems={savedItems}
            onSelectItem={handleSelectSavedItem}
            onDeleteItem={handleDeleteSavedItem}
            onExportAll={handleExportAll}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>

      {/* Ministerial Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center text-white font-serif font-bold text-xs">
              Ω
            </div>
            <span className="font-serif font-semibold text-slate-300">
              IATheos Pro • Ecossistema SaaS Teológico, Homilética & E-Commerce Cristão
            </span>
          </div>

          <div className="text-center sm:text-right font-serif italic text-slate-400">
            "Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade." — 2 Timóteo 2:15
          </div>
        </div>
      </footer>
    </div>
  );
}
