import { Env } from '../types';
import { getD1Settings, getD1Categories, getD1Works, getD1FeaturedWorks, getD1WorkBySlug } from '../db';
import { streamPdfFromR2, downloadPdfFromR2 } from '../storage';
import { getAuthenticatedAdmin } from '../auth';

export async function handlePublicRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // GET /api/settings
  if (path === '/api/settings') {
    const settings = await getD1Settings(env);
    return Response.json(settings);
  }

  // GET /api/categories
  if (path === '/api/categories') {
    const categories = await getD1Categories(env);
    return Response.json(categories);
  }

  // GET /api/works/featured
  if (path === '/api/works/featured') {
    const featured = await getD1FeaturedWorks(env);
    return Response.json(featured);
  }

  // GET /api/works
  if (path === '/api/works') {
    const q = url.searchParams.get('q') || undefined;
    const cat = url.searchParams.get('cat') || undefined;
    const year = url.searchParams.get('year') || undefined;
    const sort = url.searchParams.get('sort') || 'recent';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '8', 10);

    const result = await getD1Works({ query: q, category: cat, year, sort, page, limit }, env);
    return Response.json(result);
  }

  // GET /api/works/:slug
  if (path.startsWith('/api/works/') && !path.startsWith('/api/works/featured')) {
    const slug = path.substring('/api/works/'.length);
    const work = await getD1WorkBySlug(slug, env);
    if (!work) {
      return new Response(JSON.stringify({ error: 'Publicação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se for rascunho, só exibe se for admin autenticado
    if (work.status === 'draft') {
      const admin = await getAuthenticatedAdmin(request, env);
      if (!admin) {
        return new Response(JSON.stringify({ error: 'Publicação não encontrada' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return Response.json(work);
  }

  // GET /api/files/stream/:slug
  if (path.startsWith('/api/files/stream/')) {
    const slug = path.substring('/api/files/stream/'.length);
    const work = await getD1WorkBySlug(slug, env);
    if (!work) return new Response("Arquivo não encontrado", { status: 404 });

    const admin = await getAuthenticatedAdmin(request, env);
    const isDraft = work.status === 'draft';
    const isAdmin = Boolean(admin);

    return await streamPdfFromR2(work.pdf_key, request, env, isDraft, isAdmin);
  }

  // GET /api/files/download/:slug
  if (path.startsWith('/api/files/download/')) {
    const slug = path.substring('/api/files/download/'.length);
    const work = await getD1WorkBySlug(slug, env);
    if (!work) return new Response("Arquivo não encontrado", { status: 404 });

    const admin = await getAuthenticatedAdmin(request, env);
    const isDraft = work.status === 'draft';
    const isAdmin = Boolean(admin);

    return await downloadPdfFromR2(work.pdf_key, work.pdf_filename || `${work.slug}.pdf`, env, isDraft, isAdmin);
  }

  // GET /api/files/cover/:slug
  if (path.startsWith('/api/files/cover/')) {
    const slug = path.substring('/api/files/cover/'.length);
    const work = await getD1WorkBySlug(slug, env);
    if (!work || !work.cover_key) {
      return new Response("Capa não encontrada", { status: 404 });
    }

    const object = await env.BUCKET.get(work.cover_key);
    if (!object) return new Response("Capa não encontrada", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=86400');
    return new Response(object.body as any, { status: 200, headers });
  }

  return new Response("Not Found", { status: 404 });
}
