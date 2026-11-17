---
name: ship
description: Ship a finished Holiday Swap change - confirm checks pass, commit on a feature branch, push, and open a pull request with a plain-English summary and a checklist of manual Supabase/Vercel steps. Use when the user says ship, push, commit, open a PR, or "put it live".
---

# Ship a change

## 1. Preconditions

- `check-app` has passed for this change (lint + build), in this session.
- The `reviewer` agent has reviewed it and every "must fix" item is fixed.
- If either is missing, do it first.

## 2. Branch

Never commit straight to `main`. If on `main`, create `feature/<short-name>`. If the session
already has a designated `claude/...` branch, use that.

## 3. Commit

- `git status` and `git diff` first; make sure no `.env*` file (other than `.env.example`),
  screenshots or scratch scripts are staged.
- Small, focused commits. Message: one plain-English summary line saying what members can now
  do ("Let members post a listing with photos"), a blank line, then a short why.

## 4. Push

`git push -u origin <branch>`. On a network error, retry up to 4 times waiting 2s, 4s, 8s, 16s.

## 5. Pull request

Use `gh pr create`. Body sections:

```markdown
## What's new
<1-3 bullets in plain English, from a member's point of view>

## Before this goes live, you need to
- [ ] Supabase > SQL Editor > New query: paste `supabase/NN_name.sql`, click Run
- [ ] Vercel > Project > Settings > Environment Variables: add `...` (only if needed)
(or "Nothing. Merge and it deploys.")

## How it was checked
<lint/build result, screenshots taken, what couldn't be tested and why>
```

## 6. Tell the user

Give the PR link and repeat the manual steps in chat, in order. Vercel deploys `main`
automatically once the PR is merged.
