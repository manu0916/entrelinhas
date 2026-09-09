import { Env } from './types';

export async function getD1Settings(env: Env): Promise<Record<string, string>> {
  try {
    const { results } = await env.DB.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>();
    const out: Record<string, string> = {};
    for (const row of results || []) {
      out[row.key] = row.value;
    }
    return out;
  } catch (err) {
    console.error("Erro ao buscar configurações no D1:", err);
    return {
      site_name: 'Entrelinhas',
      site_tagline: 'Trabalhos, pesquisas e projetos para ler, aprender e baixar.',
      hero_title: 'Ideias que merecem sair do caderno.',
      author_name: 'Ademir',
      author_bio: 'Pesquisador, autor e entusiasta da disseminação do conhecimento livre.'
    };
  }
}

export async function getD1Categories(env: Env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT c.*, COUNT(w.id) as count
      FROM categories c
      LEFT JOIN works w ON (w.category_id = c.id OR w.category_id = c.slug) AND w.status = 'published'
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `).all();
    return results || [];
  } catch (err) {
    console.error("Erro ao buscar categorias no D1:", err);
    return [];
  }
}

export async function getD1Works(params: {
  query?: string;
  category?: string;
  year?: string;
  sort?: string;
  page?: number;
  limit?: number;
}, env: Env) {
  try {
    let sql = `
      SELECT w.*, c.name as category_name, c.slug as category_slug
      FROM works w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE w.status = 'published'
    `;
    const binds: any[] = [];

    if (params.query) {
      sql += ` AND (w.title LIKE ? OR w.summary LIKE ? OR w.tags LIKE ?)`;
      const q = `%${params.query}%`;
      binds.push(q, q, q);
    }

    if (params.category) {
      sql += ` AND (c.slug = ? OR w.category_id = ?)`;
      binds.push(params.category, params.category);
    }

    if (params.year) {
      sql += ` AND strftime('%Y', COALESCE(w.published_at, w.created_at)) = ?`;
      binds.push(params.year);
    }

    if (params.sort === 'oldest') {
      sql += ` ORDER BY COALESCE(w.published_at, w.created_at) ASC`;
    } else if (params.sort === 'title') {
      sql += ` ORDER BY w.title ASC`;
    } else {
      sql += ` ORDER BY COALESCE(w.published_at, w.created_at) DESC`;
    }

    const allMatching = await env.DB.prepare(sql).bind(...binds).all<any>();
    const items = allMatching.results || [];
    const total = items.length;

    const page = params.page || 1;
    const limit = params.limit || 8;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = items.slice((page - 1) * limit, page * limit).map(parseWorkRow);

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages
    };
  } catch (err) {
    console.error("Erro ao buscar trabalhos no D1:", err);
    return { items: [], total: 0, page: 1, limit: 8, totalPages: 1 };
  }
}

export async function getD1FeaturedWorks(env: Env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT w.*, c.name as category_name, c.slug as category_slug
      FROM works w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE w.status = 'published' AND w.is_featured = 1
      ORDER BY COALESCE(w.published_at, w.created_at) DESC
      LIMIT 6
    `).all<any>();
    return (results || []).map(parseWorkRow);
  } catch (err) {
    console.error("Erro ao buscar destaques no D1:", err);
    return [];
  }
}

export async function getD1WorkBySlug(slug: string, env: Env) {
  try {
    const row = await env.DB.prepare(`
      SELECT w.*, c.name as category_name, c.slug as category_slug
      FROM works w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE w.slug = ?
    `).bind(slug).first<any>();
    return row ? parseWorkRow(row) : null;
  } catch (err) {
    console.error("Erro ao buscar trabalho por slug no D1:", err);
    return null;
  }
}

export async function getD1AdminWorks(env: Env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT w.*, c.name as category_name, c.slug as category_slug
      FROM works w
      LEFT JOIN categories c ON w.category_id = c.id
      ORDER BY w.created_at DESC
    `).all<any>();
    return (results || []).map(parseWorkRow);
  } catch (err) {
    console.error("Erro ao buscar trabalhos administrativos no D1:", err);
    return [];
  }
}

function parseWorkRow(row: any) {
  let tags: string[] = [];
  try {
    tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [];
  } catch {
    tags = row.tags ? row.tags.split(',') : [];
  }

  let attachments: any[] = [];
  try {
    attachments = typeof row.attachments === 'string' ? JSON.parse(row.attachments) : row.attachments || [];
  } catch {
    attachments = [];
  }

  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    tags,
    attachments
  };
}
