import { ArrowRight, Wrench } from "@/components/icons"
import type { CatalogueItem } from "@/lib/content-server"
import { categoryIcon, categoryLabel } from "@/lib/equipment"
import type { Service } from "@/lib/services"
import { formatXOF } from "@/lib/site"
import ActivityHero from "./ActivityHero"
import styles from "./Activity.module.css"

// Equipment hero: blueprint background and a "stock board" with items of the online catalogue
// (real stock), taken from each category in turn, each availability bar filling in turn.
export default function EquipmentHero({ service: s, items }: { service: Service; items: CatalogueItem[] }) {
  const inStock = items.filter((i) => (i.available ?? 0) > 0)
  const groups = [...new Set(inStock.map((i) => i.category))].map((c) => inStock.filter((i) => i.category === c))
  const board: CatalogueItem[] = []
  for (let k = 0; board.length < 4 && groups.some((g) => g[k]); k++) groups.forEach((g) => g[k] && board.length < 4 && board.push(g[k]))
  return (
    <ActivityHero
      service={s}
      background={<div className={styles.blueprint}><Wrench /></div>}
      actions={<>
        <a href="#catalogue" className={styles.cta}>Voir le catalogue <ArrowRight /></a>
        <a href="#contact" className={styles.ghost}>Demander un devis</a>
      </>}
      side={
        <div className={styles.board}>
          <div className={styles.trackerHead}>
            <span className={styles.live}><i /> Disponible aujourd&apos;hui</span>
            <span className={styles.ref}>{items.length} article{items.length > 1 ? "s" : ""}</span>
          </div>
          {board.length ? (
            <ul className={styles.boardList}>
              {board.map((item, n) => {
                const Icon = categoryIcon(item.category)
                const stock = item.available ?? 0
                const total = Math.max(stock, item.quantity ?? stock)
                return (
                  <li key={item.id} style={{ ["--n" as string]: n }}>
                    <span className={styles.boardIcon}><Icon /></span>
                    <div className={styles.boardText}>
                      <strong>{item.name}</strong>
                      <small>{categoryLabel(item.category)} · {formatXOF(item.price_day)} / jour</small>
                      <span className={styles.boardBar}><i style={{ ["--w" as string]: `${(stock / total) * 100}%` }} /></span>
                    </div>
                    <span className={styles.boardStock}>{stock}<small>/{total}</small></span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.boardEmpty}>Catalogue en cours de mise à jour : contactez-nous pour le matériel disponible.</p>
          )}
          <a href="#catalogue" className={styles.boardLink}>Commander en ligne <ArrowRight /></a>
        </div>
      }
    />
  )
}
