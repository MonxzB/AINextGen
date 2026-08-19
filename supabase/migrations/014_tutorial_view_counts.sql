-- Public function returning the total page-view count for each tutorial path.
-- The function is SECURITY DEFINER so it bypasses RLS (page_views is admin-only)
-- but only exposes aggregated counts, never raw rows.

create or replace function public.get_tutorial_view_counts()
returns table(slug text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    substring(path from '^/tutorials/(.+)$') as slug,
    count(*) as view_count
  from public.page_views
  where path like '/tutorials/%'
    and path <> '/tutorials'
  group by slug;
$$;

comment on function public.get_tutorial_view_counts() is
  'Returns aggregated view counts per tutorial slug for public display.';

-- Allow everyone (including anonymous visitors) to call this.
grant execute on function public.get_tutorial_view_counts() to anon, authenticated, service_role;
