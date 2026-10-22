"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Download, Pencil, Plus, Search, Trash } from "@/components/icons"
import { fieldOptions, newLabel, type Column, type Field, type Resource } from "@/lib/gestion/resources"
import { toast } from "@/lib/gestion/toast"
import { formatDate, formatXOF } from "@/lib/site"
import { deleteRow, saveRow, useCollection, useCollectionStatus, type Row } from "@/lib/store"
import { Confirm, Drawer, EmptyState, FieldInput, KpiGrid, OptionBadge, PageHead } from "./ui"

const PAGE_SIZE = 12

export default function ResourcePage({ res }: { res: Resource }) {
  const rows = useCollection(res.collection)
  const { loading, error } = useCollectionStatus(res.collection)
  const params = useSearchParams()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: "created_at", dir: -1 })
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [removing, setRemoving] = useState<Row | null>(null)

  const fieldOf = (key: string) => res.fields.find((f) => f.key === key)

  // Topbar "Nouveau" menu links here with ?new=1
  useEffect(() => {
    if (params.get("new") === "1") openNew()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows
      .filter((r) => !status || r[res.statusKey!] === status)
      .filter((r) => Object.entries(filters).every(([k, v]) => !v || r[k] === v))
      .filter((r) => !term || res.searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(term)))
      .sort((a, b) => {
        const x = a[sort.key] ?? "", y = b[sort.key] ?? ""
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "fr")) * sort.dir
      })
  }, [rows, status, filters, search, sort, res])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  function openNew() {
    const defaults = Object.fromEntries(Object.entries(res.defaults ?? {}).map(([k, v]) => [k, typeof v === "function" ? v() : v]))
    setEditing(defaults)
  }

  async function save(values: Record<string, unknown>) {
    await saveRow(res.collection, res.compute ? res.compute(values) : values)
    toast(values.id ? "Modifications enregistrées" : `${capitalize(res.singular)} ajouté${res.feminine ? "e" : ""}`)
    setEditing(null)
  }

  async function remove(row: Row) {
    try {
      await deleteRow(res.collection, row.id)
      toast("Suppression effectuée")
      setEditing(null)
    } catch (e) {
      toast((e as Error).message, true)
    }
    setRemoving(null)
  }

  function exportCsv() {
    const cols = res.fields.map((f) => f.key)
    const header = res.fields.map((f) => f.label)
    if (res.refPrefix) { cols.unshift("ref"); header.unshift("Référence") }
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [header.map(esc).join(";"), ...filtered.map((r) => cols.map((c) => esc(r[c])).join(";"))]
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" })
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${res.slug}-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = {}
    rows.forEach((r) => { const s = String(r[res.statusKey ?? ""] ?? ""); c[s] = (c[s] ?? 0) + 1 })
    return c
  }, [rows, res.statusKey])

  const hasFilter = !!(search || status || Object.values(filters).some(Boolean))

  return (
    <>
      <PageHead icon={res.icon} title={res.title} sub={res.description}>
        <button className="btn btn-soft" onClick={exportCsv}><Download /> Exporter</button>
        <button className="btn btn-main" onClick={openNew}><Plus /> {newLabel(res)}</button>
      </PageHead>

      {res.kpis && <KpiGrid items={res.kpis(rows)} />}

      <div className="card">
        {res.statuses && (
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={!status} className={`tab ${!status ? "active" : ""}`} onClick={() => { setStatus(""); setPage(1) }}>
              Tous <span className="tab-count">{rows.length}</span>
            </button>
            {res.statuses.map((s) => (
              <button key={s.value} role="tab" aria-selected={status === s.value} className={`tab ${status === s.value ? "active" : ""}`} onClick={() => { setStatus(s.value); setPage(1) }}>
                {s.label} <span className="tab-count">{statusCounts[s.value] ?? 0}</span>
              </button>
            ))}
          </div>
        )}

        <div className="toolbar">
          <div className="search-field">
            <Search />
            <input className="form-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Rechercher…" aria-label={`Rechercher dans ${res.title}`} />
          </div>
          {res.filters?.map((f) => (
            <select key={f.key} className="form-select" value={filters[f.key] ?? ""} onChange={(e) => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1) }} aria-label={f.label}>
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          {hasFilter && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setStatus(""); setFilters({}) }}>Effacer les filtres</button>
          )}
          <span className="cell-sub" style={{ marginLeft: "auto" }}>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>

        {loading && rows.length === 0 ? (
          <div className="loading-row">Chargement…</div>
        ) : error ? (
          <div className="loading-row" role="alert">Erreur de chargement : {error}</div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={res.icon}
            title={hasFilter ? "Aucun résultat" : `${res.feminine ? "Aucune" : "Aucun"} ${res.singular}`}
            text={hasFilter ? "Aucune ligne ne correspond à ces filtres." : `Ajoutez ${res.feminine ? "la première" : "le premier"} ${res.singular}.`}
            action={!hasFilter && <button className="btn btn-main" onClick={openNew}><Plus /> {newLabel(res)}</button>}
          />
        ) : (
          <div className="table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  {res.columns.map((c) => {
                    const sorted = sort.key === c.key
                    return (
                      <th
                        key={c.key}
                        className={`sortable ${sorted ? "sorted" : ""} ${c.className === "num" ? "num" : ""} ${c.hideSm ? "hide-sm" : ""}`}
                        onClick={() => setSort({ key: c.key, dir: sorted ? (-sort.dir as 1 | -1) : 1 })}
                        aria-sort={sorted ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                      >
                        {c.label ?? fieldOf(c.key)?.label ?? c.key}
                        <span className="sort">{sorted ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
                      </th>
                    )
                  })}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => (
                  <tr key={r.id} className="clickable" onClick={() => setEditing(r)}>
                    {res.columns.map((c, ci) => (
                      <td key={c.key} className={`${c.className ?? ""} ${c.hideSm ? "hide-sm" : ""}`}>
                        <Cell res={res} col={c} field={fieldOf(c.key)} row={r} first={ci === 0} />
                      </td>
                    ))}
                    <td>
                      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="bo-icon-btn" onClick={() => setEditing(r)} aria-label={`Modifier ligne ${i + 1}`}><Pencil /></button>
                        <button className="bo-icon-btn danger" onClick={() => setRemoving(r)} aria-label={`Supprimer ligne ${i + 1}`}><Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <nav className="pager" aria-label="Pagination">
            <span>{(current - 1) * PAGE_SIZE + 1}–{Math.min(filtered.length, current * PAGE_SIZE)} sur {filtered.length}</span>
            <div className="pager-btns">
              <button className="btn btn-ghost btn-sm" disabled={current <= 1} onClick={() => setPage(current - 1)} aria-label="Page précédente"><ChevronLeft /></button>
              <span>Page {current} / {pageCount}</span>
              <button className="btn btn-ghost btn-sm" disabled={current >= pageCount} onClick={() => setPage(current + 1)} aria-label="Page suivante"><ChevronRight /></button>
            </div>
          </nav>
        )}
      </div>

      {editing && <RecordDrawer res={res} initial={editing} onSave={save} onDelete={(r) => setRemoving(r)} onClose={() => setEditing(null)} />}
      {removing && (
        <Confirm
          title={`Supprimer ${String(removing.ref ?? removing.name ?? removing.code ?? "cette ligne")} ?`}
          text="Cette action est définitive."
          onConfirm={() => remove(removing)}
          onCancel={() => setRemoving(null)}
        />
      )}
    </>
  )
}

function Cell({ res, col, field, row, first }: { res: Resource; col: Column; field?: Field; row: Row; first: boolean }) {
  if (col.render) return <>{col.render(row)}</>
  const v = row[col.key]
  let content: React.ReactNode
  if (col.key === "ref") content = <span className="cell-ref">{String(v ?? "—")}</span>
  else if (col.key === "created_at") content = formatDate(String(v))
  else if (field?.type === "select") {
    const options = fieldOptions(res, field)
    content = col.key === res.statusKey || options.some((o) => o.tone) ? <OptionBadge options={options} value={v} /> : options.find((o) => o.value === v)?.label ?? String(v ?? "—")
  } else if (field?.type === "money") content = formatXOF(Number(v))
  else if (field?.type === "date") content = formatDate(v as string)
  else if (field?.type === "number") content = Number(v ?? 0).toLocaleString("fr-FR")
  else content = v === "" || v == null ? "—" : String(v)

  const sub = col.sub ? row[col.sub] : null
  const subField = col.sub ? res.fields.find((f) => f.key === col.sub) : undefined
  return (
    <>
      {first && col.key !== "ref" ? <span className="cell-main">{content}</span> : content}
      {sub ? <span className="cell-sub">{subField?.type === "date" ? formatDate(String(sub)) : String(sub)}</span> : null}
    </>
  )
}

function RecordDrawer({ res, initial, onSave, onDelete, onClose }: {
  res: Resource
  initial: Record<string, unknown>
  onSave: (v: Record<string, unknown>) => Promise<void>
  onDelete: (r: Row) => void
  onClose: () => void
}) {
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(values)
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }
  const isNew = !initial.id
  const shown = res.compute ? res.compute(values) : values
  const sections = [...new Set(res.fields.map((f) => f.section ?? ""))]
  const formId = `form-${res.slug}`

  return (
    <Drawer
      title={isNew ? newLabel(res) : `${capitalize(res.singular)} ${String(initial.ref ?? initial.code ?? initial.name ?? "")}`}
      icon={res.icon}
      meta={!isNew && res.statusKey ? <OptionBadge options={res.statuses} value={initial[res.statusKey]} /> : undefined}
      onClose={onClose}
      footer={
        <>
          {!isNew && <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(initial as Row)}><Trash /> Supprimer</button>}
          <span className="spacer" />
          <button type="button" className="btn btn-soft" onClick={onClose}>Annuler</button>
          <button type="submit" form={formId} className="btn btn-main" disabled={saving}>{saving ? "Enregistrement…" : isNew ? "Créer" : "Enregistrer"}</button>
        </>
      }
    >
      <form id={formId} className="drawer-body" onSubmit={submit}>
        {error && <div role="alert" className="alert tone-danger">{error}</div>}
        {sections.map((section) => (
          <div key={section} className="form-section">
            {section && <div className="form-section-title">{section}</div>}
            <div className="form-grid">
              {res.fields.filter((f) => (f.section ?? "") === section).map((f) => (
                <div key={f.key} className={f.full || f.type === "textarea" ? "full" : ""}>
                  <label className="form-label" htmlFor={f.key}>{f.label}{f.required && <em> *</em>}</label>
                  <FieldInput field={f} options={fieldOptions(res, f)} value={shown[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        ))}
        {!isNew && <p className="cell-sub" style={{ marginTop: "1.2rem" }}>Créé le {formatDate(String(initial.created_at))}</p>}
      </form>
    </Drawer>
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
