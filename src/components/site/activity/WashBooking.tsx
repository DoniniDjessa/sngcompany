"use client"
import { useState } from "react"
import { ArrowRight, Calendar, Car, Check, Clock, Droplets, MapPin, Phone, Truck } from "@/components/icons"
import { telHref } from "@/lib/content"
import { supabase } from "@/lib/supabase"
import { useSite } from "../SiteContext"
import styles from "./Activity.module.css"

const VEHICLES = ["Berline", "SUV / 4x4", "Minibus", "Camion", "Moto"]
const SLOTS = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"]

// Washing booking: formula, vehicle, station or home, day and time slot, contact. The recap on the
// right follows the choices. Saved as a "demande" of the washing activity (/gestion/demandes).
export default function WashBooking({ formulas }: { formulas: { title: string; text: string }[] }) {
  const { company } = useSite()
  const today = new Date().toISOString().slice(0, 10)
  const [formula, setFormula] = useState(formulas[0]?.title ?? "")
  const [vehicle, setVehicle] = useState(VEHICLES[0])
  const [home, setHome] = useState(false)
  const [address, setAddress] = useState("")
  const [date, setDate] = useState("")
  const [slot, setSlot] = useState("")
  const [v, setV] = useState({ name: "", phone: "", plate: "", note: "" })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }))
  const day = date ? new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : ""
  const when = day && `${day}${slot ? ` à ${slot}` : ""}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slot) return setError("Choisissez un créneau.")
    setSending(true)
    setError(null)
    const details = [
      `Lavage : ${formula}`,
      `Véhicule : ${vehicle}${v.plate ? ` (${v.plate})` : ""}`,
      home ? `À domicile : ${address}` : `En station (${company.washAddress})`,
      `Le ${when}`,
      v.note && `Précisions : ${v.note}`,
    ].filter(Boolean).join("\n")
    const { data, error } = await supabase.rpc("sng_submit_demande", {
      p_service: "lavage-vehicules",
      p_name: v.name,
      p_phone: v.phone,
      p_email: null,
      p_wished_date: date,
      p_details: details,
    })
    setSending(false)
    if (error) return setError(`L'envoi a échoué. Réessayez ou appelez-nous au ${company.phone}.`)
    setSent(data as string)
  }

  if (sent) {
    return (
      <div className={styles.washDone} role="status">
        <span className={styles.washDoneIcon}><Check /></span>
        <h3>Lavage réservé</h3>
        <p>
          Votre demande <strong>{sent}</strong> est bien reçue : {formula.toLowerCase()} pour votre {vehicle.toLowerCase()}, {when}.
          Nous vous appelons pour confirmer le créneau.
        </p>
        <button type="button" className={styles.washBtn} onClick={() => { setSent(null); setSlot(""); setDate("") }}>Nouvelle réservation</button>
      </div>
    )
  }

  return (
    <form className={styles.wash} onSubmit={submit}>
      <div className={styles.washSteps}>
        <fieldset>
          <legend><b>1</b> La formule</legend>
          <div className={styles.formulas}>
            {formulas.map((f) => (
              <button type="button" key={f.title} aria-pressed={formula === f.title} className={formula === f.title ? styles.picked : ""} onClick={() => setFormula(f.title)}>
                <strong>{f.title}</strong>
                <small>{f.text}</small>
                <span className={styles.tick}><Check /></span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend><b>2</b> Votre véhicule</legend>
          <div className={styles.pills}>
            {VEHICLES.map((x) => (
              <button type="button" key={x} aria-pressed={vehicle === x} className={vehicle === x ? styles.picked : ""} onClick={() => setVehicle(x)}>{x}</button>
            ))}
          </div>
          <label className={styles.washInput}><span>Immatriculation (facultatif)</span><input value={v.plate} onChange={set("plate")} placeholder="AA-123-BB" /></label>
        </fieldset>

        <fieldset>
          <legend><b>3</b> Où ?</legend>
          <div className={styles.places}>
            <button type="button" aria-pressed={!home} className={!home ? styles.picked : ""} onClick={() => setHome(false)}>
              <MapPin /><strong>En station</strong><small>{company.washAddress}</small>
            </button>
            <button type="button" aria-pressed={home} className={home ? styles.picked : ""} onClick={() => setHome(true)}>
              <Truck /><strong>À domicile</strong><small>Nous venons avec notre eau et nos produits</small>
            </button>
          </div>
          {home && (
            <label className={styles.washInput}><span>Adresse *</span><input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Commune, quartier, repère…" /></label>
          )}
        </fieldset>

        <fieldset>
          <legend><b>4</b> Quand ?</legend>
          <label className={styles.washInput}><span>Jour *</span><input type="date" required min={today} value={date} onChange={(e) => { setDate(e.target.value); setError(null) }} /></label>
          <div className={styles.slots} role="radiogroup" aria-label="Créneau">
            {SLOTS.map((x) => (
              <button type="button" role="radio" aria-checked={slot === x} key={x} className={slot === x ? styles.picked : ""} onClick={() => { setSlot(x); setError(null) }}>{x}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend><b>5</b> Vos coordonnées</legend>
          <div className={styles.washRow}>
            <label className={styles.washInput}><span>Nom complet *</span><input required value={v.name} onChange={set("name")} placeholder="Ex : Koffi Yao" autoComplete="name" /></label>
            <label className={styles.washInput}><span>Téléphone *</span><input required type="tel" value={v.phone} onChange={set("phone")} placeholder="+225 07 00 00 00 00" autoComplete="tel" /></label>
          </div>
          <label className={styles.washInput}><span>Précisions</span><textarea rows={2} value={v.note} onChange={set("note")} placeholder="Taches, sièges cuir, accès au parking…" /></label>
        </fieldset>
      </div>

      <aside className={styles.recap}>
        <p className={styles.recapTitle}>Votre lavage</p>
        <ul>
          <li><Droplets /> <span>{formula}</span></li>
          <li><Car /> <span>{vehicle}{v.plate && ` · ${v.plate}`}</span></li>
          <li><MapPin /> <span>{home ? address || "À domicile" : "En station"}</span></li>
          <li><Calendar /> <span>{when || "Jour à choisir"}</span></li>
          <li><Clock /> <span>{home ? "Nous arrivons à l'heure du créneau" : "Comptez 20 à 90 min selon la formule"}</span></li>
        </ul>
        {error && <p role="alert" className={styles.washError}>{error}</p>}
        <button type="submit" className={styles.washBtn} disabled={sending}>{sending ? "Envoi…" : "Réserver ce lavage"} <ArrowRight /></button>
        <p className={styles.recapNote}>Paiement sur place, après le lavage. Prix confirmé par téléphone.</p>
        <a href={telHref(company.phone)} className={styles.recapCall}><Phone /> {company.phone}</a>
      </aside>
    </form>
  )
}
