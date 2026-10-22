import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Clock, External, Mail, MapPin, Phone, Shield, Star, TrendingUp, Users } from "@/components/icons"
import Counter from "@/components/site/Counter"
import QuoteForm from "@/components/site/QuoteForm"
import ServiceCard from "@/components/site/ServiceCard"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"
import styles from "./site.module.css"

// Figures shown on the home page (to be validated by SNG)
const STATS = [
  { value: "5", label: "Métiers complémentaires" },
  { value: "1 500+", label: "Clients servis" },
  { value: "24/7", label: "Assistance" },
  { value: "98%", label: "Clients satisfaits" },
]

const WHY = [
  { icon: Users, title: "Un seul interlocuteur", desc: "Véhicule, déménagement, matériel ou commande de la ferme : un seul contact, une seule facture." },
  { icon: Shield, title: "Fiabilité & sécurité", desc: "Véhicules assurés, matériel vérifié, équipes formées et contrats clairs." },
  { icon: Clock, title: "Réactivité", desc: "Devis sous 24h et interventions rapides partout dans le Grand Abidjan." },
  { icon: TrendingUp, title: "Tarifs justes", desc: "Des prix transparents, des remises pour les entreprises et les contrats réguliers." },
]

const STEPS = [
  { title: "Votre demande", desc: "En ligne, par téléphone ou sur WhatsApp." },
  { title: "Devis sous 24h", desc: "Une offre claire, adaptée à votre besoin." },
  { title: "Intervention", desc: "Nos équipes livrent, transportent ou interviennent." },
  { title: "Suivi", desc: "Un conseiller reste votre contact jusqu'à la fin." },
]

export default function Home() {
  return (
    <main className={styles.main}>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <Image src="/images/bg-cars.webp" alt="" fill priority sizes="100vw" className={styles.heroBgImg} />
        </div>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.subTitle}>
                <span className={styles.line} />
                <span>Groupe multiservices · Abidjan</span>
              </div>
              <h1 className={styles.mainTitle}>
                Un seul partenaire <br /> <span>pour tous vos besoins</span>
              </h1>
              <p className={styles.heroDesc}>{SITE.description}</p>
              <div className={styles.heroActions}>
                <Link href="/#services" className="btn-primary">Découvrir nos services <ArrowRight /></Link>
                <Link href="/contact" className={styles.btnLight}>Nous contacter</Link>
              </div>
              <ul className={styles.heroProofs}>
                {["Réponse sous 24h", "Abidjan & intérieur du pays", "Particuliers & entreprises"].map((p) => (
                  <li key={p}><Check /> {p}</li>
                ))}
              </ul>
            </div>

            <div className={styles.heroPanel}>
              <div className={styles.heroPanelHead}>
                <span>Nos 5 pôles d&apos;activité</span>
                <Star />
              </div>
              {SERVICES.map((s, i) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className={styles.heroService} data-tone={s.tone} style={{ ["--i" as string]: i }}>
                  <span className={styles.heroServiceIcon}><s.icon /></span>
                  <span className={styles.heroServiceText}>
                    <strong>{s.name}</strong>
                    <small>{s.tagline}</small>
                  </span>
                  <ArrowRight className={styles.heroServiceArrow} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[0, 1].map((k) => (
            <span key={k} className={styles.marqueeGroup}>
              {SERVICES.map((s) => <span key={s.slug}><s.icon /> {s.name}</span>)}
            </span>
          ))}
        </div>
      </div>

      {/* --- STATS --- */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsInner}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <h3><Counter value={s.value} /></h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className={`${styles.premiumSection} reveal`}>
        <div className={styles.sectionHeaderPremium}>
          <div>
            <div className="badge-premium">Nos Services</div>
            <h2 className="title-premium">
              Cinq métiers, <br /><span>une même exigence</span>
            </h2>
          </div>
          <p className={styles.headerText}>
            De la route à la ferme, SNG Company met la même rigueur au service des particuliers, des entreprises et des institutions.
          </p>
        </div>
        <div className={`${styles.servicesGrid} stagger`}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.slug} service={s} large={i === 0} />
          ))}
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="a-propos" className={`${styles.premiumSection} reveal`}>
        <div className={styles.sectionHeaderPremium}>
          <div>
            <div className="badge-premium">Qui sommes-nous</div>
            <h2 className="title-premium">
              L&apos;excellence au service <br /><span>de chaque mission</span>
            </h2>
          </div>
          <Link href="/contact" className="btn-primary">Parlons-en <ArrowRight /></Link>
        </div>
        <div className={styles.gridPremium}>
          <div className={`${styles.imageWrapperPremium} img-reveal`}>
            <Image src="/images/luxury-toyota-camry-abidjan.png" alt="Flotte SNG" fill sizes="(max-width: 1024px) 100vw, 50vw" className={styles.cover} />
            <div className={styles.experienceBadge}>
              <p className={styles.experienceNum}>5</p>
              <p className={styles.experienceLabel}>Pôles d&apos;activité</p>
            </div>
          </div>
          <div className={styles.missionCardPremium}>
            <div>
              <h3 className={styles.missionTitle}>Notre mission</h3>
              <p className={styles.missionDesc}>
                Née de la location de véhicules avec {SITE.carsSiteName}, SNG Company a grandi avec ses clients : transport et logistique,
                location d&apos;équipements, lavage de véhicules et élevage. Notre ambition : offrir à chaque foyer et chaque entreprise ivoirienne
                un service fiable, ponctuel et accessible.
              </p>
            </div>
            <ul className={styles.values}>
              {["Fiabilité", "Ponctualité", "Transparence", "Proximité"].map((v) => (
                <li key={v}><Check /> {v}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- WHY US --- */}
      <section className={`${styles.whySection} reveal`}>
        <div className="container">
          <div className={styles.whyHeader}>
            <span className={styles.whySub}>Notre engagement</span>
            <h2 className={styles.whyTitle}>Pourquoi choisir SNG ?</h2>
            <p className={styles.whyItalic}>Une organisation pensée pour vous simplifier la vie</p>
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
        </div>
      </section>

      {/* --- PROCESS --- */}
      <section className={`${styles.premiumSection} reveal`}>
        <div className={styles.processCard}>
          <div className={styles.processHead}>
            <div className="badge-premium">Comment ça marche</div>
            <h2>Simple, rapide, <span>sans surprise</span></h2>
          </div>
          <ol className={`${styles.steps} stagger`}>
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- CAR SITE BANNER --- */}
      <section className={`${styles.premiumSection} reveal`}>
        <div className={styles.carBanner}>
          <div className={styles.carBannerText}>
            <div className="badge-premium">{SITE.carsSiteName}</div>
            <h2>Toute notre flotte de location en ligne</h2>
            <p>Berlines, SUV, minibus et véhicules de prestige : consultez le catalogue, les disponibilités et réservez directement sur notre site dédié.</p>
            <a href={SITE.carsSiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Voir le catalogue <External />
            </a>
          </div>
          <div className={`${styles.carBannerMedia} img-reveal`}>
            <Image src="/images/honda-accord-abidjan.png" alt="Véhicule de location" fill sizes="(max-width: 1024px) 100vw, 45vw" className={styles.cover} />
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className={`${styles.premiumSection} reveal`}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className="badge-premium">Contact</div>
            <h2>Parlons de votre projet</h2>
            <p>Décrivez votre besoin, nous revenons vers vous sous 24h avec une proposition.</p>
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
