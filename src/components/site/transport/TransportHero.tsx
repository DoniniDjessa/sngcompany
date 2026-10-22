import Link from "next/link"
import { ArrowRight, Check, MapPin, Truck } from "@/components/icons"
import type { Service } from "@/lib/services"
import CmsImage from "../CmsImage"
import styles from "./Transport.module.css"

const STEPS = ["Enlèvement", "En route", "Livré"]

// Transport hero: full-bleed photo, the tagline on two lines, and a "mission tracking" card where a truck
// drives from pick-up to delivery, lighting each checkpoint on its way (loops).
export default function TransportHero({ service: s }: { service: Service }) {
  const comma = s.tagline.indexOf(",")
  const [line1, line2] = comma > 0 ? [s.tagline.slice(0, comma + 1), s.tagline.slice(comma + 1).trim()] : [s.tagline, ""]
  return (
    <section className={styles.hero}>
      <div className={styles.heroMedia} aria-hidden="true">
        {s.image && <CmsImage src={s.image} alt="" priority sizes="100vw" className={styles.cover} />}
      </div>
      <div className={styles.heroShade} />

      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <nav className={styles.crumbs} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> / <Link href="/#services">Activités</Link> / <span>{s.name}</span>
          </nav>
          <p className={styles.eyebrow}><span />{s.name}</p>
          <h1 className={styles.title}>
            {line1}
            {line2 && <span> {line2}{line2.endsWith(".") ? "" : "."}</span>}
          </h1>
          <p className={styles.lead}>{s.intro}</p>
          <div className={styles.actions}>
            <a href="#contact" className={styles.cta}>Demander un devis <ArrowRight /></a>
            <a href="#prestations" className={styles.ghost}>Nos prestations</a>
          </div>
        </div>

        <div className={styles.tracker} aria-hidden="true">
          <div className={styles.trackerHead}>
            <span className={styles.live}><i /> Mission en cours</span>
            <span className={styles.ref}>SNG-TR-0421</span>
          </div>
          <p className={styles.trackerRoute}><MapPin /> Abidjan <span>→</span> Bouaké</p>
          <div className={styles.lane}>
            <span className={styles.laneFill} />
            {STEPS.map((st, i) => (
              <span key={st} className={styles.checkpoint} style={{ left: `${(i / (STEPS.length - 1)) * 100}%` }}>
                <b><Check /></b>
                <small>{st}</small>
              </span>
            ))}
            <span className={styles.truck}><Truck /></span>
          </div>
          <dl className={styles.trackerFoot}>
            <div><dt>Colis</dt><dd>12 cartons</dd></div>
            <div><dt>Véhicule</dt><dd>Fourgon 12 m³</dd></div>
            <div><dt>Arrivée</dt><dd>Aujourd&apos;hui</dd></div>
          </dl>
        </div>
      </div>

      <ul className={styles.chips}>
        {s.highlights.map((h) => <li key={h}><Check /> {h}</li>)}
      </ul>
    </section>
  )
}
