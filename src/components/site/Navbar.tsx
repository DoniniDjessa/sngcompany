"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown, Mail, Moon, Phone, Sun } from "@/components/icons"
import { useTheme } from "@/components/theme"
import { telHref } from "@/lib/content"
import CmsImage from "./CmsImage"
import { useSite } from "./SiteContext"
import Logo from "./Logo"
import styles from "./Navbar.module.css"

const MENU = [
  { name: "À Propos", path: "/#a-propos" },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { company, services } = useSite()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // activity shown in the preview of the "Nos services" panel
  const [preview, setPreview] = useState(0)
  const shown = services[preview] ?? services[0]

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
      <nav className={styles.nav} aria-label="Navigation principale">
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Logo name={company.name} tagline={company.tagline} />

            <div className={`${styles.backdrop} ${isMenuOpen ? styles.backdropVisible : ""}`} onClick={() => setIsMenuOpen(false)} />

            <ul className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`} onClick={(e) => (e.target as HTMLElement).closest("a") && setIsMenuOpen(false)}>
              <li className={styles.menuHeader}><h3>MENU</h3></li>
              <li className={styles.menuItem}><Link href="/">Accueil</Link></li>
              <li className={`${styles.menuItem} ${styles.hasDropdown}`}>
                <Link href="/#services">Nos Services <ChevronDown className={styles.caret} /></Link>
                {/* mega panel: list on the left, preview of the hovered activity on the right */}
                <div className={styles.dropdown}>
                  <div className={styles.megaList}>
                    <p className={styles.megaTitle}>Nos activités</p>
                    {services.map((s, i) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className={`${styles.dropdownItem} ${i === preview ? styles.itemOn : ""}`}
                        style={{ ["--i" as string]: i }}
                        onPointerEnter={() => setPreview(i)}
                        onFocus={() => setPreview(i)}
                      >
                        <span className={styles.dropdownIcon}><s.icon /></span>
                        <span className={styles.itemText}>
                          <strong>{s.name}</strong>
                          <small>{s.tagline}</small>
                        </span>
                        <ArrowRight className={styles.itemArrow} />
                      </Link>
                    ))}
                  </div>
                  {shown && (
                    <Link href={`/services/${shown.slug}`} className={styles.megaPreview} tabIndex={-1} aria-hidden="true">
                      <div key={shown.slug} className={styles.previewMedia}>
                        {shown.image ? (
                          <CmsImage src={shown.image} alt="" sizes="300px" className={styles.previewImg} />
                        ) : (
                          <span className={styles.previewIcon}><shown.icon /></span>
                        )}
                      </div>
                      <div key={`t-${shown.slug}`} className={styles.previewText}>
                        <strong>{shown.name}</strong>
                        <p>{shown.short}</p>
                        <span>Découvrir <ArrowRight /></span>
                      </div>
                    </Link>
                  )}
                </div>
              </li>
              {MENU.map((item) => (
                <li key={item.path} className={styles.menuItem}><Link href={item.path}>{item.name}</Link></li>
              ))}
              <li className={styles.mobileContact}>
                <a href={telHref(company.phone)}><Phone /> {company.phone}</a>
                <a href={`mailto:${company.email}`}><Mail /> {company.email}</a>
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
