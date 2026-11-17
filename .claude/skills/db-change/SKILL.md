---
name: db-change
description: Add or change Holiday Swap's Supabase database (tables, columns, row-level security policies, triggers, storage buckets) by writing the next numbered supabase/NN_*.sql file that the owner pastes into the SQL Editor. Use for any data model change.
---

# Write a database step

The owner runs these by hand in Supabase, so each file must be safe, self-explanatory and
re-runnable. `supabase/01_profiles.sql` is the reference example; match its style.

## 1. Pick the file name

`ls supabase/` and use the next number: `02_listings.sql`, `03_messages.sql`, ... Never edit a
file that may already have been run; add a new file that changes things instead.

## 2. Header comment

```sql
-- Step N: <what this adds, in plain English>.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- Safe to run more than once.
```

## 3. Rules for the SQL

- **Re-runnable:** `create table if not exists`, `alter table ... add column if not exists`,
  `drop policy if exists` before `create policy`, `create or replace function`,
  `drop trigger if exists` before `create trigger`.
- **RLS on every table:** `alter table public.x enable row level security;` with a policy for
  each action that's allowed (select/insert/update/delete). No policy means no access, which is
  the safe default.
- **Owner checks** use `(select auth.uid()) = owner_id` in both `using` and `with check`.
- **Inserts:** set `owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade`
  and check it in the insert policy so nobody can post as someone else.
- **Column grants:** `revoke update on public.x from authenticated, anon;` then
  `grant update (only, editable, columns) on public.x to authenticated;`. System fields
  (status set by moderation, counts, badges, owner_id, created_at) stay ungranted.
- **Privacy:** never store phone, email, last name or a street address in a table members can
  select. Pickup location is a general area or a public safe-exchange spot.
- **Validation in the database too:** `check` constraints for prices (`>= 0`), text lengths and
  allowed values (`check (status in ('available','pending','sold'))`).
- **Indexes** on columns used to browse or filter (`city`, `created_at`, foreign keys).
- **Functions** that need elevated rights use `security definer set search_path = ''` and
  fully qualified names (`public.x`), like the profile triggers.
- **Storage buckets:** `insert into storage.buckets (id, name, public) values (...) on conflict (id) do nothing;`
  plus `storage.objects` policies limiting uploads to the member's own folder
  (`(storage.foldername(name))[1] = (select auth.uid())::text`).

## 4. Update the app code

- Add or extend the TypeScript type (next to `Profile` in `src/lib/auth.ts`, or a new
  `src/lib/<thing>.ts`).
- Mention the new step in `README.md`'s Database section if the list there needs it.

## 5. Tell the owner

In the PR and in chat, give the exact steps: open Supabase > SQL Editor > New query, paste
`supabase/NN_name.sql`, click Run, expect "Success. No rows returned". Say whether it must be run
**before** the new code goes live (usually yes).

Then have the `reviewer` agent check the policies.
