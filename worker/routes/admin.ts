import { Env } from '../types';
import { getAuthenticatedAdmin } from '../auth';
import { getD1AdminWorks } from '../db';
import { uploadToR2, deleteFromR2 } from '../storage';

export async function handleAdminRoutes(request: Request, env: Env): Promise<Response> {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Acesso não autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // GET /api/admin/works
  if (path === '/api/admin/works' && request.method === 'GET') {
    const works = await getD1AdminWorks(env);
    return Response.json(works);
  }

  // POST /api/admin/works
  if (path === '/api/admin/works' && request.method === 'POST') {
    try {
      const data = await request.json() as any;
      const id = 'work_' + Date.now();
      const now = new Date().toISOString();

      await env.DB.prepare(`
        INSERT INTO works (
          id, slug, title, summary, author, category_id, tags, status,
          is_featured, pdf_key, pdf_filename, pdf_size, cover_key, attachments,
          created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.slug,
        data.title,
        data.summary,
        data.author,
        data.category_id,
        JSON.stringify(data.tags || []),
        data.status || 'draft',
        data.is_featured ? 1 : 0,
        data.pdf_key,
        data.pdf_filename,
        data.pdf_size,
        data.cover_key || null,
        JSON.stringify(data.attachments || []),
        now,
        now,
        data.status === 'published' ? now : null
      ).run();

      return Response.json({ success: true, id });
    } catch (err: any) {
      console.error("Erro ao criar trabalho:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // PUT /api/admin/works/:id
  if (path.startsWith('/api/admin/works/') && request.method === 'PUT') {
    const id = path.substring('/api/admin/works/'.length);
    try {
      const data = await request.json() as any;
      const now = new Date().toISOString();

      await env.DB.prepare(`
        UPDATE works SET
          slug = ?, title = ?, summary = ?, author = ?, category_id = ?,
          tags = ?, status = ?, is_featured = ?, pdf_key = ?, pdf_filename = ?,
          pdf_size = ?, cover_key = ?, attachments = ?, updated_at = ?,
          published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN ? ELSE published_at END
        WHERE id = ?
      `).bind(
        data.slug,
        data.title,
        data.summary,
        data.author,
        data.category_id,
        JSON.stringify(data.tags || []),
        data.status,
        data.is_featured ? 1 : 0,
        data.pdf_key,
        data.pdf_filename,
        data.pdf_size,
        data.cover_key || null,
        JSON.stringify(data.attachments || []),
        now,
        data.status,
        now,
        id
      ).run();

      return Response.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao atualizar trabalho:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // DELETE /api/admin/works/:id
  if (path.startsWith('/api/admin/works/') && request.method === 'DELETE') {
    const id = path.substring('/api/admin/works/'.length);
    try {
      const work = await env.DB.prepare('SELECT pdf_key, cover_key FROM works WHERE id = ?').bind(id).first<any>();
      if (work) {
        if (work.pdf_key) await deleteFromR2(work.pdf_key, env);
        if (work.cover_key) await deleteFromR2(work.cover_key, env);
      }
      await env.DB.prepare('DELETE FROM works WHERE id = ?').bind(id).run();
      return Response.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao excluir trabalho:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // POST /api/admin/upload
  if (path === '/api/admin/upload' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const type = formData.get('type') as string || 'pdf';

      if (!file) {
        return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), { status: 400 });
      }

      // Validação de 25MB
      if (file.size > 25 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Arquivo excede o limite de 25 MB' }), { status: 400 });
      }

      const ext = file.name.split('.').pop() || '';
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const key = `${type}s/${uniqueId}.${ext}`;

      const buffer = await file.arrayBuffer();
      await uploadToR2(buffer, key, file.type || 'application/octet-stream', env);

      return Response.json({
        key,
        name: file.name,
        size: file.size
      });
    } catch (err: any) {
      console.error("Erro no upload para R2:", err);
      return new Response(JSON.stringify({ error: 'Falha no upload do arquivo' }), { status: 500 });
    }
  }

  // CATEGORIAS: POST, PUT, DELETE
  if (path === '/api/admin/categories' && request.method === 'POST') {
    const data = await request.json() as any;
    const id = 'cat_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO categories (id, name, slug, description, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, data.name, data.slug, data.description || '', data.sort_order || 0).run();
    return Response.json({ success: true, id });
  }

  if (path.startsWith('/api/admin/categories/') && request.method === 'PUT') {
    const id = path.substring('/api/admin/categories/'.length);
    const data = await request.json() as any;
    await env.DB.prepare(`
      UPDATE categories SET name = ?, slug = ?, description = ?, sort_order = ?
      WHERE id = ?
    `).bind(data.name, data.slug, data.description || '', data.sort_order || 0, id).run();
    return Response.json({ success: true });
  }

  if (path.startsWith('/api/admin/categories/') && request.method === 'DELETE') {
    const id = path.substring('/api/admin/categories/'.length);
    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  }

  // CONFIGURAÇÕES: PUT
  if (path === '/api/admin/settings' && request.method === 'PUT') {
    const data = await request.json() as Record<string, string>;
    for (const [k, v] of Object.entries(data)) {
      await env.DB.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).bind(k, v).run();
    }
    return Response.json({ success: true });
  }

  return new Response("Not Found", { status: 404 });
}
