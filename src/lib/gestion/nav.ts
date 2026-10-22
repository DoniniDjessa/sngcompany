import type { Icon } from "@/components/icons"
import { Dashboard, Globe, Settings } from "@/components/icons"
import { resourceBySlug } from "./resources"

export interface NavItem { label: string; href: string; icon: Icon; countKey?: "demandes" }

const mod = (slug: string, countKey?: NavItem["countKey"]): NavItem => {
  const r = resourceBySlug(slug)!
  return { label: r.title, href: `/gestion/${r.slug}`, icon: r.icon, countKey }
}

export const NAV: { label: string; items: NavItem[] }[] = [
  { label: "Pilotage", items: [{ label: "Tableau de bord", href: "/gestion", icon: Dashboard }, mod("demandes", "demandes"), mod("clients")] },
  { label: "Mobilité", items: [mod("vehicules"), mod("locations"), mod("lavages")] },
  { label: "Transport & matériel", items: [mod("transports"), mod("equipements"), mod("locations-equipement")] },
  { label: "Élevage", items: [mod("elevage"), mod("ventes-elevage")] },
  { label: "Finances", items: [mod("factures")] },
  { label: "Système", items: [{ label: "Paramètres", href: "/gestion/parametres", icon: Settings }, { label: "Voir le site", href: "/", icon: Globe }] },
]

/** Group + label of the current page, for the breadcrumb */
export function navTrail(pathname: string) {
  for (const group of NAV) {
    const item = group.items.find((i) => i.href === pathname || (i.href !== "/gestion" && pathname.startsWith(i.href + "/")))
    if (item) return { group: group.label, label: item.label }
  }
  return { group: "Pilotage", label: "Tableau de bord" }
}
