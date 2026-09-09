import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Tags, Check, AlertCircle } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { showToast } from '../../components/common/Toast';

export const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch {
      showToast('Erro ao carregar categorias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setSortOrder(categories.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setSortOrder(cat.sort_order || 1);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const genSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(genSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('O nome da categoria é obrigatório.', 'error');
      return;
    }

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: description.trim(),
          sort_order: Number(sortOrder)
        });
        showToast('Categoria atualizada!', 'success');
      } else {
        await api.createCategory({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: description.trim(),
          sort_order: Number(sortOrder)
        });
        showToast('Categoria criada com sucesso!', 'success');
      }
      setModalOpen(false);
      loadCategories();
    } catch {
      showToast('Erro ao salvar categoria.', 'error');
    }
  };

  const handleDelete = async (cat: Category) => {
    if (cat.count && cat.count > 0) {
      alert(`A categoria "${cat.name}" possui ${cat.count} trabalho(s) associado(s). Reatribua as publicações antes de excluí-la.`);
      return;
    }

    if (confirm(`Tem certeza de que deseja excluir a categoria "${cat.name}"?`)) {
      try {
        await api.deleteCategory(cat.id);
        showToast('Categoria removida.', 'success');
        loadCategories();
      } catch {
        showToast('Erro ao excluir categoria.', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper transition-colors"
            title="Voltar ao painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-pine uppercase tracking-wider">
              Organização do Acervo
            </span>
            <h1 className="font-serif font-bold text-2xl text-ink">
              Categorias Temáticas
            </h1>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pine hover:bg-pine-hover text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Lista de Categorias */}
      <div className="bg-reading rounded-xl border border-border-reading overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-ink-muted">Carregando categorias...</div>
        ) : categories.length > 0 ? (
          <div className="divide-y divide-border-subtle">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-ink">{cat.name}</span>
                    <span className="font-mono text-[10px] text-ink-muted bg-paper px-2 py-0.5 rounded border border-border-subtle">
                      /{cat.slug}
                    </span>
                    <span className="text-xs font-medium text-pine bg-pine-light px-2 py-0.5 rounded-full">
                      {cat.count ?? 0} {cat.count === 1 ? 'publicação' : 'publicações'}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-ink-muted max-w-xl">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-ink-muted hover:text-pine rounded hover:bg-paper"
                    title="Editar categoria"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-ink-muted hover:text-terracotta rounded hover:bg-paper"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-ink-muted">
            Nenhuma categoria cadastrada.
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição de Categoria */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Nome da Categoria *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Monografias & Artigos"
              className="w-full px-3 py-2 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Slug da URL *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="monografias-artigos"
              className="w-full px-3 py-2 bg-paper rounded-lg border border-border-subtle text-xs font-mono text-ink focus:border-pine focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Descrição Curta (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do conteúdo desta categoria..."
              className="w-full px-3 py-2 bg-paper rounded-lg border border-border-subtle text-xs text-ink focus:border-pine focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-border-subtle rounded-lg text-xs font-medium text-ink hover:bg-paper"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-pine hover:bg-pine-hover text-white rounded-lg text-xs font-semibold"
            >
              {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
