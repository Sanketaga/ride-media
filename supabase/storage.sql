-- Storage RLS for buckets
-- Run after creating buckets `selfies` and `ad-images`

-- Selfies: rider can upload to own folder, read own, admin reads all
create policy "rider can upload own selfies"
on storage.objects for insert
with check (
  bucket_id = 'selfies' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "rider can read own selfies"
on storage.objects for select
using (
  bucket_id = 'selfies' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Ad images: anon can upload (lead form) with limit enforced in Edge Function, admin reads
create policy "anon can upload ad image"
on storage.objects for insert
with check (bucket_id = 'ad-images');

create policy "admin can read ad images"
on storage.objects for select
using (bucket_id = 'ad-images' and auth.jwt() ->> 'role' = 'admin');
