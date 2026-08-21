-- Fix get_analytics_daily failing at runtime because generate_series returns a
-- timestamp and PostgreSQL does not support timestamp + integer.

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

notify pgrst, 'reload schema';
