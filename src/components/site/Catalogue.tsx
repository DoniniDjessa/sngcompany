"use client"
import { useEffect, useMemo, useState } from "react"
import { Check, Plus, X } from "@/components/icons"
import { imgSrc } from "@/lib/content"
import type { CatalogueItem } from "@/lib/content-server"
import { categoryIcon, categoryLabel } from "@/lib/equipment"
import { formatXOF } from "@/lib/site"
import { supabase } from "@/lib/supabase"
import { useSite } from "./SiteContext"
import styles from "./Catalogue.module.css"

// Online equipment catalogue: browse, check stock, order for given dates.
// The order goes through sng_submit_commande(), which re-checks the stock and computes the amount.

const today = () => new Date().toISOString().slice(0, 10)
const days = (a: string, b: string) => (a && b && b >= a ? Math.round((Date.parse(b) - Date.parse(a)) / 864e5) + 1 : 0)

export default function Catalogue({ items }: { items: CatalogueItem[] }) {
  const [category, setCategory] = useState("")
  const [ordering, setOrdering] = useState<CatalogueItem | null>(null)
  const categories = useMemo(() => [...new Set(items.map((i) => i.category ?? "").filter(Boolean))], [items])
  const shown = items.filter((i) => !category || i.category === category)

  if (items.length === 0) {
    return <p className={styles.empty}>Le catalogue est en cours de mise à jour. Contactez-nous pour connaître le matériel disponible.</p>
  }

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Catégories">
        <button role="tab" aria-selected={!category} className={!category ? styles.on : ""} onClick={() => setCategory("")}>Tout <span>{items.length}</span></button>
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={category === c} className={category === c ? styles.on : ""} onClick={() => setCategory(c)}>
            {categoryLabel(c)} <span>{items.filter((i) => i.category === c).length}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {shown.map((item, n) => {
          const stock = item.available ?? 0
          const total = Math.max(stock, item.quantity ?? stock, 1)
          const photo = item.photos?.[0]
          const Icon = categoryIcon(item.category)
          // stock meter: one segment per unit (10 at most)
          const segments = Math.min(total, 10)
          const lit = Math.round((stock / total) * segments)
          const out = stock < 1
          return (
            <article key={item.id} className={`${styles.card} ${out ? styles.cardOut : ""}`} style={{ ["--n" as string]: n % 6 }}>
              <button type="button" className={styles.media} onClick={() => !out && setOrdering(item)} disabled={out} aria-label={`Commander ${item.name}`}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- signed R2 redirect
                  <img src={imgSrc(photo)} alt={item.name} loading="lazy" />
                ) : (
                  // no photo yet: the icon of the category, drawn large on a blueprint
                  <span className={styles.placeholder}><Icon /></span>
                )}
                <span className={styles.chip}><Icon /> {categoryLabel(item.category)}</span>
                {item.code && <span className={styles.code}>{item.code}</span>}
              </button>

              <div className={styles.body}>
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}

                <div className={styles.meter} aria-label={`${stock} sur ${total} disponibles`}>
                  <span className={styles.segments} aria-hidden="true">
                    {Array.from({ length: segments }, (_, k) => <i key={k} className={k < lit ? styles.on : ""} />)}
                  </span>
                  <small>{out ? "Indisponible" : `${stock} / ${total} disponible${stock > 1 ? "s" : ""}`}</small>
                </div>

                <div className={styles.footer}>
                  <p className={styles.price}>
                    <strong>{formatXOF(item.price_day)}</strong>
                    <span>par jour</span>
                  </p>
                  <button className={styles.order} disabled={out} onClick={() => setOrdering(item)} aria-label={`Commander ${item.name}`}>
                    <Plus /><span>Commander</span>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {ordering && <OrderSheet item={ordering} onClose={() => setOrdering(null)} />}
    </>
  )
}

function OrderSheet({ item, onClose }: { item: CatalogueItem; onClose: () => void }) {
  const { company } = useSite()
  const max = item.available ?? 0
  const [v, setV] = useState({ quantity: 1, debut: today(), fin: today(), name: "", phone: "", email: "", site: "", notes: "" })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ref, setRef] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV({ ...v, [k]: k === "quantity" ? Number(e.target.value) : e.target.value })
  const n = days(v.debut, v.fin)
  const total = n * v.quantity * (item.price_day ?? 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!n) return setError("La date de fin doit suivre la date de début.")
    setSending(true)
    setError(null)
    const { data, error } = await supabase.rpc("sng_submit_commande", {
      p_equipment_id: item.id,
      p_quantity: v.quantity,
      p_debut: v.debut,
      p_fin: v.fin,
      p_name: v.name,
      p_phone: v.phone,
      p_email: v.email || null,
      p_site: v.site || null,
      p_notes: v.notes || null,
    })
    setSending(false)
    if (error) return setError(/Stock|Dates|Quantité/.test(error.message) ? error.message : `La commande n'a pas pu être envoyée. Appelez-nous au ${company.phone}.`)
    setRef(data as string)
  }

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={`Commander ${item.name}`}>
        <button className={styles.close} onClick={onClose} aria-label="Fermer"><X /></button>
        {ref ? (
          <div className={styles.done}>
            <span className={styles.doneIcon}><Check /></span>
            <h3>Commande envoyée</h3>
            <p>Votre commande <strong>{ref}</strong> est enregistrée. Nous vous rappelons pour confirmer la disponibilité, la livraison et le paiement.</p>
            <button className="btn-primary" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <span className={styles.category}>{categoryLabel(item.category)}</span>
            <h3 className={styles.sheetTitle}>{item.name}</h3>
            <p className={styles.sheetPrice}>{formatXOF(item.price_day)} / jour · {max} disponible{max > 1 ? "s" : ""}</p>

            <div className={styles.fields}>
              <label>Quantité<input type="number" min={1} max={max} required value={v.quantity} onChange={set("quantity")} /></label>
              <label>Du<input type="date" min={today()} required value={v.debut} onChange={set("debut")} /></label>
              <label>Au<input type="date" min={v.debut || today()} required value={v.fin} onChange={set("fin")} /></label>
              <label className={styles.wide}>Nom complet *<input required value={v.name} onChange={set("name")} /></label>
              <label>Téléphone *<input type="tel" required value={v.phone} onChange={set("phone")} /></label>
              <label>E-mail<input type="email" value={v.email} onChange={set("email")} /></label>
              <label className={styles.wide}>Lieu d&apos;utilisation<input value={v.site} onChange={set("site")} placeholder="Commune, quartier, chantier…" /></label>
              <label className={styles.full}>Précisions<textarea rows={2} value={v.notes} onChange={set("notes")} placeholder="Livraison, montage, technicien…" /></label>
            </div>

            <p className={styles.left} aria-live="polite">
              <span key={max - v.quantity} className={styles.leftNum}>{Math.max(0, max - v.quantity)}</span>
              {" "}en stock après votre commande
            </p>

            <div className={styles.total}>
              <span>{v.quantity} × {n} jour{n > 1 ? "s" : ""}</span>
              <strong>{formatXOF(total)}</strong>
            </div>
            <p className={styles.hint}>Montant estimé hors livraison et caution, confirmé par téléphone.</p>
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <button type="submit" className="btn-primary" disabled={sending || v.quantity > max}>{sending ? "Envoi…" : "Envoyer la commande"}</button>
          </form>
        )}
      </div>
    </div>
  )
}
