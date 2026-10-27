/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DigitalProduct } from '../utils/ecosystem';
import {
  Upload,
  FileText,
  DollarSign,
  CheckCircle,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AdminAdicionarPDFProps {
  onProductAdded: (newProduct: Omit<DigitalProduct, 'id' | 'downloadsCount' | 'rating'>) => void;
  onSuccessToast?: (msg: string) => void;
}

export default function AdminAdicionarPDF({ onProductAdded, onSuccessToast }: AdminAdicionarPDFProps) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('Conselho Editorial IATheos');
  const [categoria, setCategoria] = useState<DigitalProduct['category']>('Livro');
  const [preco, setPreco] = useState('');
  const [paginas, setPaginas] = useState('120');
  const [isFreeForSubscribers, setIsFreeForSubscribers] = useState(true);
  const [capaUrl, setCapaUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');
  const [descricao, setDescricao] = useState('');
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArquivoPdf(file);
    }
  };

  const handleSalvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate file reading / storage upload
      let downloadUrl = '#download-pdf';
      let sampleText = `AMOSTRA EXCLUSIVA DO MATERIAL:\n\n${titulo}\nAutor: ${autor}\n\nArquivo anexado: ${arquivoPdf?.name || 'documento.pdf'} (${arquivoPdf ? (arquivoPdf.size / 1024).toFixed(1) + ' KB' : 'PDF Digital'})\n\nEste material foi cadastrado com sucesso no ecossistema IATheos Pro e está pronto para download e leitura da congregação.`;

      if (arquivoPdf) {
        // Create an in-memory blob URL for preview and download
        downloadUrl = URL.createObjectURL(arquivoPdf);
      }

      onProductAdded({
        title: titulo.trim(),
        author: autor.trim() || 'Autor Não Especificado',
        category: categoria,
        format: 'PDF',
        pages: parseInt(paginas, 10) || 50,
        price: parseFloat(preco) || 0,
        isFreeForSubscribers,
        coverImage: capaUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        description: descricao.trim() || 'Material teológico em PDF preparado para estudo pastoral, aulas de EBD e liderança cristã.',
        tableOfContents: [
          'Apresentação e Contexto Bíblico',
          'Capítulo 1: Fundamentação Exegética',
          'Capítulo 2: Esboços e Aplicações Práticas',
          'Conclusão e Orientações Ministeriais',
        ],
        samplePdfContent: sampleText,
        downloadUrl,
        featured: false,
      });

      setSucesso(true);
      if (onSuccessToast) {
        onSuccessToast(`Livro/Revista PDF "${titulo}" cadastrado com sucesso na loja!`);
      }

      // Reset form
      setTitulo('');
      setPreco('');
      setDescricao('');
      setArquivoPdf(null);
      setTimeout(() => setSucesso(false), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Painel Admin: Adicionar Produto PDF
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre novos e-books, revistas da EBD e apostilas em PDF diretamente na loja cristã.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Livro/Revista PDF cadastrado com sucesso na loja e disponível para download!</span>
        </div>
      )}

      <form onSubmit={handleSalvarProduto} className="flex flex-col gap-4 text-xs sm:text-sm">
        {/* Título */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Título do Livro / Revista
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Lições Bíblicas EBD - As Epístolas da Prisão"
            className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* Autor e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Autor / Pregador
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ex: Pr. Dr. Antônio Carlos"
              className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
              className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Livro">Livro Teológico</option>
              <option value="Revista EBD">Revista da EBD</option>
              <option value="Comentário Bíblico">Comentário Bíblico</option>
              <option value="Manual Pastoral">Manual Pastoral</option>
              <option value="Esboços">Coletânea de Esboços</option>
            </select>
          </div>
        </div>

        {/* Preço e Páginas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preço (R$)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="29.90 (ou 0 para gratuito)"
                className="w-full border border-slate-300 p-2.5 rounded-xl bg-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Número de Páginas
            </label>
            <input
              type="number"
              min="1"
              value={paginas}
              onChange={(e) => setPaginas(e.target.value)}
              placeholder="120"
              className="w-full border border-slate-300 p-2.5 rounded-xl bg-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Imagem de Capa */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            URL da Capa do Livro (Opcional)
          </label>
          <input
            type="url"
            value={capaUrl}
            onChange={(e) => setCapaUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-slate-300 p-2.5 rounded-xl bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Sinopse / Descrição */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Sinopse / Descrição do Material
          </label>
          <textarea
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva os temas abordados, a relevância homilética e o público-alvo da obra..."
            className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Arquivo PDF */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Arquivo PDF Digital
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
            <input
              type="file"
              id="file-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                {arquivoPdf ? arquivoPdf.name : 'Clique para selecionar o arquivo PDF do seu computador'}
              </span>
              {arquivoPdf && (
                <span className="text-[11px] font-mono text-emerald-600 font-bold">
                  {(arquivoPdf.size / (1024 * 1024)).toFixed(2)} MB • PDF Pronto para Upload
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Checkbox Assinante Pro */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="proFree"
            checked={isFreeForSubscribers}
            onChange={(e) => setIsFreeForSubscribers(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="proFree" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Liberar acesso gratuito para Assinantes do Plano Pro
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Salvando no Catálogo...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Cadastrar PDF na Loja</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
