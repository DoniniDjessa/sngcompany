"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Lock } from "@/components/icons"
import { signIn, useAuthError, useSession } from "@/lib/gestion/auth"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"

export default function LoginPage() {
  const router = useRouter()
  const session = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const accessError = useAuthError()

  useEffect(() => {
    if (session) router.replace("/gestion")
  }, [session, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(await signIn(email, password))
    setBusy(false)
  }

  return (
    <div className="login">
      <aside className="login-aside">
        <div className="bo-brand" style={{ borderBottom: 0, padding: 0 }}>
          <span className="bo-brand-mark">SNG</span>
          <div className="bo-brand-text">
            <strong>{SITE.name}</strong>
            <small style={{ color: "rgba(255,255,255,.6)" }}>Espace de gestion</small>
          </div>
        </div>
        <div>
          <h1>Pilotez <span>toutes vos activités</span> depuis un seul espace</h1>
          <p>Demandes, clients, flotte, missions, matériel, ferme et factures : tout est centralisé et à jour.</p>
        </div>
        <div className="login-modules">
          {SERVICES.map((s) => <span key={s.slug}><s.icon /> {s.name}</span>)}
        </div>
      </aside>

      <main className="login-main">
        <form className="login-card" onSubmit={submit}>
          <span className="page-title-icon" style={{ marginBottom: "1rem" }}><Lock /></span>
          <h2>Connexion</h2>
          <p>Accédez à l&apos;espace de gestion {SITE.name}.</p>
          {(error || accessError) && <div role="alert" className="alert tone-danger">{error || accessError}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div>
              <label className="form-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div>
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input id="password" type="password" className="form-input" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-main" style={{ width: "100%", padding: "0.65rem" }} disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
          </div>
          <p style={{ marginTop: "1rem" }}><Link href="/" className="link">← Retour au site</Link></p>
        </form>
      </main>
    </div>
  )
}
