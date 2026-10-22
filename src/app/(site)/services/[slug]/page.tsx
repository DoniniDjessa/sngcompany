import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, External } from "@/components/icons"
import QuoteForm from "@/components/site/QuoteForm"
import { SERVICES, serviceBySlug } from "@/lib/services"
import { SITE } from "@/lib/site"
import styles from "../../site.module.css"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceBySlug((await params).slug)
  return service ? { title: service.name, description: service.short } : {}
}

export default async function ServicePage({ params }: Props) {
  const service = serviceBySlug((await params).slug)
  if (!service) notFound()
  const s = service
  const others = SERVICES.filter((o) => o.slug !== s.slug)
  const [first, ...rest] = s.name.split(" ")

  return (
    <main className={styles.main}>
      <section className={styles.pageHero}>
        {s.image && <Image src={s.image} alt="" fill priority sizes="100vw" className={styles.pageHeroBg} />}
        <div className={`container ${styles.pageHeroInner}`}>
          <div>
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> / <Link href="/#services">Services</Link> / <span>{s.name}</span>
            </nav>
            <h1>{first} <span>{rest.join(" ")}</span></h1>
            <p className={styles.lead}>{s.intro}</p>
            <ul className={styles.heroChips}>
              {s.highlights.map((h) => <li key={h}><Check /> {h}</li>)}
            </ul>
          </div>
          <div className={styles.pageHeroIcon}><s.icon /></div>
        </div>
      </section>

      <section className="container">
        <div className={styles.featuresList}>
          {s.features.map((f) => (
            <div key={f.title} className={styles.featureItem}>
              <span><s.icon /></span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.premiumSection} reveal`}>
        <div className={styles.sectionHeaderPremium}>
          <div>
            <div className="badge-premium">Nos offres</div>
            <h2 className="title-premium">{s.tagline.split(" ").slice(0, -1).join(" ")} <span>{s.tagline.split(" ").slice(-1)}</span></h2>
          </div>
          {s.slug === "location-vehicules" && (
            <a href={SITE.carsSiteUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Catalogue {SITE.carsSiteName} <External />
            </a>
          )}
        </div>
        <div className={`${styles.offers} stagger`}>
          {s.offers.map((o) => (
            <div key={o.name} className={`${styles.offer} ${o.featured ? styles.featured : ""}`}>
              {o.featured && <span className={styles.featuredTag}>Populaire</span>}
              <h3>{o.name}</h3>
              <div className={styles.price}>
                <small>{/\d/.test(o.price) ? "À partir de" : "Tarif"}</small>
                <strong>{o.price}</strong>
                <span>{o.unit}</span>
              </div>
              <ul>{o.items.map((i) => <li key={i}><Check /> {i}</li>)}</ul>
              <Link href={`/contact?service=${s.slug}`} className={o.featured ? "btn-primary" : "btn-outline"}>
                Nous contacter <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
        <p className={styles.note}>Tarifs indicatifs, hors options et déplacements. Le devis définitif dépend de votre besoin.</p>
      </section>

      <section className={`${styles.premiumSection} reveal`}>
        <div className={styles.faqGrid}>
          <div>
            <div className="badge-premium">Questions fréquentes</div>
            <h2 className="title-premium">Vous avez <br /><span>des questions ?</span></h2>
            <p className={styles.headerText} style={{ marginTop: 20 }}>
              Notre équipe vous répond au <a href={SITE.phoneHref}><strong>{SITE.phone}</strong></a> ou par WhatsApp.
            </p>
          </div>
          <div className={styles.faqList}>
            {s.faqs.map((f, i) => (
              <details key={f.q} className={styles.faqItem} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={`${styles.premiumSection} reveal`}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className="badge-premium">Contact</div>
            <h2>{s.name}</h2>
            <p>Décrivez votre besoin : un conseiller vous rappelle sous 24h avec une offre adaptée.</p>
            <ul>{s.highlights.map((h) => <li key={h}><span><Check /></span><div>{h}</div></li>)}</ul>
          </div>
          <div className={styles.contactForm}>
            <h3>Nous contacter</h3>
            <QuoteForm service={s.slug} />
          </div>
        </div>
      </section>

      <section className={`${styles.premiumSection} reveal`} style={{ paddingTop: 0 }}>
        <div className="badge-premium">Découvrez aussi</div>
        <div className={`${styles.otherServices} stagger`}>
          {others.map((o) => (
            <Link key={o.slug} href={`/services/${o.slug}`} className={styles.otherLink} data-tone={o.tone}>
              <span><o.icon /></span> {o.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
