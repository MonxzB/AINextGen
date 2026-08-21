-- Privacy-friendly article engagement analytics.
-- Active time and maximum article scroll depth are stored per qualified page view.
-- Historical page views are intentionally excluded from retention denominators.

alter table public.page_views
add column if not exists engagement_eligible boolean not null default false;

create index if not exists page_views_engagement_created_at_idx
on public.page_views (engagement_eligible, created_at desc)
where engagement_eligible = true;

create table if not exists public.page_engagement (
  id bigint generated always as identity primary key,
  page_view_id bigint not null unique references public.page_views(id) on delete cascade,
  active_seconds integer not null default 0 check (active_seconds between 0 and 14400),
  max_scroll_percent smallint not null default 0 check (max_scroll_percent between 0 and 100),
  estimated_read_seconds integer not null default 60 check (estimated_read_seconds between 60 and 10800),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_engagement_updated_at_idx
on public.page_engagement (updated_at desc);

alter table public.page_engagement enable row level security;

drop policy if exists "Admins can read article engagement" on public.page_engagement;
create policy "Admins can read article engagement"
on public.page_engagement for select
to authenticated
using (public.is_admin());

-- V3 marks only newly recorded public tutorial views as eligible for engagement.
-- V2 remains available during a migration-first deployment without polluting retention.
create or replace function public.record_page_view_v3(
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
    country_code, region_code, province_name, engagement_eligible
  ) values (
    v_path, p_session_id, p_visitor_id, v_referrer, v_device,
    v_country, v_region, v_province, v_path like '/tutorials/%'
  );
  return true;
end;
$$;

revoke all on function public.record_page_view_v3(text, uuid, uuid, text, text, text, text, text)
from public, anon, authenticated;
grant execute on function public.record_page_view_v3(text, uuid, uuid, text, text, text, text, text)
to service_role;

create or replace function public.record_article_engagement(
  p_path text,
  p_session_id uuid,
  p_visitor_id uuid,
  p_active_seconds integer,
  p_max_scroll_percent integer,
  p_estimated_read_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text := split_part(split_part(trim(coalesce(p_path, '')), '?', 1), '#', 1);
  v_page_view_id bigint;
  v_active integer := greatest(0, least(coalesce(p_active_seconds, 0), 14400));
  v_scroll integer := greatest(0, least(coalesce(p_max_scroll_percent, 0), 100));
  v_estimate integer := greatest(60, least(coalesce(p_estimated_read_seconds, 60), 10800));
begin
  if v_path not like '/tutorials/%' or char_length(v_path) > 300 then
    return false;
  end if;

  select id into v_page_view_id
  from public.page_views
  where path = v_path
    and session_id = p_session_id
    and visitor_id = p_visitor_id
    and engagement_eligible = true
    and created_at > now() - interval '35 minutes'
  order by created_at desc
  limit 1;

  if v_page_view_id is null then
    return false;
  end if;

  insert into public.page_engagement(
    page_view_id, active_seconds, max_scroll_percent, estimated_read_seconds
  ) values (
    v_page_view_id, v_active, v_scroll, v_estimate
  )
  on conflict (page_view_id) do update set
    active_seconds = greatest(public.page_engagement.active_seconds, excluded.active_seconds),
    max_scroll_percent = greatest(public.page_engagement.max_scroll_percent, excluded.max_scroll_percent),
    estimated_read_seconds = excluded.estimated_read_seconds,
    updated_at = now();

  return true;
end;
$$;

revoke all on function public.record_article_engagement(text, uuid, uuid, integer, integer, integer)
from public, anon, authenticated;
grant execute on function public.record_article_engagement(text, uuid, uuid, integer, integer, integer)
to service_role;

create or replace function public.get_article_engagement(p_days integer default 30)
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

  with qualified as (
    select
      pv.id,
      pv.path,
      timezone('Asia/Ho_Chi_Minh', pv.created_at)::date as local_date,
      coalesce(nullif(a.title, ''), pv.path) as title,
      a.slug,
      coalesce(pe.active_seconds, 5) as active_seconds,
      coalesce(pe.max_scroll_percent, 0) as max_scroll_percent,
      coalesce(pe.estimated_read_seconds, greatest(coalesce(a.duration_minutes, 1) * 60, 60)) as estimated_read_seconds
    from public.page_views pv
    left join public.page_engagement pe on pe.page_view_id = pv.id
    left join public.articles a on pv.path = '/tutorials/' || a.slug
    where pv.engagement_eligible = true
      and pv.path like '/tutorials/%'
      and pv.created_at >= v_start_at
  )
  select jsonb_build_object(
    'period_days', v_days,
    'summary', jsonb_build_object(
      'article_views', count(*)::integer,
      'avg_active_seconds', coalesce(round(avg(active_seconds)::numeric, 1), 0),
      'avg_scroll_percent', coalesce(round(avg(max_scroll_percent)::numeric, 1), 0),
      'engaged_rate', coalesce(round(
        100.0 * count(*) filter (where active_seconds >= 30 or max_scroll_percent >= 50)
        / nullif(count(*), 0), 1
      ), 0),
      'completion_rate', coalesce(round(
        100.0 * count(*) filter (
          where max_scroll_percent >= 90
            or active_seconds >= greatest(30, round(estimated_read_seconds * 0.8)::integer)
        ) / nullif(count(*), 0), 1
      ), 0)
    ),
    'articles', coalesce((
      select jsonb_agg(to_jsonb(article_rows) order by article_rows.views desc, article_rows.title)
      from (
        select
          path,
          max(title) as title,
          max(slug) as slug,
          count(*)::integer as views,
          round(avg(active_seconds)::numeric, 1) as avg_active_seconds,
          round(avg(max_scroll_percent)::numeric, 1) as avg_scroll_percent,
          round(100.0 * count(*) filter (where max_scroll_percent >= 25) / count(*), 1) as retention_25,
          round(100.0 * count(*) filter (where max_scroll_percent >= 50) / count(*), 1) as retention_50,
          round(100.0 * count(*) filter (where max_scroll_percent >= 75) / count(*), 1) as retention_75,
          round(100.0 * count(*) filter (where max_scroll_percent >= 90) / count(*), 1) as retention_90,
          round(100.0 * count(*) filter (where active_seconds >= 30 or max_scroll_percent >= 50) / count(*), 1) as engaged_rate,
          round(100.0 * count(*) filter (
            where max_scroll_percent >= 90
              or active_seconds >= greatest(30, round(estimated_read_seconds * 0.8)::integer)
          ) / count(*), 1) as completion_rate
        from qualified
        group by path
      ) article_rows
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(to_jsonb(daily_rows) order by daily_rows.date desc)
      from (
        select
          series.day::date as date,
          count(q.id)::integer as views,
          coalesce(round(avg(q.active_seconds)::numeric, 1), 0) as avg_active_seconds,
          coalesce(round(avg(q.max_scroll_percent)::numeric, 1), 0) as avg_scroll_percent,
          coalesce(round(
            100.0 * count(q.id) filter (
              where q.max_scroll_percent >= 90
                or q.active_seconds >= greatest(30, round(q.estimated_read_seconds * 0.8)::integer)
            ) / nullif(count(q.id), 0), 1
          ), 0) as completion_rate
        from generate_series(v_start, v_today, interval '1 day') as series(day)
        left join qualified q on q.local_date = series.day::date
        group by series.day
      ) daily_rows
    ), '[]'::jsonb)
  ) into v_result
  from qualified;

  return v_result;
end;
$$;

revoke all on function public.get_article_engagement(integer) from public, anon;
grant execute on function public.get_article_engagement(integer) to authenticated;

comment on table public.page_engagement is
  'Anonymous article active-time and scroll-depth aggregates; no IP, text input, cursor path or full user agent.';
comment on function public.get_article_engagement(integer) is
  'Admin-only article retention report in the Asia/Ho_Chi_Minh timezone.';

notify pgrst, 'reload schema';
