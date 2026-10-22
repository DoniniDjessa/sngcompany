import { ArrowRight, Clock, MapPin, Phone } from "@/components/icons"
import { telHref, type CompanyContent } from "@/lib/content"
import styles from "./Activity.module.css"

// Where to find the washing station: Google map (plain embed, no API key) in black & white, colour on
// hover, and a card with the address, the hours and the buttons that open Google Maps (route or place).
export default function WashMap({ company }: { company: CompanyContent }) {
  const place = company.washAddress || company.address
  const q = encodeURIComponent(place)
  return (
    <div className={styles.map}>
      <iframe
        title={`Carte : ${place}`}
        src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={styles.mapFrame}
      />
      <div className={styles.mapCard}>
        <p className={styles.stackEyebrow}><span />Notre station</p>
        <h3><MapPin /> {place}</h3>
        <ul>
          <li><Clock /> {company.hours}</li>
          <li><Phone /> <a href={telHref(company.phone)}>{company.phone}</a></li>
        </ul>
        <div className={styles.mapActions}>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer" className={styles.washBtn}>
            Itinéraire <ArrowRight />
          </a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
            Ouvrir dans Google Maps
          </a>
        </div>
        <p className={styles.mapNote}>Pas le temps de venir ? Nous lavons aussi à domicile, partout dans le Grand Abidjan.</p>
      </div>
    </div>
  )
}
