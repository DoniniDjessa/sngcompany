import { cache } from "react"
import { CONTENT_TAG, DEFAULT_COMPANY, DEFAULT_HOME, mergeContent, serviceDefaults } from "./content"
import type { RentalCar } from "./cars"
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

const CAR_COLS = "id,brand,model,variant,year,color,price_per_day,price_sale,mileage,seats,transmission,fuel_type,location,description,listing_type,tag_text,busy_start_date,busy_end_date,images"

/** Rental cars published on the SNG Elite Cars site (shared "cars" table), best rated first */
export async function getRentalCars(limit = 6): Promise<RentalCar[]> {
  const query = `cars?select=${CAR_COLS}&available=eq.true&siteweb=eq.true&listing_type=in.(rent,both)&order=average_rating.desc.nullslast,created_at.desc&limit=${limit}`
  return (await rest<RentalCar[]>(query, "sng-cars", 300)) ?? []
}

/** Every car published on the site, for rent or for sale */
export async function getFleet(): Promise<RentalCar[]> {
  const query = `cars?select=${CAR_COLS}&available=eq.true&siteweb=eq.true&order=average_rating.desc.nullslast,created_at.desc`
  return (await rest<RentalCar[]>(query, "sng-cars", 300)) ?? []
}

export async function getCar(id: string): Promise<RentalCar | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const rows = await rest<RentalCar[]>(`cars?select=${CAR_COLS}&id=eq.${id}&siteweb=eq.true&limit=1`, "sng-cars", 300)
  return rows?.[0] ?? null
}

export { carPhoto, carPhotos, type RentalCar } from "./cars"
