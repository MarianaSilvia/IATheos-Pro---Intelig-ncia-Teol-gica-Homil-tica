import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Key,
  Code,
  ExternalLink,
  Search,
  Zap,
} from 'lucide-react';

export interface SubscriptionItem {
  id: number;
  email: string;
  customerName: string | null;
  plan: string;
  status: 'active' | 'suspended' | 'expired';
  startedAt: string | null;
  expiresAt: string;
  pricePaid: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

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
  const [adminTab, setAdminTab] = useState<
    'subscriptions' | 'products' | 'add_pdf' | 'orders' | 'gateway' | 'users'
  >('subscriptions');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [subSearch, setSubSearch] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired'>('all');
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Manual Customer Form State
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'PIX' | 'InfinitePay' | 'Cartão' | 'Cortesia Ministerial'>('PIX');
  const [manualPrice, setManualPrice] = useState(297.00);

  // Webhook Test Simulation State
  const [testWebhookEmail, setTestWebhookEmail] = useState('pastor.novo@igreja.com.br');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Load subscriptions
  const fetchSubscriptions = async () => {
    setIsLoadingSubs(true);
    try {
      const res = await fetch('/api/admin/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (e) {
      console.error('Failed to load subscriptions:', e);
    } finally {
      setIsLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const notifyAdmin = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 3500);
  };

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

  const handleRenewSubscription = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'renew' }),
      });
      if (res.ok) {
        notifyAdmin('Assinatura renovada por +365 dias com sucesso!');
        fetchSubscriptions();
      }
    } catch (e) {
      console.error(e);
      notifyAdmin('Erro ao renovar assinatura.');
    }
  };

  const handleToggleSubscriptionStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        notifyAdmin(`Status alterado para: ${nextStatus === 'active' ? 'Ativo' : 'Suspenso'}`);
        fetchSubscriptions();
      }
    } catch (e) {
      console.error(e);
      notifyAdmin('Erro ao atualizar status da assinatura.');
    }
  };

  const handleCreateManualCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim() || !manualEmail.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: manualEmail.trim(),
          customerName: manualName.trim() || manualEmail.split('@')[0],
          paymentMethod: manualPaymentMethod,
          pricePaid: manualPrice,
        }),
      });

      if (res.ok) {
        notifyAdmin(`Cliente ${manualEmail} cadastrado com plano anual (365 dias)!`);
        setIsAddCustomerModalOpen(false);
        setManualEmail('');
        setManualName('');
        fetchSubscriptions();
      }
    } catch (e) {
      console.error(e);
      notifyAdmin('Erro ao cadastrar cliente.');
    }
  };

  const handleTestWebhookTrigger = async () => {
    if (!testWebhookEmail.trim()) return;
    setIsTestingWebhook(true);
    try {
      const res = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testWebhookEmail.trim(),
          customer_name: testWebhookEmail.split('@')[0],
          transaction_id: `TEST-WH-${Date.now()}`,
          payment_method: 'InfinitePay',
          amount: 297.0,
        }),
      });
      if (res.ok) {
        notifyAdmin(`Webhook processado com sucesso! Assinatura de 365 dias ativada para ${testWebhookEmail}`);
        fetchSubscriptions();
      }
    } catch (e) {
      console.error(e);
      notifyAdmin('Falha ao disparar webhook de teste.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const getDaysRemaining = (expiresAtStr: string) => {
    const now = new Date();
    const expires = new Date(expiresAtStr);
    const diff = expires.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesEmail =
      sub.email.toLowerCase().includes(subSearch.toLowerCase()) ||
      (sub.customerName && sub.customerName.toLowerCase().includes(subSearch.toLowerCase()));
    if (!matchesEmail) return false;
    if (subStatusFilter === 'all') return true;
    return sub.status === subStatusFilter;
  });

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

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Adicionar Novo Cliente Manualmente</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Material (PDF)</span>
          </button>
        </div>
      </div>

      {/* Admin Notification Toast */}
      {adminNotification && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 text-white text-xs font-semibold border border-amber-500/40 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminNotification}</span>
        </div>
      )}

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
            R$ {(metrics.totalRevenue + subscriptions.length * 297).toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinaturas Ativas</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {subscriptions.filter((s) => s.status === 'active').length} ativas
          </div>
          <span className="text-[11px] text-purple-700 font-semibold">
            Pacote Anual Exclusivo (365 dias)
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
            R$ 297,00
          </div>
          <span className="text-[11px] text-slate-500">
            Plano Anual Ministerial
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendas de Catálogo</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {metrics.totalSales} pedidos
          </div>
          <span className="text-[11px] text-slate-500">
            E-books e Revistas EBD
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('subscriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            adminTab === 'subscriptions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Gestão de Assinaturas ({subscriptions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Catálogo de PDFs ({products.length})
        </button>

        <button
          onClick={() => setAdminTab('add_pdf')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Relatório de Vendas ({orders.length})
        </button>

        <button
          onClick={() => setAdminTab('gateway')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            adminTab === 'gateway'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Pix / InfinitePay & Webhook</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Níveis de Acesso
        </button>
      </div>

      {/* TAB: SUBSCRIPTIONS MANAGEMENT (CUSTOMER TABLE) */}
      {adminTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Assinantes Cadastrados (Plano Anual Exclusivo)
              </h3>
              <p className="text-xs text-slate-500">
                Acesso por e-mail com ciclo de 365 dias. Controle de status, renovações manuais e monitoramento de expiração.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchSubscriptions}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Atualizar lista"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSubs ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>

              <button
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Cliente Manual</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Buscar por e-mail ou nome..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
              {(['all', 'active', 'suspended', 'expired'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSubStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                    subStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st === 'active' ? 'Ativos' : st === 'suspended' ? 'Suspensos' : 'Expirados'}
                </button>
              ))}
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Cliente (E-mail)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Expiração (365 Dias)</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4 text-right">Controles Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.map((sub) => {
                  const daysLeft = getDaysRemaining(sub.expiresAt);
                  const isSuspended = sub.status === 'suspended';
                  const isExpired = sub.status === 'expired' || daysLeft === 0;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <strong className="text-slate-900 block font-semibold">
                          {sub.customerName || sub.email.split('@')[0]}
                        </strong>
                        <span className="font-mono text-xs text-slate-500">{sub.email}</span>
                      </td>

                      <td className="p-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" /> Suspenso
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <XCircle className="w-3 h-3" /> Expirado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Ativo
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="font-mono text-xs text-slate-800">
                          {new Date(sub.expiresAt).toLocaleDateString('pt-BR')}
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${
                            daysLeft < 30 ? 'text-amber-600' : 'text-slate-500'
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Período expirado'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {sub.paymentMethod === 'PIX' ? (
                            <QrCode className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <CreditCard className="w-3 h-3 text-indigo-600" />
                          )}
                          {sub.paymentMethod || 'PIX'}
                        </span>
                        {sub.transactionId && (
                          <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                            {sub.transactionId}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-900">
                        R$ {Number(sub.pricePaid).toFixed(2)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRenewSubscription(sub.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Estender por +365 dias"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Renovar (+1 Ano)</span>
                          </button>

                          <button
                            onClick={() => handleToggleSubscriptionStatus(sub.id, sub.status)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              sub.status === 'active'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                            }`}
                            title={sub.status === 'active' ? 'Suspender acesso' : 'Reativar acesso'}
                          >
                            {sub.status === 'active' ? 'Suspender' : 'Reativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: GATEWAY PIX / INFINITEPAY & WEBHOOK CONFIG */}
      {adminTab === 'gateway' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-200">
                <QrCode className="w-3.5 h-3.5 text-amber-600" /> Módulo de Pagamentos e Gateway
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Integração Pix & InfinitePay (Plano Anual R$ 297,00)
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Configure as credenciais e parâmetros de recebimento para o Pacote Anual exclusivo. Ativações ocorrem de forma imediata via Webhook.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pix Configuration */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-serif">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Configuração Chave Pix</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Chave Pix Oficial (E-mail / CNPJ)
                  </label>
                  <input
                    type="text"
                    defaultValue="financeiro@iatheos.pro"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nome do Beneficiário
                  </label>
                  <input
                    type="text"
                    defaultValue="IATheos Pro Tecnologias Ministeriais Ltda"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
                  ✓ Qr Code dinâmico ativado com validação automática via webhook.
                </div>
              </div>

              {/* InfinitePay Configuration */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-serif">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Configuração InfinitePay (Cartão de Crédito)</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Link de Checkout InfinitePay
                  </label>
                  <input
                    type="text"
                    defaultValue="https://infinitepay.io/iatheos-anual-297"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Condição Parcelada
                  </label>
                  <input
                    type="text"
                    defaultValue="12x de R$ 29,90 sem juros"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 font-medium">
                  ✓ Integração direta com split de pagamento e aprovação instantânea.
                </div>
              </div>
            </div>

            {/* Webhook Endpoint Documentation & Live Tester */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm font-serif text-amber-200">
                    Webhook de Ativação Automática de Assinatura (365 Dias)
                  </h4>
                </div>
                <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  HTTP POST 200 OK
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Endpoint no Servidor:</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 select-all flex items-center justify-between">
                  <span>POST /api/webhooks/payment</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('/api/webhooks/payment');
                      notifyAdmin('URL do Webhook copiada!');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Exemplo de Payload JSON (InfinitePay / Pix):</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`{
  "email": "pastor.exemplo@igreja.com.br",
  "customer_name": "Pr. Exemplo",
  "payment_method": "InfinitePay",
  "amount": 297.00,
  "transaction_id": "INF-2026-9812",
  "event": "payment.succeeded"
}`}
                </pre>
              </div>

              {/* Live Webhook Tester */}
              <div className="pt-2 border-t border-slate-800">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Testador de Webhook em Tempo Real
                </h5>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={testWebhookEmail}
                    onChange={(e) => setTestWebhookEmail(e.target.value)}
                    placeholder="E-mail para teste de ativação..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleTestWebhookTrigger}
                    disabled={isTestingWebhook}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isTestingWebhook ? 'Enviando...' : 'Simular Disparo de Webhook'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal to Add New Customer Manually (365 Days Access) */}
      {isAddCustomerModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-slate-900">
                    Adicionar Cliente Manualmente
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Ativação do Pacote Anual (365 dias)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualCustomer} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  E-mail do Cliente *
                </label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="ex: pastor.titular@igreja.com.br"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="ex: Pr. João da Silva"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  >
                    <option value="PIX">PIX</option>
                    <option value="InfinitePay">InfinitePay</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Cortesia Ministerial">Cortesia Ministerial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Cobrado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Benefícios Aplicados Automaticamente:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-emerald-700 space-y-0.5">
                  <li>365 dias de acesso ativo a partir de hoje</li>
                  <li>Acesso sem senhas complexas via e-mail na Área do Cliente</li>
                  <li>Sincronização imediata no Cloud SQL & Firestore</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Ativar Acesso Anual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

