import { createClient } from "@supabase/supabase-js"

// Server only (API routes): service role key, bypasses row level security. Never import from a client component.
export const adminDb = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

/** The calling staff member, from the "Authorization: Bearer <access token>" header; null otherwise */
export async function staffFromRequest(req: Request): Promise<{ userId: string } | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return null
  const db = adminDb()
  const { data } = await db.auth.getUser(token)
  if (!data.user) return null
  const { data: staff } = await db.from("sng-staff").select("user_id").eq("user_id", data.user.id).maybeSingle()
  return staff ? { userId: data.user.id } : null
}
