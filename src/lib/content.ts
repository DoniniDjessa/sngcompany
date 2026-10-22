// Site content: every text and image of the public site, editable in Gestion › Site web.
// Stored in the "sng-content" table as documents ("company", "home", "service:<slug>"),
// merged over the defaults below so the site always renders, even before anything is saved.
import { SERVICES, type ServiceContent, type ServiceSlug } from "./services"
import { SITE } from "./site"

export const CONTENT_TAG = "sng-content"

export interface CompanyContent {
  name: string
  tagline: string
  description: string
  phone: string
  phone2: string
  whatsapp: string
  email: string
  address: string
  hours: string
  carsSiteName: string
  carsSiteUrl: string
}

export interface HomeContent {
  hero: { eyebrow: string; title1: string; title2: string; text: string; image: string }
  stats: { value: string; label: string }[]
  about: { eyebrow: string; title: string; text: string; image: string; values: string[] }
  why: { title: string; items: { title: string; text: string }[] }
  steps: { eyebrow: string; title: string; items: { title: string; text: string }[] }
  cars: { eyebrow: string; title: string; text: string; image: string }
  contact: { eyebrow: string; title: string; text: string }
}

export const DEFAULT_COMPANY: CompanyContent = {
  name: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  phone: SITE.phone,
  phone2: SITE.phone2,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  address: SITE.address,
  hours: SITE.hours,
  carsSiteName: SITE.carsSiteName,
  carsSiteUrl: SITE.carsSiteUrl,
}

export const DEFAULT_HOME: HomeContent = {
  hero: {
    eyebrow: SITE.name,
    title1: "Un seul partenaire.",
    title2: "Pour tous vos besoins.",
    text: "Location de véhicules, transport, équipements, lavage et élevage — à Abidjan et partout en Côte d'Ivoire.",
    image: "/images/bg-car.webp",
  },
  stats: [
    { value: "5", label: "métiers complémentaires" },
    { value: "1 500+", label: "clients servis" },
    { value: "24/7", label: "assistance" },
    { value: "98%", label: "clients satisfaits" },
  ],
  about: {
    eyebrow: "Qui sommes-nous",
    title: "L'excellence au service de chaque mission.",
    text:
      "Née de la location de véhicules avec SNG Elite Cars, SNG Company a grandi avec ses clients : transport et logistique, location d'équipements, lavage de véhicules et élevage. Notre ambition : un service fiable, ponctuel et accessible pour chaque foyer et chaque entreprise ivoirienne.",
    image: "/images/mitsubishi.jpeg",
    values: ["Fiabilité", "Ponctualité", "Transparence", "Proximité"],
  },
  why: {
    title: "Pourquoi choisir SNG.",
    items: [
      { title: "Un seul interlocuteur", text: "Véhicule, déménagement, matériel ou commande de la ferme : un seul contact, une seule facture." },
      { title: "Fiabilité & sécurité", text: "Véhicules assurés, matériel vérifié, équipes formées et contrats clairs." },
      { title: "Réactivité", text: "Réponse sous 24h et interventions rapides partout dans le Grand Abidjan." },
      { title: "Tarifs justes", text: "Des prix transparents, des remises pour les entreprises et les contrats réguliers." },
    ],
  },
  steps: {
    eyebrow: "Comment ça marche",
    title: "Simple. Rapide. Sans surprise.",
    items: [
      { title: "Votre demande", text: "En ligne, par téléphone ou sur WhatsApp." },
      { title: "Réponse sous 24h", text: "Une offre claire, adaptée à votre besoin." },
      { title: "Intervention", text: "Nos équipes livrent, transportent ou interviennent." },
      { title: "Suivi", text: "Un conseiller reste votre contact jusqu'à la fin." },
    ],
  },
  cars: {
    eyebrow: "SNG Elite Cars",
    title: "Toute notre flotte de location, en ligne.",
    text: "Berlines, SUV, minibus et véhicules de prestige : consultez le catalogue, les disponibilités et réservez sur notre site dédié.",
    image: "/images/honda-accord-abidjan.png",
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet.",
    text: "Décrivez votre besoin, nous revenons vers vous sous 24h.",
  },
}

/** Text and image part of a service (what the editor can change) */
export function serviceDefaults(slug: ServiceSlug): ServiceContent {
  const s = SERVICES.find((x) => x.slug === slug)!
  const { name, tagline, short, intro, image, highlights, features, prestations, faqs, quoteHint } = s
  return { name, tagline, short, intro, image, highlights, features, prestations, faqs, quoteHint }
}

/** Saved values over defaults: objects are merged key by key, arrays and strings replaced */
export function mergeContent<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base
  if (Array.isArray(base)) return (Array.isArray(saved) ? saved : base) as T
  if (typeof base === "object" && base !== null) {
    if (typeof saved !== "object" || Array.isArray(saved)) return base
    const out = { ...(base as Record<string, unknown>) }
    for (const k of Object.keys(out)) out[k] = mergeContent(out[k], (saved as Record<string, unknown>)[k])
    return out as T
  }
  return (typeof saved === typeof base ? saved : base) as T
}

/** Usable image URL: static path as is, uploaded R2 key through the storage route */
export const imgSrc = (v: string | undefined) => (!v ? "" : v.startsWith("photos/") ? `/api/storage/file?key=${encodeURIComponent(v)}` : v)

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`

// ---------------------------------------------------------------------------
// Editor definitions (Gestion › Site web): which fields each document exposes
// ---------------------------------------------------------------------------
export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "image" | "tags"; hint?: string }
  | { key: string; label: string; type: "list"; fields: { key: string; label: string; type: "text" | "textarea" }[]; itemLabel: string }

export interface SectionDef {
  title: string
  description?: string
  /** key of the sub-object edited by this section (none = document root) */
  path?: string
  fields: FieldDef[]
}

export interface DocDef {
  key: string
  title: string
  description: string
  href: string
  sections: SectionDef[]
}

const titleText = [
  { key: "title", label: "Titre", type: "text" as const },
  { key: "text", label: "Texte", type: "textarea" as const },
]

export const HOME_DOC: DocDef = {
  key: "home",
  title: "Page d'accueil",
  description: "Hero, chiffres clés, à propos, engagements, étapes, bannière SNG Elite Cars et contact.",
  href: "/",
  sections: [
    {
      title: "Hero",
      description: "Le haut de la page : grand titre, texte et photo principale.",
      path: "hero",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title1", label: "Titre — ligne 1", type: "text" },
        { key: "title2", label: "Titre — ligne 2 (en gris)", type: "text" },
        { key: "text", label: "Texte d'introduction", type: "textarea" },
        { key: "image", label: "Photo principale", type: "image", hint: "Format paysage, 2000 px de large conseillé" },
      ],
    },
    {
      title: "Chiffres clés",
      fields: [{ key: "stats", label: "Chiffres", type: "list", itemLabel: "chiffre", fields: [{ key: "value", label: "Valeur (ex. 1 500+)", type: "text" }, { key: "label", label: "Libellé", type: "text" }] }],
    },
    {
      title: "Qui sommes-nous",
      path: "about",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "image", label: "Photo", type: "image" },
        { key: "values", label: "Valeurs", type: "tags", hint: "Une valeur par ligne" },
      ],
    },
    {
      title: "Pourquoi nous choisir",
      path: "why",
      fields: [
        { key: "title", label: "Titre de la section", type: "text" },
        { key: "items", label: "Engagements", type: "list", itemLabel: "engagement", fields: titleText },
      ],
    },
    {
      title: "Comment ça marche",
      path: "steps",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre de la section", type: "text" },
        { key: "items", label: "Étapes", type: "list", itemLabel: "étape", fields: titleText },
      ],
    },
    {
      title: "Bannière SNG Elite Cars",
      path: "cars",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "image", label: "Photo", type: "image" },
      ],
    },
    {
      title: "Bloc contact",
      path: "contact",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
      ],
    },
  ],
}

export const COMPANY_DOC: DocDef = {
  key: "company",
  title: "Entreprise & coordonnées",
  description: "Nom, accroche, téléphones, e-mail, adresse et horaires affichés sur tout le site.",
  href: "/contact",
  sections: [
    {
      title: "Identité",
      fields: [
        { key: "name", label: "Nom de l'entreprise", type: "text" },
        { key: "tagline", label: "Accroche", type: "text" },
        { key: "description", label: "Description (pied de page, référencement)", type: "textarea" },
      ],
    },
    {
      title: "Coordonnées",
      fields: [
        { key: "phone", label: "Téléphone principal", type: "text" },
        { key: "phone2", label: "Téléphone secondaire", type: "text" },
        { key: "whatsapp", label: "Numéro WhatsApp", type: "text", hint: "Chiffres uniquement, avec l'indicatif : 2250102926874" },
        { key: "email", label: "E-mail", type: "text" },
        { key: "address", label: "Adresse", type: "text" },
        { key: "hours", label: "Horaires", type: "text" },
      ],
    },
    {
      title: "Site SNG Elite Cars",
      fields: [
        { key: "carsSiteName", label: "Nom du site", type: "text" },
        { key: "carsSiteUrl", label: "Adresse (URL)", type: "text" },
      ],
    },
  ],
}

export function serviceDoc(slug: ServiceSlug): DocDef {
  const s = SERVICES.find((x) => x.slug === slug)!
  return {
    key: `service:${slug}`,
    title: s.name,
    description: s.short,
    href: `/services/${slug}`,
    sections: [
      {
        title: "Présentation",
        description: "Tuile de la page d'accueil et en-tête de la page de l'activité.",
        fields: [
          { key: "name", label: "Nom de l'activité", type: "text" },
          { key: "tagline", label: "Accroche", type: "text" },
          { key: "short", label: "Résumé (tuile d'accueil)", type: "textarea" },
          { key: "intro", label: "Introduction (page de l'activité)", type: "textarea" },
          { key: "image", label: "Photo", type: "image", hint: "Affichée en grand sur la tuile d'accueil" },
          { key: "highlights", label: "Points clés", type: "tags", hint: "Un point par ligne" },
        ],
      },
      { title: "Points forts", fields: [{ key: "features", label: "Points forts", type: "list", itemLabel: "point fort", fields: titleText }] },
      { title: "Prestations", fields: [{ key: "prestations", label: "Prestations proposées", type: "list", itemLabel: "prestation", fields: titleText }] },
      {
        title: "Questions fréquentes",
        fields: [{ key: "faqs", label: "Questions", type: "list", itemLabel: "question", fields: [{ key: "q", label: "Question", type: "text" }, { key: "a", label: "Réponse", type: "textarea" }] }],
      },
      { title: "Formulaire de contact", fields: [{ key: "quoteHint", label: "Exemple affiché dans le champ message", type: "text" }] },
    ],
  }
}

export function docDefaults(key: string): unknown {
  if (key === "home") return DEFAULT_HOME
  if (key === "company") return DEFAULT_COMPANY
  if (key.startsWith("service:")) return serviceDefaults(key.slice(8) as ServiceSlug)
  return {}
}

export function docDef(key: string): DocDef | undefined {
  if (key === "home") return HOME_DOC
  if (key === "company") return COMPANY_DOC
  const slug = key.startsWith("service:") ? key.slice(8) : ""
  return SERVICES.some((s) => s.slug === slug) ? serviceDoc(slug as ServiceSlug) : undefined
}
