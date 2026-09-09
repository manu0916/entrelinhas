import { Env } from './types';

// Entrega de PDF por streaming com suporte nativo a HTTP Range Requests (206)
export async function streamPdfFromR2(
  key: string,
  request: Request,
  env: Env,
  isDraft: boolean,
  isAdmin: boolean
): Promise<Response> {
  // Rascunhos são estritamente inacessíveis a visitantes anônimos
  if (isDraft && !isAdmin) {
    return new Response("Publicação não encontrada ou privada", { status: 404 });
  }

  try {
    // Passa o cabeçalho Range da requisição diretamente para o R2
    const rangeHeader = request.headers.get('Range');
    const object = await env.BUCKET.get(key, {
      range: request.headers,
    });

    if (!object) {
      return new Response("Arquivo PDF não encontrado no armazenamento", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Content-Type', 'application/pdf');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Disposition', 'inline');

    // Cache: público apenas para obras publicadas; no-store para rascunhos
    if (isDraft) {
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    // Se a requisição solicitou Range e o R2 atendeu
    const status = object.body && rangeHeader ? 206 : 200;

    return new Response(object.body as any, {
      status,
      headers
    });
  } catch (err) {
    console.error("Erro ao transmitir PDF do R2:", err);
    return new Response("Erro interno ao transmitir arquivo", { status: 500 });
  }
}

// Download com cabeçalho de anexo e nome de arquivo legível
export async function downloadPdfFromR2(
  key: string,
  filename: string,
  env: Env,
  isDraft: boolean,
  isAdmin: boolean
): Promise<Response> {
  if (isDraft && !isAdmin) {
    return new Response("Publicação não encontrada ou privada", { status: 404 });
  }

  try {
    const object = await env.BUCKET.get(key);
    if (!object) {
      return new Response("Arquivo não encontrado", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Content-Type', 'application/pdf');
    // Sanitização de nome de arquivo para o cabeçalho
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

    if (isDraft) {
      headers.set('Cache-Control', 'no-store');
    } else {
      headers.set('Cache-Control', 'public, max-age=86400');
    }

    return new Response(object.body as any, {
      status: 200,
      headers
    });
  } catch (err) {
    console.error("Erro no download de PDF:", err);
    return new Response("Erro interno no download", { status: 500 });
  }
}

// Upload de arquivo para o R2
export async function uploadToR2(
  file: File | ArrayBuffer,
  key: string,
  contentType: string,
  env: Env
): Promise<void> {
  await env.BUCKET.put(key, file, {
    httpMetadata: { contentType }
  });
}

// Remoção de arquivo do R2
export async function deleteFromR2(key: string, env: Env): Promise<void> {
  if (!key) return;
  try {
    await env.BUCKET.delete(key);
  } catch (err) {
    console.error(`Erro ao remover chave ${key} do R2:`, err);
  }
}
