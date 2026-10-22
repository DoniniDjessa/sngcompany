import Link from "next/link"
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Shield, TrendingUp, Users } from "@/components/icons"
import ActivityTiles from "@/components/site/ActivityTiles"
import CmsImage from "@/components/site/CmsImage"
import FleetBanner from "@/components/site/FleetBanner"
import HeroCarousel from "@/components/site/HeroCarousel"
import HowItWorks from "@/components/site/HowItWorks"
import { Commitments, Faq, Partners, ScrollText } from "@/components/site/HomeSections"
import RoadThread from "@/components/site/RoadThread"
import ServedZones from "@/components/site/ServedZones"
import QuoteForm from "@/components/site/QuoteForm"
import { telHref } from "@/lib/content"
import { getContent } from "@/lib/content-server"
import styles from "./site.module.css"

const WHY_ICONS = [Users, Shield, Clock, TrendingUp]

/** Initials of a title, small words left out: "Fiabilité & sécurité" → "FS", "Réactivité" → "R" */
const SMALL_WORDS = new Set(["un", "une", "le", "la", "les", "l", "de", "des", "du", "d", "et", "&", "à", "au", "aux", "en", "pour", "par", "sur"])
const initials = (title: string) =>
  title
    .split(/[\s'’-]+/)
    .filter((w) => w && !SMALL_WORDS.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 3)

export default async function Home() {
  const { home: h, company } = await getContent()

  return (
    <main className={styles.main}>
      {/* --- HERO CAROUSEL --- */}
      <HeroCarousel slides={h.hero.slides} />

      {/* --- ACTIVITIES --- */}
      <section id="services" className={styles.activities}>
        <div className={`${styles.activitiesHead} reveal`}>
          <h2 className={styles.sectionTitle}>Nos activités.</h2>
          <p>Survolez une activité pour en découvrir plus.</p>
        </div>
        <ActivityTiles />
      </section>

      {/* --- COMMITMENTS --- */}
      <section id="engagements" className={`${styles.section} reveal`}>
        <Commitments data={h.commitments} />
      </section>

      {/* --- ABOUT: editorial split, sticky photo + statement revealed while scrolling --- */}
      <section id="a-propos" className={`${styles.about} reveal`}>
        <span className={styles.aboutMark} aria-hidden="true">SNG</span>
        <div className={styles.aboutGrid}>
          {h.about.image && (
            <div className={styles.aboutVisual}>
              <div className={styles.aboutPhoto}>
                <CmsImage src={h.about.image} alt={h.about.title} sizes="(max-width: 1000px) 100vw, 45vw" className={styles.cover} />
              </div>
              <div className={styles.aboutBadge}>
                <strong>{company.name}</strong>
                <span>Né de {company.carsSiteName}</span>
              </div>
            </div>
          )}
          <div className={styles.aboutBody}>
            <p className={styles.eyebrow}>{h.about.eyebrow}</p>
            <h2 className={styles.aboutTitle}>{h.about.title}</h2>
            <ScrollText text={h.about.text} className={styles.aboutText} />
            <ul className={`${styles.aboutValues} stagger`}>
              {h.about.values.map((v, i) => (
                <li key={v}>
                  <span className={styles.aboutCheck}><Check /></span>
                  <span className={styles.aboutValue}>{v}</span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- SERVED ZONES --- */}
      <section id="zones" className={`${styles.graySectionAlt} reveal`}>
        <ServedZones {...h.zones} />
      </section>

      {/* --- WHY US: sticky intro + cards that stack on top of each other while scrolling --- */}
      <section id="pourquoi" className={styles.why}>
        <div className={styles.whyGrid}>
          <div className={styles.whyIntro}>
            <p className={styles.eyebrow}>Nos atouts</p>
            <h2 className={styles.whyTitle}>{h.why.title}</h2>
            <p className={styles.whyLead}>
              {h.why.items.length} raisons de confier vos déplacements, votre matériel et vos commandes à une seule équipe.
            </p>
            <Link href="/contact" className="btn-primary">Nous contacter <ArrowRight /></Link>
          </div>
          <ol className={styles.whyStack}>
            {h.why.items.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length]
              return (
                <li key={w.title} className={`${styles.whyCard} ${i % 2 ? styles.whyLight : ""}`} style={{ ["--i" as string]: i }}>
                  <span className={styles.whyNum} aria-hidden="true">{initials(w.title)}</span>
                  <span className={styles.whyIcon}><Icon /></span>
                  <div className={styles.whyText}>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                  <span className={styles.whyCount}>{i + 1} / {h.why.items.length}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* --- HOW IT WORKS: scroll-driven journey --- */}
      <HowItWorks eyebrow={h.steps.eyebrow} title={h.steps.title} items={h.steps.items} />

      {/* --- PARTNERS (only once some are added) --- */}
      {h.partners.items.length > 0 && (
        <section className={`${styles.section} reveal`}>
          <Partners data={h.partners} />
        </section>
      )}

      {/* --- FAQ --- */}
      <section id="faq" className={`${styles.graySection} reveal`}>
        <Faq data={h.faq} />
      </section>

      {/* --- SNG ELITE CARS: fleet showcase --- */}
      <FleetBanner data={h.cars} siteUrl={company.carsSiteUrl} siteName={company.carsSiteName} />

      {/* --- CONTACT --- */}
      <section id="contact" className={`${styles.graySection} reveal`}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <p className={styles.eyebrow}>{h.contact.eyebrow}</p>
            <h2>{h.contact.title}</h2>
            <p>{h.contact.text}</p>
            <ul>
              <li><span><Phone /></span><div><small>Téléphone</small><a href={telHref(company.phone)}>{company.phone}</a></div></li>
              <li><span><Mail /></span><div><small>E-mail</small><a href={`mailto:${company.email}`}>{company.email}</a></div></li>
              <li><span><MapPin /></span><div><small>Adresse</small>{company.address}</div></li>
              <li><span><Clock /></span><div><small>Horaires</small>{company.hours}</div></li>
            </ul>
          </div>
          <div className={styles.contactForm}>
            <h3>Nous contacter</h3>
            <QuoteForm />
          </div>
        </div>
      </section>
      <RoadThread
        tone="orange"
        stations={[
          { id: "services", label: "Activités" },
          { id: "engagements", label: "Engagements" },
          { id: "a-propos", label: "Qui sommes-nous" },
          { id: "zones", label: "Zones desservies" },
          { id: "pourquoi", label: "Pourquoi SNG" },
          { id: "etapes", label: "Comment ça marche" },
          { id: "faq", label: "Questions" },
          { id: "flotte", label: "SNG Elite Cars" },
          { id: "contact", label: "Contact" },
        ]}
      />
    </main>
  )
}
