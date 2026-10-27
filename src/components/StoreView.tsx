/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DigitalProduct, canUserDownload } from '../utils/ecosystem';
import {
  ShoppingBag,
  Download,
  BookOpen,
  FileText,
  Star,
  Check,
  Search,
  Filter,
  CreditCard,
  QrCode,
  Sparkles,
  Eye,
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface StoreViewProps {
  products: DigitalProduct[];
  ownedProductIds: string[];
  isProSubscriber: boolean;
  onPurchaseProduct: (productId: string, method: 'PIX' | 'Cartão de Crédito' | 'Assinatura Pro') => void;
  onOpenPdfReader: (product: DigitalProduct) => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  products,
  ownedProductIds,
  isProSubscriber,
  onPurchaseProduct,
  onOpenPdfReader,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<DigitalProduct | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<'details' | 'checkout' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito'>('PIX');
  const [onlyMyBooks, setOnlyMyBooks] = useState(false);

  const categories = ['all', 'Livro', 'Revista EBD', 'Comentário Bíblico', 'Manual Pastoral', 'Esboços'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesOwned = !onlyMyBooks || canUserDownload(p, isProSubscriber, ownedProductIds);
    return matchesCategory && matchesSearch && matchesOwned;
  });

  const handleOpenModal = (p: DigitalProduct) => {
    setActiveModalProduct(p);
    setPurchaseStep('details');
  };

  const handleConfirmPurchase = () => {
    if (!activeModalProduct) return;
    const method = canUserDownload(activeModalProduct, isProSubscriber, ownedProductIds)
      ? 'Assinatura Pro'
      : paymentMethod;
    onPurchaseProduct(activeModalProduct.id, method);
    setPurchaseStep('success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Hero Store Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-amber-500/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
            <ShoppingBag className="w-3.5 h-3.5" /> Livraria Digital Cristã
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-amber-100 tracking-tight">
            Livros, Revistas da EBD & Manuais em PDF
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Acervo teológico curado para pastores, professores e líderes. Adquira materiais avulsos ou aproveite os títulos inclusos na assinatura Pro.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOnlyMyBooks(!onlyMyBooks)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                onlyMyBooks
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{onlyMyBooks ? 'Mostrando: Minha Biblioteca' : 'Ver Meus Livros Adquiridos'}</span>
            </button>

            {isProSubscriber && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Assinante Pro Ativo (Acesso aos PDFs selados)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor, comentário..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos os Materiais' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Nenhum material encontrado</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Tente mudar a categoria de filtro ou o termo pesquisado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const hasAccess = canUserDownload(p, isProSubscriber, ownedProductIds);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover image preview with badges */}
                  <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                        {p.category}
                      </span>
                      {p.isFreeForSubscribers && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-sm">
                          Incluso no Pro
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 text-amber-200 backdrop-blur-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{p.rating.toFixed(1)}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-400" /> {p.format} • {p.pages} págs
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Por: <span className="text-slate-700">{p.author}</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Footer and Call to action */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div>
                    {hasAccess ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Disponível
                      </span>
                    ) : (
                      <div>
                        <span className="text-xs text-slate-400 block line-through">
                          R$ {(p.price * 1.3).toFixed(2)}
                        </span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          R$ {p.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasAccess ? (
                      <button
                        onClick={() => onOpenPdfReader(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        title="Ler ou Baixar PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <span>Adquirir</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details & Purchase Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {activeModalProduct.category}
                </span>
                <span className="text-xs text-slate-400">{activeModalProduct.format} • {activeModalProduct.pages} páginas</span>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {purchaseStep === 'details' && (
                <>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img
                      src={activeModalProduct.coverImage}
                      alt={activeModalProduct.title}
                      className="w-32 h-44 object-cover rounded-xl shadow-md border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold font-serif text-slate-900 leading-snug">
                        {activeModalProduct.title}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Autor: <strong className="text-slate-800">{activeModalProduct.author}</strong>
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {activeModalProduct.description}
                      </p>

                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-2xl font-extrabold text-slate-900 font-mono">
                          R$ {activeModalProduct.price.toFixed(2)}
                        </span>
                        {activeModalProduct.isFreeForSubscribers && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            Incluso gratuitamente para Assinantes Pro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table of contents preview */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Sumário & Conteúdo Programático:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {activeModalProduct.tableOfContents.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Acesso perpétuo e download ilimitado
                    </span>

                    <button
                      onClick={() => setPurchaseStep('checkout')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Avançar para Pagamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {purchaseStep === 'checkout' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    Forma de Pagamento Segura
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                        paymentMethod === 'PIX'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <QrCode className="w-6 h-6 text-emerald-600" />
                        {paymentMethod === 'PIX' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">PIX Instantâneo</span>
                        <span className="text-xs text-slate-500">Liberação imediata do PDF</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cartão de Crédito')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                        paymentMethod === 'Cartão de Crédito'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                        {paymentMethod === 'Cartão de Crédito' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Cartão de Crédito</span>
                        <span className="text-xs text-slate-500">Até 3x sem juros</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Item: {activeModalProduct.title}</span>
                      <span>R$ {activeModalProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Formato: PDF Digital com marca d'água</span>
                      <span>Grátis</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPurchaseStep('details')}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Voltar aos Detalhes
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmPurchase}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar e Liberar Material</span>
                    </button>
                  </div>
                </div>
              )}

              {purchaseStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Compra Realizada com Sucesso!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    O material <strong>"{activeModalProduct.title}"</strong> já está liberado em sua biblioteca ministerial.
                  </p>

                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        onOpenPdfReader(activeModalProduct);
                        setActiveModalProduct(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Abrir no Leitor Digital</span>
                    </button>

                    <button
                      onClick={() => setActiveModalProduct(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                    >
                      Continuar Navegando
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
