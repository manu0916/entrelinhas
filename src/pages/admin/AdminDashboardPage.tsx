import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Settings,
  Tags,
  Search,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  LogOut,
  CheckCircle2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Work, Category } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { showToast } from '../../components/common/Toast';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal de confirmação de exclusão identificando a obra
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loadedWorks, loadedCategories] = await Promise.all([
        api.getAdminWorks(),
        api.getCategories()
      ]);
      setWorks(loadedWorks);
      setCategories(loadedCategories);
    } catch (err) {
      console.error("Erro ao carregar dados do painel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (work: Work) => {
    const newStatus = work.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateWork(work.id, { status: newStatus });
      showToast(`Trabalho ${newStatus === 'published' ? 'publicado' : 'salvo como rascunho'}!`, 'success');
      loadData();
    } catch {
      showToast('Erro ao atualizar status.', 'error');
    }
  };

  const handleToggleFeatured = async (work: Work) => {
    try {
      await api.updateWork(work.id, { is_featured: !work.is_featured });
      showToast(`Destaque ${!work.is_featured ? 'ativado' : 'removido'}!`, 'success');
      loadData();
    } catch {
      showToast('Erro ao atualizar destaque.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!workToDelete) return;
    setDeleting(true);
    try {
      await api.deleteWork(workToDelete.id);
      showToast(`"${workToDelete.title}" excluído com sucesso.`, 'success');
      setWorkToDelete(null);
      loadData();
    } catch {
      showToast('Erro ao excluir trabalho.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredWorks = works.filter((w) => {
    const matchSearch =
      w.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.author.toLowerCase().includes(searchFilter.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ? true : w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalWorks = works.length;
  const publishedCount = works.filter((w) => w.status === 'published').length;
  const draftCount = works.filter((w) => w.status === 'draft').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Barra de Cabeçalho do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-semibold text-pine uppercase tracking-wider">
            Painel de Controle
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink">
            Gestão do Acervo
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/trabalhos/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-pine hover:bg-pine-hover text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Trabalho</span>
          </Link>

          <Link
            to="/admin/categorias"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-reading hover:bg-paper text-ink rounded-lg text-xs font-medium border border-border-subtle transition-colors"
            title="Gerenciar Categorias"
          >
            <Tags className="w-4 h-4 text-pine" />
            <span className="hidden sm:inline">Categorias</span>
          </Link>

          <Link
            to="/admin/configuracoes"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-reading hover:bg-paper text-ink rounded-lg text-xs font-medium border border-border-subtle transition-colors"
            title="Configurações do Site e Autor"
          >
            <Settings className="w-4 h-4 text-ink-muted" />
            <span className="hidden sm:inline">Configurações</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="p-2 text-ink-muted hover:text-terracotta rounded-lg hover:bg-paper transition-colors"
            title="Sair da Administração"
            aria-label="Encerrar sessão"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-reading p-4 rounded-xl border border-border-reading">
          <span className="text-xs text-ink-muted">Total de Obras</span>
          <div className="font-serif font-bold text-2xl text-ink mt-1">{totalWorks}</div>
        </div>
        <div className="bg-reading p-4 rounded-xl border border-border-reading">
          <span className="text-xs text-pine font-medium">Publicados no Site</span>
          <div className="font-serif font-bold text-2xl text-pine mt-1">{publishedCount}</div>
        </div>
        <div className="bg-reading p-4 rounded-xl border border-border-reading">
          <span className="text-xs text-terracotta font-medium">Rascunhos Privados</span>
          <div className="font-serif font-bold text-2xl text-terracotta mt-1">{draftCount}</div>
        </div>
        <div className="bg-reading p-4 rounded-xl border border-border-reading">
          <span className="text-xs text-ink-muted">Categorias Ativas</span>
          <div className="font-serif font-bold text-2xl text-ink mt-1">{categories.length}</div>
        </div>
      </div>

      {/* Filtros e Busca de Obras */}
      <div className="bg-reading p-4 rounded-xl border border-border-reading flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por título..."
            className="w-full pl-9 pr-3 py-2 bg-paper rounded-lg border border-border-subtle text-xs text-ink focus:border-pine focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-ink-muted">Status:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-pine text-white' : 'bg-paper text-ink hover:bg-black/5'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'published' ? 'bg-pine text-white' : 'bg-paper text-ink hover:bg-black/5'
            }`}
          >
            Publicados
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'draft' ? 'bg-pine text-white' : 'bg-paper text-ink hover:bg-black/5'
            }`}
          >
            Rascunhos
          </button>
        </div>
      </div>

      {/* Tabela de Publicações */}
      <div className="bg-reading rounded-xl border border-border-reading shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-ink-muted">Carregando acervo...</div>
        ) : filteredWorks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead className="bg-paper border-b border-border-subtle text-ink-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Trabalho</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Destaque</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/60">
                {filteredWorks.map((work) => (
                  <tr key={work.id} className="hover:bg-paper/40 transition-colors">
                    {/* Título & Arquivo */}
                    <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                      <div className="font-serif font-bold text-sm text-ink line-clamp-1">
                        {work.title}
                      </div>
                      <div className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <FileText className="w-3 h-3 text-terracotta" />
                        <span className="truncate">{work.pdf_filename}</span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="bg-paper px-2 py-0.5 rounded border border-border-subtle text-ink-muted font-medium">
                        {work.category_name || 'Geral'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(work)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          work.status === 'published'
                            ? 'bg-pine-light text-pine hover:bg-pine/20'
                            : 'bg-terracotta/15 text-terracotta hover:bg-terracotta/25'
                        }`}
                        title="Clique para alternar entre publicado e rascunho"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${work.status === 'published' ? 'bg-pine' : 'bg-terracotta'}`} />
                        <span>{work.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                      </button>
                    </td>

                    {/* Destaque */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(work)}
                        className={`p-1 rounded transition-colors ${
                          work.is_featured
                            ? 'text-amber-marker hover:text-amber-600'
                            : 'text-ink-muted/40 hover:text-ink-muted'
                        }`}
                        title={work.is_featured ? 'Remover dos destaques' : 'Adicionar aos destaques'}
                        aria-label="Alternar destaque"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Data */}
                    <td className="py-4 px-4 whitespace-nowrap text-ink-muted text-[11px]">
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).format(new Date(work.published_at || work.created_at))}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {work.status === 'published' && (
                          <Link
                            to={`/trabalhos/${work.slug}`}
                            target="_blank"
                            className="p-1.5 text-ink-muted hover:text-pine rounded hover:bg-paper"
                            title="Ver página pública"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/trabalhos/editar/${work.id}`}
                          className="p-1.5 text-ink-muted hover:text-pine rounded hover:bg-paper"
                          title="Editar trabalho"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setWorkToDelete(work)}
                          className="p-1.5 text-ink-muted hover:text-terracotta rounded hover:bg-paper"
                          title="Excluir trabalho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-ink-muted space-y-3">
            <FileText className="w-8 h-8 mx-auto text-ink-muted/50" />
            <p className="text-sm font-medium">Nenhum trabalho encontrado para os filtros.</p>
            <Link
              to="/admin/trabalhos/novo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar a primeira publicação</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão Identificando a Obra */}
      {workToDelete && (
        <Modal
          isOpen={!!workToDelete}
          onClose={() => setWorkToDelete(null)}
          title="Confirmar Exclusão de Publicação"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-terracotta/10 rounded-lg text-terracotta text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Atenção: esta ação não pode ser desfeita.</span>
                <p>O arquivo PDF associado e os anexos serão removidos do armazenamento seguro.</p>
              </div>
            </div>

            <div className="text-sm text-ink space-y-1">
              <p>Tem certeza de que deseja excluir permanentemente o trabalho:</p>
              <p className="font-serif font-bold text-base text-ink bg-paper p-3 rounded-lg border border-border-subtle">
                "{workToDelete.title}"
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setWorkToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-border-subtle text-xs font-medium text-ink hover:bg-paper transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold transition-colors"
              >
                {deleting ? 'Excluindo...' : 'Sim, excluir trabalho'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
