/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Mic,
  FileText,
  GraduationCap,
  Users,
  Search,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface FeaturesSectionProps {
  onSelectFeature?: (tab: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'bible-harp',
      tabKey: 'bible_harp',
      title: 'Bíblia & Harpa Cristã Integradas',
      kicker: 'Escrituras & Louvor Tradicional',
      description:
        'Leitor bíblico moderno com suporte a múltiplas traduções (ARC, NAA, NVI, KJF), controle de tamanho de fonte, cópia rápida e os 640 hinos históricos da Harpa Cristã com busca por número e estrofes.',
      icon: BookOpen,
      highlights: ['ARC, NAA, NVI e King James Fiel', 'Todos os 640 Hinos com refrão e estrofes', 'Cópia rápida de versículos para estudo'],
    },
    {
      id: 'sermons',
      tabKey: 'sermons',
      title: 'Criador de Esboços & Modo Púlpito',
      kicker: 'Excelência em Homilética',
      description:
        'Estruturação expositiva completa com tema central, contexto histórico, 3 tópicos exegéticos com ilustrações do cotidiano e apelo. Acompanha o revolucionário Modo Púlpito com teleprompter em tela cheia.',
      icon: Mic,
      highlights: ['3 Tópicos com ilustrações práticas', 'Cronômetro ministerial em tempo real', 'Exportação direta para PDF e Word'],
    },
    {
      id: 'store',
      tabKey: 'store',
      title: 'Biblioteca de PDFs & E-books',
      kicker: 'Acervo Ministerial Exclusivo',
      description:
        'Livraria digital integrada com revistas de EBD, comentários bíblicos e manuais de pastoral adicionados periodicamente. Assinantes Pro contam com acesso liberado a todo o acervo.',
      icon: FileText,
      highlights: ['Leitor de PDF integrado sem sair da plataforma', 'Downloads instantâneos para computador e celular', 'Títulos inclusos no Pacote Anual'],
    },
    {
      id: 'ebd',
      tabKey: 'ebd',
      title: 'Apoio à Escola Bíblica Dominical (EBD)',
      kicker: 'Didática & Dinâmicas Pedagógicas',
      description:
        'Aulas prontas para professores de adultos, jovens ou crianças. Inclui objetivo da lição, quebra-gelo inicial cativante, pontos para quadro negro ou projeção e perguntas para debate em classe.',
      icon: GraduationCap,
      highlights: ['Dinâmicas de quebra-gelo para a classe', 'Quadros sinópticos prontos para slides', 'Perguntas de aplicação contemporânea'],
    },
    {
      id: 'community',
      tabKey: 'community',
      title: 'Comunidade & Caderno Ministerial',
      kicker: 'Compartilhamento & Nuvem Segura',
      description:
        'Caderno pessoal de anotações sincronizado na nuvem (Cloud SQL e Firestore). Troque experiências e recomendações com irmãos de ministério com segurança e privacidade.',
      icon: Users,
      highlights: ['Sincronização instantânea na nuvem', 'Caderno de anotações pessoal', 'Troca sadia de insights teológicos'],
    },
    {
      id: 'verse-xray',
      tabKey: 'verse_xray',
      title: 'Raio-X do Versículo nos Originais',
      kicker: 'Exegese Hebraica & Grega',
      description:
        'Desvende os termos mais profundos das Escrituras com transliteração, códigos Strong H/G, tempos verbais, raízes morfológicas e contexto cultural do Antigo Oriente Próximo e do mundo Greco-Romano.',
      icon: Search,
      highlights: ['Códigos Strong G/H com significado literal', 'Pano de fundo cultural do primeiro século', 'Princípios hermenêuticos eternos'],
    },
  ];

  return (
    <section id="recursos" className="py-20 lg:py-28 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vitrine de Recursos Exclusivos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Cinzel',serif] tracking-tight">
            Os Encartes do Ecossistema IATheos Pro
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Todas as ferramentas necessárias para a preparação ministerial, exegese fiel e proclamação com autoridade bíblica reunidas em um único lugar.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      {item.kicker}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
