import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Share2,
  Copy,
  Calendar,
  FileText,
  Paperclip,
  Check
} from 'lucide-react';
import { Work } from '../types';
import { api } from '../services/api';
import { AutoCover } from '../components/common/AutoCover';
import { WorkCard } from '../components/common/WorkCard';
import { PdfReader } from '../components/reader/PdfReader';
import { WorkDetailSkeleton } from '../components/common/Skeleton';
import { showToast } from '../components/common/Toast';

export const WorkDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [work, setWork] = useState<Work | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setShowReader(false);

    api.getWorkBySlug(slug)
      .then(async (data) => {
        setWork(data);
        if (data) {
          // Atualiza o título da aba do navegador para o trabalho
          document.title = `${data.title} — Entrelinhas`;

          // Busca trabalhos relacionados da mesma categoria
          try {
            const rel = await api.getWorks({ category: data.category_slug, limit: 3 });
            setRelatedWorks(rel.items.filter(w => w.id !== data.id));
          } catch {}
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      showToast("Link copiado para a área de transferência!", "success");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share && work) {
      navigator.share({
        title: work.title,
        text: work.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return <WorkDetailSkeleton />;
  }

  if (!work) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif font-bold text-2xl text-ink">Publicação não encontrada</h2>
        <p className="text-sm text-ink-muted mt-2">
          O trabalho solicitado não existe ou está temporariamente indisponível.
        </p>
        <Link
          to="/trabalhos"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-pine text-white rounded-lg text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao catálogo</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(work.published_at || work.created_at));

  const hasUpdated = work.updated_at && work.published_at &&
    new Date(work.updated_at).getTime() - new Date(work.published_at).getTime() > 86400000;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Navegação de Retorno */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine hover:text-pine-hover p-1 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao catálogo</span>
        </button>
      </div>

      {/* Cabeçalho Editorial da Obra */}
      <div className="bg-reading rounded-2xl border border-border-reading shadow-editorial p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Capa */}
          <div className="w-44 sm:w-52 shrink-0 mx-auto sm:mx-0">
            {work.cover_key ? (
              <img
                src={`/api/files/cover/${work.slug}`}
                alt={`Capa de ${work.title}`}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-editorial border border-border-subtle"
              />
            ) : (
              <AutoCover
                title={work.title}
                category={work.category_name}
                author={work.author}
                size="md"
              />
            )}
          </div>

          {/* Dados Principais */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/trabalhos?cat=${work.category_slug}`}
                className="text-xs font-semibold text-pine bg-pine-light px-3 py-1 rounded-full hover:bg-pine/20 transition-colors"
              >
                {work.category_name}
              </Link>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publicado em {formattedDate}</span>
              </span>
              {hasUpdated && (
                <span className="text-xs text-ink-muted/80 italic">
                  (Atualizado recentemente)
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-4xl text-ink leading-tight">
              {work.title}
            </h1>

            <div className="text-sm font-medium text-ink">
              Por <span className="font-semibold text-pine">{work.author}</span>
            </div>

            <p className="text-base text-ink-muted leading-relaxed pt-2 border-t border-border-subtle">
              {work.summary}
            </p>

            {/* Tags */}
            {work.tags && work.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {work.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/trabalhos?q=${encodeURIComponent(tag)}`}
                    className="text-xs text-ink-muted bg-paper px-2.5 py-1 rounded-md border border-border-subtle hover:border-pine transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Barra de Ações Principais */}
        <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Ação Principal: Ler Agora */}
            <button
              onClick={() => {
                setShowReader(true);
                setTimeout(() => {
                  document.getElementById('leitor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pine hover:bg-pine-hover text-white rounded-lg font-medium text-sm shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-marker" />
              <span>Ler agora no site</span>
            </button>

            {/* Ação: Baixar PDF */}
            <a
              href={`/api/files/download/${work.slug}`}
              download
              className="inline-flex items-center gap-2 px-5 py-3 bg-paper hover:bg-black/5 text-ink rounded-lg font-medium text-sm border border-border-subtle transition-colors"
              title="Baixar arquivo completo em PDF"
            >
              <Download className="w-4 h-4 text-terracotta" />
              <span>Baixar PDF ({formatFileSize(work.pdf_size)})</span>
            </a>
          </div>

          {/* Ações de Compartilhamento */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-border-subtle bg-paper hover:bg-black/5 text-ink-muted hover:text-ink text-xs font-medium transition-colors"
              title="Copiar link da publicação"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-pine" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar link'}</span>
            </button>

            {'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="p-2.5 rounded-lg border border-border-subtle bg-paper hover:bg-black/5 text-ink-muted hover:text-ink transition-colors"
                title="Compartilhar pelo dispositivo"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leitor de Documentos Integrado */}
      {showReader && (
        <div className="animate-fade-in pt-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="font-serif font-bold text-xl text-ink flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pine" />
              <span>Leitor do Documento</span>
            </h3>
            <button
              onClick={() => setShowReader(false)}
              className="text-xs text-ink-muted hover:text-terracotta font-medium"
            >
              Ocultar leitor
            </button>
          </div>
          <PdfReader
            pdfUrl={api.getPdfStreamUrl(work.slug)}
            title={work.title}
            slug={work.slug}
            fileSize={work.pdf_size}
          />
        </div>
      )}

      {/* Anexos Complementares Opcionais (DOCX, PPTX) */}
      {work.attachments && work.attachments.length > 0 && (
        <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-terracotta" />
            <span>Materiais Anexos & Apresentações</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {work.attachments.map((att) => (
              <a
                key={att.id}
                href={`/api/files/attachment/${work.slug}/${att.id}`}
                download
                className="flex items-center justify-between p-3.5 rounded-lg bg-paper border border-border-subtle hover:border-pine transition-colors text-sm"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-pine shrink-0" />
                  <span className="font-medium text-ink truncate">{att.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-muted shrink-0 ml-3">
                  <span>{formatFileSize(att.size)}</span>
                  <Download className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trabalhos Relacionados */}
      {relatedWorks.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="border-b border-border-subtle pb-3">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
              Linha de Pesquisa
            </span>
            <h3 className="font-serif font-bold text-2xl text-ink">
              Trabalhos Relacionados
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedWorks.map((rel) => (
              <WorkCard key={rel.id} work={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
