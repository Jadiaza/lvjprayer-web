-- LVJ full-site CMS: additive schema for Vercel editorial admin and public hosting.
-- Existing news_items/news_feed_items and LVJ Prayer bootstrap are left unchanged.

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  category text not null default 'Programación',
  host_name text,
  weekday text not null default 'Todos los días' check (weekday in ('Todos los días','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')),
  start_time time,
  end_time time,
  schedule_text text,
  stream_url text,
  cover_url text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  artist_name text,
  category text not null default 'Podcast',
  audio_url text not null,
  cover_url text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text not null default '',
  image_url text,
  website_url text,
  social_links jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'Formación',
  video_url text not null,
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text,
  tracks jsonb not null default '[]'::jsonb check (jsonb_typeof(tracks) = 'array'),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  body text not null default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lvj_cms_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  asset_type text not null check (asset_type in ('image','audio','video','document')),
  url text not null check (url ~ '^https://'),
  alt_text text not null default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.liturgical_themes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  season text not null,
  start_date date not null,
  end_date date not null,
  primary_color text not null default '#D8A23A' check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  accent_color text not null default '#5AA0BE' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  background_color text not null default '#0A1220' check (background_color ~ '^#[0-9A-Fa-f]{6}$'),
  image_url text,
  status text not null default 'scheduled' check (status in ('scheduled','active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liturgical_theme_dates_check check (end_date >= start_date)
);
create index if not exists liturgical_themes_date_range on public.liturgical_themes(start_date, end_date) where status <> 'inactive';

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default 'null'::jsonb,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists programs_public_order on public.programs(sort_order, title) where status = 'published';
create index if not exists audio_items_public_order on public.audio_items(published_at desc) where status = 'published';
create index if not exists artists_public_order on public.artists(name) where status = 'published';
create index if not exists videos_public_order on public.videos(published_at desc) where status = 'published';
create index if not exists playlists_public_order on public.playlists(published_at desc) where status = 'published';
create index if not exists content_pages_public_slug on public.content_pages(slug) where status = 'published';
create index if not exists lvj_cms_media_public_type on public.lvj_cms_media(asset_type) where status = 'published';

-- Public clients can only read published records. Editors manage all records through Supabase Auth.
do $$
declare table_name text;
begin
  foreach table_name in array array['programs','audio_items','artists','videos','playlists','content_pages','lvj_cms_media','liturgical_themes'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
    execute format('drop policy if exists "Public published read" on public.%I', table_name);
    if table_name = 'liturgical_themes' then
      execute format('create policy "Public published read" on public.%I for select to anon, authenticated using ((status in (''scheduled'',''active'') and current_date between start_date and end_date) or public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role))', table_name);
    else
      execute format('create policy "Public published read" on public.%I for select to anon, authenticated using (status = ''published'' or public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role))', table_name);
    end if;
    execute format('drop policy if exists "Editors insert" on public.%I', table_name);
    execute format('create policy "Editors insert" on public.%I for insert to authenticated with check (public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role))', table_name);
    execute format('drop policy if exists "Editors update" on public.%I', table_name);
    execute format('create policy "Editors update" on public.%I for update to authenticated using (public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role)) with check (public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role))', table_name);
    execute format('drop policy if exists "Editors delete" on public.%I', table_name);
    execute format('create policy "Editors delete" on public.%I for delete to authenticated using (public.has_role((select auth.uid()), ''admin''::public.app_role) or public.has_role((select auth.uid()), ''editor''::public.app_role))', table_name);
  end loop;
end $$;

alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
drop policy if exists "Public settings read" on public.site_settings;
create policy "Public settings read" on public.site_settings for select to anon, authenticated
  using (is_public or public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors insert settings" on public.site_settings;
create policy "Editors insert settings" on public.site_settings for insert to authenticated
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors update settings" on public.site_settings;
create policy "Editors update settings" on public.site_settings for update to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors delete settings" on public.site_settings;
create policy "Editors delete settings" on public.site_settings for delete to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));

-- The public policy evaluates has_role() as anon; the helper only returns true when its UUID
-- matches auth.uid(), so unauthenticated calls cannot test another user's role.
grant execute on function public.has_role(uuid, public.app_role) to anon;

-- RSS/Atom subscriptions are configured in the editorial panel. Only the Vercel
-- ingestion function reads enabled URLs; site visitors never receive the list.
create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null unique check (feed_url ~ '^https://'),
  region text not null default 'universal' check (region in ('universal','colombia','local')),
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.news_sources enable row level security;
revoke all on public.news_sources from anon, authenticated;
grant select, insert, update, delete on public.news_sources to authenticated;
drop policy if exists "Editors manage news sources" on public.news_sources;
create policy "Editors manage news sources" on public.news_sources for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
