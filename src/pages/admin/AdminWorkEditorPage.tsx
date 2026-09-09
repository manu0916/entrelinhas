import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  Paperclip,
  Check,
  Eye,
  Save,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Work, Category, Attachment } from '../../types';
import { api } from '../../services/api';
import { AutoCover } from '../../components/common/AutoCover';
import { Modal } from '../../components/common/Modal';
import { showToast } from '../../components/common/Toast';

export const AdminWorkEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'files' | 'publish'>('info');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Ademir');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfKey, setPdfKey] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');
  const [pdfSize, setPdfSize] = useState(0);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverKey, setCoverKey] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
      if (!isEditing && cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    });

    if (isEditing && id) {
      api.getAdminWorks().then((works) => {
        const found = works.find((w) => w.id === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setSummary(found.summary);
          setAuthor(found.author);
          setCategoryId(found.category_id);
          setTags(found.tags || []);
          setTagsInput((found.tags || []).join(', '));
          setStatus(found.status);
          setIsFeatured(found.is_featured);
          setPdfKey(found.pdf_key);
          setPdfFilename(found.pdf_filename);
          setPdfSize(found.pdf_size);
          setCoverKey(found.cover_key || null);
          setAttachments(found.attachments || []);
        } else {
          showToast('Trabalho não encontrado.', 'error');
          navigate('/admin');
        }
      });
    }
  }, [id, isEditing, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleTagsChange = (val: string) => {
    setTagsInput(val);
    setIsDirty(true);
    const parsed = val.split(',').map((t) => t.trim()).filter(Boolean);
    setTags(parsed);
  };

  const handlePdfSelected = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, pdf: 'O arquivo deve estar no formato PDF.' }));
      return;
    }
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({ ...prev, pdf: 'O arquivo excede o limite máximo de 25 MB.' }));
      return;
    }
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.pdf;
      return copy;
    });
    setPdfFile(file);
    setPdfFilename(file.name);
    setPdfSize(file.size);
    setIsDirty(true);
  };

  const handleCoverSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, cover: 'A capa deve ser uma imagem.' }));
      return;
    }
    setCoverFile(file);
    setIsDirty(true);
  };

  const handleAttachmentSelected = async (file: File) => {
    try {
      const uploaded = await api.uploadFile(file, 'attachment');
      const ext = file.name.split('.').pop() || '';
      const newAttachment: Attachment = {
        id: 'att_' + Date.now(),
        name: file.name,
        key: uploaded.key,
        size: file.size,
        type: ext.toLowerCase()
      };
      setAttachments((prev) => [...prev, newAttachment]);
      setIsDirty(true);
      showToast(`Anexo "${file.name}" adicionado.`, 'success');
    } catch {
      showToast('Erro ao anexar arquivo.', 'error');
    }
  };

  const removeAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'O título é obrigatório.';
    if (!summary.trim()) newErrors.summary = 'O resumo é obrigatório.';
    if (!categoryId) newErrors.category = 'Selecione uma categoria.';
    if (!pdfKey && !pdfFile) newErrors.pdf = 'O arquivo PDF é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let finalPdfKey = pdfKey;
      let finalCoverKey = coverKey;
      if (pdfFile) {
        setUploadProgress(0);
        const uploadedPdf = await api.uploadFile(pdfFile, 'pdf', (p) => setUploadProgress(p));
        finalPdfKey = uploadedPdf.key;
      }
      if (coverFile) {
        const uploadedCover = await api.uploadFile(coverFile, 'cover');
        finalCoverKey = uploadedCover.key;
      }
      const workPayload: Partial<Work> = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: summary.trim(),
        author: author.trim(),
        category_id: categoryId,
        tags,
        status,
        is_featured: isFeatured,
        pdf_key: finalPdfKey,
        pdf_filename: pdfFilename,
        pdf_size: pdfSize,
        cover_key: finalCoverKey,
        attachments
      };
      if (isEditing && id) {
        await api.updateWork(id, workPayload);
        showToast('Trabalho atualizado com sucesso!', 'success');
      } else {
        await api.createWork(workPayload);
        showToast('Trabalho publicado com sucesso!', 'success');
      }
      setIsDirty(false);
      navigate('/admin');
    } catch (err) {
      showToast('Erro ao salvar publicação.', 'error');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-pine uppercase tracking-wider">
              {isEditing ? 'Edição de Publicação' : 'Nova Publicação'}
            </span>
            <h1 className="font-serif font-bold text-2xl text-ink">
              {title || (isEditing ? 'Editar Trabalho' : 'Cadastrar Trabalho')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-reading hover:bg-paper text-ink rounded-lg text-xs font-semibold border border-border-subtle transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-pine" />
            <span>Pré-visualizar</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-pine hover:bg-pine-hover disabled:opacity-60 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-marker" />
                <span>Gravando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-marker" />
                <span>{status === 'published' ? 'Publicar Agora' : 'Salvar Rascunho'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex border-b border-border-subtle text-sm">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-3 px-6 font-medium border-b-2 transition-colors ${
            activeTab === 'info' ? 'border-pine text-pine font-semibold' : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          1. Informações Básicas
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-3 px-6 font-medium border-b-2 transition-colors ${
            activeTab === 'files' ? 'border-pine text-pine font-semibold' : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          2. Arquivos & Capa
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`py-3 px-6 font-medium border-b-2 transition-colors ${
            activeTab === 'publish' ? 'border-pine text-pine font-semibold' : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          3. Publicação & Visibilidade
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'info' && (
          <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Título do Trabalho *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Metodologias Ativas e Tecnologias Abertas na Educação"
                className={`w-full px-3.5 py-2.5 bg-paper rounded-lg border text-sm text-ink focus:outline-none ${
                  errors.title ? 'border-terracotta' : 'border-border-subtle focus:border-pine'
                }`}
              />
              {errors.title && <p className="text-xs text-terracotta mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Identificador de URL (Slug) *
              </label>
              <div className="flex items-center">
                <span className="text-xs text-ink-muted bg-paper px-3 py-2.5 rounded-l-lg border border-r-0 border-border-subtle font-mono">
                  /trabalhos/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="titulo-do-trabalho"
                  className="w-full px-3.5 py-2.5 bg-paper rounded-r-lg border border-border-subtle text-xs font-mono text-ink focus:border-pine focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  Categoria Temática *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setIsDirty(true);
                  }}
                  className={`w-full px-3.5 py-2.5 bg-paper rounded-lg border text-sm text-ink focus:outline-none ${
                    errors.category ? 'border-terracotta' : 'border-border-subtle focus:border-pine'
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-terracotta mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  Autor da Publicação *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Resumo Curto & Descrição *
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Apresente os principais pontos, método e objetivos do trabalho..."
                className={`w-full px-3.5 py-2.5 bg-paper rounded-lg border text-sm text-ink focus:outline-none leading-relaxed ${
                  errors.summary ? 'border-terracotta' : 'border-border-subtle focus:border-pine'
                }`}
              />
              {errors.summary && <p className="text-xs text-terracotta mt-1">{errors.summary}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Palavras-chave / Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Ex: Educação, Filosofia, Tecnologia Aberta"
                className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle text-sm text-ink focus:border-pine focus:outline-none"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="bg-paper px-2 py-0.5 rounded text-xs text-ink-muted border border-border-subtle">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pine" />
                  <span>Arquivo PDF Principal (Obrigatório) *</span>
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  O PDF será utilizado para a leitura progressiva no site e para download gratuito (máximo 25 MB).
                </p>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handlePdfSelected(e.dataTransfer.files[0]);
                }}
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-border-subtle hover:border-pine rounded-xl p-8 text-center cursor-pointer transition-colors bg-paper/50 hover:bg-paper"
              >
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handlePdfSelected(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-pine mx-auto mb-2" />
                <p className="text-sm font-semibold text-ink">
                  {pdfFilename ? 'Clique para substituir o arquivo PDF' : 'Selecione ou arraste o arquivo PDF aqui'}
                </p>
                <p className="text-xs text-ink-muted mt-1">Limite máximo de 25 MB por publicação.</p>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-ink font-medium">
                    <span>Enviando arquivo ao armazenamento seguro...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-paper rounded-full overflow-hidden border border-border-subtle">
                    <div className="h-full bg-pine transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {(pdfFilename || pdfKey) && (
                <div className="flex items-center justify-between p-3.5 bg-paper rounded-lg border border-border-subtle">
                  <div className="flex items-center gap-2.5 truncate">
                    <Check className="w-4 h-4 text-pine shrink-0" />
                    <span className="text-xs font-semibold text-ink truncate">{pdfFilename}</span>
                  </div>
                  <span className="text-xs text-ink-muted shrink-0 ml-2 font-mono">
                    {formatFileSize(pdfSize)}
                  </span>
                </div>
              )}
              {errors.pdf && <p className="text-xs text-terracotta">{errors.pdf}</p>}
            </div>

            <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                  <Image className="w-4 h-4 text-terracotta" />
                  <span>Capa Personalizada (Opcional)</span>
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Se nenhuma imagem for enviada, o sistema gerará automaticamente uma capa tipográfica com diagramação editorial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-36 shrink-0">
                  {coverFile ? (
                    <img
                      src={URL.createObjectURL(coverFile)}
                      alt="Pré-visualização da capa"
                      className="w-full aspect-[3/4] object-cover rounded-md shadow-sm border border-border-subtle"
                    />
                  ) : coverKey ? (
                    <img
                      src={`/api/files/cover/${slug}`}
                      alt="Capa cadastrada"
                      className="w-full aspect-[3/4] object-cover rounded-md shadow-sm border border-border-subtle"
                    />
                  ) : (
                    <AutoCover
                      title={title || 'Título do Trabalho'}
                      category={categories.find((c) => c.id === categoryId)?.name || 'Categoria'}
                      author={author}
                      size="sm"
                    />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCoverSelected(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-4 py-2 bg-paper hover:bg-black/5 rounded-lg border border-border-subtle text-xs font-semibold text-ink transition-colors"
                  >
                    {coverFile || coverKey ? 'Substituir Imagem de Capa' : 'Enviar Imagem Personalizada'}
                  </button>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    Recomendado: proporção 3:4 nos formatos JPG, PNG ou WebP.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-terracotta" />
                    <span>Anexos Opcionais (DOCX, PPTX)</span>
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Materiais de apoio como slides de apresentação ou arquivos complementares.
                  </p>
                </div>

                <input
                  type="file"
                  ref={attachmentInputRef}
                  accept=".docx,.pptx,.xlsx,.zip"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleAttachmentSelected(e.target.files[0]);
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-paper hover:bg-black/5 rounded-lg border border-border-subtle text-xs font-medium text-ink transition-colors"
                >
                  Adicionar Anexo
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 bg-paper rounded-lg border border-border-subtle text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="font-medium text-ink truncate">{att.name}</span>
                        <span className="text-ink-muted font-mono text-[10px]">({formatFileSize(att.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-ink-muted hover:text-terracotta p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="bg-reading rounded-xl border border-border-reading p-6 space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                Estado da Publicação
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    status === 'published' ? 'border-pine bg-pine-light' : 'border-border-subtle bg-paper hover:bg-black/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={() => {
                      setStatus('published');
                      setIsDirty(true);
                    }}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-serif font-bold text-sm text-ink block">Publicado no Site</span>
                    <span className="text-xs text-ink-muted leading-relaxed">
                      Aparecerá imediatamente no catálogo público com leitura e download disponíveis.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    status === 'draft' ? 'border-terracotta bg-terracotta/10' : 'border-border-subtle bg-paper hover:bg-black/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={() => {
                      setStatus('draft');
                      setIsDirty(true);
                    }}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-serif font-bold text-sm text-ink block">Salvar como Rascunho Privado</span>
                    <span className="text-xs text-ink-muted leading-relaxed">
                      Ficará inacessível ao público geral. Somente você poderá visualizar e editar.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 rounded text-pine focus:ring-pine"
                />
                <div>
                  <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-marker" />
                    <span>Fixar na seção de Destaques da Página Inicial</span>
                  </span>
                  <span className="text-xs text-ink-muted block mt-0.5">
                    Trabalhos em destaque ganham posição prioritária na abertura do site.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}
      </form>

      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Pré-visualização da Publicação"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex gap-5 items-start">
              <div className="w-32 shrink-0">
                <AutoCover
                  title={title || 'Título do Trabalho'}
                  category={categories.find((c) => c.id === categoryId)?.name || 'Categoria'}
                  author={author}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-pine bg-pine-light px-2.5 py-0.5 rounded-full">
                  {categories.find((c) => c.id === categoryId)?.name || 'Categoria'}
                </span>
                <h3 className="font-serif font-bold text-xl text-ink leading-snug">
                  {title || 'Título não definido'}
                </h3>
                <p className="text-xs text-ink-muted">Por {author}</p>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-4">
                  {summary || 'Resumo do trabalho...'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
              <span>Arquivo: {pdfFilename || 'Nenhum PDF selecionado'}</span>
              <span>Status: <strong>{status === 'published' ? 'Público' : 'Rascunho'}</strong></span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};