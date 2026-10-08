-- Step 2: member profiles.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- Safe to run more than once.

-- One row per member. Only public-safe details live here: no phone number,
-- email, or last name (those stay private in Supabase's login system).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  city text not null default '',
  phone_verified boolean not null default false,
  guidelines_accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Signed-in members can see each other's public profile (first name, city, badge).
drop policy if exists "Members can view profiles" on public.profiles;
create policy "Members can view profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Members can edit only their own profile...
drop policy if exists "Members can update their own profile" on public.profiles;
create policy "Members can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ...and only these columns. The verified badge is set by the system, never by the member.
revoke update on public.profiles from authenticated, anon;
grant update (first_name, city, guidelines_accepted_at) on public.profiles to authenticated;

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, city, phone_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'city', ''),
    new.phone_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Turn on the verified badge when someone confirms their phone with a text code.
create or replace function public.handle_phone_confirmed()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles
  set phone_verified = (new.phone_confirmed_at is not null and coalesce(new.phone, '') <> '')
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_phone_confirmed on auth.users;
create trigger on_auth_user_phone_confirmed
  after update of phone, phone_confirmed_at on auth.users
  for each row execute function public.handle_phone_confirmed();
