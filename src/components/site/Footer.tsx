import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "@/components/icons"
import { telHref, type CompanyContent } from "@/lib/content"
import type { Service } from "@/lib/services"
import Logo from "./Logo"
import styles from "./Footer.module.css"

export default function Footer({ company, services }: { company: CompanyContent; services: Service[] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Logo name={company.name} light />
            <p className={styles.description}>{company.description}</p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Nos services</h4>
            <ul className={styles.list}>
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Liens utiles</h4>
            <ul className={styles.list}>
              <li><Link href="/#a-propos">À propos</Link></li>
              <li><Link href="/contact">Nous contacter</Link></li>
              <li><a href={company.carsSiteUrl} target="_blank" rel="noopener noreferrer">{company.carsSiteName}</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Contact</h4>
            <ul className={styles.contactList}>
              <li><MapPin /> {company.address}</li>
              <li><Phone /> <a href={telHref(company.phone)}>{company.phone}</a></li>
              <li><Mail /> <a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><Clock /> {company.hours}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {company.name}. Tous droits réservés.</p>
          <p>Abidjan · Côte d&apos;Ivoire</p>
        </div>
      </div>
    </footer>
  )
}
