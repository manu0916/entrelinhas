import React from 'react';

export const NotFoundIllustration: React.FC<{ className?: string }> = ({
  className = "w-80 h-64 mx-auto"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <svg
        viewBox="0 0 300 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto mb-4"
        aria-hidden="true"
      >
        {/* Sombra de fundo suave */}
        <ellipse cx="150" cy="185" rx="100" ry="18" fill="#202B33" fillOpacity="0.08" />

        {/* Fundo acolhedor */}
        <circle cx="150" cy="105" r="85" fill="#E8F1EF" fillOpacity="0.6" />

        {/* Gaveta de fichário de biblioteca aberta */}
        <rect x="75" y="115" width="150" height="65" rx="6" fill="#245B57" stroke="#1B4542" strokeWidth="2" />
        <rect x="85" y="125" width="130" height="45" rx="4" fill="#202B33" fillOpacity="0.15" />
        {/* Puxador metálico em latão com porta-etiqueta */}
        <rect x="125" y="140" width="50" height="18" rx="2" fill="#EAC568" />
        <rect x="133" y="144" width="34" height="10" rx="1" fill="#F8F4EB" />
        <text x="150" y="152" fill="#202B33" fontSize="8" fontFamily="Fraunces" fontWeight="bold" textAnchor="middle">404</text>

        {/* Manuscrito perdido e rasgado flutuando */}
        <g id="torn-manuscript" className="transform -rotate-6 origin-center">
          <path
            d="M115 50L185 42L180 120L155 116L145 122L135 117L125 123L110 118L115 50Z"
            fill="#FFFFFF"
            stroke="#EAE3D2"
            strokeWidth="1.5"
          />
          {/* Dobra superior da folha */}
          <path d="M170 44L185 42L185 58L170 44Z" fill="#EAE3D2" />

          {/* Texto incompleto com interrogação */}
          <line x1="125" y1="62" x2="168" y2="58" stroke="#C97552" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="124" y1="72" x2="172" y2="68" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="123" y1="82" x2="165" y2="78" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="122" y1="92" x2="150" y2="88" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />

          {/* Destaque terracota: página não encontrada */}
          <rect x="122" y="79" width="38" height="6" rx="1.5" fill="#FAECE7" />
        </g>

        {/* Elementos flutuantes de página perdida */}
        <circle cx="85" cy="65" r="3" fill="#EAC568" />
        <circle cx="215" cy="75" r="2.5" fill="#C97552" />
        <path d="M225 105L227 110L232 112L227 114L225 119L223 114L218 112L223 110L225 105Z" fill="#245B57" />
      </svg>
      <span className="sr-only">Página não encontrada no arquivo</span>
    </div>
  );
};
