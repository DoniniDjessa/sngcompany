import type { Icon } from "@/components/icons"
import { Dashboard, Globe, Pencil, Settings } from "@/components/icons"
import type { CollectionName } from "@/lib/store"
import { resourceBySlug } from "./resources"

/** count: rows of a table with a given status, shown as a red badge (things to handle) */
export interface NavItem { label: string; href: string; icon: Icon; count?: { collection: CollectionName; status: string } }

const mod = (slug: string, count?: NavItem["count"]): NavItem => {
  const r = resourceBySlug(slug)!
  return { label: r.title, href: `/gestion/${r.slug}`, icon: r.icon, count }
}

export const NAV: { label: string; items: NavItem[] }[] = [
  { label: "Pilotage", items: [{ label: "Tableau de bord", href: "/gestion", icon: Dashboard }, mod("demandes", { collection: "demandes", status: "nouvelle" }), mod("clients")] },
  { label: "Mobilité", items: [mod("vehicules"), mod("locations"), mod("lavages")] },
  { label: "Transport & matériel", items: [mod("transports"), mod("equipements"), mod("locations-equipement", { collection: "locations_equipement", status: "demande" })] },
  { label: "Élevage", items: [mod("elevage"), mod("ventes-elevage")] },
  { label: "Finances", items: [mod("factures")] },
  { label: "Site web", items: [{ label: "Contenu du site", href: "/gestion/site", icon: Pencil }] },
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
