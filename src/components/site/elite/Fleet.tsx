"use client"
import { useMemo, useState } from "react"
import { Car, Search, X } from "@/components/icons"
import { busyDuring, forRent, forSale, type RentalCar } from "@/lib/cars"
import CarCard from "./CarCard"
import styles from "./Vehicles.module.css"

type Offer = "tous" | "location" | "vente"
const OFFERS: [Offer, string][] = [["tous", "Tous"], ["location", "Location"], ["vente", "Vente"]]
const SORTS = [["", "Recommandés"], ["asc", "Prix croissant"], ["desc", "Prix décroissant"]] as const

// The whole fleet with its filters (offer, text, gearbox, fuel, seats, period). Everything is filtered
// in the browser: the fleet is a few dozen cars at most.
export default function Fleet({ cars, initial }: { cars: RentalCar[]; initial: { offer: Offer; start: string; end: string } }) {
  const [offer, setOffer] = useState<Offer>(initial.offer)
  const [text, setText] = useState("")
  const [gearbox, setGearbox] = useState("")
  const [fuel, setFuel] = useState("")
  const [seats, setSeats] = useState(0)
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("")
  const [start, setStart] = useState(initial.start)
  const [end, setEnd] = useState(initial.end)
  const today = new Date().toISOString().slice(0, 10)
  const period = start && end && start < end

  const shown = useMemo(() => {
    const q = text.trim().toLowerCase()
    const price = (c: RentalCar) => (offer === "vente" ? c.price_sale : c.price_per_day ?? c.price_sale) ?? Infinity
    const list = cars.filter((c) =>
      (offer === "tous" || (offer === "location" ? forRent(c) : forSale(c))) &&
      (!q || `${c.brand} ${c.model} ${c.variant ?? ""} ${c.color ?? ""} ${c.location ?? ""}`.toLowerCase().includes(q)) &&
      (!gearbox || c.transmission === gearbox) &&
      (!fuel || c.fuel_type === fuel) &&
      (!seats || (c.seats ?? 0) >= seats) &&
      (!period || !forRent(c) || !busyDuring(c, start, end)),
    )
    return sort ? [...list].sort((a, b) => (sort === "asc" ? price(a) - price(b) : price(b) - price(a))) : list
  }, [cars, offer, text, gearbox, fuel, seats, sort, period, start, end])

  const filtered = text || gearbox || fuel || seats || offer !== "tous" || period
  const reset = () => { setOffer("tous"); setText(""); setGearbox(""); setFuel(""); setSeats(0); setStart(""); setEnd("") }
  const query = period ? `?du=${start}&au=${end}` : ""

  return (
    <section id="flotte" data-station="Véhicules" className={styles.fleet}>
      <div className={styles.bar}>
        <div className={styles.offers} role="radiogroup" aria-label="Type d'offre">
          {OFFERS.map(([v, label]) => (
            <button key={v} type="button" role="radio" aria-checked={offer === v} className={offer === v ? styles.on : ""} onClick={() => setOffer(v)}>
              {label}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Marque, modèle, quartier…" aria-label="Rechercher un véhicule" />
        </label>
        <div className={styles.selects}>
          <select value={gearbox} onChange={(e) => setGearbox(e.target.value)} aria-label="Boîte de vitesses">
            <option value="">Toutes boîtes</option>
            <option value="Automatic">Automatique</option>
            <option value="Manual">Manuelle</option>
          </select>
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} aria-label="Carburant">
            <option value="">Tous carburants</option>
            <option value="Gasoline">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybride</option>
            <option value="Electric">Électrique</option>
          </select>
          <select value={seats} onChange={(e) => setSeats(Number(e.target.value))} aria-label="Nombre de places">
            <option value={0}>Toutes places</option>
            <option value={5}>5 places et +</option>
            <option value={7}>7 places et +</option>
            <option value={9}>9 places et +</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Trier">
            {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        {offer !== "vente" && (
          <div className={styles.dates}>
            <label><span>Du</span><input type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} /></label>
            <label><span>Au</span><input type="date" min={start || today} value={end} onChange={(e) => setEnd(e.target.value)} /></label>
          </div>
        )}
      </div>

      <div className={styles.count}>
        <p>
          <strong>{shown.length}</strong> véhicule{shown.length > 1 ? "s" : ""}
          {period && <> libre{shown.length > 1 ? "s" : ""} du {fr(start)} au {fr(end)}</>}
        </p>
        {filtered && <button type="button" onClick={reset}><X /> Effacer les filtres</button>}
      </div>

      {shown.length ? (
        <div className={styles.grid}>
          {shown.map((c) => <CarCard key={c.id} car={c} query={query} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <span><Car /></span>
          <h2>Aucun véhicule ne correspond</h2>
          <p>Modifiez vos critères ou contactez-nous : nous trouvons souvent une solution.</p>
          <button type="button" onClick={reset} className={styles.darkBtn}>Voir toute la flotte</button>
        </div>
      )}
    </section>
  )
}

const fr = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
