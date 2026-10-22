"use client"
import CarImage from "./CarImage"
import { useState } from "react"
import { Car, ChevronLeft, ChevronRight } from "@/components/icons"
import styles from "./Vehicles.module.css"

// Photos of a car: the big one, arrows (and keyboard), thumbnails underneath
export default function Gallery({ photos, name, tag }: { photos: string[]; name: string; tag: string | null }) {
  const [i, setI] = useState(0)
  const go = (d: number) => setI((n) => (n + d + photos.length) % photos.length)

  if (!photos.length) return <div className={styles.stage}><span className={styles.noPhoto}><Car /></span></div>

  return (
    <div className={styles.gallery}>
      <div
        className={styles.stage}
        tabIndex={photos.length > 1 ? 0 : undefined}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1) }}
        aria-roledescription="carrousel"
        aria-label={`Photos ${name}`}
      >
        {/* only the current photo is loaded: the photos of the fleet are heavy */}
        <CarImage key={photos[i]} src={photos[i]} alt={`${name}, photo ${i + 1}`} fill priority={i === 0} sizes="(max-width: 1000px) 100vw, 760px" className={styles.shot} />
        {tag && <span className={styles.stageTag}>{tag}</span>}
        {photos.length > 1 && (
          <>
            <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => go(-1)} aria-label="Photo précédente"><ChevronLeft /></button>
            <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => go(1)} aria-label="Photo suivante"><ChevronRight /></button>
            <span className={styles.counter}>{i + 1} / {photos.length}</span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className={styles.thumbs}>
          {photos.map((src, n) => (
            <button key={src} type="button" className={n === i ? styles.thumbOn : ""} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`} aria-current={n === i}>
              <CarImage src={src} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
