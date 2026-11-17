---
name: check-app
description: Verify a Holiday Swap change actually works - run lint and a production build, start the dev server, and take phone-width screenshots of the changed pages with Playwright. Use after any code change and before shipping.
---

# Check the app

## 1. Install (only if `node_modules` is missing)

```bash
npm install
```

## 2. Lint and build

```bash
npm run lint
npm run build
```

Both must pass. Fix every error; don't silence rules with disable comments unless there's a
written reason.

## 3. Run it

Start `npm run dev` in the background and wait until http://localhost:3000 responds.

Without Supabase env vars, pages that need accounts show the "Almost ready" screen. That's
expected; still check the layout of public pages and that nothing crashes. If `.env.local`
exists, real logins work.

## 4. Screenshot at phone size

Playwright and Chromium are already installed in cloud sessions (`require('playwright')`; don't
run `playwright install`). Save a script in the scratchpad, not the repo:

```js
const { chromium, devices } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ ...devices["iPhone 13"] });
  for (const path of process.argv.slice(3)) {
    await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${process.argv[2]}/${path.replace(/\W+/g, "_") || "home"}.png`, fullPage: true });
  }
  await browser.close();
})();
```

Run it with the output folder and the changed routes, e.g. `node shot.js <outdir> / /listings/new`.
Look at each screenshot: nothing cut off or overflowing sideways, tap targets big enough, text
readable. Also check one desktop width (1280px) for pages with grids.

Send the user the screenshots that show the change.

## 5. Report

Say plainly what passed, what failed (with the error), and what couldn't be checked (for example
"logged-in flows need Supabase keys"). Stop the dev server when done.
