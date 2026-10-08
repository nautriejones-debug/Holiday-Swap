export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// False until the Supabase settings are added in Vercel (and .env.local for local runs).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
