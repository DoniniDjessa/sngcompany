import type { Metadata } from "next"
import Link from "next/link"
import Fleet from "@/components/site/elite/Fleet"
import { getContent, getFleet } from "@/lib/content-server"
import rental from "@/components/site/elite/Rental.module.css"
import styles from "@/components/site/elite/Vehicles.module.css"

export const metadata: Metadata = {
  title: "Nos véhicules",
  description: "Toute la flotte SNG Elite Cars : berlines, SUV, pick-up et minibus à louer ou à acheter à Abidjan. Réservez en ligne.",
}

type Props = { searchParams: Promise<{ offre?: string; du?: string; au?: string; ville?: string }> }

export default async function VehiclesPage({ searchParams }: Props) {
  const [params, cars, { company }] = await Promise.all([searchParams, getFleet(), getContent()])
  const date = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "")
  const offer = params.offre === "location" || params.offre === "vente" ? params.offre : "tous"

  return (
    <main className={rental.page}>
      <section className={styles.head}>
        <div className={styles.headInner}>
          <nav className={styles.crumbs} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> / <Link href="/services/location-vehicules">Location de véhicules</Link> / <span>Nos véhicules</span>
          </nav>
          <p className={styles.kicker}>{company.carsSiteName}</p>
          <h1 className={styles.title}>Nos véhicules</h1>
          <p className={styles.lead}>Berlines, SUV, pick-up et minibus : choisissez votre véhicule, nous confirmons votre réservation sous 24h.</p>
        </div>
      </section>
      <Fleet cars={cars} initial={{ offer, start: date(params.du), end: date(params.au) }} />
    </main>
  )
}
