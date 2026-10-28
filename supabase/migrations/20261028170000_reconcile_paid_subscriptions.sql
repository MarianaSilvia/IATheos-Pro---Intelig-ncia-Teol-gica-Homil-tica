-- Reconcile paid subscription orders when the buyer account is created after payment.
alter table public.payment_orders
  add column if not exists access_applied_at timestamptz;

create index if not exists payment_orders_paid_email_reconcile
  on public.payment_orders(status, order_kind, access_applied_at, lead_id);

create or replace function private.sync_profile() returns void
language plpgsql security definer set search_path='' as $$
declare
  u auth.users;
  order_row public.payment_orders;
  plan_row public.subscription_plans;
  expiry timestamptz;
begin
  if auth.uid() is null then
    raise insufficient_privilege;
  end if;

  select * into strict u from auth.users where id=auth.uid();
  insert into public.profiles(user_id,email,display_name)
    values(u.id,coalesce(u.email,''),left(coalesce(u.raw_user_meta_data->>'full_name',''),100))
  on conflict(user_id) do update set email=excluded.email;

  -- A buyer may be approved or created after InfinitePay confirms the order.
  -- Apply each paid order once, using the normalized e-mail captured at checkout.
  for order_row in
    select o.*
    from public.payment_orders o
    join public.interest_leads l on l.id=o.lead_id
    where o.status in ('paid','settled')
      and o.order_kind='subscription'
      and o.access_applied_at is null
      and lower(l.email)=lower(coalesce(u.email,''))
    order by o.paid_at nulls last, o.created_at
    for update of o
  loop
    select * into plan_row
      from public.subscription_plans
      where id=order_row.plan_id and active=true;
    if found then
      select greatest(now(),coalesce(s.expires_at,now())) into expiry
        from public.subscriptions s where s.user_id=u.id;
      insert into public.subscriptions(user_id,status,expires_at)
        values(u.id,'active',coalesce(expiry,now())+(plan_row.duration_days||' days')::interval)
      on conflict(user_id) do update set
        status='active', expires_at=excluded.expires_at, updated_at=now();
      update public.payment_orders
        set user_id=u.id, access_applied_at=now()
        where id=order_row.id;
    end if;
  end loop;
end; $$;

create or replace function private.complete_verified_payment(
  p_order_id uuid,p_provider text,p_payment_id text,p_amount_cents integer
) returns void language plpgsql security definer set search_path='' as $$
declare
  o public.payment_orders;
  p public.subscription_plans;
  uid uuid;
  expiry timestamptz;
begin
  if coalesce(auth.jwt()->>'role','')<>'service_role' then
    raise insufficient_privilege;
  end if;
  if p_provider is null or length(trim(p_provider)) not between 1 and 80
     or p_payment_id is null or length(trim(p_payment_id)) not between 1 and 200 then
    raise check_violation using message='Referência de pagamento inválida.';
  end if;
  select * into o from public.payment_orders where id=p_order_id for update;
  if not found then raise no_data_found using message='Pedido não encontrado.'; end if;
  if o.amount_cents is distinct from p_amount_cents then
    raise check_violation using message='Valor incompatível com o pedido.';
  end if;
  if o.status='paid' then
    if o.provider is distinct from p_provider or o.provider_payment_id is distinct from p_payment_id then
      raise exception 'Pedido já confirmado com outro pagamento.';
    end if;
    return;
  end if;
  if o.status<>'pending' then raise exception 'Pedido não permite confirmação.'; end if;
  update public.payment_orders set status='paid',provider=p_provider,
    provider_payment_id=p_payment_id,paid_at=now() where id=p_order_id;

  if o.order_kind='subscription' and o.plan_id is not null then
    select * into p from public.subscription_plans where id=o.plan_id and active=true;
    if not found then raise check_violation using message='Plano não está disponível.'; end if;
    select au.id into uid from auth.users au
      left join public.interest_leads l on l.id=o.lead_id
      where lower(au.email)=lower(l.email) limit 1;
    if uid is not null then
      select greatest(now(),coalesce(s.expires_at,now())) into expiry
        from public.subscriptions s where s.user_id=uid;
      insert into public.profiles(user_id,email,display_name)
        select au.id,coalesce(au.email,''),left(coalesce(au.raw_user_meta_data->>'full_name',''),100)
        from auth.users au where au.id=uid on conflict(user_id) do nothing;
      insert into public.subscriptions(user_id,status,expires_at)
        values(uid,'active',coalesce(expiry,now())+(p.duration_days||' days')::interval)
      on conflict(user_id) do update set status='active',expires_at=excluded.expires_at,updated_at=now();
      update public.payment_orders set user_id=uid,access_applied_at=now() where id=o.id;
    end if;
  elsif o.user_id is not null then
    insert into public.entitlements(user_id,product_id,source)
      values(o.user_id,o.product_id,'payment') on conflict do nothing;
    update public.payment_orders set access_applied_at=now() where id=o.id;
  end if;
end; $$;

revoke all on function private.sync_profile(), private.complete_verified_payment(uuid,text,text,integer)
  from public,anon,authenticated;
grant execute on function private.sync_profile() to authenticated;
grant execute on function private.complete_verified_payment(uuid,text,text,integer) to service_role;
