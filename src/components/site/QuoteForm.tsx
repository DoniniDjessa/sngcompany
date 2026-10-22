"use client"

import { useState } from "react"
import { ArrowRight, Check } from "@/components/icons"
import { SERVICES, serviceBySlug, type ServiceSlug } from "@/lib/services"
import { SITE } from "@/lib/site"
import { supabase } from "@/lib/supabase"
import styles from "./QuoteForm.module.css"

const EMPTY = { name: "", phone: "", email: "", wished_date: "", details: "" }

// "Nous contacter" form, saved as a "demande" that the team handles in /gestion/demandes
export default function QuoteForm({ service: initial }: { service?: ServiceSlug }) {
  const [service, setService] = useState<ServiceSlug>(initial ?? "location-vehicules")
  const [values, setValues] = useState(EMPTY)
  const [sentRef, setSentRef] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  // The site has no access to the tables: sng_submit_demande() only records a new request and returns its reference
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    const { data, error } = await supabase.rpc("sng_submit_demande", {
      p_service: service,
      p_name: values.name,
      p_phone: values.phone,
      p_email: values.email || null,
      p_wished_date: values.wished_date || null,
      p_details: values.details,
    })
    setSending(false)
    if (error) {
      setError(`L'envoi a échoué. Réessayez ou appelez-nous au ${SITE.phone}.`)
      return
    }
    setSentRef(data as string)
    setValues(EMPTY)
  }

  if (sentRef) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}><Check /></span>
        <h3>Message envoyé !</h3>
        <p>
          Votre message <strong>{sentRef}</strong> a bien été reçu. Un conseiller {SITE.name} vous rappelle sous 24h.
        </p>
        <button type="button" className="btn-outline" onClick={() => setSentRef(null)}>Nouveau message</button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <span className={styles.groupLabel}>Votre message concerne</span>
      <div className={styles.services} role="radiogroup" aria-label="Service concerné">
        {SERVICES.map((s) => (
          <button
            type="button"
            key={s.slug}
            role="radio"
            aria-checked={service === s.slug}
            className={`${styles.serviceChip} ${service === s.slug ? styles.active : ""}`}
            data-tone={s.tone}
            onClick={() => setService(s.slug)}
          >
            <s.icon /> {s.name}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nom complet *</span>
          <input required value={values.name} onChange={set("name")} placeholder="Ex : Koffi Yao" />
        </label>
        <label className={styles.field}>
          <span>Téléphone *</span>
          <input required type="tel" value={values.phone} onChange={set("phone")} placeholder="+225 07 00 00 00 00" />
        </label>
        <label className={styles.field}>
          <span>E-mail</span>
          <input type="email" value={values.email} onChange={set("email")} placeholder="vous@exemple.com" />
        </label>
        <label className={styles.field}>
          <span>Date souhaitée</span>
          <input type="date" value={values.wished_date} onChange={set("wished_date")} />
        </label>
        <label className={`${styles.field} ${styles.full}`}>
          <span>Votre message *</span>
          <textarea required rows={4} value={values.details} onChange={set("details")} placeholder={serviceBySlug(service)?.quoteHint} />
        </label>
      </div>

      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button type="submit" className="btn-primary" disabled={sending}>
        {sending ? "Envoi en cours…" : "Envoyer le message"} <ArrowRight />
      </button>
    </form>
  )
}
