// Tipos essenciais da aplicação Entrelinhas

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
  count?: number; // Contagem dinâmica de publicações ativas
}

export interface Attachment {
  id: string;
  name: string;
  key: string;
  size: number;
  type: string;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  summary: string;
  author: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  tags: string[];
  status: 'published' | 'draft';
  is_featured: boolean;
  pdf_key: string;
  pdf_filename: string;
  pdf_size: number;
  cover_key?: string | null;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  hero_title: string;
  author_name: string;
  author_bio: string;
  author_role?: string;
}

export interface AdminUser {
  id: string;
  username: string;
}

export interface WorkFilters {
  query?: string;
  category?: string;
  year?: string;
  sort?: 'recent' | 'oldest' | 'title';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
