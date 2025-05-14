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

// Get the site URL - handles both local and production environments
const getSiteUrl = () => {
  let url = typeof window !== "undefined" ? window.location.origin : "";
  // Note: Vercel automatically sets this environment variable
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return url;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "implicit",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    // Override the default redirect behavior
    // For local development
    ...(typeof window !== "undefined" &&
    window.location.hostname === "localhost"
      ? { url: "http://localhost:3000" }
      : {}),
  },
});
