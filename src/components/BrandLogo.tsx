import React from 'react';

interface BrandLogoProps {
  type?: 'full' | 'compact' | 'icon';
  className?: string;
  height?: number;
}

export default function BrandLogo({ type = 'compact', className = '', height }: BrandLogoProps) {
  // Brand color palette constants
  const colors = {
    coral: '#D79898',
    sage: '#9EAC97',
    cream: '#FAF5EF',
    slate: '#7D8FA4',
    darkText: '#354350',
    gold: '#C5A880',
    background: '#FAF6F0'
  };

  // Helper to render the elegant isometric 3D stacked filaments (4 rings)
  const renderStackedRings = (scale: number = 1) => {
    return (
      <g transform={`scale(${scale})`}>
        {/* Arc line behind rings */}
        <path
          d="M -25,20 A 42,42 0 1,1 42,-5"
          fill="none"
          stroke="#E5D9C8"
          strokeWidth="1.2"
          strokeDasharray="1 1"
          opacity="0.85"
        />
        <path
          d="M -30,15 A 45,45 0 0,1 30,-30"
          fill="none"
          stroke="#D0BEA9"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Level 4: Slate Blue (Bottom) */}
        <g transform="translate(0, 16)">
          {/* 3D Side extrusion */}
          <path d="M -24,0 L -24,8 L 0,17 L 24,8 L 24,0 L 0,8 Z" fill="#607287" />
          <path d="M 0,8 L 24,0 L 24,8 L 0,17 Z" fill="#526377" opacity="0.15" />
          {/* Top face */}
          <path d="M 0,-8 L 24,0 L 0,8 L -24,0 Z" fill={colors.slate} stroke="#66788D" strokeWidth="0.5" />
          {/* Inner hole */}
          <path d="M 0,-3 L 10,0 L 0,3 L -10,0 Z" fill="#4B5867" />
        </g>

        {/* Level 3: Pastel Coral */}
        <g transform="translate(0, 7)">
          <path d="M -24,0 L -24,8 L 0,17 L 24,8 L 24,0 L 0,8 Z" fill="#BD7E7E" />
          <path d="M 0,8 L 24,0 L 24,8 L 0,17 Z" fill="#A86A6A" opacity="0.15" />
          <path d="M 0,-8 L 24,0 L 0,8 L -24,0 Z" fill={colors.coral} stroke="#E29E9E" strokeWidth="0.5" />
          <path d="M 0,-3 L 10,0 L 0,3 L -10,0 Z" fill="#8C5252" />
        </g>

        {/* Level 2: Sage Green */}
        <g transform="translate(0, -2)">
          <path d="M -24,0 L -24,8 L 0,17 L 24,8 L 24,0 L 0,8 Z" fill="#808E79" />
          <path d="M 0,8 L 24,0 L 24,8 L 0,17 Z" fill="#6B7864" opacity="0.15" />
          <path d="M 0,-8 L 24,0 L 0,8 L -24,0 Z" fill={colors.sage} stroke="#A4B39D" strokeWidth="0.5" />
          <path d="M 0,-3 L 10,0 L 0,3 L -10,0 Z" fill="#54614F" />
        </g>

        {/* Level 1: Cream (Top) */}
        <g transform="translate(0, -11)">
          <path d="M -24,0 L -24,8 L 0,17 L 24,8 L 24,0 L 0,8 Z" fill="#E2DACF" />
          <path d="M 0,8 L 24,0 L 24,8 L 0,17 Z" fill="#CEBFA9" opacity="0.2" />
          <path d="M 0,-8 L 24,0 L 0,8 L -24,0 Z" fill={colors.cream} stroke="#EFE9DE" strokeWidth="0.75" />
          <path d="M 0,-3 L 10,0 L 0,3 L -10,0 Z" fill="#C5B69F" />
        </g>

        {/* Elegant Sparkly Stars */}
        {/* Sage star top left */}
        <path d="M -22,-32 Q -22,-24 -14,-24 Q -22,-24 -22,-16 Q -22,-24 -30,-24 Q -22,-24 -22,-32 Z" fill="#A8B7A1" />
        {/* Coral star mid left */}
        <path d="M -34,-10 Q -34,-5 -29,-5 Q -34,-5 -34,0 Q -34,-5 -39,-5 Q -34,-5 -34,-10 Z" fill={colors.coral} />
        {/* Blue star mid right */}
        <path d="M 28,-22 Q 28,-18 32,-18 Q 28,-18 28,-14 Q 28,-18 24,-18 Q 28,-18 28,-22 Z" fill={colors.slate} />
        {/* Tiny golden dots */}
        <circle cx="16" cy="-28" r="1.5" fill={colors.gold} />
        <circle cx="-16" cy="18" r="1" fill={colors.gold} opacity="0.6" />
      </g>
    );
  };

  if (type === 'icon') {
    return (
      <svg
        viewBox="-45 -45 90 90"
        className={className}
        style={{ height: height || '100%' }}
        id="brand-logo-icon"
      >
        {renderStackedRings(0.9)}
      </svg>
    );
  }

  if (type === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`} id="brand-logo-compact">
        {/* Logo Rings Icon Left */}
        <svg
          viewBox="-45 -45 90 90"
          className="w-9 h-9 shrink-0"
        >
          {renderStackedRings(0.95)}
        </svg>

        {/* Elegant Typography */}
        <div className="flex flex-col text-left select-none">
          <div className="flex items-baseline font-sans text-[16px] leading-tight">
            <span style={{ color: colors.coral }} className="font-serif italic font-bold">F</span>
            <span style={{ color: colors.darkText }} className="font-semibold tracking-tight -ml-[1px]">ranriib</span>
            <span style={{ color: colors.coral }} className="font-semibold tracking-tight">.</span>
            <span style={{ color: colors.sage }} className="font-medium tracking-tight">Lab</span>
          </div>
          <span className="text-[8px] font-mono tracking-widest text-[#9EAC97] uppercase -mt-0.5 font-bold">
            Design 3D que ganha forma
          </span>
        </div>
      </div>
    );
  }

  // Full Brand Logo Card Layout
  return (
    <div 
      className={`bg-white border border-[#E9E3D9] p-8 md:p-12 rounded-3xl flex flex-col items-center text-center space-y-6 shadow-sm select-none relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#FAF8F4' }}
      id="brand-logo-full-container"
    >
      {/* Background delicate circle glow */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-[#E5D9C8]/40 -top-12 -left-12 pointer-events-none" />

      {/* Main Vector Drawing Stage */}
      <div className="relative w-72 h-44 flex items-center justify-center">
        <svg viewBox="0 0 320 200" className="w-full h-full">
          {/* Isometric stack of filaments on the right */}
          <g transform="translate(245, 100)">
            {renderStackedRings(1.4)}
          </g>

          {/* Cursive Brand Typography "Franriib" on the left */}
          <g transform="translate(15, 105)">
            {/* Elegant Serif F with custom curves */}
            <path
              d="M 12,-36 C 22,-36 31,-30 36,-20 C 31,-25 24,-26 18,-24 C 18,-24 16,-10 16,0 L 16,28 C 16,33 13,35 10,35 C 7,35 6,32 6,28 L 6,0 L 6,-24 C -3,-22 -11,-15 -14,-7 C -15,-14 -12,-23 -3,-28 C -3,-28 -2,-32 4,-34 C 1,-40 -5,-42 -14,-34 C -11,-44 0,-44 12,-36 Z"
              fill={colors.coral}
            />
            {/* "ranriib" text with nice font spacing */}
            <text
              x="26"
              y="18"
              fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
              fontSize="34"
              fontWeight="500"
              fill={colors.darkText}
              letterSpacing="-1"
            >
              ranriib
            </text>
            {/* Elegant Dots for the two 'i' letters */}
            <circle cx="102" cy="-14" r="3" fill={colors.coral} />
            <circle cx="112" cy="-14" r="3" fill={colors.sage} />

            {/* "— Lab —" sub-title underneath with centered position */}
            <text
              x="72"
              y="48"
              fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
              fontSize="16"
              fontWeight="300"
              fill={colors.darkText}
              letterSpacing="6"
            >
              — Lab —
            </text>
          </g>
        </svg>
      </div>

      {/* Middle Tagline Pillars */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#7D8FA4] uppercase tracking-widest border-t border-b border-[#E9E3D9] py-2.5 w-full max-w-md">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#9EAC97]" /> Criar</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#D79898]" /> Personalizar</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7D8FA4]" /> Transformar</span>
      </div>

      {/* Lower Tagline Pill */}
      <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-[#D79898]/10 text-[#D79898] rounded-full text-xs font-mono font-medium border border-[#D79898]/20 tracking-wider">
        DESIGN 3D QUE GANHA FORMA ♡
      </div>
    </div>
  );
}
