"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Building, ChevronRight, Dashboard, Pencil } from "@/components/icons"
import { PageHead } from "@/components/gestion/ui"
import { DEFAULT_HOME, imgSrc, mergeContent, serviceDefaults } from "@/lib/content"
import { SERVICES } from "@/lib/services"
import { supabase } from "@/lib/supabase"

type Saved = Record<string, { value: Record<string, unknown>; updated_at: string }>

// Overview of everything editable on the public site
export default function SiteContentPage() {
  const [saved, setSaved] = useState<Saved>({})
  useEffect(() => {
    supabase.from("sng-content").select("key, value, updated_at").then(({ data }) => {
      setSaved(Object.fromEntries((data ?? []).map((r) => [r.key, { value: r.value, updated_at: r.updated_at }])))
    })
  }, [])

  const when = (key: string) =>
    saved[key] ? `Modifié le ${new Date(saved[key].updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}` : "Contenu d'origine"
  const home = mergeContent(DEFAULT_HOME, saved.home?.value)

  return (
    <>
      <PageHead icon={Pencil} title="Contenu du site" sub="Modifiez les textes et les images du site public. Chaque page se publie en un clic." />

      <div className="content-grid">
        <Link href="/gestion/site/accueil" className="content-card wide">
          <div className="content-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- static file or signed R2 redirect */}
            {home.hero.slides[0]?.image ? <img src={imgSrc(home.hero.slides[0].image)} alt="" /> : <Dashboard />}
          </div>
          <div className="content-info">
            <strong>Page d&apos;accueil</strong>
            <span>Carrousel, chiffres clés, à propos, engagements, étapes, bannière, contact</span>
            <small>{when("home")}</small>
          </div>
          <ChevronRight />
        </Link>

        <Link href="/gestion/site/entreprise" className="content-card wide">
          <div className="content-thumb icon"><Building /></div>
          <div className="content-info">
            <strong>Entreprise & coordonnées</strong>
            <span>Nom, téléphones, e-mail, adresse, horaires — affichés sur tout le site</span>
            <small>{when("company")}</small>
          </div>
          <ChevronRight />
        </Link>
      </div>

      <h2 className="content-group">Pages des activités</h2>
      <div className="content-grid">
        {SERVICES.map((s) => {
          const c = mergeContent(serviceDefaults(s.slug), saved[`service:${s.slug}`]?.value)
          return (
            <Link key={s.slug} href={`/gestion/site/${s.slug}`} className="content-card">
              <div className="content-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element -- static file or signed R2 redirect */}
                {c.image ? <img src={imgSrc(c.image)} alt="" /> : <s.icon />}
              </div>
              <div className="content-info">
                <strong>{c.name}</strong>
                <span>{c.tagline}</span>
                <small>{when(`service:${s.slug}`)}</small>
              </div>
              <ChevronRight />
            </Link>
          )
        })}
      </div>
    </>
  )
}
