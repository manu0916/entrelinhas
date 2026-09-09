import { Env } from './types';
import { handleAuthRoutes } from './routes/auth';
import { handlePublicRoutes } from './routes/public';
import { handleAdminRoutes } from './routes/admin';
import { getD1WorkBySlug, getD1Settings } from './db';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. ROTEAMENTO DE API
    if (path.startsWith('/api/auth')) {
      return handleAuthRoutes(request, env);
    }

    if (path.startsWith('/api/admin')) {
      return handleAdminRoutes(request, env);
    }

    if (path.startsWith('/api/')) {
      return handlePublicRoutes(request, env);
    }

    // 2. INJEÇÃO DE METADADOS OPEN GRAPH PARA ROBÔS DE COMPARTILHAMENTO
    // WhatsApp, Twitter/X, Facebook, LinkedIn, Telegram, Discord, Googlebot
    const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|crawl|spider|whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discord/i.test(userAgent);

    if (isBot && path.startsWith('/trabalhos/')) {
      const slug = path.substring('/trabalhos/'.length).split('/')[0];
      if (slug && !slug.includes('.')) {
        const work = await getD1WorkBySlug(slug, env);
        const settings = await getD1Settings(env);
        const siteName = settings.site_name || 'Entrelinhas';

        if (work && work.status === 'published') {
          const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${work.title} — ${siteName}</title>
  <meta name="description" content="${work.summary}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${work.title}" />
  <meta property="og:description" content="${work.summary}" />
  <meta property="og:url" content="${request.url}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta name="author" content="${work.author}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${work.title}" />
  <meta name="twitter:description" content="${work.summary}" />
</head>
<body>
  <h1>${work.title}</h1>
  <p>${work.summary}</p>
  <p>Por ${work.author}</p>
</body>
</html>`;
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=UTF-8',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        }
      }
    }

    // 3. ENTREGA DE ARQUIVOS ESTÁTICOS COM FALLBACK SPA
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};
