import { ArrowRight, Check, MapPin, Truck } from "@/components/icons"
import type { Service } from "@/lib/services"
import CmsImage from "../CmsImage"
import ActivityHero from "./ActivityHero"
import styles from "./Activity.module.css"

const STEPS = ["Enlèvement", "En route", "Livré"]

// Transport hero: the photo, and a "mission tracking" card where a truck drives from pick-up to delivery,
// lighting each checkpoint on its way (loops).
export default function TransportHero({ service: s }: { service: Service }) {
  return (
    <ActivityHero
      service={s}
      background={s.image && <CmsImage src={s.image} alt="" priority sizes="100vw" className={styles.cover} />}
      actions={<>
        <a href="#contact" className={styles.cta}>Demander un devis <ArrowRight /></a>
        <a href="#prestations" className={styles.ghost}>Nos prestations</a>
      </>}
      side={
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
      }
    />
  )
}
