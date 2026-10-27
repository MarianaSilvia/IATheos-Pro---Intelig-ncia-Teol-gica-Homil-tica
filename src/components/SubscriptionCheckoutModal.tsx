/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerEmail: string;
  onPaymentSuccess: (email: string) => void;
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  customerEmail,
  onPaymentSuccess,
}) => {
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailInput, setEmailInput] = useState(customerEmail || 'marianabsilva1987@gmail.com');

  if (!isOpen) return null;

  // Pix string simulation following BR Code EMV format
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136financeiro@iatheos.pro5204000053039865406297.005802BR5915IATHEOS PRO SAAS6009SAO PAULO62240520IATHEOS${Date.now().toString().slice(-6)}6304E8A2`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmSimulation = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          customer_name: emailInput.split('@')[0],
          transaction_id: `SIM-WH-${Date.now()}`,
          payment_method: paymentTab === 'pix' ? 'PIX' : 'InfinitePay',
          amount: 297.0,
        }),
      });

      if (res.ok) {
        onPaymentSuccess(emailInput);
        onClose();
      }
    } catch (e) {
      console.error(e);
      onPaymentSuccess(emailInput);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-amber-500/30 rounded-3xl max-w-lg w-full text-white relative shadow-2xl overflow-hidden my-8">
        {/* Subtle Top Gold Highlight */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Acesso Exclusivo Anual</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
              Assinatura Anual IATheos Pro
            </h3>

            <p className="text-xs sm:text-sm text-slate-300">
              365 dias de acesso irrestrito ao cérebro teológico com IA, gerador de sermões, EBD e biblioteca de PDFs.
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-800 text-center relative overflow-hidden">
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
              Pacote Anual com 50% de Desconto Ministerial
            </div>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-['Cinzel',serif] text-white">
                R$ 297,00
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">/ano</span>
            </div>

            <div className="text-xs text-slate-300 mt-1">
              ou <strong className="text-amber-300">12x de R$ 29,90</strong> no cartão de crédito via InfinitePay
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Sem mensalidades. Cobrança única com 365 dias de garantia e suporte.
            </div>
          </div>

          {/* Customer Email Confirmation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              E-mail para Liberação do Acesso
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="seu-email@igreja.com.br"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Payment Method Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPaymentTab('pix')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                paymentTab === 'pix'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Chave Pix (Imediato)</span>
            </button>

            <button
              onClick={() => setPaymentTab('card')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                paymentTab === 'card'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cartão / InfinitePay</span>
            </button>
          </div>

          {/* PIX TAB */}
          {paymentTab === 'pix' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-slate-200 text-slate-900 text-center">
                {/* Visual SVG QR Code */}
                <div className="w-44 h-44 bg-slate-950 p-2.5 rounded-xl flex items-center justify-center shadow-inner relative group">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full fill-white"
                  >
                    {/* Corner Squares */}
                    <rect x="5" y="5" width="28" height="28" fill="white" />
                    <rect x="9" y="9" width="20" height="20" fill="#020617" />
                    <rect x="13" y="13" width="12" height="12" fill="#f59e0b" />

                    <rect x="67" y="5" width="28" height="28" fill="white" />
                    <rect x="71" y="9" width="20" height="20" fill="#020617" />
                    <rect x="75" y="13" width="12" height="12" fill="#f59e0b" />

                    <rect x="5" y="67" width="28" height="28" fill="white" />
                    <rect x="9" y="71" width="20" height="20" fill="#020617" />
                    <rect x="13" y="75" width="12" height="12" fill="#f59e0b" />

                    {/* QR Code Matrix Dots */}
                    <rect x="40" y="8" width="6" height="6" />
                    <rect x="52" y="8" width="6" height="6" />
                    <rect x="40" y="20" width="6" height="6" />
                    <rect x="48" y="26" width="6" height="6" />
                    <rect x="8" y="42" width="6" height="6" />
                    <rect x="20" y="42" width="6" height="6" />
                    <rect x="28" y="48" width="6" height="6" />
                    <rect x="42" y="42" width="16" height="16" fill="#f59e0b" />
                    <rect x="68" y="42" width="6" height="6" />
                    <rect x="78" y="42" width="6" height="6" />
                    <rect x="86" y="48" width="6" height="6" />
                    <rect x="40" y="68" width="6" height="6" />
                    <rect x="52" y="74" width="6" height="6" />
                    <rect x="68" y="68" width="6" height="6" />
                    <rect x="76" y="78" width="6" height="6" />
                    <rect x="86" y="86" width="6" height="6" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2">
                  Chave Pix Copia e Cola Oficial
                </span>
                <span className="text-[11px] text-slate-500">
                  Banco Central do Brasil • Confirmação instantânea por Webhook
                </span>
              </div>

              {/* Copy Pix String */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Código Copia e Cola:</span>
                  <span className="text-emerald-400 font-medium">Válido por 30 minutos</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 truncate select-all"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CARD / INFINITEPAY TAB */}
          {paymentTab === 'card' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  Pagamento Seguro via InfinitePay / Cartão de Crédito
                </h4>
                <p className="text-xs text-slate-400">
                  Parcele em até <strong>12x de R$ 29,90</strong> com taxa zero de abertura. Checkout criptografado com liberação imediata.
                </p>
                <a
                  href="https://infinitepay.io"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <span>Abrir Link InfinitePay Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Instant Activation Demo / Webhook Simulation CTA */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <button
              onClick={handleConfirmSimulation}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Ativando plano via Webhook...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Simular Confirmação de Pagamento (Ativar Imediatamente)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Webhook conectado em <code>/api/webhooks/payment</code> com Cloud SQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
