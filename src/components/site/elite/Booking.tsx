"use client"
import { useState } from "react"
import { ArrowRight, Check, Phone } from "@/components/icons"
import { busyDuring, forRent, type RentalCar } from "@/lib/cars"
import { telHref } from "@/lib/content"
import { formatXOF } from "@/lib/site"
import { supabase } from "@/lib/supabase"
import styles from "./Vehicles.module.css"

const DAY = 86_400_000

// Booking request for a car (or purchase request for a car on sale). Saved as a "demande" of the
// vehicle rental activity, with the car and the period in the details (/gestion/demandes).
export default function Booking({ car, start: s0, end: e0, phone }: { car: RentalCar; start: string; end: string; phone: string }) {
  const rent = forRent(car)
  const [mode, setMode] = useState<"rent" | "buy">(rent ? "rent" : "buy")
  const [start, setStart] = useState(s0)
  const [end, setEnd] = useState(e0)
  const [driver, setDriver] = useState(false)
  const [v, setV] = useState({ name: "", phone: "", email: "", message: "" })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }))

  const today = new Date().toISOString().slice(0, 10)
  const days = start && end && end > start ? Math.round((Date.parse(end) - Date.parse(start)) / DAY) : 0
  const busy = days > 0 && busyDuring(car, start, end)
  const name = `${car.brand} ${car.model}${car.variant ? ` ${car.variant}` : ""}${car.year ? ` (${car.year})` : ""}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "rent" && !days) return setError("La date de retour doit être après la date de départ.")
    setSending(true)
    setError(null)
    const lines = mode === "rent"
      ? [`Réservation : ${name}`, `Du ${start} au ${end} (${days} jour${days > 1 ? "s" : ""})`, driver ? "Avec chauffeur" : "Sans chauffeur",
         car.price_per_day ? `Estimation : ${formatXOF(car.price_per_day * days)}` : ""]
      : [`Achat : ${name}`, car.price_sale ? `Prix affiché : ${formatXOF(car.price_sale)}` : ""]
    const { data, error } = await supabase.rpc("sng_submit_demande", {
      p_service: "location-vehicules",
      p_name: v.name,
      p_phone: v.phone,
      p_email: v.email || null,
      p_wished_date: mode === "rent" ? start : null,
      p_details: [...lines, v.message && `Message : ${v.message}`, `Véhicule : ${car.id}`].filter(Boolean).join("\n"),
    })
    setSending(false)
    if (error) return setError(`L'envoi a échoué. Réessayez ou appelez-nous au ${phone}.`)
    setSent(data as string)
  }

  if (sent) {
    return (
      <div className={`${styles.booking} ${styles.bookingDone}`} role="status">
        <span className={styles.doneIcon}><Check /></span>
        <h2>Demande envoyée</h2>
        <p>Votre demande <strong>{sent}</strong> pour le {name} est bien reçue. Un conseiller vous rappelle sous 24h pour la confirmer.</p>
      </div>
    )
  }

  return (
    <form className={styles.booking} onSubmit={submit}>
      {rent && car.listing_type === "both" && (
        <div className={styles.modes} role="radiogroup" aria-label="Votre demande">
          <button type="button" role="radio" aria-checked={mode === "rent"} className={mode === "rent" ? styles.on : ""} onClick={() => setMode("rent")}>Louer</button>
          <button type="button" role="radio" aria-checked={mode === "buy"} className={mode === "buy" ? styles.on : ""} onClick={() => setMode("buy")}>Acheter</button>
        </div>
      )}
      <h2>{mode === "rent" ? "Réserver ce véhicule" : "Je suis intéressé"}</h2>

      {mode === "rent" && (
        <>
          <div className={styles.row}>
            <label className={styles.input}><span>Départ *</span><input type="date" required min={today} value={start} onChange={(e) => { setStart(e.target.value); setError(null) }} /></label>
            <label className={styles.input}><span>Retour *</span><input type="date" required min={start || today} value={end} onChange={(e) => { setEnd(e.target.value); setError(null) }} /></label>
          </div>
          <div className={styles.modes} role="radiogroup" aria-label="Chauffeur">
            <button type="button" role="radio" aria-checked={!driver} className={!driver ? styles.on : ""} onClick={() => setDriver(false)}>Sans chauffeur</button>
            <button type="button" role="radio" aria-checked={driver} className={driver ? styles.on : ""} onClick={() => setDriver(true)}>Avec chauffeur</button>
          </div>
          {days > 0 && (
            <dl className={styles.total}>
              <div><dt>{days} jour{days > 1 ? "s" : ""}{car.price_per_day ? ` × ${formatXOF(car.price_per_day)}` : ""}</dt><dd>{car.price_per_day ? formatXOF(car.price_per_day * days) : "Sur devis"}</dd></div>
              {driver && <div><dt>Chauffeur</dt><dd>Sur devis</dd></div>}
            </dl>
          )}
          {busy && <p className={styles.warn}>Ce véhicule est déjà réservé sur une partie de cette période : nous vous proposerons d&apos;autres dates ou un véhicule équivalent.</p>}
        </>
      )}

      <label className={styles.input}><span>Nom complet *</span><input required value={v.name} onChange={set("name")} placeholder="Ex : Koffi Yao" autoComplete="name" /></label>
      <div className={styles.row}>
        <label className={styles.input}><span>Téléphone *</span><input required type="tel" value={v.phone} onChange={set("phone")} placeholder="+225 07 00 00 00 00" autoComplete="tel" /></label>
        <label className={styles.input}><span>E-mail</span><input type="email" value={v.email} onChange={set("email")} placeholder="vous@exemple.com" autoComplete="email" /></label>
      </div>
      <label className={styles.input}><span>Message</span><textarea rows={3} value={v.message} onChange={set("message")} placeholder={mode === "rent" ? "Lieu de prise en charge, livraison, questions…" : "Vos questions, essai, financement…"} /></label>

      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submit} disabled={sending}>
        {sending ? "Envoi en cours…" : mode === "rent" ? "Demander la réservation" : "Envoyer ma demande"} <ArrowRight />
      </button>
      <p className={styles.note}>Sans engagement : nous confirmons la disponibilité avant tout paiement.</p>
      <a href={telHref(phone)} className={styles.call}><Phone /> Ou appelez le {phone}</a>
    </form>
  )
}
