"use client"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, CarSide, ChevronDown } from "@/components/icons"
import type { HeroSlide } from "@/lib/content"
import CmsImage from "./CmsImage"
import styles from "./HeroCarousel.module.css"

const DURATION = 4500 // ms per slide

// Full-width hero carousel, one image per slide.
// The incoming slide is uncovered like a curtain (from below going forward, from above going back),
// its photo settles from a zoom, then the text rises line by line. Vertical dots on the right double
// as progress bars: when the active bar is full (CSS animation), the next slide comes.
// `tone="orange"`: accents in the orange of the rental pages; `next`: section the scroll cue leads to.
export default function HeroCarousel({ slides, tone, next = "services" }: { slides: HeroSlide[]; tone?: "orange"; next?: string }) {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const count = slides.length

  const go = useCallback(
    (to: number) => {
      const next = (to + count) % count
      if (count < 2 || next === index) return
      setPrev(index)
      setIndex(next)
    },
    [count, index],
  )

  // keyboard, when the hero is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * 0.6) return
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(index + 1)
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, index])

  if (count === 0) return null

  return (
    <section
      className={`${styles.hero} ${tone === "orange" ? styles.orange : ""}`}
      aria-roledescription="carrousel"
      aria-label="À la une"
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        if (!touch.current) return
        const dx = e.changedTouches[0].clientX - touch.current.x
        const dy = e.changedTouches[0].clientY - touch.current.y
        touch.current = null
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
      }}
    >
      {slides.map((s, i) => {
        // slides before the current one wait above, the others below: the curtain opens in the travel direction
        const state = i === index ? styles.active : i === prev ? styles.previous : i < index ? styles.before : ""
        return (
          <div
            key={i}
            className={`${styles.slide} ${state}`}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${count}`}
            aria-hidden={i !== index}
          >
            <div className={styles.media}>
              <CmsImage src={s.image} alt={s.title} priority={i === 0} sizes="100vw" className={styles.img} />
            </div>
            <div className={styles.shade} />
            <div className={styles.content}>
              {s.eyebrow && <p className={styles.eyebrow}><span />{s.eyebrow}</p>}
              <h2 className={styles.title}>
                <span className={styles.line}><span>{s.title}</span></span>
                {s.subtitle && <span className={`${styles.line} ${styles.muted}`}><span>{s.subtitle}</span></span>}
              </h2>
              {s.text && <p className={styles.text}>{s.text}</p>}
              {s.link && (
                <div className={styles.actions}>
                  <Link href={s.link} className={styles.cta} tabIndex={i === index ? 0 : -1}>{s.cta || "Découvrir"} <ArrowRight /></Link>
                  <Link href="/contact" className={styles.ghost} tabIndex={i === index ? 0 : -1}>Nous contacter</Link>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* top: a car drives along the line while the active slide plays */}
      {count > 1 && (
        <div className={styles.road} aria-hidden="true" style={{ ["--d" as string]: `${DURATION}ms` }}>
          <span className={styles.roadLabel}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.track}>
            <span key={index} className={styles.trail} />
            <span key={`car-${index}`} className={styles.runner}><CarSide beam /></span>
          </span>
          <span className={styles.roadLabel}>{String(((index + 1) % count) + 1).padStart(2, "0")}</span>
        </div>
      )}

      {/* vertical navigation: counter + progress dots */}
      {count > 1 && (
        <nav className={styles.nav} aria-label="Diapositives">
          <span className={styles.counter} aria-hidden="true">
            <strong key={index}>{String(index + 1).padStart(2, "0")}</strong>
            <small>{String(count).padStart(2, "0")}</small>
          </span>
          <ol className={styles.dots}>
            {slides.map((s, i) => (
              <li key={i}>
                <button
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Diapositive ${i + 1} : ${s.title}`}
                  aria-current={i === index}
                >
                  {i === index && <span key={index} className={styles.fill} style={{ animationDuration: `${DURATION}ms` }} onAnimationEnd={() => go(index + 1)} />}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <a href={`#${next}`} className={styles.scroll} aria-label="Faire défiler">
        <span>Défiler</span>
        <ChevronDown />
      </a>
    </section>
  )
}
