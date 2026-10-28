-- QI Store Pro: no files or download addresses in the public catalog.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;
alter default privileges in schema private revoke execute on functions from public;
create table public.app_admins(user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
alter table public.app_admins enable row level security;
grant select on public.app_admins to authenticated;
create policy admin_self on public.app_admins for select to authenticated using(user_id=(select auth.uid()));
create function public.is_admin() returns boolean language sql stable security invoker set search_path='' as $$ select exists(select 1 from public.app_admins where user_id=(select auth.uid())); $$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;
create table public.profiles(
 user_id uuid primary key references auth.users(id) on delete cascade,
 email text not null check(length(email)<=320), display_name text not null check(length(display_name)<=100),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.studies(
 user_id uuid not null references auth.users(id) on delete cascade,id text not null check(id ~ '^[A-Za-z0-9_-]{1,128}$'),
 type text not null check(type in ('sermon','ebd','xray')), title text not null check(length(title) between 1 and 400),reference text not null check(length(reference) between 1 and 400),
 content jsonb not null check(jsonb_typeof(content)='object' and octet_length(content::text)<=240000 and content->>'id'=id),
 updated_at timestamptz not null default now(), primary key(user_id,id)
);
create index studies_user_updated on public.studies(user_id,updated_at desc);
create table public.notes(
 user_id uuid not null references auth.users(id) on delete cascade,id text not null check(id ~ '^[A-Za-z0-9_-]{1,128}$'),
 title text not null check(length(title) between 1 and 300),biblical_reference text not null default '' check(length(biblical_reference)<=300),content text not null check(length(content) between 1 and 12000),
 updated_at timestamptz not null default now(),primary key(user_id,id)
);
create index notes_user_updated on public.notes(user_id,updated_at desc);
create table public.reading(
 user_id uuid not null references auth.users(id) on delete cascade,chapter_key text not null check(chapter_key ~ '^[a-z0-9]+:[1-9][0-9]{0,2}$'),completed_at timestamptz not null default now(),primary key(user_id,chapter_key)
);
create table public.subscriptions(
 user_id uuid primary key references public.profiles(user_id),status text not null check(status in ('active','suspended')),expires_at timestamptz not null,updated_at timestamptz not null default now()
);
create table public.products(
 id text primary key default gen_random_uuid()::text,
 details jsonb not null check(jsonb_typeof(details)='object'),
 archived boolean not null default true,has_link boolean not null default false,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table private.product_links(
 product_id text primary key references public.products(id),download_url text not null check(length(download_url)<=4096 and download_url ~ '^https://[^/@[:space:]]+[^[:space:]]*$'),updated_at timestamptz not null default now()
);
alter table private.product_links enable row level security;
create table public.entitlements(
 user_id uuid not null references public.profiles(user_id),product_id text not null references public.products(id),
 source text not null check(source in ('manual','free','subscription','payment')),granted_at timestamptz not null default now(),primary key(user_id,product_id)
);
create index entitlements_product on public.entitlements(product_id);
create table public.admin_audit(
 id uuid primary key default gen_random_uuid(),actor_uid uuid not null references auth.users(id),target_uid uuid not null references auth.users(id),product_id text references public.products(id),
 action text not null,reason text not null check(length(reason) between 1 and 1000),created_at timestamptz not null default now()
);
create index admin_audit_created on public.admin_audit(created_at desc);
create index admin_audit_actor on public.admin_audit(actor_uid);
create index admin_audit_target on public.admin_audit(target_uid);
create index admin_audit_product on public.admin_audit(product_id);
create table public.generation_events(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,type text not null check(type in ('sermon','ebd','xray','chat')),created_at timestamptz not null default now()
);
create index events_user_created on public.generation_events(user_id,created_at);
create table private.ai_limits(user_id uuid primary key references auth.users(id) on delete cascade,window_start timestamptz not null default now(),count integer not null default 0 check(count between 0 and 5));
alter table private.ai_limits enable row level security;
-- Future payment provider writes only through a trusted server integration; no public write grant.
create table public.payment_orders(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(user_id),product_id text not null references public.products(id),
 amount_cents integer not null check(amount_cents>=0),currency text not null default 'BRL' check(currency='BRL'),status text not null default 'pending' check(status in ('pending','paid','refunded','cancelled')),
 provider text,provider_payment_id text,created_at timestamptz not null default now(),paid_at timestamptz,unique(provider,provider_payment_id)
);
create index orders_user on public.payment_orders(user_id);
create index orders_product on public.payment_orders(product_id);
create function private.touch_updated() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();return new;end; $$;
create trigger profiles_updated before update on public.profiles for each row execute function private.touch_updated();
create trigger studies_updated before insert or update on public.studies for each row execute function private.touch_updated();
create trigger notes_updated before insert or update on public.notes for each row execute function private.touch_updated();
do $$ declare t text;begin
 foreach t in array array['profiles','studies','notes','reading','subscriptions','products','entitlements','admin_audit','generation_events','payment_orders'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 end loop;
 foreach t in array array['studies','notes','reading'] loop
 execute format('grant insert,update,delete on public.%I to authenticated',t);
 execute format('create policy owner_rows on public.%I for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()))',t);
 end loop;
end $$;
create policy own_profile on public.profiles for select to authenticated using(user_id=(select auth.uid()) or (select public.is_admin()));
grant update(display_name) on public.profiles to authenticated;
create policy edit_name on public.profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy own_subscription on public.subscriptions for select to authenticated using(user_id=(select auth.uid()) or (select public.is_admin()));
create policy own_entitlement on public.entitlements for select to authenticated using(user_id=(select auth.uid()) or (select public.is_admin()));
create policy catalog on public.products for select to authenticated using(not archived or (select public.is_admin()) or exists(select 1 from public.entitlements e where e.product_id=id and e.user_id=(select auth.uid())));
create policy audit_admin on public.admin_audit for select to authenticated using((select public.is_admin()));
create policy own_events on public.generation_events for select to authenticated using(user_id=(select auth.uid()));
create policy own_orders on public.payment_orders for select to authenticated using(user_id=(select auth.uid()) or (select public.is_admin()));
-- Definer routines are private, check identity explicitly, and expose only narrow invoker wrappers.
create function private.sync_profile() returns void language plpgsql security definer set search_path='' as $$
 declare u auth.users;begin
 if auth.uid() is null then raise insufficient_privilege;end if;
 select * into strict u from auth.users where id=auth.uid();
 insert into public.profiles(user_id,email,display_name) values(u.id,coalesce(u.email,''),left(coalesce(u.raw_user_meta_data->>'full_name',''),100))
 on conflict(user_id) do update set email=excluded.email;
 end; $$;
create function private.save_product(p_id text,p_details jsonb,p_url text) returns text language plpgsql security definer set search_path='' as $$
 declare old public.products; d jsonb; new_id text;begin
 if auth.uid() is null or not public.is_admin() then raise insufficient_privilege using message='Acesso restrito ao administrador.';end if;
 if p_id is not null then select * into old from public.products where id=p_id for update;if not found then raise no_data_found using message='Produto não encontrado.';end if;end if;
 d=coalesce(old.details,'{}'::jsonb)||p_details;
 if jsonb_typeof(d)<>'object' or (d-array['title','author','category','description','price','pages','isFreeForSubscribers','coverImage','archived'])<>'{}'::jsonb
 or not(d ?& array['title','author','category','description','price','pages','isFreeForSubscribers','coverImage','archived'])
 or length(d->>'title') not between 1 and 300 or length(d->>'author') not between 1 and 200 or length(d->>'description') not between 1 and 6000
 or d->>'category' not in ('Livro','Revista EBD','Comentário Bíblico','Manual Pastoral','Esboços')
 or jsonb_typeof(d->'price')<>'number' or (d->>'price')::numeric not between 0 and 100000
 or jsonb_typeof(d->'pages')<>'number' or (d->>'pages')::numeric not between 1 and 10000 or (d->>'pages')::numeric<>trunc((d->>'pages')::numeric)
 or jsonb_typeof(d->'isFreeForSubscribers')<>'boolean' or jsonb_typeof(d->'archived')<>'boolean'
 then raise check_violation using message='Produto inválido.';end if;
 if p_url is not null and (length(p_url)>4096 or p_url !~ '^https://[^/@[:space:]]+[^[:space:]]*$') then raise check_violation using message='Link HTTPS inválido.';end if;
 if p_id is null and p_url is null then raise check_violation using message='Informe o link de download.';end if;
 new_id=coalesce(p_id,gen_random_uuid()::text);
 insert into public.products(id,details,archived,has_link) values(new_id,d,(d->>'archived')::boolean,true)
 on conflict(id) do update set details=d,archived=(d->>'archived')::boolean,has_link=true,updated_at=now();
 if p_url is not null then insert into private.product_links(product_id,download_url) values(new_id,p_url) on conflict(product_id) do update set download_url=excluded.download_url,updated_at=now();end if;
 return new_id;
 end; $$;
create function private.change_subscription(p_user_id uuid,p_action text,p_reason text) returns void language plpgsql security definer set search_path='' as $$
 declare old public.subscriptions;expiry timestamptz;begin
 if auth.uid() is null or not public.is_admin() then raise insufficient_privilege using message='Acesso restrito ao administrador.';end if;
 if p_action not in ('grant','renew','suspend','activate') or length(trim(p_reason)) not between 1 and 1000 then raise check_violation using message='Ação ou motivo inválido.';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
 perform 1 from public.profiles where user_id=p_user_id;if not found then raise no_data_found using message='Usuário não cadastrado.';end if;
 select * into old from public.subscriptions where user_id=p_user_id for update;
 if old.user_id is null and p_action in ('suspend','activate') then raise no_data_found using message='Usuário sem assinatura concedida.';end if;
 if p_action='activate' and old.expires_at<=now() then raise exception 'A assinatura expirou. Use renovar.';end if;
 expiry=case when p_action in ('grant','renew') then greatest(now(),coalesce(old.expires_at,now()))+interval '365 days' else old.expires_at end;
 insert into public.subscriptions(user_id,status,expires_at) values(p_user_id,case when p_action='suspend' then 'suspended' else 'active' end,expiry)
 on conflict(user_id) do update set status=excluded.status,expires_at=excluded.expires_at,updated_at=now();
 insert into public.admin_audit(actor_uid,target_uid,action,reason) values(auth.uid(),p_user_id,p_action,trim(p_reason));
 end; $$;
create function private.grant_material(p_user_id uuid,p_product_id text,p_reason text) returns void language plpgsql security definer set search_path='' as $$
 begin
 if auth.uid() is null or not public.is_admin() then raise insufficient_privilege using message='Acesso restrito ao administrador.';end if;
 if length(trim(p_reason)) not between 1 and 1000 then raise check_violation using message='Informe o motivo.';end if;
 perform 1 from public.products where id=p_product_id and not archived and has_link for update;
 if not found then raise exception 'Produto indisponível para novas concessões.';end if;
 insert into public.entitlements(user_id,product_id,source) values(p_user_id,p_product_id,'manual') on conflict do nothing;
 insert into public.admin_audit(actor_uid,target_uid,product_id,action,reason) values(auth.uid(),p_user_id,p_product_id,'grant-product',trim(p_reason));
 end; $$;
create function private.redeem_material(p_product_id text) returns text language plpgsql security definer set search_path='' as $$
 declare p public.products;link text;eligible boolean;begin
 if auth.uid() is null then raise insufficient_privilege;end if;
 select * into p from public.products where id=p_product_id for update;
 if not found then raise no_data_found using message='Material indisponível.';end if;
 if not public.is_admin() and not exists(select 1 from public.entitlements where user_id=auth.uid() and product_id=p_product_id) then
 eligible=not p.archived and ((p.details->>'price')::numeric=0 or ((p.details->>'isFreeForSubscribers')::boolean and exists(select 1 from public.subscriptions where user_id=auth.uid() and status='active' and expires_at>now())));
 if not coalesce(eligible,false) then raise insufficient_privilege using message='Você não possui acesso a este material.';end if;
 insert into public.entitlements(user_id,product_id,source) values(auth.uid(),p_product_id,case when (p.details->>'price')::numeric=0 then 'free' else 'subscription' end) on conflict do nothing;
 end if;
 select download_url into link from private.product_links where product_id=p_product_id;
 if link is null then raise no_data_found using message='Link indisponível.';end if;return link;
 end; $$;
create function private.take_ai_slot() returns void language plpgsql security definer set search_path='' as $$
 declare n integer;begin
 if auth.uid() is null or not(public.is_admin() or exists(select 1 from public.subscriptions where user_id=auth.uid() and status='active' and expires_at>now())) then raise insufficient_privilege;end if;
 insert into private.ai_limits(user_id,count) values(auth.uid(),1)
 on conflict(user_id) do update set count=case when private.ai_limits.window_start<=now()-interval '1 minute' then 1 else private.ai_limits.count+1 end,
 window_start=case when private.ai_limits.window_start<=now()-interval '1 minute' then now() else private.ai_limits.window_start end
 where private.ai_limits.window_start<=now()-interval '1 minute' or private.ai_limits.count<5 returning count into n;
 if n is null then raise exception 'Limite de 5 consultas por minuto.';end if;
 end; $$;
create function public.sync_profile() returns void language sql security invoker set search_path='' as $$ select private.sync_profile(); $$;
create function public.save_product(p_id text,p_details jsonb,p_url text) returns text language sql security invoker set search_path='' as $$ select private.save_product(p_id,p_details,p_url); $$;
create function public.change_subscription(p_user_id uuid,p_action text,p_reason text) returns void language sql security invoker set search_path='' as $$ select private.change_subscription(p_user_id,p_action,p_reason); $$;
create function public.grant_material(p_user_id uuid,p_product_id text,p_reason text) returns void language sql security invoker set search_path='' as $$ select private.grant_material(p_user_id,p_product_id,p_reason); $$;
create function public.redeem_material(p_product_id text) returns text language sql security invoker set search_path='' as $$ select private.redeem_material(p_product_id); $$;
create function public.take_ai_slot() returns void language sql security invoker set search_path='' as $$ select private.take_ai_slot(); $$;
revoke all on all functions in schema private from public,anon,authenticated;
grant execute on function private.sync_profile(),private.save_product(text,jsonb,text),private.change_subscription(uuid,text,text),private.grant_material(uuid,text,text),private.redeem_material(text),private.take_ai_slot() to authenticated;
revoke all on function public.sync_profile(),public.save_product(text,jsonb,text),public.change_subscription(uuid,text,text),public.grant_material(uuid,text,text),public.redeem_material(text),public.take_ai_slot() from public,anon;
grant execute on function public.sync_profile(),public.save_product(text,jsonb,text),public.change_subscription(uuid,text,text),public.grant_material(uuid,text,text),public.redeem_material(text),public.take_ai_slot() to authenticated;
grant all on all tables in schema public,private to service_role;
-- Adapter hook for a future provider. No HTTP route invokes this until payment verification exists.
create function private.complete_verified_payment(p_order_id uuid,p_provider text,p_payment_id text,p_amount_cents integer) returns void language plpgsql security definer set search_path='' as $$
 declare o public.payment_orders;begin
 if coalesce(auth.jwt()->>'role','')<>'service_role' then raise insufficient_privilege;end if;
 if p_provider is null or length(trim(p_provider)) not between 1 and 80 or p_payment_id is null or length(trim(p_payment_id)) not between 1 and 200 then raise check_violation using message='Referência de pagamento inválida.';end if;
 select * into o from public.payment_orders where id=p_order_id for update;
 if not found then raise no_data_found using message='Pedido não encontrado.';end if;
 if p_amount_cents is distinct from o.amount_cents then raise check_violation using message='Valor incompatível com o pedido.';end if;
 if o.status='paid' then
  if o.provider is distinct from p_provider or o.provider_payment_id is distinct from p_payment_id then raise exception 'Pedido já confirmado com outro pagamento.';end if;
  return;
 end if;
 if o.status<>'pending' then raise exception 'Pedido não permite confirmação.';end if;
 update public.payment_orders set status='paid',provider=p_provider,provider_payment_id=p_payment_id,paid_at=now() where id=p_order_id;
 insert into public.entitlements(user_id,product_id,source) values(o.user_id,o.product_id,'payment') on conflict do nothing;
 end; $$;
create function public.complete_verified_payment(p_order_id uuid,p_provider text,p_payment_id text,p_amount_cents integer) returns void language sql security invoker set search_path='' as $$ select private.complete_verified_payment(p_order_id,p_provider,p_payment_id,p_amount_cents); $$;
revoke all on function private.complete_verified_payment(uuid,text,text,integer),public.complete_verified_payment(uuid,text,text,integer) from public,anon,authenticated;
grant execute on function private.complete_verified_payment(uuid,text,text,integer),public.complete_verified_payment(uuid,text,text,integer) to service_role;
