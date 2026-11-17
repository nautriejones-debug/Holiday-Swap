# Holiday Swap

A mobile-first web app where neighbors buy and sell used holiday decor locally. Beta is North
Fulton only (cities in `src/lib/cities.ts`).

The owner is not a developer. Explain things in plain English, and any step they must do by
hand (Supabase SQL Editor, Vercel settings) must be spelled out click by click.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS v4
- Supabase for login (email + password, one-time phone verification by text) and data
- Hosted on Vercel. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (see `.env.example`). Without them the app still builds and shows `<NotConfigured />`.

## Commands

- `npm install` / `npm run dev` (http://localhost:3000)
- `npm run lint` and `npm run build` must both pass before shipping. There is no test suite yet.

## Layout

- `src/app/<route>/page.tsx` — server component: checks login, loads data, renders.
- `src/app/<route>/<Name>Form.tsx` — `"use client"` component for anything interactive.
- `src/components/ui.tsx` — shared pieces: `inputClass`, `buttonClass`, `secondaryButtonClass`,
  `AuthCard`, `Field`, `ErrorMessage`, `SuccessMessage`, `TextLink`, `NotConfigured`. Reuse these;
  add new shared pieces here rather than restyling per page.
- `src/lib/auth.ts` — `getMember()`, `nextSignupStep()`, `requireMember()`, `Profile` type.
- `src/lib/errors.ts` — `friendlyError()` turns Supabase errors into plain language. Never show
  raw error text to members.
- `src/lib/supabase/{server,client,middleware,config}.ts` — Supabase clients.
- `supabase/NN_name.sql` — database changes, pasted by hand into Supabase > SQL Editor, in order.

## House rules

1. **Members-only pages** start with `if (!isSupabaseConfigured) return <NotConfigured />;` then
   `const member = await requireMember();`.
2. **Privacy:** phone number, email, last name and exact address never go in a table other
   members can read. Public identity is first name + city + verified badge only.
3. **Every table has row-level security on**, with policies written for `authenticated`, and
   column-level `grant update (...)` so members can't edit system fields (badges, status set by
   the system, owner ids).
4. **SQL files are safe to re-run** (`if not exists`, `drop policy if exists`, `create or replace`)
   and start with a plain-English comment saying what the step does and how to run it.
5. **Phone-first UI:** single column, `max-w-md` forms, 16px inputs (`text-base`) so iPhones don't
   zoom, big tap targets, red-700 accent, stone neutrals.
6. **Copy is friendly and plain.** Short sentences, no jargon, "neighbor" tone.
7. Comments explain *why* in plain language, matching the existing style.

## Project skills and agents

- `/new-page` — build a page or feature in this app's style
- `/db-change` — write the next `supabase/NN_*.sql` step safely
- `/check-app` — lint, build, run, and screenshot at phone width
- `/ship` — branch, commit, push, PR with a plain-English manual-steps checklist
- `reviewer` agent — read-only security and privacy review; run it before `/ship`
