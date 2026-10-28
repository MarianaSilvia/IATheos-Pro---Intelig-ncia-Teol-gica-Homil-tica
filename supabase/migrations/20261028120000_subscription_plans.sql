-- Subscription plans are separate from individual digital products.
create table if not exists public.subscription_plans(
 id text primary key,
 name text not null check(length(name) between 1 and 80),
 amount_cents integer not null check(amount_cents>0),
 duration_days integer not null check(duration_days in (30,365)),
 active boolean not null default true,
 provider text not null default 'infinitepay',
 provider_plan_id text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.subscription_plans enable row level security;
revoke all on public.subscription_plans from anon, authenticated;
grant select on public.subscription_plans to anon, authenticated;
create policy active_plans_public on public.subscription_plans for select to anon, authenticated using(active or (select public.is_admin()));
insert into public.subscription_plans(id,name,amount_cents,duration_days)
values ('monthly','Plano mensal',1000,30),('annual','Plano anual',10000,365)
on conflict(id) do update set name=excluded.name,amount_cents=excluded.amount_cents,duration_days=excluded.duration_days;

alter table public.interest_leads alter column product_id drop not null;
alter table public.interest_leads add column if not exists plan_id text references public.subscription_plans(id);
alter table public.payment_orders alter column product_id drop not null;
alter table public.payment_orders add column if not exists plan_id text references public.subscription_plans(id);
alter table public.payment_orders add column if not exists order_kind text not null default 'product' check(order_kind in ('product','subscription'));
create index if not exists payment_orders_plan on public.payment_orders(plan_id);

create or replace function private.complete_verified_payment(p_order_id uuid,p_provider text,p_payment_id text,p_amount_cents integer) returns void language plpgsql security definer set search_path='' as $$
declare o public.payment_orders; p public.subscription_plans; uid uuid; expiry timestamptz;
begin
 if coalesce(auth.jwt()->>'role','')<>'service_role' then raise insufficient_privilege;end if;
 if p_provider is null or length(trim(p_provider)) not between 1 and 80 or p_payment_id is null or length(trim(p_payment_id)) not between 1 and 200 then raise check_violation using message='Referência de pagamento inválida.';end if;
 select * into o from public.payment_orders where id=p_order_id for update;
 if not found then raise no_data_found using message='Pedido não encontrado.';end if;
 if o.amount_cents is distinct from p_amount_cents then raise check_violation using message='Valor incompatível com o pedido.';end if;
 if o.status='paid' then
  if o.provider is distinct from p_provider or o.provider_payment_id is distinct from p_payment_id then raise exception 'Pedido já confirmado com outro pagamento.';end if;
  return;
 end if;
 if o.status<>'pending' then raise exception 'Pedido não permite confirmação.';end if;
 update public.payment_orders set status='paid',provider=p_provider,provider_payment_id=p_payment_id,paid_at=now() where id=p_order_id;
 if o.order_kind='subscription' and o.plan_id is not null then
  select * into p from public.subscription_plans where id=o.plan_id and active=true;
  if not found then raise check_violation using message='Plano não está disponível.';end if;
  select au.id into uid from auth.users au left join public.interest_leads l on l.id=o.lead_id where lower(au.email)=lower(l.email) limit 1;
  if uid is not null then
   select greatest(now(),coalesce(s.expires_at,now())) into expiry from public.subscriptions s where s.user_id=uid;
   insert into public.profiles(user_id,email,display_name) select au.id,coalesce(au.email,''),left(coalesce(au.raw_user_meta_data->>'full_name',''),100) from auth.users au where au.id=uid on conflict(user_id) do nothing;
   insert into public.subscriptions(user_id,status,expires_at) values(uid,'active',coalesce(expiry,now())+(p.duration_days||' days')::interval)
   on conflict(user_id) do update set status='active',expires_at=excluded.expires_at,updated_at=now();
  end if;
 elsif o.user_id is not null then
  insert into public.entitlements(user_id,product_id,source) values(o.user_id,o.product_id,'payment') on conflict do nothing;
 end if;
end; $$;
grant execute on function private.complete_verified_payment(uuid,text,text,integer) to service_role;
