"use client"
import { notFound, useParams } from "next/navigation"
import ContentEditor from "@/components/gestion/ContentEditor"
import { docDef } from "@/lib/content"

// /gestion/site/accueil · /gestion/site/entreprise · /gestion/site/<slug d'activité>
const KEYS: Record<string, string> = { accueil: "home", entreprise: "company" }

export default function EditContentPage() {
  const { doc } = useParams<{ doc: string }>()
  const def = docDef(KEYS[doc] ?? `service:${doc}`)
  if (!def) notFound()
  return <ContentEditor key={def.key} def={def} />
}
