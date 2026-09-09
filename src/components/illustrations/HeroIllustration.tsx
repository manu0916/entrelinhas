import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-lg h-auto" }) => {
  return (
    <div className={`relative ${className} select-none`}>
      <svg
        viewBox="0 0 540 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-md"
        aria-hidden="true"
      >
        {/* Fundo suave / aura */}
        <circle cx="270" cy="200" r="170" fill="#E8F1EF" fillOpacity="0.6" />
        <circle cx="390" cy="110" r="45" fill="#FAECE7" fillOpacity="0.5" />
        <circle cx="120" cy="290" r="55" fill="#FDF7E7" fillOpacity="0.6" />

        {/* Livros de base empilhados */}
        <g id="stacked-books">
          {/* Livro inferior 1 */}
          <rect x="90" y="320" width="280" height="34" rx="4" fill="#245B57" />
          <path d="M370 324H378V350H370V324Z" fill="#F8F4EB" stroke="#202B33" strokeWidth="1.2" />
          <line x1="110" y1="337" x2="330" y2="337" stroke="#EAC568" strokeWidth="2.5" strokeLinecap="round" />

          {/* Livro inferior 2 */}
          <rect x="115" y="284" width="230" height="30" rx="3" fill="#C97552" />
          <path d="M345 288H352V310H345V288Z" fill="#F8F4EB" stroke="#202B33" strokeWidth="1.2" />
          <line x1="135" y1="299" x2="310" y2="299" stroke="#F8F4EB" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />
        </g>

        {/* Caderno aberto central - Composição Principal */}
        <g id="open-notebook" className="transform -translate-y-2">
          {/* Sombra da encadernação */}
          <ellipse cx="270" cy="272" rx="145" ry="18" fill="#202B33" fillOpacity="0.08" />

          {/* Capa de couro/tecido do caderno */}
          <path
            d="M130 255C130 255 190 242 270 242C350 242 410 255 410 255V148C410 148 350 135 270 135C190 135 130 148 130 148V255Z"
            fill="#202B33"
          />

          {/* Páginas esquerdas (Folhas abertas) */}
          <path
            d="M138 248C138 248 195 238 266 238V133C195 133 138 143 138 143V248Z"
            fill="#FFFFFF"
            stroke="#EAE3D2"
            strokeWidth="1.5"
          />
          {/* Páginas direitas */}
          <path
            d="M274 238C345 238 402 248 402 248V143C402 143 345 133 274 133V238Z"
            fill="#F8F4EB"
            stroke="#EAE3D2"
            strokeWidth="1.5"
          />

          {/* Lombada com costura e ilhoses */}
          <path d="M266 133H274V238H266V133Z" fill="#EAE3D2" />
          <line x1="270" y1="130" x2="270" y2="242" stroke="#245B57" strokeWidth="2.2" />

          {/* Marcador de fita de cetim terracota caindo do caderno */}
          <path
            d="M270 135C270 115 285 98 305 92C312 90 318 95 320 102L320 185L326 179L332 185V95C332 82 320 72 305 76C275 84 270 112 270 135Z"
            fill="#C97552"
          />

          {/* Pauta e anotações desenhadas na página esquerda */}
          <line x1="158" y1="156" x2="225" y2="154" stroke="#245B57" strokeWidth="2.5" strokeLinecap="round" />
          {/* Traços com animação SVG de escrita */}
          <line x1="158" y1="172" x2="248" y2="170" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" className="animate-stroke-draw" />
          <line x1="158" y1="186" x2="240" y2="184" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
          <line x1="158" y1="200" x2="245" y2="198" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
          <line x1="158" y1="214" x2="218" y2="212" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />

          {/* Destaque tipo marca-texto amarelo na página esquerda */}
          <rect x="156" y="181" width="70" height="8" rx="2" fill="#EAC568" fillOpacity="0.55" />

          {/* Página direita: esboço de gráfico conceitual / diagrama */}
          <line x1="294" y1="156" x2="350" y2="157" stroke="#C97552" strokeWidth="2" strokeLinecap="round" />
          <circle cx="320" cy="188" r="16" fill="none" stroke="#245B57" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="334" y1="198" x2="368" y2="212" stroke="#245B57" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="355" y="195" width="28" height="18" rx="3" fill="#FAECE7" stroke="#C97552" strokeWidth="1.2" />
          <line x1="294" y1="226" x2="382" y2="228" stroke="#202B33" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        </g>

        {/* Caneta-tinteiro clássica repousando na diagonal */}
        <g id="fountain-pen" className="transform rotate-12 origin-bottom-right">
          {/* Corpo da caneta */}
          <path d="M375 145L445 75C448 72 453 72 456 75L462 81C465 84 465 89 462 92L392 162L375 145Z" fill="#202B33" />
          {/* Anel dourado */}
          <path d="M388 158L394 152L399 157L393 163L388 158Z" fill="#EAC568" />
          {/* Pena de aço/ouro com corte */}
          <path d="M375 145L360 160C358 162 358 165 360 167L368 175C370 177 373 177 375 175L390 160L375 145Z" fill="#EAC568" />
          <line x1="358" y1="167" x2="378" y2="147" stroke="#202B33" strokeWidth="1.2" />
          <circle cx="370" cy="155" r="1.5" fill="#202B33" />
        </g>

        {/* Elementos botânicos e faíscas de criatividade */}
        <g id="sparks-and-leaves">
          {/* Faíscas / Estrelas do saber */}
          <path d="M430 180L432 186L438 188L432 190L430 196L428 190L422 188L428 186L430 180Z" fill="#EAC568" />
          <path d="M125 115L127 121L133 123L127 125L125 131L123 125L117 123L123 121L125 115Z" fill="#C97552" />
          <circle cx="455" cy="225" r="3.5" fill="#245B57" />
          <circle cx="95" cy="245" r="2.5" fill="#EAC568" />

          {/* Ramo botânico estilizado ao lado */}
          <path
            d="M75 190Q95 170 100 145"
            stroke="#245B57"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M85 180Q92 170 88 165Q80 170 85 180Z" fill="#245B57" />
          <path d="M96 160Q106 156 104 148Q96 150 96 160Z" fill="#245B57" />
        </g>
      </svg>
    </div>
  );
};
