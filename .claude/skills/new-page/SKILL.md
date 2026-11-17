---
name: new-page
description: Build a new page, screen, form or feature in Holiday Swap following its existing patterns (server page + client form, requireMember, shared ui.tsx pieces, friendly errors, phone-first layout). Use whenever adding or substantially changing anything under src/app.
---

# Build a page or feature in Holiday Swap

Read `CLAUDE.md` first. Then follow these steps.

## 1. Plan it in one paragraph

Say which route(s), which tables they read and write, and who may see them (anyone, signed-in
members, or only the owner of a row). If the feature needs a new table or column, run the
`db-change` skill **first** and build the page against that.

## 2. Server page: `src/app/<route>/page.tsx`

Copy the shape of `src/app/welcome/page.tsx`:

```tsx
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AuthCard, NotConfigured } from "@/components/ui";

export const metadata = { title: "<Page name> · Holiday Swap" };

export default async function Page() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const member = await requireMember();          // members-only pages
  const supabase = await createClient();
  const { data } = await supabase.from("...").select("only, the, columns, needed");
  return <AuthCard title="...">...</AuthCard>;
}
```

- Public pages use `getMember()` instead of `requireMember()`.
- Dynamic routes: in Next 15, `params` is a Promise: `{ params }: { params: Promise<{ id: string }> }`
  then `const { id } = await params;`. Use `notFound()` when a row doesn't exist.
- Select named columns, never `*`, so private fields can't leak into the page.
- Wider pages (browse grids) use `<main className="mx-auto w-full max-w-5xl px-4 py-8">`;
  forms stay in `AuthCard` (`max-w-md`).

## 3. Client form: `src/app/<route>/<Name>Form.tsx`

Copy the shape of `src/app/login/LoginForm.tsx`:

- `"use client"`, `useState` for `error` and `busy`, `createClient()` from `@/lib/supabase/client`.
- Inputs wrapped in `<Field label=... hint=...>` with `className={inputClass}`; correct
  `type`, `autoComplete`, `required`, `inputMode`.
- Errors go through `friendlyError()`; add a new case to `src/lib/errors.ts` if a new Supabase
  message can appear.
- Button text changes while busy (`"Saving…"`); on success `router.push(...)` then `router.refresh()`.
- Rely on row-level security for permissions, but also hide controls the member can't use.

## 4. Photos (when needed)

Use a Supabase Storage bucket created in a `db-change` step with its own policies. Resize or
limit size in the browser before upload (phones take huge photos); accept `image/*`; store the
storage path in the table, not a public URL with secrets.

## 5. Wire it in

Add links from `SiteHeader.tsx` or the home page if members need to find it. Keep the header
usable at 375px wide.

## 6. Finish

Run the `check-app` skill and look at the phone screenshots. Then have the `reviewer` agent
review the change before `ship`.
