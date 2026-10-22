"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "@/components/icons"
import CmsImage from "./CmsImage"
import { useSite } from "./SiteContext"
import styles from "./ActivityTiles.module.css"

// Activities in two flexible rows (2 + 3): full photo + title; on hover the card widens, the photo
// comes to colour with a little depth (it follows the pointer), the rest of the content unfolds and a
// trade-specific effect plays. A bubble with the activity's icon follows the pointer over the grid.
export default function ActivityTiles() {
  const { services } = useSite()
  const grid = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  // touch screens have no hover: the tile crossing the middle of the screen gets the hover look
  const [focused, setFocused] = useState<number | null>(null)

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches || !grid.current) return
    const tiles = [...grid.current.querySelectorAll<HTMLElement>("[data-tile]")]
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setFocused(Number((e.target as HTMLElement).dataset.tile))),
      { rootMargin: "-42% 0px -42% 0px" },
    )
    tiles.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !bubble.current || !grid.current) return
    const box = grid.current.getBoundingClientRect()
    bubble.current.style.transform = `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px)`
  }

  // depth: pointer position inside the tile, from -0.5 to 0.5
  const tilt = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--mx", ((e.clientX - box.left) / box.width - 0.5).toFixed(3))
    e.currentTarget.style.setProperty("--my", ((e.clientY - box.top) / box.height - 0.5).toFixed(3))
  }
  const leave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--mx", "0")
    e.currentTarget.style.setProperty("--my", "0")
    setHovered(null)
  }

  const Hovered = hovered !== null ? services[hovered]?.icon : null

  return (
    <div ref={grid} className={styles.grid} onPointerMove={move}>
      {[services.slice(0, 2), services.slice(2)].map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map((s, j) => {
            const i = r * 2 + j
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`${styles.tile} ${focused === i ? styles.focus : ""}`}
                data-fx={s.slug}
                data-tile={i}
                style={{ ["--i" as string]: i, ["--grow" as string]: i === 0 ? 2 : 1 }}
                onPointerEnter={() => setHovered(i)}
                onPointerMove={tilt}
                onPointerLeave={leave}
              >
                <div className={styles.media}>
                  {s.image ? (
                    <CmsImage src={s.image} alt={s.name} sizes={i === 0 ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 100vw, 33vw"} className={styles.img} />
                  ) : (
                    <div className={styles.fallback}><s.icon /></div>
                  )}
                </div>
                <div className={styles.shade} />

                {/* trade-specific hover effect */}
                <div className={styles.fx} aria-hidden="true">
                  {s.slug === "lavage-vehicules" && Array.from({ length: 10 }, (_, k) => <span key={k} className={styles.bubbleFx} style={{ ["--k" as string]: k }} />)}
                  {s.slug === "transport-logistique" && Array.from({ length: 5 }, (_, k) => <span key={k} className={styles.speed} style={{ ["--k" as string]: k }} />)}
                  {s.slug === "location-vehicules" && <span className={styles.beam} />}
                </div>

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
            )
          })}
        </div>
      ))}
      <span ref={bubble} className={styles.bubble} aria-hidden="true">
        <span>
          {Hovered && <Hovered key={hovered} className={styles.bubbleIcon} />}
          Découvrir
        </span>
      </span>
    </div>
  )
}
