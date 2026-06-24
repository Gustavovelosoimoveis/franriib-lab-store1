import { useState } from 'react';
import { CustomizationColors } from '../types';
import { INITIAL_PRODUCTS, COLOR_PALETTE } from '../data/initialData';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Palette, Maximize2, Scale, Info } from 'lucide-react';

interface ThreeDViewerProps {
  productId: string;
  colors: CustomizationColors;
  sizeMultiplier: 'standard' | 'large' | 'mini';
}

export default function ThreeDViewer({ productId, colors, sizeMultiplier }: ThreeDViewerProps) {
  const [activeView, setActiveView] = useState<'photo' | 'schematic'>('photo');
  const [zoomImage, setZoomImage] = useState(false);

  const product = INITIAL_PRODUCTS.find((p) => p.id === productId) || INITIAL_PRODUCTS[0];

  // Map size multipliers to Portuguese labels and descriptive scales
  const sizeLabels = {
    standard: 'Tamanho Padrão (100%)',
    large: 'Tamanho Grande (135% - Mais Espaço)',
    mini: 'Tamanho Mini (80% - Compacto)',
  };

  const scaleClasses = {
    standard: 'scale-100',
    large: 'scale-110 md:scale-115',
    mini: 'scale-90',
  };

  // Helper to find the color name from hex
  const getColorName = (hex: string) => {
    const found = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
    return found ? found.name : 'Cor Customizada';
  };

  // Renders the precise vector blueprint of each customizable product
  const renderProductSchematic = () => {
    switch (productId) {
      case 'lollipop-holder':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-[280px] drop-shadow-md">
            {/* Background platform line */}
            <line x1="20" y1="210" x2="180" y2="210" stroke="#E9E3D9" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Stick/Pen (Back/Inside) */}
            <g className="transition-all duration-500">
              <rect 
                x="94" 
                y="35" 
                width="12" 
                height="130" 
                rx="4" 
                fill={colors.stick || '#E9E3D9'} 
                stroke="#2E3A46" 
                strokeWidth="2.5" 
                transform="rotate(-15 100 120)" 
              />
              {/* Pen Tip */}
              <polygon 
                points="84,33 91,20 95,31" 
                fill="#333333" 
                stroke="#2E3A46" 
                strokeWidth="1.5"
                transform="rotate(-15 100 120)" 
              />
            </g>

            {/* Cloud Base (Primary Color) */}
            <path 
              d="M 50 195 
                 C 30 195, 25 170, 45 160 
                 C 35 140, 65 125, 85 135 
                 C 100 115, 135 120, 145 140 
                 C 165 135, 175 160, 160 175 
                 C 175 190, 155 200, 140 195
                 C 120 205, 75 205, 50 195 Z" 
              fill={colors.primary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
            
            {/* Flower Collar (Secondary Color) */}
            <g className="transition-all duration-500" transform="translate(100, 115)">
              {/* Petals */}
              <circle cx="0" cy="-18" r="10" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
              <circle cx="17" cy="-6" r="10" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
              <circle cx="11" cy="14" r="10" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
              <circle cx="-11" cy="14" r="10" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
              <circle cx="-17" cy="-6" r="10" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
              {/* Center core */}
              <circle cx="0" cy="0" r="11" fill={colors.secondary} stroke="#2E3A46" strokeWidth="2" />
            </g>

            {/* Lollipop Sphere (Tertiary Color) */}
            <circle 
              cx="100" 
              cy="75" 
              r="28" 
              fill={colors.tertiary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              className="transition-all duration-500"
            />
            <circle cx="90" cy="65" r="5" fill="#ffffff" opacity="0.4" />
          </svg>
        );

      case 'stacking-frames':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-[280px] drop-shadow-md">
            <line x1="20" y1="210" x2="180" y2="210" stroke="#E9E3D9" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Layer 1 - Base (Primary) */}
            <rect 
              x="45" 
              y="165" 
              width="110" 
              height="30" 
              rx="8" 
              fill={colors.primary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              className="transition-all duration-500"
            />
            <line x1="55" y1="180" x2="145" y2="180" stroke="#2E3A46" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />

            {/* Layer 2 - Mid Low (Secondary) */}
            <rect 
              x="50" 
              y="130" 
              width="100" 
              height="30" 
              rx="8" 
              fill={colors.secondary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              transform="rotate(6 100 145)"
              className="transition-all duration-500"
            />

            {/* Layer 3 - Mid High (Tertiary) */}
            <rect 
              x="55" 
              y="95" 
              width="90" 
              height="30" 
              rx="8" 
              fill={colors.tertiary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              transform="rotate(-8 100 110)"
              className="transition-all duration-500"
            />

            {/* Layer 4 - Top Crown (Stick/Top) */}
            <rect 
              x="62" 
              y="60" 
              width="76" 
              height="30" 
              rx="8" 
              fill={colors.stick || '#E9E3D9'} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              transform="rotate(10 100 75)"
              className="transition-all duration-500"
            />
            
            {/* Center core line depicting rotating spindle */}
            <line x1="100" y1="50" x2="100" y2="60" stroke="#2E3A46" strokeWidth="2" />
          </svg>
        );

      case 'ripple-vase':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-[280px] drop-shadow-md">
            <line x1="20" y1="210" x2="180" y2="210" stroke="#E9E3D9" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Base Platform Ring (Tertiary Color) */}
            <path 
              d="M 55 185 L 145 185 L 138 200 L 62 200 Z" 
              fill={colors.tertiary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Organic Corrugated Body (Primary Color) */}
            <path 
              d="M 60 185 
                 C 45 160, 50 140, 68 120 
                 C 50 100, 55 85, 75 80 
                 L 125 80 
                 C 145 85, 150 100, 132 120 
                 C 150 140, 155 160, 140 185 Z" 
              fill={colors.primary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
            
            {/* Algorithmic layer lines (representing 3D print ridges) */}
            <path d="M 58 170 Q 100 173 142 170" fill="none" stroke="#2E3A46" strokeWidth="1.5" opacity="0.4" />
            <path d="M 60 150 Q 100 153 140 150" fill="none" stroke="#2E3A46" strokeWidth="1.5" opacity="0.4" />
            <path d="M 66 130 Q 100 133 134 130" fill="none" stroke="#2E3A46" strokeWidth="1.5" opacity="0.4" />
            <path d="M 62 110 Q 100 113 138 110" fill="none" stroke="#2E3A46" strokeWidth="1.5" opacity="0.4" />
            <path d="M 68 95 Q 100 98 132 95" fill="none" stroke="#2E3A46" strokeWidth="1.5" opacity="0.4" />

            {/* Top Collar/Neck (Secondary Color) */}
            <ellipse 
              cx="100" 
              cy="80" 
              rx="26" 
              ry="8" 
              fill={colors.secondary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              className="transition-all duration-500"
            />
            {/* Opening depth */}
            <ellipse cx="100" cy="80" rx="16" ry="5" fill="#2E3A46" opacity="0.15" />
          </svg>
        );

      default: // hex-organizer (Modular Colmeia)
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-[280px] drop-shadow-md">
            <line x1="20" y1="210" x2="180" y2="210" stroke="#E9E3D9" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Solid Tray Base (Primary Color) */}
            <rect 
              x="30" 
              y="170" 
              width="140" 
              height="18" 
              rx="4" 
              fill={colors.primary} 
              stroke="#2E3A46" 
              strokeWidth="2.5" 
              className="transition-all duration-500"
            />

            {/* Tall Hex Cup (Secondary Color) */}
            <g className="transition-all duration-500">
              <polygon 
                points="45,60 80,60 80,170 45,170" 
                fill={colors.secondary} 
                stroke="#2E3A46" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
              />
              <line x1="50" y1="60" x2="50" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="62" y1="60" x2="62" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="74" y1="60" x2="74" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
            </g>

            {/* Medium Hex Cup (Tertiary Color) */}
            <g className="transition-all duration-500">
              <polygon 
                points="82,90 117,90 117,170 82,170" 
                fill={colors.tertiary} 
                stroke="#2E3A46" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
              />
              <line x1="87" y1="90" x2="87" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="99" y1="90" x2="99" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="111" y1="90" x2="111" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
            </g>

            {/* Short Hex Cup (Stick/Fourth Color) */}
            <g className="transition-all duration-500">
              <polygon 
                points="119,115 154,115 154,170 119,170" 
                fill={colors.stick || '#E5C299'} 
                stroke="#2E3A46" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
              />
              <line x1="124" y1="115" x2="124" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="136" y1="115" x2="136" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
              <line x1="148" y1="115" x2="148" y2="170" stroke="#2E3A46" strokeWidth="1" opacity="0.2" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full bg-[#FAF6F0] rounded-3xl overflow-hidden border border-[#E9E3D9] shadow-sm flex flex-col" id={`product-viewer-${productId}`}>
      
      {/* Top Ribbon Control Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E3D9] bg-white">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D48C8C] animate-pulse" />
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#2E3A46] font-semibold">
            Visualização de Detalhes
          </h4>
        </div>

        {/* View Toggle */}
        <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#E9E3D9]">
          <button
            onClick={() => setActiveView('photo')}
            id="btn-view-photo"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeView === 'photo'
                ? 'bg-[#2E3A46] text-white shadow-sm'
                : 'text-[#2E3A46] hover:text-[#D48C8C]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Foto Real
          </button>
          <button
            onClick={() => setActiveView('schematic')}
            id="btn-view-schematic"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeView === 'schematic'
                ? 'bg-[#2E3A46] text-white shadow-sm'
                : 'text-[#2E3A46] hover:text-[#D48C8C]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Esquema Cores
          </button>
        </div>
      </div>

      {/* Main Display Container */}
      <div className="relative p-6 flex flex-col md:flex-row items-center justify-center min-h-[360px] md:min-h-[420px] gap-8">
        
        <AnimatePresence mode="wait">
          {activeView === 'photo' ? (
            /* Tab 1: Static High-fidelity Real Photo */
            <motion.div
              key="photo-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center space-y-4"
            >
              <div 
                onClick={() => setZoomImage(!zoomImage)}
                className={`relative overflow-hidden rounded-2xl border border-[#E9E3D9] bg-white cursor-zoom-in transition-all duration-300 shadow-sm ${
                  zoomImage ? 'max-w-md scale-102 md:scale-105 z-10 border-[#D48C8C]' : 'max-w-xs'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-square transition-transform duration-700 hover:scale-108"
                />
                
                {/* Visual Accent Corner Badges */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-widest text-[#2E3A46] border border-[#E9E3D9] font-medium shadow-sm">
                  Estúdio Foto
                </div>

                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-black/75 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-mono text-center">
                *Foto estática real da peça final impressa. Clique para ampliar.
              </p>
            </motion.div>
          ) : (
            /* Tab 2: Interactive SVG Blueprint customization viewer */
            <motion.div
              key="schematic-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              {/* Left Column: Vector outline colored dynamically */}
              <div className="flex justify-center items-center bg-white border border-[#E9E3D9] rounded-2xl p-6 relative shadow-inner overflow-hidden min-h-[280px]">
                {/* Scale Multiplier CSS transform wrapper */}
                <div className={`transition-all duration-500 transform ${scaleClasses[sizeMultiplier]}`}>
                  {renderProductSchematic()}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-[#FAF6F0] rounded-lg border border-[#E9E3D9] text-[9px] text-[#8E9A86] font-mono">
                  <Scale className="w-3 h-3" />
                  {sizeMultiplier === 'standard' ? '1:1' : sizeMultiplier === 'large' ? '1.35:1' : '0.8:1'}
                </div>
              </div>

              {/* Right Column: Custom Color Details and Mapping */}
              <div className="space-y-4 text-left">
                <div className="bg-white/80 p-4 rounded-xl border border-[#E9E3D9] space-y-3">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#8E9A86] font-bold">
                    Cores Escolhidas
                  </h5>
                  
                  <div className="space-y-2.5">
                    {/* Primary Color line */}
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0 transition-colors duration-500" 
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400 tracking-wider">
                          {product.customizableParts.primaryLabel}
                        </span>
                        <span className="block text-xs font-sans text-[#2E3A46] font-medium">
                          {getColorName(colors.primary)}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Color line */}
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0 transition-colors duration-500" 
                        style={{ backgroundColor: colors.secondary }}
                      />
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400 tracking-wider">
                          {product.customizableParts.secondaryLabel}
                        </span>
                        <span className="block text-xs font-sans text-[#2E3A46] font-medium">
                          {getColorName(colors.secondary)}
                        </span>
                      </div>
                    </div>

                    {/* Tertiary Color line */}
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0 transition-colors duration-500" 
                        style={{ backgroundColor: colors.tertiary }}
                      />
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400 tracking-wider">
                          {product.customizableParts.tertiaryLabel}
                        </span>
                        <span className="block text-xs font-sans text-[#2E3A46] font-medium">
                          {getColorName(colors.tertiary)}
                        </span>
                      </div>
                    </div>

                    {/* Optional Stick/Fourth Color line */}
                    {product.customizableParts.hasStick && colors.stick && (
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0 transition-colors duration-500" 
                          style={{ backgroundColor: colors.stick }}
                        />
                        <div>
                          <span className="block text-[9px] font-mono uppercase text-gray-400 tracking-wider">
                            {product.customizableParts.stickLabel}
                          </span>
                          <span className="block text-xs font-sans text-[#2E3A46] font-medium">
                            {getColorName(colors.stick)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-start text-[10px] text-gray-500 bg-[#FAF6F0] p-3 rounded-lg border border-[#E9E3D9]/60 leading-normal">
                  <Info className="w-4 h-4 text-[#8A9BB4] shrink-0 mt-0.5" />
                  <p>
                    As cores acima são selecionadas no painel de filamentos ao lado e mostram exatamente qual filamento será injetado em cada camada da impressora.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer Banner Info */}
      <div className="bg-white border-t border-[#E9E3D9] px-6 py-3.5 flex flex-wrap items-center justify-between text-[11px] text-gray-500 font-mono">
        <span className="flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[#D48C8C]" />
          Dimensão: <strong className="text-gray-700">{product.dimensions}</strong>
        </span>
        <span className="hidden sm:inline">•</span>
        <span>Peso Estimado: <strong className="text-gray-700">{product.weightGrams}g PLA</strong></span>
        <span className="hidden sm:inline">•</span>
        <span>{sizeLabels[sizeMultiplier]}</span>
      </div>

    </div>
  );
}
