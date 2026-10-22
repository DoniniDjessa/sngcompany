"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Chat } from "@/components/icons"
import type { HomeContent } from "@/lib/content"
import { imgSrc } from "@/lib/content"
import Counter from "./Counter"
import { useSite } from "./SiteContext"
import styles from "./HomeSections.module.css"

/** Our commitments: promises with big figures (numbers count up when revealed) */
export function Commitments({ data }: { data: HomeContent["commitments"] }) {
  return (
    <div className={styles.commit}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{data.eyebrow}</p>
        <h2 className={styles.title}>{data.title}</h2>
      </div>
      <ul className={`${styles.commitGrid} stagger`}>
        {data.items.map((c) => (
          <li key={c.label}>
            <strong><Counter value={c.value} /></strong>
            <span>{c.label}</span>
            <p>{c.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Paragraph whose words light up one after the other as it scrolls through the screen */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [lit, setLit] = useState(0)
  const words = text.split(" ")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the paragraph enters at 85 % of the screen, 1 when its bottom reaches 40 %
      const p = reduced ? 1 : (vh * 0.85 - box.top) / (box.height + vh * 0.45)
      setLit(Math.round(Math.min(1, Math.max(0, p)) * words.length))
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
  }, [words.length])

  return (
    <p ref={ref} className={`${styles.scrollText} ${className ?? ""}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className={i < lit ? styles.lit : ""}>{w} </span>
      ))}
    </p>
  )
}

/** General FAQ: numbered accordion, one answer open at a time, smooth height */
export function Faq({ data }: { data: HomeContent["faq"] }) {
  const { company } = useSite()
  const [open, setOpen] = useState(0)
  return (
    <div className={styles.faq}>
      <div className={styles.faqAside}>
        <p className={styles.eyebrow}>{data.eyebrow}</p>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.faqText}>{data.text}</p>
        <div className={styles.faqActions}>
          <Link href="/contact" className="btn-primary">Poser une question <ArrowRight /></Link>
          <a href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="link-more"><Chat /> WhatsApp</a>
        </div>
      </div>
      <ol className={styles.faqList}>
        {data.items.map((f, i) => {
          const isOpen = open === i
          return (
            <li key={f.q} className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}>
              <button className={styles.faqQ} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className={styles.faqNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.faqLabel}>{f.q}</span>
                <span className={styles.faqIcon} aria-hidden="true" />
              </button>
              <div className={styles.faqA} role="region">
                <div><p>{f.a}</p></div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Partner logos in an endless band (hidden while there is none) */
export function Partners({ data }: { data: HomeContent["partners"] }) {
  const items = data.items.filter((p) => p.name || p.logo)
  if (!items.length) return null
  const loop = items.length < 6 ? [...items, ...items, ...items] : items
  return (
    <div className={styles.partners}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{data.eyebrow}</p>
        <h2 className={styles.title}>{data.title}</h2>
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1}>
              {loop.map((p, i) => (
                <li key={i} title={p.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static file or signed R2 redirect */}
                  {p.logo ? <img src={imgSrc(p.logo)} alt={p.name} loading="lazy" /> : <span>{p.name}</span>}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
