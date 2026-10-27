/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';
import { getProducts, insertProduct } from './src/db/products.ts';
import { getSavedStudiesForUser, insertSavedStudy } from './src/db/studies.ts';
import {
  ensureSubscriptionsTable,
  getAllSubscriptions,
  getSubscriptionByEmail,
  createOrRenewSubscription,
  updateSubscriptionStatus,
  renewSubscriptionForOneYear,
} from './src/db/subscriptions.ts';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK if key is provided
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION_BASE = `
Você é o "IATheos Pro", um assistente de teologia avançado, exegese bíblica, homilética (arte da pregação) e didática cristã. Seu propósito é servir como o "cérebro" de um sistema SaaS voltado para pastores, líderes, professores de Escola Bíblica Dominical (EBD) e cristãos que buscam estudo profundo das Escrituras.

Diretrizes e Princípios Operacionais:
1. Horizonte Teológico Equilibrado: Forneça respostas baseadas em sólida exegese bíblica, considerando o contexto histórico, gramatical e cultural do texto original (Hebraico, Aramaico e Grego). Evite extremos especulativos e sectarianismos.
2. Clareza e Utilidade Prática: O usuário final é um obreiro ou estudante da Bíblia. Suas respostas devem ser estruturadas, diretas, inspiradoras e prontas para uso prático (seja para um sermão ou uma aula).
3. Fidelidade ao Texto: Sempre priorize o texto sagrado, indicando referências cruzadas relevantes e traduções fiéis.

Tom de Voz:
Respeitoso, teologicamente maduro, encorajador, estruturado (use sempre marcações em negrito, tópicos e listas) e focado em excelência ministerial.
`;

/**
 * Endpoint 1: Gerar Esboço de Sermão (Módulo de Homilética)
 */
app.post('/api/theology/sermon', async (req, res) => {
  try {
    const { biblicalText, theme, sermonType = 'Expositivo', targetAudience = 'Culto Geral', specificFocus = '' } = req.body;

    if (!biblicalText && !theme) {
      return res.status(400).json({ error: 'Texto bíblico ou tema é obrigatório.' });
    }

    if (!aiClient) {
      // Fallback response with structured quality
      return res.json({
        id: `sermon-${Date.now()}`,
        title: theme || `Sermão sobre ${biblicalText}`,
        biblicalText: biblicalText || 'Texto Sagrado',
        theme: theme || 'Vida Cristã e Fidelidade Divina',
        sermonType,
        targetAudience,
        introduction: {
          hook: 'Em meio às pressões da vida cotidiana, o ser humano busca segurança onde seus olhos alcançam, mas a Bíblia nos convida a erguer o olhar para a Rocha inabalável.',
          historicalContext: `Este texto sagrado foi gerado no contexto da revelação divina para advertir e consolar o povo da aliança sob provação.`,
          problemSolved: 'Resolve o conflito da dúvida e do desânimo, apontando para a suficiência da graça e a fidelidade de Deus.',
        },
        topics: [
          {
            number: 1,
            subtitle: 'O Reconhecimento da Soberania de Deus',
            exegeticalExplanation: 'A fundamentação no texto original destaca que o agir divino precede qualquer ação humana e sustenta a aliança.',
            practicalIllustration: 'Como uma âncora fincada no leito da rocha submarina: a tempestade agita a superfície do mar, mas o navio não deriva.',
            crossReferences: ['Salmos 46:1-2', 'Isaías 40:28-31'],
          },
          {
            number: 2,
            subtitle: 'A Resposta de Fé e Fidelidade Prática',
            exegeticalExplanation: 'A fé bíblica não é passiva; o termo original denota firmeza de passos, compromisso e confiança em obediência diária.',
            practicalIllustration: 'Como um galho enxertado na videira que não produz frutos por força própria, mas pela seiva contínua que recebe da raiz.',
            crossReferences: ['João 15:4-5', 'Hebreus 11:1'],
          },
          {
            number: 3,
            subtitle: 'A Promessa da Vitória e Fruto Duradouro',
            exegeticalExplanation: 'A consumação da aliança traz paz interior (shalom) que excede o entendimento e renova as forças da congregação.',
            practicalIllustration: 'Como a alvorada que dissipa a mais escura das noites; o crente sabe que o choro pode durar uma noite, mas a alegria vem pela manhã.',
            crossReferences: ['Salmos 30:5', 'Romanos 8:37'],
          },
        ],
        conclusionAndApplication: {
          summary: 'A Palavra de Deus nos chama hoje a depositar toda a nossa confiança no Senhor e a viver com integridade e intrepidez.',
          practicalCall: [
            'Entregue suas preocupações em oração confiante hoje.',
            'Tome decisões baseadas nos princípios eternos e não nas emoções passageiras.',
            'Seja testemunha viva da graça entre seus familiares e colegas de trabalho.',
          ],
        },
        altarCallAndPrayer: {
          prayerDirection: 'Convide a congregação a ficar de pé e abrir o coração para uma renovação de votos com o Senhor.',
          suggestedPrayer: 'Senhor nosso Deus, nós Te louvamos pela suficiência da Tua Palavra. Que cada semente lançada hoje floresça em nossos corações. Guarda-nos no Teu amor e fortalece os cansados. Em nome de Jesus, Amém!',
        },
        createdAt: new Date().toISOString(),
      });
    }

    const prompt = `
Gere um ESBOÇO DE SERMÃO E MENSAGEM altamente detalhado para pregadores, estruturado rigorosamente no padrão do IATheos Pro:
- Texto Base: "${biblicalText || 'Romanos 5:3-5'}"
- Tema Central: "${theme || 'A Esperança Inabalável na Adversidade'}"
- Tipo de Sermão: "${sermonType}"
- Público/Ocasião: "${targetAudience}"
- Foco Específico do Pregador: "${specificFocus}"

Estruture a resposta estritamente no seguinte formato JSON:
{
  "title": "string (Tema Central / Título Sugerido forte)",
  "biblicalText": "string (Texto Base com citação clara)",
  "theme": "string (Tema teológico conciso)",
  "sermonType": "Expositivo" | "Temático" | "Textual",
  "targetAudience": "string",
  "introduction": {
    "hook": "string (Gancho de atenção cativante)",
    "historicalContext": "string (Contexto histórico, autor, destinatários e época)",
    "problemSolved": "string (Problema existencial/espiritual que o texto bíblico resolve)"
  },
  "topics": [
    {
      "number": 1,
      "subtitle": "string (Subtítulo forte)",
      "exegeticalExplanation": "string (Explicação exegética sólida, mencionando palavras do texto original grego/hebraico com significado profundo)",
      "practicalIllustration": "string (Ilustração prática rica: analogia do cotidiano, metáfora ou história visual)",
      "crossReferences": ["string (2 a 3 referências bíblicas cruzadas)"]
    },
    {
      "number": 2,
      "subtitle": "string (Subtítulo forte)",
      "exegeticalExplanation": "string (Explicação exegética sólida)",
      "practicalIllustration": "string (Ilustração prática)",
      "crossReferences": ["string"]
    },
    {
      "number": 3,
      "subtitle": "string (Subtítulo forte)",
      "exegeticalExplanation": "string (Explicação exegética sólida)",
      "practicalIllustration": "string (Ilustração prática)",
      "crossReferences": ["string"]
    }
  ],
  "conclusionAndApplication": {
    "summary": "string (Resumo impactante da mensagem)",
    "practicalCall": ["string (O que a igreja deve fazer com essa Palavra hoje - 3 diretrizes claras)"]
  },
  "altarCallAndPrayer": {
    "prayerDirection": "string (Direcionamento pastoral para o momento do altar)",
    "suggestedPrayer": "string (Sugestão de oração pastoral completa, comovente e profunda)"
  }
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    parsed.id = `sermon-${Date.now()}`;
    parsed.createdAt = new Date().toISOString();

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating sermon:', error);
    return res.status(500).json({ error: error.message || 'Erro ao gerar o esboço de sermão' });
  }
});

/**
 * Endpoint 2: Módulo de Apoio à EBD (Escola Bíblica Dominical)
 */
app.post('/api/theology/ebd', async (req, res) => {
  try {
    const { biblicalText, theme, targetAudience = 'Adultos', lessonDuration = '50 minutos', emphasis = '' } = req.body;

    if (!biblicalText && !theme) {
      return res.status(400).json({ error: 'Texto bíblico ou tema da aula é obrigatório.' });
    }

    if (!aiClient) {
      return res.json({
        id: `ebd-${Date.now()}`,
        title: theme || `Aula sobre ${biblicalText}`,
        biblicalText: biblicalText || 'Atos 12:1-17',
        targetAudience,
        lessonObjective: 'Compreender o poder e a prática da oração perseverante em comunidade.',
        icebreaker: {
          title: 'A Chave da Fé',
          description: 'Pergunte aos alunos quando foi a última vez que viram uma resposta imediata de Deus a uma oração aflita.',
          reflectiveQuestion: 'Como você reage quando a resposta de Deus demora mais do que você esperava?',
        },
        contentPoints: [
          {
            pointNumber: 1,
            title: 'O Cenário de Impossibilidade Humana',
            scriptureReference: `${biblicalText} (Parte 1)`,
            boardSummary: '• Crise sem saída humana | • O inimigo parece prevalecer',
            teacherExplanation: 'Apresente como a situação parecia completamente perdida sob o olhar dos homens.',
          },
          {
            pointNumber: 2,
            title: 'A Força da Intercessão Contínua',
            scriptureReference: `${biblicalText} (Parte 2)`,
            boardSummary: '• Oração fervorosa | • A igreja unida de joelhos',
            teacherExplanation: 'Destaque que a resposta de Deus não depende de forças políticas, mas da súplica humilde.',
          },
          {
            pointNumber: 3,
            title: 'O Despertar do Milagre',
            scriptureReference: `${biblicalText} (Parte 3)`,
            boardSummary: '• As algemas caem | • Portas de ferro se abrem',
            teacherExplanation: 'Deus intervém de maneira imprevista e surpreende até mesmo a fé hesitante dos discípulos.',
          },
        ],
        discussionQuestions: [
          'Qual é o maior obstáculo para a nossa vida diária de oração?',
          'Como podemos manter a chama da intercessão acesa mesmo quando tudo parece piorar?',
        ],
        practicalConclusion: {
          coreTakeaway: 'Nenhuma corrente resiste quando a igreja do Senhor se prostra com sinceridade.',
          weeklyChallenge: 'Dobre seus joelhos durante 10 minutos todos os dias nesta semana por um irmão em dificuldade.',
        },
        createdAt: new Date().toISOString(),
      });
    }

    const prompt = `
Prepare uma AULA COMPLETA PARA A ESCOLA BÍBLICA DOMINICAL (EBD), adaptada especificamente para o público solicitado, estruturada rigorosamente no padrão do IATheos Pro:
- Tema da Aula: "${theme || 'O Poder da Oração de Joelhos'}"
- Texto Bíblico Base: "${biblicalText || 'Atos 12:1-17'}"
- Faixa Etária / Nível: "${targetAudience}"
- Duração da Aula: "${lessonDuration}"
- Ênfase Didática Solicitada: "${emphasis}"

Estruture a resposta estritamente no seguinte formato JSON:
{
  "title": "string (Título chamativo e pedagógico da lição)",
  "biblicalText": "string (Texto base com capítulos e versículos)",
  "targetAudience": "${targetAudience}",
  "lessonObjective": "string (O que os alunos precisam aprender e praticar ao final da aula de forma clara)",
  "icebreaker": {
    "title": "string (Nome da dinâmica ou gancho inicial)",
    "description": "string (Descrição prática de como o professor deve conduzir o quebra-gelo)",
    "reflectiveQuestion": "string (Uma pergunta reflexiva curta e impactante para iniciar a classe)"
  },
  "contentPoints": [
    {
      "pointNumber": 1,
      "title": "string (Título do ponto)",
      "scriptureReference": "string (Referência)",
      "boardSummary": "string (Pontos em tópicos curtos fáceis de passar no quadro ou projetar em slides)",
      "teacherExplanation": "string (Explicação didática aprofundada para o professor ministrar)"
    },
    {
      "pointNumber": 2,
      "title": "string",
      "scriptureReference": "string",
      "boardSummary": "string",
      "teacherExplanation": "string"
    },
    {
      "pointNumber": 3,
      "title": "string",
      "scriptureReference": "string",
      "boardSummary": "string",
      "teacherExplanation": "string"
    },
    {
      "pointNumber": 4,
      "title": "string",
      "scriptureReference": "string",
      "boardSummary": "string",
      "teacherExplanation": "string"
    }
  ],
  "discussionQuestions": [
    "string (Pergunta 1 profunda para gerar debate em classe)",
    "string (Pergunta 2 profunda para gerar participação dos alunos)",
    "string (Pergunta 3 com aplicação de vida)"
  ],
  "practicalConclusion": {
    "coreTakeaway": "string (Ponto central inegociável da aula)",
    "weeklyChallenge": "string (Desafio prático e mensurável para os alunos cumprirem durante a semana)"
  }
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    parsed.id = `ebd-${Date.now()}`;
    parsed.createdAt = new Date().toISOString();

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating EBD lesson:', error);
    return res.status(500).json({ error: error.message || 'Erro ao gerar material para EBD' });
  }
});

/**
 * Endpoint 3: Módulo de Raio-X do Versículo (Exegese Simplificada dos Originais)
 */
app.post('/api/theology/verse-xray', async (req, res) => {
  try {
    const { verseReference = 'João 3:16', translation = 'Almeida Revista e Atualizada (ARA)' } = req.body;

    if (!verseReference) {
      return res.status(400).json({ error: 'Referência do versículo é obrigatória.' });
    }

    if (!aiClient) {
      return res.json({
        id: `xray-${Date.now()}`,
        verseReference,
        verseText: 'Texto bíblico selecionado.',
        translation,
        historicalCulturalContext: {
          historicalSetting: 'Contexto histórico da revelação bíblica.',
          culturalBackground: 'Pano de fundo dos costumes e crenças do período do Antigo ou Novo Testamento.',
          immediateLiteraryContext: 'O que precede e o que sucede o versículo no livro bíblico.',
          authorAndAudience: 'Autor inspirado e primeiros destinatários.',
        },
        originalKeywords: [
          {
            term: 'Originais',
            transliteration: 'termo',
            strongCode: 'G000 / H000',
            originalLanguage: 'Grego (Koiné)',
            rootWord: 'raiz',
            literalMeaning: 'Significado no original.',
            theologicalDepth: 'Riqueza exegética e gramatical.',
          },
        ],
        crossReferences: [
          { reference: 'Passagem correlata', connection: 'Conexão teológica direta.' },
        ],
        theologicalMeaningToday: {
          hermeneuticalPrinciple: 'Princípio eterno extraído do texto.',
          contemporaryApplication: [
            'Aplicação na vida espiritual diária.',
            'Aplicação nos relacionamentos e testemunho cristão.',
          ],
          pastoralEncouragement: 'Palavra de consolo e edificação para a alma.',
        },
        createdAt: new Date().toISOString(),
      });
    }

    const prompt = `
Realize um RAIO-X EXEGÉTICO DO VERSÍCULO estruturado rigorosamente no padrão do IATheos Pro:
- Versículo a analisar: "${verseReference}"
- Tradução Bíblica Preferencial: "${translation}"

Forneça:
1. Contexto Histórico-Cultural (situação da época, pano de fundo cultural, contexto literário imediato, autor e destinatários).
2. Palavras-Chave nos Originais: selecione de 3 a 6 termos cruciais em Grego Koiné ou Hebraico Bíblico/Aramaico com transliteração, código Strong (ex: G25 ou H2617), raiz morfológica, significado literal e profundidade teológica (tempos verbais, nuances de significado que se perdem na tradução).
3. Referências Cruzadas Relevantes com explicação da conexão teológica.
4. O que o texto significa para nós hoje (Princípio hermenêutico eterno, aplicações contemporâneas e encorajamento pastoral).

Estruture a resposta estritamente no seguinte formato JSON:
{
  "verseReference": "${verseReference}",
  "verseText": "string (O texto completo do versículo na tradução indicada)",
  "translation": "${translation}",
  "historicalCulturalContext": {
    "historicalSetting": "string (Situação histórica detalhada da época)",
    "culturalBackground": "string (Costumes, mentalidade judaico-greco-romana ou do Antigo Oriente Próximo)",
    "immediateLiteraryContext": "string (O que acontece antes e depois no capítulo)",
    "authorAndAudience": "string (Quem escreveu e para quem)"
  },
  "originalKeywords": [
    {
      "term": "string (Termo no alfabeto original grego ou hebraico com acentos/massoréticos)",
      "transliteration": "string (Transliteração legível)",
      "strongCode": "string (ex: G25 ou H1254)",
      "originalLanguage": "Grego (Koiné)" | "Hebraico Bíblico" | "Aramaico",
      "rootWord": "string (Lema ou raiz verbal/nominal)",
      "literalMeaning": "string (Tradução literal precisa)",
      "theologicalDepth": "string (Explicação exegética e teológica aprofundada)"
    }
  ],
  "crossReferences": [
    {
      "reference": "string (ex: Romanos 5:8)",
      "connection": "string (Explicação da conexão bíblica)"
    }
  ],
  "theologicalMeaningToday": {
    "hermeneuticalPrinciple": "string (O princípio atemporal que ultrapassa as barreiras culturais)",
    "contemporaryApplication": [
      "string (Aplicação 1 prática para hoje)",
      "string (Aplicação 2 prática para hoje)",
      "string (Aplicação 3 prática para hoje)"
    ],
    "pastoralEncouragement": "string (Palavra pastoral profunda para os crentes de hoje)"
  }
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    parsed.id = `xray-${Date.now()}`;
    parsed.createdAt = new Date().toISOString();

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating verse xray:', error);
    return res.status(500).json({ error: error.message || 'Erro ao analisar o versículo' });
  }
});

/**
 * Endpoint 4: Chat Teológico Consultivo (Assistente Consultor Livre)
 */
app.post('/api/theology/chat', async (req, res) => {
  try {
    const { message, history = [], theologicalArea = 'Geral' } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    if (!aiClient) {
      return res.json({
        reply: `**IATheos Pro Responde:**\n\nGraça e paz! Sobre sua questão a respeito de *" ${message} "*:\n\n1. **Perspectiva Exegética:** O texto sagrado deve ser sempre interpretado à luz do seu contexto histórico e literário imediato.\n2. **Harmonia das Escrituras:** A Bíblia interpreta a própria Bíblia (*analogia scripturae*).\n3. **Aplicação Pastoral:** Que esta verdade fortaleça seu ministério e edifique o Corpo de Cristo.`,
      });
    }

    // Format chat history for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add prior turns if present
    for (const item of history.slice(-6)) {
      if (item.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: item.text }] });
      } else if (item.sender === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: item.text }] });
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `[Área de Consulta Teológica: ${theologicalArea}]\n\nPergunta do usuário:\n${message}`,
        },
      ],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION_BASE}
Você está atuando como Consultor Teológico e Exegético. Dê respostas profundas, citando termos nos originais (com transliteração e Strong) quando enriquecer o entendimento. Use sempre formatação em Markdown primorosa com negritos, listas e citações bíblicas. Seja encorajador e focado no preparo de pastores e mestres.`,
      },
    });

    return res.json({
      reply: response.text || 'Sem resposta gerada.',
    });
  } catch (error: any) {
    console.error('Error in theological chat:', error);
    return res.status(500).json({ error: error.message || 'Erro no chat teológico' });
  }
});

/**
 * API Health / Status
 */
app.get('/api/theology/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!aiClient,
    model: 'gemini-3.8-flash',
    time: new Date().toISOString(),
  });
});

/**
 * Cloud SQL Endpoints (PostgreSQL + Drizzle)
 */
// Sync user profile upon sign-in
app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || `${uid}@iatheos.internal`;
    const displayName = req.body?.displayName;
    if (!uid) {
      return res.status(401).json({ error: 'User UID missing from token' });
    }
    const user = await getOrCreateUser(uid, email, displayName);
    res.json(user);
  } catch (error: any) {
    console.error('Failed to sync user to Cloud SQL:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// List users (Admin / internal)
app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get digital products (e-books, magazines, PDFs)
app.get('/api/products', async (req, res) => {
  try {
    const items = await getProducts();
    res.json(items);
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product (Admin)
app.post('/api/products', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, price, author, pages, coverUrl, fileUrl } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }
    const created = await insertProduct({
      title,
      description,
      category,
      price: String(price),
      author,
      pages: pages ? Number(pages) : undefined,
      coverUrl,
      fileUrl,
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get saved theological studies for authenticated user
app.get('/api/saved-studies', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const studies = await getSavedStudiesForUser(uid);
    res.json(studies);
  } catch (error: any) {
    console.error('Failed to fetch saved studies:', error);
    res.status(500).json({ error: 'Failed to fetch saved studies' });
  }
});

// Save sermon outline, EBD lesson, or verse X-ray
app.post('/api/saved-studies', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || `${uid}@iatheos.internal`;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await getOrCreateUser(uid, email, req.user?.name);

    const { type, title, biblicalText, content } = req.body;
    if (!type || !title || !content) {
      return res.status(400).json({ error: 'Type, title, and content are required' });
    }
    const saved = await insertSavedStudy({
      userUid: uid,
      type,
      title,
      biblicalText,
      content,
    });
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Failed to save study:', error);
    res.status(500).json({ error: 'Failed to save study' });
  }
});

/**
 * Subscription Management & Checkout Endpoints (Exclusive Annual Plan)
 */

// Check customer annual subscription status by email
app.get('/api/subscriptions/check', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'E-mail do cliente é obrigatório.' });
    }
    const result = await getSubscriptionByEmail(email);
    return res.json(result);
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return res.status(500).json({ error: 'Erro ao consultar status da assinatura.' });
  }
});

// List all customer subscriptions (Admin)
app.get('/api/admin/subscriptions', async (req, res) => {
  try {
    const list = await getAllSubscriptions();
    return res.json(list);
  } catch (error: any) {
    console.error('Error fetching admin subscriptions:', error);
    return res.status(500).json({ error: 'Erro ao listar assinaturas.' });
  }
});

// Add new customer subscription manually (Admin)
app.post('/api/admin/subscriptions', async (req, res) => {
  try {
    const { email, customerName, paymentMethod, transactionId, pricePaid } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }
    const created = await createOrRenewSubscription({
      email,
      customerName,
      paymentMethod: paymentMethod || 'Manual (Admin)',
      transactionId: transactionId || `MANUAL-${Date.now()}`,
      pricePaid: pricePaid || 297.0,
    });
    return res.status(201).json(created);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar assinatura.' });
  }
});

// Update customer subscription status or renew (Admin)
app.patch('/api/admin/subscriptions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { action, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    if (action === 'renew') {
      const renewed = await renewSubscriptionForOneYear(id);
      return res.json({ message: 'Assinatura renovada por +365 dias com sucesso.', subscription: renewed });
    }

    if (status) {
      const updated = await updateSubscriptionStatus(id, status);
      return res.json({ message: `Status alterado para ${status}.`, subscription: updated });
    }

    return res.status(400).json({ error: 'Ação ou status não especificado.' });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return res.status(500).json({ error: 'Erro ao atualizar assinatura.' });
  }
});

// Webhook endpoint for automated payment confirmation (Pix / InfinitePay / Mercado Pago)
app.post('/api/webhooks/payment', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('Received payment webhook:', payload);

    // Support multiple webhook payload formats
    const email = payload.email || payload.customer_email || payload.payer?.email || payload.data?.customer?.email;
    const customerName = payload.customer_name || payload.name || payload.payer?.name || payload.data?.customer?.name;
    const transactionId = payload.transaction_id || payload.id || payload.data?.id || `TX-WH-${Date.now()}`;
    const paymentMethod = payload.payment_method || payload.method || 'PIX';
    const amount = Number(payload.amount || payload.total || 297.0);

    if (!email) {
      return res.status(400).json({
        error: 'Webhook recebido, mas nenhum campo de e-mail do cliente foi identificado.',
        receivedPayload: payload,
      });
    }

    const activated = await createOrRenewSubscription({
      email,
      customerName,
      paymentMethod,
      transactionId,
      pricePaid: amount,
    });

    return res.status(200).json({
      success: true,
      event: 'subscription.activated',
      message: `Assinatura anual de 365 dias ativada com sucesso para ${email}!`,
      subscription: activated,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Falha no processamento do webhook de pagamento.' });
  }
});

/**
 * Mount Vite in development or serve static in production
 */
async function startServer() {
  await ensureSubscriptionsTable();

  if (process.env.NODE_ENV !== 'production') {

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IATheos Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
