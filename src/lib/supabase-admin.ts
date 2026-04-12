import { createClient } from "@supabase/supabase-js";

// Server-side admin client (service role key) — used ONLY in API routes
// This bypasses RLS so server-side inserts always work regardless of Clerk session
// Do NOT append NEXT_PUBLIC_, as this must never reach the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
