-- Diagnostic: see current policies
select policyname, cmd, roles, permissive, qual, with_check from pg_policies where tablename = 'leads';
-- Fix v2: make anon insert permissive (try PUBLIC)
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads" on public.leads for insert with check (true);

-- Also ensure storage anon upload works
drop policy if exists "anon can upload ad image" on storage.objects;
create policy "anon can upload ad image" on storage.objects for insert with check (bucket_id = 'ad-images');

-- Test insert as anon (should return row)
-- After running, tell AI to test again
