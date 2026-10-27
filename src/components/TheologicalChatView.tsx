/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface TheologicalChatViewProps {
  onSendMessage: (msg: string, history: ChatMessage[]) => Promise<string>;
  isLoading: boolean;
}

export const TheologicalChatView: React.FC<TheologicalChatViewProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `**Graça e Paz! Eu sou o IATheos Pro.**\n\nEstou à disposição para auxiliá-lo em seu ministério pastoral, preparo homilético, exegese dos originais (hebraico, grego e aramaico) e didática cristã.\n\nVocê pode me fazer perguntas sobre:\n- Interpretação de passagens difíceis (*crux interpretum*)\n- Harmonia bíblica e teologia pactual\n- Contexto histórico e arqueológico dos tempos bíblicos\n- Dúvidas doutrinárias, escatologia e história da igreja\n\nComo posso ser útil ao seu estudo hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');

    try {
      const response = await onSendMessage(q.trim(), newHistory);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: `Ocorreu uma falha temporária ao consultar a inteligência teológica: ${err?.message || 'Tente novamente em instantes'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMsg]);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestions = [
    'Qual o significado exegético de "espíritos em prisão" em 1 Pedro 3:19?',
    'Como harmonizar Romanos 4 (justificação pela fé) e Tiago 2 (fé e obras)?',
    'Explique a diferença entre Justificação, Regeneração e Santificação.',
    'Qual a importância teológica do Yom Kippur (Dia da Expiação) em Hebreus?',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-100">
              Consultor Teológico Livre
            </h2>
            <p className="text-xs text-slate-400">
              Perguntas & Respostas com fundamentação exegética, teologia bíblica e ética pastoral.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate">{s}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 min-h-[460px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[580px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-amber-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 relative group ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-none font-sans'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] opacity-75 mb-1">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'Você' : 'IATheos Pro'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar resposta"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs italic p-3">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Consultando os manuscritos sagrados e a hermenêutica bíblica...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-100 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida teológica, passagem bíblica ou tema para consulta..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Perguntar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
