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
