"use client"
import { useEffect, useRef } from "react"
import { Car, Clock, Droplets, Globe, Hammer, MapPin, Shield, Tent, Truck, Users, Wrench, Zap, type Icon } from "@/components/icons"
import styles from "./Activity.module.css"

const ICONS: Record<string, Icon> = {
  users: Users, truck: Truck, pin: MapPin, globe: Globe, clock: Clock, shield: Shield,
  bolt: Zap, hammer: Hammer, tent: Tent, wrench: Wrench, droplets: Droplets, car: Car,
}

// Advantages as cards that pile up while scrolling: each card sticks a little lower than the previous one
// and slides over it; the covered card shrinks and dims (--cover, 0 → 1, set from the scroll).
export default function StackedCards({ eyebrow, title, muted, items, icons }: {
  eyebrow: string
  title: string
  muted?: string
  items: { title: string; text: string }[]
  /** names of ICONS, one per card (cycled) */
  icons: string[]
}) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const cards = [...(list.current?.children ?? [])] as HTMLElement[]
    let frame = 0
    const measure = () => {
      frame = 0
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const a = card.getBoundingClientRect()
        const b = next.getBoundingClientRect()
        // how far the next card has slid over this one
        const cover = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height))
        card.style.setProperty("--cover", cover.toFixed(3))
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={styles.stackWrap}>
      <div className={`${styles.stackHead} reveal`}>
        <p className={styles.stackEyebrow}><span />{eyebrow}</p>
        <h2>{title} {muted && <span>{muted}</span>}</h2>
      </div>
      <ol ref={list} className={styles.stack}>
        {items.map((it, i) => {
          const Icon = ICONS[icons[i % icons.length]] ?? Truck
          return (
            <li key={it.title} className={`${styles.card} ${i % 2 ? styles.cardLight : ""}`} style={{ ["--i" as string]: i }}>
              <div className={styles.cardBody}>
                <span className={styles.cardIndex}>{String(i + 1).padStart(2, "0")} <small>/ {String(items.length).padStart(2, "0")}</small></span>
                <span className={styles.cardIcon}><Icon /></span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
              <span className={styles.cardArt} aria-hidden="true"><Icon /></span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
