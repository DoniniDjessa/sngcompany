"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "@/components/icons"
import styles from "./Rental.module.css"

// Search bar of the hero (as on SNG Elite Cars): city + dates, opens the cars free on that period
export default function RentalSearch() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const city = String(form.get("city") ?? "").trim()
    const startDate = String(form.get("startDate"))
    const endDate = String(form.get("endDate"))
    if (startDate >= endDate) return setError("La date de retour doit être après la date de départ.")
    const params = new URLSearchParams({ offre: "location", du: startDate, au: endDate })
    if (city) params.set("ville", city)
    router.push(`/vehicules?${params}`)
  }

  return (
    <>
      <form className={styles.search} onSubmit={submit}>
        <label className={styles.field}>
          <span>Ville</span>
          <input name="city" placeholder="Abidjan, Bouaké…" />
        </label>
        <label className={styles.field}>
          <span>Départ</span>
          <input name="startDate" type="date" min={today} required onChange={() => setError(null)} />
        </label>
        <label className={styles.field}>
          <span>Retour</span>
          <input name="endDate" type="date" min={today} required onChange={() => setError(null)} />
        </label>
        <button type="submit" className={styles.searchBtn}><Search /> Rechercher</button>
      </form>
      {error && <p className={styles.searchError} role="alert">{error}</p>}
    </>
  )
}
