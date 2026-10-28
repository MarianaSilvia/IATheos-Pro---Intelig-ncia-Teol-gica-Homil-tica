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
        'Leitor bíblico moderno com suporte às traduções disponíveis, controle de tamanho de fonte, cópia rápida e acervo parcial da Harpa Cristã com busca por número e título.',
      icon: BookOpen,
      highlights: ['ARC, NAA, NVI e KJF quando disponíveis', 'Acervo parcial identificado na tela', 'Cópia rápida de versículos para estudo'],
    },
    {
      id: 'sermons',
      tabKey: 'sermons',
      title: 'Criador de Esboços & Modo Púlpito',
      kicker: 'Excelência em Homilética',
      description:
        'Estruturação expositiva completa com tema central, contexto histórico, 3 tópicos exegéticos com ilustrações do cotidiano e apelo. Acompanha o Modo Púlpito com leitura ampliada e fonte ajustável.',
      icon: Mic,
      highlights: ['3 Tópicos com ilustrações práticas', 'Leitura ampliada no Modo Púlpito', 'Impressão A4 do esboço'],
    },
    {
      id: 'store',
      tabKey: 'store',
      title: 'Biblioteca de materiais',
      kicker: 'Acervo Ministerial Exclusivo',
      description:
        'Livraria digital integrada com materiais adicionados periodicamente. Os arquivos ficam em nuvem externa e o link só aparece após a verificação do acesso.',
      icon: FileText,
      highlights: ['Capas e detalhes dos materiais', 'Links externos protegidos por autorização', 'Materiais incluídos na assinatura quando marcados'],
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
      tabKey: 'library',
      title: 'Caderno Ministerial',
      kicker: 'Organização pessoal',
      description:
        'Guarde seus estudos e notas pessoais sincronizados com segurança. A comunidade compartilhada permanece fora desta versão.',
      icon: Users,
      highlights: ['Sincronização instantânea na nuvem', 'Caderno de anotações pessoal', 'Dados isolados por usuário'],
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
