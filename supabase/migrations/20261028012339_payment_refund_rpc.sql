create or replace function public.mark_payment_refunded(p_provider text,p_payment_id text) returns void language sql security invoker set search_path='' as $$ select private.mark_payment_refunded(p_provider,p_payment_id); $$;
revoke all on function public.mark_payment_refunded(text,text) from public,anon,authenticated;
grant execute on function public.mark_payment_refunded(text,text) to service_role;
