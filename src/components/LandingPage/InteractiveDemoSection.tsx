/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Mic,
  Languages,
  Check,
  Copy,
  ArrowRight,
  RefreshCw,
  Sliders,
  Layers,
} from 'lucide-react';

interface DemoItem {
  id: string;
  label: string;
  category: 'Pregação' | 'Raio-X' | 'EBD';
  title: string;
  verseRef: string;
  badge: string;
  intro: string;
  topics: Array<{
    title: string;
    exegetical: string;
    illustration: string;
  }>;
  conclusion: string;
  prayer: string;
}

const DEMO_PRESETS: DemoItem[] = [
  {
    id: 'sermon-hope',
    label: 'Gerar Esboço sobre Fé & Esperança',
    category: 'Pregação',
    title: 'A Esperança Inabalável na Adversidade',
    verseRef: 'Romanos 5:3-5',
    badge: 'Homilética Expositiva',
    intro:
      'Em tempos de crise, a alma humana busca refúgio em seguranças frágeis. Paulo escreve à igreja em Roma demonstrando que as tribulações não são acidentes de percurso, mas ferramentas divinas para forjar um caráter indestrutível.',
    topics: [
      {
        title: '1. O Valor Pedagógico da Tribulação (v.3)',
        exegetical:
          'No original grego, a palavra para tribulação é "thlipsis" (θλῖψις), que significa pressão esmagadora, como a prensa que espreme a uva para produzir o vinho novo.',
        illustration:
          'Como o ferro bruto que somente adquire tempera e resistência após passar pelas chamas ardentes da forja do ferreiro.',
      },
      {
        title: '2. A Forja da Paciência e do Caráter Aprovado (v.4)',
        exegetical:
          'Paciência ("hypomone" - ὑπομονή) é a virtude de permanecer firme debaixo de pesado fardo sem ceder nem desertar da fé.',
        illustration:
          'Como uma árvore centenária cujas raízes descem mais fundo na rocha exatamente quando os vendavais mais fortes a fustigam.',
      },
      {
        title: '3. A Certeza que Não Decepciona (v.5)',
        exegetical:
          'A esperança bíblica ("elpis" - ἐλπίς) não é mero otimismo humano de sorte, mas uma âncora fincada no amor de Deus já derramado pelo Espírito Santo.',
        illustration:
          'Como a âncora de um navio jogada não na areia movediça, mas na rocha submarina inamovível.',
      },
    ],
    conclusion:
      'A esperança cristã não depende da previsão do tempo, mas da Rocha dos Séculos. Levante a cabeça: sua dor atual está gerando um peso eterno de glória.',
    prayer:
      'Senhor Deus, derrama Teu amor em nossos corações aflitos. Dá-nos firmeza para louvar enquanto atravessamos a forja. Em nome de Jesus, Amém!',
  },
  {
    id: 'xray-john',
    label: 'Raio-X dos Originais: João 3:16',
    category: 'Raio-X',
    title: 'O Coração do Evangelho nos Originais Gregos',
    verseRef: 'João 3:16 (Grego Koiné)',
    badge: 'Exegese dos Originais',
    intro:
      'João 3:16 é o sumário da redenção. Proferido na calada da noite a Nicodemos, o texto desconstrói o legalismo e revela a iniciativa sacrificial do Pai celestial.',
    topics: [
      {
        title: '1. A Intensidade da Doação: "Agapaō" (ἠγάπησεν)',
        exegetical:
          'O verbo grego está no aoristo indicativo ativo: uma ação histórica pontual, irrevogável e definitiva realizada na cruz do Calvário.',
        illustration:
          'Um amor que não aguarda o merecimento do réu, mas paga a fiança de um condenado sem que ele tenha nada a oferecer.',
      },
      {
        title: '2. A Singularidade de Cristo: "Monogenēs" (μονογενῆ)',
        exegetical:
          'Não significa meramente "nascido", mas "único em sua espécie e gênero", com a exata essência divina do Pai.',
        illustration:
          'Não foi um servo nem um anjo enviado para a missão, mas o próprio Herdeiro Único do Trono da Glória.',
      },
      {
        title: '3. A Promessa Eterna: "Zōēn Aiōnion" (ζωὴν αἰώνιον)',
        exegetical:
          'Mais do que duração cronológica sem fim, refere-se à qualidade de vida da própria eternidade de Deus fruída no presente.',
        illustration:
          'Como um manancial que jorra de dentro para a eternidade, imune às secas e aos desertos desta vida terrena.',
      },
    ],
    conclusion:
      'O amor de Deus não é um sentimento abstrato; é um ato histórico verificado e disponível a todo aquele que nele crê.',
    prayer:
      'Pai celestial, obrigado por não poupar Teu único Filho por amor a nós. Que nossa vida seja um memorial de gratidão à Tua graça. Amém!',
  },
  {
    id: 'ebd-prayer',
    label: 'Aula de EBD: O Poder da Oração',
    category: 'EBD',
    title: 'O Poder da Oração de Joelhos em Comunidade',
    verseRef: 'Atos 12:1-17',
    badge: 'Didática Dominical',
    intro:
      'Quando o rei Herodes prendeu Pedro sob escolta de quatro grupos de soldados, a igreja não possuía armas nem influência política. Eles possuíam apenas os joelhos no chão.',
    topics: [
      {
        title: '1. O Cenário de Paralisia Humana (vv. 1-4)',
        exegetical:
          'Duas correntes, quatro piquetes e portas de ferro. O império romano cercou Pedro por todos os lados para impedir a continuação da missão.',
        illustration:
          'Dinâmica do Quebra-gelo: Mostre um cadeado fechado aos alunos e pergunte qual chave humana abriria uma prisão de segurança máxima.',
      },
      {
        title: '2. A Resposta da Igreja: Oração Contínua (v. 5)',
        exegetical:
          'A expressão "ektenōs" (ἐκτενῶς) denota oração esticada até o limite, com fervor persistente e sem desfalecer noite e dia.',
        illustration:
          'Como o cabo de um guindaste tencionado ao máximo para içar uma carga que excede qualquer força humana.',
      },
      {
        title: '3. O Toque do Anjo e as Correntes que Caem (vv. 6-11)',
        exegetical:
          'A porta de ferro da cidade abriu-se "por si mesma" (automatē - αὐτομάτη). Onde termina a força do homem, começa a ação soberana do Senhor.',
        illustration:
          'Aplicação em Classe: Pergunte aos alunos: "Qual é a porta de ferro que parece trancada em sua família neste mês?"',
      },
    ],
    conclusion:
      'Nenhum decreto humano ou corrente de ferro resiste quando o povo de Deus se reúne em oração sincera e unânime.',
    prayer:
      'Senhor, batiza nossa igreja com espírito de intercessão e perseverança. Abre as prisões e liberta os cativos. Em nome de Jesus, Amém!',
  },
];

export const InteractiveDemoSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('sermon-hope');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeItem = DEMO_PRESETS.find((p) => p.id === selectedId) || DEMO_PRESETS[0];

  const handleSelectPreset = (id: string) => {
    if (id === selectedId) return;
    setIsGenerating(true);
    setSelectedId(id);
    setTimeout(() => {
      setIsGenerating(false);
    }, 450);
  };

  const handleCopy = () => {
    const textToCopy = `=== ${activeItem.title} ===
Texto Base: ${activeItem.verseRef}

Introdução:
${activeItem.intro}

Desenvolvimento:
${activeItem.topics
  .map(
    (t) => `${t.title}
Exegese: ${t.exegetical}
Ilustração: ${t.illustration}`
  )
  .join('\n\n')}

Conclusão:
${activeItem.conclusion}

Oração Pastoral:
${activeItem.prayer}

Gerado pelo Verbo Norte`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="demonstracao" className="py-20 lg:py-28 bg-slate-900 border-y border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demonstração Interativa ao Vivo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Cinzel',serif] tracking-tight">
            Experimente o Cérebro Teológico do Verbo Norte
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Clique nos botões abaixo para simular em tempo real a elaboração instantânea de pregações, análises exegéticas e planos de aula para a EBD.
          </p>
        </div>

        {/* Interactive Preset Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedId === preset.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-102'
                  : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
              }`}
            >
              {preset.category === 'Pregação' && <Mic className="w-4 h-4 text-slate-950" />}
              {preset.category === 'Raio-X' && <Languages className="w-4 h-4 text-slate-950" />}
              {preset.category === 'EBD' && <BookOpen className="w-4 h-4 text-slate-950" />}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Simulated SaaS Output Card */}
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden transition-all">
          {/* Simulated Mac/App Window Bar */}
          <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                verbo-norte-engine // {activeItem.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Esboço</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-sm text-slate-300 font-medium">
                  Processando exegese bíblica nos textos originais...
                </p>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {/* Header Information */}
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {activeItem.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Texto Base: <strong className="text-slate-200">{activeItem.verseRef}</strong>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
                    {activeItem.title}
                  </h3>
                </div>

                {/* Introduction Box */}
                <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    Introdução Homilética & Contexto Histórico
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {activeItem.intro}
                  </p>
                </div>

                {/* 3 Main Topics */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Desenvolvimento em 3 Tópicos Exegéticos
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeItem.topics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/30 transition-all space-y-2.5"
                      >
                        <h4 className="text-base sm:text-lg font-bold text-amber-300">
                          {topic.title}
                        </h4>

                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-2 border-l-2 border-amber-500/40">
                          <span className="font-semibold text-slate-200">Exegese dos Originais: </span>
                          {topic.exegetical}
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl text-xs sm:text-sm text-slate-400 border border-slate-800/60 flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0">💡 Ilustração Prática:</span>
                          <span>{topic.illustration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusion & Altar Call */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      Conclusão & Aplicação Pastoral
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeItem.conclusion}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                      Apelo & Oração Sugerida
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                      "{activeItem.prayer}"
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
