import { Check, Clock, External, Mail, MapPin, Phone, Shield, TrendingUp, Users } from "@/components/icons"
import ActivityTiles from "@/components/site/ActivityTiles"
import CmsImage from "@/components/site/CmsImage"
import HeroCarousel from "@/components/site/HeroCarousel"
import QuoteForm from "@/components/site/QuoteForm"
import { telHref } from "@/lib/content"
import { getContent } from "@/lib/content-server"
import styles from "./site.module.css"

const WHY_ICONS = [Users, Shield, Clock, TrendingUp]

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

      {/* --- ABOUT --- */}
      <section id="a-propos" className={`${styles.section} reveal`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>{h.about.eyebrow}</p>
          <h2 className={styles.sectionTitle}>{h.about.title}</h2>
          <p className={styles.sectionLead}>{h.about.text}</p>
        </div>
        {h.about.image && (
          <div className={`${styles.aboutMedia} img-reveal`}>
            <CmsImage src={h.about.image} alt={h.about.title} sizes="(max-width: 1100px) 100vw, 1100px" className={styles.cover} />
          </div>
        )}
        <ul className={`${styles.values} stagger`}>
          {h.about.values.map((v) => <li key={v}><Check /> {v}</li>)}
        </ul>
      </section>

      {/* --- WHY US --- */}
      <section className={`${styles.graySection} reveal`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{h.why.title}</h2>
        </div>
        <div className={`${styles.featureGrid} stagger`}>
          {h.why.items.map((w, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length]
            return (
              <div key={w.title} className={styles.featureCard}>
                <span className={styles.featureIcon}><Icon /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className={`${styles.darkSection} reveal`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>{h.steps.eyebrow}</p>
          <h2 className={styles.sectionTitle}>{h.steps.title}</h2>
        </div>
        <ol className={`${styles.steps} stagger`}>
          {h.steps.items.map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --- CAR SITE --- */}
      <section className={`${styles.section} reveal`}>
        <div className={styles.carBanner}>
          <div className={styles.carBannerText}>
            <p className={styles.eyebrow}>{h.cars.eyebrow}</p>
            <h2>{h.cars.title}</h2>
            <p>{h.cars.text}</p>
            <a href={company.carsSiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Voir le catalogue <External />
            </a>
          </div>
          <div className={`${styles.carBannerMedia} img-reveal`}>
            <CmsImage src={h.cars.image} alt={h.cars.title} sizes="(max-width: 1024px) 100vw, 50vw" className={styles.cover} />
          </div>
        </div>
      </section>

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
    </main>
  )
}
