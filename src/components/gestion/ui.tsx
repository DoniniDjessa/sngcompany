"use client"
import { useEffect, useId, useRef, useState } from "react"
import type { Icon } from "@/components/icons"
import { Check, Download, FileText, Plus, X } from "@/components/icons"
import { fileName, openFile, photoUrl, uploadFile } from "@/lib/gestion/files"
import { toast } from "@/lib/gestion/toast"
import type { Field, Kpi, Option, Tone } from "@/lib/gestion/resources"
import { useToasts } from "@/lib/gestion/toast"
import { useCollection } from "@/lib/store"

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`badge tone-${tone}`}>{children}</span>
}

export function OptionBadge({ options, value }: { options?: Option[]; value: unknown }) {
  const o = options?.find((x) => x.value === value)
  if (!o) return <span className="cell-sub">{value ? String(value) : "—"}</span>
  return <Badge tone={o.tone ?? "neutral"}>{o.label}</Badge>
}

export function PageHead({ icon: I, title, sub, children }: { icon: Icon; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title"><span className="page-title-icon"><I /></span>{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  )
}

export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="kpi-grid">
      {items.map((k) => (
        <div key={k.label} className="kpi">
          <span className={`kpi-icon tone-${k.tone}`}><k.icon /></span>
          <div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            {k.note && <div className="kpi-note">{k.note}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon: I, title, text, action }: { icon: Icon; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon"><I /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

/** Escape closes, focus goes to the first field and back to the opener on close */
function useDialogKeys(onClose: () => void, panel: React.RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const first = panel.current?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea, button.btn-main, button.btn-danger")
    ;(first ?? panel.current)?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current()
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      previous?.focus?.()
    }
  }, [panel])
}

export function Drawer({ title, icon: I, meta, onClose, children, footer }: {
  title: string
  icon?: Icon
  meta?: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogKeys(onClose, ref)
  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="drawer-head">
          {I && <span className="page-title-icon"><I /></span>}
          <h3 id={titleId}>{title}</h3>
          {meta}
          <button type="button" className="bo-icon-btn" onClick={onClose} aria-label="Fermer"><X /></button>
        </div>
        {children}
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Confirm({ title, text, confirmLabel = "Supprimer", onConfirm, onCancel }: {
  title: string
  text: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDialogKeys(onCancel, ref)
  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div ref={ref} className="dialog" role="alertdialog" aria-modal="true">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-soft" onClick={onCancel}>Annuler</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export function Toasts() {
  const list = useToasts()
  return (
    <div className="toast-zone" aria-live="polite">
      {list.map((t) => <div key={t.id} className={`toast ${t.error ? "error" : ""}`} role={t.error ? "alert" : undefined}>{t.error ? <X /> : <Check />} {t.text}</div>)}
    </div>
  )
}

/** One form control, chosen from the field type */
export function FieldInput({ field, options, value, onChange }: {
  field: Field
  options: Option[]
  value: unknown
  onChange: (v: unknown) => void
}) {
  const listId = useId()
  const lookupRows = useCollection(field.lookup?.collection ?? "clients")
  if (field.type === "photos" || field.type === "documents") {
    return <FilesField folder={field.type} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
  }
  const v = value == null ? "" : String(value)
  const common = { id: field.key, required: field.required, placeholder: field.placeholder }

  if (field.type === "select") {
    return (
      <select {...common} className="form-select" value={v} onChange={(e) => onChange(e.target.value)}>
        {!field.required && <option value="">—</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    )
  }
  if (field.type === "textarea") {
    return <textarea {...common} className="form-textarea" rows={3} value={v} onChange={(e) => onChange(e.target.value)} />
  }
  if (field.type === "lookup" && field.lookup) {
    const label = field.lookup.label
    return (
      <>
        <input {...common} className="form-input" list={listId} value={v} onChange={(e) => onChange(e.target.value)} autoComplete="off" />
        <datalist id={listId}>{lookupRows.map((r) => <option key={r.id} value={label(r)} />)}</datalist>
      </>
    )
  }
  const numeric = field.type === "number" || field.type === "money"
  const input = (
    <input
      {...common}
      className="form-input"
      type={numeric ? "number" : field.type === "tel" || field.type === "email" || field.type === "date" || field.type === "time" ? field.type : "text"}
      min={numeric ? 0 : undefined}
      step={field.type === "money" ? 500 : undefined}
      value={v}
      onChange={(e) => onChange(numeric ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
    />
  )
  const suffix = field.type === "money" ? "FCFA" : field.suffix
  return suffix ? <div className="input-suffix">{input}<span>{suffix}</span></div> : input
}

/** Photos (thumbnails) or documents (list), uploaded to R2 as soon as they are picked */
function FilesField({ folder, value, onChange }: { folder: "photos" | "documents"; value: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(0)
  const latest = useRef(value)
  useEffect(() => {
    latest.current = value
  }, [value])

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy((b) => b + files.length)
    for (const file of Array.from(files)) {
      try {
        const key = await uploadFile(file, folder)
        latest.current = [...latest.current, key]
        onChange(latest.current)
      } catch (e) {
        toast((e as Error).message, true)
      } finally {
        setBusy((b) => b - 1)
      }
    }
  }
  const remove = (key: string) => onChange(value.filter((k) => k !== key))
  const accept = folder === "photos" ? "image/jpeg,image/png,image/webp,image/gif" : "image/*,.pdf,.doc,.docx,.xls,.xlsx"
  const picker = (
    <label className={`file-add ${folder === "documents" ? "doc-add" : ""}`}>
      <Plus /> {busy ? `Envoi… (${busy})` : folder === "photos" ? "Photo" : "Ajouter un document"}
      <input type="file" multiple accept={accept} disabled={busy > 0} onChange={(e) => { add(e.target.files); e.target.value = "" }} />
    </label>
  )

  if (folder === "photos") {
    return (
      <div className="files">
        {value.map((key) => (
          <div key={key} className="file-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed R2 redirect */}
            <img src={photoUrl(key)} alt={fileName(key)} />
            <button type="button" className="file-remove" onClick={() => remove(key)} aria-label={`Retirer ${fileName(key)}`}><X /></button>
          </div>
        ))}
        {picker}
      </div>
    )
  }
  return (
    <div className="doc-list">
      {value.map((key) => (
        <div key={key} className="doc-item">
          <FileText />
          <button type="button" className="doc-name" onClick={() => openFile(key).catch((e) => toast(e.message, true))}>{fileName(key)}</button>
          <button type="button" className="bo-icon-btn" onClick={() => openFile(key, true).catch((e) => toast(e.message, true))} aria-label="Télécharger"><Download /></button>
          <button type="button" className="bo-icon-btn" onClick={() => remove(key)} aria-label={`Retirer ${fileName(key)}`}><X /></button>
        </div>
      ))}
      {picker}
    </div>
  )
}
