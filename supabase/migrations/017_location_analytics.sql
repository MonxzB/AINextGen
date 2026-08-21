-- Coarse, privacy-friendly location analytics from Vercel request headers.
-- Stores country/region/province only. IP addresses and coordinates are never persisted.

alter table public.page_views add column if not exists country_code text;
alter table public.page_views add column if not exists region_code text;
alter table public.page_views add column if not exists province_name text;

create index if not exists page_views_province_created_at_idx
on public.page_views (province_name, created_at desc);

create or replace function public.record_page_view_v2(
  p_path text,
  p_session_id uuid,
  p_visitor_id uuid,
  p_referrer_host text default null,
  p_device_type text default 'desktop',
  p_country_code text default null,
  p_region_code text default null,
  p_province_name text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text := split_part(split_part(trim(coalesce(p_path, '')), '?', 1), '#', 1);
  v_device text := lower(trim(coalesce(p_device_type, 'desktop')));
  v_referrer text := nullif(left(lower(trim(coalesce(p_referrer_host, ''))), 160), '');
  v_country text := nullif(left(upper(trim(coalesce(p_country_code, ''))), 2), '');
  v_region text := nullif(left(upper(trim(coalesce(p_region_code, ''))), 16), '');
  v_province text := nullif(left(trim(coalesce(p_province_name, '')), 100), '');
begin
  if v_path = '' or left(v_path, 1) <> '/' or char_length(v_path) > 300 then
    return false;
  end if;

  if v_path = '/admin' or v_path like '/admin/%' or v_path = '/login'
    or v_path = '/preview' or v_path like '/preview/%'
    or v_path = '/api' or v_path like '/api/%' then
    return false;
  end if;

  if v_device not in ('desktop', 'mobile', 'tablet') then
    v_device := 'desktop';
  end if;

  if exists (
    select 1 from public.page_views
    where session_id = p_session_id
      and path = v_path
      and created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  if (select count(*) from public.page_views
      where visitor_id = p_visitor_id and created_at > now() - interval '1 minute') >= 15
    or (select count(*) from public.page_views
        where visitor_id = p_visitor_id and created_at > now() - interval '1 hour') >= 120
    or (select count(*) from public.page_views
        where session_id = p_session_id and created_at > now() - interval '1 hour') >= 120 then
    return false;
  end if;

  insert into public.page_views(
    path, session_id, visitor_id, referrer_host, device_type,
    country_code, region_code, province_name
  ) values (
    v_path, p_session_id, p_visitor_id, v_referrer, v_device,
    v_country, v_region, v_province
  );
  return true;
end;
$$;

revoke all on function public.record_page_view_v2(text, uuid, uuid, text, text, text, text, text)
from public, anon, authenticated;
grant execute on function public.record_page_view_v2(text, uuid, uuid, text, text, text, text, text)
to service_role;

create or replace function public.get_analytics_locations(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_days integer := greatest(7, least(coalesce(p_days, 30), 90));
  v_today date := timezone('Asia/Ho_Chi_Minh', now())::date;
  v_start date;
  v_start_at timestamptz;
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  v_start := v_today - (v_days - 1);
  v_start_at := v_start::timestamp at time zone 'Asia/Ho_Chi_Minh';

  with scoped as (
    select
      timezone('Asia/Ho_Chi_Minh', created_at)::date as local_date,
      visitor_id,
      session_id,
      country_code,
      case
        when country_code = 'VN' then coalesce(province_name, 'Không xác định')
        when country_code is null then 'Không xác định'
        else 'Quốc tế (' || country_code || ')'
      end as location
    from public.page_views
    where created_at >= v_start_at
  )
  select jsonb_build_object(
    'period_days', v_days,
    'provinces', coalesce((
      select jsonb_agg(to_jsonb(province_rows) order by province_rows.views desc, province_rows.location)
      from (
        select
          location,
          max(country_code) as country_code,
          count(*)::integer as views,
          count(distinct visitor_id)::integer as visitors,
          count(distinct session_id)::integer as sessions
        from scoped
        group by location
      ) province_rows
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(to_jsonb(daily_rows) order by daily_rows.date desc, daily_rows.views desc, daily_rows.location)
      from (
        select
          local_date as date,
          location,
          count(*)::integer as views,
          count(distinct visitor_id)::integer as visitors
        from scoped
        group by local_date, location
      ) daily_rows
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_analytics_locations(integer) from public, anon;
grant execute on function public.get_analytics_locations(integer) to authenticated;

comment on function public.get_analytics_locations(integer) is
  'Admin-only coarse location analytics; never returns or stores visitor IP addresses.';

notify pgrst, 'reload schema';
