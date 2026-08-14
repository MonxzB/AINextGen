alter table public.affiliate_links
 add column if not exists seller_name text,
 add column if not exists warranty text,
 add column if not exists shipping_info text,
 add column if not exists voucher_info text,
 add column if not exists product_condition text not null default 'new' check(product_condition in ('new','used','refurbished')),
 add column if not exists note text,
 add column if not exists is_official_store boolean not null default false;
alter table public.affiliate_links drop constraint if exists affiliate_links_product_id_marketplace_id_key;
create index if not exists affiliate_links_product_price_idx on public.affiliate_links(product_id,price) where is_active;
