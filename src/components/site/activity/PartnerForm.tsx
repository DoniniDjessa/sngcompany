"use client"
import { useState } from "react"
import { ArrowRight, Check, Phone } from "@/components/icons"
import { telHref } from "@/lib/content"
import { supabase } from "@/lib/supabase"
import { useSite } from "../SiteContext"
import styles from "./Activity.module.css"

const TYPES = ["Restaurant / hôtel", "Maquis", "Revendeur / supermarché", "Éleveur / coopérative", "Autre"]
const RHYTHMS = ["Ponctuel", "Chaque semaine", "Chaque mois"]
const PERKS = [
  "Tarifs dégressifs selon les volumes",
  "Livraisons régulières dans tout Abidjan",
  "Facturation mensuelle pour les professionnels",
  "Un interlocuteur dédié à la ferme",
]

// Partnership request for the farm (professional buyers, resellers, breeders). The steps reuse the
// look of the washing booking. Saved as a "demande" of the farm activity (/gestion/demandes).
export default function PartnerForm({ products }: { products: string[] }) {
  const { company } = useSite()
  const [type, setType] = useState(TYPES[0])
  const [wanted, setWanted] = useState<string[]>([])
  const [rhythm, setRhythm] = useState(RHYTHMS[1])
  const [v, setV] = useState({ structure: "", name: "", phone: "", email: "", city: "", volume: "", message: "" })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }))
  const toggle = (p: string) => setWanted((w) => (w.includes(p) ? w.filter((x) => x !== p) : [...w, p]))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wanted.length) return setError("Choisissez au moins un produit.")
    setSending(true)
    setError(null)
    const details = [
      `Partenariat : ${type}${v.structure ? ` — ${v.structure}` : ""}`,
      `Produits : ${wanted.join(", ")}`,
      `Rythme : ${rhythm}${v.volume ? ` · ${v.volume}` : ""}`,
      v.city && `Lieu : ${v.city}`,
      v.message && `Message : ${v.message}`,
    ].filter(Boolean).join("\n")
    const { data, error } = await supabase.rpc("sng_submit_demande", {
      p_service: "elevage",
      p_name: v.name,
      p_phone: v.phone,
      p_email: v.email || null,
      p_wished_date: null,
      p_details: details,
    })
    setSending(false)
    if (error) return setError(`L'envoi a échoué. Réessayez ou appelez-nous au ${company.phone}.`)
    setSent(data as string)
  }

  return (
    <div className={styles.partner}>
      <aside className={styles.partnerIntro}>
        <p className={styles.recapTitle}>Travaillons ensemble</p>
        <p className={styles.partnerLead}>
          Vous achetez régulièrement de la volaille, des œufs ou de la viande, ou vous élevez vous-même ? Parlons de vos besoins.
        </p>
        <ul>
          {PERKS.map((p) => <li key={p}><Check /> <span>{p}</span></li>)}
        </ul>
        <a href={telHref(company.phone)} className={styles.recapCall}><Phone /> {company.phone}</a>
      </aside>

      {sent ? (
        <div className={styles.washDone} role="status">
          <span className={styles.washDoneIcon}><Check /></span>
          <h3>Demande envoyée</h3>
          <p>Votre demande de partenariat <strong>{sent}</strong> est bien reçue. Notre responsable de la ferme vous rappelle sous 48h.</p>
          <button type="button" className={styles.washBtn} onClick={() => setSent(null)}>Nouvelle demande</button>
        </div>
      ) : (
        <form className={styles.washSteps} onSubmit={submit}>
          <fieldset>
            <legend><b>1</b> Vous êtes</legend>
            <div className={styles.pills}>
              {TYPES.map((x) => (
                <button type="button" key={x} aria-pressed={type === x} className={type === x ? styles.picked : ""} onClick={() => setType(x)}>{x}</button>
              ))}
            </div>
            <label className={styles.washInput}><span>Nom de la structure</span><input value={v.structure} onChange={set("structure")} placeholder="Ex : Restaurant Le Baobab" /></label>
          </fieldset>

          <fieldset>
            <legend><b>2</b> Vos besoins</legend>
            <div className={styles.pills}>
              {products.map((p) => (
                <button type="button" key={p} aria-pressed={wanted.includes(p)} className={wanted.includes(p) ? styles.picked : ""} onClick={() => { toggle(p); setError(null) }}>
                  {wanted.includes(p) && <Check />} {p}
                </button>
              ))}
            </div>
            <div className={styles.slots} role="radiogroup" aria-label="Rythme">
              {RHYTHMS.map((x) => (
                <button type="button" role="radio" aria-checked={rhythm === x} key={x} className={rhythm === x ? styles.picked : ""} onClick={() => setRhythm(x)}>{x}</button>
              ))}
            </div>
            <label className={styles.washInput}><span>Volume estimé</span><input value={v.volume} onChange={set("volume")} placeholder="Ex : 50 poulets et 20 plateaux d'œufs par semaine" /></label>
          </fieldset>

          <fieldset>
            <legend><b>3</b> Vos coordonnées</legend>
            <div className={styles.washRow}>
              <label className={styles.washInput}><span>Nom complet *</span><input required value={v.name} onChange={set("name")} autoComplete="name" /></label>
              <label className={styles.washInput}><span>Téléphone *</span><input required type="tel" value={v.phone} onChange={set("phone")} placeholder="+225 07 00 00 00 00" autoComplete="tel" /></label>
            </div>
            <div className={styles.washRow}>
              <label className={styles.washInput}><span>E-mail</span><input type="email" value={v.email} onChange={set("email")} autoComplete="email" /></label>
              <label className={styles.washInput}><span>Commune / ville</span><input value={v.city} onChange={set("city")} placeholder="Cocody, Yopougon, Bouaké…" /></label>
            </div>
            <label className={styles.washInput}><span>Message</span><textarea rows={3} value={v.message} onChange={set("message")} placeholder="Vos attentes, vos contraintes de livraison…" /></label>
          </fieldset>

          {error && <p role="alert" className={styles.formError}>{error}</p>}
          <button type="submit" className={styles.partnerSubmit} disabled={sending}>{sending ? "Envoi…" : "Envoyer ma demande de partenariat"} <ArrowRight /></button>
        </form>
      )}
    </div>
  )
}
