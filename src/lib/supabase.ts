import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side client (anon key) — used in browser components
// RLS policies protect data, reads are filtered by user_id in query
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

