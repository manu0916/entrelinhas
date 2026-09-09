import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { Work } from '../../types';
import { AutoCover } from './AutoCover';

interface WorkCardProps {
  work: Work;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(work.published_at || work.created_at));

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <article className="group bg-reading rounded-xl border border-border-reading shadow-editorial hover:shadow-editorial-hover transition-all duration-300 flex flex-col overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 flex-1">
        {/* Capa (Personalizada ou Automática) */}
        <div className="w-full sm:w-36 shrink-0 flex justify-center sm:block">
          <Link
            to={`/trabalhos/${work.slug}`}
            className="block w-36 sm:w-full overflow-hidden rounded-md transition-transform duration-300 group-hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pine"
            tabIndex={-1}
            aria-hidden="true"
          >
            {work.cover_key ? (
              <img
                src={`/api/files/cover/${work.slug}`}
                alt={`Capa de ${work.title}`}
                className="w-full aspect-[3/4] object-cover rounded-md shadow-sm border border-border-subtle"
                loading="lazy"
              />
            ) : (
              <AutoCover
                title={work.title}
                category={work.category_name || "Publicação"}
                author={work.author}
                size="sm"
                className="w-full"
              />
            )}
          </Link>
        </div>

        {/* Conteúdo e Metadados */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Categoria e Data */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                to={`/trabalhos?cat=${work.category_slug || work.category_id}`}
                className="text-xs font-semibold text-pine bg-pine-light hover:bg-pine/15 px-2.5 py-0.5 rounded-full transition-colors"
              >
                {work.category_name || "Pesquisa"}
              </Link>
              <span className="text-border-subtle">•</span>
              <div className="flex items-center gap-1 text-xs text-ink-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Título da Publicação */}
            <h3 className="font-serif font-bold text-lg sm:text-xl text-ink group-hover:text-pine transition-colors leading-snug line-clamp-2 mb-2">
              <Link to={`/trabalhos/${work.slug}`} className="focus-visible:underline">
                {work.title}
              </Link>
            </h3>

            {/* Resumo */}
            <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed mb-4">
              {work.summary}
            </p>
          </div>

          {/* Tags e Formato */}
          <div className="pt-2 border-t border-border-subtle/70 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-paper border border-border-subtle font-mono text-[11px] font-medium text-ink">
                <FileText className="w-3 h-3 text-terracotta" />
                PDF
              </span>
              <span className="text-[11px]">{formatFileSize(work.pdf_size)}</span>
            </div>

            {work.tags && work.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 overflow-hidden">
                {work.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[11px] text-ink-muted/80 bg-paper px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações Inferiores Diretas */}
      <div className="bg-paper/60 px-5 py-3 border-t border-border-reading flex items-center justify-between gap-3">
        <Link
          to={`/trabalhos/${work.slug}#leitor`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine hover:text-pine-hover py-1.5 px-3 rounded-md hover:bg-pine/10 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ler trabalho</span>
        </Link>

        <a
          href={`/api/files/download/${work.slug}`}
          download
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink py-1.5 px-3 rounded-md hover:bg-black/5 transition-colors"
          title="Baixar arquivo PDF gratuito"
        >
          <Download className="w-3.5 h-3.5 text-terracotta" />
          <span>Baixar PDF</span>
        </a>
      </div>
    </article>
  );
};
