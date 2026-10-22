"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, CarSide, CarTopFill, Check } from "@/components/icons"
import styles from "./HowItWorks.module.css"

// "Comment ça marche" as a journey driven by the scroll.
// Desktop: the section is pinned while you scroll; a car drives along a horizontal road and lights up
// each step it passes. Small screens: no pinning, the road is vertical and the car goes down the steps.
export default function HowItWorks({ eyebrow, title, items }: {
  eyebrow: string
  title: string
  items: { title: string; text: string }[]
}) {
  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [p, setP] = useState(0)
  const n = items.length

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = section.current
      const ol = list.current
      if (!el || !ol) return
      const vh = window.innerHeight
      let prog: number
      if (window.matchMedia("(min-width: 900px)").matches) {
        // pinned: progress = how far the tall section has been scrolled through
        const r = el.getBoundingClientRect()
        prog = -r.top / Math.max(1, r.height - vh)
      } else {
        // vertical road: the car sits at 55 % of the screen height
        const r = ol.getBoundingClientRect()
        prog = (vh * 0.55 - r.top) / Math.max(1, r.height)
      }
      setP(Math.min(1, Math.max(0, prog)))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const at = (i: number) => (n > 1 ? i / (n - 1) : 0)
  const reached = (i: number) => p >= at(i) - 0.015
  const done = p >= 0.985

  return (
    <section id="etapes" ref={section} className={styles.how} style={{ ["--n" as string]: n, ["--p" as string]: p }}>
      <div className={styles.pin}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.road}>
          <ol ref={list} className={styles.steps}>
            {/* the road, its filled part and the car run from the first station to the last */}
            <li className={styles.track} aria-hidden="true">
              <span className={styles.fill} />
              <span className={styles.carH}><CarSide beam /></span>
              <span className={styles.carV}><CarTopFill /></span>
            </li>
            {items.map((s, i) => (
              <li key={s.title} className={`${styles.step} ${reached(i) ? styles.on : ""}`}>
                <span className={styles.dot}>{reached(i) && (i < n - 1 || done) ? <Check /> : i + 1}</span>
                <div className={styles.stepText}>
                  <span className={styles.stepLabel}>Étape {i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${styles.finish} ${done ? styles.finishOn : ""}`}>
          <span>Vous êtes arrivé.</span>
          <Link href="/contact" className={styles.cta} tabIndex={done ? 0 : -1}>Démarrer ma demande <ArrowRight /></Link>
        </div>
      </div>
    </section>
  )
}
