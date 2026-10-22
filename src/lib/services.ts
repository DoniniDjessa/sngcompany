import type { Icon } from "@/components/icons"
import { Car, Droplets, Sprout, Truck, Wrench } from "@/components/icons"

// The company's activities. Slug, icon and tone are fixed (routes, backoffice modules);
// every text and image below is the DEFAULT content, overridden from Gestion › Site web (table "sng-content").

export type ServiceSlug = "location-vehicules" | "transport-logistique" | "location-equipements" | "lavage-vehicules" | "elevage"

export interface ServiceContent {
  name: string
  tagline: string
  short: string
  intro: string
  /** "/images/…" (static) or "photos/…" (uploaded to R2); empty = illustrated fallback */
  image: string
  highlights: string[]
  features: { title: string; text: string }[]
  prestations: { title: string; text: string }[]
  faqs: { q: string; a: string }[]
  quoteHint: string
}

export interface Service extends ServiceContent {
  slug: ServiceSlug
  icon: Icon
  tone: "green" | "blue" | "orange" | "rose" | "violet"
}

export const SERVICES: Service[] = [
  {
    slug: "location-vehicules",
    icon: Car,
    tone: "green",
    name: "Location de véhicules",
    tagline: "Roulez en toute sérénité",
    short: "Berlines, SUV et minibus, avec ou sans chauffeur, à la journée ou au mois.",
    image: "/images/luxury-toyota-camry-abidjan.png",
    intro:
      "Une flotte récente et entretenue pour vos déplacements personnels, professionnels et vos événements : berlines confortables, SUV robustes et minibus pour les groupes. Avec chauffeur expérimenté ou en libre conduite.",
    highlights: ["Avec ou sans chauffeur", "Courte & longue durée", "Mariages & événements", "Livraison du véhicule"],
    features: [
      { title: "Flotte entretenue", text: "Véhicules récents, révisés et nettoyés avant chaque location." },
      { title: "Chauffeurs professionnels", text: "Chauffeurs ponctuels, discrets et connaissant parfaitement Abidjan." },
      { title: "Assurance incluse", text: "Tous nos véhicules sont assurés, assistance 24h/24 en cas de besoin." },
      { title: "Tarifs entreprises", text: "Contrats mensuels et mise à disposition pour vos équipes." },
    ],
    prestations: [
      { title: "Location courte durée", text: "À la journée ou au week-end, pour vos rendez-vous, voyages et visites." },
      { title: "Véhicule avec chauffeur", text: "Un chauffeur expérimenté à votre disposition, en ville comme à l'intérieur du pays." },
      { title: "Mariages & événements", text: "Berlines et SUV de prestige, décorés si besoin, pour vos grands jours." },
      { title: "Mise à disposition entreprise", text: "Véhicules au mois pour vos équipes, missions et délégations." },
    ],
    faqs: [
      { q: "Quels documents faut-il pour louer ?", a: "Une pièce d'identité valide, un permis de conduire de plus de 2 ans (sans chauffeur) et une caution remboursable." },
      { q: "Peut-on louer pour sortir d'Abidjan ?", a: "Oui, les déplacements à l'intérieur du pays sont possibles ; un supplément peut s'appliquer selon la destination." },
      { q: "Le carburant est-il inclus ?", a: "Le véhicule est remis avec le plein et doit être rendu avec le même niveau. Pour les locations avec chauffeur, nous proposons une formule tout compris." },
    ],
    quoteHint: "Type de véhicule, dates de début et de fin, avec ou sans chauffeur…",
  },
  {
    slug: "transport-logistique",
    icon: Truck,
    tone: "blue",
    name: "Transport & Logistique",
    tagline: "Vos biens, livrés à temps",
    short: "Livraisons, déménagements et transport de marchandises, partout en Côte d'Ivoire.",
    image: "/images/van.jpeg",
    intro:
      "Du colis urgent au déménagement complet, nous prenons en charge l'enlèvement, la manutention, le transport et la livraison de vos biens avec des équipes formées et des véhicules adaptés.",
    highlights: ["Livraisons express", "Déménagements", "Transport de marchandises", "Emballage & manutention"],
    features: [
      { title: "Équipes formées", text: "Manutentionnaires soigneux, habitués aux objets fragiles et volumineux." },
      { title: "Véhicules adaptés", text: "Motos, fourgons et camions selon le volume à transporter." },
      { title: "Suivi des missions", text: "Un interlocuteur unique et des points d'étape à chaque mission." },
      { title: "Partout en Côte d'Ivoire", text: "Dans le Grand Abidjan comme vers l'intérieur du pays." },
    ],
    prestations: [
      { title: "Livraisons", text: "Colis, plis et courses B2B, livrés le jour même ou en tournées programmées." },
      { title: "Déménagements", text: "Particuliers et bureaux : emballage, démontage, transport et réinstallation." },
      { title: "Transport de marchandises", text: "Fret par camionnette ou camion vers toutes les villes du pays." },
      { title: "Contrats réguliers", text: "Tournées planifiées et facturation mensuelle pour les entreprises." },
    ],
    faqs: [
      { q: "Combien de temps à l'avance réserver un déménagement ?", a: "Idéalement une semaine, mais nous pouvons intervenir en 48h selon les disponibilités." },
      { q: "Mes biens sont-ils assurés pendant le transport ?", a: "Oui, une couverture de base est incluse ; une assurance renforcée est proposée pour les objets de valeur." },
      { q: "Livrez-vous les entreprises de façon régulière ?", a: "Oui, nous établissons des contrats de livraison avec tournées planifiées et facturation mensuelle." },
    ],
    quoteHint: "Type (livraison, déménagement, fret), adresse de départ et d'arrivée, volume, date…",
  },
  {
    slug: "location-equipements",
    icon: Wrench,
    tone: "orange",
    name: "Location d'équipements",
    tagline: "Le bon matériel, au bon moment",
    short: "Groupes électrogènes, matériel BTP et équipements événementiels, à commander en ligne.",
    image: "",
    intro:
      "Chantiers, événements ou besoins ponctuels : choisissez votre matériel dans notre catalogue, vérifiez sa disponibilité et commandez en ligne. Matériel vérifié avant chaque sortie, livré et récupéré sur site.",
    highlights: ["Groupes électrogènes", "Matériel BTP", "Chapiteaux & mobilier", "Livraison sur site"],
    features: [
      { title: "Énergie", text: "Groupes électrogènes de 5 à 100 kVA, avec ou sans technicien." },
      { title: "BTP", text: "Bétonnières, échafaudages, compacteurs, marteaux-piqueurs." },
      { title: "Événementiel", text: "Chapiteaux, bâches, chaises, tables et sonorisation." },
      { title: "Maintenance", text: "Matériel contrôlé, dépannage rapide pendant la location." },
    ],
    prestations: [
      { title: "Livraison & reprise", text: "Nous livrons le matériel sur votre site et le récupérons en fin de location." },
      { title: "Montage", text: "Installation des chapiteaux, échafaudages et équipements événementiels." },
      { title: "Technicien", text: "Un technicien pour la mise en service et le suivi des groupes électrogènes." },
    ],
    faqs: [
      { q: "Comment se passe une commande en ligne ?", a: "Choisissez le matériel, la quantité et les dates : nous vous rappelons pour confirmer la disponibilité, la livraison et le paiement." },
      { q: "Une caution est-elle demandée ?", a: "Oui, une caution remboursable est demandée selon la valeur du matériel." },
    ],
    quoteHint: "Matériel souhaité, quantité, dates, lieu d'utilisation…",
  },
  {
    slug: "lavage-vehicules",
    icon: Droplets,
    tone: "rose",
    name: "Lavage de véhicules",
    tagline: "Votre véhicule comme neuf",
    short: "Lavage express, complet et premium, en station ou à domicile.",
    image: "/images/mercedes.jpeg",
    intro:
      "Nos laveurs prennent soin de votre véhicule, de l'extérieur à l'habitacle, avec des produits adaptés. En station, à domicile ou au bureau, et en abonnement pour les flottes d'entreprise.",
    highlights: ["Express 20 min", "Intérieur & extérieur", "Lustrage & polish", "À domicile"],
    features: [
      { title: "Produits adaptés", text: "Shampoings, cires et traitements respectueux de la peinture et des plastiques." },
      { title: "À domicile", text: "Nous venons avec notre eau et nos produits, chez vous ou au bureau." },
      { title: "Tous véhicules", text: "Berlines, SUV, minibus, camions et motos." },
      { title: "Flottes", text: "Abonnements mensuels pour entreprises et taxis." },
    ],
    prestations: [
      { title: "Lavage express", text: "Carrosserie, jantes et vitres, en une vingtaine de minutes." },
      { title: "Lavage complet", text: "Intérieur et extérieur : aspiration, sièges, tapis et tableau de bord." },
      { title: "Soins premium", text: "Lustrage, polish, nettoyage moteur, traitement du cuir et des plastiques." },
      { title: "Abonnements", text: "Plusieurs lavages par mois pour les particuliers et les flottes." },
    ],
    faqs: [
      { q: "Vous déplacez-vous à domicile ?", a: "Oui, avec notre propre eau et nos produits ; un supplément de déplacement s'applique." },
      { q: "Proposez-vous des abonnements ?", a: "Oui : plusieurs lavages par mois à tarif réduit, pour particuliers et flottes." },
    ],
    quoteHint: "Type de véhicule, prestation souhaitée, lieu (station ou domicile), date…",
  },
  {
    slug: "elevage",
    icon: Sprout,
    tone: "violet",
    name: "Élevage",
    tagline: "Le meilleur de notre ferme",
    short: "Volailles, œufs, porcs et caprins issus de notre ferme, au détail et en gros.",
    image: "",
    intro:
      "Notre ferme élève volailles, porcs et petits ruminants dans le respect des normes sanitaires. Nous fournissons particuliers, restaurants, hôtels et revendeurs, avec livraison.",
    highlights: ["Poulets de chair", "Œufs frais", "Porcs & caprins", "Commandes en gros"],
    features: [
      { title: "Suivi vétérinaire", text: "Animaux nourris et soignés selon les normes sanitaires." },
      { title: "Fraîcheur", text: "Œufs et volailles livrés au plus près de la récolte." },
      { title: "Volumes", text: "Du particulier au restaurant, en passant par les revendeurs." },
      { title: "Livraison", text: "Livraison dans tout Abidjan, régulière ou ponctuelle." },
    ],
    prestations: [
      { title: "Volailles", text: "Poulets de chair et poulets bicyclette, vivants ou prêts à cuire." },
      { title: "Œufs frais", text: "Plateaux de 30 œufs, livrés chaque semaine." },
      { title: "Porcs & caprins", text: "Animaux sains, pour vos repas, fêtes et cérémonies." },
      { title: "Fournitures pro", text: "Approvisionnement régulier des restaurants, hôtels et maquis." },
    ],
    faqs: [
      { q: "Livrez-vous les commandes ?", a: "Oui, dans tout Abidjan ; la livraison est offerte à partir d'un certain volume." },
      { q: "Peut-on commander en gros ?", a: "Oui, nous fournissons restaurants, hôtels, maquis et revendeurs avec des tarifs dégressifs." },
    ],
    quoteHint: "Produit, quantité, date et lieu de livraison…",
  },
]

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug)
export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)
export const SERVICE_NAMES = Object.fromEntries(SERVICES.map((s) => [s.slug, s.name])) as Record<ServiceSlug, string>
