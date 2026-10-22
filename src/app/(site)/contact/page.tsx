import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Mail, Phone } from "@/components/icons"
import QuoteForm from "@/components/site/QuoteForm"
import { telHref } from "@/lib/content"
import { getContent } from "@/lib/content-server"
import { SERVICES, type ServiceSlug } from "@/lib/services"
import styles from "../site.module.css"

export const metadata: Metadata = {
  title: "Nous contacter",
  description: "Contactez SNG Company : location de véhicules, transport, équipements, lavage ou élevage. Réponse sous 24h.",
}

type Props = { searchParams: Promise<{ service?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const wanted = (await searchParams).service
  const { company } = await getContent()
  const service = SERVICES.find((s) => s.slug === wanted)?.slug as ServiceSlug | undefined

  return (
    <main className={styles.main}>
      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <div>
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> / <span>Contact</span>
            </nav>
            <h1>Nous <span>contacter</span></h1>
            <p className={styles.lead}>Une question, un projet, une demande de tarif ? Écrivez-nous : nous vous répondons sous 24h.</p>
          </div>
        </div>
      </section>

      <section className={styles.premiumSection}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className="badge-premium">Besoin d&apos;aide ?</div>
            <h2>Parlons-en directement</h2>
            <p>Pour une urgence, appelez-nous ou écrivez-nous sur WhatsApp.</p>
            <ul>
              <li><span><Phone /></span><div><small>Téléphone</small><a href={telHref(company.phone)}>{company.phone}</a></div></li>
              <li><span><Mail /></span><div><small>E-mail</small><a href={`mailto:${company.email}`}>{company.email}</a></div></li>
              <li><span><Clock /></span><div><small>Horaires</small>{company.hours}</div></li>
            </ul>
          </div>
          <div className={styles.contactForm}>
            <h3>Nous contacter</h3>
            <QuoteForm service={service} />
          </div>
        </div>
      </section>
    </main>
  )
}
