-- Schema do Banco de Dados Cloudflare D1 para a Biblioteca Digital "Entrelinhas"

-- Categorias de publicações
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Publicações (trabalhos, pesquisas, cadernos e projetos)
CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  author TEXT NOT NULL,
  category_id TEXT NOT NULL,
  tags TEXT NOT NULL, -- formato JSON array ["tag1", "tag2"]
  status TEXT NOT NULL CHECK(status IN ('published', 'draft')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  pdf_key TEXT NOT NULL,
  pdf_filename TEXT NOT NULL,
  pdf_size INTEGER NOT NULL,
  cover_key TEXT,
  attachments TEXT, -- formato JSON array de { id, name, key, size, type }
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Configurações gerais editáveis pelo painel
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Administradores do sistema
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Sessões ativas de administradores
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Índices para alta velocidade de busca e filtros
CREATE INDEX IF NOT EXISTS idx_works_status_published ON works(status, published_at);
CREATE INDEX IF NOT EXISTS idx_works_category ON works(category_id);
CREATE INDEX IF NOT EXISTS idx_works_slug ON works(slug);
CREATE INDEX IF NOT EXISTS idx_works_featured ON works(is_featured);

-- Categorias iniciais
INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
  ('cat_pesquisas', 'Pesquisas Acadêmicas', 'pesquisas-academicas', 'Artigos científicos, monografias, dissertações e relatórios técnicos.', 1),
  ('cat_cadernos', 'Cadernos de Estudo', 'cadernos-de-estudo', 'Anotações estruturadas, sínteses conceituais e guias de referência.', 2),
  ('cat_ensaios', 'Ensaios & Reflexões', 'ensaios-e-reflexoes', 'Textos opinativos, críticas teóricas e considerações temáticas.', 3),
  ('cat_projetos', 'Projetos Aplicados', 'projetos-aplicados', 'Estudos de caso, metodologias práticas e propostas de intervenção.', 4);

-- Configurações padrão do site
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('site_name', 'Entrelinhas'),
  ('site_tagline', 'Trabalhos, pesquisas e projetos para ler, aprender e baixar.'),
  ('hero_title', 'Ideias que merecem sair do caderno.'),
  ('author_name', 'Ademir'),
  ('author_bio', 'Pesquisador, autor e entusiasta da disseminação do conhecimento livre. Reúno aqui minhas pesquisas, cadernos de estudo e relatórios técnicos para leitura aberta e download gratuito.');
