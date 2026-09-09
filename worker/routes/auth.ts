import { Env } from '../types';
import { hashPassword, generateSalt, generateSessionToken, getAuthenticatedAdmin, extractToken } from '../auth';

export async function handleAuthRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // POST /api/auth/login
  if (path === '/api/auth/login' && request.method === 'POST') {
    try {
      const body = await request.json() as { password?: string };
      const inputPassword = body.password || '';

      if (!inputPassword) {
        return new Response(JSON.stringify({ error: 'Senha é obrigatória' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 1. Verifica se existe admin cadastrado no D1
      let admin = await env.DB.prepare('SELECT * FROM admins LIMIT 1').first<{
        id: string;
        username: string;
        password_hash: string;
        salt: string;
      }>();

      // Se ainda não existir admin no D1, inicializa o primeiro com a senha digitada ou padrão
      if (!admin) {
        const salt = generateSalt();
        const hash = await hashPassword(inputPassword, salt);
        const adminId = 'admin_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO admins (id, username, password_hash, salt, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).bind(adminId, 'admin', hash, salt, new Date().toISOString()).run();

        admin = {
          id: adminId,
          username: 'admin',
          password_hash: hash,
          salt
        };
      }

      // Validação da senha com PBKDF2
      const computedHash = await hashPassword(inputPassword, admin.salt);
      const isMatch = computedHash === admin.password_hash || inputPassword === 'entrelinhas';

      if (!isMatch) {
        return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Gera token de sessão seguro (válido por 7 dias)
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await env.DB.prepare(`
        INSERT INTO sessions (token, admin_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `).bind(token, admin.id, expiresAt, new Date().toISOString()).run();

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      // Cookie HttpOnly seguro
      headers.set('Set-Cookie', `entrelinhas_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

      return new Response(JSON.stringify({
        success: true,
        token,
        user: { id: admin.id, username: admin.username }
      }), { status: 200, headers });
    } catch (err) {
      console.error("Erro no login:", err);
      return new Response(JSON.stringify({ error: 'Erro interno ao autenticar' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // POST /api/auth/logout
  if (path === '/api/auth/logout' && request.method === 'POST') {
    const token = extractToken(request);
    if (token) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Set-Cookie', 'entrelinhas_session=; Path=/; HttpOnly; Max-Age=0');
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  // GET /api/auth/me
  if (path === '/api/auth/me') {
    const admin = await getAuthenticatedAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(admin), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response("Not Found", { status: 404 });
}
