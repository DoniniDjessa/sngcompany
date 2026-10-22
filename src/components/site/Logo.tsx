import Link from "next/link"
import styles from "./Logo.module.css"

// Company logo: logo-black.png on the light theme, logo-white.png on the dark theme
// (both are in /public; the frame crops the transparent margins of the files).
export default function Logo({ name, tagline, light = false }: { name: string; tagline?: string; light?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${light ? styles.light : ""}`} aria-label={`${name} — accueil`}>
      <span className={styles.frame} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- small static logo, two versions swapped by theme */}
        <img src="/logo-black.png" alt="" className={styles.black} />
        {/* eslint-disable-next-line @next/next/no-img-element -- small static logo, two versions swapped by theme */}
        <img src="/logo-white.png" alt="" className={styles.white} />
      </span>
      <span className={styles.srOnly}>{name}{tagline ? ` — ${tagline}` : ""}</span>
    </Link>
  )
}
