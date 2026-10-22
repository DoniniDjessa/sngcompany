import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check } from "@/components/icons"
import BeforeAfter from "@/components/site/BeforeAfter"
import Catalogue from "@/components/site/Catalogue"
import CmsImage from "@/components/site/CmsImage"
import QuoteForm from "@/components/site/QuoteForm"
import RentalPage from "@/components/site/elite/RentalPage"
import { telHref } from "@/lib/content"
import { getCatalogue, getContent, getRentalCars, getService } from "@/lib/content-server"
import { SERVICES } from "@/lib/services"
import styles from "../../site.module.css"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug)
  return service ? { title: service.name, description: service.short } : {}
}

export default async function ServicePage({ params }: Props) {
  const s = await getService((await params).slug)
  if (!s) notFound()
  const { company, services } = await getContent()
  const others = services.filter((o) => o.slug !== s.slug)
  const isShop = s.slug === "location-equipements"
  const catalogue = isShop ? await getCatalogue() : []
  const [first, ...rest] = s.name.split(" ")

  // sections shared by every activity page (and by the vehicle rental layout)
  const prestationsSection = (
    <>
      {/* prestations */}
      <section id="prestations" className={`${styles.premiumSection} reveal`}>
        <div className={styles.prestaGrid}>
          <div className={styles.prestaHead}>
            <div className="badge-premium">Nos prestations</div>
            <h2 className="title-premium">{s.tagline}.</h2>
            {s.slug === "location-vehicules" && (
              <Link href="/vehicules" className="btn-outline">
                Voir nos véhicules <ArrowRight />
              </Link>
            )}
          </div>
          <ol className={`${styles.prestations} stagger`}>
            {s.prestations.map((p, i) => (
              <li key={p.title}>
                <Link href={`/contact?service=${s.slug}`} className={styles.presta}>
                  <span className={styles.prestaNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.prestaText}>
                    <strong>{p.title}</strong>
                    <span>{p.text}</span>
                  </span>
                  <ArrowRight className={styles.prestaArrow} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
  const faqSection = (
    <>
      {/* FAQ */}
      {s.faqs.length > 0 && (
        <section id="faq" className={`${styles.premiumSection} reveal`}>
          <div className={styles.faqGrid}>
            <div>
              <div className="badge-premium">Questions fréquentes</div>
              <h2 className="title-premium">Vous avez <br /><span>des questions ?</span></h2>
              <p className={styles.headerText} style={{ marginTop: 20 }}>
                Notre équipe vous répond au <a href={telHref(company.phone)}><strong>{company.phone}</strong></a> ou par WhatsApp.
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
      )}
    </>
  )
  const contactSection = (
    <>
      <section id="contact" className={`${styles.premiumSection} reveal`}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <p className={styles.eyebrow}>Contact</p>
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
    </>
  )
  const othersSection = (
    <>
      <section id="autres" className={`${styles.premiumSection} reveal`} style={{ paddingTop: 0 }}>
        <div className={styles.othersHead}>
          <div>
            <div className="badge-premium">Découvrez aussi</div>
            <h2 className="title-premium">Nos autres <span>activités.</span></h2>
          </div>
          <Link href="/#services" className="link-more">Toutes les activités <ArrowRight /></Link>
        </div>
        <div className={`${styles.others} stagger`}>
          {others.map((o, i) => (
            <Link key={o.slug} href={`/services/${o.slug}`} className={styles.otherCard}>
              <span className={styles.otherMedia}>
                {o.image ? (
                  <CmsImage src={o.image} alt="" sizes="(max-width: 700px) 75vw, 300px" className={styles.otherImg} />
                ) : (
                  <span className={styles.otherFallback}><o.icon /></span>
                )}
              </span>
              <span className={styles.otherIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.otherText}>
                <span className={styles.otherIcon}><o.icon /></span>
                <strong>{o.name}</strong>
                <small>{o.tagline}</small>
              </span>
              <span className={styles.otherArrow}><ArrowRight /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )

  if (s.slug === "location-vehicules") {
    const cars = await getRentalCars(6)
    return (
      <RentalPage
        service={s}
        company={company}
        cars={cars}
        prestations={prestationsSection}
        faq={faqSection}
        contact={contactSection}
        others={othersSection}
      />
    )
  }

  return (
    <main className={styles.main}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div>
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link> / <Link href="/#services">Activités</Link> / <span>{s.name}</span>
            </nav>
            <h1>{first} <span>{rest.join(" ")}</span></h1>
            <p className={styles.lead}>{s.intro}</p>
            <ul className={styles.heroChips}>
              {s.highlights.map((h) => <li key={h}><Check /> {h}</li>)}
            </ul>
          </div>
          <div className={styles.pageHeroIcon}><s.icon /></div>
        </div>
        {s.image && (
          <div className={styles.pageHeroMedia}>
            {s.slug === "lavage-vehicules" ? (
              <BeforeAfter image={s.image} alt={s.name} />
            ) : (
              <CmsImage src={s.image} alt={s.name} priority sizes="(max-width: 1200px) 100vw, 1200px" className={styles.cover} />
            )}
          </div>
        )}
      </section>

      {/* points forts */}
      <section className="reveal">
        <div className={`${styles.featuresList} stagger`}>
          {s.features.map((f) => (
            <div key={f.title} className={styles.featureItem}>
              <span><s.icon /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* catalogue (équipements) */}
      {isShop && (
        <section id="catalogue" className={`${styles.premiumSection} reveal`}>
          <div className={styles.sectionHeaderPremium}>
            <div>
              <div className="badge-premium">Catalogue</div>
              <h2 className="title-premium">Commandez votre matériel <span>en ligne.</span></h2>
            </div>
            <p className={styles.headerText}>Choisissez, vérifiez la disponibilité, indiquez vos dates : nous confirmons par téléphone.</p>
          </div>
          <Catalogue items={catalogue} />
        </section>
      )}

      {prestationsSection}
      {faqSection}
      {contactSection}
      {othersSection}
    </main>
  )
}
