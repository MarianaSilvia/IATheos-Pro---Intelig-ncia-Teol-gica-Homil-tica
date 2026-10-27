/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './Navbar.tsx';
import { HeroSection } from './HeroSection.tsx';
import { InteractiveDemoSection } from './InteractiveDemoSection.tsx';
import { FeaturesSection } from './FeaturesSection.tsx';
import { PricingSection } from './PricingSection.tsx';
import { ClientAccessSection } from './ClientAccessSection.tsx';
import { ClientAccessModal } from './ClientAccessModal.tsx';
import { Footer } from './Footer.tsx';

interface LandingPageProps {
  onEnterApp: () => void;
  onLoginWithEmail: (email: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onLoginWithEmail,
}) => {
  const [clientLoginModalOpen, setClientLoginModalOpen] = useState(false);

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
        onEnterApp={onEnterApp}
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
        <PricingSection
          onOpenClientLogin={() => setClientLoginModalOpen(true)}
          onSuccessfulPurchase={() => {
            onLoginWithEmail('marianabsilva1987@gmail.com');
          }}
        />

        {/* 6. Área de Login do Cliente (Acesso por E-mail) */}
        <ClientAccessSection
          onLoginWithEmail={onLoginWithEmail}
          onGoToPricing={() => scrollToSection('precos')}
        />
      </main>

      {/* Quiet Footer */}
      <Footer
        onOpenClientLogin={() => setClientLoginModalOpen(true)}
        onGoToPricing={() => scrollToSection('precos')}
        onEnterApp={onEnterApp}
      />

      {/* Client Access Modal (Triggered from Navbar or CTAs) */}
      <ClientAccessModal
        isOpen={clientLoginModalOpen}
        onClose={() => setClientLoginModalOpen(false)}
        onLoginWithEmail={onLoginWithEmail}
        onGoToPricing={() => {
          setClientLoginModalOpen(false);
          scrollToSection('precos');
        }}
      />
    </div>
  );
};
