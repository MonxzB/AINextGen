-- Provenance and deduplication for explicitly authorized source imports.

alter table public.articles
  add column if not exists source_url text,
  add column if not exists source_site text,
  add column if not exists source_imported_at timestamptz,
  add column if not exists import_mode text check (import_mode in ('full', 'idea')),
  add column if not exists copyright_confirmed boolean not null default false;

create unique index if not exists articles_source_url_unique
  on public.articles (source_url)
  where source_url is not null;

comment on column public.articles.source_url is
  'Canonical URL used to prevent duplicate source imports.';
comment on column public.articles.copyright_confirmed is
  'The importing editor confirmed they have permission to reuse the source content.';
