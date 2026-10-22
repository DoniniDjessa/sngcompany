"use client"
import { useEffect, useRef, useState } from "react"
import { CarSide, CarTopFill } from "@/components/icons"
import styles from "./RoadThread.module.css"

// The road as the thread of the page: a vertical line fixed on the left traces itself as you scroll,
// the little car (seen from above, nose down) drives down with you and lights up each "station" (section) it passes.
// Stations are placed at the position of their section in the page; a click on one drives there.
export default function RoadThread({ stations, tone }: { stations: { id: string; label: string }[]; tone?: "orange" }) {
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
      frame.current = 0 // a later run of the effect (strict mode, new page) must be able to schedule again
    }
  }, [stations])

  // section the reader is in: the last station already passed
  const current = [...marks].reverse().find((m) => progress >= m.at - 0.002)

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <>
    {/* small screens: the road lies across the top, under the menu */}
    <div className={`${styles.mobileBar} ${tone === "orange" ? styles.orange : ""} ${visible ? styles.visible : ""}`} aria-hidden="true">
      <span key={current?.id} className={styles.mobileLabel}>{current?.label ?? ""}</span>
      <span className={styles.mobileTrack}>
        <span className={styles.mobileFill} style={{ transform: `scaleX(${progress})` }} />
        <span className={styles.mobileCar} style={{ left: `${progress * 100}%` }}><CarSide /></span>
      </span>
    </div>
    <aside className={`${styles.road} ${tone === "orange" ? styles.orange : ""} ${visible ? styles.visible : ""}`} aria-label="Sections de la page">
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
        <span className={styles.car} style={{ top: `${progress * 100}%` }} aria-hidden="true"><CarTopFill /></span>
      </div>
    </aside>
    </>
  )
}
