-- LVJ news schema. Uses the existing public.user_roles authorization model.
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  category text not null default 'Iglesia',
  region text not null default 'universal' check (region in ('universal', 'colombia', 'local')),
  community text,
  author_name text not null default 'Redaccion LVJ',
  image_url text,
  source_name text,
  source_url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint news_source_url_https check (source_url is null or source_url ~ '^https://')
);
create index if not exists news_items_public_order on public.news_items (published_at desc) where status = 'published';
create index if not exists news_items_editor_order on public.news_items (updated_at desc);
alter table public.news_items enable row level security;
revoke all on public.news_items from anon, authenticated;
grant select on public.news_items to anon;
grant select, insert, update, delete on public.news_items to authenticated;

drop policy if exists "Published news or editor access" on public.news_items;
create policy "Published news or editor access" on public.news_items for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors create news" on public.news_items;
create policy "Editors create news" on public.news_items for insert to authenticated
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors update news" on public.news_items;
create policy "Editors update news" on public.news_items for update to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors delete news" on public.news_items;
create policy "Editors delete news" on public.news_items for delete to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));

create table if not exists public.news_feed_items (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text not null unique,
  title text not null,
  excerpt text not null default '',
  region text not null default 'universal' check (region in ('universal', 'colombia', 'local')),
  source_published_at timestamptz,
  imported_at timestamptz not null default now(),
  reviewed_at timestamptz,
  converted_news_id uuid references public.news_items(id) on delete set null
);
create index if not exists news_feed_items_inbox_order on public.news_feed_items (imported_at desc);
create index if not exists news_feed_items_converted_news_id_idx on public.news_feed_items (converted_news_id);
alter table public.news_feed_items enable row level security;
revoke all on public.news_feed_items from anon, authenticated;
grant select, update, delete on public.news_feed_items to authenticated;
drop policy if exists "Editors review feed inbox" on public.news_feed_items;
create policy "Editors review feed inbox" on public.news_feed_items for select to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors mark feed reviewed" on public.news_feed_items;
create policy "Editors mark feed reviewed" on public.news_feed_items for update to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));
drop policy if exists "Editors remove feed items" on public.news_feed_items;
create policy "Editors remove feed items" on public.news_feed_items for delete to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-media', 'news-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists "Public reads LVJ news media" on storage.objects;
create policy "Public reads LVJ news media" on storage.objects for select to anon, authenticated using (bucket_id = 'news-media');
drop policy if exists "Editors upload LVJ news media" on storage.objects;
create policy "Editors upload LVJ news media" on storage.objects for insert to authenticated
  with check (bucket_id = 'news-media' and (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role)));
drop policy if exists "Editors update LVJ news media" on storage.objects;
create policy "Editors update LVJ news media" on storage.objects for update to authenticated
  using (bucket_id = 'news-media' and (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role)))
  with check (bucket_id = 'news-media' and (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role)));
drop policy if exists "Editors delete LVJ news media" on storage.objects;
create policy "Editors delete LVJ news media" on storage.objects for delete to authenticated
  using (bucket_id = 'news-media' and (public.has_role((select auth.uid()), 'admin'::public.app_role) or public.has_role((select auth.uid()), 'editor'::public.app_role)));