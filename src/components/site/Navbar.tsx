"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronDown, Clock, Mail, Moon, Phone, Sun } from "@/components/icons"
import { useTheme } from "@/components/theme"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"
import Logo from "./Logo"
import styles from "./Navbar.module.css"

const MENU = [
  { name: "À Propos", path: "/#a-propos" },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            <a href={SITE.phoneHref}><Phone /> {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}><Mail /> {SITE.email}</a>
            <span><Clock /> {SITE.hours}</span>
          </div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Navigation principale">
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Logo />

            <div className={`${styles.backdrop} ${isMenuOpen ? styles.backdropVisible : ""}`} onClick={() => setIsMenuOpen(false)} />

            <ul className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`} onClick={(e) => (e.target as HTMLElement).closest("a") && setIsMenuOpen(false)}>
              <li className={styles.menuHeader}><h3>MENU</h3></li>
              <li className={styles.menuItem}><Link href="/">Accueil</Link></li>
              <li className={`${styles.menuItem} ${styles.hasDropdown}`}>
                <Link href="/#services">Nos Services <ChevronDown className={styles.caret} /></Link>
                <div className={styles.dropdown}>
                  {SERVICES.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon} data-tone={s.tone}><s.icon /></span>
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.tagline}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </li>
              {MENU.map((item) => (
                <li key={item.path} className={styles.menuItem}><Link href={item.path}>{item.name}</Link></li>
              ))}
              <li className={styles.mobileContact}>
                <a href={SITE.phoneHref}><Phone /> {SITE.phone}</a>
                <a href={`mailto:${SITE.email}`}><Mail /> {SITE.email}</a>
                <Link href="/contact" className="btn-primary">Nous contacter</Link>
              </li>
            </ul>

            <div className={styles.actions}>
              <button className={styles.themeToggle} onClick={toggle} aria-label="Changer de thème">
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>
              <Link href="/contact" className={styles.ctaButton}>Nous contacter</Link>
              <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu" aria-expanded={isMenuOpen}>
                <span className={`${styles.bar} ${isMenuOpen ? styles.open : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
