"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CarSide } from "@/components/icons"
import { useSite } from "./SiteContext"
import styles from "./Extras.module.css"

/** Fades in every `.reveal` block when it scrolls into view (re-run on each page) */
export function RevealOnScroll() {
  const pathname = usePathname()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 },
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])
  return null
}

export function WhatsAppWidget() {
  const { company } = useSite()
  const message = `Bonjour ${company.name}, j'aimerais avoir des informations sur vos services.`
  return (
    <a
      href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
      className={styles.widget}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contacter ${company.name} sur WhatsApp`}
    >
      <span className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.005 0C5.37 0 .002 5.368.002 12.006c0 2.092.548 4.136 1.592 5.933L0 24l6.39-1.677a11.85 11.85 0 005.615 1.43h.005c6.635 0 12.003-5.368 12.003-12.006 0-3.212-1.25-6.234-3.522-8.504" />
        </svg>
      </span>
      <span className={styles.label}>WhatsApp : {company.phone}</span>
    </a>
  )
}

export function GoToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <button
      className={`${styles.goTop} ${visible ? styles.visible : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Revenir en haut"
    >
      ↑
    </button>
  )
}

/** First visit of the session: a car crosses the screen and pulls the curtain off the site (< 1 s).
 *  Shown only when the inline script of app/layout.tsx put the "sng-intro" class on <html>. */
export function Intro() {
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains("sng-intro")) return
    const done = setTimeout(() => {
      html.classList.remove("sng-intro")
      try {
        sessionStorage.setItem("sng-intro", "1")
      } catch {}
    }, 1150)
    return () => clearTimeout(done)
  }, [])
  return (
    <div className={styles.intro} aria-hidden="true">
      <div className={styles.introCurtain} />
      <div className={styles.introRoad} />
      {/* the car rides just ahead of the edge of the curtain */}
      <span className={styles.introCar}><CarSide /></span>
    </div>
  )
}

/** Switching to the night theme: two headlight beams sweep across the page */
export function Headlights() {
  const [run, setRun] = useState(0)
  useEffect(() => {
    const play = () => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRun((n) => n + 1)
    }
    window.addEventListener("sng:headlights", play)
    return () => window.removeEventListener("sng:headlights", play)
  }, [])
  if (!run) return null
  return (
    <div key={run} className={styles.headlights} aria-hidden="true" onAnimationEnd={(e) => e.currentTarget === e.target && setRun(0)}>
      <span className={styles.beamLeft} />
      <span className={styles.beamRight} />
    </div>
  )
}
