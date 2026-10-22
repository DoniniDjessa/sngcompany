import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "@/components/icons"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"
import Logo from "./Logo"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Logo light />
            <p className={styles.description}>{SITE.description}</p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Nos services</h4>
            <ul className={styles.list}>
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Liens utiles</h4>
            <ul className={styles.list}>
              <li><Link href="/#a-propos">À propos</Link></li>
              <li><Link href="/contact">Nous contacter</Link></li>
              <li><a href={SITE.carsSiteUrl} target="_blank" rel="noopener noreferrer">{SITE.carsSiteName}</a></li>
              <li><Link href="/gestion">Espace gestion</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Contact</h4>
            <ul className={styles.contactList}>
              <li><MapPin /> {SITE.address}</li>
              <li><Phone /> <a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><Mail /> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Clock /> {SITE.hours}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {SITE.name}. Tous droits réservés.</p>
          <p>Abidjan · Côte d&apos;Ivoire</p>
        </div>
      </div>
    </footer>
  )
}
