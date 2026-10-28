-- Explicit deny policies document the private, routine-only access model.
create policy no_direct_links on private.product_links for all to authenticated using(false) with check(false);
create policy no_direct_limits on private.ai_limits for all to authenticated using(false) with check(false);
-- Constraints remain effective for direct Data API writes, independently of Express validation.
alter table public.studies add constraint study_identity_present check(content ? 'id' and jsonb_typeof(content->'id')='string' and content->>'id'=id);
create function private.validate_catalog() returns trigger language plpgsql set search_path='' as $$
 declare d jsonb:=new.details;begin
 if not coalesce(
 jsonb_typeof(d->'title')='string' and jsonb_typeof(d->'author')='string' and jsonb_typeof(d->'description')='string'
 and jsonb_typeof(d->'category')='string' and jsonb_typeof(d->'price')='number' and jsonb_typeof(d->'pages')='number'
 and jsonb_typeof(d->'isFreeForSubscribers')='boolean' and jsonb_typeof(d->'archived')='boolean' and jsonb_typeof(d->'coverImage')='string'
 and length(d->>'title') between 1 and 300 and length(d->>'author') between 1 and 200 and length(d->>'description') between 1 and 6000
 and (d->>'price')::numeric between 0 and 100000 and (d->>'pages')::numeric between 1 and 10000
 and (d->>'pages')::numeric=trunc((d->>'pages')::numeric)
 and d->>'category' in ('Livro','Revista EBD','Comentário Bíblico','Manual Pastoral','Esboços')
 and (d->>'coverImage'='' or d->>'coverImage' ~ '^https://[^[:space:]]+$')
 and (d-array['title','author','description','category','price','pages','isFreeForSubscribers','coverImage','archived'])='{}'::jsonb
 and (d->>'archived')::boolean=new.archived,false)
 then raise check_violation using message='Produto inválido.';end if;return new;
 end; $$;
revoke all on function private.validate_catalog() from public,anon,authenticated;
create trigger catalog_validation before insert or update on public.products for each row execute function private.validate_catalog();
-- Retain no-address disclosure in the catalog even if administrators use the Data API.
alter table private.product_links add constraint external_https_link check(download_url !~* '^https://(localhost|127[.]0[.]0[.]1|\[::1\])([/:?#]|$)' and download_url !~ '[[:space:]]');
