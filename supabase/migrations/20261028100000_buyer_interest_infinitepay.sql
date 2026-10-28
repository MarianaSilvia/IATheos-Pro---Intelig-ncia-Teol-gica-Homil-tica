create table if not exists public.interest_leads(
 id uuid primary key default gen_random_uuid(),
 email text not null check(length(email) between 3 and 320),
 product_id text not null references public.products(id),
 consent boolean not null default false check(consent),
 created_at timestamptz not null default now()
);
create index if not exists interest_leads_email on public.interest_leads(lower(email));
create index if not exists interest_leads_product on public.interest_leads(product_id);
alter table public.interest_leads enable row level security;
revoke all on public.interest_leads from anon, authenticated;
grant select on public.interest_leads to authenticated;
create policy interest_admin_only on public.interest_leads for select to authenticated using((select public.is_admin()));

alter table public.payment_orders alter column user_id drop not null;
alter table public.payment_orders add column if not exists lead_id uuid references public.interest_leads(id);
alter table public.payment_orders add column if not exists checkout_url text;
alter table public.payment_orders add column if not exists refunded_at timestamptz;
create unique index if not exists payment_orders_provider_payment on public.payment_orders(provider, provider_payment_id) where provider is not null and provider_payment_id is not null;
create index if not exists payment_orders_lead on public.payment_orders(lead_id);

create or replace function private.complete_verified_payment(p_order_id uuid,p_provider text,p_payment_id text,p_amount_cents integer) returns void language plpgsql security definer set search_path='' as $$
declare o public.payment_orders;
begin
 if p_provider is null or length(trim(p_provider)) not between 1 and 80 or p_payment_id is null or length(trim(p_payment_id)) not between 1 and 200 then raise check_violation using message='Referência de pagamento inválida.'; end if;
 select * into o from public.payment_orders where id=p_order_id for update;
 if not found then raise no_data_found using message='Pedido não encontrado.'; end if;
 if o.amount_cents <> p_amount_cents then raise check_violation using message='Valor do pagamento não confere.'; end if;
 if o.status in ('paid','refunded') then
   if o.provider is distinct from p_provider or o.provider_payment_id is distinct from p_payment_id then raise exception 'Pedido já confirmado com outro pagamento.'; end if;
   return;
 end if;
 update public.payment_orders set status='paid',provider=p_provider,provider_payment_id=p_payment_id,paid_at=now() where id=p_order_id;
 if o.user_id is not null then insert into public.entitlements(user_id,product_id,source) values(o.user_id,o.product_id,'payment') on conflict do nothing; end if;
end; $$;
create or replace function private.mark_payment_refunded(p_provider text,p_payment_id text) returns void language plpgsql security definer set search_path='' as $$
declare o public.payment_orders;
begin
 select * into o from public.payment_orders where provider=p_provider and provider_payment_id=p_payment_id for update;
 if not found then raise no_data_found using message='Pedido do estorno não encontrado.'; end if;
 update public.payment_orders set status='refunded',refunded_at=now() where id=o.id;
 if o.user_id is not null then delete from public.entitlements where user_id=o.user_id and product_id=o.product_id; end if;
end; $$;
revoke all on function private.mark_payment_refunded(text,text) from public,anon,authenticated;
grant execute on function private.mark_payment_refunded(text,text) to service_role;
create or replace function public.mark_payment_refunded(p_provider text,p_payment_id text) returns void language sql security invoker set search_path='' as $$ select private.mark_payment_refunded(p_provider,p_payment_id); $$;
revoke all on function public.mark_payment_refunded(text,text) from public,anon,authenticated;
grant execute on function public.mark_payment_refunded(text,text) to service_role;
