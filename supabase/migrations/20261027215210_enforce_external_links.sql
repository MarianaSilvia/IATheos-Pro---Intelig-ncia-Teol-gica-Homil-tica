alter table private.product_links add constraint link_authority_without_credentials check(download_url ~ '^https://[^/@[:space:]?#]+([/?#][^[:space:]]*)?$');
create function private.stamp_reading() returns trigger language plpgsql set search_path='' as $$ begin new.completed_at=now();return new;end; $$;
revoke all on function private.stamp_reading() from public,anon,authenticated;
create trigger reading_server_time before insert or update on public.reading for each row execute function private.stamp_reading();
