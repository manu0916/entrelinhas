import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal, FileText } from 'lucide-react';
import { Work, Category, WorkFilters } from '../types';
import { api } from '../services/api';
import { WorkCard } from '../components/common/WorkCard';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptySearchIllustration } from '../components/illustrations/EmptySearchIllustration';
import { EmptyShelfIllustration } from '../components/illustrations/EmptyShelfIllustration';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados dos filtros sincronizados com URL
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';
  const yearParam = searchParams.get('year') || '';
  const sortParam = (searchParams.get('sort') as any) || 'recent';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Anos disponíveis para filtro
  const availableYears = ['2026', '2025', '2024', '2023'];

  // Carrega categorias
  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Carrega trabalhos sempre que os parâmetros da URL mudam
  useEffect(() => {
    setLoading(true);
    const filters: WorkFilters = {
      query: queryParam,
      category: categoryParam,
      year: yearParam,
      sort: sortParam,
      page: pageParam,
      limit: 6
    };

    api.getWorks(filters)
      .then((res) => {
        setWorks(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [queryParam, categoryParam, yearParam, sortParam, pageParam]);

  // Atualiza parâmetros na URL de forma limpa
  const updateFilters = (newParams: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    // Ao filtrar, volta para página 1 se não for explicitamente definida
    if (!('page' in newParams)) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchQuery.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = !!(queryParam || categoryParam || yearParam || (sortParam && sortParam !== 'recent'));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Título da Página Editorial */}
      <div>
        <span className="text-xs font-semibold text-pine uppercase tracking-wider">
          Biblioteca Digital
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
          Catálogo de Trabalhos & Pesquisas
        </h1>
        <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl">
          Explore todas as publicações, ensaios e projetos organizados. Utilize os filtros temáticos, leia no próprio site ou baixe em formato PDF.
        </p>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-reading p-5 rounded-2xl border border-border-reading shadow-editorial space-y-4">
        {/* Formulário de Busca por Texto */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-5 h-5 text-pine absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título, resumo ou assunto..."
            className="w-full pl-11 pr-24 py-3 bg-paper rounded-xl border border-border-subtle focus:border-pine focus:outline-none text-sm text-ink placeholder:text-ink-muted"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 bg-pine hover:bg-pine-hover text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Linha de Seletores (Categoria, Ano, Ordenação) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-muted flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrar:</span>
            </span>

            {/* Dropdown de Categorias */}
            <select
              value={categoryParam}
              onChange={(e) => updateFilters({ cat: e.target.value || null })}
              className="bg-paper border border-border-subtle text-ink rounded-lg px-3 py-1.5 focus:border-pine focus:outline-none"
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.count ?? 0})
                </option>
              ))}
            </select>

            {/* Dropdown de Ano */}
            <select
              value={yearParam}
              onChange={(e) => updateFilters({ year: e.target.value || null })}
              className="bg-paper border border-border-subtle text-ink rounded-lg px-3 py-1.5 focus:border-pine focus:outline-none"
              aria-label="Filtrar por ano"
            >
              <option value="">Todos os Anos</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-ink-muted">Ordenar:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilters({ sort: e.target.value || null })}
              className="bg-paper border border-border-subtle text-ink rounded-lg px-3 py-1.5 focus:border-pine focus:outline-none"
              aria-label="Ordenar trabalhos"
            >
              <option value="recent">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Indicadores Ativos e Botão Limpar */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-muted">Filtros ativos:</span>
            {queryParam && (
              <span className="inline-flex items-center gap-1 bg-paper px-2 py-0.5 rounded border border-border-subtle text-ink">
                Busca: "{queryParam}"
                <button onClick={() => updateFilters({ q: null })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryParam && (
              <span className="inline-flex items-center gap-1 bg-paper px-2 py-0.5 rounded border border-border-subtle text-ink">
                Categoria: {categories.find(c => c.slug === categoryParam)?.name || categoryParam}
                <button onClick={() => updateFilters({ cat: null })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {yearParam && (
              <span className="inline-flex items-center gap-1 bg-paper px-2 py-0.5 rounded border border-border-subtle text-ink">
                Ano: {yearParam}
                <button onClick={() => updateFilters({ year: null })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-terracotta hover:underline font-semibold ml-2"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Contagem de Resultados */}
      <div className="flex items-center justify-between text-xs text-ink-muted px-1">
        <span>
          Mostrando <strong>{works.length}</strong> de <strong>{total}</strong> {total === 1 ? 'publicação' : 'publicações'}
        </span>
      </div>

      {/* Lista de Trabalhos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <div className="bg-reading rounded-2xl border border-border-reading p-12 text-center">
          <EmptySearchIllustration title="Nenhum trabalho corresponde aos filtros aplicados" />
          <h3 className="font-serif font-bold text-xl text-ink mt-3">Nenhum resultado encontrado</h3>
          <p className="text-sm text-ink-muted max-w-md mx-auto mt-2">
            Não encontramos trabalhos para os termos ou filtros selecionados. Tente buscar por outros temas ou limpe os filtros.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-pine hover:bg-pine-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Limpar filtros e ver tudo
          </button>
        </div>
      ) : (
        <div className="bg-reading rounded-2xl border border-border-reading p-12 text-center">
          <EmptyShelfIllustration title="Nenhum trabalho disponível" />
          <h3 className="font-serif font-bold text-xl text-ink mt-3">Nenhuma publicação cadastrada</h3>
          <p className="text-sm text-ink-muted max-w-md mx-auto mt-2">
            Os trabalhos estão sendo preparados. Volte em breve para conferir novas pesquisas.
          </p>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => updateFilters({ page: (pageParam - 1).toString() })}
            disabled={pageParam <= 1}
            className="p-2 rounded-lg border border-border-subtle bg-reading text-ink disabled:opacity-40 disabled:hover:bg-reading hover:bg-paper transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono text-ink-muted px-3">
            Página <strong>{pageParam}</strong> de <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => updateFilters({ page: (pageParam + 1).toString() })}
            disabled={pageParam >= totalPages}
            className="p-2 rounded-lg border border-border-subtle bg-reading text-ink disabled:opacity-40 disabled:hover:bg-reading hover:bg-paper transition-colors"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
