// Cars of the SNG Elite Cars table ("cars"), shown on the rental pages: types and small helpers
// usable on the server and in the browser.

export interface RentalCar {
  id: string
  brand: string
  model: string
  variant: string | null
  year: number | null
  color: string | null
  price_per_day: number | null
  price_sale: number | null
  mileage: number | null
  seats: number | null
  transmission: string | null
  fuel_type: string | null
  location: string | null
  description: string | null
  listing_type: "rent" | "sell" | "both" | null
  tag_text: string | null
  busy_start_date: string | null
  busy_end_date: string | null
  images: string | string[] | null
}

/** Every photo of a car of the SNG Elite Cars table ("images" is a JSON array or a comma-separated list) */
export function carPhotos(car: Pick<RentalCar, "images">): string[] {
  const raw = car.images
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (!raw) return []
  try {
    if (raw.trim().startsWith("[")) return (JSON.parse(raw) as string[]).filter(Boolean)
  } catch {}
  return raw.split(",").map((x) => x.trim()).filter(Boolean)
}

/** First photo of a car */
export const carPhoto = (car: Pick<RentalCar, "images">) => carPhotos(car)[0] ?? ""

export const gearboxLabel = (v: string | null) => (v === "Automatic" ? "Automatique" : v === "Manual" ? "Manuelle" : v ?? "")

const FUELS: Record<string, string> = { Gasoline: "Essence", Diesel: "Diesel", Hybrid: "Hybride", Electric: "Électrique" }
export const fuelLabel = (v: string | null) => (v ? FUELS[v] ?? v : "")

export const forRent = (c: Pick<RentalCar, "listing_type">) => c.listing_type !== "sell"
export const forSale = (c: Pick<RentalCar, "listing_type">) => c.listing_type === "sell" || c.listing_type === "both"

/** The car is already booked on part of the period (ISO dates) */
export function busyDuring(c: Pick<RentalCar, "busy_start_date" | "busy_end_date">, start: string, end: string) {
  if (!c.busy_start_date || !c.busy_end_date) return false
  return c.busy_start_date.slice(0, 10) <= end && c.busy_end_date.slice(0, 10) >= start
}
