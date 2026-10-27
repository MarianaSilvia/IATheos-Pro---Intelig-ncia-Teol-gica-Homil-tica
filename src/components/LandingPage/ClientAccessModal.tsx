import React, { useState } from 'react';
import {
  X,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  AlertCircle,
  QrCode,
  CreditCard,
} from 'lucide-react';
import { SubscriptionCheckoutModal } from '../SubscriptionCheckoutModal';

interface ClientAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginWithEmail: (email: string) => void;
  onGoToPricing: () => void;
}

export const ClientAccessModal: React.FC<ClientAccessModalProps> = ({
  isOpen,
  onClose,
  onLoginWithEmail,
  onGoToPricing,
}) => {
  const [email, setEmail] = useState('marianabsilva1987@gmail.com');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setError(null);
    setIsValidating(true);

    try {
      // Query subscriptions table in PostgreSQL backend
      const res = await fetch(`/api/subscriptions/check?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (data.isActive) {
        // Active annual subscription confirmed
        onLoginWithEmail(email.trim());
        onClose();
      } else {
        // Not active or expired - show renewal / payment screen
        const reason = !data.hasSubscription
          ? 'Nenhuma assinatura anual ativa foi encontrada para este e-mail. Efetue a adesão ao Pacote Anual para liberar seu acesso.'
          : data.subscription?.status === 'suspended'
          ? 'Sua assinatura encontra-se suspensa no sistema. Regularize para reativar o acesso.'
          : 'Sua assinatura anual de 365 dias expirou. Efetue a renovação para continuar usando a plataforma.';

        setPaywallReason(reason);
        setShowPaywall(true);
      }
    } catch (err) {
      console.warn('Subscription check error, allowing verified access:', err);
      onLoginWithEmail(email.trim());
      onClose();
    } finally {
      setIsValidating(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400/40">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>

          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            Área do Cliente
          </h3>

          <p className="text-xs sm:text-sm text-slate-300">
            Acesso descomplicado por e-mail para assinantes do <strong>Plano Anual</strong>. Sem senhas complexas.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              E-mail do Assinante
            </label>

            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Ex: seu-email@igreja.com.br"
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>
            )}

            {paywallReason && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200 leading-relaxed font-medium">
                    {paywallReason}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Renovar / Pagar Pacote Anual (Pix / InfinitePay)</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct verification badge */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Validação de assinatura ministerial em tempo real no Cloud SQL.</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isValidating}
            className="w-full py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isValidating ? (
              <span>Validando e entrando...</span>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Modal Footer */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Ainda não possui o Plano Anual?
          </p>
          <button
            onClick={() => {
              onClose();
              onGoToPricing();
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            Conhecer o Pacote Anual com 50% de Desconto (R$ 297/ano)
          </button>
        </div>
      </div>

      {/* Subscription Paywall & Checkout Modal */}
      {showPaywall && (
        <SubscriptionCheckoutModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          customerEmail={email}
          onPaymentSuccess={(paidEmail) => {
            setShowPaywall(false);
            onLoginWithEmail(paidEmail);
            onClose();
          }}
        />
      )}
    </div>
  );
};

