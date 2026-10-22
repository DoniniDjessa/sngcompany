import { ArrowRight } from "@/components/icons"
import type { Service } from "@/lib/services"
import BeforeAfter from "../BeforeAfter"
import CmsImage from "../CmsImage"
import ActivityHero from "./ActivityHero"
import styles from "./Activity.module.css"

// Washing hero: the photo in the background, and the before / after to drag on the right
export default function WashHero({ service: s }: { service: Service }) {
  return (
    <ActivityHero
      service={s}
      background={s.image && <CmsImage src={s.image} alt="" priority sizes="100vw" className={`${styles.cover} ${styles.soft}`} />}
      actions={<>
        <a href="#reserver" className={styles.cta}>Réserver un lavage <ArrowRight /></a>
        <a href="#station" className={styles.ghost}>Nous trouver</a>
      </>}
      side={
        s.image && (
          <div className={styles.washCard}>
            <div className={styles.trackerHead}>
              <span className={styles.live}><i /> Glissez pour laver</span>
              <span className={styles.ref}>Avant / après</span>
            </div>
            <div className={styles.washFrame}>
              <BeforeAfter image={s.image} alt={s.name} />
            </div>
          </div>
        )
      }
    />
  )
}
