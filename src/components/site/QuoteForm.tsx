"use client"

import { useState } from "react"
import { ArrowRight, Box, CarSide, Check, ChevronLeft } from "@/components/icons"
import type { ServiceSlug } from "@/lib/services"
import { supabase } from "@/lib/supabase"
import { useSite } from "./SiteContext"
import styles from "./QuoteForm.module.css"

const EMPTY = { name: "", phone: "", email: "", wished_date: "", details: "" }
const STEPS = ["Départ", "Votre besoin", "Coordonnées", "Arrivée"]

// "Nous contacter" form as a journey: Départ → Besoin → Coordonnées → Arrivée, the car moves one
// station per step; on sending, a parcel is "delivered". Saved as a "demande" (/gestion/demandes).
export default function QuoteForm({ service: initial }: { service?: ServiceSlug }) {
  const { company, services } = useSite()
  const [service, setService] = useState<ServiceSlug>(initial ?? "location-vehicules")
  const [values, setValues] = useState(EMPTY)
  const [step, setStep] = useState(initial ? 1 : 0)
  const [back, setBack] = useState(false)
  // focus the first field only after the visitor moved through the steps (never on page load)
  const [moved, setMoved] = useState(false)
  const [sentRef, setSentRef] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))
  const current = services.find((s) => s.slug === service)

  const goTo = (n: number) => {
    setBack(n < step)
    setMoved(true)
    setStep(n)
    setError(null)
  }

  // The site has no access to the tables: sng_submit_demande() only records a new request and returns its reference
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) return goTo(step + 1) // the browser already checked the fields of this step
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
    if (error) return setError(`L'envoi a échoué. Réessayez ou appelez-nous au ${company.phone}.`)
    setSentRef(data as string)
    setValues(EMPTY)
  }

  const reached = sentRef ? STEPS.length - 1 : step

  return (
    <div className={styles.journey}>
      {/* the road: stations + the car at the current one */}
      <div className={styles.road} style={{ ["--p" as string]: reached / (STEPS.length - 1) }}>
        <div className={styles.roadLine}><span /></div>
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`${styles.station} ${i <= reached ? styles.stationDone : ""} ${i === reached ? styles.stationNow : ""}`}
            style={{ left: `${(i / (STEPS.length - 1)) * 100}%` }}
            onClick={() => !sentRef && i < step && goTo(i)}
            disabled={!!sentRef || i >= step}
          >
            <span className={styles.stationDot}>{i < reached || sentRef ? <Check /> : i + 1}</span>
            <span className={styles.stationLabel}>{label}</span>
          </button>
        ))}
        <span className={`${styles.car} ${sentRef ? styles.carArrived : ""}`} aria-hidden="true"><CarSide /></span>
      </div>

      {sentRef ? (
        <div className={styles.success} role="status">
          <span className={styles.parcel}><Box /></span>
          <h3>Message livré !</h3>
          <p>
            Votre message <strong>{sentRef}</strong> est bien arrivé. Un conseiller {company.name} vous rappelle sous 24h.
          </p>
          <button type="button" className="btn-outline" onClick={() => { setSentRef(null); goTo(0) }}>Nouveau message</button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <div key={step} className={`${styles.stage} ${back ? styles.stageBack : ""}`}>
            {step === 0 && (
              <>
                <p className={styles.ask}>Votre message concerne…</p>
                <div className={styles.services} role="radiogroup" aria-label="Service concerné">
                  {services.map((s) => (
                    <button
                      type="button"
                      key={s.slug}
                      role="radio"
                      aria-checked={service === s.slug}
                      className={`${styles.serviceChip} ${service === s.slug ? styles.active : ""}`}
                      onClick={() => { setService(s.slug); goTo(1) }}
                    >
                      <s.icon /> {s.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <div className={styles.grid}>
                <label className={`${styles.field} ${styles.full}`}>
                  <span>Votre message *</span>
                  <textarea required autoFocus={moved} rows={4} value={values.details} onChange={set("details")} placeholder={current?.quoteHint} />
                </label>
                <label className={styles.field}>
                  <span>Date souhaitée</span>
                  <input type="date" value={values.wished_date} onChange={set("wished_date")} />
                </label>
                <div className={styles.field}>
                  <span>Activité</span>
                  <button type="button" className={styles.changeService} onClick={() => goTo(0)}>
                    {current && <current.icon />} {current?.name} · modifier
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.grid}>
                <label className={`${styles.field} ${styles.full}`}>
                  <span>Nom complet *</span>
                  <input required autoFocus={moved} value={values.name} onChange={set("name")} placeholder="Ex : Koffi Yao" />
                </label>
                <label className={styles.field}>
                  <span>Téléphone *</span>
                  <input required type="tel" value={values.phone} onChange={set("phone")} placeholder="+225 07 00 00 00 00" />
                </label>
                <label className={styles.field}>
                  <span>E-mail</span>
                  <input type="email" value={values.email} onChange={set("email")} placeholder="vous@exemple.com" />
                </label>
              </div>
            )}

            {step === 3 && (
              <dl className={styles.recap}>
                <div><dt>Activité</dt><dd>{current?.name}</dd></div>
                <div><dt>Message</dt><dd>{values.details}</dd></div>
                {values.wished_date && <div><dt>Date souhaitée</dt><dd>{new Date(values.wished_date).toLocaleDateString("fr-FR", { dateStyle: "long" })}</dd></div>}
                <div><dt>Contact</dt><dd>{values.name} · {values.phone}{values.email && ` · ${values.email}`}</dd></div>
              </dl>
            )}
          </div>

          {error && <p role="alert" className={styles.error}>{error}</p>}

          {step > 0 && (
            <div className={styles.actions}>
              <button type="button" className={styles.prev} onClick={() => goTo(step - 1)}><ChevronLeft /> Retour</button>
              <button type="submit" className="btn-primary" disabled={sending}>
                {step < 3 ? "Continuer" : sending ? "Envoi en cours…" : "Envoyer le message"} <ArrowRight />
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  )
}
