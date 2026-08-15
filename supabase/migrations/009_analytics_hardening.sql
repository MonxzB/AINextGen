-- Route analytics writes through the trusted server endpoint only.
-- This prevents anonymous clients from bypassing application rate limits by
-- calling the public Supabase RPC directly.
revoke execute on function public.record_page_view(text, uuid, uuid, text, text) from anon, authenticated;
grant execute on function public.record_page_view(text, uuid, uuid, text, text) to service_role;
