import { NextResponse } from "next/server"
import { adminDb, staffFromRequest } from "@/lib/server/supabase-admin"

// Staff only: give a person access to the backoffice.
// The Supabase project is shared with other apps: an existing account (same e-mail) is linked as is,
// its password unchanged; otherwise a new account is created with the given password.
export async function POST(req: Request) {
  const caller = await staffFromRequest(req)
  if (!caller) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { email, name, role, password } = await req.json().catch(() => ({}))
  const mail = typeof email === "string" ? email.trim().toLowerCase() : ""
  if (!/^\S+@\S+\.\S+$/.test(mail) || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Nom et e-mail valides requis" }, { status: 400 })
  }

  const db = adminDb()
  let userId: string | undefined
  const created = await db.auth.admin.createUser({ email: mail, password, email_confirm: true })
  if (created.data.user) userId = created.data.user.id
  else {
    // already registered (another app of the project): find it
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data } = await db.auth.admin.listUsers({ page, perPage: 200 })
      userId = data.users.find((u) => u.email?.toLowerCase() === mail)?.id
      if (data.users.length < 200) break
    }
    if (!userId) {
      const msg = created.error?.message ?? "Création impossible"
      return NextResponse.json({ error: /password/i.test(msg) ? "Mot de passe trop faible (6 caractères minimum)." : msg }, { status: 400 })
    }
  }

  const { error } = await db.from("sng-staff").upsert({ user_id: userId, email: mail, name: name.trim(), role: role || "Gestionnaire" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, existing: !created.data.user })
}

export async function DELETE(req: Request) {
  const caller = await staffFromRequest(req)
  if (!caller) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  const userId = new URL(req.url).searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "user_id requis" }, { status: 400 })
  if (userId === caller.userId) return NextResponse.json({ error: "Vous ne pouvez pas retirer votre propre accès." }, { status: 400 })
  // Only the backoffice access is removed: the account may be used by other apps of the project
  const { error } = await adminDb().from("sng-staff").delete().eq("user_id", userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
