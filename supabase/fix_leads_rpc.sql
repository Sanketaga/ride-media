-- Fix anon lead insert via RPC (security definer) — bypasses RLS for public form
-- Run this in SQL Editor

create or replace function public.insert_lead(
  p_brand_name text,
  p_phone text,
  p_email text,
  p_ad_image_url text,
  p_shirt_background text,
  p_shirt_type text,
  p_days integer,
  p_zone_pincodes text[],
  p_message text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.leads (brand_name, phone, email, ad_image_url, shirt_background, shirt_type, days, zone_pincodes, message)
  values (p_brand_name, p_phone, p_email, p_ad_image_url, p_shirt_background, p_shirt_type, p_days, p_zone_pincodes, p_message)
  returning id into new_id;
  return new_id;
end;
$$;

-- Allow anon to call it
grant execute on function public.insert_lead(text,text,text,text,text,text,integer,text[],text) to anon, authenticated;

-- Also keep simple RLS fallback: allow public insert (if gateway maps to public not anon)
drop policy if exists "anon can insert leads" on public.leads;
create policy "public can insert leads" on public.leads for insert to public with check (true);

-- Ensure ad-images anon upload works (public)
drop policy if exists "anon can upload ad image" on storage.objects;
create policy "public can upload ad image" on storage.objects for insert to public with check (bucket_id = 'ad-images');

-- Diagnostic after: should show 2 policies
select policyname, cmd, roles from pg_policies where tablename in ('leads') order by policyname;
