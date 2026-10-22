// Company identity, used by the public site and the backoffice. Change it here only.
export const SITE = {
  name: "SNG Company",
  shortName: "SNG",
  tagline: "Plus qu'un service, une expérience",
  description:
    "SNG Company réunit location de véhicules, transport & logistique, location d'équipements, lavage de véhicules et élevage à Abidjan et partout en Côte d'Ivoire.",
  phone: "+225 01 02 92 68 74",
  phoneHref: "tel:+2250102926874",
  whatsapp: "2250102926874",
  phone2: "+225 07 77 48 91 19",
  email: "sngelitecars@yahoo.com",
  address: "Abidjan, Côte d'Ivoire",
  hours: "Lun – Sam : 7h30 – 19h · Dim : sur rendez-vous",
  // The car rental catalogue lives on its own site (SNG Elite Cars)
  carsSiteUrl: "https://sngelitecars.com",
  carsSiteName: "SNG Elite Cars",
  url: "https://sngcompany.ci",
}

export const formatXOF = (n: number | null | undefined) => `${Math.round(n ?? 0).toLocaleString("fr-FR")} FCFA`

export const formatDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"
