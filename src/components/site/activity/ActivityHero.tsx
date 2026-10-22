import Link from "next/link"
import { Check } from "@/components/icons"
import type { Service } from "@/lib/services"
import styles from "./Activity.module.css"

// Hero shared by the activity pages: full-bleed background (photo or pattern), the tagline on two lines,
// the actions, a "live" card on the right (mission tracking, stock, before/after…) and the highlights.
export default function ActivityHero({ service: s, background, side, actions }: {
  service: Service
  background: React.ReactNode
  side: React.ReactNode
  actions: React.ReactNode
}) {
  const comma = s.tagline.indexOf(",")
  const [line1, line2] = comma > 0 ? [s.tagline.slice(0, comma + 1), s.tagline.slice(comma + 1).trim()] : [s.tagline, ""]
  return (
    <section className={styles.hero}>
      <div className={styles.heroMedia} aria-hidden="true">{background}</div>
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
          <div className={styles.actions}>{actions}</div>
        </div>
        <div className={styles.side}>{side}</div>
      </div>

      <ul className={styles.chips}>
        {s.highlights.map((h) => <li key={h}><Check /> {h}</li>)}
      </ul>
    </section>
  )
}
