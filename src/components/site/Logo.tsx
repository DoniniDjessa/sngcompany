import Link from "next/link"
import styles from "./Logo.module.css"

export default function Logo({ name, tagline, light = false }: { name: string; tagline?: string; light?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${light ? styles.light : ""}`} aria-label={`${name} — accueil`}>
      <span className={styles.mark}>SNG</span>
      <span className={styles.text}>
        <strong>{name}</strong>
        {tagline && <small>{tagline}</small>}
      </span>
    </Link>
  )
}
