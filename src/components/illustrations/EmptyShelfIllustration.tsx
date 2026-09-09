import React from 'react';

export const EmptyShelfIllustration: React.FC<{ className?: string; title?: string }> = ({
  className = "w-72 h-56 mx-auto",
  title = "Nenhuma publicação cadastrada"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto mb-4"
        aria-hidden="true"
      >
        {/* Parede de fundo com iluminação aconchegante */}
        <ellipse cx="140" cy="90" rx="90" ry="60" fill="#E8F1EF" fillOpacity="0.7" />

        {/* Prateleira de madeira sólida superior */}
        <rect x="25" y="65" width="230" height="12" rx="3" fill="#C97552" />
        <rect x="35" y="77" width="210" height="4" fill="#B36342" />

        {/* Suportes de ferro trabalhado da prateleira superior */}
        <path d="M45 77V98C45 98 45 106 58 106" stroke="#202B33" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M235 77V98C235 98 235 106 222 106" stroke="#202B33" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Prateleira de madeira sólida inferior */}
        <rect x="20" y="145" width="240" height="14" rx="3" fill="#245B57" />
        <rect x="28" y="159" width="224" height="4" fill="#1B4542" />

        {/* Apoio de livros decorativo (bookend de coruja ou folha em latão) */}
        <path d="M70 145V115C70 112 73 110 76 110H86V145H70Z" fill="#EAC568" />
        <circle cx="78" cy="122" r="3" fill="#202B33" />

        {/* Uma única folha de rascunho com clipe aguardando novas ideias */}
        <rect x="180" y="105" width="36" height="40" rx="2" fill="#FFFFFF" stroke="#EAE3D2" strokeWidth="1.2" transform="rotate(6 180 105)" />
        <line x1="186" y1="116" x2="208" y2="119" stroke="#C97552" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="187" y1="123" x2="210" y2="126" stroke="#202B33" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
        <line x1="189" y1="130" x2="204" y2="132" stroke="#202B33" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />

        {/* Clipe de papel amarelo segurando a folha */}
        <path d="M190 100V112C190 114 192 116 194 116C196 116 198 114 198 112V98C198 94 194 92 191 92C188 92 184 94 184 98V114" stroke="#EAC568" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Partículas sutis de poeira dourada flutuando na luz */}
        <circle cx="120" cy="50" r="2" fill="#EAC568" />
        <circle cx="165" cy="40" r="1.5" fill="#EAC568" />
        <circle cx="145" cy="115" r="2" fill="#C97552" fillOpacity="0.6" />
      </svg>
      <span className="sr-only">{title}</span>
    </div>
  );
};
