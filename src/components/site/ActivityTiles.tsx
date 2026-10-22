"use client"
import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "@/components/icons"
import CmsImage from "./CmsImage"
import { useSite } from "./SiteContext"
import styles from "./ActivityTiles.module.css"

// Bento grid of the activities: full photo + title; on hover the photo comes to colour and the
// rest of the content unfolds. A "Découvrir" bubble follows the pointer over the grid.
export default function ActivityTiles() {
  const { services } = useSite()
  const grid = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !bubble.current || !grid.current) return
    const box = grid.current.getBoundingClientRect()
    bubble.current.style.transform = `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px)`
  }

  return (
    <div ref={grid} className={styles.grid} onPointerMove={move}>
      {services.map((s, i) => (
        <Link key={s.slug} href={`/services/${s.slug}`} className={styles.tile} style={{ ["--i" as string]: i }}>
          <div className={styles.media}>
            {s.image ? (
              <CmsImage src={s.image} alt={s.name} sizes={i === 0 ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 100vw, 33vw"} className={styles.img} />
            ) : (
              <div className={styles.fallback}><s.icon /></div>
            )}
          </div>
          <div className={styles.shade} />

          <div className={styles.top}>
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.chip}><s.icon /> {s.tagline}</span>
          </div>

          <div className={styles.bottom}>
            <h3 className={styles.title}>{s.name}</h3>
            <div className={styles.more}>
              <div className={styles.moreInner}>
                <p>{s.short}</p>
                <ul>
                  {s.highlights.slice(0, 4).map((h) => <li key={h}>{h}</li>)}
                </ul>
                <span className={styles.cta}>Découvrir <ArrowRight /></span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <span ref={bubble} className={styles.bubble} aria-hidden="true"><span>Découvrir</span></span>
    </div>
  )
}
