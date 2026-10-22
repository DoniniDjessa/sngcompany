"use client"
import type { Icon } from "@/components/icons"
import { Box, Car, Droplets, FileText, Inbox, Key, Sprout, Truck, Users, Wallet, Wrench } from "@/components/icons"
import { SERVICES, SERVICE_NAMES } from "@/lib/services"
import { photoUrl } from "@/lib/gestion/files"
import { formatXOF } from "@/lib/site"
import type { CollectionName, Row } from "@/lib/store"

// Backoffice modules described as data: list columns, filters, form fields and KPIs.
// app/gestion/(app)/[resource]/page.tsx renders any of them with <ResourcePage />.

export type Tone = "success" | "warning" | "danger" | "info" | "primary" | "navy" | "neutral"
export interface Option { value: string; label: string; tone?: Tone }

export interface Field {
  key: string
  label: string
  type?: "text" | "number" | "money" | "date" | "time" | "select" | "textarea" | "tel" | "email" | "lookup" | "photos" | "documents"
  options?: Option[]
  /** suggestions from another table (client name, vehicle…) */
  lookup?: { collection: CollectionName; label: (r: Row) => string }
  required?: boolean
  full?: boolean
  placeholder?: string
  section?: string
  suffix?: string
}

export interface Column {
  key: string
  label?: string
  /** second line under the value (key of another field) */
  sub?: string
  render?: (r: Row) => React.ReactNode
  className?: "num" | "wrap"
  hideSm?: boolean
}

export interface Kpi { label: string; value: string; note?: string; tone: Tone; icon: Icon }

export interface Resource {
  slug: string
  collection: CollectionName
  title: string
  singular: string
  /** "Nouvelle demande" rather than "Nouveau …" */
  feminine?: boolean
  description: string
  icon: Icon
  refPrefix?: string
  searchKeys: string[]
  statusKey?: string
  statuses?: Option[]
  filters?: { key: string; label: string; options: Option[] }[]
  columns: Column[]
  fields: Field[]
  defaults?: Record<string, unknown>
  /** derived values recomputed on save (amount = quantity × price…) */
  compute?: (v: Record<string, unknown>) => Record<string, unknown>
  kpis?: (rows: Row[]) => Kpi[]
}

const opts = (list: [string, string, Tone?][]): Option[] => list.map(([value, label, tone]) => ({ value, label, tone }))
const num = (v: unknown) => Number(v) || 0
const sum = (rows: Row[], key: string) => rows.reduce((t, r) => t + num(r[key]), 0)
const count = (rows: Row[], key: string, ...values: string[]) => rows.filter((r) => values.includes(String(r[key]))).length
const today = () => new Date().toISOString().slice(0, 10)

/** First photo of the row next to the cell content */
function Thumbed({ row, children }: { row: Row; children: React.ReactNode }) {
  const first = Array.isArray(row.photos) ? (row.photos[0] as string | undefined) : undefined
  return (
    <span className="cell-with-thumb">
      {/* eslint-disable-next-line @next/next/no-img-element -- signed R2 redirect */}
      {first ? <img className="cell-thumb" src={photoUrl(first)} alt="" loading="lazy" /> : null}
      <span>{children}</span>
    </span>
  )
}

const clientLookup = { collection: "clients" as const, label: (r: Row) => String(r.name) }
export const SERVICE_OPTIONS: Option[] = SERVICES.map((s) => ({ value: s.slug, label: s.name }))

// ---------- shared option lists ----------
const RENTAL_STATUS = opts([["reservee", "Réservée", "info"], ["en_cours", "En cours", "primary"], ["terminee", "Terminée", "neutral"], ["annulee", "Annulée", "danger"]])
const ASSET_STATUS = opts([["disponible", "Disponible", "success"], ["loue", "Loué", "info"], ["maintenance", "Maintenance", "warning"], ["hors_service", "Hors service", "danger"]])

export const RESOURCES: Resource[] = [
  {
    slug: "demandes",
    collection: "demandes",
    title: "Demandes",
    singular: "demande",
    feminine: true,
    description: "Demandes de devis reçues depuis le site et par téléphone, toutes activités confondues.",
    icon: Inbox,
    refPrefix: "DEM-",
    searchKeys: ["ref", "name", "phone", "email", "details"],
    statusKey: "status",
    statuses: opts([["nouvelle", "Nouvelle", "info"], ["en_cours", "En traitement", "warning"], ["devis_envoye", "Devis envoyé", "navy"], ["gagnee", "Gagnée", "success"], ["perdue", "Perdue", "neutral"]]),
    filters: [{ key: "service", label: "Toutes les activités", options: SERVICE_OPTIONS }],
    columns: [
      { key: "ref" },
      { key: "name", sub: "phone" },
      { key: "service" },
      { key: "details", className: "wrap", hideSm: true },
      { key: "wished_date", hideSm: true },
      { key: "date", label: "Reçue le" },
      { key: "status" },
    ],
    fields: [
      { key: "service", label: "Activité", type: "select", options: SERVICE_OPTIONS, required: true, section: "Demande" },
      { key: "status", label: "Statut", type: "select", section: "Demande" },
      { key: "wished_date", label: "Date souhaitée", type: "date", section: "Demande" },
      { key: "date", label: "Reçue le", type: "date", section: "Demande" },
      { key: "details", label: "Besoin exprimé", type: "textarea", full: true, required: true, section: "Demande" },
      { key: "name", label: "Nom / Société", required: true, section: "Contact" },
      { key: "phone", label: "Téléphone", type: "tel", required: true, section: "Contact" },
      { key: "email", label: "E-mail", type: "email", full: true, section: "Contact" },
      { key: "notes", label: "Notes internes", type: "textarea", full: true, section: "Suivi" },
    ],
    defaults: { status: "nouvelle", date: today },
    kpis: (rows) => [
      { label: "Nouvelles", value: String(count(rows, "status", "nouvelle")), note: "à traiter", tone: "info", icon: Inbox },
      { label: "En cours", value: String(count(rows, "status", "en_cours", "devis_envoye")), note: "traitement ou devis envoyé", tone: "warning", icon: FileText },
      { label: "Gagnées", value: String(count(rows, "status", "gagnee")), tone: "success", icon: Users },
      {
        label: "Taux de conversion",
        value: `${Math.round((count(rows, "status", "gagnee") / Math.max(1, count(rows, "status", "gagnee", "perdue"))) * 100)} %`,
        note: "gagnées / clôturées",
        tone: "primary",
        icon: Wallet,
      },
    ],
  },
  {
    slug: "clients",
    collection: "clients",
    title: "Clients",
    singular: "client",
    description: "Particuliers et entreprises, communs à toutes les activités.",
    icon: Users,
    searchKeys: ["name", "phone", "email", "city"],
    statusKey: "type",
    statuses: opts([["particulier", "Particulier", "info"], ["entreprise", "Entreprise", "navy"]]),
    columns: [{ key: "name", sub: "email" }, { key: "type" }, { key: "phone" }, { key: "city" }, { key: "created_at", label: "Client depuis", hideSm: true }],
    fields: [
      { key: "name", label: "Nom / Raison sociale", required: true, full: true, section: "Identité" },
      { key: "type", label: "Type", type: "select", section: "Identité" },
      { key: "city", label: "Commune / Ville", placeholder: "Cocody, Plateau…", section: "Identité" },
      { key: "phone", label: "Téléphone", type: "tel", required: true, section: "Coordonnées" },
      { key: "email", label: "E-mail", type: "email", section: "Coordonnées" },
      { key: "address", label: "Adresse", full: true, section: "Coordonnées" },
      { key: "notes", label: "Notes", type: "textarea", full: true, section: "Coordonnées" },
    ],
    defaults: { type: "particulier" },
    kpis: (rows) => [
      { label: "Clients", value: String(rows.length), tone: "primary", icon: Users },
      { label: "Entreprises", value: String(count(rows, "type", "entreprise")), tone: "navy", icon: Box },
      { label: "Particuliers", value: String(count(rows, "type", "particulier")), tone: "info", icon: Users },
    ],
  },
  {
    slug: "vehicules",
    collection: "vehicules",
    title: "Flotte véhicules",
    singular: "véhicule",
    description: "Le parc de location : disponibilité, tarifs et kilométrage.",
    icon: Car,
    searchKeys: ["plate", "brand", "model"],
    statusKey: "status",
    statuses: ASSET_STATUS,
    filters: [{ key: "category", label: "Toutes catégories", options: opts([["berline", "Berline"], ["suv", "SUV / 4x4"], ["minibus", "Minibus"], ["pickup", "Pick-up"], ["prestige", "Prestige"]]) }],
    columns: [
      { key: "brand", label: "Véhicule", render: (r) => <Thumbed row={r}><span className="cell-main">{String(r.brand)} {String(r.model)}</span><span className="cell-sub">{String(r.year ?? "")} · {String(r.gearbox ?? "")}</span></Thumbed> },
      { key: "plate" },
      { key: "category" },
      { key: "seats", className: "num", hideSm: true },
      { key: "mileage", className: "num", hideSm: true, render: (r) => `${num(r.mileage).toLocaleString("fr-FR")} km` },
      { key: "price_day", className: "num" },
      { key: "status" },
    ],
    fields: [
      { key: "brand", label: "Marque", required: true, section: "Véhicule" },
      { key: "model", label: "Modèle", required: true, section: "Véhicule" },
      { key: "plate", label: "Immatriculation", required: true, placeholder: "AB-1234-CI", section: "Véhicule" },
      { key: "year", label: "Année", type: "number", section: "Véhicule" },
      { key: "category", label: "Catégorie", type: "select", section: "Véhicule" },
      { key: "gearbox", label: "Boîte", type: "select", options: opts([["automatique", "Automatique"], ["manuelle", "Manuelle"]]), section: "Véhicule" },
      { key: "seats", label: "Places", type: "number", section: "Véhicule" },
      { key: "mileage", label: "Kilométrage", type: "number", suffix: "KM", section: "Exploitation" },
      { key: "price_day", label: "Tarif journalier", type: "money", required: true, section: "Exploitation" },
      { key: "status", label: "Statut", type: "select", section: "Exploitation" },
      { key: "insurance_end", label: "Fin d'assurance", type: "date", section: "Exploitation" },
      { key: "next_service", label: "Prochaine vidange", type: "date", section: "Exploitation" },
      { key: "photos", label: "Photos du véhicule", type: "photos", full: true, section: "Photos" },
    ],
    defaults: { status: "disponible", category: "berline", gearbox: "automatique", seats: 5 },
    kpis: (rows) => [
      { label: "Véhicules", value: String(rows.length), tone: "primary", icon: Car },
      { label: "Disponibles", value: String(count(rows, "status", "disponible")), tone: "success", icon: Key },
      { label: "En location", value: String(count(rows, "status", "loue")), note: `${Math.round((count(rows, "status", "loue") / Math.max(1, rows.length)) * 100)} % d'occupation`, tone: "info", icon: Truck },
      { label: "Maintenance", value: String(count(rows, "status", "maintenance", "hors_service")), tone: "warning", icon: Wrench },
    ],
  },
  {
    slug: "locations",
    collection: "locations",
    title: "Locations véhicules",
    singular: "location",
    feminine: true,
    description: "Contrats de location de véhicules, avec ou sans chauffeur.",
    icon: Key,
    refPrefix: "LOC-",
    searchKeys: ["ref", "client", "vehicle"],
    statusKey: "status",
    statuses: RENTAL_STATUS,
    columns: [{ key: "ref" }, { key: "client" }, { key: "vehicle" }, { key: "debut" }, { key: "fin" }, { key: "driver", hideSm: true }, { key: "amount", className: "num" }, { key: "status" }],
    fields: [
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Contrat" },
      { key: "vehicle", label: "Véhicule", type: "lookup", lookup: { collection: "vehicules", label: (r) => `${r.brand} ${r.model} · ${r.plate}` }, required: true, full: true, section: "Contrat" },
      { key: "debut", label: "Début", type: "date", required: true, section: "Contrat" },
      { key: "fin", label: "Fin", type: "date", required: true, section: "Contrat" },
      { key: "driver", label: "Chauffeur", type: "select", options: opts([["non", "Sans chauffeur"], ["oui", "Avec chauffeur"]]), section: "Contrat" },
      { key: "status", label: "Statut", type: "select", section: "Contrat" },
      { key: "amount", label: "Montant", type: "money", required: true, section: "Paiement" },
      { key: "deposit", label: "Caution", type: "money", section: "Paiement" },
      { key: "notes", label: "Notes (état des lieux, carburant…)", type: "textarea", full: true, section: "Paiement" },
      { key: "documents", label: "Contrat, permis, pièce d'identité", type: "documents", full: true, section: "Documents" },
    ],
    defaults: { status: "reservee", driver: "non", debut: today },
    kpis: (rows) => [
      { label: "En cours", value: String(count(rows, "status", "en_cours")), tone: "primary", icon: Key },
      { label: "Réservées", value: String(count(rows, "status", "reservee")), tone: "info", icon: FileText },
      { label: "Chiffre d'affaires", value: formatXOF(sum(rows.filter((r) => r.status !== "annulee"), "amount")), tone: "success", icon: Wallet },
      { label: "Cautions détenues", value: formatXOF(sum(rows.filter((r) => ["en_cours", "reservee"].includes(String(r.status))), "deposit")), tone: "warning", icon: Wallet },
    ],
  },
  {
    slug: "lavages",
    collection: "lavages",
    title: "Lavages",
    singular: "lavage",
    description: "Rendez-vous de lavage en station et à domicile.",
    icon: Droplets,
    refPrefix: "LAV-",
    searchKeys: ["ref", "client", "plate"],
    statusKey: "status",
    statuses: opts([["planifie", "Planifié", "info"], ["en_cours", "En cours", "primary"], ["termine", "Terminé", "success"], ["annule", "Annulé", "neutral"]]),
    filters: [
      { key: "formula", label: "Toutes formules", options: opts([["express", "Express"], ["complet", "Complet"], ["premium", "Premium"], ["moteur", "Moteur"], ["abonnement", "Abonnement"]]) },
      { key: "place", label: "Tous lieux", options: opts([["station", "Station"], ["domicile", "Domicile"]]) },
    ],
    columns: [{ key: "ref" }, { key: "client", sub: "plate" }, { key: "formula" }, { key: "place" }, { key: "date", sub: "time" }, { key: "amount", className: "num" }, { key: "status" }],
    fields: [
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Rendez-vous" },
      { key: "plate", label: "Immatriculation", placeholder: "AB-1234-CI", section: "Rendez-vous" },
      { key: "vehicle_type", label: "Type de véhicule", type: "select", options: opts([["berline", "Berline"], ["suv", "SUV / 4x4"], ["minibus", "Minibus"], ["camion", "Camion"], ["moto", "Moto"]]), section: "Rendez-vous" },
      { key: "formula", label: "Formule", type: "select", required: true, section: "Rendez-vous" },
      { key: "place", label: "Lieu", type: "select", section: "Rendez-vous" },
      { key: "date", label: "Date", type: "date", required: true, section: "Rendez-vous" },
      { key: "time", label: "Heure", type: "time", section: "Rendez-vous" },
      { key: "amount", label: "Montant", type: "money", required: true, section: "Paiement" },
      { key: "status", label: "Statut", type: "select", section: "Paiement" },
    ],
    defaults: { status: "planifie", formula: "complet", place: "station", vehicle_type: "berline", date: today },
    kpis: (rows) => [
      { label: "Aujourd'hui", value: String(rows.filter((r) => r.date === today()).length), tone: "primary", icon: Droplets },
      { label: "Planifiés", value: String(count(rows, "status", "planifie")), tone: "info", icon: FileText },
      { label: "Terminés", value: String(count(rows, "status", "termine")), tone: "success", icon: Droplets },
      { label: "Chiffre d'affaires", value: formatXOF(sum(rows.filter((r) => r.status === "termine"), "amount")), tone: "navy", icon: Wallet },
    ],
  },
  {
    slug: "transports",
    collection: "transports",
    title: "Transports & livraisons",
    singular: "mission",
    feminine: true,
    description: "Livraisons, déménagements et fret : planning des missions, chauffeurs et véhicules.",
    icon: Truck,
    refPrefix: "TRP-",
    searchKeys: ["ref", "client", "from", "to", "driver"],
    statusKey: "status",
    statuses: opts([["planifiee", "Planifiée", "info"], ["en_cours", "En cours", "primary"], ["livree", "Livrée", "success"], ["annulee", "Annulée", "neutral"]]),
    filters: [{ key: "kind", label: "Tous types", options: opts([["livraison", "Livraison"], ["demenagement", "Déménagement"], ["fret", "Fret"]]) }],
    columns: [
      { key: "ref" },
      { key: "kind" },
      { key: "client" },
      { key: "from", label: "Trajet", render: (r) => <><span className="cell-main">{String(r.from)}</span><span className="cell-sub">→ {String(r.to)}</span></> },
      { key: "date" },
      { key: "driver", sub: "vehicle", hideSm: true },
      { key: "amount", className: "num" },
      { key: "status" },
    ],
    fields: [
      { key: "kind", label: "Type de mission", type: "select", required: true, section: "Mission" },
      { key: "date", label: "Date", type: "date", required: true, section: "Mission" },
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Mission" },
      { key: "from", label: "Départ", required: true, section: "Mission" },
      { key: "to", label: "Arrivée", required: true, section: "Mission" },
      { key: "volume", label: "Volume / poids", placeholder: "20 m³, 3 t…", section: "Mission" },
      { key: "driver", label: "Chauffeur", section: "Moyens" },
      { key: "vehicle", label: "Véhicule", section: "Moyens", placeholder: "Camion 10 m³…" },
      { key: "amount", label: "Montant", type: "money", required: true, section: "Moyens" },
      { key: "status", label: "Statut", type: "select", section: "Moyens" },
      { key: "notes", label: "Instructions", type: "textarea", full: true, section: "Moyens" },
    ],
    defaults: { status: "planifiee", kind: "livraison", date: today },
    kpis: (rows) => [
      { label: "Planifiées", value: String(count(rows, "status", "planifiee")), tone: "info", icon: FileText },
      { label: "En cours", value: String(count(rows, "status", "en_cours")), tone: "primary", icon: Truck },
      { label: "Livrées", value: String(count(rows, "status", "livree")), tone: "success", icon: Box },
      { label: "Chiffre d'affaires", value: formatXOF(sum(rows.filter((r) => r.status !== "annulee"), "amount")), tone: "navy", icon: Wallet },
    ],
  },
  {
    slug: "equipements",
    collection: "equipements",
    title: "Équipements",
    singular: "équipement",
    description: "Parc de matériel à louer : énergie, BTP et événementiel.",
    icon: Wrench,
    searchKeys: ["code", "name"],
    statusKey: "status",
    statuses: ASSET_STATUS,
    filters: [{ key: "category", label: "Toutes catégories", options: opts([["energie", "Énergie"], ["btp", "BTP"], ["evenementiel", "Événementiel"]]) }],
    columns: [
      { key: "name", render: (r) => <Thumbed row={r}><span className="cell-main">{String(r.name)}</span><span className="cell-sub">{String(r.code ?? "")}</span></Thumbed> },
      { key: "category" },
      { key: "available", label: "Disponibles", className: "num", render: (r) => `${num(r.available)} / ${num(r.quantity)}` },
      { key: "price_day", className: "num" },
      { key: "condition", hideSm: true },
      { key: "status" },
    ],
    fields: [
      { key: "name", label: "Désignation", required: true, full: true, section: "Matériel" },
      { key: "code", label: "Code", required: true, section: "Matériel" },
      { key: "category", label: "Catégorie", type: "select", section: "Matériel" },
      { key: "quantity", label: "Quantité totale", type: "number", section: "Stock" },
      { key: "available", label: "Disponibles", type: "number", section: "Stock" },
      { key: "price_day", label: "Tarif / jour", type: "money", required: true, section: "Stock" },
      { key: "condition", label: "État", type: "select", options: opts([["neuf", "Neuf", "success"], ["bon", "Bon", "success"], ["a_reviser", "À réviser", "warning"], ["hs", "Hors service", "danger"]]), section: "Stock" },
      { key: "status", label: "Statut", type: "select", section: "Stock" },
      { key: "photos", label: "Photos", type: "photos", full: true, section: "Photos" },
    ],
    defaults: { status: "disponible", category: "btp", condition: "bon", quantity: 1, available: 1 },
    kpis: (rows) => [
      { label: "Références", value: String(rows.length), tone: "primary", icon: Wrench },
      { label: "Unités en parc", value: sum(rows, "quantity").toLocaleString("fr-FR"), tone: "navy", icon: Box },
      { label: "Unités louées", value: (sum(rows, "quantity") - sum(rows, "available")).toLocaleString("fr-FR"), tone: "info", icon: Key },
      { label: "En maintenance", value: String(count(rows, "status", "maintenance", "hors_service")), tone: "warning", icon: Wrench },
    ],
  },
  {
    slug: "locations-equipement",
    collection: "locations_equipement",
    title: "Locations matériel",
    singular: "location de matériel",
    feminine: true,
    description: "Sorties de matériel : client, quantités, période et montant.",
    icon: Box,
    refPrefix: "LEQ-",
    searchKeys: ["ref", "client", "equipment"],
    statusKey: "status",
    statuses: RENTAL_STATUS,
    columns: [{ key: "ref" }, { key: "client" }, { key: "equipment" }, { key: "quantity", className: "num" }, { key: "debut" }, { key: "fin" }, { key: "amount", className: "num" }, { key: "status" }],
    fields: [
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Location" },
      { key: "equipment", label: "Matériel", type: "lookup", lookup: { collection: "equipements", label: (r) => String(r.name) }, required: true, full: true, section: "Location" },
      { key: "quantity", label: "Quantité", type: "number", required: true, section: "Location" },
      { key: "site", label: "Lieu d'utilisation", section: "Location" },
      { key: "debut", label: "Début", type: "date", required: true, section: "Location" },
      { key: "fin", label: "Fin", type: "date", required: true, section: "Location" },
      { key: "amount", label: "Montant", type: "money", required: true, section: "Paiement" },
      { key: "status", label: "Statut", type: "select", section: "Paiement" },
    ],
    defaults: { status: "reservee", quantity: 1, debut: today },
    kpis: (rows) => [
      { label: "En cours", value: String(count(rows, "status", "en_cours")), tone: "primary", icon: Box },
      { label: "Réservées", value: String(count(rows, "status", "reservee")), tone: "info", icon: FileText },
      { label: "Chiffre d'affaires", value: formatXOF(sum(rows.filter((r) => r.status !== "annulee"), "amount")), tone: "success", icon: Wallet },
    ],
  },
  {
    slug: "elevage",
    collection: "lots",
    title: "Lots & cheptel",
    singular: "lot",
    description: "Suivi des bandes et du cheptel : effectifs, mortalité, bâtiments.",
    icon: Sprout,
    searchKeys: ["code", "building"],
    statusKey: "status",
    statuses: opts([["en_cours", "En cours", "primary"], ["vendu", "Vendu", "success"], ["cloture", "Clôturé", "neutral"]]),
    filters: [{ key: "species", label: "Toutes espèces", options: opts([["poulet_chair", "Poulet de chair"], ["pondeuse", "Pondeuse"], ["porc", "Porc"], ["caprin", "Caprin"], ["ovin", "Ovin"], ["poisson", "Poisson"]]) }],
    columns: [
      { key: "code", sub: "building" },
      { key: "species" },
      { key: "headcount", label: "Effectif vivant", className: "num", render: (r) => (num(r.headcount) - num(r.deaths)).toLocaleString("fr-FR") },
      { key: "deaths", label: "Mortalité", className: "num", render: (r) => { const rate = (num(r.deaths) / Math.max(1, num(r.headcount))) * 100; return <span className={rate > 5 ? "badge tone-danger" : rate > 2 ? "badge tone-warning" : ""}>{rate.toFixed(1)} %</span> } },
      { key: "debut", label: "Entrée" },
      { key: "expected_end", hideSm: true },
      { key: "status" },
    ],
    fields: [
      { key: "code", label: "Code du lot", required: true, placeholder: "PC-2026-15", section: "Lot" },
      { key: "species", label: "Espèce", type: "select", required: true, section: "Lot" },
      { key: "building", label: "Bâtiment", section: "Lot" },
      { key: "status", label: "Statut", type: "select", section: "Lot" },
      { key: "headcount", label: "Effectif de départ", type: "number", required: true, section: "Suivi" },
      { key: "deaths", label: "Mortalité cumulée", type: "number", section: "Suivi" },
      { key: "debut", label: "Date d'entrée", type: "date", required: true, section: "Suivi" },
      { key: "expected_end", label: "Sortie prévue", type: "date", section: "Suivi" },
      { key: "feed_kg", label: "Aliment consommé", type: "number", suffix: "KG", section: "Suivi" },
      { key: "notes", label: "Observations (vaccins, traitements…)", type: "textarea", full: true, section: "Suivi" },
      { key: "photos", label: "Photos du lot", type: "photos", full: true, section: "Photos" },
    ],
    defaults: { status: "en_cours", species: "poulet_chair", deaths: 0, debut: today },
    kpis: (rows) => {
      const active = rows.filter((r) => r.status === "en_cours")
      const alive = active.reduce((t, r) => t + num(r.headcount) - num(r.deaths), 0)
      return [
        { label: "Lots en cours", value: String(active.length), tone: "primary", icon: Sprout },
        { label: "Cheptel vivant", value: alive.toLocaleString("fr-FR"), note: "têtes, lots en cours", tone: "success", icon: Sprout },
        { label: "Mortalité moyenne", value: `${((sum(active, "deaths") / Math.max(1, sum(active, "headcount"))) * 100).toFixed(1)} %`, tone: "warning", icon: FileText },
      ]
    },
  },
  {
    slug: "ventes-elevage",
    collection: "ventes_elevage",
    title: "Ventes élevage",
    singular: "vente",
    feminine: true,
    description: "Ventes de la ferme : œufs, volailles, porcs et caprins.",
    icon: Wallet,
    refPrefix: "VEL-",
    searchKeys: ["ref", "client"],
    statusKey: "status",
    statuses: opts([["commandee", "Commandée", "info"], ["livree", "Livrée", "warning"], ["payee", "Payée", "success"], ["annulee", "Annulée", "neutral"]]),
    filters: [{ key: "product", label: "Tous produits", options: opts([["oeufs", "Œufs (plateau)"], ["poulet", "Poulet"], ["porc", "Porc"], ["caprin", "Caprin"], ["ovin", "Ovin"], ["poisson", "Poisson (kg)"]]) }],
    columns: [{ key: "ref" }, { key: "date" }, { key: "client" }, { key: "product" }, { key: "quantity", className: "num" }, { key: "unit_price", className: "num", hideSm: true }, { key: "amount", className: "num" }, { key: "status" }],
    fields: [
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Vente" },
      { key: "date", label: "Date", type: "date", required: true, section: "Vente" },
      { key: "product", label: "Produit", type: "select", required: true, section: "Vente" },
      { key: "quantity", label: "Quantité", type: "number", required: true, section: "Vente" },
      { key: "unit_price", label: "Prix unitaire", type: "money", required: true, section: "Vente" },
      { key: "amount", label: "Montant (calculé)", type: "money", section: "Vente" },
      { key: "status", label: "Statut", type: "select", section: "Vente" },
    ],
    defaults: { status: "commandee", product: "oeufs", quantity: 1, date: today },
    compute: (v) => ({ ...v, amount: num(v.quantity) * num(v.unit_price) }),
    kpis: (rows) => [
      { label: "Ventes", value: String(rows.length), tone: "primary", icon: Wallet },
      { label: "Chiffre d'affaires", value: formatXOF(sum(rows.filter((r) => r.status !== "annulee"), "amount")), tone: "success", icon: Wallet },
      { label: "À encaisser", value: formatXOF(sum(rows.filter((r) => ["commandee", "livree"].includes(String(r.status))), "amount")), tone: "warning", icon: FileText },
    ],
  },
  {
    slug: "factures",
    collection: "factures",
    title: "Factures",
    singular: "facture",
    feminine: true,
    description: "Facturation de toutes les activités, encaissements et relances.",
    icon: FileText,
    refPrefix: "FAC-2026-",
    searchKeys: ["ref", "client"],
    statusKey: "status",
    statuses: opts([["brouillon", "Brouillon", "neutral"], ["envoyee", "Envoyée", "info"], ["partielle", "Partielle", "warning"], ["payee", "Payée", "success"], ["en_retard", "En retard", "danger"]]),
    filters: [{ key: "activity", label: "Toutes les activités", options: SERVICE_OPTIONS }],
    columns: [
      { key: "ref" },
      { key: "client" },
      { key: "activity", hideSm: true },
      { key: "date" },
      { key: "due", hideSm: true },
      { key: "amount", className: "num" },
      { key: "paid", label: "Reste dû", className: "num", render: (r) => { const left = num(r.amount) - num(r.paid); return left > 0 ? <span className="cell-main">{formatXOF(left)}</span> : <span className="cell-sub">—</span> } },
      { key: "status" },
    ],
    fields: [
      { key: "client", label: "Client", type: "lookup", lookup: clientLookup, required: true, full: true, section: "Facture" },
      { key: "activity", label: "Activité", type: "select", required: true, section: "Facture" },
      { key: "status", label: "Statut", type: "select", section: "Facture" },
      { key: "date", label: "Date", type: "date", required: true, section: "Facture" },
      { key: "due", label: "Échéance", type: "date", section: "Facture" },
      { key: "label", label: "Objet", full: true, placeholder: "Location Tucson du 15/10 au 15/11", section: "Facture" },
      { key: "amount", label: "Montant TTC", type: "money", required: true, section: "Règlement" },
      { key: "paid", label: "Montant encaissé", type: "money", section: "Règlement" },
      { key: "payment_method", label: "Mode de paiement", type: "select", options: opts([["especes", "Espèces"], ["mobile_money", "Mobile Money"], ["virement", "Virement"], ["cheque", "Chèque"]]), section: "Règlement" },
      { key: "documents", label: "Facture PDF, justificatifs", type: "documents", full: true, section: "Pièces jointes" },
    ],
    defaults: { status: "brouillon", activity: "location-vehicules", paid: 0, date: today },
    kpis: (rows) => {
      const billed = sum(rows.filter((r) => r.status !== "brouillon"), "amount")
      const paid = sum(rows, "paid")
      return [
        { label: "Facturé", value: formatXOF(billed), tone: "navy", icon: FileText },
        { label: "Encaissé", value: formatXOF(paid), note: `${Math.round((paid / Math.max(1, billed)) * 100)} % du facturé`, tone: "success", icon: Wallet },
        { label: "Reste à encaisser", value: formatXOF(billed - paid), tone: "warning", icon: Wallet },
        { label: "En retard", value: String(count(rows, "status", "en_retard")), tone: "danger", icon: FileText },
      ]
    },
  },
]

export const newLabel = (r: Resource) => `${r.feminine ? "Nouvelle" : "Nouveau"} ${r.singular}`

export const resourceBySlug = (slug: string) => RESOURCES.find((r) => r.slug === slug)

/** Options of a select field (falls back to the module statuses for the status key) */
export function fieldOptions(res: Resource, field: Field): Option[] {
  return field.options ?? (field.key === res.statusKey ? res.statuses : undefined) ?? res.filters?.find((f) => f.key === field.key)?.options ?? []
}

export const SERVICE_LABEL = SERVICE_NAMES as Record<string, string>
