import { createClient } from "@supabase/supabase-js"

// Browser client (anon key): row level security decides what each visitor / staff member can do.
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: true, storageKey: "sng-auth" },
})
