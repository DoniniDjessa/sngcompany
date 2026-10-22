"use client"
import { notFound, useParams } from "next/navigation"
import { Suspense } from "react"
import ResourcePage from "@/components/gestion/ResourcePage"
import { resourceBySlug } from "@/lib/gestion/resources"

export default function ModulePage() {
  const { resource } = useParams<{ resource: string }>()
  const res = resourceBySlug(resource)
  if (!res) notFound()
  return (
    <Suspense>
      <ResourcePage key={res.slug} res={res} />
    </Suspense>
  )
}
