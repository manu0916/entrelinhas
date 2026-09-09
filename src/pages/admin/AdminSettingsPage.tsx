import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, User, Globe, Check, Loader2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { showToast } from '../../components/common/Toast';

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [siteName, setSiteName] = useState('Entrelinhas');
  const [siteTagline, setSiteTagline] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');

  useEffect(() => {
    api.getSettings().then((data) => {
      setSiteName(data.site_name || 'Entrelinhas');
      setSiteTagline(data.site_tagline || '');
      setHeroTitle(data.hero_title || '');
      setAuthorName(data.author_name || '');
      setAuthorBio(data.author_bio || '');
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        site_name: siteName.trim() || 'Entrelinhas',
        site_tagline: siteTagline.trim(),
        hero_title: heroTitle.trim(),
        author_name: authorName.trim(),
        author_bio: authorBio.trim()
      });
      showToast('Configurações atualizadas com sucesso!', 'success');
    } catch {
      showToast('Erro ao salvar configurações.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-xs text-ink-muted">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
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
              Personalização
            </span>
            <h1 className="font-serif font-bold text-2xl text-ink">
              Configurações do Site & Autor
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-pine hover:bg-pine-hover disabled:opacity-60 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-marker" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-amber-marker" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidade do Site */}
        <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
          <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2">
            <Globe className="w-4 h-4 text-pine" />
            <span>Identidade do Site</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Nome do Site / Marca *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Ex: Entrelinhas"
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
            />
            <p className="text-[11px] text-ink-muted mt-1">
              Exibido no cabeçalho, no rodapé e nos metadados de compartilhamento.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Título de Abertura da Página Inicial (Hero Title)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Ex: Ideias que merecem sair do caderno."
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Subtítulo / Apresentação Geral
            </label>
            <input
              type="text"
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
              placeholder="Ex: Trabalhos, pesquisas e projetos para ler, aprender e baixar."
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
            />
          </div>
        </div>

        {/* Informações do Autor */}
        <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
          <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2">
            <User className="w-4 h-4 text-terracotta" />
            <span>Perfil do Autor</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Nome do Autor / Pesquisador *
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ex: Ademir"
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
              Biografia & Apresentação
            </label>
            <textarea
              rows={4}
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              placeholder="Escreva sobre sua trajetória acadêmica, áreas de pesquisa e motivação do projeto..."
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none leading-relaxed"
            />
            <p className="text-[11px] text-ink-muted mt-1">
              Exibida na seção "Sobre o Autor" da página inicial e na página dedicada /sobre.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
