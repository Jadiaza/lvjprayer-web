# News connection setup for LVJ

## Public website on the hosting

The static Lovable build reads public news from `https://lavozdejesus.co/api/noticias.php`. The PHP endpoint uses `api/config.local.php` on the server and only queries published news. It reads the existing `supabase_url` and `supabase_anon_key` values; neither is sent to the browser. The key must be a Supabase publishable/anon key, never the secret/service-role key.

## Vercel editorial panel

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel project for the admin build. Set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `CRON_SECRET` as server-only variables for the RSS ingestion function. Never prefix a secret with `VITE_`.

The panel authorizes writers through the existing `public.user_roles` table. An account must have the `admin` or `editor` role. Row Level Security repeats that authorization in the database.

## Deploy

- Upload `hosting/api/noticias.php` from the LVJ backend to `/public_html/api/noticias.php`.
- Keep `/public_html/api/config.local.php` on the server; do not upload it to source control or expose it through a browser.
- Build the public app with `npm run build:hosting` and upload the contents of `dist-hosting/` to `/public_html/lvjplayer/`.
- Deploy the Vercel admin with `npm run build:admin`; its root opens the admin panel and its cron function fills `news_feed_items` for editorial review.

The RSS importer creates drafts in the review inbox; it does not publish external material automatically.