-- Fix anon insert for leads + ad-images (new Supabase requires TO anon)
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads" on public.leads for insert to anon with check (true);

drop policy if exists "anon can upload ad image" on storage.objects;
create policy "anon can upload ad image" on storage.objects for insert to anon with check (bucket_id = 'ad-images');

-- Ensure leads insert works without auth header issue
-- Test after: insert via publishable should return 201
