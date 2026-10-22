// Gives a person access to the backoffice (first administrator; the others can be added in Paramètres).
// Usage: node --env-file=.env.local scripts/create-staff.mjs <email> <mot-de-passe> "<Nom complet>" [Rôle]
// If the e-mail already has an account in the (shared) Supabase project, it is linked and its password kept.
import { createClient } from "@supabase/supabase-js"

const [email, password, name, role = "Administrateur"] = process.argv.slice(2)
if (!email || !name) {
  console.error('Usage : node --env-file=.env.local scripts/create-staff.mjs <email> <mot-de-passe> "<Nom>" [Rôle]')
  process.exit(1)
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const mail = email.trim().toLowerCase()

let userId
const created = await db.auth.admin.createUser({ email: mail, password, email_confirm: true })
if (created.data.user) userId = created.data.user.id
else {
  for (let page = 1; page <= 50 && !userId; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 200 })
    userId = data.users.find((u) => u.email?.toLowerCase() === mail)?.id
    if (data.users.length < 200) break
  }
}
if (!userId) {
  console.error("Échec :", created.error?.message)
  process.exit(1)
}
const { error } = await db.from("sng-staff").upsert({ user_id: userId, email: mail, name, role })
if (error) {
  console.error("Échec :", error.message, /relation|does not exist|schema cache/i.test(error.message) ? "\n→ Exécutez d'abord supabase/schema.sql dans le SQL Editor de Supabase." : "")
  process.exit(1)
}
console.log(`${created.data.user ? "Compte créé" : "Compte existant lié"} : ${mail} (${role})`)
