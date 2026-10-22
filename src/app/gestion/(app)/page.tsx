"use client"
import Link from "next/link"
import { ArrowRight, Box, Car, Dashboard, Droplets, FileText, Inbox, Key, Plus, Sprout, Truck, Wallet, Wrench } from "@/components/icons"
import type { Icon } from "@/components/icons"
import { KpiGrid, OptionBadge, PageHead } from "@/components/gestion/ui"
import { useSession } from "@/lib/gestion/auth"
import { resourceBySlug, SERVICE_LABEL, type Tone } from "@/lib/gestion/resources"
import { SERVICES } from "@/lib/services"
import { formatDate, formatXOF } from "@/lib/site"
import { useCollection, type Row } from "@/lib/store"

const num = (v: unknown) => Number(v) || 0
const TONE_COLOR: Record<string, string> = { green: "#22c55e", blue: "#26abe2", orange: "#f97316", rose: "#db2777", violet: "#7c3aed" }

export default function DashboardPage() {
  const session = useSession()
  const factures = useCollection("factures")
  const demandes = useCollection("demandes")
  const vehicules = useCollection("vehicules")
  const locations = useCollection("locations")
  const transports = useCollection("transports")
  const lavages = useCollection("lavages")
  const equipements = useCollection("equipements")
  const leq = useCollection("locations_equipement")
  const lots = useCollection("lots")
  const ventes = useCollection("ventes_elevage")

  const today = new Date().toISOString().slice(0, 10)
  const billed = factures.filter((f) => f.status !== "brouillon").reduce((t, f) => t + num(f.amount), 0)
  const paid = factures.reduce((t, f) => t + num(f.paid), 0)
  const fresh = demandes.filter((d) => d.status === "nouvelle").length
  const running =
    locations.filter((r) => r.status === "en_cours").length +
    transports.filter((r) => r.status === "en_cours").length +
    lavages.filter((r) => r.status === "en_cours").length +
    leq.filter((r) => r.status === "en_cours").length

  const byActivity = SERVICES.map((s) => ({
    service: s,
    total: factures.filter((f) => f.activity === s.slug && f.status !== "brouillon").reduce((t, f) => t + num(f.amount), 0),
  }))
  const maxActivity = Math.max(1, ...byActivity.map((a) => a.total))

  const fleet = [
    { label: "Disponibles", value: vehicules.filter((v) => v.status === "disponible").length, color: "#76b82a" },
    { label: "En location", value: vehicules.filter((v) => v.status === "loue").length, color: "#26abe2" },
    { label: "Maintenance", value: vehicules.filter((v) => ["maintenance", "hors_service"].includes(String(v.status))).length, color: "#f59e0b" },
  ]

  type Event = { icon: Icon; tone: Tone; title: string; sub: string; time: string; href: string }
  const agenda: Event[] = [
    ...lavages.filter((l) => l.date === today).map((l) => ({ icon: Droplets, tone: "info" as Tone, title: `Lavage ${l.formula} · ${l.client}`, sub: `${l.plate ?? ""} · ${l.place}`, time: String(l.time ?? ""), href: "/gestion/lavages" })),
    ...transports.filter((t) => t.date === today).map((t) => ({ icon: Truck, tone: "navy" as Tone, title: `${t.ref} · ${t.client}`, sub: `${t.from} → ${t.to}`, time: "", href: "/gestion/transports" })),
    ...locations.filter((l) => l.debut === today || l.fin === today).map((l) => ({ icon: Key, tone: "primary" as Tone, title: `${l.debut === today ? "Départ" : "Retour"} · ${l.vehicle}`, sub: String(l.client), time: "", href: "/gestion/locations" })),
    ...leq.filter((l) => l.debut === today || l.fin === today).map((l) => ({ icon: Box, tone: "warning" as Tone, title: `${l.debut === today ? "Sortie" : "Retour"} · ${l.equipment}`, sub: String(l.client), time: "", href: "/gestion/locations-equipement" })),
  ].sort((a, b) => a.time.localeCompare(b.time))

  const late = factures.filter((f) => f.status === "en_retard" || (f.due && String(f.due) < today && num(f.paid) < num(f.amount) && f.status !== "brouillon"))
  const alive = lots.filter((l) => l.status === "en_cours").reduce((t, l) => t + num(l.headcount) - num(l.deaths), 0)

  const modules: { icon: Icon; label: string; value: string; note: string; href: string; tone: Tone }[] = [
    { icon: Car, label: "Location véhicules", value: `${fleet[0].value} / ${vehicules.length}`, note: "véhicules disponibles", href: "/gestion/vehicules", tone: "primary" },
    { icon: Truck, label: "Transport", value: String(transports.filter((t) => t.status === "planifiee").length), note: "missions planifiées", href: "/gestion/transports", tone: "navy" },
    { icon: Wrench, label: "Équipements", value: String(equipements.reduce((t, e) => t + num(e.quantity) - num(e.available), 0)), note: "unités en location", href: "/gestion/equipements", tone: "warning" },
    { icon: Droplets, label: "Lavage", value: String(lavages.filter((l) => l.date === today).length), note: "rendez-vous aujourd'hui", href: "/gestion/lavages", tone: "info" },
    { icon: Sprout, label: "Élevage", value: alive.toLocaleString("fr-FR"), note: `têtes · ${formatXOF(ventes.reduce((t, v) => t + num(v.amount), 0))} vendus`, href: "/gestion/elevage", tone: "success" },
  ]

  const demandesRes = resourceBySlug("demandes")!
  const latest = [...demandes].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 6)
  const hour = new Date().getHours()

  return (
    <>
      <div className="welcome">
        <div>
          <h2>{hour < 18 ? "Bonjour" : "Bonsoir"} {session?.name.split(" ")[0]} 👋</h2>
          <p>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {fresh} nouvelle{fresh > 1 ? "s" : ""} demande{fresh > 1 ? "s" : ""} · {agenda.length} opération{agenda.length > 1 ? "s" : ""} aujourd&apos;hui</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/gestion/demandes" className="btn btn-soft"><Inbox /> Demandes</Link>
          <Link href="/gestion/factures?new=1" className="btn btn-main"><Plus /> Nouvelle facture</Link>
        </div>
      </div>

      <PageHead icon={Dashboard} title="Tableau de bord" sub="Vue d'ensemble de toutes les activités SNG." />

      <KpiGrid
        items={[
          { label: "Chiffre d'affaires facturé", value: formatXOF(billed), tone: "navy", icon: FileText },
          { label: "Encaissé", value: formatXOF(paid), note: `${Math.round((paid / Math.max(1, billed)) * 100)} % du facturé`, tone: "success", icon: Wallet },
          { label: "Nouvelles demandes", value: String(fresh), note: "à traiter", tone: "info", icon: Inbox },
          { label: "Opérations en cours", value: String(running), note: "locations, missions, lavages", tone: "primary", icon: Key },
        ]}
      />

      <div className="module-grid">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="module-card">
            <span className={`kpi-icon tone-${m.tone}`}><m.icon /></span>
            <strong>{m.label}</strong>
            <div>
              <div className="kpi-value">{m.value}</div>
              <div className="kpi-note">{m.note}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Dernières demandes</div>
              <div className="card-sub">Reçues depuis le site et par téléphone</div>
            </div>
            <Link href="/gestion/demandes" className="link">Tout voir <ArrowRight /></Link>
          </div>
          <div className="table-wrap">
            <table className="bo-table">
              <thead><tr><th>Réf.</th><th>Client</th><th>Activité</th><th className="hide-sm">Reçue le</th><th>Statut</th></tr></thead>
              <tbody>
                {latest.map((d) => (
                  <tr key={d.id}>
                    <td><span className="cell-ref">{String(d.ref)}</span></td>
                    <td><span className="cell-main">{String(d.name)}</span><span className="cell-sub">{String(d.phone ?? "")}</span></td>
                    <td>{SERVICE_LABEL[String(d.service)]}</td>
                    <td className="hide-sm">{formatDate(String(d.date ?? d.created_at))}</td>
                    <td><OptionBadge options={demandesRes.statuses} value={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Chiffre d&apos;affaires par activité</div>
              <div className="card-sub">Montants facturés</div>
            </div>
          </div>
          <div className="card-body bars">
            {byActivity.map((a) => (
              <div key={a.service.slug}>
                <div className="bar-row-head"><span>{a.service.name}</span><span>{formatXOF(a.total)}</span></div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(a.total / maxActivity) * 100}%`, ["--bar" as string]: TONE_COLOR[a.service.tone] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-grid three">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Agenda du jour</div>
            <span className="badge tone-primary">{agenda.length}</span>
          </div>
          {agenda.length === 0 ? (
            <p className="card-body cell-sub">Aucune opération prévue aujourd&apos;hui.</p>
          ) : (
            <div className="agenda">
              {agenda.map((e, i) => (
                <Link key={i} href={e.href} className="agenda-item">
                  <span className={`agenda-icon tone-${e.tone}`}><e.icon /></span>
                  <div className="agenda-main">
                    <div className="cell-main">{e.title}</div>
                    <div className="cell-sub">{e.sub}</div>
                  </div>
                  {e.time && <span className="agenda-time">{e.time}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">État de la flotte</div>
            <Link href="/gestion/vehicules" className="link">Flotte <ArrowRight /></Link>
          </div>
          <div className="card-body">
            <div className="stack" role="img" aria-label={fleet.map((f) => `${f.label} ${f.value}`).join(", ")}>
              {fleet.map((f) => f.value > 0 && <div key={f.label} style={{ flex: f.value, background: f.color }} />)}
            </div>
            <div className="legend">
              {fleet.map((f) => (
                <div key={f.label} className="legend-row"><span className="swatch" style={{ background: f.color }} /> {f.label} <b>{f.value}</b></div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Factures à relancer</div>
            <Link href="/gestion/factures" className="link">Factures <ArrowRight /></Link>
          </div>
          {late.length === 0 ? (
            <p className="card-body cell-sub">Aucune facture en retard. 👍</p>
          ) : (
            <div className="agenda">
              {late.map((f: Row) => (
                <div key={f.id} className="agenda-item">
                  <span className="agenda-icon tone-danger"><FileText /></span>
                  <div className="agenda-main">
                    <div className="cell-main">{String(f.client)}</div>
                    <div className="cell-sub">{String(f.ref)} · échue le {formatDate(String(f.due))}</div>
                  </div>
                  <span className="cell-main">{formatXOF(num(f.amount) - num(f.paid))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
