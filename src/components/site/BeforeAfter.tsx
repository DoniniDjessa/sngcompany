"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "@/components/icons"
import CmsImage from "./CmsImage"
import styles from "./BeforeAfter.module.css"

// Washing page: drag the handle to "wash" the car. The "before" is the same photo, dulled and
// stained with mud by CSS; the "after" is the photo itself.
export default function BeforeAfter({ image, alt }: { image: string; alt: string }) {
  const [pos, setPos] = useState(55)
  return (
    <div className={styles.box} style={{ ["--pos" as string]: `${pos}%` }}>
      <div className={styles.layer}>
        <CmsImage src={image} alt={alt} sizes="(max-width: 1200px) 100vw, 1200px" className={styles.img} />
      </div>
      <div className={`${styles.layer} ${styles.dirty}`} aria-hidden="true">
        <CmsImage src={image} alt="" sizes="(max-width: 1200px) 100vw, 1200px" className={styles.img} />
        <span className={styles.mud} />
      </div>

      <span className={`${styles.tag} ${styles.tagBefore}`}>Avant</span>
      <span className={`${styles.tag} ${styles.tagAfter}`}>Après</span>

      <div className={styles.handle} aria-hidden="true">
        <span><ChevronLeft /><ChevronRight /></span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={styles.range}
        aria-label="Comparer avant et après le lavage"
      />
    </div>
  )
}
