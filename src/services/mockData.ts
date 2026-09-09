import { Work, Category, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_pesquisas',
    name: 'Pesquisas Acadêmicas',
    slug: 'pesquisas-academicas',
    description: 'Artigos científicos, monografias e relatórios técnicos aprofundados.',
    sort_order: 1,
    count: 2
  },
  {
    id: 'cat_cadernos',
    name: 'Cadernos de Estudo',
    slug: 'cadernos-de-estudo',
    description: 'Anotações estruturadas, sínteses conceituais e guias de referência.',
    sort_order: 2,
    count: 1
  },
  {
    id: 'cat_ensaios',
    name: 'Ensaios & Reflexões',
    slug: 'ensaios-e-reflexoes',
    description: 'Textos opinativos, análises de conjuntura e críticas metodológicas.',
    sort_order: 3,
    count: 1
  },
  {
    id: 'cat_projetos',
    name: 'Projetos Aplicados',
    slug: 'projetos-aplicados',
    description: 'Estudos de caso, metodologias práticas e propostas de intervenção.',
    sort_order: 4,
    count: 1
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'Entrelinhas',
  site_tagline: 'Trabalhos, pesquisas e projetos para ler, aprender e baixar.',
  hero_title: 'Ideias que merecem sair do caderno.',
  author_name: 'Ademir',
  author_bio: 'Pesquisador, autor e entusiasta da disseminação do conhecimento livre. Reúno aqui minhas pesquisas, cadernos de estudo e relatórios técnicos para leitura aberta e download gratuito.',
  author_role: 'Pesquisador & Autor'
};

// Um PDF de demonstração público e estável para leitura integrada inicial
const DEMO_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

export const INITIAL_WORKS: Work[] = [
  {
    id: 'work_1',
    slug: 'metodologias-ativas-educacao-contemporanea',
    title: 'Metodologias Ativas e Tecnologias Abertas na Educação Contemporânea',
    summary: 'Investigação aprofundada sobre os impactos da autonomia discente através de plataformas abertas de aprendizado e recursos educacionais acessíveis.',
    author: 'Ademir',
    category_id: 'cat_pesquisas',
    category_name: 'Pesquisas Acadêmicas',
    category_slug: 'pesquisas-academicas',
    tags: ['Educação', 'Tecnologia Aberta', 'Pedagogia'],
    status: 'published',
    is_featured: true,
    pdf_key: 'demo/metodologias.pdf',
    pdf_filename: 'metodologias_ativas_ademir.pdf',
    pdf_size: 2450000,
    cover_key: null,
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-05-15T14:30:00Z',
    published_at: '2026-05-12T09:00:00Z',
    attachments: [
      { id: 'att_1', name: 'Slides da Apresentação.pptx', key: 'att/slides.pptx', size: 1540000, type: 'pptx' }
    ]
  },
  {
    id: 'work_2',
    slug: 'caderno-de-estudos-filosofia-da-tecnologia',
    title: 'Caderno de Estudos: Fundamentos da Filosofia da Técnica e Informação',
    summary: 'Compilação de fichamentos críticos, mapas conceituais e anotações marginais sobre a evolução dos aparatos técnicos de Simondon a Flusser.',
    author: 'Ademir',
    category_id: 'cat_cadernos',
    category_name: 'Cadernos de Estudo',
    category_slug: 'cadernos-de-estudo',
    tags: ['Filosofia', 'Teoria da Informação', 'Caderno'],
    status: 'published',
    is_featured: true,
    pdf_key: 'demo/filosofia_tecnica.pdf',
    pdf_filename: 'caderno_filosofia_tecnica.pdf',
    pdf_size: 1820000,
    cover_key: null,
    created_at: '2026-06-01T11:00:00Z',
    updated_at: '2026-06-02T16:00:00Z',
    published_at: '2026-06-01T11:00:00Z'
  },
  {
    id: 'work_3',
    slug: 'ensaio-sobre-o-futuro-das-bibliotecas-digitais',
    title: 'O Silêncio dos Fichários: Ensaio sobre Memória e Preservação Digital',
    summary: 'Reflexão ensaística sobre como a efemeridade das redes desafia a perenidade dos acervos intelectuais públicos e o papel das bibliotecas independentes.',
    author: 'Ademir',
    category_id: 'cat_ensaios',
    category_name: 'Ensaios & Reflexões',
    category_slug: 'ensaios-e-reflexoes',
    tags: ['Memória', 'Cultura Digital', 'Ensaio'],
    status: 'published',
    is_featured: false,
    pdf_key: 'demo/ensaio_bibliotecas.pdf',
    pdf_filename: 'ensaio_silencio_ficharios.pdf',
    pdf_size: 980000,
    cover_key: null,
    created_at: '2026-07-20T08:30:00Z',
    updated_at: '2026-07-20T08:30:00Z',
    published_at: '2026-07-20T08:30:00Z'
  },
  {
    id: 'work_4',
    slug: 'projeto-arquitetura-da-informacao-acervos-locais',
    title: 'Arquitetura da Informação e Indexação Semântica para Acervos Comunitários',
    summary: 'Especificação técnica e manual de implementação de sistemas distribuídos e de baixo custo para catalogação e consulta de memória local.',
    author: 'Ademir',
    category_id: 'cat_projetos',
    category_name: 'Projetos Aplicados',
    category_slug: 'projetos-aplicados',
    tags: ['Catalogação', 'Sistemas', 'Comunidade'],
    status: 'published',
    is_featured: false,
    pdf_key: 'demo/arquitetura_informacao.pdf',
    pdf_filename: 'projeto_acervos_comunitarios.pdf',
    pdf_size: 3200000,
    cover_key: null,
    created_at: '2026-08-14T14:00:00Z',
    updated_at: '2026-08-15T09:15:00Z',
    published_at: '2026-08-14T14:00:00Z'
  }
];

export const getDemoPdfUrl = () => DEMO_PDF_URL;
