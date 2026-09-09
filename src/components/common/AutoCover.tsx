import React from 'react';
import { CategoryBookmark } from '../illustrations/CategoryBookmark';

interface AutoCoverProps {
  title: string;
  category?: string;
  author?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AutoCover: React.FC<AutoCoverProps> = ({
  title,
  category = "Publicação",
  author = "Ademir",
  className = "",
  size = 'md'
}) => {
  // Gera uma paleta harmoniosa baseada no hash do título
  const palettes = [
    { bg: '#245B57', accent: '#EAC568', text: '#FFFFFF', sub: '#E8F1EF' },
    { bg: '#202B33', accent: '#C97552', text: '#F8F4EB', sub: '#A5B5BF' },
    { bg: '#C97552', accent: '#EAC568', text: '#FFFFFF', sub: '#FAECE7' },
    { bg: '#2A4441', accent: '#F8F4EB', text: '#FFFFFF', sub: '#EAC568' },
  ];

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = palettes[Math.abs(hash) % palettes.length];

  const sizeClasses = {
    sm: 'w-28 h-40 p-2.5 text-xs',
    md: 'w-full aspect-[3/4] p-4 text-sm',
    lg: 'w-full max-w-sm aspect-[3/4] p-6 text-base'
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-editorial transition-transform duration-300 flex flex-col justify-between select-none border border-black/10 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: palette.bg }}
      role="img"
      aria-label={`Capa de: ${title}`}
    >
      {/* Textura sutil de encadernação em tecido */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '8px 8px'
        }}
      />

      {/* Lombada clássica à esquerda */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/20 border-r border-white/10" />

      {/* Marcador de fita no topo direito */}
      <div className="absolute top-0 right-3">
        <CategoryBookmark color="amber" size={14} />
      </div>

      {/* Cabeçalho da capa: Categoria */}
      <div className="relative pl-2 pt-1 z-10">
        <span
          className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-black/25 backdrop-blur-xs inline-block"
          style={{ color: palette.accent }}
        >
          {category}
        </span>
      </div>

      {/* Centro: Título com tipografia editorial Fraunces */}
      <div className="relative pl-2 my-auto z-10">
        <h3
          className="font-serif font-bold leading-tight line-clamp-4 text-shadow-sm"
          style={{ color: palette.text }}
        >
          {title}
        </h3>
        <div className="w-8 h-0.5 mt-2.5 rounded-full" style={{ backgroundColor: palette.accent }} />
      </div>

      {/* Rodapé da capa: Autor */}
      <div className="relative pl-2 pt-2 border-t border-white/15 z-10 flex items-center justify-between">
        <span className="text-xs font-medium truncate" style={{ color: palette.sub }}>
          {author}
        </span>
        <span className="text-[10px] tracking-wider opacity-60 uppercase" style={{ color: palette.sub }}>
          PDF
        </span>
      </div>
    </div>
  );
};
