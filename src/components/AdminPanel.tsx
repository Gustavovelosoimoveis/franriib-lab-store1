import React, { useState, useEffect } from 'react';
import { 
  Order, BlogPost, FilamentStock, SEOMetadata, OrderStatus, StoreNotification 
} from '../types';
import { 
  COLOR_PALETTE, INITIAL_FILAMENT_STOCK 
} from '../data/initialData';
import { 
  LayoutDashboard, ShoppingBag, Layers, Search, Plus, Save, 
  Settings, RefreshCw, CheckCircle2, Truck, Wrench, Play, Trash2, 
  BarChart3, Globe, Sparkles, BookOpen, User, Check, AlertTriangle, ArrowUpRight
} from 'lucide-react';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  blogPosts: BlogPost[];
  onAddBlogPost: (post: BlogPost) => void;
  onDeleteBlogPost: (id: string) => void;
  filamentStock: FilamentStock[];
  onUpdateFilamentStock: (stock: FilamentStock[]) => void;
  seoMetadata: SEOMetadata;
  onUpdateSEO: (seo: SEOMetadata) => void;
}

export default function AdminPanel({
  orders,
  onUpdateOrderStatus,
  blogPosts,
  onAddBlogPost,
  onDeleteBlogPost,
  filamentStock,
  onUpdateFilamentStock,
  seoMetadata,
  onUpdateSEO,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'seo' | 'blog'>('dashboard');
  
  // Instagram Integration Settings State
  const [instagramHandle, setInstagramHandle] = useState(() => {
    return localStorage.getItem('franriib_instagram_handle') || 'franriib.lab';
  });
  const [instagramUrl, setInstagramUrl] = useState(() => {
    return localStorage.getItem('franriib_instagram_url') || 'https://www.instagram.com/franriib.lab';
  });

  const handleSaveInstagram = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('franriib_instagram_handle', instagramHandle);
    localStorage.setItem('franriib_instagram_url', instagramUrl);
    alert('Configurações do Instagram atualizadas com sucesso! Os links do blog agora direcionam seus clientes para lá.');
  };

  // SEO Form State
  const [seoForm, setSeoForm] = useState<SEOMetadata>(seoMetadata);
  const [seoScore, setSeoScore] = useState(85);

  // Filament editing / refill State
  const [refillingSpoolId, setRefillingSpoolId] = useState<string | null>(null);

  // Search filter for orders
  const [orderSearch, setOrderSearch] = useState('');

  // Notifications Simulation for low stock / new actions
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);

  useEffect(() => {
    // Generate low stock alerts based on filament level
    const alerts: StoreNotification[] = [];
    filamentStock.forEach(f => {
      if (f.gramsRemaining < 400) {
        alerts.push({
          id: `low-${f.id}`,
          orderId: '',
          title: `Estoque Baixo: ${f.colorName}`,
          message: `O carretel de PLA ${f.colorName} está abaixo de 400g (${f.gramsRemaining}g restantes). Reabasteça logo!`,
          type: 'low_stock',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });
    setNotifications(alerts);
  }, [filamentStock]);

  // Recalculate dynamic SEO Score based on completeness of form
  useEffect(() => {
    let score = 50;
    if (seoForm.title.length > 20 && seoForm.title.length < 70) score += 15;
    if (seoForm.description.length > 50 && seoForm.description.length < 160) score += 15;
    if (seoForm.keywords.split(',').length >= 5) score += 10;
    if (seoForm.googleAnalyticsId.startsWith('G-')) score += 5;
    if (seoForm.sitemapEnabled) score += 5;
    setSeoScore(score);
  }, [seoForm]);

  // Refill Filament Grams
  const handleRefillFilament = (id: string) => {
    const updated = filamentStock.map(f => {
      if (f.id === id) {
        return { ...f, gramsRemaining: f.capacityGrams };
      }
      return f;
    });
    onUpdateFilamentStock(updated);
    setRefillingSpoolId(null);
  };

  // Save SEO Metadata
  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSEO(seoForm);
    alert('Configurações de SEO e Meta-Tags salvas com sucesso!');
  };

  // Calculate stats for Dashboard Tab
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== 'delivered').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  
  // Total filament gram usage estimated based on completed orders
  const estimatedGramsUsed = orders.reduce((sum, o) => {
    // Approx 120g per item
    const itemsCount = o.items.reduce((acc, item) => acc + item.quantity, 0);
    return sum + (itemsCount * 130);
  }, 0);

  // Filter orders by search terms (name, CPF, tracking code)
  const filteredOrders = orders.filter(o => {
    const term = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase().includes(term) ||
      o.customerCPF.includes(term)
    );
  });

  // Simple Helper for Badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono rounded">Recebido</span>;
      case 'printing':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono rounded animate-pulse flex items-center gap-1"><Play className="w-3 h-3 fill-blue-500" /> Imprimindo 3D</span>;
      case 'finishing':
        return <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono rounded flex items-center gap-1"><Wrench className="w-3 h-3" /> Acabamento</span>;
      case 'shipped':
        return <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono rounded flex items-center gap-1"><Truck className="w-3 h-3" /> Enviado</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Entregue</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E9E3D9] shadow-sm overflow-hidden" id="admin-panel-container">
      {/* Admin Title Banner */}
      <div className="bg-[#2E3A46] text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A9BB4]">Painel Administrativo Franriib</span>
          </div>
          <h2 className="text-xl font-sans font-medium tracking-tight mt-1">Franriib Lab Studio Control</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            id="btn-admin-refresh"
            className="p-2 bg-[#3A4958] hover:bg-[#47596B] border border-[#4E6174] text-[#8A9BB4] hover:text-white rounded-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono"
            title="Atualizar Dados"
          >
            <RefreshCw className="w-4 h-4" /> Sync Live
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-64 bg-[#FAF6F0] border-r border-[#E9E3D9] p-4 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            id="tab-admin-dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#2E3A46] text-white' 
                : 'text-[#2E3A46] hover:bg-[#FAF6F0]/80 hover:text-[#D48C8C]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel Geral
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            id="tab-admin-orders"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'orders' 
                ? 'bg-[#2E3A46] text-white' 
                : 'text-[#2E3A46] hover:bg-[#FAF6F0]/80 hover:text-[#D48C8C]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Pedidos e Produção
            {pendingOrders > 0 && (
              <span className="ml-auto bg-[#D48C8C] text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            id="tab-admin-inventory"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'inventory' 
                ? 'bg-[#2E3A46] text-white' 
                : 'text-[#2E3A46] hover:bg-[#FAF6F0]/80 hover:text-[#D48C8C]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Bobinas PLA e Estoque
            {notifications.length > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            id="tab-admin-seo"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'seo' 
                ? 'bg-[#2E3A46] text-white' 
                : 'text-[#2E3A46] hover:bg-[#FAF6F0]/80 hover:text-[#D48C8C]'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO e Tráfego
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            id="tab-admin-blog"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'blog' 
                ? 'bg-[#2E3A46] text-white' 
                : 'text-[#2E3A46] hover:bg-[#FAF6F0]/80 hover:text-[#D48C8C]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Canal Instagram
          </button>

          {/* Mini Brand Rules watermark */}
          <div className="mt-auto pt-8 px-4 text-[10px] text-gray-400 font-sans border-t border-[#E9E3D9]">
            <p className="font-semibold text-gray-500">Filamento PLA de Alta Fusão</p>
            <p className="mt-1">Design 3D autoral que ganha vida.</p>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* TAB 1: PAINEL GERAL (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn" id="admin-tab-dashboard">
              {/* Notifications / Alerts Block */}
              {notifications.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Atenção: Avisos do Franriib Lab 3D</span>
                  </div>
                  <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
                    {notifications.map((n, idx) => (
                      <li key={idx}>{n.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* High-fidelity Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E9E3D9] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Faturamento Bruto</span>
                    <h3 className="text-2xl font-semibold text-[#2E3A46] mt-1">R$ {totalRevenue.toFixed(2)}</h3>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1 font-mono">
                      <ArrowUpRight className="w-3 h-3" /> +15.4% vs ontem
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-[#E9E3D9] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Pedidos Recebidos</span>
                    <h3 className="text-2xl font-semibold text-[#2E3A46] mt-1">{orders.length}</h3>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">{pendingOrders} em produção</span>
                  </div>
                  <div className="w-12 h-12 bg-[#D48C8C]/10 rounded-xl flex items-center justify-center text-[#D48C8C] border border-[#D48C8C]/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-[#E9E3D9] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">PLA Gasto Estimado</span>
                    <h3 className="text-2xl font-semibold text-[#2E3A46] mt-1">{estimatedGramsUsed}g</h3>
                    <span className="text-[10px] text-[#8E9A86] mt-1 font-mono">Biodegradável orgânico</span>
                  </div>
                  <div className="w-12 h-12 bg-[#8E9A86]/10 rounded-xl flex items-center justify-center text-[#8E9A86] border border-[#8E9A86]/20">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-[#E9E3D9] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Artigos do Blog</span>
                    <h3 className="text-2xl font-semibold text-[#2E3A46] mt-1">{blogPosts.length}</h3>
                    <span className="text-[10px] text-[#8A9BB4] mt-1 font-mono">Engajamento com leitores</span>
                  </div>
                  <div className="w-12 h-12 bg-[#8A9BB4]/10 rounded-xl flex items-center justify-center text-[#8A9BB4] border border-[#8A9BB4]/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Custom SVG Graphical Sales Over Time & Traffic source breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* sales over time graph */}
                <div className="bg-white border border-[#E9E3D9] rounded-xl p-6 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-sans font-medium text-[#2E3A46]">Histórico de Vendas Recentes</h4>
                      <p className="text-xs text-gray-400">Rendimento financeiro simulado do Franriib Lab 3D</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 bg-[#FAF6F0] text-[#2E3A46] border border-[#E9E3D9] rounded-md">Últimos 5 dias</span>
                  </div>

                  {/* Render beautiful SVG representation of daily sales */}
                  <div className="relative pt-6">
                    <div className="h-44 w-full flex items-end justify-between gap-2 border-b border-[#E9E3D9] pb-2">
                      {/* Day 1 */}
                      <div className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#2E3A46] transition-all">R$150</span>
                        <div className="w-full bg-[#8A9BB4]/40 hover:bg-[#8A9BB4] rounded-t-md transition-all h-[30%]" />
                        <span className="text-[10px] font-mono text-gray-500">20/06</span>
                      </div>
                      {/* Day 2 */}
                      <div className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#2E3A46] transition-all">R$210</span>
                        <div className="w-full bg-[#8E9A86]/40 hover:bg-[#8E9A86] rounded-t-md transition-all h-[45%]" />
                        <span className="text-[10px] font-mono text-gray-500">21/06</span>
                      </div>
                      {/* Day 3 */}
                      <div className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#2E3A46] transition-all">R$90</span>
                        <div className="w-full bg-[#C68B75]/40 hover:bg-[#C68B75] rounded-t-md transition-all h-[20%]" />
                        <span className="text-[10px] font-mono text-gray-500">22/06</span>
                      </div>
                      {/* Day 4 */}
                      <div className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#2E3A46] transition-all">R$320</span>
                        <div className="w-full bg-[#D48C8C]/60 hover:bg-[#D48C8C] rounded-t-md transition-all h-[70%]" />
                        <span className="text-[10px] font-mono text-gray-500">23/06</span>
                      </div>
                      {/* Day 5 (Today) */}
                      <div className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-gray-900 font-semibold">R$ {totalRevenue > 320 ? totalRevenue.toFixed(0) : '480'}</span>
                        <div className="w-full bg-[#D48C8C] hover:bg-[#D48C8C]/90 rounded-t-md transition-all h-[95%] shadow-sm" />
                        <span className="text-[10px] font-mono text-[#2E3A46] font-semibold">Hoje</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 pt-2 text-[11px] text-gray-500 font-sans">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D48C8C]"></span>Rosa Cetim Vendas</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8E9A86]"></span>Verde Sálvia Vendas</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8A9BB4]"></span>Azul Névoa Vendas</span>
                  </div>
                </div>

                {/* Simulated live traffic sources */}
                <div className="bg-white border border-[#E9E3D9] rounded-xl p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans font-medium text-[#2E3A46]">Origem do Tráfego</h4>
                    <p className="text-xs text-gray-400">Canal de onde vêm os seus clientes</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                        <span>Direto / WhatsApp</span>
                        <span className="font-semibold text-[#2E3A46]">42%</span>
                      </div>
                      <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#D48C8C] h-full rounded-full" style={{ width: '42%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                        <span>Redes Sociais (Instagram/TikTok)</span>
                        <span className="font-semibold text-[#2E3A46]">35%</span>
                      </div>
                      <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#8E9A86] h-full rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                        <span>Busca Orgânica Google (SEO)</span>
                        <span className="font-semibold text-[#2E3A46]">18%</span>
                      </div>
                      <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#8A9BB4] h-full rounded-full" style={{ width: '18%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                        <span>E-mail & Outros</span>
                        <span className="font-semibold text-[#2E3A46]">5%</span>
                      </div>
                      <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#C68B75] h-full rounded-full" style={{ width: '5%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>Pontuação de SEO Atual:</span>
                    <span className="font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100">{seoScore}%</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: GERENCIAMENTO DE PEDIDOS E FILA DE IMPRESSÃO */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn" id="admin-tab-orders">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-sans font-medium text-[#2E3A46]">Pedidos & Fila de Impressão 3D</h3>
                  <p className="text-xs text-gray-400">Controle o status de envio dos produtos customizados</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, CPF ou Código..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-[#FAF6F0] border border-[#E9E3D9] text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-[#E9E3D9] rounded-2xl text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm text-gray-500">Nenhum pedido encontrado com os filtros atuais.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#E9E3D9] rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF6F0] border-b border-[#E9E3D9] text-[#2E3A46] font-mono uppercase tracking-wider">
                        <th className="p-4 font-semibold">Código Tracking</th>
                        <th className="p-4 font-semibold">Cliente / Contato</th>
                        <th className="p-4 font-semibold">Detalhes Customizados</th>
                        <th className="p-4 font-semibold">Valor Total</th>
                        <th className="p-4 font-semibold">Método</th>
                        <th className="p-4 font-semibold">Status de Envio</th>
                        <th className="p-4 font-semibold text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E3D9]">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#FAF6F0]/40 transition-all text-[#2E3A46]">
                          <td className="p-4 font-mono font-bold text-[#D48C8C]">{o.id}</td>
                          <td className="p-4 space-y-1">
                            <p className="font-semibold text-sm">{o.customerName}</p>
                            <p className="text-gray-400 font-mono text-[10px]">{o.customerEmail}</p>
                            <p className="text-gray-400 font-mono text-[10px]">CPF: {o.customerCPF}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{o.address.city} - {o.address.state}, CEP {o.address.cep}</p>
                          </td>
                          <td className="p-4 space-y-2 max-w-[220px]">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="bg-[#FAF6F0] p-2 rounded-lg border border-[#E9E3D9] text-[11px] space-y-1">
                                <span className="font-semibold">{item.productName} ({item.quantity}x)</span>
                                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{ backgroundColor: item.customColors.primary }} />
                                    Base
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{ backgroundColor: item.customColors.secondary }} />
                                    Colar
                                  </span>
                                  <span className="flex items-center gap-1 col-span-2">
                                    <span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{ backgroundColor: item.customColors.tertiary }} />
                                    Lollipop/Corpo
                                  </span>
                                </div>
                                <span className="inline-block px-1 py-0.5 bg-gray-100 text-gray-600 text-[9px] rounded font-mono uppercase">
                                  Tamanho: {item.sizeMultiplier}
                                </span>
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-semibold text-sm">R$ {o.total.toFixed(2)}</td>
                          <td className="p-4">
                            <span className="uppercase font-mono font-semibold px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-[10px]">
                              {o.paymentMethod === 'pix' ? 'Pix ⚡' : 'Cartão 💳'}
                            </span>
                          </td>
                          <td className="p-4">{getStatusBadge(o.status)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {o.status !== 'delivered' ? (
                                <button
                                  onClick={() => {
                                    // advance status sequence
                                    const sequence: OrderStatus[] = ['received', 'printing', 'finishing', 'shipped', 'delivered'];
                                    const currIndex = sequence.indexOf(o.status);
                                    if (currIndex < sequence.length - 1) {
                                      onUpdateOrderStatus(o.id, sequence[currIndex + 1]);
                                    }
                                  }}
                                  id={`btn-advance-status-${o.id}`}
                                  className="px-2.5 py-1 bg-[#2E3A46] text-white hover:bg-[#D48C8C] text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all active:scale-95 flex items-center gap-1"
                                >
                                  Próximo Status
                                </button>
                              ) : (
                                <span className="text-emerald-600 font-bold text-[10px] font-mono flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTROLE DE ESTOQUE DE FILAMENTOS */}
          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-fadeIn" id="admin-tab-inventory">
              <div>
                <h3 className="text-lg font-sans font-medium text-[#2E3A46]">Inventário de Filamentos (Carretéis PLA 1.75mm)</h3>
                <p className="text-xs text-gray-400">Monitore as gramas restantes de plástico biodegradável para impressão 3D</p>
              </div>

              {/* Filament Inventory Spools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filamentStock.map((f) => {
                  const pct = Math.round((f.gramsRemaining / f.capacityGrams) * 100);
                  const isLow = f.gramsRemaining < 400;

                  return (
                    <div 
                      key={f.id} 
                      className={`bg-white border rounded-xl p-5 space-y-4 shadow-sm transition-all ${
                        isLow ? 'border-amber-200 bg-amber-50/20' : 'border-[#E9E3D9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
                            style={{ backgroundColor: f.colorHex }} 
                          />
                          <h4 className="font-sans font-semibold text-[#2E3A46]">{f.colorName}</h4>
                        </div>
                        {isLow && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-semibold rounded-full font-mono">
                            Baixo
                          </span>
                        )}
                      </div>

                      {/* Visual filament loading circle representation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-gray-500">
                          <span>PLA Restante</span>
                          <span>{f.gramsRemaining}g / {f.capacityGrams}g ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLow ? 'bg-amber-500' : pct < 20 ? 'bg-rose-500' : 'bg-[#8E9A86]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
                        <span>Custo PLA: R$ {f.pricePerGram.toFixed(2)}/g</span>
                        
                        {refillingSpoolId === f.id ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleRefillFilament(f.id)}
                              id={`btn-confirm-refill-${f.id}`}
                              className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded font-mono text-[10px]"
                            >
                              +1kg Spool
                            </button>
                            <button
                              onClick={() => setRefillingSpoolId(null)}
                              id={`btn-cancel-refill-${f.id}`}
                              className="px-2 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded font-mono text-[10px]"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRefillingSpoolId(f.id)}
                            id={`btn-refill-${f.id}`}
                            className="px-2.5 py-1 bg-[#FAF6F0] hover:bg-[#D48C8C]/10 hover:text-[#D48C8C] text-[#2E3A46] border border-[#E9E3D9] text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all active:scale-95"
                          >
                            Reabastecer PLA
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SEO E INTEGRAÇÃO DE TRÁFEGO */}
          {activeTab === 'seo' && (
            <div className="space-y-8 animate-fadeIn" id="admin-tab-seo">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-sans font-medium text-[#2E3A46]">Configurações de SEO & Tráfego de Clientes</h3>
                  <p className="text-xs text-gray-400">Customize palavras-chave, metatags de busca e veja simulações de visitas</p>
                </div>

                <div className="flex items-center gap-2 bg-[#8E9A86]/10 px-3 py-1.5 border border-[#8E9A86]/20 rounded-xl text-xs text-[#8E9A86] font-mono">
                  <Globe className="w-4 h-4" />
                  <span>Pontuação Geral SEO: {seoScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to configure meta tags */}
                <form onSubmit={handleSaveSEO} className="lg:col-span-2 space-y-5 bg-white p-6 border border-[#E9E3D9] rounded-xl">
                  <h4 className="font-sans font-medium text-sm text-[#2E3A46] border-b border-[#FAF6F0] pb-2">Metatags de Busca (Google & Social)</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Título SEO da Página</label>
                    <input
                      type="text"
                      value={seoForm.title}
                      onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                      required
                    />
                    <p className="text-[10px] text-gray-400 font-mono">Ideal entre 50 e 60 caracteres. Atual: {seoForm.title.length}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Descrição SEO (Meta Description)</label>
                    <textarea
                      rows={3}
                      value={seoForm.description}
                      onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                      required
                    />
                    <p className="text-[10px] text-gray-400 font-mono">Ideal entre 120 e 160 caracteres. Atual: {seoForm.description.length}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Palavras-Chave (Keywords separadas por vírgula)</label>
                    <input
                      type="text"
                      value={seoForm.keywords}
                      onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                    />
                    <p className="text-[10px] text-gray-400 font-mono">Palavras que ajudam no ranqueamento orgânico.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Google Analytics Tracking ID</label>
                      <input
                        type="text"
                        placeholder="G-XXXXXX"
                        value={seoForm.googleAnalyticsId}
                        onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="chk-sitemap"
                        checked={seoForm.sitemapEnabled}
                        onChange={(e) => setSeoForm({ ...seoForm, sitemapEnabled: e.target.checked })}
                        className="rounded border-[#E9E3D9] text-[#D48C8C] focus:ring-[#D48C8C]"
                      />
                      <label htmlFor="chk-sitemap" className="text-xs font-medium text-gray-600">Habilitar XML Sitemap Automático</label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-save-seo"
                    className="px-4 py-2 bg-[#2E3A46] text-white hover:bg-[#D48C8C] rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Salvar Configurações
                  </button>
                </form>

                {/* Google Search Preview Simulator */}
                <div className="space-y-6">
                  <div className="bg-white p-5 border border-[#E9E3D9] rounded-xl space-y-3">
                    <h4 className="font-sans font-medium text-sm text-[#2E3A46] border-b border-[#FAF6F0] pb-2 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-[#D48C8C]" />
                      Simulador de Busca Google
                    </h4>

                    <div className="bg-[#FAF6F0] p-4 rounded-lg border border-[#E9E3D9] space-y-1.5">
                      <span className="text-xs text-gray-400 font-mono">https://franriiblab.com.br</span>
                      <h5 className="text-blue-800 hover:underline text-sm font-semibold leading-tight line-clamp-1">
                        {seoForm.title || 'Franriib Lab - Design 3D'}
                      </h5>
                      <p className="text-[11px] text-gray-600 leading-normal line-clamp-2">
                        {seoForm.description || 'Preencha a meta description ao lado para simular o resultado do Google.'}
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                      *O Google prioriza títulos de até 60 caracteres e descrições explicativas de até 155 caracteres para evitar truncamento no resultado final.
                    </p>
                  </div>

                  {/* Live traffic simulator statistics */}
                  <div className="bg-[#2E3A46] text-white p-5 rounded-xl space-y-4">
                    <h4 className="font-sans font-medium text-sm border-b border-white/10 pb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Tráfego em Tempo Real
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#3A4958] p-3 rounded-lg text-center">
                        <span className="text-[10px] text-gray-300 font-mono block">Visitantes Hoje</span>
                        <span className="text-xl font-bold font-mono mt-1 block">184</span>
                      </div>
                      <div className="bg-[#3A4958] p-3 rounded-lg text-center">
                        <span className="text-[10px] text-gray-300 font-mono block">Tempo de Sessão</span>
                        <span className="text-xl font-bold font-mono mt-1 block">3m 12s</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#8A9BB4] font-sans flex items-center justify-between">
                      <span>Robô do Google indexado</span>
                      <span className="text-emerald-400 font-bold">Sim (Hoje, 04:12)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INSTAGRAM INTEGRATION */}
          {activeTab === 'blog' && (
            <div className="space-y-8 animate-fadeIn" id="admin-tab-instagram">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-sans font-medium text-[#2E3A46]">Configurações da Integração do Instagram</h3>
                  <p className="text-xs text-gray-400">Personalize o canal de notícias e novidades que redireciona seus clientes para as redes sociais</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to edit Instagram links */}
                <form onSubmit={handleSaveInstagram} className="lg:col-span-2 bg-white p-6 border border-[#E9E3D9] rounded-xl space-y-5">
                  <h4 className="font-sans font-medium text-sm text-[#2E3A46] border-b border-[#FAF6F0] pb-2 flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-[#D48C8C]" />
                    Configurar Perfil do Instagram
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Instagram @Handle (Usuário)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">@</span>
                      <input
                        type="text"
                        placeholder="Ex: franriib.lab"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value.replace('@', '').trim())}
                        className="w-full pl-7 pr-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46] font-mono"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">Este nome de usuário será exibido na página de novidades da loja.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">URL Completa do Perfil</label>
                    <input
                      type="url"
                      placeholder="Ex: https://www.instagram.com/franriib.lab"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value.trim())}
                      className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46] font-mono"
                      required
                    />
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">O link para onde o usuário será redirecionado ao clicar em "Seguir no Instagram".</span>
                  </div>

                  <button
                    type="submit"
                    id="btn-save-instagram-settings"
                    className="px-5 py-2.5 bg-[#2E3A46] text-white hover:bg-[#D48C8C] rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Save className="w-4 h-4" /> Salvar Configurações
                  </button>
                </form>

                {/* Helpful guides block */}
                <div className="bg-[#FAF6F0] p-5 border border-[#E9E3D9] rounded-xl space-y-4 text-left">
                  <h4 className="font-sans font-medium text-sm text-[#2E3A46] border-b border-[#E9E3D9] pb-2">Como Funciona?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    Como as suas novidades são gerenciadas diretamente no Instagram, nós unificamos a aba <strong>Blog Novidades</strong> do site de forma automatizada.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    Ao alterar o link aqui, todos os botões de ação na aba principal do site, rodapé e as tags de redirectionamento do feed passarão a encaminhar seus usuários para o novo perfil automaticamente.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-[#E9E3D9]/60 text-[10px] font-mono text-gray-500 leading-normal flex items-start gap-2">
                    <span className="text-[#FFD43A] text-lg leading-none">★</span>
                    <span>
                      Dica: Publique fotos de alta qualidade com as hashtags da marca para aumentar o engajamento direto pelo site!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
