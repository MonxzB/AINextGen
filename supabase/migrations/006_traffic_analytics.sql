-- Privacy-friendly, first-party website analytics for the AINextGen admin dashboard.
-- Stores only a page path, anonymous identifiers, referrer host and device class.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) between 1 and 300 and left(path, 1) = '/'),
  session_id uuid not null,
  visitor_id uuid not null,
  referrer_host text,
  device_type text not null default 'desktop'
    check (device_type in ('desktop', 'mobile', 'tablet')),
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_created_at_idx on public.page_views (path, created_at desc);
create index if not exists page_views_session_created_at_idx on public.page_views (session_id, created_at desc);
create index if not exists page_views_visitor_created_at_idx on public.page_views (visitor_id, created_at desc);

alter table public.page_views enable row level security;

drop policy if exists "Admins can read website analytics" on public.page_views;
create policy "Admins can read website analytics"
on public.page_views for select
to authenticated
using (public.is_admin());

create or replace function public.record_page_view(
  p_path text,
  p_session_id uuid,
  p_visitor_id uuid,
  p_referrer_host text default null,
  p_device_type text default 'desktop'
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
begin
  if v_path = '' or left(v_path, 1) <> '/' or char_length(v_path) > 300 then
    return false;
  end if;

  if v_path = '/admin' or v_path like '/admin/%' or v_path = '/login'
    or v_path = '/api' or v_path like '/api/%' then
    return false;
  end if;

  if v_device not in ('desktop', 'mobile', 'tablet') then
    v_device := 'desktop';
  end if;

  -- Suppress fast duplicate requests caused by refreshes or React development mode.
  if exists (
    select 1 from public.page_views
    where session_id = p_session_id
      and path = v_path
      and created_at > now() - interval '5 seconds'
  ) then
    return true;
  end if;

  insert into public.page_views(path, session_id, visitor_id, referrer_host, device_type)
  values (v_path, p_session_id, p_visitor_id, v_referrer, v_device);

  return true;
end;
$$;

revoke all on function public.record_page_view(text, uuid, uuid, text, text) from public;
grant execute on function public.record_page_view(text, uuid, uuid, text, text) to anon, authenticated;

create or replace function public.get_analytics_overview(p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_days integer := greatest(7, least(coalesce(p_days, 30), 90));
  v_start timestamptz;
  v_previous_start timestamptz;
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  v_start := date_trunc('day', now()) - (v_days - 1) * interval '1 day';
  v_previous_start := v_start - v_days * interval '1 day';

  select jsonb_build_object(
    'period_days', v_days,
    'total_views', (select count(*) from public.page_views where created_at >= v_start),
    'previous_views', (
      select count(*) from public.page_views
      where created_at >= v_previous_start and created_at < v_start
    ),
    'unique_visitors', (
      select count(distinct visitor_id) from public.page_views where created_at >= v_start
    ),
    'sessions', (
      select count(distinct session_id) from public.page_views where created_at >= v_start
    ),
    'today_views', (
      select count(*) from public.page_views where created_at >= date_trunc('day', now())
    ),
    'pages_per_session', coalesce((
      select round(count(*)::numeric / nullif(count(distinct session_id), 0), 2)
      from public.page_views where created_at >= v_start
    ), 0),
    'daily', (
      select coalesce(jsonb_agg(
        jsonb_build_object('date', day, 'views', views, 'visitors', visitors)
        order by day
      ), '[]'::jsonb)
      from (
        select series.day::date as day,
          count(pv.id) as views,
          count(distinct pv.visitor_id) as visitors
        from generate_series(v_start::date, current_date, interval '1 day') as series(day)
        left join public.page_views pv
          on pv.created_at >= series.day
          and pv.created_at < series.day + interval '1 day'
        group by series.day
      ) daily_rows
    ),
    'top_pages', (
      select coalesce(jsonb_agg(
        jsonb_build_object('path', path, 'views', views)
        order by views desc, path
      ), '[]'::jsonb)
      from (
        select path, count(*) as views
        from public.page_views
        where created_at >= v_start
        group by path
        order by views desc
        limit 8
      ) page_rows
    ),
    'referrers', (
      select coalesce(jsonb_agg(
        jsonb_build_object('source', source, 'views', views)
        order by views desc, source
      ), '[]'::jsonb)
      from (
        select coalesce(nullif(referrer_host, ''), 'Trực tiếp') as source, count(*) as views
        from public.page_views
        where created_at >= v_start
        group by coalesce(nullif(referrer_host, ''), 'Trực tiếp')
        order by views desc
        limit 6
      ) referrer_rows
    ),
    'devices', (
      select coalesce(jsonb_agg(
        jsonb_build_object('device', device_type, 'views', views)
        order by views desc, device_type
      ), '[]'::jsonb)
      from (
        select device_type, count(*) as views
        from public.page_views
        where created_at >= v_start
        group by device_type
      ) device_rows
    )
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_analytics_overview(integer) from public;
grant execute on function public.get_analytics_overview(integer) to authenticated;

comment on table public.page_views is
  'First-party anonymous page views. Does not store IP addresses, full user agents or search terms.';
