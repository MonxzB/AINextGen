-- Admin notifications for every configurable batch of qualified page views.
-- The counter starts at migration time, so historical traffic never triggers a new alert.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (char_length(kind) between 1 and 60),
  title text not null check (char_length(title) between 1 and 180),
  message text not null check (char_length(message) between 1 and 1200),
  action_url text not null default '/admin' check (left(action_url, 1) = '/' and char_length(action_url) <= 300),
  metadata jsonb not null default '{}'::jsonb,
  dedupe_key text not null unique check (char_length(dedupe_key) between 1 and 180),
  is_read boolean not null default false,
  read_at timestamptz,
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sending', 'sent', 'failed', 'disabled')),
  email_attempts smallint not null default 0 check (email_attempts between 0 and 10),
  email_sent_at timestamptz,
  email_last_error text,
  created_at timestamptz not null default now()
);

create index if not exists notifications_created_at_idx
on public.notifications (created_at desc);
create index if not exists notifications_unread_created_at_idx
on public.notifications (created_at desc)
where is_read = false;
create index if not exists notifications_email_pending_idx
on public.notifications (email_status, created_at)
where email_status in ('pending', 'failed');

alter table public.notifications enable row level security;

drop policy if exists "Admins can read notifications" on public.notifications;
create policy "Admins can read notifications"
on public.notifications for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update notifications" on public.notifications;
create policy "Admins can update notifications"
on public.notifications for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on table public.notifications from public, anon, authenticated;
grant select, update on table public.notifications to authenticated;

create table if not exists public.notification_counters (
  key text primary key,
  threshold integer not null default 20 check (threshold between 1 and 100000),
  pending_views integer not null default 0 check (pending_views >= 0),
  notification_sequence bigint not null default 0 check (notification_sequence >= 0),
  last_notified_total bigint not null default 0 check (last_notified_total >= 0),
  last_notified_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_counters enable row level security;
revoke all on table public.notification_counters from public, anon, authenticated;

insert into public.notification_counters(
  key, threshold, pending_views, notification_sequence,
  last_notified_total, last_notified_at
)
values (
  'qualified_page_views', 20, 0, 0,
  (select count(*) from public.page_views), now()
)
on conflict (key) do nothing;

create or replace function public.record_page_view_v4(
  p_path text,
  p_session_id uuid,
  p_visitor_id uuid,
  p_referrer_host text default null,
  p_device_type text default 'desktop',
  p_country_code text default null,
  p_region_code text default null,
  p_province_name text default null
)
returns jsonb
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
  v_counter public.notification_counters%rowtype;
  v_pending integer;
  v_sequence bigint;
  v_total bigint;
  v_previous_total bigint;
  v_period_views integer;
  v_visitors integer;
  v_sessions integer;
  v_top_pages jsonb;
  v_notification_id uuid;
begin
  if v_path = '' or left(v_path, 1) <> '/' or char_length(v_path) > 300 then
    return jsonb_build_object('recorded', false, 'notification_id', null);
  end if;

  if v_path = '/admin' or v_path like '/admin/%' or v_path = '/login'
    or v_path = '/preview' or v_path like '/preview/%'
    or v_path = '/api' or v_path like '/api/%' then
    return jsonb_build_object('recorded', false, 'notification_id', null);
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
    return jsonb_build_object('recorded', false, 'notification_id', null);
  end if;

  if (select count(*) from public.page_views
      where visitor_id = p_visitor_id and created_at > now() - interval '1 minute') >= 15
    or (select count(*) from public.page_views
        where visitor_id = p_visitor_id and created_at > now() - interval '1 hour') >= 120
    or (select count(*) from public.page_views
        where session_id = p_session_id and created_at > now() - interval '1 hour') >= 120 then
    return jsonb_build_object('recorded', false, 'notification_id', null);
  end if;

  insert into public.page_views(
    path, session_id, visitor_id, referrer_host, device_type,
    country_code, region_code, province_name, engagement_eligible
  ) values (
    v_path, p_session_id, p_visitor_id, v_referrer, v_device,
    v_country, v_region, v_province, v_path like '/tutorials/%'
  );

  insert into public.notification_counters(
    key, threshold, pending_views, notification_sequence,
    last_notified_total, last_notified_at
  ) values (
    'qualified_page_views', 20, 0, 0,
    (select count(*) from public.page_views), now()
  ) on conflict (key) do nothing;

  select * into v_counter
  from public.notification_counters
  where key = 'qualified_page_views'
  for update;

  v_pending := v_counter.pending_views + 1;
  if v_pending < v_counter.threshold then
    update public.notification_counters
    set pending_views = v_pending, updated_at = now()
    where key = 'qualified_page_views';
    return jsonb_build_object('recorded', true, 'notification_id', null);
  end if;

  select count(*) into v_total from public.page_views;
  v_previous_total := greatest(0, v_total - v_pending);
  v_sequence := v_counter.notification_sequence + 1;

  select
    count(*)::integer,
    count(distinct visitor_id)::integer,
    count(distinct session_id)::integer
  into v_period_views, v_visitors, v_sessions
  from public.page_views
  where created_at > v_counter.last_notified_at;

  select coalesce(jsonb_agg(
    jsonb_build_object('path', page.path, 'views', page.views)
    order by page.views desc, page.path
  ), '[]'::jsonb)
  into v_top_pages
  from (
    select path, count(*)::integer as views
    from public.page_views
    where created_at > v_counter.last_notified_at
    group by path
    order by count(*) desc, path
    limit 3
  ) page;

  insert into public.notifications(
    kind, title, message, action_url, metadata, dedupe_key
  ) values (
    'traffic_milestone',
    'Website vừa có thêm ' || v_pending || ' lượt xem',
    'Tổng hiện tại ' || v_total || ' lượt · ' || v_visitors ||
      ' khách · ' || v_sessions || ' phiên trong đợt mới.',
    '/admin/analytics',
    jsonb_build_object(
      'new_views', v_pending,
      'period_views', v_period_views,
      'previous_total', v_previous_total,
      'total_views', v_total,
      'visitors', v_visitors,
      'sessions', v_sessions,
      'period_started_at', v_counter.last_notified_at,
      'period_ended_at', now(),
      'top_pages', v_top_pages
    ),
    'traffic_views:' || v_sequence
  )
  returning id into v_notification_id;

  update public.notification_counters
  set pending_views = 0,
      notification_sequence = v_sequence,
      last_notified_total = v_total,
      last_notified_at = now(),
      updated_at = now()
  where key = 'qualified_page_views';

  return jsonb_build_object(
    'recorded', true,
    'notification_id', v_notification_id
  );
end;
$$;

revoke all on function public.record_page_view_v4(text, uuid, uuid, text, text, text, text, text)
from public, anon, authenticated;
grant execute on function public.record_page_view_v4(text, uuid, uuid, text, text, text, text, text)
to service_role;

comment on table public.notifications is
  'Admin-only in-app notifications with optional transactional email delivery state.';
comment on table public.notification_counters is
  'Service-only counters used to create deduplicated threshold notifications.';

notify pgrst, 'reload schema';
