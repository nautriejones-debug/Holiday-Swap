# Holiday Swap

A web app where neighbors buy and sell used holiday decor locally, starting in North Fulton.

Built with [Next.js](https://nextjs.org), hosted on [Vercel](https://vercel.com), with [Supabase](https://supabase.com) for accounts and data (coming in step 2).

## Running it on a computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To run it with real accounts, copy `.env.example` to `.env.local` and fill in your Supabase values.

## Database

Database setup lives in the `supabase/` folder. Each file is pasted into
Supabase > SQL Editor and run once, in number order.
