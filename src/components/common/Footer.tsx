import React from 'react';
import { Link } from 'react-router-dom';
import { BrandSymbol } from '../illustrations/BrandSymbol';
import { Lock } from 'lucide-react';

interface FooterProps {
  siteName?: string;
  authorName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  siteName = "Entrelinhas",
  authorName = "Ademir"
}) => {
  return (
    <footer className="w-full bg-[#EFE9DC] border-t border-border-subtle mt-24 py-12 text-ink-muted text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1: Marca e Missão */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandSymbol className="w-7 h-7" />
              <span className="font-serif font-bold text-xl text-ink">{siteName}</span>
            </div>
            <p className="text-sm max-w-md text-ink-muted leading-relaxed">
              Biblioteca digital pessoal para compartilhamento aberto de pesquisas acadêmicas, cadernos de estudo e projetos. Conhecimento livre para ler no navegador e baixar gratuitamente.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="font-serif font-bold text-ink mb-3 text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-pine transition-colors">Início</Link></li>
              <li><Link to="/trabalhos" className="hover:text-pine transition-colors">Todos os Trabalhos</Link></li>
              <li><Link to="/sobre" className="hover:text-pine transition-colors">Sobre o Autor</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Categorias principais */}
          <div>
            <h4 className="font-serif font-bold text-ink mb-3 text-sm">Acervo</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/trabalhos?cat=pesquisas-academicas" className="hover:text-pine transition-colors">Pesquisas Acadêmicas</Link></li>
              <li><Link to="/trabalhos?cat=cadernos-de-estudo" className="hover:text-pine transition-colors">Cadernos de Estudo</Link></li>
              <li><Link to="/trabalhos?cat=ensaios-e-reflexoes" className="hover:text-pine transition-colors">Ensaios & Reflexões</Link></li>
              <li><Link to="/trabalhos?cat=projetos-aplicados" className="hover:text-pine transition-colors">Projetos Aplicados</Link></li>
            </ul>
          </div>
        </div>

        {/* Linha de Fechamento com Acesso Discreto ao Admin */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} {siteName}. Publicações por {authorName}. Acesso aberto e gratuito.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-ink-muted/80">Hospedado na Cloudflare</span>
            {/* Acesso discreto à administração */}
            <Link
              to="/admin"
              className="flex items-center gap-1 text-ink-muted/70 hover:text-pine transition-colors p-1 rounded"
              title="Acesso Administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Painel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
