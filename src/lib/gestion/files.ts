"use client"
import { authHeader } from "./auth"

// Files in R2: the database stores keys ("photos/2026-10/…-tucson.jpg"), never URLs.
export type Folder = "photos" | "documents"

/** Public URL of a photo, usable as <img src> */
export const photoUrl = (key: string) => `/api/storage/file?key=${encodeURIComponent(key)}`

/** File name shown to people (without the folder and the random prefix) */
export const fileName = (key: string) => key.split("/").pop()!.replace(/^[0-9a-f-]{36}-/, "")

async function api<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(await authHeader()), ...init.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Erreur ${res.status}`)
  return body as T
}

/** Uploads straight to R2 through a signed URL; returns the key to store */
export async function uploadFile(file: File, folder: Folder): Promise<string> {
  const { key, uploadUrl } = await api<{ key: string; uploadUrl: string }>("/api/storage/upload-url", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, folder }),
  })
  const put = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
  if (!put.ok) throw new Error(`Envoi de « ${file.name} » impossible (${put.status})`)
  return key
}

/** Opens a document (signed URL, staff only) */
export async function openFile(key: string, download = false) {
  const { url } = await api<{ url: string }>("/api/storage/file", { method: "POST", body: JSON.stringify({ key, download }) })
  window.open(url, "_blank", "noopener")
}

export async function removeFile(key: string) {
  await api(`/api/storage/file?key=${encodeURIComponent(key)}`, { method: "DELETE" })
}
