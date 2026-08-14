-- Rich article blocks, editorial trust fields and draft preview metadata.

alter table public.articles
  add column if not exists author_name text not null default 'Đội ngũ AINextGen',
  add column if not exists author_bio text,
  add column if not exists source_references jsonb not null default '[]'::jsonb,
  add column if not exists reviewed_at timestamptz;

update public.articles
set reviewed_at = coalesce(reviewed_at, updated_at, published_at, now())
where reviewed_at is null;

comment on column public.articles.source_references is
  'Array of objects shaped as {label, url} used for article citations.';
comment on column public.articles.reviewed_at is
  'Most recent date on which a human reviewed the article for accuracy.';
