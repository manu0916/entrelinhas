import React from 'react';

export const EmptySearchIllustration: React.FC<{ className?: string; title?: string }> = ({
  className = "w-64 h-52 mx-auto",
  title = "Nenhum resultado encontrado"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <svg
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto mb-3"
        aria-hidden="true"
      >
        {/* Círculo suave ao fundo */}
        <circle cx="120" cy="85" r="65" fill="#FAECE7" fillOpacity="0.6" />

        {/* Páginas voando / desfolhadas */}
        <path
          d="M60 95C60 95 80 85 105 92L95 130C75 125 60 135 60 135L60 95Z"
          fill="#FFFFFF"
          stroke="#EAE3D2"
          strokeWidth="1.5"
        />
        <line x1="68" y1="102" x2="88" y2="98" stroke="#202B33" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="68" y1="110" x2="92" y2="106" stroke="#202B33" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Lupa grande em ângulo investigativo */}
        <g id="magnifying-glass">
          {/* Cabo de madeira da lupa */}
          <path d="M142 108L186 152C190 156 196 156 200 152C204 148 204 142 200 138L156 94" stroke="#245B57" strokeWidth="10" strokeLinecap="round" />
          <path d="M182 148L194 136" stroke="#EAC568" strokeWidth="4" strokeLinecap="round" />

          {/* Aro da lupa */}
          <circle cx="118" cy="72" r="42" fill="#FFFFFF" fillOpacity="0.8" stroke="#C97552" strokeWidth="5" />
          
          {/* Reflexo no vidro da lupa */}
          <path d="M96 52C102 44 114 40 126 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          
          {/* Ponto de interrogação delicado desenhado sob a lente */}
          <path
            d="M112 60C112 55 116 52 121 52C126 52 129 55 129 59C129 63 124 66 121 69V75"
            stroke="#245B57"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="121" cy="83" r="2.2" fill="#245B57" />
        </g>

        {/* Pequenas faíscas de dúvida editorial */}
        <path d="M50 55L52 60L57 62L52 64L50 69L48 64L43 62L48 60L50 55Z" fill="#EAC568" />
        <circle cx="175" cy="45" r="2.5" fill="#C97552" />
      </svg>
      <span className="sr-only">{title}</span>
    </div>
  );
};
