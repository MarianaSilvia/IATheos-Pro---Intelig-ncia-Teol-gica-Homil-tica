alter table private.product_links add column if not exists drive_file_id text;
create or replace function private.capture_drive_file_id() returns trigger language plpgsql set search_path='' as $$
begin
 new.drive_file_id := coalesce((regexp_match(new.download_url, '/d/([^/]+)'))[1], (regexp_match(new.download_url, '[?&]id=([^&]+)'))[1]);
 return new;
end; $$;
drop trigger if exists product_links_drive_id on private.product_links;
create trigger product_links_drive_id before insert or update of download_url on private.product_links for each row execute function private.capture_drive_file_id();
