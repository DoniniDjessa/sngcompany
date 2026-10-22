"use client"
import { useCallback, useEffect, useState } from "react"
import { Plus, Settings, Trash, Users } from "@/components/icons"
import { Confirm, Drawer, PageHead } from "@/components/gestion/ui"
import { authHeader, useSession } from "@/lib/gestion/auth"
import { toast } from "@/lib/gestion/toast"
import { SERVICES } from "@/lib/services"
import { formatDate, SITE } from "@/lib/site"
import { supabase } from "@/lib/supabase"

type Member = { user_id: string; name: string; email: string; role: string; created_at: string }
const ROLES = ["Administrateur", "Gestionnaire", "Agent"]

export default function SettingsPage() {
  const session = useSession()
  const [team, setTeam] = useState<Member[] | null>(null)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Member | null>(null)

  const loadTeam = useCallback(async () => {
    const { data } = await supabase.from("sng-staff").select("*").order("created_at")
    setTeam((data as Member[]) ?? [])
  }, [])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
    loadTeam()
  }, [loadTeam])

  async function revoke(m: Member) {
    const res = await fetch(`/api/staff?user_id=${m.user_id}`, { method: "DELETE", headers: await authHeader() })
    const body = await res.json().catch(() => ({}))
    if (res.ok) { toast("Accès retiré"); loadTeam() } else toast(body.error ?? "Échec", true)
    setRemoving(null)
  }

  const company: [string, string][] = [
    ["Raison sociale", SITE.name],
    ["Téléphone", SITE.phone],
    ["Téléphone 2", SITE.phone2],
    ["E-mail", SITE.email],
    ["Adresse", SITE.address],
    ["Horaires", SITE.hours],
    ["Site location véhicules", SITE.carsSiteUrl],
  ]

  return (
    <>
      <PageHead icon={Settings} title="Paramètres" sub="Équipe, informations de l'entreprise et activités." />

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-head">
          <div>
            <div className="card-title">Équipe</div>
            <div className="card-sub">Personnes ayant accès à l&apos;espace de gestion</div>
          </div>
          <button className="btn btn-main btn-sm" onClick={() => setAdding(true)}><Plus /> Ajouter un membre</button>
        </div>
        <div className="table-wrap">
          <table className="bo-table">
            <thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th className="hide-sm">Depuis</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {team === null ? (
                <tr><td colSpan={5} className="loading-row">Chargement…</td></tr>
              ) : team.map((m) => (
                <tr key={m.user_id}>
                  <td><span className="cell-with-thumb"><span className="avatar">{m.name.charAt(0)}</span><span className="cell-main">{m.name}</span></span></td>
                  <td>{m.email}</td>
                  <td><span className={`badge ${m.role === "Administrateur" ? "tone-navy" : "tone-neutral"}`}>{m.role}</span></td>
                  <td className="hide-sm">{formatDate(m.created_at)}</td>
                  <td>
                    {m.user_id !== session?.userId && (
                      <div className="row-actions">
                        <button className="bo-icon-btn danger" onClick={() => setRemoving(m)} aria-label={`Retirer ${m.name}`}><Trash /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Entreprise</div>
              <div className="card-sub">Affiché sur le site (modifiable dans src/lib/site.ts)</div>
            </div>
          </div>
          <div className="card-body form-grid">
            {company.map(([label, value]) => (
              <div key={label}>
                <span className="form-label">{label}</span>
                <input className="form-input" value={value} readOnly />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Activités</div></div>
          <div className="table-wrap">
            <table className="bo-table">
              <thead><tr><th>Activité</th><th>Page publique</th></tr></thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.slug}>
                    <td><span className="cell-main">{s.name}</span><span className="cell-sub">{s.tagline}</span></td>
                    <td><a className="link" href={`/services/${s.slug}`} target="_blank">/services/{s.slug}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {adding && <AddMember onClose={() => setAdding(false)} onAdded={() => { setAdding(false); loadTeam() }} />}
      {removing && (
        <Confirm
          title={`Retirer l'accès de ${removing.name} ?`}
          text="La personne ne pourra plus se connecter à l'espace de gestion SNG."
          confirmLabel="Retirer l'accès"
          onConfirm={() => revoke(removing)}
          onCancel={() => setRemoving(null)}
        />
      )}
    </>
  )
}

function AddMember({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [v, setV] = useState({ name: "", email: "", role: "Gestionnaire", password: "" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json", ...(await authHeader()) }, body: JSON.stringify(v) })
    const body = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) return setError(body.error ?? "Échec")
    toast(body.existing ? "Compte existant ajouté à l'équipe" : "Membre ajouté")
    onAdded()
  }

  return (
    <Drawer
      title="Ajouter un membre"
      icon={Users}
      onClose={onClose}
      footer={
        <>
          <span className="spacer" />
          <button type="button" className="btn btn-soft" onClick={onClose}>Annuler</button>
          <button type="submit" form="add-member" className="btn btn-main" disabled={saving}>{saving ? "Ajout…" : "Ajouter"}</button>
        </>
      }
    >
      <form id="add-member" className="drawer-body" onSubmit={submit}>
        {error && <div role="alert" className="alert tone-danger">{error}</div>}
        <div className="form-grid">
          <div className="full"><label className="form-label" htmlFor="m-name">Nom complet<em> *</em></label><input id="m-name" className="form-input" required value={v.name} onChange={set("name")} /></div>
          <div><label className="form-label" htmlFor="m-email">E-mail<em> *</em></label><input id="m-email" type="email" className="form-input" required value={v.email} onChange={set("email")} /></div>
          <div>
            <label className="form-label" htmlFor="m-role">Rôle</label>
            <select id="m-role" className="form-select" value={v.role} onChange={set("role")}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          <div className="full">
            <label className="form-label" htmlFor="m-pass">Mot de passe initial</label>
            <input id="m-pass" type="text" className="form-input" minLength={8} value={v.password} onChange={set("password")} placeholder="8 caractères minimum (ignoré si le compte existe déjà)" />
          </div>
        </div>
        <p className="hint">Communiquez le mot de passe à la personne. Si l&apos;e-mail a déjà un compte, il est simplement ajouté à l&apos;équipe.</p>
      </form>
    </Drawer>
  )
}
