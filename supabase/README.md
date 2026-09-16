# Supabase — Ride Media

**Apply schema:**
```bash
npm install -g supabase
supabase link --project-ref YOUR_PROJECT_REF
supabase db push  # runs schema.sql
```

**Create buckets (Dashboard → Storage):**
*   `selfies` - private, 5MB, allowed `image/jpeg, image/png, video/mp4`
*   `ad-images` - private, 5MB, allowed `image/jpeg, image/png`

**RLS:** Already in schema.sql. Test:
```sql
-- as anon, should succeed
insert into leads (brand_name, phone, ad_image_url, shirt_background, days, zone_pincodes) values ('Test','9999999999','url','white',30,'{110048}');
-- as rider A, should NOT read rider B trips (RLS blocks)
```

**Seed admin:**
```sql
-- in Supabase Auth, create user, then:
update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = 'you@example.com';
```
