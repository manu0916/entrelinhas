import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, BookOpen, User, ArrowRight } from 'lucide-react';
import { BrandSymbol } from '../illustrations/BrandSymbol';

interface HeaderProps {
  siteName?: string;
}

export const Header: React.FC<HeaderProps> = ({ siteName = "Entrelinhas" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menus ao navegar
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trabalhos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Trabalhos', href: '/trabalhos' },
    { name: 'Sobre', href: '/sobre' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-border-subtle shadow-sm py-3'
            : 'bg-paper/80 backdrop-blur-xs py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo e Nome da Marca */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-pine rounded-lg p-1"
            aria-label={`${siteName} - Página Inicial`}
          >
            <BrandSymbol className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-200 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl text-ink tracking-tight leading-none group-hover:text-pine transition-colors">
                {siteName}
              </span>
              <span className="text-[10px] tracking-wider text-ink-muted uppercase font-medium mt-0.5">
                Biblioteca Digital
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegação Principal">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-pine font-semibold bg-pine-light'
                      : 'text-ink-muted hover:text-ink hover:bg-black/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Ações: Busca e Menu Mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-ink-muted hover:text-ink hover:bg-black/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-pine"
              aria-label="Abrir busca rápida"
              title="Buscar trabalhos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink-muted hover:text-ink hover:bg-black/5 rounded-md focus-visible:ring-2 focus-visible:ring-pine"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Busca Rápida */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-reading rounded-xl shadow-modal border border-border-reading p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-border-subtle pb-3">
              <Search className="w-5 h-5 text-pine shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, assunto, palavra-chave..."
                className="w-full bg-transparent text-ink text-base placeholder:text-ink-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-ink-muted hover:text-ink rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="pt-3 text-xs text-ink-muted flex items-center justify-between">
              <span>Pressione <kbd className="px-1.5 py-0.5 bg-paper rounded border border-border-subtle font-mono">Enter</kbd> para pesquisar</span>
              <button
                type="button"
                onClick={() => {
                  navigate('/trabalhos');
                  setSearchOpen(false);
                }}
                className="text-pine hover:underline font-medium"
              >
                Ver todos os trabalhos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Drawer Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-reading shadow-modal p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <BrandSymbol className="w-7 h-7" />
                  <span className="font-serif font-bold text-lg text-ink">{siteName}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-ink-muted hover:text-ink rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between p-3 rounded-lg text-base font-medium text-ink hover:bg-paper transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-ink-muted" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-border-subtle">
              <Link
                to="/trabalhos"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-pine hover:bg-pine-hover text-white rounded-lg font-medium text-sm transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Acervo</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
