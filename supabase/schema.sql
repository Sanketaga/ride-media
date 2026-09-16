-- Ride Media — Supabase Schema v1.0 (50 Rider MVP)
-- Run: npx supabase db push
-- All tables have RLS. anon can only insert leads.

-- Enable UUID
create extension if not exists "uuid-ossp";

-- 1. Riders (profile, extends auth.users)
create table public.riders (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  kyc_status text not null default 'pending' check (kyc_status in ('pending','approved','rejected')),
  vehicle text check (vehicle in ('bike','cycle','ev')),
  size text check (size in ('S','M','L','XL','XXL')),
  zone text, -- pincode
  upi_id text,
  device_id text,
  created_at timestamp with time zone default now()
);
alter table public.riders enable row level security;
create policy "rider can read own" on public.riders for select using (auth.uid() = id);
create policy "rider can upsert own" on public.riders for insert with check (auth.uid() = id);
create policy "rider can update own" on public.riders for update using (auth.uid() = id);

-- 2. Campaigns (created by admin from leads)
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null,
  ad_image_url text,
  shirt_background text check (shirt_background in ('white','black','navy')) default 'white',
  shirt_type text default 'Round Neck 180 GSM',
  payout_per_ekm numeric not null default 1.5,
  zone_pincodes text[] not null,
  days integer not null check (days in (30,60,90)),
  status text not null default 'draft' check (status in ('draft','live','ended')),
  wallet_balance numeric default 0,
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id)
);
alter table public.campaigns enable row level security;
create policy "anyone can read live campaigns" on public.campaigns for select using (status = 'live');
create policy "admin can all" on public.campaigns for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');

-- 3. Leads (public landing form)
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null,
  phone text not null,
  email text,
  ad_image_url text,
  shirt_background text check (shirt_background in ('white','black','navy')),
  shirt_type text default 'Round Neck 180 GSM',
  days integer check (days in (30,60,90)),
  zone_pincodes text[] ,
  message text,
  status text default 'new' check (status in ('new','contacted','converted','rejected')),
  created_at timestamp with time zone default now()
);
alter table public.leads enable row level security;
create policy "anon can insert leads" on public.leads for insert with check (true);
create policy "admin can read leads" on public.leads for select using (auth.jwt() ->> 'role' = 'admin');

-- 4. Enrollments (one active per rider)
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  rider_id uuid not null references public.riders(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  shirts_issued integer default 2,
  deposit_status text default 'pending' check (deposit_status in ('pending','paid','waived','refunded','forfeited')),
  status text not null default 'active' check (status in ('active','paused','completed','cancelled')),
  enrolled_at timestamp with time zone default now(),
  unique (rider_id, status) -- simplified: only one active via partial index below
);
create unique index enrollments_one_active_per_rider on public.enrollments (rider_id) where status = 'active';
alter table public.enrollments enable row level security;
create policy "rider can read own enrollments" on public.enrollments for select using (auth.uid() = rider_id);
create policy "admin can all enrollments" on public.enrollments for all using (auth.jwt() ->> 'role' = 'admin');

-- 5. Trips
create table public.trips (
  id uuid primary key default uuid_generate_v4(),
  rider_id uuid not null references public.riders(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id),
  start_ts timestamp with time zone not null,
  end_ts timestamp with time zone,
  raw_km numeric default 0,
  ekm numeric default 0,
  earnings numeric default 0,
  verified boolean default false,
  polyline text, -- encoded polyline
  created_at timestamp with time zone default now()
);
alter table public.trips enable row level security;
create policy "rider can crud own trips" on public.trips for all using (auth.uid() = rider_id) with check (auth.uid() = rider_id);
create policy "admin can read trips" on public.trips for select using (auth.jwt() ->> 'role' = 'admin');

-- 6. Verifications (selfies)
create table public.verifications (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid references public.trips(id) on delete cascade,
  rider_id uuid not null references public.riders(id) on delete cascade,
  ts timestamp with time zone default now(),
  type text check (type in ('start','random')),
  selfie_urls text[],
  confidence integer check (confidence between 0 and 100),
  result text check (result in ('pending','pass','fail')),
  reviewed_by uuid references auth.users(id)
);
alter table public.verifications enable row level security;
create policy "rider can read own verifications" on public.verifications for select using (auth.uid() = rider_id);
create policy "rider can insert own verifications" on public.verifications for insert with check (auth.uid() = rider_id);
create policy "admin can all verifications" on public.verifications for all using (auth.jwt() ->> 'role' = 'admin');

-- 7. Payouts
create table public.payouts (
  id uuid primary key default uuid_generate_v4(),
  rider_id uuid not null references public.riders(id) on delete cascade,
  amount numeric not null check (amount > 0),
  utr text,
  status text default 'pending' check (status in ('pending','success','failed')),
  created_at timestamp with time zone default now()
);
alter table public.payouts enable row level security;
create policy "rider can read own payouts" on public.payouts for select using (auth.uid() = rider_id);
create policy "admin can all payouts" on public.payouts for all using (auth.jwt() ->> 'role' = 'admin');

-- 8. Zone weights (tunable without deploy)
create table public.zone_weights (
  pincode text primary key,
  weight numeric not null default 1.0 check (weight between 0.1 and 2.0),
  label text
);
insert into public.zone_weights (pincode, weight, label) values
('110048', 1.5, 'Lajpat Nagar - High'),
('110017', 1.3, 'Malviya Nagar - High'),
('110025', 1.0, 'Saket - Medium'),
('110049', 0.9, 'GK - Medium')
on conflict (pincode) do nothing;

-- Storage buckets (create via supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('selfies','selfies', false), ('ad-images','ad-images', false);
