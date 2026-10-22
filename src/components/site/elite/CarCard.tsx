import CarImage from "./CarImage"
import Link from "next/link"
import { ArrowRight, Car, Droplets, MapPin, Settings, Users } from "@/components/icons"
import { carPhoto, forRent, fuelLabel, gearboxLabel, type RentalCar } from "@/lib/cars"
import { formatXOF } from "@/lib/site"
import styles from "./Rental.module.css"

// One car of the fleet: photo with the price on it, brand above the model, specs with icons, two actions.
// Opens the car page of this site (/vehicules/[id]); `query` keeps the dates of a search.
export default function CarCard({ car: c, query = "" }: { car: RentalCar; query?: string }) {
  const photo = carPhoto(c)
  const href = `/vehicules/${c.id}${query}`
  const rent = forRent(c)
  const gearbox = gearboxLabel(c.transmission)
  const fuel = fuelLabel(c.fuel_type)
  const price = rent ? c.price_per_day : c.price_sale
  return (
    <article className={styles.car}>
      <Link href={href} className={styles.carMedia} aria-label={`${c.brand} ${c.model} : voir la fiche`}>
        {photo ? (
          <CarImage src={photo} alt={`${c.brand} ${c.model}`} fill sizes="(max-width: 640px) 85vw, (max-width: 1000px) 50vw, 420px" className={styles.carImg} />
        ) : (
          <span className={styles.carPlaceholder}><Car /></span>
        )}
        <span className={styles.carTag}>{c.tag_text || (rent ? "Location" : "Vente")}</span>
        {c.year && <span className={styles.carYear}>{c.year}</span>}
        <span className={styles.carPrice}>
          {price ? <><strong>{formatXOF(price)}</strong>{rent && " / jour"}</> : "Prix sur demande"}
        </span>
      </Link>
      <div className={styles.carBody}>
        <p className={styles.carBrand}>{c.brand}</p>
        <h3>{c.model}{c.variant && <small> {c.variant}</small>}</h3>
        <ul className={styles.carSpecs}>
          {c.seats && <li><Users /> {c.seats} places</li>}
          {gearbox && <li><Settings /> {gearbox}</li>}
          {fuel && <li><Droplets /> {fuel}</li>}
        </ul>
        {c.location && <p className={styles.carPlace}><MapPin /> {c.location}</p>}
        <div className={styles.carActions}>
          <Link href={`${href}#reserver`} className={styles.carBook}>{rent ? "Réserver" : "Je suis intéressé"}</Link>
          <Link href={href} className={styles.carMore}>Détails <ArrowRight /></Link>
        </div>
      </div>
    </article>
  )
}
