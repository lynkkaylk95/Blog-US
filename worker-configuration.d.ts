interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  IMAGES: ImagesBinding;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  PASSWORD_RESET_EMAIL?: SendEmail;
  MEDIA: R2Bucket;
  SITE_URL?: string;
}

interface ImagesBinding {
  input(stream: ReadableStream): {
    transform(options: Record<string, unknown>): {
      output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
    };
  };
}
