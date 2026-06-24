import { useState } from 'react';
import { ShoppingBag, Menu, X, Globe, User, BookOpen, Layers, ShieldCheck, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentTab: 'catalog' | 'tracking' | 'blog' | 'admin';
  onChangeTab: (tab: 'catalog' | 'tracking' | 'blog' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  user: { name: string; email: string; avatar: string } | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentTab,
  onChangeTab,
  cartCount,
  onOpenCart,
  user,
  onOpenLoginModal,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Catálogo Cores', icon: Layers },
    { id: 'tracking', label: 'Rastreio Impressão', icon: ShieldCheck },
    { id: 'blog', label: 'Blog Novidades', icon: BookOpen },
    { id: 'admin', label: 'Painel Admin', icon: User },
  ] as const;

  const handleTabClick = (tab: 'catalog' | 'tracking' | 'blog' | 'admin') => {
    onChangeTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#E9E3D9]" id="store-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand Brand Area */}
          <div 
            onClick={() => handleTabClick('catalog')}
            className="cursor-pointer active:scale-98 transition-all"
            id="brand-logo-container"
          >
            <BrandLogo type="compact" />
          </div>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  id={`nav-tab-${item.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-[#2E3A46] text-white'
                      : 'text-[#2E3A46] hover:bg-[#FAF6F0] hover:text-[#D48C8C]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Cart & Login Controls (Desktop) */}
          <div className="flex items-center gap-3">
            
            {/* Cart Icon trigger */}
            <button
              onClick={onOpenCart}
              id="btn-navbar-cart"
              className="relative p-2 text-[#2E3A46] hover:text-[#D48C8C] bg-[#FAF6F0] hover:bg-white border border-[#E9E3D9] rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              title="Ver Sacola de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D48C8C] text-white text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Social Login simulation */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E9E3D9]">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full border border-[#D48C8C]"
                />
                <div className="text-left">
                  <span className="block text-[10px] font-semibold text-[#2E3A46] line-clamp-1 max-w-[80px]">{user.name}</span>
                  <button 
                    onClick={onLogout}
                    id="btn-navbar-logout"
                    className="block text-[9px] font-mono text-gray-400 hover:text-red-500 transition-colors uppercase"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                id="btn-navbar-login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-[#E9E3D9] hover:border-[#D48C8C]/50 hover:bg-[#FAF6F0] rounded-xl text-xs font-mono uppercase tracking-wider text-[#2E3A46] transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}

            {/* Mobile Menu sandwich toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="btn-mobile-menu-toggle"
              className="p-2 md:hidden text-[#2E3A46] hover:bg-[#FAF6F0] rounded-xl cursor-pointer"
              title="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer navigation links */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E3D9] bg-white animate-fadeIn" id="mobile-navigation-drawer">
          <div className="space-y-1.5 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  id={`nav-mobile-${item.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider rounded-xl transition-all ${
                    currentTab === item.id
                      ? 'bg-[#2E3A46] text-white'
                      : 'text-[#2E3A46] hover:bg-[#FAF6F0] hover:text-[#D48C8C]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Mobile User Profile details */}
            {user ? (
              <div className="pt-4 border-t border-[#FAF6F0] flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-[#D48C8C]" />
                  <div>
                    <span className="block text-xs font-semibold text-[#2E3A46]">{user.name}</span>
                    <span className="block text-[9px] font-mono text-gray-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  id="btn-mobile-logout"
                  className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-red-500 border border-red-200 bg-red-50 rounded-lg active:scale-95"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLoginModal();
                  setMobileMenuOpen(false);
                }}
                id="btn-mobile-login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#E9E3D9] rounded-xl text-xs font-mono uppercase tracking-wider text-[#2E3A46] active:scale-95 mt-2"
              >
                <User className="w-4 h-4" />
                <span>Entrar na Minha Conta</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
