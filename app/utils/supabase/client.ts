import { createClient } from "@supabase/supabase-js";

// Make sure URLs are properly used even when environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Warn if environment variables are missing
if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    "Supabase URL or Anon Key is missing. Authentication will not work."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "implicit",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
