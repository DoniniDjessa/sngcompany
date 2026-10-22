import Image from "next/image"
import { ArrowRight, Calendar, Car, Clock, Droplets, Key, MapPin, Search, Settings, Shield, Users, Wallet } from "@/components/icons"
import type { CompanyContent } from "@/lib/content"
import { carPhoto, type RentalCar } from "@/lib/content-server"
import type { Service } from "@/lib/services"
import { formatXOF } from "@/lib/site"
import CmsImage from "../CmsImage"
import RentalSearch from "./RentalSearch"
import styles from "./Rental.module.css"

const PROMISE_ICONS = [Car, Shield, Wallet, Clock]

const STEPS = [
  { icon: Search, title: "Recherchez", text: "Trouvez le véhicule idéal parmi notre flotte en Côte d'Ivoire." },
  { icon: Calendar, title: "Réservez", text: "Choisissez vos dates, avec ou sans chauffeur : nous confirmons rapidement." },
  { icon: Car, title: "Profitez", text: "Récupérez votre véhicule ou faites-vous livrer, et roulez en toute sérénité." },
]

// Vehicle rental page in the colours of the SNG Elite Cars site (cream, black, orange) with the fonts of the home page,
// inside the SNG Company layout. The shared sections (prestations, FAQ, contact, other activities)
// come from the service page so they keep the look of the rest of the site.
export default function RentalPage({ service: s, company, cars, prestations, faq, contact, others }: {
  service: Service
  company: CompanyContent
  cars: RentalCar[]
  prestations: React.ReactNode
  faq: React.ReactNode
  contact: React.ReactNode
  others: React.ReactNode
}) {
  const site = company.carsSiteUrl.replace(/\/$/, "")
  return (
    <main className={styles.page}>
      {/* ---------- hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <CmsImage src="/images/bg-car.webp" alt="" priority sizes="100vw" className={styles.cover} />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Plus qu&apos;un trajet, une expérience</p>
          <h1 className={styles.heroTitle}>{s.name}</h1>
          <p className={styles.heroText}>{s.intro}</p>
          <RentalSearch siteUrl={site} />
          <div className={styles.heroLinks}>
            <a href={`${site}/location`} target="_blank" rel="noopener noreferrer"><Key /> Location à la journée</a>
            <a href="#contact"><Users /> Avec chauffeur</a>
            <a href={`${site}/nos-vehicules`} target="_blank" rel="noopener noreferrer"><Car /> Toute la flotte</a>
          </div>
        </div>
      </section>

      {/* ---------- promises ---------- */}
      <section className={styles.promises}>
        <ul>
          {s.features.slice(0, 4).map((f, i) => {
            const Icon = PROMISE_ICONS[i % PROMISE_ICONS.length]
            return (
              <li key={f.title}>
                <span className={styles.promiseIcon}><Icon /></span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ---------- most requested cars (live from SNG Elite Cars) ---------- */}
      {cars.length > 0 && (
        <section className={`${styles.block} reveal`}>
          <div className={styles.blockHead}>
            <div>
              <p className={styles.eyebrow}>Sélection</p>
              <h2 className={styles.h2}>Nos véhicules les plus demandés</h2>
            </div>
            <a href={`${site}/nos-vehicules`} target="_blank" rel="noopener noreferrer" className={styles.headLink}>Voir toute la flotte <ArrowRight /></a>
          </div>
          <div className={`${styles.cars} stagger`}>
            {cars.map((c) => {
              const photo = carPhoto(c)
              const gearbox = c.transmission === "Automatic" ? "Automatique" : c.transmission === "Manual" ? "Manuelle" : c.transmission
              const fuel = { Gasoline: "Essence", Diesel: "Diesel", Hybrid: "Hybride", Electric: "Électrique" }[c.fuel_type ?? ""] ?? c.fuel_type
              return (
                <article key={c.id} className={styles.car}>
                  <a href={`${site}/car/${c.id}`} target="_blank" rel="noopener noreferrer" className={styles.carMedia} aria-label={`${c.brand} ${c.model} : voir la fiche`}>
                    {photo ? (
                      <Image src={photo} alt={`${c.brand} ${c.model}`} fill sizes="(max-width: 640px) 85vw, (max-width: 1000px) 50vw, 420px" className={styles.carImg} />
                    ) : (
                      <span className={styles.carPlaceholder}><Car /></span>
                    )}
                    <span className={styles.carTag}>Location</span>
                    {c.year && <span className={styles.carYear}>{c.year}</span>}
                    <span className={styles.carPrice}>
                      {c.price_per_day ? <><strong>{formatXOF(c.price_per_day)}</strong> / jour</> : "Prix sur demande"}
                    </span>
                  </a>
                  <div className={styles.carBody}>
                    <p className={styles.carBrand}>{c.brand}</p>
                    <h3>{c.model}</h3>
                    <ul className={styles.carSpecs}>
                      {c.seats && <li><Users /> {c.seats} places</li>}
                      {gearbox && <li><Settings /> {gearbox}</li>}
                      {fuel && <li><Droplets /> {fuel}</li>}
                    </ul>
                    {c.location && <p className={styles.carPlace}><MapPin /> {c.location}</p>}
                    <div className={styles.carActions}>
                      <a href={`${site}/car/${c.id}`} target="_blank" rel="noopener noreferrer" className={styles.carBook}>Réserver</a>
                      <a href={`${site}/car/${c.id}`} target="_blank" rel="noopener noreferrer" className={styles.carMore}>Détails <ArrowRight /></a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------- prestations: same UI as the other activity pages ---------- */}
      {prestations}

      {/* ---------- welcome ---------- */}
      <section className={styles.welcome}>
        <div className={`${styles.welcomeInner} reveal`}>
          <div className={styles.welcomeMedia}>
            <div className={styles.welcomePhoto}>
              <CmsImage src={s.image || "/images/honda-accord-abidjan.png"} alt={s.name} sizes="(max-width: 1000px) 100vw, 50vw" className={styles.cover} />
            </div>
            <p className={styles.quote}>« Roulez prestige, payez malin »</p>
          </div>
          <div>
            <p className={styles.eyebrow}>Bienvenue chez</p>
            <h2 className={styles.h2}>{company.carsSiteName}</h2>
            <div className={styles.welcomeText}>
              <p>Le luxe et le standard à portée de main : une large gamme de véhicules, du prestige au quotidien, à des prix accessibles.</p>
              <p>Confort, sécurité et élégance, sans compromis.</p>
              <p className={styles.strong}>Avec {company.carsSiteName}, louez plus qu&apos;une voiture : vivez une expérience.</p>
            </div>
            <div className={styles.welcomeActions}>
              <a href={`${site}/location`} target="_blank" rel="noopener noreferrer" className={styles.darkBtn}><Key /> Louer un véhicule</a>
              <a href="#contact" className={styles.lineBtn}>Nous contacter</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className={`${styles.block} reveal`}>
        <div className={styles.center}>
          <p className={styles.eyebrow}>Simple et rapide</p>
          <h2 className={styles.h2}>Comment ça marche</h2>
        </div>
        <ol className={`${styles.steps} stagger`}>
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <span className={styles.stepNum}>0{i + 1}</span>
              <span className={styles.stepIcon}><st.icon /></span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {faq}
      {contact}
      {others}
    </main>
  )
}
