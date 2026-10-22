import { ArrowRight, External } from "@/components/icons"
import type { HomeContent } from "@/lib/content"
import CmsImage from "./CmsImage"
import styles from "./FleetBanner.module.css"

// SNG Elite Cars showcase: the car drives into the frame as you scroll, the site address types
// itself in a browser bar, and the fleet scrolls by in a band (black & white, colour on hover).
export default function FleetBanner({ data, siteUrl, siteName }: { data: HomeContent["cars"]; siteUrl: string; siteName: string }) {
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const gallery = data.gallery.filter((g) => g.image)
  const loop = gallery.length < 6 ? [...gallery, ...gallery] : gallery

  return (
    <section id="flotte" className={styles.fleet} aria-labelledby="fleet-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2 id="fleet-title" className={styles.title}>{data.title}</h2>
          <p className={styles.lead}>{data.text}</p>
          <div className={styles.actions}>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              Voir le catalogue <External />
            </a>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Réserver un véhicule <ArrowRight />
            </a>
          </div>
        </div>

        {/* browser window: address typed in, the car slides into the frame */}
        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={styles.window} aria-label={`Ouvrir ${siteName}`}>
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.lights}><i /><i /><i /></span>
            <span className={styles.address}>
              <span className={styles.typed} style={{ ["--chars" as string]: host.length }}>{host}</span>
            </span>
          </div>
          <div className={styles.screen}>
            <div className={styles.car}>
              <CmsImage src={data.image} alt={data.title} sizes="(max-width: 1000px) 100vw, 55vw" className={styles.carImg} />
            </div>
            <span className={styles.badge}>{siteName}</span>
          </div>
        </a>
      </div>

      {gallery.length > 0 && (
        <div className={styles.strip} aria-label="Quelques véhicules de la flotte">
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1}>
                {loop.map((g, i) => (
                  <li key={i}>
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : 0}>
                      <span className={styles.thumb}>
                        <CmsImage src={g.image} alt={g.name} sizes="260px" className={styles.thumbImg} />
                      </span>
                      <span className={styles.name}>{g.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
