import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "@/components/icons"
import type { Service } from "@/lib/services"
import styles from "./ServiceCard.module.css"

// Apple-style tile: centered title and links on top, visual at the bottom
export default function ServiceCard({ service: s, dark = false, wide = false }: { service: Service; dark?: boolean; wide?: boolean }) {
  return (
    <article className={`${styles.tile} ${dark ? styles.dark : ""} ${wide ? styles.wide : ""} reveal`}>
      <div className={styles.text}>
        <h2>{s.name}</h2>
        <p>{s.tagline}.</p>
        <div className={styles.links}>
          <Link href={`/services/${s.slug}`} className={styles.primary}>En savoir plus</Link>
          <Link href={`/contact?service=${s.slug}`} className={styles.secondary}>Nous contacter <ChevronRight /></Link>
        </div>
      </div>
      <div className={styles.visual}>
        {s.image ? (
          <Image src={s.image} alt={s.name} fill sizes={wide ? "100vw" : "(max-width: 900px) 100vw, 50vw"} className={styles.img} />
        ) : (
          <span className={styles.icon}><s.icon /></span>
        )}
      </div>
    </article>
  )
}
