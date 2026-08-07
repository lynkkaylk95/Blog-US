# Porchlight Admin setup

The administration area is available at `/admin`. Posts are stored in Cloudflare D1 and public pages merge D1 content with the bundled Markdown stories during migration.

## Local development

1. Create `.dev.vars` (this file is ignored by Git):

   ```text
   ADMIN_PASSWORD="use-a-long-local-password"
   ADMIN_SESSION_SECRET="use-at-least-32-random-characters"
   SITE_URL="http://localhost:3000"
   ```

2. Apply migrations with `pnpm run db:migrate:local`.
3. Start the site with `pnpm run dev` and open `http://localhost:3000/admin`.

## Cloudflare production

1. Authenticate Wrangler with `npx wrangler login`.
2. Create the database with `npx wrangler d1 create porchlight-stories`.
3. Copy the returned database ID into `wrangler.jsonc`, replacing the placeholder `00000000-0000-4000-8000-000000000000`.
4. Apply the migration with `pnpm run db:migrate:remote`.
5. In the Cloudflare Worker settings, add encrypted secrets `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Generate a random session secret of at least 32 characters.
6. Confirm that the Worker has a D1 binding named exactly `DB`, then deploy the GitHub branch.
7. Sign in at `/admin` and choose **Import existing stories** once. The importer is idempotent and only adds missing bundled stories.

Never commit the production password, session secret, `.dev.vars`, or Cloudflare API tokens. Put Cloudflare Access in front of `/admin*` and `/api/admin*` for an additional identity layer when the domain is ready.

## Editor media

The editor currently inserts images by HTTPS URL and supports YouTube, Vimeo, or direct HTTPS video URLs. Featured images also use an HTTPS URL. Uploading files directly from the computer requires a Cloudflare R2 bucket and is intentionally not stored inside D1.
