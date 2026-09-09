import React from 'react';

interface BrandSymbolProps {
  className?: string;
  size?: number;
}

export const BrandSymbol: React.FC<BrandSymbolProps> = ({ className = "w-9 h-9", size }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Moldura circular/emblema com cor pinheiro */}
      <rect width="48" height="48" rx="12" fill="#245B57" />
      {/* Páginas do livro aberto */}
      <path
        d="M11 34C11 34 16 31.5 24 31.5C32 31.5 37 34 37 34V17C37 17 32 14.5 24 14.5C16 14.5 11 17 11 17V34Z"
        fill="#F8F4EB"
        stroke="#EAC568"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lombada */}
      <line x1="24" y1="14.5" x2="24" y2="31.5" stroke="#245B57" strokeWidth="2.2" strokeLinecap="round" />
      {/* Marcador de página fita terracota */}
      <path d="M24 14.5V26L26.5 24.5L29 26V15" fill="#C97552" />
      {/* Linhas de caligrafia / entrelinhas */}
      <line x1="15" y1="21.5" x2="20.5" y2="20.8" stroke="#C97552" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="15" y1="25.5" x2="21.5" y2="25" stroke="#202B33" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="26.5" y1="20.8" x2="33" y2="21.5" stroke="#202B33" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="26.5" y1="25" x2="32.5" y2="25.5" stroke="#202B33" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
};
