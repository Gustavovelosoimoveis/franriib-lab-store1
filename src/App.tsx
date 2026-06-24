import React, { useState, useEffect } from 'react';
import { 
  Product3D, CartItem, Order, BlogPost, FilamentStock, SEOMetadata, OrderStatus, CustomizationColors 
} from './types';
import { 
  INITIAL_PRODUCTS, COLOR_PALETTE, INITIAL_FILAMENT_STOCK, INITIAL_BLOG_POSTS, DEFAULT_SEO_METADATA 
} from './data/initialData';
import ThreeDViewer from './components/ThreeDViewer';
import AdminPanel from './components/AdminPanel';
import BlogSection from './components/BlogSection';
import ChatWidget from './components/ChatWidget';
import OrderTracker from './components/OrderTracker';
import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import { 
  ShoppingBag, Trash2, ShieldCheck, CreditCard, ChevronRight, Check, X,
  Sparkles, Layers, Info, CheckCircle2, User, HelpCircle, Loader2, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- CORE STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [currentTab, setCurrentTab] = useState<'catalog' | 'tracking' | 'blog' | 'admin'>('catalog');
  
  const [products] = useState<Product3D[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product3D>(INITIAL_PRODUCTS[0]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('franriib_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('franriib_orders');
    if (saved) return JSON.parse(saved);
    
    // Seed initial mock order for the user so they see the system working instantly
    const initialOrder: Order = {
      id: 'FR-3D-98124',
      customerName: 'Guilherme André',
      customerEmail: 'guguandre100@gmail.com',
      customerPhone: '(11) 99876-5432',
      customerCPF: '123.456.789-00',
      address: {
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        cep: '01310-100',
      },
      items: [
        {
          productId: 'lollipop-holder',
          productName: 'Porta-Caneta Pirulito Nuvem',
          customColors: {
            primary: '#5DBDF6',   // Azul Nuvem
            secondary: '#FFD43A', // Amarelo Flor
            tertiary: '#FF4D8D',  // Rosa Pirulito
            stick: '#FAF6F0'      // Cream
          },
          quantity: 1,
          sizeMultiplier: 'standard',
          price: 49.90
        }
      ],
      paymentMethod: 'pix',
      paymentDetails: { pixCode: '00020101021126580014br.gov.bcb.pix0136' },
      status: 'printing', // Initial state for seed order
      subtotal: 49.90,
      shippingCost: 0, // Free above 150 or flat
      total: 49.90,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      updatedAt: new Date().toISOString(),
      history: [
        { status: 'received', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), note: 'Pedido recebido e confirmado.' },
        { status: 'printing', timestamp: new Date().toISOString(), note: 'Iniciada a extrusão das camadas em filamento PLA.' }
      ]
    };
    return [initialOrder];
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('franriib_blog');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [filamentStock, setFilamentStock] = useState<FilamentStock[]>(() => {
    const saved = localStorage.getItem('franriib_filaments');
    return saved ? JSON.parse(saved) : INITIAL_FILAMENT_STOCK;
  });

  const [seoMetadata, setSeoMetadata] = useState<SEOMetadata>(() => {
    const saved = localStorage.getItem('franriib_seo');
    return saved ? JSON.parse(saved) : DEFAULT_SEO_METADATA;
  });

  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(() => {
    const saved = localStorage.getItem('franriib_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- UI ACTIONS & MODALS ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'payment'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [selectedTrackingId, setSelectedTrackingId] = useState('');

  // --- BUILD CUSTOMIZER STATE ---
  const [customColors, setCustomColors] = useState<CustomizationColors>({
    primary: '#5DBDF6',   // Default Cyan
    secondary: '#FFD43A', // Default Yellow
    tertiary: '#FF4D8D',  // Default Pink
    stick: '#FAF6F0'      // Default Stick/White
  });
  const [selectedSize, setSelectedSize] = useState<'standard' | 'large' | 'mini'>('standard');
  const [customQuantity, setCustomQuantity] = useState(1);

  // --- CHECKOUT FORM STATE ---
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  // Credit Card Form State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  // Pix Clearance simulation timer
  const [pixTimeRemaining, setPixTimeRemaining] = useState(600);
  const [simulatedPixPaid, setSimulatedPixPaid] = useState(false);
  const [activeCreatedOrderId, setActiveCreatedOrderId] = useState<string | null>(null);

  // --- EFFECTS FOR PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('franriib_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('franriib_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('franriib_blog', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('franriib_filaments', JSON.stringify(filamentStock));
  }, [filamentStock]);

  useEffect(() => {
    localStorage.setItem('franriib_seo', JSON.stringify(seoMetadata));
  }, [seoMetadata]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('franriib_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('franriib_user');
    }
  }, [user]);

  // Sync Checkout Form when user logs in
  useEffect(() => {
    if (user) {
      setCheckoutForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // Simulated auto-update shipping status loop for newly created orders
  useEffect(() => {
    const activeOrder = orders.find(o => o.id === activeCreatedOrderId);
    if (!activeOrder || activeOrder.status === 'delivered') return;

    // Fast-forward simulation schedule:
    // Received -> Printing (15s) -> Finishing (40s) -> Shipped (80s) -> Delivered (150s)
    const timer = setTimeout(() => {
      let nextStatus: OrderStatus | null = null;
      if (activeOrder.status === 'received') nextStatus = 'printing';
      else if (activeOrder.status === 'printing') nextStatus = 'finishing';
      else if (activeOrder.status === 'finishing') nextStatus = 'shipped';
      else if (activeOrder.status === 'shipped') nextStatus = 'delivered';

      if (nextStatus) {
        handleUpdateOrderStatus(activeOrder.id, nextStatus);
        // Show simulated push/email notification alert
        alert(`📬 Notificação Automática: Pedido ${activeOrder.id} avançou para [${nextStatus.toUpperCase()}]! E-mail de atualização enviado.`);
      }
    }, 20000); // Check and advance status every 20 seconds for demo pacing!

    return () => clearTimeout(timer);
  }, [orders, activeCreatedOrderId]);

  // Countdown timer for Pix payment
  useEffect(() => {
    if (!isCheckoutOpen || checkoutStep !== 'payment' || paymentMethod !== 'pix' || simulatedPixPaid) return;

    const countdown = setInterval(() => {
      setPixTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate auto-payment approval after 8 seconds of viewing QR code
    const autoApprove = setTimeout(() => {
      setSimulatedPixPaid(true);
      // Finalize the order placement
      if (activeCreatedOrderId) {
        setOrders(prev => prev.map(o => {
          if (o.id === activeCreatedOrderId) {
            return {
              ...o,
              history: [...o.history, { status: 'printing', timestamp: new Date().toISOString(), note: 'Simulador Pix: Pagamento liquidado de imediato!' }],
              status: 'printing'
            };
          }
          return o;
        }));
      }
    }, 8000);

    return () => {
      clearInterval(countdown);
      clearTimeout(autoApprove);
    };
  }, [isCheckoutOpen, checkoutStep, paymentMethod, simulatedPixPaid, activeCreatedOrderId]);

  // Auto-fill address details based on CEP (Simulated Brazilian CEP autocomplete)
  const handleCEPLookup = (cep: string) => {
    const sanitized = cep.replace(/\D/g, '');
    if (sanitized.length === 8) {
      // Simulate API return
      setCheckoutForm(prev => ({
        ...prev,
        street: 'Rua das Flores do Campo',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        state: 'SP'
      }));
    }
  };

  // --- ACTIONS ---

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const note = status === 'printing' ? 'A extrusora de PLA biodegradável iniciou a impressão.' :
                     status === 'finishing' ? 'Fase de lixamento fino e montagem estrutural das cores.' :
                     status === 'shipped' ? 'Objeto postado na agência de logística sob código FR3D8210398BR.' :
                     'Entrega realizada e inspecionada no endereço físico.';
        return {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
          history: [...o.history, { status, timestamp: new Date().toISOString(), note }]
        };
      }
      return o;
    }));
  };

  const handleAddBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
  };

  const handleDeleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateFilamentStock = (stock: FilamentStock[]) => {
    setFilamentStock(stock);
  };

  const handleUpdateSEO = (seo: SEOMetadata) => {
    setSeoMetadata(seo);
  };

  // Handle adding customized item to Cart
  const handleAddToCart = () => {
    // Pricing calculation based on selected size
    let price = selectedProduct.basePrice;
    if (selectedSize === 'large') price *= 1.35;
    if (selectedSize === 'mini') price *= 0.8;

    const itemPrice = parseFloat(price.toFixed(2));
    const cartItemId = `${selectedProduct.id}-${customColors.primary}-${customColors.secondary}-${customColors.tertiary}-${selectedSize}`;

    const existingIndex = cart.findIndex(item => item.id === cartItemId);
    
    if (existingIndex > -1) {
      setCart(prev => prev.map((item, idx) => {
        if (idx === existingIndex) {
          const newQty = item.quantity + customQuantity;
          return {
            ...item,
            quantity: newQty,
            totalPrice: parseFloat((newQty * itemPrice).toFixed(2))
          };
        }
        return item;
      }));
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        product: selectedProduct,
        customColors: { ...customColors },
        quantity: customQuantity,
        totalPrice: parseFloat((customQuantity * itemPrice).toFixed(2)),
        sizeMultiplier: selectedSize
      };
      setCart(prev => [...prev, newItem]);
    }

    setIsCartOpen(true);
    setCustomQuantity(1); // Reset
  };

  // Remove from cart
  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculate cart metrics
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = cartSubtotal >= 150 ? 0 : cartSubtotal > 0 ? 15.00 : 0;
  const cartTotal = cartSubtotal + shippingCost;

  // Social Login Simulation Trigger
  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setUser({
      name: 'Guilherme André',
      email: 'guguandre100@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    });
    setIsLoginModalOpen(false);
  };

  // Handle placement of checkout order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validate checkout fields basic
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.cpf || !checkoutForm.cep) {
      alert('Por favor, preencha todos os campos obrigatórios para prosseguir.');
      return;
    }

    // Generate simulated order
    const orderId = `FR-3D-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: checkoutForm.name,
      customerEmail: checkoutForm.email,
      customerPhone: checkoutForm.phone,
      customerCPF: checkoutForm.cpf,
      address: {
        street: checkoutForm.street || 'Rua das Flores',
        number: checkoutForm.number || 'SN',
        neighborhood: checkoutForm.neighborhood || 'Bairro',
        city: checkoutForm.city || 'Cidade',
        state: checkoutForm.state || 'UF',
        cep: checkoutForm.cep,
      },
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        customColors: item.customColors,
        quantity: item.quantity,
        sizeMultiplier: item.sizeMultiplier,
        price: item.totalPrice / item.quantity
      })),
      paymentMethod: paymentMethod === 'pix' ? 'pix' : 'credit_card',
      paymentDetails: paymentMethod === 'pix' 
        ? { pixCode: `00020101021126580014br.gov.bcb.pix0136${orderId}` }
        : { cardLast4: cardDetails.number.slice(-4) || '4321', installments: parseInt(cardDetails.installments) },
      status: 'received',
      subtotal: cartSubtotal,
      shippingCost,
      total: paymentMethod === 'pix' ? parseFloat((cartTotal * 0.95).toFixed(2)) : cartTotal, // 5% Pix discount!
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        { status: 'received', timestamp: new Date().toISOString(), note: 'Pedido aguardando confirmação de pagamento seguro.' }
      ]
    };

    // Deduct PLA filament inventory grams based on product weight
    const updatedFilaments = filamentStock.map(f => {
      // Find matches in ordered colors
      let gramsToDeduct = 0;
      cart.forEach(item => {
        // approx 120g split among parts
        const totalWeight = item.product.weightGrams * item.quantity;
        if (f.colorHex === item.customColors.primary) gramsToDeduct += totalWeight * 0.4;
        if (f.colorHex === item.customColors.secondary) gramsToDeduct += totalWeight * 0.3;
        if (f.colorHex === item.customColors.tertiary) gramsToDeduct += totalWeight * 0.3;
      });

      return {
        ...f,
        gramsRemaining: Math.max(0, f.gramsRemaining - Math.round(gramsToDeduct))
      };
    });

    setFilamentStock(updatedFilaments);
    setOrders(prev => [newOrder, ...prev]);
    setActiveCreatedOrderId(orderId);
    setCheckoutStep('payment');
  };

  // Finalize payment viewing
  const handleFinishPayment = () => {
    if (activeCreatedOrderId) {
      setSelectedTrackingId(activeCreatedOrderId);
      setCurrentTab('tracking');
    }
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    setCheckoutStep('form');
    setSimulatedPixPaid(false);
    setPixTimeRemaining(600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans selection:bg-[#D48C8C]/20 text-[#2E3A46]" id="app-root">
      
      {/* Dynamic Navbar */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={() => setUser(null)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* TAB 1: INTERACTIVE 3D CATALOGUE & HOME */}
        {currentTab === 'catalog' && (
          <div className="space-y-12 animate-fadeIn" id="catalog-tab-container">
            {/* Header intro hero */}
            <div className="relative overflow-hidden bg-white border border-[#E9E3D9] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="space-y-4 max-w-xl text-left">
                <span className="inline-block px-3 py-1 bg-[#D48C8C]/15 text-[#D48C8C] text-xs font-mono uppercase tracking-widest rounded-full">
                  Fatiador e Customizador 3D On-Line
                </span>
                <h1 className="text-3xl md:text-5xl font-sans font-medium text-[#2E3A46] tracking-tight leading-none">
                  Design 3D que <span className="text-[#D48C8C] italic">Ganha Forma</span> na sua casa.
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">
                  Somos o <strong>Franriib Lab</strong>. Personalize as partes e escolha as bobinas de filamento biodegradável para criar peças incríveis em alta resolução de deposição.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('studio-customizer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    id="btn-hero-customize"
                    className="px-5 py-2.5 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    Estúdio de Criação 3D
                  </button>
                  <button
                    onClick={() => setCurrentTab('tracking')}
                    id="btn-hero-tracker"
                    className="px-5 py-2.5 bg-white hover:bg-[#FAF6F0] text-[#2E3A46] border border-[#E9E3D9] text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Acompanhar Impressão
                  </button>
                </div>
              </div>

              {/* Full elegant brand logo with design elements */}
              <div className="w-full md:w-[320px] shrink-0 flex items-center justify-center scale-90 md:scale-100 overflow-hidden rounded-2xl border border-[#E9E3D9] bg-[#FAF8F4] p-4 shadow-sm">
                <BrandLogo type="full" className="border-none shadow-none bg-transparent !p-0 w-full" />
              </div>
            </div>

            {/* Interactive Customizer Workspace */}
            <div id="studio-customizer" className="space-y-6 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E9E3D9] pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-sans font-medium text-[#2E3A46]">Estúdio Criativo Franriib</h2>
                  <p className="text-xs text-gray-500 font-sans">Selecione o modelo abaixo, confira a foto real e customize as partes combinando seus filamentos favoritos!</p>
                </div>
              </div>

              {/* Models Switcher Carousel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      // default colors reset based on palette groups
                      if (p.id === 'lollipop-holder') {
                        setCustomColors({ primary: '#5DBDF6', secondary: '#FFD43A', tertiary: '#FF4D8D', stick: '#FAF6F0' });
                      } else if (p.id === 'stacking-frames') {
                        setCustomColors({ primary: '#FAF6F0', secondary: '#8E9A86', tertiary: '#DE9E9E', stick: '#8A9BB4' });
                      } else if (p.id === 'ripple-vase') {
                        setCustomColors({ primary: '#C68B75', secondary: '#DE9E9E', tertiary: '#8E9A86' });
                      } else {
                        setCustomColors({ primary: '#FAF6F0', secondary: '#8E9A86', tertiary: '#8A9BB4', stick: '#E5C299' });
                      }
                    }}
                    id={`btn-select-product-${p.id}`}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedProduct.id === p.id 
                        ? 'bg-white border-[#2E3A46] shadow-sm' 
                        : 'bg-[#FAF6F0] hover:bg-white border-[#E9E3D9] hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8E9A86] block">{p.category}</span>
                      <h4 className="font-sans font-semibold text-xs text-[#2E3A46] mt-0.5 leading-tight line-clamp-1">{p.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-semibold text-gray-600 block mt-2">R$ {p.basePrice.toFixed(2)}</span>
                  </button>
                ))}
              </div>

              {/* Customizer Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Product Photo & Color Viewer (Cols 7) */}
                <div className="lg:col-span-7 space-y-2">
                  <ThreeDViewer 
                    productId={selectedProduct.id} 
                    colors={customColors}
                    sizeMultiplier={selectedSize}
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono px-1">
                    <span>*Alterne as abas acima para conferir fotos reais e o guia esquemático de cores</span>
                    <span>Franriib Color Engine v3.0</span>
                  </div>
                </div>

                {/* Customizer Panel (Cols 5) */}
                <div className="lg:col-span-5 bg-white border border-[#E9E3D9] p-6 rounded-2xl shadow-sm space-y-6 text-left">
                  <div className="border-b border-[#FAF6F0] pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D48C8C]">{selectedProduct.category}</span>
                    <h3 className="text-lg font-sans font-medium text-[#2E3A46] leading-tight mt-0.5">{selectedProduct.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{selectedProduct.description}</p>
                  </div>

                  {/* 3D customization part color picker loops */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 border-b border-[#FAF6F0] pb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D48C8C]" /> 
                      Selecione os Filamentos PLA
                    </h4>

                    {/* Part 1 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-600 font-sans block">{selectedProduct.customizableParts.primaryLabel}:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setCustomColors(prev => ({ ...prev, primary: c.hex }))}
                            id={`btn-color-primary-${c.hex}`}
                            className={`w-6 h-6 rounded-full border shadow-sm transition-all relative ${
                              customColors.primary === c.hex 
                                ? 'scale-110 ring-2 ring-[#2E3A46] border-white' 
                                : 'border-gray-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {customColors.primary === c.hex && <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto filter drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Part 2 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-600 font-sans block">{selectedProduct.customizableParts.secondaryLabel}:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setCustomColors(prev => ({ ...prev, secondary: c.hex }))}
                            id={`btn-color-secondary-${c.hex}`}
                            className={`w-6 h-6 rounded-full border shadow-sm transition-all relative ${
                              customColors.secondary === c.hex 
                                ? 'scale-110 ring-2 ring-[#2E3A46] border-white' 
                                : 'border-gray-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {customColors.secondary === c.hex && <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto filter drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Part 3 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-600 font-sans block">{selectedProduct.customizableParts.tertiaryLabel}:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setCustomColors(prev => ({ ...prev, tertiary: c.hex }))}
                            id={`btn-color-tertiary-${c.hex}`}
                            className={`w-6 h-6 rounded-full border shadow-sm transition-all relative ${
                              customColors.tertiary === c.hex 
                                ? 'scale-110 ring-2 ring-[#2E3A46] border-white' 
                                : 'border-gray-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {customColors.tertiary === c.hex && <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto filter drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Part 4 (Optional Stick/Pen) */}
                    {selectedProduct.customizableParts.hasStick && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-gray-600 font-sans block">{selectedProduct.customizableParts.stickLabel}:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {COLOR_PALETTE.map((c) => (
                            <button
                              key={c.hex}
                              onClick={() => setCustomColors(prev => ({ ...prev, stick: c.hex }))}
                              id={`btn-color-stick-${c.hex}`}
                              className={`w-6 h-6 rounded-full border shadow-sm transition-all relative ${
                                customColors.stick === c.hex 
                                  ? 'scale-110 ring-2 ring-[#2E3A46] border-white' 
                                  : 'border-gray-200 hover:scale-105'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            >
                              {customColors.stick === c.hex && <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto filter drop-shadow-sm" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Size Multiplier selector */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 border-b border-[#FAF6F0] pb-1.5">Escala / Dimensões de Impressão</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedSize('mini')}
                        id="btn-size-mini"
                        className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                          selectedSize === 'mini' 
                            ? 'bg-[#2E3A46] text-white border-[#2E3A46]' 
                            : 'bg-[#FAF6F0] hover:bg-white border-[#E9E3D9] text-[#2E3A46]'
                        }`}
                      >
                        Mini (70%)
                        <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">R$ {(selectedProduct.basePrice * 0.8).toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => setSelectedSize('standard')}
                        id="btn-size-standard"
                        className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                          selectedSize === 'standard' 
                            ? 'bg-[#2E3A46] text-white border-[#2E3A46]' 
                            : 'bg-[#FAF6F0] hover:bg-white border-[#E9E3D9] text-[#2E3A46]'
                        }`}
                      >
                        Padrão (100%)
                        <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">R$ {selectedProduct.basePrice.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => setSelectedSize('large')}
                        id="btn-size-large"
                        className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                          selectedSize === 'large' 
                            ? 'bg-[#2E3A46] text-white border-[#2E3A46]' 
                            : 'bg-[#FAF6F0] hover:bg-white border-[#E9E3D9] text-[#2E3A46]'
                        }`}
                      >
                        Grande (135%)
                        <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">R$ {(selectedProduct.basePrice * 1.35).toFixed(2)}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity & CTA Price Display */}
                  <div className="pt-4 border-t border-[#FAF6F0] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Tempo de Fila Estimado</span>
                      <span className="text-xs font-semibold text-[#2E3A46] font-mono block mt-0.5">{selectedProduct.estimatedPrintTime}</span>
                    </div>

                    <div className="flex items-center gap-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-xl p-1 shrink-0">
                      <button 
                        onClick={() => setCustomQuantity(q => Math.max(1, q - 1))}
                        id="btn-qty-minus"
                        className="w-7 h-7 rounded-lg hover:bg-white text-[#2E3A46] flex items-center justify-center font-bold font-mono transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold">{customQuantity}</span>
                      <button 
                        onClick={() => setCustomQuantity(q => q + 1)}
                        id="btn-qty-plus"
                        className="w-7 h-7 rounded-lg hover:bg-white text-[#2E3A46] flex items-center justify-center font-bold font-mono transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    id="btn-add-to-cart"
                    className="w-full py-3 bg-[#D48C8C] hover:bg-[#C68B75] text-white hover:shadow font-mono text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho • R${' '}
                    {(
                      (selectedSize === 'mini' ? selectedProduct.basePrice * 0.8 :
                       selectedSize === 'large' ? selectedProduct.basePrice * 1.35 :
                       selectedProduct.basePrice) * customQuantity
                    ).toFixed(2)}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8E9A86]" />
                    <span>Lote manufaturado sob demanda em filamento PLA atóxico</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER PRODUCTION TRACKER */}
        {currentTab === 'tracking' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <OrderTracker 
              orders={orders} 
              onUpdateOrderStatus={handleUpdateOrderStatus}
              defaultTrackingId={selectedTrackingId}
            />
          </div>
        )}

        {/* TAB 3: CUSTOMER NEWS BLOG */}
        {currentTab === 'blog' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <BlogSection posts={blogPosts} />
          </div>
        )}

        {/* TAB 4: STORE BACKEND ADMINISTRATION */}
        {currentTab === 'admin' && (
          <div className="animate-fadeIn">
            <AdminPanel
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              blogPosts={blogPosts}
              onAddBlogPost={handleAddBlogPost}
              onDeleteBlogPost={handleDeleteBlogPost}
              filamentStock={filamentStock}
              onUpdateFilamentStock={handleUpdateFilamentStock}
              seoMetadata={seoMetadata}
              onUpdateSEO={handleUpdateSEO}
            />
          </div>
        )}

      </main>

      {/* --- SIDE SLIDE-OVER: SHOPPING CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="shopping-cart-drawer">
            {/* Backdrop filter blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-[#2E3A46] backdrop-blur-xs"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white border-l border-[#E9E3D9] flex flex-col justify-between h-full shadow-2xl"
              >
                {/* Cart Header */}
                <div className="p-6 border-b border-[#E9E3D9] bg-[#FAF6F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D48C8C]" />
                    <h3 className="font-sans font-medium text-base text-[#2E3A46]">Sacola de Customizados</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    id="btn-close-cart"
                    className="p-1 text-gray-400 hover:text-gray-900 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Item List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center p-12 space-y-4">
                      <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                      <div>
                        <h4 className="font-semibold text-sm text-[#2E3A46]">Sua sacola está vazia</h4>
                        <p className="text-xs text-gray-400 mt-1">Vá até o catálogo e brinque com as cores no fatiador para começar!</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setCurrentTab('catalog');
                        }}
                        id="btn-cart-back-catalog"
                        className="px-4 py-2 bg-[#2E3A46] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-all"
                      >
                        Ver Catálogo
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E9E3D9] flex gap-4 justify-between items-start">
                        <div className="space-y-1.5 flex-1 text-left">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#8E9A86]">{item.product.category}</span>
                          <h4 className="font-semibold text-xs text-[#2E3A46] line-clamp-1">{item.product.name}</h4>
                          
                          {/* Part Colors Bubble list */}
                          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-gray-500 py-1">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: item.customColors.primary }} />
                              Base
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: item.customColors.secondary }} />
                              Colar
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: item.customColors.tertiary }} />
                              Corpo
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 uppercase">
                            <span>Escala: {item.sizeMultiplier}</span>
                            <span>•</span>
                            <span>Qtd: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between h-full min-h-[70px]">
                          <span className="text-xs font-semibold font-mono text-[#2E3A46]">R$ {item.totalPrice.toFixed(2)}</span>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            id={`btn-remove-cart-${item.id}`}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Remover Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Checkout CTA summary */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-[#E9E3D9] bg-[#FAF6F0] space-y-4 text-left">
                    <div className="space-y-1.5 text-xs text-gray-500 font-mono">
                      <div className="flex justify-between">
                        <span>Subtotal de Customizados</span>
                        <span className="font-semibold text-[#2E3A46]">R$ {cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete (Simulação Loggi/Correios)</span>
                        <span className="font-semibold text-[#2E3A46]">
                          {shippingCost === 0 ? <span className="text-emerald-600 font-bold uppercase">Grátis</span> : `R$ ${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      {shippingCost > 0 && (
                        <p className="text-[10px] text-gray-400 text-right font-sans">Adicione mais R$ {(150 - cartSubtotal).toFixed(2)} para Frete Grátis!</p>
                      )}
                      <div className="flex justify-between border-t border-[#E9E3D9] pt-3 text-sm font-semibold text-[#2E3A46]">
                        <span>Total Geral</span>
                        <span className="font-mono text-base text-[#D48C8C]">R$ {cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                        setCheckoutStep('form');
                      }}
                      id="btn-cart-checkout"
                      className="w-full py-3 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-widest rounded-xl transition-all hover:shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Avançar para Checkout Seguro
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SECURE CHECKOUT EXPANDED MODAL LAYOUT --- */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto font-sans bg-[#FAF6F0]" id="checkout-container-modal">
            {/* Header branding */}
            <div className="bg-[#2E3A46] text-white py-4 border-b border-white/5 sticky top-0 z-20">
              <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#8E9A86]" />
                  <span className="font-sans font-semibold text-sm tracking-widest uppercase">Franriib Checkout Seguro</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  id="btn-close-checkout"
                  className="px-3 py-1 bg-[#3A4958] hover:bg-red-600 rounded-lg text-xs font-mono uppercase text-gray-300 hover:text-white transition-all"
                >
                  Cancelar Compra
                </button>
              </div>
            </div>

            {/* Steps panel */}
            <div className="max-w-4xl mx-auto px-4 py-8">
              
              {checkoutStep === 'form' ? (
                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                  
                  {/* Left form (Cols 7) */}
                  <div className="lg:col-span-7 bg-white border border-[#E9E3D9] p-6 rounded-2xl shadow-sm space-y-6">
                    <div>
                      <h3 className="font-sans font-medium text-base text-[#2E3A46] border-b border-[#FAF6F0] pb-2">1. Dados do Destinatário</h3>
                      <p className="text-xs text-gray-400 mt-1">Preencha o endereço para envio e faturamento do lote 3D</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Nome Completo</label>
                        <input
                          type="text"
                          placeholder="Ex: Guilherme André"
                          value={checkoutForm.name}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Endereço de E-mail</label>
                        <input
                          type="email"
                          placeholder="guguandre100@gmail.com"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">WhatsApp / Celular</label>
                        <input
                          type="text"
                          placeholder="(11) 99876-5432"
                          value={checkoutForm.phone}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">CPF (Faturamento Nota Fiscal)</label>
                        <input
                          type="text"
                          placeholder="123.456.789-00"
                          value={checkoutForm.cpf}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, cpf: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">CEP (Rastreio Correios)</label>
                        <input
                          type="text"
                          placeholder="01310-100"
                          value={checkoutForm.cep}
                          onChange={(e) => {
                            setCheckoutForm({ ...checkoutForm, cep: e.target.value });
                            handleCEPLookup(e.target.value);
                          }}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Rua / Logradouro</label>
                        <input
                          type="text"
                          placeholder="Ex: Avenida Paulista"
                          value={checkoutForm.street}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, street: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Número</label>
                        <input
                          type="text"
                          placeholder="Ex: 1000"
                          value={checkoutForm.number}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, number: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Bairro</label>
                        <input
                          type="text"
                          placeholder="Ex: Bela Vista"
                          value={checkoutForm.neighborhood}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, neighborhood: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Cidade</label>
                        <input
                          type="text"
                          placeholder="Ex: São Paulo"
                          value={checkoutForm.city}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Estado (UF)</label>
                        <input
                          type="text"
                          placeholder="Ex: SP"
                          value={checkoutForm.state}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right order review & payment selection (Cols 5) */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Item review */}
                    <div className="bg-white border border-[#E9E3D9] p-5 rounded-2xl shadow-sm space-y-3">
                      <h4 className="font-sans font-medium text-xs text-gray-500 uppercase tracking-wider border-b border-[#FAF6F0] pb-2">
                        Revisar Peças ({cartItemsCount})
                      </h4>
                      <div className="space-y-2.5 max-h-[150px] overflow-y-auto">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-xs">
                            <div className="text-left">
                              <span className="font-semibold block line-clamp-1">{item.product.name} ({item.quantity}x)</span>
                              <span className="text-[10px] text-gray-400 font-mono">Tamanho: {item.sizeMultiplier}</span>
                            </div>
                            <span className="font-mono font-medium">R$ {item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment methods selector */}
                    <div className="bg-white border border-[#E9E3D9] p-6 rounded-2xl shadow-sm space-y-5">
                      <h4 className="font-sans font-medium text-sm text-[#2E3A46] border-b border-[#FAF6F0] pb-2">2. Método de Pagamento</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('pix')}
                          id="btn-checkout-method-pix"
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            paymentMethod === 'pix'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                              : 'bg-[#FAF6F0] border-[#E9E3D9] text-[#2E3A46] hover:bg-white'
                          }`}
                        >
                          <span className="text-lg">⚡</span>
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Pix (-5% Off)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          id="btn-checkout-method-card"
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            paymentMethod === 'card'
                              ? 'bg-[#2E3A46] border-[#2E3A46] text-white'
                              : 'bg-[#FAF6F0] border-[#E9E3D9] text-[#2E3A46] hover:bg-white'
                          }`}
                        >
                          <CreditCard className="w-5 h-5" />
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Cartão de Crédito</span>
                        </button>
                      </div>

                      {/* Dynamic Fields */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-3 pt-2 border-t border-[#FAF6F0] text-left animate-fadeIn">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-gray-400 block">Número do Cartão</label>
                            <input
                              type="text"
                              placeholder="4444 5555 6666 7777"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                              className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1 col-span-2">
                              <label className="text-[9px] font-mono uppercase text-gray-400 block">Validade</label>
                              <input
                                type="text"
                                placeholder="MM/AA"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono uppercase text-gray-400 block">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-gray-400 block">Parcelamento</label>
                            <select
                              value={cardDetails.installments}
                              onChange={(e) => setCardDetails({ ...cardDetails, installments: e.target.value })}
                              className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                            >
                              <option value="1">1x de R$ {cartTotal.toFixed(2)} (Sem juros)</option>
                              <option value="2">2x de R$ {(cartTotal / 2).toFixed(2)} (Sem juros)</option>
                              <option value="3">3x de R$ {(cartTotal / 3).toFixed(2)} (Sem juros)</option>
                              <option value="6">6x de R$ {(cartTotal / 6).toFixed(2)} (Sem juros)</option>
                              <option value="12">12x de R$ {(cartTotal / 12).toFixed(2)} (Sem juros)</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'pix' && (
                        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-800 text-left space-y-1 animate-fadeIn">
                          <p className="font-semibold">⚡ Desconto de 5% ativado!</p>
                          <p className="text-gray-500 text-[11px] leading-relaxed">Pague de forma instantânea via Pix e receba confirmação do sistema em tempo real de faturamento.</p>
                        </div>
                      )}

                      {/* Purchase CTA button */}
                      <button
                        type="submit"
                        id="btn-checkout-submit"
                        className="w-full py-3 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-widest rounded-xl hover:shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Finalizar e Pagar • R${' '}
                        {(paymentMethod === 'pix' ? cartTotal * 0.95 : cartTotal).toFixed(2)}
                      </button>
                    </div>

                  </div>
                </form>
              ) : (
                /* STEP PAYMENT CLEARANCE OVERLAY */
                <div className="max-w-md mx-auto bg-white border border-[#E9E3D9] p-8 rounded-3xl shadow-xl text-center space-y-6 animate-scaleIn" id="payment-clearance-view">
                  {paymentMethod === 'pix' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase tracking-widest rounded-full animate-pulse">
                          Aguardando Transferência Pix...
                        </span>
                        <h3 className="font-sans font-semibold text-lg text-[#2E3A46]">Escaneie o QR Code Pix</h3>
                        <p className="text-xs text-gray-500">Fature o pedido realizando a liquidação segura no app do seu banco</p>
                      </div>

                      {/* Mock styled QR code */}
                      <div className="w-48 h-48 bg-white border border-[#E9E3D9] p-3 rounded-2xl mx-auto flex items-center justify-center relative shadow-sm">
                        {simulatedPixPaid ? (
                          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-2 animate-fadeIn z-10 rounded-2xl">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
                              <Check className="w-6 h-6 stroke-[3]" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 font-mono uppercase">Pix Liquidado!</span>
                          </div>
                        ) : null}
                        
                        {/* Custom SVG QR Code visual representation */}
                        <svg className="w-full h-full text-[#2E3A46]" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="10" y="10" width="20" height="20" />
                          <rect x="15" y="15" width="10" height="10" fill="white" />
                          <rect x="70" y="10" width="20" height="20" />
                          <rect x="75" y="15" width="10" height="10" fill="white" />
                          <rect x="10" y="70" width="20" height="20" />
                          <rect x="15" y="75" width="10" height="10" fill="white" />
                          <rect x="40" y="40" width="20" height="20" />
                          {/* Random noise bits */}
                          <rect x="35" y="15" width="5" height="5" />
                          <rect x="45" y="20" width="10" height="5" />
                          <rect x="35" y="70" width="10" height="5" />
                          <rect x="50" y="75" width="5" height="15" />
                          <rect x="70" y="45" width="15" height="5" />
                          <rect x="80" y="55" width="10" height="15" />
                        </svg>
                      </div>

                      <div className="space-y-3 max-w-sm mx-auto">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block pl-1">Pix Copia e Cola</span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value="00020101021126580014br.gov.bcb.pix0136FRANRIIB3D"
                              readOnly
                              className="flex-1 bg-[#FAF6F0] border border-[#E9E3D9] px-3 py-1.5 text-[10px] font-mono text-gray-500 rounded-xl focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText('00020101021126580014br.gov.bcb.pix0136FRANRIIB3D');
                                alert('Código Pix Copia e Cola copiado com sucesso!');
                              }}
                              className="px-3 bg-[#2E3A46] text-white hover:bg-[#D48C8C] text-[10px] font-mono rounded-xl transition-colors"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                          <span>Tempo restante do faturamento:</span>
                          <span>{Math.floor(pixTimeRemaining / 60)}:{(pixTimeRemaining % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>

                      {/* Redirect to tracker CTA */}
                      <button
                        type="button"
                        onClick={handleFinishPayment}
                        id="btn-pix-finish"
                        disabled={!simulatedPixPaid}
                        className="w-full py-3 bg-[#2E3A46] disabled:bg-gray-200 text-white disabled:text-gray-400 hover:bg-[#D48C8C] text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        {!simulatedPixPaid && <Loader2 className="w-4 h-4 animate-spin text-[#D48C8C]" />}
                        {simulatedPixPaid ? 'Ir para Rastreio do Pedido' : 'Simulando Liquidação Automática...'}
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                        *Para agilizar os testes, o checkout simula de imediato a aprovação bancária do Pix em até 8 segundos, faturando o pedido direto para a fila de manufatura.
                      </p>

                    </div>
                  ) : (
                    /* CARD APPROVAL STATE */
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <h3 className="font-sans font-semibold text-lg text-[#2E3A46]">Pagamento Aprovado!</h3>
                        <p className="text-xs text-gray-500">Cartão de crédito com final {cardDetails.number.slice(-4) || '4321'} autenticado com sucesso.</p>
                      </div>

                      <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E9E3D9] text-left text-xs font-mono text-gray-600 space-y-1">
                        <p>Transação segura: <strong>#FR-CC-289103X</strong></p>
                        <p>Status: <strong>Faturado / Emitindo Nota Fiscal</strong></p>
                        <p>Adquirente: <strong> Franriib Gateway S.A.</strong></p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFinishPayment}
                        id="btn-card-finish"
                        className="w-full py-3 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        Ver Linha de Produção 3D <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FLOATING WHATSAPP & TECHNICAL EMAIL CHAT WIDGET --- */}
      <ChatWidget />

      {/* --- SOCIAL LOGIN PRE-POLISHED DIALOG MODAL --- */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans" id="social-login-dialog">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-[#2E3A46]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-[#E9E3D9] w-full max-w-sm p-6 rounded-3xl shadow-2xl z-10 text-center space-y-6 relative"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                id="btn-close-login"
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#D48C8C] font-semibold">Login Facilitado</span>
                <h4 className="font-sans font-semibold text-base text-[#2E3A46]">Conecte-se ao Franriib Lab</h4>
                <p className="text-xs text-gray-400">Entre para sincronizar seu histórico de modelagem e agilizar seu checkout de filamentos</p>
              </div>

              {/* Providers buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  id="btn-login-google"
                  className="w-full py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#E9E3D9]/50 text-gray-700 hover:text-[#2E3A46] border border-[#E9E3D9] text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer font-semibold"
                >
                  {/* Custom representation of Google Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.59 5.59 0 0 1 8.4 12.93a5.59 5.59 0 0 1 5.591-5.59c2.316 0 4.218 1.344 5.084 3.291l3.504-2.18c-1.89-3.962-5.744-6.7-10.28-6.7a11.18 11.18 0 0 0-11.18 11.18 11.18 11.18 0 0 0 11.18 11.18c5.442 0 10.155-3.834 11.025-9.25H12.24Z"/>
                  </svg>
                  Conectar com Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')} // redirect to general user auth
                  id="btn-login-facebook"
                  className="w-full py-2.5 px-4 bg-[#3B5998] hover:bg-[#344E86] text-white border border-[#3B5998] text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer font-semibold"
                >
                  <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                  Conectar com Facebook
                </button>
              </div>

              <div className="pt-2 border-t border-[#FAF6F0] text-[10px] text-gray-400 font-sans">
                Ao prosseguir, você concorda em sincronizar seus dados de perfil para faturamento automático de Nota Fiscal de artesãos do estúdio.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER SITE BRANDING AREA --- */}
      <footer className="bg-[#2E3A46] text-white py-12 border-t border-white/5" id="store-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center">
              <BrandLogo type="compact" className="filter brightness-125 saturate-125 scale-95 origin-left" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans max-w-sm">
              Inspirado no amor pela modelagem digital e a precisão da deposição fundida (FDM). Desenvolvemos objetos que transcendem utilidade, se tornando pura expressão tátil no seu ambiente.
            </p>
            <p className="text-[10px] text-[#8A9BB4] font-mono uppercase tracking-wider">
              CRIAR | PERSONALIZAR | TRANSFORMAR
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-gray-400">Atalhos do Laboratório</h5>
            <ul className="text-xs text-gray-300 space-y-2 font-sans">
              <li>
                <button onClick={() => setCurrentTab('catalog')} className="hover:text-[#D48C8C] transition-colors">
                  Galeria 3D Interativa
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('tracking')} className="hover:text-[#D48C8C] transition-colors">
                  Acompanhar Impressora PLA
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('blog')} className="hover:text-[#D48C8C] transition-colors">
                  Diário de Novidades 3D
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin')} className="hover:text-[#D48C8C] transition-colors">
                  Console do Administrador
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-gray-400">Segurança & Materiais</h5>
            <p className="text-xs text-gray-300 leading-normal font-sans">
              Utilizamos polímero PLA biodegradável de alta pureza derivado do amido de milho. 100% atóxico e sustentável para toda sua família.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Checkout 100% Seguro</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between text-[11px] text-[#8A9BB4] font-mono gap-4 text-left">
          <span>&copy; {new Date().getFullYear()} Franriib Lab. Todos os direitos reservados. CNPJ: 12.345.678/0001-90</span>
          <span>Feito com paixão de fatiamento • São Paulo, Brasil</span>
        </div>
      </footer>

    </div>
  );
}
