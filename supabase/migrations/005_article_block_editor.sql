alter table public.articles
add column if not exists content_blocks jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-images', 'article-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=true, file_size_limit=8388608, allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Public reads article images" on storage.objects;
create policy "Public reads article images" on storage.objects for select using (bucket_id='article-images');
drop policy if exists "Admins upload article images" on storage.objects;
create policy "Admins upload article images" on storage.objects for insert to authenticated with check (bucket_id='article-images' and public.is_admin());
drop policy if exists "Admins update article images" on storage.objects;
create policy "Admins update article images" on storage.objects for update to authenticated using (bucket_id='article-images' and public.is_admin()) with check (bucket_id='article-images' and public.is_admin());
drop policy if exists "Admins delete article images" on storage.objects;
create policy "Admins delete article images" on storage.objects for delete to authenticated using (bucket_id='article-images' and public.is_admin());
