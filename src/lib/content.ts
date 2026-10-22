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

export interface HeroSlide {
  image: string
  eyebrow: string
  title: string
  /** second line, lighter */
  subtitle: string
  text: string
  cta: string
  link: string
}

export interface HomeContent {
  hero: { slides: HeroSlide[] }
  /** key figures — not shown for now (new company), kept for later */
  stats: { value: string; label: string }[]
  about: { eyebrow: string; title: string; text: string; image: string; values: string[] }
  why: { title: string; items: { title: string; text: string }[] }
  steps: { eyebrow: string; title: string; items: { title: string; text: string }[] }
  cars: { eyebrow: string; title: string; text: string; image: string; gallery: { name: string; image: string }[] }
  contact: { eyebrow: string; title: string; text: string }
  commitments: { eyebrow: string; title: string; items: { value: string; label: string; text: string }[] }
  zones: { eyebrow: string; title: string; text: string; abidjan: string[]; interior: string[] }
  faq: { eyebrow: string; title: string; text: string; items: { q: string; a: string }[] }
  /** hidden while the list is empty */
  partners: { eyebrow: string; title: string; items: { name: string; logo: string }[] }
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
    slides: [
      {
        image: "/images/bg-car.webp",
        eyebrow: SITE.name,
        title: "Un seul partenaire.",
        subtitle: "Pour tous vos besoins.",
        text: "Location de véhicules, transport, équipements, lavage et élevage — à Abidjan et partout en Côte d'Ivoire.",
        cta: "Découvrir nos activités",
        link: "/#services",
      },
      {
        image: "/images/luxury-toyota-camry-abidjan.png",
        eyebrow: "Location de véhicules",
        title: "Roulez en toute sérénité.",
        subtitle: "Avec ou sans chauffeur.",
        text: "Berlines, SUV et minibus récents, à la journée ou au mois, pour vos déplacements et vos événements.",
        cta: "Voir l'offre",
        link: "/services/location-vehicules",
      },
      {
        image: "/images/van.jpeg",
        eyebrow: "Transport & Logistique",
        title: "Vos biens,",
        subtitle: "livrés à temps.",
        text: "Livraisons, déménagements et transport de marchandises, partout en Côte d'Ivoire.",
        cta: "Découvrir",
        link: "/services/transport-logistique",
      },
      {
        image: "/images/mercedes.jpeg",
        eyebrow: "Lavage de véhicules",
        title: "Votre véhicule",
        subtitle: "comme neuf.",
        text: "Lavage express, complet et soins premium, en station ou à domicile.",
        cta: "Découvrir",
        link: "/services/lavage-vehicules",
      },
    ],
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
    gallery: [
      { name: "Toyota Camry", image: "/images/luxury-toyota-camry-abidjan.png" },
      { name: "Toyota Hiace", image: "/images/van.jpeg" },
      { name: "Mercedes Classe C", image: "/images/mercedes.jpeg" },
      { name: "Mitsubishi Pajero", image: "/images/mitsubishi.jpeg" },
      { name: "Toyota Corolla", image: "/images/corolla.jpeg" },
      { name: "Ford Ranger", image: "/images/ford.jpeg" },
      { name: "Honda Accord", image: "/images/honda-accord-abidjan.png" },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet.",
    text: "Décrivez votre besoin, nous revenons vers vous sous 24h.",
  },
  commitments: {
    eyebrow: "Nos engagements",
    title: "Des promesses, tenues.",
    items: [
      { value: "24 h", label: "pour vous répondre", text: "Chaque demande reçoit une réponse sous 24 heures, jours ouvrés." },
      { value: "100 %", label: "du matériel vérifié", text: "Véhicules révisés et équipements contrôlés avant chaque sortie." },
      { value: "7j/7", label: "joignables", text: "Un numéro direct pendant toute votre location ou mission." },
      { value: "0", label: "frais cachés", text: "Un devis clair et détaillé, accepté avant toute intervention." },
    ],
  },
  zones: {
    eyebrow: "Zones desservies",
    title: "Partout à Abidjan. Et au-delà.",
    text: "Nos équipes interviennent dans toutes les communes du Grand Abidjan, et nos véhicules circulent vers les grandes villes de l'intérieur.",
    abidjan: ["Plateau", "Cocody", "Yopougon", "Abobo", "Adjamé", "Treichville", "Marcory", "Koumassi", "Port-Bouët", "Bingerville"],
    interior: ["Grand-Bassam", "Yamoussoukro", "Bouaké", "San-Pédro", "Daloa", "Korhogo"],
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Tout ce qu'il faut savoir.",
    text: "Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons sous 24h.",
    items: [
      { q: "Comment demander un service ?", a: "Par le formulaire du site, par téléphone ou sur WhatsApp. Un conseiller vous rappelle sous 24h avec une proposition claire." },
      { q: "Intervenez-vous en dehors d'Abidjan ?", a: "Oui. Nos véhicules et nos équipes se déplacent vers les grandes villes de l'intérieur ; un supplément de déplacement peut s'appliquer." },
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Espèces, Mobile Money (Orange, MTN, Moov, Wave) et virement bancaire. Les entreprises peuvent bénéficier d'une facturation mensuelle." },
      { q: "Peut-on combiner plusieurs services ?", a: "Bien sûr : un déménagement avec location de véhicule, un événement avec matériel et traiteur de la ferme… Vous avez un seul interlocuteur et une seule facture." },
      { q: "Proposez-vous des contrats pour les entreprises ?", a: "Oui : mise à disposition de véhicules, livraisons régulières, abonnements de lavage de flotte et approvisionnement de la ferme, avec des tarifs dédiés." },
      { q: "Que se passe-t-il en cas de problème pendant une location ?", a: "Appelez notre numéro direct : nous intervenons rapidement, remplaçons le véhicule ou le matériel si nécessaire." },
    ],
  },
  partners: {
    eyebrow: "Ils nous font confiance",
    title: "Nos partenaires.",
    items: [],
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
  | { key: string; label: string; type: "list"; fields: { key: string; label: string; type: "text" | "textarea" | "image" }[]; itemLabel: string }

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
      title: "Carrousel (haut de page)",
      description: "Une photo par diapositive, plein écran. Format paysage, 2400 px de large conseillé.",
      path: "hero",
      fields: [
        {
          key: "slides",
          label: "Diapositives",
          type: "list",
          itemLabel: "diapositive",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "eyebrow", label: "Sur-titre", type: "text" },
            { key: "link", label: "Lien du bouton (ex. /services/elevage)", type: "text" },
            { key: "title", label: "Titre", type: "text" },
            { key: "subtitle", label: "Seconde ligne (plus claire)", type: "text" },
            { key: "cta", label: "Texte du bouton", type: "text" },
            { key: "text", label: "Texte", type: "textarea" },
          ],
        },
      ],
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
      title: "Nos engagements",
      path: "commitments",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        {
          key: "items",
          label: "Engagements",
          type: "list",
          itemLabel: "engagement",
          fields: [
            { key: "value", label: "Valeur (ex. 24 h, 100 %)", type: "text" },
            { key: "label", label: "Libellé", type: "text" },
            { key: "text", label: "Détail", type: "textarea" },
          ],
        },
      ],
    },
    {
      title: "Zones desservies",
      description: "Les communes connues d'Abidjan sont placées sur la carte ; les autres apparaissent dans la liste.",
      path: "zones",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "abidjan", label: "Communes d'Abidjan", type: "tags", hint: "Une commune par ligne" },
        { key: "interior", label: "Villes de l'intérieur", type: "tags", hint: "Une ville par ligne" },
      ],
    },
    {
      title: "Partenaires",
      description: "La section n'apparaît que lorsqu'au moins un partenaire est ajouté. Logo PNG détouré conseillé.",
      path: "partners",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "items", label: "Partenaires", type: "list", itemLabel: "partenaire", fields: [{ key: "name", label: "Nom", type: "text" }, { key: "logo", label: "Logo", type: "image" }] },
      ],
    },
    {
      title: "Questions fréquentes",
      path: "faq",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "items", label: "Questions", type: "list", itemLabel: "question", fields: [{ key: "q", label: "Question", type: "text" }, { key: "a", label: "Réponse", type: "textarea" }] },
      ],
    },
    {
      title: "Bannière SNG Elite Cars",
      path: "cars",
      fields: [
        { key: "eyebrow", label: "Sur-titre", type: "text" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "image", label: "Photo principale (fenêtre du site)", type: "image" },
        { key: "gallery", label: "Galerie de la flotte (bande défilante)", type: "list", itemLabel: "véhicule", fields: [{ key: "name", label: "Nom du véhicule", type: "text" }, { key: "image", label: "Photo", type: "image" }] },
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
