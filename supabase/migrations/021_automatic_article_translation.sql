create table if not exists public.article_translation_usage (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete set null,
  character_count integer not null check (character_count > 0),
  created_at timestamptz not null default now()
);

create index if not exists article_translation_usage_created_at_idx
  on public.article_translation_usage (created_at desc);

alter table public.article_translation_usage enable row level security;

drop policy if exists "Authenticated users can read translation usage" on public.article_translation_usage;
create policy "Authenticated users can read translation usage"
  on public.article_translation_usage for select to authenticated using (true);

drop policy if exists "Authenticated users can insert translation usage" on public.article_translation_usage;
create policy "Authenticated users can insert translation usage"
  on public.article_translation_usage for insert to authenticated with check (true);
