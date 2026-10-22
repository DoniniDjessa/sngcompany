import { ArrowRight, Building, Check, Sprout, Truck, Users } from "@/components/icons"
import type { Service } from "@/lib/services"
import ActivityHero from "./ActivityHero"
import styles from "./Activity.module.css"

const PARTNERS = [
  { icon: Building, title: "Restaurants & hôtels", text: "Volailles et œufs livrés chaque semaine" },
  { icon: Truck, title: "Revendeurs & supermarchés", text: "Volumes réguliers, tarifs dégressifs" },
  { icon: Users, title: "Éleveurs & coopératives", text: "Production et débouchés partagés" },
]

// Farm hero: furrowed field in the background (no photo), and a card presenting who we work with,
// leading to the partnership form.
export default function FarmHero({ service: s }: { service: Service }) {
  return (
    <ActivityHero
      service={s}
      background={<div className={styles.field}><Sprout /></div>}
      actions={<>
        <a href="#partenariat" className={styles.cta}>Devenir partenaire <ArrowRight /></a>
        <a href="#autres" className={styles.ghost}>Nos autres activités</a>
      </>}
      side={
        <div className={styles.board}>
          <div className={styles.trackerHead}>
            <span className={styles.live}><i /> Partenariats ouverts</span>
            <span className={styles.ref}>Ferme SNG</span>
          </div>
          <ul className={styles.boardList}>
            {PARTNERS.map((p, n) => (
              <li key={p.title} style={{ ["--n" as string]: n }}>
                <span className={styles.boardIcon}><p.icon /></span>
                <div className={styles.boardText}>
                  <strong>{p.title}</strong>
                  <small>{p.text}</small>
                </div>
                <span className={styles.boardCheck}><Check /></span>
              </li>
            ))}
          </ul>
          <a href="#partenariat" className={styles.boardLink}>Proposer un partenariat <ArrowRight /></a>
        </div>
      }
    />
  )
}
