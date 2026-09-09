import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  RotateCw,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Configuração do Worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfReaderProps {
  pdfUrl: string;
  title: string;
  slug: string;
  fileSize?: number;
}

export const PdfReader: React.FC<PdfReaderProps> = ({
  pdfUrl,
  title,
  slug,
  fileSize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fitWidth, setFitWidth] = useState<boolean>(false);

  // Carrega o documento PDF
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      withCredentials: false,
      // Suporte nativo a requisições de intervalo (Range headers)
      disableRange: false,
      disableStream: false
    });

    loadingTask.promise
      .then((doc) => {
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Erro ao carregar o PDF:", err);
          setError("Não foi possível carregar o leitor de PDF diretamente no navegador.");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      loadingTask.destroy();
    };
  }, [pdfUrl]);

  // Renderiza a página atual no canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;
    let isCancelled = false;
    setRendering(true);

    pdfDoc.getPage(currentPage).then((page) => {
      if (isCancelled || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      let effectiveScale = scale;
      if (fitWidth && containerRef.current) {
        const unscaledViewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current.clientWidth - 40;
        if (containerWidth > 200) {
          effectiveScale = containerWidth / unscaledViewport.width;
        }
      }

      // Alta resolução para telas Retina/High-DPI
      const pixelRatio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: effectiveScale });

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTask = page.render(renderContext);
      renderTask.promise
        .then(() => {
          if (!isCancelled) {
            setRendering(false);
            // Renderização da camada de seleção de texto
            renderTextLayer(page, viewport);
          }
        })
        .catch((err: any) => {
          if (err?.name !== 'RenderingCancelledException') {
            console.error("Erro ao renderizar a página:", err);
          }
          if (!isCancelled) setRendering(false);
        });
    });

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, fitWidth]);

  // Camada de texto para seleção e cópia de citações
  const renderTextLayer = (page: pdfjsLib.PDFPageProxy, viewport: pdfjsLib.PageViewport) => {
    if (!textLayerRef.current) return;
    const textLayerDiv = textLayerRef.current;
    textLayerDiv.innerHTML = '';
    textLayerDiv.style.width = `${Math.floor(viewport.width)}px`;
    textLayerDiv.style.height = `${Math.floor(viewport.height)}px`;

    page.getTextContent().then((textContent) => {
      pdfjsLib.renderTextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport: viewport,
        textDivs: []
      });
    }).catch(() => {
      // Documento digitalizado sem OCR/texto selecionável
    });
  };

  // Navegação por teclado (Setas Esquerda/Direita)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleZoomIn = () => {
    setFitWidth(false);
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setFitWidth(false);
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const toggleFitWidth = () => {
    setFitWidth((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="leitor"
      className={`flex flex-col bg-[#2A343D] text-paper rounded-xl overflow-hidden shadow-modal border border-black/20 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full my-8'
      }`}
    >
      {/* Barra de Ferramentas Ergonômica */}
      <div className="bg-[#1E262C] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm select-none z-10">
        {/* Controles de Página */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-white"
            title="Página anterior (Seta esquerda)"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 font-mono text-xs text-white/90">
            <span className="font-semibold">{currentPage}</span>
            <span className="text-white/40">/</span>
            <span>{totalPages || '—'}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-white"
            title="Próxima página (Seta direita)"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Controles de Zoom e Ajuste */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={loading}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Diminuir zoom (-)"
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs px-1 text-white/70 w-12 text-center">
            {fitWidth ? 'Ajustar' : `${Math.round(scale * 100)}%`}
          </span>

          <button
            onClick={handleZoomIn}
            disabled={loading}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Aumentar zoom (+)"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFitWidth}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              fitWidth ? 'bg-pine text-white font-medium' : 'hover:bg-white/10 text-white/80'
            }`}
            title="Ajustar à largura da tela"
          >
            Largura
          </button>
        </div>

        {/* Ações de Download e Modo Ampliado */}
        <div className="flex items-center gap-2">
          <a
            href={`/api/files/download/${slug}`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-pine hover:bg-pine-hover text-white text-xs font-medium shadow-sm transition-colors"
            title="Baixar arquivo PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-marker" />
            <span className="hidden sm:inline">Baixar PDF</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors hidden sm:block"
            title={isFullscreen ? "Sair da tela cheia" : "Modo leitura em tela cheia"}
            aria-label="Alternar tela cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Abrir PDF nativo em outra aba"
            aria-label="Abrir em outra aba"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Área de Leitura do Canvas com Rolagem Fluida */}
      <div className="relative flex-1 min-h-[500px] overflow-auto flex items-center justify-center p-4 sm:p-8 bg-[#181F24]">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-white/80 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-marker" />
            <span className="text-sm font-medium">Carregando documento...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 text-center max-w-md p-6 bg-reading/5 rounded-xl border border-white/10 text-white">
            <AlertCircle className="w-10 h-10 text-terracotta" />
            <h4 className="font-serif font-bold text-lg">Erro na Leitura</h4>
            <p className="text-xs text-white/70 leading-relaxed">{error}</p>
            <a
              href={`/api/files/download/${slug}`}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-pine hover:bg-pine-hover text-white rounded-lg text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Baixar arquivo para leitura offline</span>
            </a>
          </div>
        )}

        {/* Canvas de Alta Resolução e Camada de Texto */}
        <div
          className={`relative shadow-2xl bg-white rounded-xs ${loading || error ? 'hidden' : 'block'}`}
        >
          <canvas ref={canvasRef} className="block select-none" />
          <div
            ref={textLayerRef}
            className="absolute inset-0 pointer-events-auto overflow-hidden text-transparent select-text"
            style={{ lineHeight: 1 }}
          />
          {rendering && (
            <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
              <Loader2 className="w-3 h-3 animate-spin text-amber-marker" />
              <span>Renderizando</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
