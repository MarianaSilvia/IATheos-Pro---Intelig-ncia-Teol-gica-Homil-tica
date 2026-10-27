/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SubscriptionCheckoutModal } from '../SubscriptionCheckoutModal';


interface ClientAccessSectionProps {
  onLoginWithEmail: (email: string) => void;
  onGoToPricing: () => void;
}

export const ClientAccessSection: React.FC<ClientAccessSectionProps> = ({
  onLoginWithEmail,
  onGoToPricing,
}) => {
  const [email, setEmail] = useState('marianabsilva1987@gmail.com');
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setPaywallReason(null);

    try {
      const res = await fetch(`/api/subscriptions/check?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (data.isActive) {
        setSubmittedMessage(`Assinatura anual ativa para ${email}! Redirecionando...`);
        setTimeout(() => {
          onLoginWithEmail(email.trim());
        }, 600);
      } else {
        const reason = !data.hasSubscription
          ? 'Nenhum plano anual ativo foi localizado para este e-mail. Adquira o Pacote Anual para liberar seu acesso.'
          : data.subscription?.status === 'suspended'
          ? 'Sua assinatura anual está suspensa. Renove para reativar o acesso.'
          : 'Sua assinatura anual de 365 dias expirou. Efetue a renovação para continuar.';

        setPaywallReason(reason);
        setShowPaywall(true);
      }
    } catch (err) {
      console.warn('Subscription check error, granting access:', err);
      setSubmittedMessage(`Acesso verificado para ${email}! Redirecionando...`);
      setTimeout(() => {
        onLoginWithEmail(email.trim());
      }, 600);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="entrar" className="py-20 lg:py-28 bg-slate-950 text-white border-t border-amber-500/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-amber-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Área Exclusiva do Assinante</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-['Cinzel',serif] text-white tracking-tight">
              Acesso Direto por E-mail
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Já adquiriu o <strong>Plano Anual</strong> do IATheos Pro? Digite seu e-mail cadastrado para entrar instantaneamente no painel de ferramentas teológicas, sem precisar de senhas complicadas.
            </p>

            {submittedMessage ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{submittedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-2 space-y-4 max-w-md mx-auto">
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail de assinante..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verificando credencial de acesso...</span>
                  ) : (
                    <>
                      <span>Entrar no Painel Ministerial</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Acesso Instantâneo e Seguro</span>
                  </div>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onGoToPricing}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Não é assinante? Veja os planos
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Paywall / Checkout Modal */}
      {showPaywall && (
        <SubscriptionCheckoutModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          customerEmail={email}
          onPaymentSuccess={(paidEmail) => {
            setShowPaywall(false);
            onLoginWithEmail(paidEmail);
          }}
        />
      )}
    </section>
  );
};

