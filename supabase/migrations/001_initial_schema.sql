create extension if not exists "pgcrypto";

create table public.users (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text, avatar_url text, role text not null default 'admin' check (role in ('admin','editor')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,image_url text,is_active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.brands (id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,logo_url text,is_active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.products (id uuid primary key default gen_random_uuid(),category_id uuid references public.categories(id) on delete set null,brand_id uuid references public.brands(id) on delete set null,name text not null,slug text not null unique,short_description text,description text,thumbnail_url text,rating numeric(2,1) not null default 0 check(rating between 0 and 5),review_count integer not null default 0,is_featured boolean not null default false,is_active boolean not null default true,seo_title text,seo_description text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.product_images (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,url text not null,alt_text text,sort_order integer not null default 0,created_at timestamptz not null default now());
create table public.product_specifications (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,label text not null,value text not null,group_name text,sort_order integer not null default 0);
create table public.product_pros (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,content text not null,sort_order integer not null default 0);
create table public.product_cons (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,content text not null,sort_order integer not null default 0);
create table public.marketplaces (id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,logo_url text,is_active boolean not null default true,created_at timestamptz not null default now());
create table public.affiliate_links (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,marketplace_id uuid not null references public.marketplaces(id) on delete cascade,url text not null,price numeric(14,2),original_price numeric(14,2),is_active boolean not null default true,last_checked_at timestamptz,created_at timestamptz not null default now(),unique(product_id,marketplace_id));
create table public.affiliate_clicks (id bigint generated always as identity primary key,affiliate_link_id uuid not null references public.affiliate_links(id) on delete cascade,product_id uuid references public.products(id) on delete set null,referrer text,user_agent text,ip_hash text,created_at timestamptz not null default now());
create table public.articles (id uuid primary key default gen_random_uuid(),author_id uuid references public.users(id) on delete set null,title text not null,slug text not null unique,excerpt text,content text,cover_url text,status text not null default 'draft' check(status in ('draft','published','archived')),article_type text not null default 'blog' check(article_type in ('blog','review','buying_guide','best')),published_at timestamptz,seo_title text,seo_description text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.article_products (article_id uuid not null references public.articles(id) on delete cascade,product_id uuid not null references public.products(id) on delete cascade,sort_order integer not null default 0,primary key(article_id,product_id));
create table public.deals (id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,affiliate_link_id uuid references public.affiliate_links(id) on delete set null,title text not null,discount_label text,starts_at timestamptz,ends_at timestamptz,is_active boolean not null default true,created_at timestamptz not null default now());
create table public.banners (id uuid primary key default gen_random_uuid(),title text not null,subtitle text,image_url text,link_url text,position text not null default 'home_hero',sort_order integer not null default 0,is_active boolean not null default true,starts_at timestamptz,ends_at timestamptz,created_at timestamptz not null default now());
create table public.settings (key text primary key,value jsonb not null default '{}'::jsonb,description text,updated_at timestamptz not null default now());

create index products_category_idx on public.products(category_id);
create index products_brand_idx on public.products(brand_id);
create index products_active_featured_idx on public.products(is_active,is_featured);
create index clicks_created_idx on public.affiliate_clicks(created_at desc);
create index articles_status_published_idx on public.articles(status,published_at desc);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.users where id=auth.uid() and role in ('admin','editor')); $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.users(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.categories enable row level security; alter table public.brands enable row level security; alter table public.products enable row level security;
alter table public.product_images enable row level security; alter table public.product_specifications enable row level security; alter table public.product_pros enable row level security; alter table public.product_cons enable row level security;
alter table public.marketplaces enable row level security; alter table public.affiliate_links enable row level security; alter table public.affiliate_clicks enable row level security;
alter table public.articles enable row level security; alter table public.article_products enable row level security; alter table public.deals enable row level security; alter table public.banners enable row level security; alter table public.settings enable row level security;

create policy "Public reads active categories" on public.categories for select using(is_active);
create policy "Public reads active brands" on public.brands for select using(is_active);
create policy "Public reads active products" on public.products for select using(is_active);
create policy "Public reads product images" on public.product_images for select using(exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy "Public reads specs" on public.product_specifications for select using(exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy "Public reads pros" on public.product_pros for select using(exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy "Public reads cons" on public.product_cons for select using(exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy "Public reads marketplaces" on public.marketplaces for select using(is_active);
create policy "Public reads affiliate links" on public.affiliate_links for select using(is_active);
create policy "Anyone records clicks" on public.affiliate_clicks for insert with check(true);
create policy "Public reads published articles" on public.articles for select using(status='published' and published_at<=now());
create policy "Public reads article products" on public.article_products for select using(exists(select 1 from public.articles a where a.id=article_id and a.status='published'));
create policy "Public reads deals" on public.deals for select using(is_active and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()));
create policy "Public reads banners" on public.banners for select using(is_active and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()));
create policy "Public reads settings" on public.settings for select using(true);
create policy "Users read self" on public.users for select using(id=auth.uid() or public.is_admin());

do $$ declare t text; begin foreach t in array array['users','categories','brands','products','product_images','product_specifications','product_pros','product_cons','marketplaces','affiliate_links','affiliate_clicks','articles','article_products','deals','banners','settings'] loop execute format('create policy "Admins manage %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())',t); end loop; end $$;

insert into public.settings(key,value,description) values ('site','{"name":"Chọn Chuẩn","affiliate_disclosure":true}','Cấu hình website') on conflict do nothing;
insert into public.marketplaces(name,slug) values ('Shopee','shopee'),('Lazada','lazada'),('Tiki','tiki') on conflict do nothing;
