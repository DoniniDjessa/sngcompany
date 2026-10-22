"use client"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, External, Pencil, Plus, Trash, X } from "@/components/icons"
import { docDefaults, imgSrc, mergeContent, type DocDef, type FieldDef } from "@/lib/content"
import { authHeader } from "@/lib/gestion/auth"
import { uploadFile } from "@/lib/gestion/files"
import { toast } from "@/lib/gestion/toast"
import { supabase } from "@/lib/supabase"
import { Confirm, PageHead } from "./ui"

type Doc = Record<string, unknown>

// Edits one content document of the site ("home", "company", "service:<slug>"):
// load (saved values over defaults) → edit → Publier (upsert + immediate refresh of the site).
export default function ContentEditor({ def }: { def: DocDef }) {
  const defaults = useMemo(() => docDefaults(def.key) as Doc, [def.key])
  const [doc, setDoc] = useState<Doc | null>(null)
  const [saved, setSaved] = useState<string>("")
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const dirty = doc !== null && JSON.stringify(doc) !== saved

  useEffect(() => {
    let alive = true
    supabase.from("sng-content").select("value, updated_at").eq("key", def.key).maybeSingle().then(({ data, error }) => {
      if (!alive) return
      if (error) toast(`Lecture impossible : ${error.message}`, true)
      const value = mergeContent(defaults, data?.value)
      setDoc(value)
      setSaved(JSON.stringify(value))
      setUpdatedAt(data?.updated_at ?? null)
    })
    return () => {
      alive = false
    }
  }, [def.key, defaults])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  async function publish(value: Doc) {
    setBusy(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from("sng-content").upsert({ key: def.key, value, updated_at: now })
    if (error) {
      setBusy(false)
      return toast(/relation|does not exist|schema cache/i.test(error.message) ? "La table sng-content n'existe pas : exécutez supabase/schema.sql." : error.message, true)
    }
    await fetch("/api/revalidate", { method: "POST", headers: { "Content-Type": "application/json", ...(await authHeader()) }, body: JSON.stringify({}) }).catch(() => {})
    setSaved(JSON.stringify(value))
    setUpdatedAt(now)
    setBusy(false)
    toast("Publié sur le site")
  }

  if (!doc) return <div className="loading-row">Chargement…</div>

  const sectionValue = (path?: string) => (path ? (doc[path] as Doc) : doc)
  const setField = (path: string | undefined, key: string, v: unknown) =>
    setDoc((d) => (path ? { ...d!, [path]: { ...(d![path] as Doc), [key]: v } } : { ...d!, [key]: v }))

  return (
    <>
      <Link href="/gestion/site" className="link" style={{ marginBottom: "0.8rem", display: "inline-flex" }}><ChevronLeft /> Contenu du site</Link>
      <PageHead icon={Pencil} title={def.title} sub={def.description}>
        <a href={def.href} target="_blank" className="btn btn-soft"><External /> Voir sur le site</a>
        <button className="btn btn-ghost" onClick={() => setConfirmReset(true)}>Valeurs d&apos;origine</button>
        <button className="btn btn-main" disabled={!dirty || busy} onClick={() => publish(doc)}>{busy ? "Publication…" : "Publier"}</button>
      </PageHead>

      <div className="editor-status">
        {dirty ? <span className="badge tone-warning">Modifications non publiées</span> : <span className="badge tone-success">À jour</span>}
        <span className="cell-sub">{updatedAt ? `Dernière publication : ${new Date(updatedAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}` : "Contenu d'origine (jamais modifié)"}</span>
      </div>

      <div className="editor">
        <nav className="editor-nav" aria-label="Sections">
          {def.sections.map((s, i) => (
            <a key={s.title} href={`#sec-${i}`}>{s.title}</a>
          ))}
        </nav>

        <div className="editor-sections">
          {def.sections.map((section, i) => (
            <section key={section.title} id={`sec-${i}`} className="card editor-card">
              <div className="card-head">
                <div>
                  <div className="card-title">{section.title}</div>
                  {section.description && <div className="card-sub">{section.description}</div>}
                </div>
              </div>
              <div className="card-body editor-fields">
                {section.fields.map((f) => (
                  <EditorField key={f.key} field={f} value={sectionValue(section.path)?.[f.key]} onChange={(v) => setField(section.path, f.key, v)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {dirty && (
        <div className="editor-bar">
          <span>Modifications non publiées</span>
          <button className="btn btn-soft btn-sm" onClick={() => setDoc(JSON.parse(saved))}>Annuler</button>
          <button className="btn btn-main btn-sm" disabled={busy} onClick={() => publish(doc)}>{busy ? "Publication…" : "Publier"}</button>
        </div>
      )}

      {confirmReset && (
        <Confirm
          title="Revenir au contenu d'origine ?"
          text="Les textes et images de cette page reprennent leurs valeurs d'origine. Rien n'est publié tant que vous ne cliquez pas sur Publier."
          confirmLabel="Rétablir"
          onConfirm={() => { setDoc(structuredClone(defaults)); setConfirmReset(false) }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </>
  )
}

function EditorField({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${field.key}`
  const label = (
    <label className="form-label" htmlFor={id}>
      {field.label}
      {"hint" in field && field.hint && <span className="field-hint"> — {field.hint}</span>}
    </label>
  )

  if (field.type === "image") return <div className="full">{label}<ImageField id={id} value={String(value ?? "")} onChange={onChange} /></div>
  if (field.type === "list") return <div className="full"><ListField field={field} value={Array.isArray(value) ? (value as Doc[]) : []} onChange={onChange} /></div>
  if (field.type === "tags") {
    const list = Array.isArray(value) ? (value as string[]) : []
    return (
      <div className="full">
        {label}
        <textarea id={id} className="form-textarea" rows={Math.max(3, list.length + 1)} value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trimStart()).filter((l, i, a) => l || i === a.length - 1))} />
      </div>
    )
  }
  if (field.type === "textarea") {
    return <div className="full">{label}<textarea id={id} className="form-textarea" rows={4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /></div>
  }
  return <div>{label}<input id={id} className="form-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /></div>
}

function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadFile(file, "photos"))
      toast("Image envoyée — pensez à publier")
    } catch (e) {
      toast((e as Error).message, true)
    }
    setBusy(false)
  }
  return (
    <div className="image-field">
      <div className="image-preview">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- static file or signed R2 redirect
          <img src={imgSrc(value)} alt="" />
        ) : (
          <span>Aucune image (illustration par défaut)</span>
        )}
        {busy && <span className="image-busy">Envoi…</span>}
      </div>
      <div className="image-actions">
        <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = "" }} />
        <button type="button" className="btn btn-soft btn-sm" disabled={busy} onClick={() => input.current?.click()}>{value ? "Remplacer l'image" : "Ajouter une image"}</button>
        {value && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")}><X /> Retirer</button>}
        <span className="cell-sub">JPEG, PNG ou WebP · 8 Mo maximum</span>
      </div>
    </div>
  )
}

function ListField({ field, value, onChange }: { field: Extract<FieldDef, { type: "list" }>; value: Doc[]; onChange: (v: Doc[]) => void }) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...value]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const blank = Object.fromEntries(field.fields.map((f) => [f.key, ""]))
  const titleKey = (field.fields.find((f) => f.type === "text") ?? field.fields[0]).key
  return (
    <div className="list-field">
      <div className="list-head">
        <span className="form-label" style={{ margin: 0 }}>{field.label} ({value.length})</span>
        <button type="button" className="btn btn-soft btn-sm" onClick={() => onChange([...value, blank])}><Plus /> Ajouter un(e) {field.itemLabel}</button>
      </div>
      {value.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-item-head">
            <span className="list-num">{i + 1}</span>
            <span className="cell-main list-title">{String(item[titleKey] || `${field.itemLabel} ${i + 1}`)}</span>
            <button type="button" className="bo-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Monter"><ChevronDown style={{ transform: "rotate(180deg)" }} /></button>
            <button type="button" className="bo-icon-btn" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Descendre"><ChevronDown /></button>
            <button type="button" className="bo-icon-btn danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Supprimer"><Trash /></button>
          </div>
          <div className="form-grid">
            {field.fields.map((f) => (
              <div key={f.key} className={f.type === "text" ? "" : "full"}>
                <label className="form-label" htmlFor={`${field.key}-${i}-${f.key}`}>{f.label}</label>
                {f.type === "image" ? (
                  <ImageField id={`${field.key}-${i}-${f.key}`} value={String(item[f.key] ?? "")} onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [f.key]: v } : it)))} />
                ) : f.type === "textarea" ? (
                  <textarea className="form-textarea" rows={2} value={String(item[f.key] ?? "")} onChange={(e) => onChange(value.map((it, j) => (j === i ? { ...it, [f.key]: e.target.value } : it)))} />
                ) : (
                  <input className="form-input" value={String(item[f.key] ?? "")} onChange={(e) => onChange(value.map((it, j) => (j === i ? { ...it, [f.key]: e.target.value } : it)))} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
