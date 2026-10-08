import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./config";

// Supabase client for code that runs in the browser (forms, buttons).
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
