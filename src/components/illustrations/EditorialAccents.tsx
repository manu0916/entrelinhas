import React from 'react';

export const HandDrawnUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = "w-36 h-3",
  color = "#EAC568"
}) => (
  <svg
    viewBox="0 0 160 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 8.5C45 3.5 110 4 157 7.5M12 10.5C55 7.5 105 7 142 9.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const MarginAnnotation: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="#EAC568"
    />
    <circle cx="12" cy="11" r="1.5" fill="#245B57" />
  </svg>
);

export const BracketAccent: React.FC<{ className?: string }> = ({ className = "w-4 h-12" }) => (
  <svg
    viewBox="0 0 16 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M13 3C7 3 4 7 4 14V19C4 23 2 24 0 24C2 24 4 25 4 29V34C4 41 7 45 13 45"
      stroke="#C97552"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
