/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'buyer' | 'admin';

export interface DigitalProduct {
  id: string;
  title: string;
  author: string;
  category: 'Livro' | 'Revista EBD' | 'Comentário Bíblico' | 'Manual Pastoral' | 'Esboços';
  format: 'PDF';
  pages: number;
  price: number;
  isFreeForSubscribers: boolean;
  coverImage: string;
  description: string;
  tableOfContents: string[];
  samplePdfContent: string;
  downloadUrl: string;
  downloadsCount: number;
  rating: number;
  featured?: boolean;
}

export interface DigitalOrder {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  pricePaid: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Assinatura Pro';
  status: 'Concluído' | 'Pendente';
  purchasedAt: string;
}

export interface Hymn {
  number: number;
  title: string;
  author?: string;
  category: 'Louvor e Adoração' | 'Consagração' | 'Fé e Esperança' | 'Espírito Santo' | 'Vitória' | 'Segunda Vinda';
  chorus: string;
  stanzas: string[];
  historicalContext?: string;
}

export interface BibleChapterData {
  book: string;
  chapter: number;
  translation: 'ARC' | 'NAA' | 'NVI' | 'KJF';
  verses: Array<{
    number: number;
    text: string;
  }>;
}

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod-manual-homiletica',
    title: 'Manual de Homilética Expositiva: Do Texto ao Púlpito',
    author: 'Pr. Dr. Samuel Vasconcelos',
    category: 'Manual Pastoral',
    format: 'PDF',
    pages: 248,
    price: 49.90,
    isFreeForSubscribers: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: 'Guia definitivo de estruturação homilética, exegese dos originais, elaboração de introduções impactantes, ilustrações contextualizadas e apelos éticos para pastores e pregadores.',
    tableOfContents: [
      'Capítulo 1: O que é Pregação Expositiva Fiel',
      'Capítulo 2: A Ponte Hermenêutica: Do Mundo Antigo ao Século XXI',
      'Capítulo 3: Como Estruturar os 3 Tópicos Principais',
      'Capítulo 4: A Arte das Metáforas e Ilustrações do Cotidiano',
      'Capítulo 5: O Momento do Altar e a Conduta Pastoral',
    ],
    samplePdfContent: 'PREFÁCIO\n\nA proclamação da Palavra de Deus é a tarefa mais nobre e solene outorgada a um servo de Deus. Quando nos achegamos ao púlpito, não trazemos palpites humanos, mas a voz viva do Deus soberano...',
    downloadUrl: '#download-manual-homiletica',
    downloadsCount: 1420,
    rating: 4.9,
    featured: true,
  },
  {
    id: 'prod-revista-ebd-4tri',
    title: 'Revista EBD Adultos: As Grandes Alianças Bíblicas e a Graça',
    author: 'Conselho Teológico IATheos',
    category: 'Revista EBD',
    format: 'PDF',
    pages: 96,
    price: 29.90,
    isFreeForSubscribers: true,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    description: 'Currículo trimestral de 13 lições completas para a Escola Bíblica Dominical. Acompanha esquemas de lousa, slides sugeridos, quebra-gelos e perguntas profundas para debate.',
    tableOfContents: [
      'Lição 1: O Pacto Adâmico e a Promessa do Protoevangelho',
      'Lição 2: A Aliança Noética e a Preservação da Criação',
      'Lição 3: A Aliança Abraâmica: A Justificação pela Fé',
      'Lição 4: A Aliança Mosaica e a Santidade do Povo',
      'Lição 5: A Aliança Davídica e o Trono Eterno do Messias',
      'Lição 6: A Nova Aliança Selada no Sangue de Jesus',
    ],
    samplePdfContent: 'LIÇÃO 1: O PACTO ADÂMICO\n\nTexto Áureo: Gênesis 3:15\nObjetivo: Compreender a semente da redenção plantada logo após a Queda...',
    downloadUrl: '#download-revista-ebd',
    downloadsCount: 3890,
    rating: 4.8,
    featured: true,
  },
  {
    id: 'prod-comentario-romanos',
    title: 'Comentário Exegético e Homilético de Romanos (Vol. 1)',
    author: 'Prof. Marcos Aureliano, Th.D.',
    category: 'Comentário Bíblico',
    format: 'PDF',
    pages: 380,
    price: 59.90,
    isFreeForSubscribers: false,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    description: 'Exegese detalhada de Romanos 1 a 8 versículo por versículo, com transliteração do grego koiné, dicionário morfológico, implicações soteriológicas e aplicações devocionais.',
    tableOfContents: [
      'Introdução: A Situação da Igreja em Roma e o Propósito Paulino',
      'Romanos 1: A Ira de Deus Contra a Impiedade Universal',
      'Romanos 2-3: A Universalidade do Pecado e a Justificação Gratuita',
      'Romanos 4: Abraão, o Pai da Fé e a Imputação da Justiça',
      'Romanos 5: Os Frutos da Justificação e a Esperança Inabalável',
      'Romanos 6-8: Vida no Espírito e a Certeza da Glória',
    ],
    samplePdfContent: 'INTRODUÇÃO A ROMANOS\n\nNenhuma carta na história da cristandade exerceu tamanho impacto transformador quanto a epístola aos Romanos. Foi através dela que Agostinho, Lutero e Wesley experimentaram o fogo do Espírito...',
    downloadUrl: '#download-romanos',
    downloadsCount: 890,
    rating: 5.0,
    featured: false,
  },
  {
    id: 'prod-100-ilustracoes',
    title: '100 Ilustrações Homiléticas Memoráveis para Pregadores',
    author: 'Pr. Carlos Eduardo Rios',
    category: 'Esboços',
    format: 'PDF',
    pages: 180,
    price: 34.90,
    isFreeForSubscribers: true,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
    description: 'Coleção categorizada de metáforas, histórias reais, fatos científicos e analogias do cotidiano organizadas por temas bíblicos (Fé, Graça, Oração, Sofrimento, Evangelismo e Família).',
    tableOfContents: [
      'Seção 1: Ilustrações sobre a Graça Escandalosa',
      'Seção 2: Ilustrações sobre a Provação e o Forjamento do Caráter',
      'Seção 3: Ilustrações sobre a Família Cristã',
      'Seção 4: Ilustrações para Apelos Evangelísticos',
    ],
    samplePdfContent: 'ILUSTRAÇÃO 1: O RELÓGIO QUE PAROU\n\nCerta vez, um marinheiro naufragou com um relógio de bolso antigo dado por seu avô. Na tempestade, o relógio parou exatamente na hora em que o navio afundou...',
    downloadUrl: '#download-ilustracoes',
    downloadsCount: 2750,
    rating: 4.7,
    featured: false,
  },
];

export const INITIAL_HYMNS: Hymn[] = [
  {
    number: 1,
    title: 'Chuvas de Graça',
    author: 'Daniel Webster Whittle (1883)',
    category: 'Espírito Santo',
    chorus: 'Chuvas de graça, chuvas pedimos, Senhor;\nManda-nos já torrentes, derrama Teu amor!',
    stanzas: [
      'Deus prometeu com certeza chuvas de graça mandar;\nEle nos dá fortaleza e ricas bênçãos sem par.',
      'Cristo nos dá a vitória, dá-nos também Seu poder;\nCom grande graça e glória faz nossa fé florescer.',
      'Dá-nos, Senhor, amplamente, Teu Santo Consolador;\nEnche o Teu povo crente com Teu sublime amor.',
    ],
    historicalContext: 'Composto no contexto dos grandes avivamentos do século XIX, inspirado em Ezequiel 34:26: "e farei descer a chuva a seu tempo; chuvas de bênçãos serão".',
  },
  {
    number: 15,
    title: 'Foi na Cruz',
    author: 'Ralph E. Hudson / Isaac Watts (1707)',
    category: 'Vitória',
    chorus: 'Foi na cruz, foi na cruz, onde um dia eu vi\nMeu pecado castigado em Jesus;\nFoi ali, pela fé, que os olhos abri,\nE agora me alegro em Sua luz.',
    stanzas: [
      'Oh! Quão cego andei e perdido vaguei,\nLonge, longe do meu Salvador!\nMas do céu Ele desceu e Seu sangue verteu\nPra salvar um tão pobre pecador.',
      'Oh! Que grande amor, que bendito amor,\nQue o Pai por nós revelou!\nEnviando Jesus, que expirou na cruz,\nNossa dívida inteira pagou.',
    ],
    historicalContext: 'Adaptação do hino clássico "Alas! and Did My Savior Bleed" de Isaac Watts, considerado o pai dos hinos ingleses, expressando a profunda gratidão pela justificação vicária.',
  },
  {
    number: 77,
    title: 'Guarda o Contato',
    author: 'Charles S. Nusbaum (1899)',
    category: 'Consagração',
    chorus: 'Guarda o contato com teu Salvador!\nDeixa que o Espírito te encha de amor!\nOuve Sua voz com reverência e temor,\nE terás poder do Redentor!',
    stanzas: [
      'Queres, no mundo, vencer o pecado?\nQueres viver com Jesus lado a lado?\nGuarda o contato em oração fervente,\nE Ele guardará a tua mente.',
      'Deixa os cuidados da vida mundana,\nBusca a pureza de Deus soberana;\nEle promete estar presente sempre,\nAté que no céu Ele te encontre.',
    ],
    historicalContext: 'Um dos hinos pentecostais mais entoados nas vigílias e consagrações pastorais da Harpa Cristã, enfatizando a comunhão contínua do crente.',
  },
  {
    number: 186,
    title: 'De Valor em Valor',
    author: 'E. C. Deas (1900)',
    category: 'Fé e Esperança',
    chorus: 'De valor em valor, e de glória em glória,\nSeguiremos avante com fé no Senhor;\nPois a nós prometeu a mais rica vitória,\nSobre a terra, o pecado e a dor!',
    stanzas: [
      'Pela fé no Cordeiro que foi imolado,\nCaminhamos seguros, sem desfalecer;\nPois o sangue vertido nos tem resgatado,\nE a Sua presença nos faz renascer.',
      'Se o inimigo rugir como leão faminto,\nNão tememos o mal, nem a tribulação;\nPois o Espírito Santo habita no crente,\nE nos enche de graça e consolação.',
    ],
    historicalContext: 'Inspirado no Salmo 84:7: "Vão indo de força em força; cada um deles aparece diante de Deus em Sião".',
  },
  {
    number: 545,
    title: 'Porque Ele Vive',
    author: 'Bill & Gloria Gaither (1971)',
    category: 'Vitória',
    chorus: 'Porque Ele vive, posso crer no amanhã;\nPorque Ele vive, temor não há;\nMas eu bem sei, eu sei que a minha vida\nEstá nas mãos de meu Jesus, que vivo está.',
    stanzas: [
      'Deus enviou Seu Filho amado\nPara morrer no meu lugar;\nNa cruz pagou por meus pecados,\nMas o sepulcro vazio está porque Ele vive!',
      'E quando, enfim, chegar a hora\nEm que a morte enfrentarei,\nSem medo, então, terei vitória:\nVerei na glória o meu Jesus, que vivo está!',
    ],
    historicalContext: 'Escrito pelo casal Gaither durante um período de crise de saúde e incerteza social no final dos anos 1960, celebrando a ressurreição corporal de Cristo.',
  },
];

export const BIBLE_BOOKS = [
  { id: 'GEN', name: 'Gênesis', testament: 'AT', chapters: 50 },
  { id: 'EXO', name: 'Êxodo', testament: 'AT', chapters: 40 },
  { id: 'PSA', name: 'Salmos', testament: 'AT', chapters: 150 },
  { id: 'ISA', name: 'Isaías', testament: 'AT', chapters: 66 },
  { id: 'MAT', name: 'Mateus', testament: 'NT', chapters: 28 },
  { id: 'JHN', name: 'João', testament: 'NT', chapters: 21 },
  { id: 'ACT', name: 'Atos', testament: 'NT', chapters: 28 },
  { id: 'ROM', name: 'Romanos', testament: 'NT', chapters: 16 },
  { id: 'EPH', name: 'Efésios', testament: 'NT', chapters: 6 },
  { id: 'REV', name: 'Apocalipse', testament: 'NT', chapters: 22 },
];

export const SAMPLE_BIBLE_CHAPTERS: Record<string, Record<string, BibleChapterData>> = {
  'ROM-5': {
    ARC: {
      book: 'Romanos',
      chapter: 5,
      translation: 'ARC',
      verses: [
        { number: 1, text: 'Sendo, pois, justificados pela fé, temos paz com Deus por nosso Senhor Jesus Cristo;' },
        { number: 2, text: 'Pelo qual também temos entrada pela fé a esta graça, na qual estamos firmes; e nos gloriamos na esperança da glória de Deus.' },
        { number: 3, text: 'E não somente isto, mas também nos gloriamos nas tribulações, sabendo que a tribulação produz a paciência;' },
        { number: 4, text: 'E a paciência, a experiência; e a experiência, a esperança.' },
        { number: 5, text: 'E a esperança não traz confusão, porquanto o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.' },
        { number: 6, text: 'Porque Cristo, estando nós ainda fracos, morreu a seu tempo pelos ímpios.' },
        { number: 7, text: 'Porque apenas alguém morrerá por um justo; pois poderá ser que pelo bom alguém ouse morrer.' },
        { number: 8, text: 'Mas Deus prova o seu amor para conosco em que Cristo morreu por nós, sendo nós ainda pecadores.' },
      ],
    },
    NAA: {
      book: 'Romanos',
      chapter: 5,
      translation: 'NAA',
      verses: [
        { number: 1, text: 'Justificados, pois, mediante a fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo,' },
        { number: 2, text: 'por intermédio de quem obtivemos igualmente acesso, pela fé, a esta graça na qual estamos firmes; e nos gloriamos na esperança da glória de Deus.' },
        { number: 3, text: 'E não somente isso, mas também nos gloriamos nas tribulações, sabendo que a tribulação produz perseverança,' },
        { number: 4, text: 'a perseverança produz um caráter aprovado, e o caráter aprovado produz esperança.' },
        { number: 5, text: 'Ora, a esperança não nos decepciona, porque o amor de Deus é derramado em nosso coração pelo Espírito Santo, que nos foi outorgado.' },
        { number: 6, text: 'Porque Cristo, quando nós ainda éramos fracos, morreu a seu tempo pelos ímpios.' },
        { number: 7, text: 'Dificilmente alguém morreria por um justo; embora por uma pessoa boa alguém talvez tenha coragem de morrer.' },
        { number: 8, text: 'Mas Deus prova o seu próprio amor para conosco pelo fato de Cristo ter morrido por nós quando ainda éramos pecadores.' },
      ],
    },
    NVI: {
      book: 'Romanos',
      chapter: 5,
      translation: 'NVI',
      verses: [
        { number: 1, text: 'Tendo sido, pois, justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo,' },
        { number: 2, text: 'por meio de quem obtivemos acesso pela fé a esta graça na qual agora estamos firmes; e nos gloriamos na esperança da glória de Deus.' },
        { number: 3, text: 'Não só isso, mas também nos gloriamos nas tribulações, porque sabemos que a tribulação produz perseverança;' },
        { number: 4, text: 'a perseverança, um caráter aprovado; e o caráter aprovado, esperança.' },
        { number: 5, text: 'E a esperança não nos decepciona, porque Deus derramou seu amor em nossos corações, por meio do Espírito Santo que ele nos concedeu.' },
        { number: 6, text: 'De fato, no devido tempo, quando ainda éramos fracos, Cristo morreu pelos ímpios.' },
        { number: 7, text: 'Dificilmente haverá quem morra por um justo; embora pelo homem bom talvez alguém tenha coragem de morrer.' },
        { number: 8, text: 'Mas Deus demonstra seu amor por nós: Cristo morreu em nosso favor quando ainda éramos pecadores.' },
      ],
    },
    KJF: {
      book: 'Romanos',
      chapter: 5,
      translation: 'KJF',
      verses: [
        { number: 1, text: 'Portanto, sendo justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo;' },
        { number: 2, text: 'pelo qual também temos acesso pela fé a esta graça, na qual estamos firmes; e regozijamo-nos na esperança da glória de Deus.' },
        { number: 3, text: 'E não somente isto, mas também nos gloriamos nas tribulações, sabendo que a tribulação opera a paciência;' },
        { number: 4, text: 'e a paciência, a experiência; e a experiência, a esperança.' },
        { number: 5, text: 'E a esperança não traz vergonha, porque o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.' },
        { number: 6, text: 'Pois, quando ainda estávamos sem forças, a seu tempo Cristo morreu pelos ímpios.' },
        { number: 7, text: 'Pois quase ninguém morrerá por um justo; contudo, por um homem bom alguém até se atreveria a morrer.' },
        { number: 8, text: 'Mas Deus recomenda o seu amor para conosco, em que, enquanto éramos ainda pecadores, Cristo morreu por nós.' },
      ],
    },
  },
  'JHN-3': {
    ARC: {
      book: 'João',
      chapter: 3,
      translation: 'ARC',
      verses: [
        { number: 14, text: 'E, como Moisés levantou a serpente no deserto, assim importa que o Filho do Homem seja levantado;' },
        { number: 15, text: 'Para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
        { number: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
        { number: 17, text: 'Porque Deus enviou o seu Filho ao mundo não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
      ],
    },
    NAA: {
      book: 'João',
      chapter: 3,
      translation: 'NAA',
      verses: [
        { number: 14, text: 'E assim como Moisés levantou a serpente no deserto, assim também é necessário que o Filho do Homem seja levantado,' },
        { number: 15, text: 'para que todo o que nele crê tenha a vida eterna.' },
        { number: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.' },
        { number: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por meio dele.' },
      ],
    },
    NVI: {
      book: 'João',
      chapter: 3,
      translation: 'NVI',
      verses: [
        { number: 14, text: 'Da mesma forma como Moisés levantou a serpente no deserto, assim também é necessário que o Filho do homem seja levantado,' },
        { number: 15, text: 'para que todo o que nele crer tenha a vida eterna.' },
        { number: 16, text: 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.' },
        { number: 17, text: 'Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que este fosse salvo por meio dele.' },
      ],
    },
    KJF: {
      book: 'João',
      chapter: 3,
      translation: 'KJF',
      verses: [
        { number: 14, text: 'E, como Moisés levantou a serpente no deserto, assim também deve ser levantado o Filho do homem;' },
        { number: 15, text: 'para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
        { number: 16, text: 'Porque Deus amou o mundo de tal maneira, que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
        { number: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que o mundo através dele possa ser salvo.' },
      ],
    },
  },
};

export const INITIAL_ORDERS: DigitalOrder[] = [
  {
    id: 'ord-1001',
    productId: 'prod-manual-homiletica',
    productTitle: 'Manual de Homilética Expositiva',
    customerName: 'Pr. Lucas Mendonça',
    customerEmail: 'lucas.mendonca@igreja.org.br',
    pricePaid: 49.90,
    paymentMethod: 'PIX',
    status: 'Concluído',
    purchasedAt: '2026-10-27T08:15:00.000Z',
  },
  {
    id: 'ord-1002',
    productId: 'prod-revista-ebd-4tri',
    productTitle: 'Revista EBD Adultos: Grandes Alianças',
    customerName: 'Profª Débora Sampaio',
    customerEmail: 'debora.ebd@batista.com',
    pricePaid: 29.90,
    paymentMethod: 'Cartão de Crédito',
    status: 'Concluído',
    purchasedAt: '2026-10-27T09:22:00.000Z',
  },
  {
    id: 'ord-1003',
    productId: 'prod-comentario-romanos',
    productTitle: 'Comentário Exegético de Romanos',
    customerName: 'Ev. Tiago Andrade',
    customerEmail: 'tiago.teologia@gmail.com',
    pricePaid: 59.90,
    paymentMethod: 'PIX',
    status: 'Concluído',
    purchasedAt: '2026-10-27T10:04:00.000Z',
  },
  {
    id: 'ord-1004',
    productId: 'prod-100-ilustracoes',
    productTitle: '100 Ilustrações Homiléticas Memoráveis',
    customerName: 'Pr. Josué Bittencourt',
    customerEmail: 'josue.pr@assembleia.org',
    pricePaid: 34.90,
    paymentMethod: 'Assinatura Pro',
    status: 'Concluído',
    purchasedAt: '2026-10-27T10:18:00.000Z',
  },
];

export function canUserDownload(product: DigitalProduct, isProSubscriber: boolean, ownedProductIds: string[]): boolean {
  if (ownedProductIds.includes(product.id)) return true;
  if (product.price === 0) return true;
  if (isProSubscriber && product.isFreeForSubscribers) return true;
  return false;
}

export function calculateAdminMetrics(orders: DigitalOrder[]) {
  const completed = orders.filter((o) => o.status === 'Concluído');
  const totalRevenue = completed.reduce((acc, curr) => acc + curr.pricePaid, 0);
  const averageTicket = completed.length > 0 ? totalRevenue / completed.length : 0;
  return {
    totalRevenue,
    totalSales: completed.length,
    averageTicket,
  };
}

export function searchHymns(hymns: Hymn[], query: string): Hymn[] {
  const q = query.trim().toLowerCase();
  if (!q) return hymns;
  const num = parseInt(q, 10);
  if (!isNaN(num)) {
    return hymns.filter((h) => h.number === num);
  }
  return hymns.filter(
    (h) =>
      h.title.toLowerCase().includes(q) ||
      h.chorus.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q)
  );
}
