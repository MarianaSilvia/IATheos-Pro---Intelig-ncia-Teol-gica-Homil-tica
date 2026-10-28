-- Public catalog covers are small, non-sensitive assets. Uploads remain server-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-covers', 'product-covers', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_covers_public_read on storage.objects;
create policy product_covers_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-covers');
