/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Lock,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';

interface PricingSectionProps {
  onSuccessfulPurchase?: (method: string) => void;
  onOpenClientLogin?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSuccessfulPurchase,
  onOpenClientLogin,
}) => {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [customerName, setCustomerName] = useState('Pastor Carlos Eduardo');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const benefits = [
    'Acesso Ilimitado ao Criador de Esboços de Sermão Homiléticos',
    'Modo Púlpito exclusivo em tela cheia com teleprompter',
    'Apoio Pedagógico completo à Escola Bíblica Dominical (EBD)',
    'Raio-X Exegético do Versículo nos Originais (Grego & Hebraico)',
    'Bíblia Online (ARC, NAA, NVI, KJF) com acompanhamento anual',
    'Coletânea completa dos 640 hinos da Harpa Cristã com busca',
    'Livraria Digital de Revistas e E-books em PDF inclusos',
    'Sincronização em Nuvem Segura (Cloud SQL + Firebase)',
    'Caderno Ministerial de anotações e reflexões bíblicas',
    'Atualizações automáticas da IA sem custo adicional',
    'Garantia Incondicional de 7 dias sem perguntas',
  ];

  const handleStartCheckout = () => {
    setCheckoutModalOpen(true);
    setPaymentSuccess(false);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      if (onSuccessfulPurchase) {
        onSuccessfulPurchase(paymentMethod === 'PIX' ? 'PIX' : 'Cartão de Crédito');
      }
    }, 900);
  };

  return (
    <section id="precos" className="py-20 lg:py-28 bg-slate-900 border-t border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Condição Exclusiva de Lançamento</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Cinzel',serif] tracking-tight">
            Invista no seu Ministério com o Pacote Anual
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Um único plano transparente com acesso irrestrito a todas as ferramentas teológicas por 12 meses inteiros.
          </p>
        </div>

        {/* Marquee Pricing Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 p-6 sm:p-10 relative overflow-hidden">
          {/* Top highlight ribbon */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase px-6 py-1.5 rounded-bl-2xl shadow-md tracking-wider">
            Recomendado para Líderes & Pastores
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Acesso Anual Ilimitado
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-['Cinzel',serif]">
                Plano IATheos Pro Anual
              </h3>
              <p className="text-slate-300 text-sm mt-2">
                Tudo o que você precisa para pregar com profundidade, ensinar com didática e estudar com rigor acadêmico.
              </p>
            </div>

            {/* Price block */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-baseline justify-between gap-2">
              <div>
                <span className="text-xs line-through text-slate-400 block">De R$ 597,00 por apenas</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-sm font-medium">12x de</span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">
                    R$ 29,90
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1 block">ou R$ 297,00 à vista (50% OFF)</span>
              </div>

              <div className="text-right sm:text-left self-end sm:self-center">
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Economize R$ 300,00
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                O que está incluso no seu acesso:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleStartCheckout}
                className="w-full py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Garantir Meu Acesso Anual Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Garantia Incondicional de 7 Dias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Pagamento 100% Seguro (Pix / Cartão)</span>
                </div>
              </div>
            </div>

            {/* Already has access */}
            <div className="text-center pt-2">
              <button
                onClick={onOpenClientLogin}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Já adquiriu o Plano Anual? Clique aqui para acessar por e-mail.
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                  Acesso Anual Liberado!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Seja bem-vindo ao <strong>IATheos Pro</strong>! Enviamos a confirmação para <strong>{customerEmail}</strong>. Seu acesso está ativo no banco de dados.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      if (onOpenClientLogin) onOpenClientLogin();
                    }}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm"
                  >
                    Entrar Imediatamente na Área do Cliente
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Checkout Oficial IATheos Pro
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Garantir Acesso Anual — R$ 297,00
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Acesso imediato para computador e celular.
                  </p>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Pr. Carlos Eduardo"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Seu E-mail (Para Liberação do Acesso)
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Ex: pastor@igreja.com.br"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Você usará este mesmo e-mail para fazer login sem senha no painel.
                    </span>
                  </div>
                </div>

                {/* Payment method selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                        paymentMethod === 'PIX'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Pix (Aprovação Imediata)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'PIX' ? (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" />
                      <span>Chave Pix Gerada Instantaneamente</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      O QR Code e a chave Copia-e-Cola serão validados e seu acesso é ativado no mesmo instante.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      <span>Parcelamento em até 12x de R$ 29,90</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Transação criptografada de ponta a ponta com confirmação imediata.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processando liberação do acesso...</span>
                  ) : (
                    <>
                      <span>Confirmar e Liberar Acesso Anual</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
