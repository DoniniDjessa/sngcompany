import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "@/components/icons"
import type { Service } from "@/lib/services"
import styles from "./ServiceCard.module.css"

export default function ServiceCard({ service: s, large = false }: { service: Service; large?: boolean }) {
  return (
    <Link href={`/services/${s.slug}`} className={`${styles.card} ${large ? styles.large : ""}`} data-tone={s.tone}>
      <div className={styles.media}>
        {s.image ? (
          <Image src={s.image} alt={s.name} fill sizes="(max-width: 768px) 100vw, 40vw" className={styles.img} />
        ) : (
          <div className={styles.pattern}><s.icon /></div>
        )}
        <span className={styles.icon}><s.icon /></span>
      </div>
      <div className={styles.body}>
        <h3>{s.name}</h3>
        <p>{s.short}</p>
        <ul>
          {s.highlights.slice(0, large ? 4 : 3).map((h) => (
            <li key={h}><Check /> {h}</li>
          ))}
        </ul>
        <span className={styles.more}>En savoir plus <ArrowRight /></span>
      </div>
    </Link>
  )
}
