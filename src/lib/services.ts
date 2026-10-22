import type { Icon } from "@/components/icons"
import { Car, Droplets, Sprout, Truck, Wrench } from "@/components/icons"

// The company's activities: one entry = one page /services/[slug], one quote type and one backoffice module.
// Prices are indicative ("à partir de") and must be validated by SNG before going live.

export type ServiceSlug = "location-vehicules" | "transport-logistique" | "location-equipements" | "lavage-vehicules" | "elevage"

export interface Service {
  slug: ServiceSlug
  name: string
  short: string
  tagline: string
  icon: Icon
  tone: "green" | "blue" | "orange" | "rose" | "violet"
  image?: string
  intro: string
  highlights: string[]
  features: { title: string; desc: string }[]
  offers: { name: string; price: string; unit: string; items: string[]; featured?: boolean }[]
  faqs: { q: string; a: string }[]
  /** Fields asked in the quote form, on top of name / phone / email */
  quoteHint: string
}

export const SERVICES: Service[] = [
  {
    slug: "location-vehicules",
    name: "Location de véhicules",
    short: "Berlines, SUV et minibus, avec ou sans chauffeur, à la journée ou au mois.",
    tagline: "Roulez en toute sérénité",
    icon: Car,
    tone: "green",
    image: "/images/luxury-toyota-camry-abidjan.png",
    intro:
      "Une flotte récente et entretenue pour vos déplacements personnels, professionnels et vos événements : berlines confortables, SUV robustes et minibus pour les groupes. Avec chauffeur expérimenté ou en libre conduite.",
    highlights: ["Avec ou sans chauffeur", "Courte & longue durée", "Mariages & événements", "Livraison du véhicule"],
    features: [
      { title: "Flotte entretenue", desc: "Véhicules récents, révisés et nettoyés avant chaque location." },
      { title: "Chauffeurs professionnels", desc: "Chauffeurs ponctuels, discrets et connaissant parfaitement Abidjan." },
      { title: "Assurance incluse", desc: "Tous nos véhicules sont assurés, assistance 24h/24 en cas de besoin." },
      { title: "Tarifs entreprises", desc: "Contrats mensuels et mise à disposition pour vos équipes." },
    ],
    offers: [
      { name: "Berline", price: "25 000", unit: "FCFA / jour", items: ["Toyota Corolla, Suzuki Dzire", "Climatisation", "Idéal en ville"] },
      { name: "SUV & 4x4", price: "45 000", unit: "FCFA / jour", items: ["Hyundai Tucson, Mitsubishi", "Confort & sécurité", "Routes de l'intérieur"], featured: true },
      { name: "Minibus", price: "70 000", unit: "FCFA / jour", items: ["Toyota Hiace 15 places", "Avec chauffeur", "Groupes & séminaires"] },
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
    name: "Transport & Logistique",
    short: "Livraisons, déménagements et transport de marchandises, partout en Côte d'Ivoire.",
    tagline: "Vos biens, livrés à temps",
    icon: Truck,
    tone: "blue",
    image: "/images/van.jpeg",
    intro:
      "Du colis urgent au déménagement complet, nous prenons en charge l'enlèvement, la manutention, le transport et la livraison de vos biens avec des équipes formées et des véhicules adaptés.",
    highlights: ["Livraisons express", "Déménagements", "Transport de marchandises", "Emballage & manutention"],
    features: [
      { title: "Livraisons", desc: "Colis, courses B2B et livraisons programmées dans tout le Grand Abidjan." },
      { title: "Déménagements", desc: "Particuliers et bureaux : emballage, démontage, transport et réinstallation." },
      { title: "Fret & marchandises", desc: "Camionnettes et camions pour vos marchandises vers l'intérieur du pays." },
      { title: "Suivi en temps réel", desc: "Un interlocuteur unique et des points d'étape à chaque mission." },
    ],
    offers: [
      { name: "Livraison", price: "3 000", unit: "FCFA / course", items: ["Colis & plis", "Dans Abidjan", "Livraison le jour même"] },
      { name: "Déménagement", price: "80 000", unit: "FCFA / mission", items: ["Équipe + camion", "Emballage inclus", "Studio à villa"], featured: true },
      { name: "Fret", price: "Sur devis", unit: "selon volume", items: ["Camion 3,5 à 10 t", "Intérieur du pays", "Contrats réguliers"] },
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
    name: "Location d'équipements",
    short: "Groupes électrogènes, matériel BTP et équipements événementiels.",
    tagline: "Le bon matériel, au bon moment",
    icon: Wrench,
    tone: "orange",
    intro:
      "Chantiers, événements ou besoins ponctuels : louez un matériel fiable, vérifié avant chaque sortie, livré et récupéré sur site par nos équipes.",
    highlights: ["Groupes électrogènes", "Matériel BTP", "Chapiteaux & mobilier", "Livraison sur site"],
    features: [
      { title: "Énergie", desc: "Groupes électrogènes de 5 à 100 kVA, avec ou sans technicien." },
      { title: "BTP", desc: "Bétonnières, échafaudages, compacteurs, marteaux-piqueurs." },
      { title: "Événementiel", desc: "Chapiteaux, bâches, chaises, tables et sonorisation." },
      { title: "Maintenance", desc: "Matériel contrôlé, dépannage rapide pendant la location." },
    ],
    offers: [
      { name: "Événementiel", price: "500", unit: "FCFA / chaise / jour", items: ["Chaises, tables, bâches", "Chapiteaux 50 à 500 places", "Montage inclus"] },
      { name: "Énergie", price: "35 000", unit: "FCFA / jour", items: ["Groupes 5 à 100 kVA", "Carburant en option", "Technicien disponible"], featured: true },
      { name: "BTP", price: "15 000", unit: "FCFA / jour", items: ["Bétonnière, échafaudage", "Compacteur", "Location à la semaine"] },
    ],
    faqs: [
      { q: "Livrez-vous le matériel ?", a: "Oui, la livraison et la reprise sont assurées sur Abidjan et environs ; le tarif dépend de la distance." },
      { q: "Une caution est-elle demandée ?", a: "Oui, une caution remboursable est demandée selon la valeur du matériel." },
    ],
    quoteHint: "Matériel souhaité, quantité, dates, lieu d'utilisation…",
  },
  {
    slug: "lavage-vehicules",
    name: "Lavage de véhicules",
    short: "Lavage express, complet et premium, en station ou à domicile.",
    tagline: "Votre véhicule comme neuf",
    icon: Droplets,
    tone: "rose",
    image: "/images/mercedes.jpeg",
    intro:
      "Nos laveurs prennent soin de votre véhicule, de l'extérieur à l'habitacle, avec des produits adaptés. En station, à domicile ou au bureau, et en abonnement pour les flottes d'entreprise.",
    highlights: ["Express 20 min", "Intérieur & extérieur", "Lustrage & polish", "À domicile"],
    features: [
      { title: "Lavage express", desc: "Carrosserie, jantes et vitres en 20 minutes." },
      { title: "Nettoyage intérieur", desc: "Aspiration, sièges, tapis, tableau de bord et désodorisation." },
      { title: "Soins premium", desc: "Lustrage, polish, traitement des plastiques et du cuir." },
      { title: "Flottes", desc: "Abonnements mensuels pour entreprises et taxis." },
    ],
    offers: [
      { name: "Express", price: "3 000", unit: "FCFA", items: ["Extérieur complet", "Jantes & vitres", "≈ 20 minutes"] },
      { name: "Complet", price: "7 000", unit: "FCFA", items: ["Intérieur + extérieur", "Aspiration & tapis", "≈ 1 heure"], featured: true },
      { name: "Premium", price: "20 000", unit: "FCFA", items: ["Complet + lustrage", "Moteur & plastiques", "≈ 3 heures"] },
    ],
    faqs: [
      { q: "Vous déplacez-vous à domicile ?", a: "Oui, avec notre propre eau et nos produits ; un supplément de déplacement s'applique." },
      { q: "Proposez-vous des abonnements ?", a: "Oui : 4 lavages par mois à tarif réduit, pour particuliers et flottes." },
    ],
    quoteHint: "Type de véhicule, formule, lieu (station ou domicile), date souhaitée…",
  },
  {
    slug: "elevage",
    name: "Élevage",
    short: "Volailles, œufs, porcs et caprins issus de notre ferme, au détail et en gros.",
    tagline: "Le meilleur de notre ferme",
    icon: Sprout,
    tone: "violet",
    intro:
      "Notre ferme élève volailles, porcs et petits ruminants dans le respect des normes sanitaires. Nous fournissons particuliers, restaurants, hôtels et revendeurs, avec livraison.",
    highlights: ["Poulets de chair", "Œufs frais", "Porcs & caprins", "Commandes en gros"],
    features: [
      { title: "Volailles", desc: "Poulets de chair et poulets bicyclette, vivants ou prêts à cuire." },
      { title: "Œufs frais", desc: "Plateaux de 30 œufs livrés chaque semaine." },
      { title: "Porcs & caprins", desc: "Animaux sains, suivis par un vétérinaire." },
      { title: "Fêtes & événements", desc: "Commandes spéciales pour Tabaski, Noël et cérémonies." },
    ],
    offers: [
      { name: "Œufs frais", price: "2 500", unit: "FCFA / plateau", items: ["Plateau de 30", "Livraison hebdomadaire", "Remise en gros"] },
      { name: "Poulet de chair", price: "4 000", unit: "FCFA / pièce", items: ["≈ 2 kg", "Vivant ou prêt à cuire", "Restaurants & hôtels"], featured: true },
      { name: "Porcs & caprins", price: "Sur devis", unit: "selon poids", items: ["Suivi vétérinaire", "Fêtes & cérémonies", "Livraison possible"] },
    ],
    faqs: [
      { q: "Livrez-vous les commandes ?", a: "Oui, dans tout Abidjan ; la livraison est offerte à partir d'un certain volume." },
      { q: "Peut-on commander en gros ?", a: "Oui, nous fournissons restaurants, hôtels, maquis et revendeurs avec des tarifs dégressifs." },
    ],
    quoteHint: "Produit, quantité, date et lieu de livraison…",
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)
export const SERVICE_NAMES = Object.fromEntries(SERVICES.map((s) => [s.slug, s.name])) as Record<ServiceSlug, string>
