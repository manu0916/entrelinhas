export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ASSETS?: Fetcher;
  ENVIRONMENT?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

export interface AdminUser {
  id: string;
  username: string;
}
