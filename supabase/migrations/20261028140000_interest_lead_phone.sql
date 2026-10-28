alter table public.interest_leads add column if not exists phone_e164 text;
alter table public.interest_leads drop constraint if exists interest_leads_phone_e164_check;
alter table public.interest_leads add constraint interest_leads_phone_e164_check check (phone_e164 is null or phone_e164 ~ '^55[1-9][0-9]{9,10}$');
create index if not exists interest_leads_phone on public.interest_leads(phone_e164);
