import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { NotFoundIllustration } from '../components/illustrations/NotFoundIllustration';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <NotFoundIllustration />

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold text-terracotta uppercase tracking-wider">
          Erro 404 — Página Não Encontrada
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink">
          Esta página saiu do fichário
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
          O endereço digitado não corresponde a nenhuma página ou publicação existente nesta biblioteca digital.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-pine hover:bg-pine-hover text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Voltar ao início</span>
        </Link>
        <Link
          to="/trabalhos"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-reading hover:bg-paper text-ink rounded-lg text-sm font-medium border border-border-subtle transition-colors"
        >
          <Search className="w-4 h-4 text-pine" />
          <span>Buscar no catálogo</span>
        </Link>
      </div>
    </div>
  );
};
