alter table public.articles
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists content_en text,
  add column if not exists content_blocks_en jsonb,
  add column if not exists seo_title_en text,
  add column if not exists seo_description_en text,
  add column if not exists author_bio_en text,
  add column if not exists is_english_published boolean not null default false;

alter table public.articles drop constraint if exists articles_english_translation_check;
alter table public.articles add constraint articles_english_translation_check check (
  not is_english_published or (
    char_length(trim(coalesce(title_en,''))) >= 5
    and char_length(trim(coalesce(excerpt_en,''))) >= 20
    and (char_length(trim(coalesce(content_en,''))) >= 10 or jsonb_array_length(coalesce(content_blocks_en,'[]'::jsonb)) > 0)
  )
);
