import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Temporary quick access to the backoffice with a short code (GESTION_ACCESS_CODE, e.g. 0044).
// The code is checked here, then the server signs in the dedicated staff account
// (GESTION_ACCESS_EMAIL / GESTION_ACCESS_PASSWORD, never sent to the browser) and returns its session.
// A 4-digit code is easy to guess: attempts are throttled per address, and this access should be
// replaced by personal accounts once the team is set up.

const MAX_TRIES = 5
const WINDOW_MS = 15 * 60 * 1000
const tries = new Map<string, { count: number; since: number }>()

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local"
  const now = Date.now()
  const t = tries.get(ip)
  if (t && now - t.since < WINDOW_MS && t.count >= MAX_TRIES) {
    return NextResponse.json({ error: "Trop d'essais. Réessayez dans quelques minutes." }, { status: 429 })
  }

  const expected = process.env.GESTION_ACCESS_CODE
  const email = process.env.GESTION_ACCESS_EMAIL
  const password = process.env.GESTION_ACCESS_PASSWORD
  if (!expected || !email || !password) {
    return NextResponse.json({ error: "Accès par code non configuré." }, { status: 503 })
  }

  const { code } = await req.json().catch(() => ({}))
  if (typeof code !== "string" || code !== expected) {
    const fresh = !t || now - t.since >= WINDOW_MS
    tries.set(ip, { count: fresh ? 1 : t!.count + 1, since: fresh ? now : t!.since })
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 })
  }
  tries.delete(ip)

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } })
  const { data, error } = await db.auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    return NextResponse.json({ error: "Le compte d'accès rapide est introuvable ou mal configuré." }, { status: 500 })
  }
  return NextResponse.json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token })
}
