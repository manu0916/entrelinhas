import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, ArrowUpRight, Bookmark } from 'lucide-react';
import { Work, Category, SiteSettings } from '../types';
import { api } from '../services/api';
import { HeroIllustration } from '../components/illustrations/HeroIllustration';
import { HandDrawnUnderline, MarginAnnotation } from '../components/illustrations/EditorialAccents';
import { EmptyShelfIllustration } from '../components/illustrations/EmptyShelfIllustration';
import { WorkCard } from '../components/common/WorkCard';
import { CardSkeleton } from '../components/common/Skeleton';

export const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);
  const [recentWorks, setRecentWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedSettings, loadedFeatured, worksResponse, loadedCategories] = await Promise.all([
          api.getSettings(),
          api.getFeaturedWorks(),
          api.getWorks({ limit: 4, sort: 'recent' }),
          api.getCategories()
        ]);

        setSettings(loadedSettings);
        setFeaturedWorks(loadedFeatured);
        setRecentWorks(worksResponse.items);
        setCategories(loadedCategories);
      } catch (err) {
        console.error("Erro ao carregar dados da página inicial:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-12">
      {/* SEÇÃO HERO EDITORIAL */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Texto de Abertura */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-border-subtle text-xs font-semibold text-pine tracking-wide">
                <MarginAnnotation className="w-3.5 h-3.5 text-amber-marker" />
                <span>Biblioteca Digital Pessoal & Aberta</span>
              </div>

              <div className="relative">
                <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.12]">
                  {settings?.hero_title || "Ideias que merecem sair do caderno."}
                </h1>
                <div className="mt-2">
                  <HandDrawnUnderline className="w-48 sm:w-64 h-3.5" color="#EAC568" />
                </div>
              </div>

              <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl font-normal">
                {settings?.site_tagline || "Trabalhos, pesquisas e projetos para ler, aprender e baixar."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/trabalhos"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-pine hover:bg-pine-hover text-white rounded-lg font-medium text-base shadow-sm hover:shadow transition-all duration-200 focus-visible:ring-2 focus-visible:ring-pine"
                >
                  <BookOpen className="w-5 h-5 text-amber-marker" />
                  <span>Explorar trabalhos</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-reading hover:bg-white text-ink rounded-lg font-medium text-sm border border-border-subtle hover:border-ink/20 shadow-xs transition-colors"
                >
                  <span>Sobre o autor</span>
                </Link>
              </div>

              {/* Destaque sutil de gratuidade e abertura */}
              <div className="flex items-center gap-6 pt-4 text-xs text-ink-muted border-t border-border-subtle/80 max-w-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pine" />
                  <span>Sem necessidade de cadastro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  <span>Leitura integrada no navegador</span>
                </div>
              </div>
            </div>

            {/* Ilustração Principal em SVG */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HeroIllustration className="w-full max-w-md lg:max-w-none" />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO TRABALHOS EM DESTAQUE */}
      {featuredWorks.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-border-subtle">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-terracotta uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seleção Curada</span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink">
                Trabalhos em Destaque
              </h2>
            </div>
            <Link
              to="/trabalhos"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-sm font-medium text-pine hover:text-pine-hover transition-colors"
            >
              <span>Ver todo o catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredWorks.slice(0, 4).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO CATEGORIAS DE CONHECIMENTO */}
      {categories.length > 0 && (
        <section className="bg-[#EFE9DC]/70 border-y border-border-subtle py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold text-pine uppercase tracking-wider">
                Navegue por Linhas Temáticas
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink mt-1">
                Cadernos & Categorias
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/trabalhos?cat=${cat.slug}`}
                  className="group bg-reading p-5 rounded-xl border border-border-reading shadow-xs hover:shadow-editorial transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Bookmark className="w-4 h-4 text-terracotta" />
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-paper text-ink-muted">
                        {cat.count ?? 0} {cat.count === 1 ? 'trabalho' : 'trabalhos'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-ink group-hover:text-pine transition-colors mb-1.5">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-pine">
                    <span>Explorar linha</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO PUBLICAÇÕES RECENTES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-border-subtle">
          <div>
            <div className="text-xs font-semibold text-pine uppercase tracking-wider mb-1">
              Últimas Atualizações
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink">
              Publicações Recentes
            </h2>
          </div>
          <Link
            to="/trabalhos"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-sm font-medium text-pine hover:text-pine-hover transition-colors"
          >
            <span>Ver acervo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentWorks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <div className="bg-reading rounded-2xl border border-border-reading p-12 text-center my-6">
            <EmptyShelfIllustration title="Nenhuma publicação recente cadastrada ainda." />
            <h3 className="font-serif font-bold text-xl text-ink mt-3">A estante está vazia</h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto mt-2">
              As primeiras pesquisas e projetos estão sendo preparados e organizados no caderno. Em breve novas publicações estarão disponíveis para leitura.
            </p>
          </div>
        )}
      </section>

      {/* SEÇÃO SOBRE O AUTOR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-reading rounded-2xl border border-border-reading shadow-editorial p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-10 w-6 h-12 bg-terracotta rounded-b-md" />

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-pine text-amber-marker flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-sm">
              {settings?.author_name?.charAt(0) || 'A'}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                  Sobre o Autor
                </span>
                <h3 className="font-serif font-bold text-2xl text-ink">
                  {settings?.author_name || 'Ademir'}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                {settings?.author_bio ||
                  'Pesquisador, autor e entusiasta da disseminação do conhecimento livre. Reúno aqui minhas pesquisas, cadernos de estudo e relatórios técnicos para leitura aberta e download gratuito.'}
              </p>

              <div className="pt-2">
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:text-pine-hover"
                >
                  <span>Conhecer mais sobre o projeto e trajetória</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
