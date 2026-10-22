"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Lock } from "@/components/icons"
import { signIn, useAuthError, useSession } from "@/lib/gestion/auth"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"
import { supabase } from "@/lib/supabase"

const DIGITS = 4

export default function LoginPage() {
  const router = useRouter()
  const session = useSession()
  const accessError = useAuthError()
  const [mode, setMode] = useState<"code" | "email">("code")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session) router.replace("/gestion")
  }, [session, router])

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
        <div className="login-card">
          <span className="page-title-icon" style={{ marginBottom: "1rem" }}><Lock /></span>
          <h2>Connexion</h2>
          <p>{mode === "code" ? "Saisissez votre code d'accès." : `Accédez à l'espace de gestion ${SITE.name}.`}</p>
          {(error || accessError) && <div role="alert" className="alert tone-danger">{error || accessError}</div>}

          {mode === "code" ? (
            <CodeForm busy={busy} setBusy={setBusy} setError={setError} />
          ) : (
            <EmailForm busy={busy} setBusy={setBusy} setError={setError} />
          )}

          <button type="button" className="link" style={{ marginTop: "1.2rem" }} onClick={() => { setError(null); setMode(mode === "code" ? "email" : "code") }}>
            {mode === "code" ? "Se connecter avec un e-mail" : "Utiliser un code d'accès"}
          </button>
        </div>
      </main>
    </div>
  )
}

/** Four boxes; the form sends itself when the last digit is typed */
function CodeForm({ busy, setBusy, setError }: { busy: boolean; setBusy: (b: boolean) => void; setError: (e: string | null) => void }) {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""))
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => boxes.current[0]?.focus(), [])

  async function send(code: string) {
    setBusy(true)
    setError(null)
    const res = await fetch("/api/gestion/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setBusy(false)
      setError(body.error ?? "Accès refusé.")
      setDigits(Array(DIGITS).fill(""))
      boxes.current[0]?.focus()
      return
    }
    // the session of the quick-access account; the auth listener then checks the staff row
    const { error } = await supabase.auth.setSession({ access_token: body.access_token, refresh_token: body.refresh_token })
    if (error) setError(error.message)
    setBusy(false)
  }

  function type(i: number, value: string) {
    const v = value.replace(/\D/g, "")
    if (!v) return
    const next = [...digits]
    // typing or pasting several digits fills the following boxes
    v.split("").slice(0, DIGITS - i).forEach((d, k) => (next[i + k] = d))
    setDigits(next)
    const filled = next.findIndex((d) => !d)
    if (filled === -1) send(next.join(""))
    else boxes.current[filled]?.focus()
  }

  function key(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Backspace") return
    e.preventDefault()
    const next = [...digits]
    if (next[i]) next[i] = ""
    else if (i > 0) { next[i - 1] = ""; boxes.current[i - 1]?.focus() }
    setDigits(next)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (digits.every(Boolean)) send(digits.join("")) }}>
      <div className="code-boxes" role="group" aria-label="Code d'accès">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { boxes.current[i] = el }}
            className="code-box"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={DIGITS}
            value={d}
            disabled={busy}
            aria-label={`Chiffre ${i + 1}`}
            onChange={(e) => type(i, e.target.value)}
            onKeyDown={(e) => key(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      <button type="submit" className="btn btn-main" style={{ width: "100%", padding: "0.65rem", marginTop: "1rem" }} disabled={busy || !digits.every(Boolean)}>
        {busy ? "Vérification…" : "Entrer"}
      </button>
    </form>
  )
}

function EmailForm({ busy, setBusy, setError }: { busy: boolean; setBusy: (b: boolean) => void; setError: (e: string | null) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(await signIn(email, password))
    setBusy(false)
  }
  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
      <div>
        <label className="form-label" htmlFor="email">E-mail</label>
        <input id="email" type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      </div>
      <div>
        <label className="form-label" htmlFor="password">Mot de passe</label>
        <input id="password" type="password" className="form-input" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </div>
      <button type="submit" className="btn btn-main" style={{ width: "100%", padding: "0.65rem" }} disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
    </form>
  )
}
