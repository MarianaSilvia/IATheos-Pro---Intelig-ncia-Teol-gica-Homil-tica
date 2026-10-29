/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './Navbar.tsx';
import { HeroSection } from './HeroSection.tsx';
import { InteractiveDemoSection } from './InteractiveDemoSection.tsx';
import { FeaturesSection } from './FeaturesSection.tsx';
import { PricingSectionRestored } from './PricingSectionRestored.tsx';
import { ClientAccessSectionRestored } from './ClientAccessSectionRestored.tsx';
import { ClientAccessModalRestored } from './ClientAccessModalRestored.tsx';
import { Footer } from './Footer.tsx';
import { LegalModal, type LegalPage } from './LegalModal.tsx';

interface LandingPageProps {
  products: Array<{ id: string; title: string; price: number }>;
  plans: Array<{ id: string; name: string; price: number; durationDays: number }>;
  onInterest: (email: string, productId: string) => Promise<void>;
  onSubscriptionInterest: (email: string, phone: string, planId: string) => Promise<void>;
  onLoginWithEmail: (email: string) => Promise<void>;
  onLoginWithPassword: (email: string, password: string) => Promise<void>;
  onAdminLogin: (email: string, password: string) => Promise<void>;
  error: string;
  onRetry: () => void;
  signingIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  plans,
  onSubscriptionInterest,
  onLoginWithEmail,
  onLoginWithPassword,
  onAdminLogin,
}) => {
  const [clientLoginModalOpen, setClientLoginModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Navbar */}
      <Navbar
        onOpenClientLogin={() => setClientLoginModalOpen(true)}
        onGoToPricing={() => scrollToSection('precos')}
        onEnterApp={() => setAdminLoginOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onGoToPricing={() => scrollToSection('precos')}
          onGoToDemo={() => scrollToSection('demonstracao')}
        />

        {/* 3. Seção de Demonstração Interativa (Demo) */}
        <InteractiveDemoSection />

        {/* 4. Vitrine de Recursos (Os Encartes do Sistema) */}
        <FeaturesSection />

        {/* 5. Seção de Preços (Foco Exclusivo no Pacote Anual) */}
        <PricingSectionRestored
          plans={plans}
          onSubscribe={(email, phone, planId) => {
            return onSubscriptionInterest(email, phone, planId);
          }}
          onOpenClientLogin={() => setClientLoginModalOpen(true)}
        />

        {/* 6. Área de Login do Cliente (Acesso por E-mail) */}
        <ClientAccessSectionRestored
          onLoginWithEmail={onLoginWithEmail}
          onLoginWithPassword={onLoginWithPassword}
          onGoToPricing={() => scrollToSection('precos')}
        />
      </main>

      {/* Quiet Footer */}
      <Footer
        onOpenClientLogin={() => setClientLoginModalOpen(true)}
        onGoToPricing={() => scrollToSection('precos')}
        onEnterApp={() => setAdminLoginOpen(true)}
        onOpenLegal={setLegalPage}
      />

      {/* Client Access Modal (Triggered from Navbar or CTAs) */}
      <ClientAccessModalRestored
        isOpen={clientLoginModalOpen}
        onClose={() => setClientLoginModalOpen(false)}
        onLoginWithEmail={onLoginWithEmail}
        onGoToPricing={() => {
          setClientLoginModalOpen(false);
          scrollToSection('precos');
        }}
      />
      {adminLoginOpen && <AdminLoginModal onClose={() => setAdminLoginOpen(false)} onSubmit={onAdminLogin} />}
      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </div>
  );
};

function AdminLoginModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><form onSubmit={async (event) => { event.preventDefault(); setBusy(true); setError(""); try { await onSubmit(email.trim(), password); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }} className="bg-white text-slate-900 rounded-2xl p-6 max-w-md w-full space-y-4 relative"><button type="button" onClick={onClose} className="absolute right-4 top-3 text-xl" aria-label="Fechar">×</button><h2 className="text-xl font-bold">Acesso administrativo</h2><input required type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-3 rounded-xl" /><input required minLength={8} type="password" autoComplete="current-password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-3 rounded-xl" />{error && <p role="alert" className="text-red-700 text-sm">{error}</p>}<button disabled={busy} className="w-full bg-amber-600 text-white p-3 rounded-xl font-bold">{busy ? "Entrando…" : "Entrar"}</button></form></div>;
}
