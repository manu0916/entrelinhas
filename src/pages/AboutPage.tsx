import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { api } from '../services/api';
import { BrandSymbol } from '../components/illustrations/BrandSymbol';
import { HandDrawnUnderline, MarginAnnotation } from '../components/illustrations/EditorialAccents';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Abertura Editorial */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <BrandSymbol className="w-12 h-12 mx-auto" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-light text-pine text-xs font-semibold">
          <MarginAnnotation className="w-3.5 h-3.5 text-amber-marker" />
          <span>Sobre o Projeto & Trajetória</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Conhecimento que circula, ensina e transforma.
        </h1>
        <div className="flex justify-center">
          <HandDrawnUnderline className="w-48 h-3.5" color="#C97552" />
        </div>
      </div>

      {/* Manifesto / Apresentação do Autor */}
      <div className="bg-reading rounded-2xl border border-border-reading shadow-editorial p-8 sm:p-12 space-y-8">
        <div className="prose prose-stone max-w-none text-ink leading-relaxed space-y-5 text-base sm:text-lg">
          <p className="font-serif text-xl sm:text-2xl text-ink font-semibold leading-snug">
            {settings?.author_bio ||
              'Pesquisador, autor e entusiasta da disseminação do conhecimento livre. Reúno aqui minhas pesquisas, cadernos de estudo e relatórios técnicos para leitura aberta e download gratuito.'}
          </p>

          <p className="text-ink-muted">
            O <strong>{settings?.site_name || 'Entrelinhas'}</strong> nasceu do desejo de romper as gavetas acadêmicas e os cadernos fechados. Durante anos de estudo e investigação prática, percebi que muitos dos melhores aprendizados acabam restritos a avaliações pontuais ou a repositórios burocráticos de difícil acesso.
          </p>

          <p className="text-ink-muted">
            Esta biblioteca foi construída como um espaço editorial acolhedor: sem anúncios intrusivos, sem muros de pagamento, sem necessidade de criação de conta ou captura de dados. Qualquer estudante, professor, pesquisador ou curioso pode encontrar uma pesquisa, ler diretamente no navegador com leitor integrado de alta definição e baixar o PDF com um clique.
          </p>
        </div>

        {/* Pilares do Projeto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border-subtle">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pine-light text-pine flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-serif font-bold text-base text-ink">Acesso Aberto</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Todos os trabalhos são disponibilizados integralmente e sem custo para leitura e pesquisa.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta/15 text-terracotta flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-serif font-bold text-base text-ink">Cuidado Editorial</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Tipografia pensada para leitura prolongada, capas autênticas e ilustrações originais em SVG.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-light text-ink flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-serif font-bold text-base text-ink">Perenidade & Nuvem</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Armazenamento seguro na borda da Cloudflare (D1 e R2), garantindo velocidade e disponibilidade.
            </p>
          </div>
        </div>

        {/* Chamada para ação */}
        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-ink-muted">
            Dúvidas, colaborações ou sugestões acadêmicas? Fique à vontade para citar e compartilhar.
          </div>
          <Link
            to="/trabalhos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pine hover:bg-pine-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorar publicações</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
