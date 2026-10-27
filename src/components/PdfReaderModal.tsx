/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DigitalProduct } from '../utils/ecosystem';
import {
  X,
  Download,
  BookOpen,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from 'lucide-react';

interface PdfReaderModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ product, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownload = () => {
    const textBlob = new Blob(
      [
        `=================================================================\n` +
          `IATheos Pro - Material Teológico Digital\n` +
          `Título: ${product.title}\n` +
          `Autor: ${product.author}\n` +
          `Categoria: ${product.category}\n` +
          `=================================================================\n\n` +
          `SUMÁRIO:\n` +
          product.tableOfContents.map((c, i) => `${i + 1}. ${c}`).join('\n') +
          `\n\n-----------------------------------------------------------------\n` +
          `CONTEÚDO:\n\n` +
          product.samplePdfContent +
          `\n\n(Material protegido por direitos autorais e licenciado para uso pastoral).\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Top Reader Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
            PDF Reader
          </span>
          <h2 className="text-sm sm:text-base font-bold font-serif text-slate-100 truncate max-w-xs sm:max-w-md">
            {product.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoom(Math.max(75, zoom - 15))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 15))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar Material</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reader Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-900/60">
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 sm:p-14 max-w-3xl w-full border border-slate-200 transition-all font-serif space-y-6 text-slate-900"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Document Cover / Header page */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-2">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-amber-700 block">
              {product.category} • Formato Oficial {product.format}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              {product.title}
            </h1>
            <p className="text-sm font-sans text-slate-600">
              Autor: <strong>{product.author}</strong> | Total de Páginas: {product.pages}
            </p>
          </div>

          {/* Sumário */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 font-sans space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Índice Geral do Conteúdo:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {product.tableOfContents.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>{item}</span>
                  <span className="font-mono text-slate-400">Pág. {(idx + 1) * 15}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leitura do Conteúdo */}
          <div className="space-y-4 pt-4 leading-relaxed text-slate-800">
            <h2 className="text-xl font-bold border-b border-slate-200 pb-2">
              Leitura Inicial & Fundamentação Teológica
            </h2>
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed bg-amber-50/40 p-6 rounded-2xl border border-amber-200/50">
              {product.samplePdfContent}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs font-sans text-slate-500">
            <span>IATheos Pro • Licença de Leitura Pastoral</span>
            <span>Página {currentPage} de {product.pages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
