import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Calendar, Droplets, Globe, MapPin, Settings, TrendingUp, Users } from "@/components/icons"
import Booking from "@/components/site/elite/Booking"
import CarCard from "@/components/site/elite/CarCard"
import Gallery from "@/components/site/elite/Gallery"
import { carPhoto, carPhotos, forRent, forSale, fuelLabel, gearboxLabel } from "@/lib/cars"
import { getCar, getContent, getFleet } from "@/lib/content-server"
import { formatXOF } from "@/lib/site"
import rental from "@/components/site/elite/Rental.module.css"
import styles from "@/components/site/elite/Vehicles.module.css"

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ du?: string; au?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCar((await params).id)
  if (!car) return { title: "Véhicule introuvable" }
  const name = `${car.brand} ${car.model}${car.year ? ` ${car.year}` : ""}`
  const photo = carPhoto(car)
  return {
    title: name,
    description: car.description?.slice(0, 160) || `${name} ${forRent(car) ? "à louer" : "à vendre"} à Abidjan.`,
    openGraph: photo ? { images: [photo] } : undefined,
  }
}

export default async function VehiclePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const car = await getCar(id)
  if (!car) notFound()
  const [fleet, { company }] = await Promise.all([getFleet(), getContent()])
  const rent = forRent(car)
  const sale = forSale(car)
  const others = fleet.filter((c) => c.id !== car.id && forRent(c) === rent).slice(0, 3)
  const date = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "")

  const specs = [
    { icon: Calendar, label: "Année", value: car.year },
    { icon: Users, label: "Places", value: car.seats && `${car.seats} places` },
    { icon: Settings, label: "Boîte", value: gearboxLabel(car.transmission) },
    { icon: Droplets, label: "Carburant", value: fuelLabel(car.fuel_type) },
    { icon: TrendingUp, label: "Kilométrage", value: car.mileage != null && `${car.mileage.toLocaleString("fr-FR")} km` },
    { icon: Globe, label: "Couleur", value: car.color },
  ].filter((s) => s.value)

  return (
    <main className={rental.page}>
      <div className={styles.detail}>
        <nav className={`${styles.crumbs} ${styles.crumbsDark}`} aria-label="Fil d'Ariane">
          <Link href="/services/location-vehicules">Location de véhicules</Link> / <Link href="/vehicules">Nos véhicules</Link> / <span>{car.brand} {car.model}</span>
        </nav>

        <div id="vehicule" data-station="Le véhicule" className={styles.detailGrid}>
          <div className={styles.detailMain}>
            <Gallery photos={carPhotos(car)} name={`${car.brand} ${car.model}`} tag={car.tag_text} />

            <header className={styles.detailHead}>
              <p className={rental.carBrand}>{car.brand}</p>
              <h1>{car.model}{car.variant && <span> {car.variant}</span>}</h1>
              {car.location && <p className={styles.place}><MapPin /> {car.location}</p>}
            </header>

            <ul className={styles.specs}>
              {specs.map((s) => (
                <li key={s.label}>
                  <span><s.icon /></span>
                  <small>{s.label}</small>
                  <strong>{s.value}</strong>
                </li>
              ))}
            </ul>

            {car.description && (
              <div className={styles.description}>
                <h2>Description</h2>
                {car.description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}
          </div>

          <aside className={styles.side} id="reserver">
            <div className={styles.priceBox}>
              {rent && (
                <p className={styles.price}>
                  {car.price_per_day ? <><strong>{formatXOF(car.price_per_day)}</strong> / jour</> : <strong>Prix sur demande</strong>}
                </p>
              )}
              {sale && car.price_sale ? <p className={rent ? styles.priceAlt : styles.price}><strong>{formatXOF(car.price_sale)}</strong>{rent && " à l'achat"}</p> : null}
              {!rent && !car.price_sale && <p className={styles.price}><strong>Prix sur demande</strong></p>}
            </div>
            <Booking car={car} start={date(query.du)} end={date(query.au)} phone={company.phone} />
          </aside>
        </div>
      </div>

      {others.length > 0 && (
        <section id="autres-vehicules" data-station="Autres véhicules" className={rental.block}>
          <div className={rental.blockHead}>
            <div>
              <p className={rental.eyebrow}>Vous aimerez aussi</p>
              <h2 className={rental.h2}>D&apos;autres véhicules de la flotte</h2>
            </div>
            <Link href="/vehicules" className={rental.headLink}>Voir toute la flotte <ArrowRight /></Link>
          </div>
          <div className={rental.cars}>
            {others.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      )}
    </main>
  )
}
