"use client"
import { useEffect, useRef, useState } from "react"
import { Car } from "@/components/icons"
import styles from "./RoadThread.module.css"

// The road as the thread of the page: a vertical line fixed on the left traces itself as you scroll,
// the little car drives down with you and lights up each "station" (section) it passes.
// Stations are placed at the position of their section in the page; a click on one drives there.
export default function RoadThread({ stations }: { stations: { id: string; label: string }[] }) {
  const [progress, setProgress] = useState(0)
  const [marks, setMarks] = useState<{ id: string; label: string; at: number }[]>([])
  const [visible, setVisible] = useState(false)
  const frame = useRef(0)

  useEffect(() => {
    const measure = () => {
      frame.current = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const y = window.scrollY
      setProgress(max > 0 ? Math.min(1, y / max) : 0)
      setVisible(y > window.innerHeight * 0.55)
      setMarks(
        stations
          .map((s) => {
            const el = document.getElementById(s.id)
            if (!el || max <= 0) return null
            // the section counts as reached when its top passes the middle of the screen
            const top = el.getBoundingClientRect().top + y - window.innerHeight / 2
            return { ...s, at: Math.min(1, Math.max(0, top / max)) }
          })
          .filter((m): m is { id: string; label: string; at: number } => m !== null),
      )
    }
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(measure) }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame.current)
    }
  }, [stations])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <aside className={`${styles.road} ${visible ? styles.visible : ""}`} aria-label="Sections de la page">
      <div className={styles.track}>
        <div className={styles.fill} style={{ transform: `scaleY(${progress})` }} />
        {marks.map((m) => (
          <button
            key={m.id}
            className={`${styles.station} ${progress >= m.at - 0.002 ? styles.passed : ""}`}
            style={{ top: `${m.at * 100}%` }}
            onClick={() => go(m.id)}
          >
            <span className={styles.stationDot} />
            <span className={styles.stationLabel}>{m.label}</span>
          </button>
        ))}
        <span className={styles.car} style={{ top: `${progress * 100}%` }} aria-hidden="true"><Car /></span>
      </div>
    </aside>
  )
}
