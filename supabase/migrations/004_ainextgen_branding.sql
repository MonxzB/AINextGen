update public.settings
set value = coalesce(value, '{}'::jsonb) || '{"name":"AINextGen","tagline":"Kiến thức AI thế hệ mới"}'::jsonb,
    updated_at = now()
where key = 'site';
