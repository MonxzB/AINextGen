alter table public.articles
 add column if not exists category text not null default 'AI Fundamentals',
 add column if not exists difficulty text not null default 'beginner' check(difficulty in ('beginner','intermediate','advanced')),
 add column if not exists duration_minutes integer not null default 10 check(duration_minutes > 0),
 add column if not exists tools jsonb not null default '[]'::jsonb,
 add column if not exists is_featured boolean not null default false;
create index if not exists articles_category_idx on public.articles(category);
create index if not exists articles_featured_idx on public.articles(is_featured,published_at desc) where status='published';
update public.settings set value='{"name":"AINext","tagline":"Kiến thức AI thời đại mới"}'::jsonb where key='site';
