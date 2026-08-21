-- Count only engaged, first-party page views routed through the server endpoint.
-- The application waits for five visible seconds before invoking this RPC.
-- Database-side deduplication and quotas remain authoritative across Vercel instances.

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
    or v_path = '/preview' or v_path like '/preview/%'
    or v_path = '/api' or v_path like '/api/%' then
    return false;
  end if;

  if v_device not in ('desktop', 'mobile', 'tablet') then
    v_device := 'desktop';
  end if;

  -- A repeat visit to the same page in one session is counted once per 30 minutes.
  if exists (
    select 1 from public.page_views
    where session_id = p_session_id
      and path = v_path
      and created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  -- Reject implausible volumes even when traffic reaches different Vercel instances.
  if (select count(*) from public.page_views
      where visitor_id = p_visitor_id and created_at > now() - interval '1 minute') >= 15
    or (select count(*) from public.page_views
        where visitor_id = p_visitor_id and created_at > now() - interval '1 hour') >= 120
    or (select count(*) from public.page_views
        where session_id = p_session_id and created_at > now() - interval '1 hour') >= 120 then
    return false;
  end if;

  insert into public.page_views(path, session_id, visitor_id, referrer_host, device_type)
  values (v_path, p_session_id, p_visitor_id, v_referrer, v_device);
  return true;
end;
$$;

revoke all on function public.record_page_view(text, uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.record_page_view(text, uuid, uuid, text, text) to service_role;

create or replace function public.get_analytics_daily(p_days integer default 30)
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
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  v_start := v_today - (v_days - 1);

  select coalesce(jsonb_agg(to_jsonb(rows) order by rows.date desc), '[]'::jsonb)
  into v_result
  from (
    select
      series.day::date as date,
      count(pv.id)::integer as views,
      count(distinct pv.visitor_id)::integer as visitors,
      count(distinct pv.session_id)::integer as sessions,
      count(pv.id) filter (where pv.device_type = 'desktop')::integer as desktop,
      count(pv.id) filter (where pv.device_type = 'mobile')::integer as mobile,
      count(pv.id) filter (where pv.device_type = 'tablet')::integer as tablet,
      count(pv.id) filter (where pv.referrer_host is null)::integer as direct_views,
      count(pv.id) filter (where pv.referrer_host is not null)::integer as referred_views,
      coalesce((
        select page.path
        from public.page_views page
        where page.created_at >= series.day::date::timestamp at time zone 'Asia/Ho_Chi_Minh'
          and page.created_at < (series.day::date + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'
        group by page.path
        order by count(*) desc, page.path
        limit 1
      ), '—') as top_page
    from generate_series(v_start, v_today, interval '1 day') as series(day)
    left join public.page_views pv
      on pv.created_at >= series.day::date::timestamp at time zone 'Asia/Ho_Chi_Minh'
      and pv.created_at < (series.day::date + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'
    group by series.day
  ) rows;

  return v_result;
end;
$$;

revoke all on function public.get_analytics_daily(integer) from public, anon;
grant execute on function public.get_analytics_daily(integer) to authenticated;

comment on function public.get_analytics_daily(integer) is
  'Admin-only daily analytics report in the Asia/Ho_Chi_Minh timezone.';
