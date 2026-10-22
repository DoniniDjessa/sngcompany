"use client"
import { createContext, useContext } from "react"
import type { CompanyContent } from "@/lib/content"
import type { Service } from "@/lib/services"
import { DEFAULT_COMPANY, serviceDefaults } from "@/lib/content"
import { SERVICES } from "@/lib/services"

// Company details and activity texts (from Gestion › Site web) for the client components of the site.
// Icons are functions and cannot come from the server: they are taken back from SERVICES by slug.
export type ClientService = Omit<Service, "icon">

type Value = { company: CompanyContent; services: ClientService[] }

const SiteContext = createContext<Value>({
  company: DEFAULT_COMPANY,
  services: SERVICES.map((s) => ({ slug: s.slug, tone: s.tone, ...serviceDefaults(s.slug) })),
})

export function SiteProvider({ value, children }: { value: Value; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const { company, services } = useContext(SiteContext)
  return {
    company,
    services: services.map((s) => ({ ...s, icon: SERVICES.find((x) => x.slug === s.slug)!.icon })),
  }
}
