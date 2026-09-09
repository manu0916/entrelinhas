import React from 'react';

interface CategoryBookmarkProps {
  color?: 'pine' | 'terracotta' | 'amber';
  className?: string;
  size?: number;
}

export const CategoryBookmark: React.FC<CategoryBookmarkProps> = ({
  color = 'pine',
  className = "w-5 h-7 inline-block",
  size
}) => {
  const colors = {
    pine: { fill: '#245B57', accent: '#EAC568' },
    terracotta: { fill: '#C97552', accent: '#FAECE7' },
    amber: { fill: '#EAC568', accent: '#202B33' },
  };

  const current = colors[color] || colors.pine;

  return (
    <svg
      viewBox="0 0 20 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size * 1.4 } : undefined}
      aria-hidden="true"
    >
      {/* Fita de marcador com recorte clássico em cauda de andorinha */}
      <path
        d="M2 0H18V26L10 20L2 26V0Z"
        fill={current.fill}
      />
      {/* Costura interna pontilhada */}
      <path
        d="M4.5 2V22L10 17.8L15.5 22V2"
        stroke={current.accent}
        strokeWidth="1"
        strokeDasharray="1.5 1.5"
        strokeOpacity="0.7"
        fill="none"
      />
    </svg>
  );
};
