import Link from "next/link"
import { SITE } from "@/lib/site"
import styles from "./Logo.module.css"

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${light ? styles.light : ""}`} aria-label={`${SITE.name} — accueil`}>
      <span className={styles.mark}>SNG</span>
      <span className={styles.text}>
        <strong>{SITE.name}</strong>
        <small>{SITE.tagline}</small>
      </span>
    </Link>
  )
}
