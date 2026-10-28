-- Create/reconcile buyer access after the verified payment webhook creates the Auth user.
-- This function is service-role only; it never permits a client to grant access.
create or replace function private.reconcile_paid_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path=''
as $$
declare
  o public.payment_orders;
  l public.interest_leads;
  p public.subscription_plans;
  uid uuid;
  expiry timestamptz;
begin
  if coalesce(auth.jwt()->>'role','') <> 'service_role' then
    raise insufficient_privilege;
  end if;

  select * into o from public.payment_orders where id=p_order_id for update;
  if not found or o.status not in ('paid','settled') then
    raise no_data_found using message='Pagamento não confirmado.';
  end if;

  select * into l from public.interest_leads where id=o.lead_id;
  if l.email is null then
    raise check_violation using message='Pedido sem e-mail de acesso.';
  end if;

  select au.id into uid from auth.users au
    where lower(au.email)=lower(l.email) limit 1;
  if uid is null then
    raise no_data_found using message='Conta do comprador ainda não foi criada.';
  end if;

  if o.order_kind='subscription' and o.plan_id is not null then
    select * into p from public.subscription_plans where id=o.plan_id and active=true;
    if not found then
      raise check_violation using message='Plano não está disponível.';
    end if;
    select greatest(now(),coalesce(s.expires_at,now())) into expiry
      from public.subscriptions s where s.user_id=uid;
    insert into public.profiles(user_id,email,display_name)
      select au.id,coalesce(au.email,''),left(coalesce(au.raw_user_meta_data->>'full_name',''),100)
      from auth.users au where au.id=uid on conflict(user_id) do nothing;
    insert into public.subscriptions(user_id,status,expires_at)
      values(uid,'active',coalesce(expiry,now())+(p.duration_days||' days')::interval)
    on conflict(user_id) do update set status='active',expires_at=excluded.expires_at,updated_at=now();
  elsif o.product_id is not null then
    insert into public.entitlements(user_id,product_id,source)
      values(uid,o.product_id,'payment') on conflict do nothing;
  end if;

  update public.payment_orders
    set user_id=uid, access_applied_at=coalesce(access_applied_at,now())
    where id=o.id;
end;
$$;

create or replace function public.reconcile_paid_order(p_order_id uuid)
returns void language sql security invoker set search_path='' as $$
  select private.reconcile_paid_order(p_order_id);
$$;

revoke all on function private.reconcile_paid_order(uuid), public.reconcile_paid_order(uuid)
  from public, anon, authenticated;
grant execute on function private.reconcile_paid_order(uuid), public.reconcile_paid_order(uuid)
  to service_role;
