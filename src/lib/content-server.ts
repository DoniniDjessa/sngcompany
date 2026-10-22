import { cache } from "react"
import { CONTENT_TAG, DEFAULT_COMPANY, DEFAULT_HOME, mergeContent, serviceDefaults } from "./content"
import { SERVICES, type Service, type ServiceSlug } from "./services"

// Server side reads of the public data (anon key + row level security), cached by Next and
// refreshed right after an edit in the backoffice (/api/revalidate).

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function rest<T>(path: string, tag: string, revalidate: number): Promise<T | null> {
  if (!URL || !KEY) return null
  try {
    const res = await fetch(`${URL}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate, tags: [tag] },
    })
    return res.ok ? ((await res.json()) as T) : null // table not created yet → defaults
  } catch {
    return null
  }
}

export const getContent = cache(async () => {
  const rows = (await rest<{ key: string; value: unknown }[]>("sng-content?select=key,value", CONTENT_TAG, 3600)) ?? []
  const saved = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const services: Service[] = SERVICES.map((s) => ({ ...s, ...mergeContent(serviceDefaults(s.slug), saved[`service:${s.slug}`]) }))
  return {
    company: mergeContent(DEFAULT_COMPANY, saved.company),
    home: mergeContent(DEFAULT_HOME, saved.home),
    services,
  }
})

export async function getService(slug: string) {
  const { services } = await getContent()
  return services.find((s) => s.slug === (slug as ServiceSlug))
}

export interface CatalogueItem {
  id: string
  code: string | null
  name: string
  category: string | null
  description: string | null
  price_day: number | null
  quantity: number | null
  available: number | null
  condition: string | null
  status: string | null
  photos: string[] | null
}

/** Published equipment, shown in the online catalogue (stock refreshed every minute) */
export async function getCatalogue(): Promise<CatalogueItem[]> {
  const cols = "id,code,name,category,description,price_day,quantity,available,condition,status,photos"
  return (await rest<CatalogueItem[]>(`sng-equipements?select=${cols}&published=eq.true&order=category.asc,name.asc`, "sng-catalogue", 60)) ?? []
}

export interface RentalCar {
  id: string
  brand: string
  model: string
  year: number | null
  price_per_day: number | null
  seats: number | null
  transmission: string | null
  fuel_type: string | null
  location: string | null
  images: string | string[] | null
}

/** First photo of a car of the SNG Elite Cars table ("images" is a JSON array or a comma-separated list) */
export function carPhoto(car: Pick<RentalCar, "images">) {
  const raw = car.images
  if (Array.isArray(raw)) return raw[0] ?? ""
  if (!raw) return ""
  try {
    if (raw.trim().startsWith("[")) return (JSON.parse(raw) as string[])[0] ?? ""
  } catch {}
  return raw.split(",")[0].trim()
}

/** Rental cars published on the SNG Elite Cars site (shared "cars" table), best rated first */
export async function getRentalCars(limit = 6): Promise<RentalCar[]> {
  const cols = "id,brand,model,year,price_per_day,seats,transmission,fuel_type,location,images"
  const query = `cars?select=${cols}&available=eq.true&siteweb=eq.true&listing_type=in.(rent,both)&order=average_rating.desc.nullslast,created_at.desc&limit=${limit}`
  return (await rest<RentalCar[]>(query, "sng-cars", 300)) ?? []
}
