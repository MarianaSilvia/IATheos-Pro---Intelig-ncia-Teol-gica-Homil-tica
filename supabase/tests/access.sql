begin;
-- All fixtures and assertions are rolled back, including Auth rows.
insert into auth.users(id,email,raw_user_meta_data) values
 ('00000000-0000-4000-8000-000000000001','admin@example.invalid','{"full_name":"Admin"}'),
 ('00000000-0000-4000-8000-000000000002','a@example.invalid','{"full_name":"A"}'),
 ('00000000-0000-4000-8000-000000000003','b@example.invalid','{"full_name":"B"}');
insert into public.app_admins(user_id) values('00000000-0000-4000-8000-000000000001');
set local role authenticated;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select public.sync_profile();
select 1 / public.is_admin()::integer as admin_verified;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
select public.sync_profile();
select 1 / (not public.is_admin())::integer as normal_not_admin;
insert into public.notes(user_id,id,title,content) values(auth.uid(),'note','Nota','Conteúdo');
insert into public.reading(user_id,chapter_key) values(auth.uid(),'gn:1');
delete from public.reading where user_id=auth.uid();
select 1 / ((select count(*) from public.reading)=0)::integer as empty_progress;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated"}';
select public.sync_profile();
select 1 / ((select count(*) from public.notes)=0)::integer as account_isolation;
do $$ begin
 begin insert into public.notes(user_id,id,title,content) values('00000000-0000-4000-8000-000000000002','attack','x','x');raise exception 'owner bypass';exception when insufficient_privilege then null;end;
 begin update public.profiles set email='forged@example.invalid' where user_id=auth.uid();raise exception 'profile bypass';exception when insufficient_privilege then null;end;
 begin insert into public.app_admins(user_id) values(auth.uid());raise exception 'admin bypass';exception when insufficient_privilege then null;end;
 begin insert into public.subscriptions(user_id,status,expires_at) values(auth.uid(),'active',now()+interval '1 year');raise exception 'subscription bypass';exception when insufficient_privilege then null;end;
 begin perform public.change_subscription(auth.uid(),'grant','attack');raise exception 'grant bypass';exception when insufficient_privilege then null;end;
 begin perform * from private.product_links;raise exception 'link table bypass';exception when insufficient_privilege then null;end;
 begin perform public.complete_verified_payment(gen_random_uuid(),'fake','fake',100);raise exception 'payment bypass';exception when insufficient_privilege then null;end;
end $$;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select public.change_subscription('00000000-0000-4000-8000-000000000002','grant','teste');
select public.change_subscription('00000000-0000-4000-8000-000000000002','renew','teste');
select 1 / ((select expires_at from public.subscriptions where user_id='00000000-0000-4000-8000-000000000002')=now()+interval '730 days')::integer as early_renewal;
select public.change_subscription('00000000-0000-4000-8000-000000000002','suspend','teste');
select set_config('test.paid',public.save_product(null,'{"title":"Pago","author":"Autor","description":"Teste","category":"Livro","price":10,"pages":1,"isFreeForSubscribers":true,"coverImage":"","archived":false}','https://files.example.invalid/paid.pdf'),true);
select set_config('test.free',public.save_product(null,'{"title":"Grátis","author":"Autor","description":"Teste","category":"Livro","price":0,"pages":1,"isFreeForSubscribers":false,"coverImage":"","archived":false}','https://files.example.invalid/free.pdf'),true);
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$ begin
 begin perform public.redeem_material(current_setting('test.paid'));raise exception 'suspension bypass';exception when insufficient_privilege then null;end;
 begin perform public.take_ai_slot();raise exception 'suspended ai bypass';exception when insufficient_privilege then null;end;
end $$;
select 1 / (public.redeem_material(current_setting('test.free'))='https://files.example.invalid/free.pdf')::integer as free_material;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select public.change_subscription('00000000-0000-4000-8000-000000000002','activate','teste');
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
select 1 / (public.redeem_material(current_setting('test.paid'))='https://files.example.invalid/paid.pdf')::integer as subscriber_material;
do $$ begin
 for i in 1..5 loop perform public.take_ai_slot();end loop;
 begin perform public.take_ai_slot();raise exception 'quota bypass';exception when raise_exception then if sqlerrm<>'Limite de 5 consultas por minuto.' then raise;end if;end;
end $$;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select public.save_product(current_setting('test.paid'),'{"archived":true}',null);
select public.grant_material('00000000-0000-4000-8000-000000000003',current_setting('test.free'),'teste');
do $$ begin
 begin perform public.grant_material('00000000-0000-4000-8000-000000000003',current_setting('test.paid'),'teste');raise exception 'archive bypass';exception when raise_exception then if sqlerrm<>'Produto indisponível para novas concessões.' then raise;end if;end;
end $$;
set local request.jwt.claims='{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
select 1 / (public.redeem_material(current_setting('test.paid'))='https://files.example.invalid/paid.pdf')::integer as archived_grant_preserved;
reset role;
insert into public.payment_orders(id,user_id,product_id,amount_cents) values('00000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000003',current_setting('test.paid'),1000);
set local role service_role;
set local request.jwt.claims='{"role":"service_role"}';
do $$ begin
 begin perform public.complete_verified_payment('00000000-0000-4000-8000-000000000010','test','test',1);raise exception 'amount bypass';exception when check_violation then null;end;
end $$;
select public.complete_verified_payment('00000000-0000-4000-8000-000000000010','test','test',1000);
select public.complete_verified_payment('00000000-0000-4000-8000-000000000010','test','test',1000);
select 1 / ((select count(*) from public.entitlements where user_id='00000000-0000-4000-8000-000000000003' and product_id=current_setting('test.paid'))=1)::integer as payment_idempotent;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.profiles;raise exception 'visitor bypass';exception when insufficient_privilege then null;end;
 begin perform public.redeem_material(current_setting('test.paid'));raise exception 'visitor link bypass';exception when insufficient_privilege then null;end;
end $$;
reset role;
select 'PASS: isolation, grants, links, renewals, suspension, quota, archived rights, payment amount and idempotency, anonymous denial' as validation;
rollback;
