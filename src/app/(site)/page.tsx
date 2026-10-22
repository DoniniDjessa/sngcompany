import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Clock, External, Mail, MapPin, Phone, Shield, TrendingUp, Users } from "@/components/icons"
import Counter from "@/components/site/Counter"
import QuoteForm from "@/components/site/QuoteForm"
import ServiceCard from "@/components/site/ServiceCard"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"
import styles from "./site.module.css"

// Figures shown on the home page (to be validated by SNG)
const STATS = [
  { value: "5", label: "métiers complémentaires" },
  { value: "1 500+", label: "clients servis" },
  { value: "24/7", label: "assistance" },
  { value: "98%", label: "clients satisfaits" },
]

const WHY = [
  { icon: Users, title: "Un seul interlocuteur", desc: "Véhicule, déménagement, matériel ou commande de la ferme : un seul contact, une seule facture." },
  { icon: Shield, title: "Fiabilité & sécurité", desc: "Véhicules assurés, matériel vérifié, équipes formées et contrats clairs." },
  { icon: Clock, title: "Réactivité", desc: "Réponse sous 24h et interventions rapides partout dans le Grand Abidjan." },
  { icon: TrendingUp, title: "Tarifs justes", desc: "Des prix transparents, des remises pour les entreprises et les contrats réguliers." },
]

const STEPS = [
  { title: "Votre demande", desc: "En ligne, par téléphone ou sur WhatsApp." },
  { title: "Réponse sous 24h", desc: "Une offre claire, adaptée à votre besoin." },
  { title: "Intervention", desc: "Nos équipes livrent, transportent ou interviennent." },
  { title: "Suivi", desc: "Un conseiller reste votre contact jusqu'à la fin." },
]

export default function Home() {
  return (
    <main className={styles.main}>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{SITE.name}</p>
          <h1 className={styles.mainTitle}>
            Un seul partenaire.
            <br />
            <span>Pour tous vos besoins.</span>
          </h1>
          <p className={styles.heroDesc}>
            Location de véhicules, transport, équipements, lavage et élevage — à Abidjan et partout en Côte d&apos;Ivoire.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#services" className="btn-primary">Découvrir nos services</Link>
            <Link href="/contact" className="link-more">Nous contacter <ChevronRight /></Link>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <Image src="/images/bg-car.webp" alt="Véhicules SNG" fill priority sizes="(max-width: 1100px) 100vw, 1100px" className={styles.cover} />
        </div>
      </section>

      {/* --- ACTIVITIES (Apple-style tiles) --- */}
      <section id="services" className={styles.tiles}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.slug} service={s} dark={i % 3 === 1} wide={i === 0} />
        ))}
      </section>

      {/* --- FIGURES --- */}
      <section className={`${styles.statsSection} reveal`}>
        <div className={`${styles.statsInner} stagger`}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <h3><Counter value={s.value} /></h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="a-propos" className={`${styles.section} reveal`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Qui sommes-nous</p>
          <h2 className={styles.sectionTitle}>L&apos;excellence au service de chaque mission.</h2>
          <p className={styles.sectionLead}>
            Née de la location de véhicules avec {SITE.carsSiteName}, SNG Company a grandi avec ses clients : transport et logistique,
            location d&apos;équipements, lavage de véhicules et élevage. Notre ambition : un service fiable, ponctuel et accessible
            pour chaque foyer et chaque entreprise ivoirienne.
          </p>
        </div>
        <div className={`${styles.aboutMedia} img-reveal`}>
          <Image src="/images/mitsubishi.jpeg" alt="Véhicule de la flotte SNG" fill sizes="(max-width: 1100px) 100vw, 1100px" className={styles.cover} />
        </div>
        <ul className={`${styles.values} stagger`}>
          {["Fiabilité", "Ponctualité", "Transparence", "Proximité"].map((v) => (
            <li key={v}><Check /> {v}</li>
          ))}
        </ul>
      </section>

      {/* --- WHY US --- */}
      <section className={`${styles.graySection} reveal`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Pourquoi choisir SNG.</h2>
        </div>
        <div className={`${styles.featureGrid} stagger`}>
          {WHY.map((w) => (
            <div key={w.title} className={styles.featureCard}>
              <span className={styles.featureIcon}><w.icon /></span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className={`${styles.darkSection} reveal`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Comment ça marche</p>
          <h2 className={styles.sectionTitle}>Simple. Rapide. Sans surprise.</h2>
        </div>
        <ol className={`${styles.steps} stagger`}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --- CAR SITE --- */}
      <section className={`${styles.section} reveal`}>
        <div className={styles.carBanner}>
          <div className={styles.carBannerText}>
            <p className={styles.eyebrow}>{SITE.carsSiteName}</p>
            <h2>Toute notre flotte de location, en ligne.</h2>
            <p>Berlines, SUV, minibus et véhicules de prestige : consultez le catalogue, les disponibilités et réservez sur notre site dédié.</p>
            <a href={SITE.carsSiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Voir le catalogue <External />
            </a>
          </div>
          <div className={`${styles.carBannerMedia} img-reveal`}>
            <Image src="/images/honda-accord-abidjan.png" alt="Véhicule de location" fill sizes="(max-width: 1024px) 100vw, 50vw" className={styles.cover} />
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className={`${styles.graySection} reveal`}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <p className={styles.eyebrow}>Contact</p>
            <h2>Parlons de votre projet.</h2>
            <p>Décrivez votre besoin, nous revenons vers vous sous 24h.</p>
            <ul>
              <li><span><Phone /></span><div><small>Téléphone</small><a href={SITE.phoneHref}>{SITE.phone}</a></div></li>
              <li><span><Mail /></span><div><small>E-mail</small><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div></li>
              <li><span><MapPin /></span><div><small>Adresse</small>{SITE.address}</div></li>
              <li><span><Clock /></span><div><small>Horaires</small>{SITE.hours}</div></li>
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
