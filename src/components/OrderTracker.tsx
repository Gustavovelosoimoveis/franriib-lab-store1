import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, Loader2, Package, Printer, Sparkles, CheckCircle2, Truck, Bell, Mail, Info, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderTrackerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  defaultTrackingId?: string;
}

export default function OrderTracker({ orders, onUpdateOrderStatus, defaultTrackingId = '' }: OrderTrackerProps) {
  const [trackingId, setTrackingId] = useState(defaultTrackingId);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');
  const [liveLayerPercent, setLiveLayerPercent] = useState(0);

  // Automatically load default tracking ID if supplied
  useEffect(() => {
    if (defaultTrackingId) {
      const ord = orders.find(o => o.id.toLowerCase() === defaultTrackingId.toLowerCase());
      if (ord) {
        setSelectedOrder(ord);
        setTrackingId(defaultTrackingId);
        setSearchError('');
      }
    }
  }, [defaultTrackingId, orders]);

  // Simulate 3D printing layer build-up when order status is 'printing'
  useEffect(() => {
    if (!selectedOrder || selectedOrder.status !== 'printing') {
      setLiveLayerPercent(0);
      return;
    }

    const interval = setInterval(() => {
      setLiveLayerPercent((prev) => {
        if (prev >= 100) return 0; // loop
        return prev + 1.5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [selectedOrder?.status, selectedOrder?.id]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const ord = orders.find(o => o.id.toLowerCase() === trackingId.trim().toLowerCase());
    if (ord) {
      setSelectedOrder(ord);
      setSearchError('');
    } else {
      setSelectedOrder(null);
      setSearchError('Pedido não encontrado. Verifique se o código está correto (Ex: FR-3D-XXXXX).');
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 'Pedido Recebido';
      case 'printing': return 'Imprimindo em 3D';
      case 'finishing': return 'Acabamento & Cura';
      case 'shipped': return 'Enviado / Em Trânsito';
      case 'delivered': return 'Entregue';
    }
  };

  // Simulated Email template to show the "automatic notifications for shipping status"
  const renderEmailNotification = (order: Order) => {
    return (
      <div className="bg-white border border-[#E9E3D9] rounded-xl shadow-sm overflow-hidden" id="email-notification-card">
        <div className="bg-[#FAF6F0] p-3.5 border-b border-[#E9E3D9] flex items-center gap-2 text-xs font-mono text-gray-500">
          <Mail className="w-4 h-4 text-[#D48C8C]" />
          <span>Notificação de Status Automática enviada para:</span>
          <span className="font-semibold text-[#2E3A46]">{order.customerEmail}</span>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="border border-[#FAF6F0] bg-[#FAF6F0]/20 p-4 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono tracking-wider text-[#D48C8C] uppercase font-bold">FRANRIIB LAB • ATUALIZAÇÃO DO PEDIDO</span>
            <h4 className="text-sm font-sans font-semibold text-[#2E3A46]">
              {order.status === 'received' && '⚡ Seu pedido de design 3D foi faturado e está na fila!'}
              {order.status === 'printing' && '🤖 Notícias do Laboratório: Iniciamos a impressão 3D de suas peças!'}
              {order.status === 'finishing' && '✨ Quase lá! Seu objeto 3D está em fase de acabamento manual.'}
              {order.status === 'shipped' && '📦 Boas notícias! Seu pedido da Franriib Lab foi enviado.'}
              {order.status === 'delivered' && '🎉 Oba! Seu produto de design 3D foi entregue com sucesso.'}
            </h4>
            <p className="text-xs text-gray-500 font-sans leading-relaxed pt-1">
              Olá, <strong>{order.customerName}</strong>! Nosso sistema gerou uma atualização automática para o seu pedido de rastreio <strong className="font-mono text-[#D48C8C]">{order.id}</strong>.
            </p>
          </div>

          <div className="text-xs text-gray-600 font-sans space-y-2">
            <p>
              {order.status === 'received' && 'Seu pagamento foi confirmado com sucesso. Nossos técnicos já selecionaram os filamentos PLA biodegradáveis correspondentes às suas cores customizadas para preparar a mesa de impressão.'}
              {order.status === 'printing' && `As impressoras da Franriib Lab já estão aquecidas a 210°C! Seu produto está sendo fundido camada por camada com altura ultra-fina de 0.16mm. Acompanhe a extrusora em tempo real no nosso site.`}
              {order.status === 'finishing' && 'A impressão 3D foi concluída com êxito! Neste exato momento, nossa equipe está removendo manualmente os suportes estruturais, lixando tolerâncias e checando a rigidez estrutural dos encaixes coloridos.'}
              {order.status === 'shipped' && 'Seu pacote de design foi embalado com plástico bolha protetor e entregue aos correios/transportadora. Em breve, a transportadora atualizará o mapa de entrega no seu bairro.'}
              {order.status === 'delivered' && 'Esperamos que você ame as peças! O design 3D que ganhou forma foi entregue no seu endereço de cadastro. Se puder, tire uma foto e nos marque no Instagram @franriib.lab! ❤️'}
            </p>
            {order.status === 'shipped' && (
              <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[11px] font-mono text-indigo-700">
                Código de Envio dos Correios: <strong>FR3D8210398BR</strong>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#FAF6F0] text-[10px] text-gray-400 font-mono">
            <span>Franriib Lab Atendimento</span>
            <span>https://franriiblab.com.br</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="order-tracker-container">
      {/* Tracker Intro */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-block px-3 py-1 bg-[#8A9BB4]/10 text-[#8A9BB4] border border-[#8A9BB4]/20 text-[10px] font-mono uppercase tracking-widest rounded-full">
          Rastreamento Inteligente de Peças
        </span>
        <h2 className="text-2xl font-sans font-medium text-[#2E3A46] tracking-tight">Status de Envio & Produção 3D</h2>
        <p className="text-xs text-gray-500 font-sans">
          Veja em qual fase de fatiamento, impressão PLA ou trânsito seu pedido customizado se encontra em tempo real.
        </p>
      </div>

      {/* Tracker Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="flex gap-2 bg-white p-2 border border-[#E9E3D9] rounded-2xl shadow-sm">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Digite o código (Ex: FR-3D-9827103)..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-transparent text-xs text-[#2E3A46] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            id="btn-search-tracking"
            className="px-4 py-2 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </div>
        {searchError && (
          <p className="text-xs text-rose-500 font-sans mt-2 text-center">{searchError}</p>
        )}
      </form>

      {/* Selected Order Details */}
      <AnimatePresence mode="wait">
        {selectedOrder ? (
          <motion.div
            key={selectedOrder.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
            id={`tracking-detail-${selectedOrder.id}`}
          >
            {/* Summary Top Card */}
            <div className="bg-white border border-[#E9E3D9] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E9A86] font-semibold">Código do Pedido</span>
                <h3 className="text-lg font-mono font-bold text-[#D48C8C]">{selectedOrder.id}</h3>
                <p className="text-xs text-gray-500 font-sans">
                  Faturado em: {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="space-y-1 md:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Status de Impressão</span>
                <span className="inline-block px-3 py-1 bg-[#2E3A46] text-white border border-[#2E3A46] text-xs font-mono uppercase tracking-wider rounded-lg shadow-sm">
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
            </div>

            {/* Visual Stepper Progress Bar */}
            <div className="bg-white border border-[#E9E3D9] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                {/* Connector line for desktop */}
                <div className="absolute left-[17px] md:left-6 top-2 md:top-5 bottom-4 md:bottom-auto md:right-6 md:h-1 bg-gray-100 -z-10 flex-1" style={{ width: 'calc(100% - 48px)', height: '2px' }} />

                {/* Progress bar fill */}
                <div 
                  className="absolute left-[17px] md:left-6 top-2 md:top-5 bottom-4 md:bottom-auto -z-10 bg-[#D48C8C] transition-all duration-1000 hidden md:block" 
                  style={{ 
                    width: 
                      selectedOrder.status === 'received' ? '0%' :
                      selectedOrder.status === 'printing' ? '25%' :
                      selectedOrder.status === 'finishing' ? '50%' :
                      selectedOrder.status === 'shipped' ? '75%' : '100%',
                    height: '2px'
                  }} 
                />

                {/* Step 1: Received */}
                <div className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                    ['received', 'printing', 'finishing', 'shipped', 'delivered'].includes(selectedOrder.status)
                      ? 'bg-[#2E3A46] border-[#2E3A46] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2E3A46] font-sans">Pedido Pago</h4>
                    <span className="text-[9px] text-gray-400 font-mono block">Mesa de fatiamento</span>
                  </div>
                </div>

                {/* Step 2: Printing */}
                <div className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                    ['printing', 'finishing', 'shipped', 'delivered'].includes(selectedOrder.status)
                      ? 'bg-[#2E3A46] border-[#2E3A46] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2E3A46] font-sans">Impressão 3D</h4>
                    <span className="text-[9px] text-gray-400 font-mono block">Fusão de PLA</span>
                  </div>
                </div>

                {/* Step 3: Finishing */}
                <div className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                    ['finishing', 'shipped', 'delivered'].includes(selectedOrder.status)
                      ? 'bg-[#2E3A46] border-[#2E3A46] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2E3A46] font-sans">Acabamento</h4>
                    <span className="text-[9px] text-gray-400 font-mono block">Remoção de suporte</span>
                  </div>
                </div>

                {/* Step 4: Shipped */}
                <div className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                    ['shipped', 'delivered'].includes(selectedOrder.status)
                      ? 'bg-[#2E3A46] border-[#2E3A46] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2E3A46] font-sans">Enviado</h4>
                    <span className="text-[9px] text-gray-400 font-mono block">Transportadora</span>
                  </div>
                </div>

                {/* Step 5: Delivered */}
                <div className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                    selectedOrder.status === 'delivered'
                      ? 'bg-[#8E9A86] border-[#8E9A86] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2E3A46] font-sans">Entregue</h4>
                    <span className="text-[9px] text-gray-400 font-mono block">Em suas mãos</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Layout details: Printer Simulator on left, Auto-Email notifications on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* PRINT SHAPER / STATUS SIMULATOR */}
              <div className="bg-[#2E3A46] text-white rounded-2xl p-6 space-y-6 flex flex-col justify-between" id="visual-shaper-animator">
                <div>
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#D48C8C]" />
                    <h4 className="font-sans font-medium text-sm">Visualizador da Câmara de Impressão</h4>
                  </div>
                  <p className="text-xs text-gray-300 font-sans mt-1">Simulador dinâmico de produção da Franriib Lab</p>
                </div>

                {/* 3D Printer interactive drawing camera */}
                <div className="h-56 bg-[#1A232D] rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
                  {selectedOrder.status === 'printing' ? (
                    <div className="w-full h-full flex flex-col justify-between items-center relative">
                      {/* Simulated Extruder nozzle bar */}
                      <div className="absolute w-full h-0.5 bg-gray-400/30 top-1/2 left-0 z-10" style={{ transform: `translateY(${Math.sin(liveLayerPercent * 0.1) * 30}px)` }}>
                        {/* Nozzle head moving left/right */}
                        <div 
                          className="w-4 h-4 bg-gray-400 rounded-t border border-gray-500 absolute -top-2 flex items-center justify-center"
                          style={{ 
                            left: `${50 + Math.cos(liveLayerPercent * 0.2) * 45}%`,
                          }}
                        >
                          {/* Extrusion tip and melting visual spark */}
                          <div className="w-1 h-2 bg-yellow-400 animate-ping rounded-full absolute -bottom-1" />
                        </div>
                      </div>

                      {/* Stacked layers build-up */}
                      <div className="absolute bottom-6 w-44 bg-[#1A232D] border-b border-gray-700/50 flex flex-col justify-end gap-0.5">
                        {/* Layer bars */}
                        <div className="text-[9px] text-center font-mono text-gray-400 uppercase tracking-widest mb-1.5 animate-pulse">
                          Fatiando PLA: {Math.round(liveLayerPercent)}%
                        </div>
                        <div className="w-full bg-[#D48C8C]/80 h-3 rounded-lg transition-all" style={{ height: `${liveLayerPercent * 0.8}px` }} />
                      </div>

                      <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
                        <span>Franriib printer #04 - Ativa</span>
                      </div>
                      
                      <div className="absolute top-2 right-3 text-[10px] font-mono text-gray-400">
                        <span>PLA 210°C • Mesa 60°C</span>
                      </div>
                    </div>
                  ) : selectedOrder.status === 'received' ? (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-10 h-10 bg-[#3A4958] rounded-full flex items-center justify-center mx-auto text-gray-400 border border-white/5">
                        <Package className="w-5 h-5" />
                      </div>
                      <h5 className="font-sans text-sm font-medium text-white">Na fila de Impressão</h5>
                      <p className="text-xs text-gray-400 font-sans max-w-xs leading-normal">
                        O pagamento foi aceito. O modelo 3D digital está sendo fatiado e carregado na fila de produção da próxima impressora disponível.
                      </p>
                    </div>
                  ) : selectedOrder.status === 'finishing' ? (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-10 h-10 bg-[#3A4958] rounded-full flex items-center justify-center mx-auto text-amber-400 border border-white/5 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h5 className="font-sans text-sm font-medium text-white">Fase de Acabamento & Suportes</h5>
                      <p className="text-xs text-gray-400 font-sans max-w-xs leading-normal">
                        O objeto foi impresso! Nossos artesãos estão removendo as rebarbas de filamento e lixando conexões para montagem final.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h5 className="font-sans text-sm font-medium text-white">Produção Concluída</h5>
                      <p className="text-xs text-gray-400 font-sans max-w-xs leading-normal">
                        Peças prontas e higienizadas. O lote físico correspondente à sua customização saiu das impressoras do Franriib Lab.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-[#8A9BB4] border-t border-white/10 pt-4">
                  <span>Filamento: Biodegradável PLA</span>
                  <span className="flex items-center gap-1">Suas Cores: 
                    <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/30" style={{ backgroundColor: selectedOrder.items[0]?.customColors.primary }} />
                    <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/30" style={{ backgroundColor: selectedOrder.items[0]?.customColors.secondary }} />
                    <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/30" style={{ backgroundColor: selectedOrder.items[0]?.customColors.tertiary }} />
                  </span>
                </div>
              </div>

              {/* AUTOMATIC NOTIFICATION EMAIL RENDERER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span className="flex items-center gap-1"><Bell className="w-4 h-4 text-[#D48C8C]" /> Histórico de Alertas Gerados</span>
                  <span>E-mail & WhatsApp Logs</span>
                </div>

                {renderEmailNotification(selectedOrder)}
              </div>

            </div>

            {/* Tracking logs details */}
            <div className="bg-white border border-[#E9E3D9] rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-sans font-medium text-sm text-[#2E3A46]">Histórico Detalhado do Pedido</h4>
              <div className="space-y-4 relative pl-4 border-l border-gray-100">
                <div className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8E9A86] border-2 border-white shadow-sm" />
                  <p className="text-xs font-semibold text-[#2E3A46] font-sans">
                    {selectedOrder.status === 'delivered' ? 'Objeto Entregue' : 'Pedido em Produção/Envio'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">Status Atualizado automaticamente por webhook</p>
                </div>
                <div className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8A9BB4] border-2 border-white shadow-sm" />
                  <p className="text-xs font-semibold text-gray-600 font-sans">Triagem e Fatiamento 3D Concluído</p>
                  <p className="text-[10px] text-gray-400 font-mono">G-code enviado com sucesso para barramento local de impressoras</p>
                </div>
                <div className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white shadow-sm" />
                  <p className="text-xs font-semibold text-gray-500 font-sans">Pagamento Confirmado</p>
                  <p className="text-[10px] text-gray-400 font-mono">Simulação de Pix / Autenticação de Cartão de Crédito aprovada de imediato</p>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="p-12 border-2 border-dashed border-[#E9E3D9] rounded-2xl text-center space-y-4 bg-white">
            <Package className="w-12 h-12 mx-auto text-gray-300" />
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="font-sans font-semibold text-sm text-[#2E3A46]">Nenhum pedido selecionado</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Digite um código de rastreamento no campo acima (como por exemplo o código gerado após finalizar sua compra) para visualizar seu pedido sendo manufaturado em tempo real!
              </p>
            </div>
            
            {orders.length > 0 && (
              <div className="pt-4 border-t border-[#FAF6F0] max-w-sm mx-auto">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">Pedidos de Teste Disponíveis:</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setSelectedOrder(o);
                        setTrackingId(o.id);
                      }}
                      id={`btn-track-fast-${o.id}`}
                      className="px-2.5 py-1 bg-[#FAF6F0] hover:bg-[#D48C8C]/10 text-xs font-mono text-[#2E3A46] border border-[#E9E3D9] rounded-lg transition-colors cursor-pointer"
                    >
                      {o.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
