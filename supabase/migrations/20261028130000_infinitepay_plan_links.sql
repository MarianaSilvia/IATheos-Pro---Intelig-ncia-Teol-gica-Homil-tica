alter table public.subscription_plans add column if not exists checkout_url text;
alter table public.subscription_plans drop constraint if exists subscription_plans_checkout_url_check;
alter table public.subscription_plans add constraint subscription_plans_checkout_url_check check(checkout_url is null or checkout_url ~ '^https://invoice\.infinitepay\.io/plans/');
update public.subscription_plans set checkout_url='https://invoice.infinitepay.io/plans/rosane-serafin/OKF1ThT8Le' where id='monthly';
update public.subscription_plans set checkout_url='https://invoice.infinitepay.io/plans/rosane-serafin/9hyznEeT4B' where id='annual';
