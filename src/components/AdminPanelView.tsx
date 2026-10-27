import React, { useState } from 'react';
import { DigitalProduct, DigitalOrder, calculateAdminMetrics } from '../utils/ecosystem';
import AdminAdicionarPDF from './AdminAdicionarPDF';
import {
  ShieldCheck,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  FileText,
  Check,
  Sparkles,
  CreditCard,
  QrCode,
  Tag,
  Star,
  Upload,
} from 'lucide-react';

interface AdminPanelViewProps {
  products: DigitalProduct[];
  orders: DigitalOrder[];
  onAddProduct: (product: Omit<DigitalProduct, 'id' | 'downloadsCount' | 'rating'>) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [adminTab, setAdminTab] = useState<'products' | 'add_pdf' | 'orders' | 'users'>('products');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new product
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<DigitalProduct['category']>('Livro');
  const [price, setPrice] = useState(39.90);
  const [pages, setPages] = useState(150);
  const [isFreeForSubscribers, setIsFreeForSubscribers] = useState(true);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');
  const [description, setDescription] = useState('');

  const metrics = calculateAdminMetrics(orders);

  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddProduct({
      title,
      author,
      category,
      format: 'PDF',
      pages,
      price: Number(price),
      isFreeForSubscribers,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      description,
      tableOfContents: [
        'Introdução e Fundamentos Teológicos',
        'Capítulo 1: Exegese e Hermenêutica Fiel',
        'Capítulo 2: Aplicações Pastorais Contemporâneas',
        'Conclusão e Bibliografia Sugerida',
      ],
      samplePdfContent: `AMOSTRA DO MATERIAL:\n\n${title}\nPor ${author}\n\nEste livro foi preparado para a edificação contínua do corpo ministerial...`,
      downloadUrl: `#download-${Date.now()}`,
      featured: false,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Painel Administrativo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-indigo-100">
            Gestão do Ecossistema IATheos Pro
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gerenciamento de catálogo digital (PDFs, livros e revistas), monitoramento de receita e pedidos de compras e controle de permissões de usuários.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Material (PDF)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita Total</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            R$ {metrics.totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendas Realizadas</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {metrics.totalSales} pedidos
          </div>
          <span className="text-[11px] text-slate-500">
            Materiais digitais liberados
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            R$ {metrics.averageTicket.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500">
            Por compra individual
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinantes Pro</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            348 ativos
          </div>
          <span className="text-[11px] text-purple-700 font-semibold">
            Plano Pastoral Anual
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            adminTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Catálogo de PDFs & Materiais ({products.length})
        </button>

        <button
          onClick={() => setAdminTab('add_pdf')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'add_pdf'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>+ Adicionar Produto PDF</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            adminTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Relatório de Vendas ({orders.length})
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            adminTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Usuários & Permissões
        </button>
      </div>

      {/* TAB: ADD PDF COMPONENT */}
      {adminTab === 'add_pdf' && (
        <AdminAdicionarPDF
          onProductAdded={(newProd) => {
            onAddProduct(newProd);
            setAdminTab('products');
          }}
        />
      )}

      {/* TAB 1: PRODUCTS TABLE */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Materiais Digitais em Catálogo
              </h3>
              <p className="text-xs text-slate-500">
                E-books, revistas e apostilas disponíveis para download e compra.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Material / Capa</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Assinante Pro</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-10 h-14 object-cover rounded-md shadow-xs border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 font-serif">{p.title}</h4>
                          <span className="text-xs text-slate-500">Por {p.author} • {p.pages} págs</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      R$ {p.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {p.isFreeForSubscribers ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          Incluso
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Venda Avulsa</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {p.downloadsCount}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remover material do catálogo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS REPORT */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Extrato de Vendas em Tempo Real
            </h3>
            <p className="text-xs text-slate-500">
              Transações de e-books, revistas e pacotes digitais adquiridos pelos usuários.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Pedido / Data</th>
                  <th className="p-4">Comprador</th>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-800">{ord.id}</span>
                      <span className="block text-[11px] text-slate-400">
                        {new Date(ord.purchasedAt).toLocaleDateString('pt-BR')} às {new Date(ord.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="text-slate-900">{ord.customerName}</strong>
                      <span className="block text-[11px] text-slate-500">{ord.customerEmail}</span>
                    </td>
                    <td className="p-4 font-serif text-slate-800">
                      {ord.productTitle}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {ord.paymentMethod === 'PIX' ? <QrCode className="w-3 h-3 text-emerald-600" /> : <CreditCard className="w-3 h-3 text-indigo-600" />}
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700">
                      R$ {ord.pricePaid.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & PERMISSIONS */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif">
            Usuários Cadastrados & Níveis de Acesso
          </h3>
          <p className="text-xs text-slate-500">
            Controle de perfis entre Compradores/Assinantes e Administradores do sistema.
          </p>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-sm text-slate-900 block">marianabsilva1987@gmail.com</strong>
                <span className="text-xs text-emerald-600 font-medium">Assinatura Pro Ativa • Acesso Total a IA & Biblioteca</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Perfil: Comprador / Assinante
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-sm text-slate-900 block">admin@iatheos.pro</strong>
                <span className="text-xs text-slate-500 font-medium">Superadministrador • Gerenciamento de Catálogo e Vendas</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                Perfil: Administrador
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Cadastrar Novo Material Teológico (PDF)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewProduct} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título do Material
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Teologia Bíblica do Antigo Testamento"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Autor / Docente
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: Pr. Dr. Antônio Silva"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Livro">Livro</option>
                    <option value="Revista EBD">Revista EBD</option>
                    <option value="Comentário Bíblico">Comentário Bíblico</option>
                    <option value="Manual Pastoral">Manual Pastoral</option>
                    <option value="Esboços">Esboços</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Páginas
                  </label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL da Imagem da Capa
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sinopse / Descrição
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo do conteúdo, público-alvo e relevância teológica..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="freeForSub"
                  checked={isFreeForSubscribers}
                  onChange={(e) => setIsFreeForSubscribers(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="freeForSub" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Disponibilizar gratuitamente para Assinantes Pro
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Salvar e Publicar no Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
