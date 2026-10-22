"use client"
import { useEffect, useSyncExternalStore } from "react"
import { supabase } from "./supabase"

// Backoffice data, read from Supabase ("sng-*" tables) and kept in a small in-memory cache shared by
// every page: a table is fetched once, refreshed when the tab comes back, and updated after each save.

export type Row = { id: string; created_at: string; [key: string]: unknown }

export const TABLES = {
  clients: "sng-clients",
  demandes: "sng-demandes",
  /** the fleet is the SNG Elite Cars table, shared with the rental site */
  vehicules: "cars",
  locations: "sng-locations",
  transports: "sng-transports",
  equipements: "sng-equipements",
  locations_equipement: "sng-locations-equipement",
  lavages: "sng-lavages",
  lots: "sng-lots",
  ventes_elevage: "sng-ventes-elevage",
  factures: "sng-factures",
} as const
export type CollectionName = keyof typeof TABLES

type Status = "idle" | "loading" | "ready" | "error"
type Entry = { rows: Row[]; status: Status; error?: string; promise?: Promise<void> }
const EMPTY: Row[] = []
const IDLE: Entry = { rows: EMPTY, status: "idle" }
let cache = new Map<CollectionName, Entry>()
const listeners = new Set<() => void>()

const entry = (name: CollectionName) => cache.get(name) ?? IDLE
function patch(name: CollectionName, next: Partial<Entry>) {
  cache.set(name, { ...entry(name), ...next })
  listeners.forEach((l) => l())
}

let refreshing = false
function subscribe(l: () => void) {
  listeners.add(l)
  if (!refreshing && typeof document !== "undefined") {
    refreshing = true
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") cache.forEach((e, name) => e.status === "ready" && load(name, true))
    })
  }
  return () => listeners.delete(l)
}

export function load(name: CollectionName, force = false): Promise<void> {
  const e = entry(name)
  if (!force && e.promise && e.status !== "error") return e.promise
  const promise = (async () => {
    const { data, error } = await supabase.from(TABLES[name]).select("*").order("created_at", { ascending: false }).limit(5000)
    if (error) patch(name, { status: "error", error: error.message })
    else patch(name, { rows: data as Row[], status: "ready", error: undefined })
  })()
  patch(name, { status: e.status === "ready" ? "ready" : "loading", promise })
  return promise
}

/** Live rows of a table, newest first (empty while loading) */
export function useCollection<T extends Row = Row>(name: CollectionName): T[] {
  useEffect(() => {
    load(name)
  }, [name])
  return useSyncExternalStore(subscribe, () => entry(name).rows as T[], () => EMPTY as T[])
}

export function useCollectionStatus(name: CollectionName) {
  const status = useSyncExternalStore(subscribe, () => entry(name).status, () => "idle" as Status)
  const error = useSyncExternalStore(subscribe, () => entry(name).error, () => undefined)
  return { loading: status === "idle" || status === "loading", error }
}

export const getRows = (name: CollectionName) => entry(name).rows

/** Empty strings become null (dates and numbers refuse ""), id / created_at are never written */
function clean(values: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(values)) {
    if (k === "id" || k === "created_at") continue
    out[k] = v === "" ? null : v
  }
  return out
}

function friendly(message: string) {
  if (/duplicate key/i.test(message)) return "Cette valeur existe déjà (référence, code ou immatriculation en double)."
  if (/row-level security|permission denied/i.test(message)) return "Action non autorisée pour ce compte."
  return message
}

/** Insert (no id) or update (id); the database sets id, created_at and the reference */
export async function saveRow(name: CollectionName, values: Record<string, unknown>): Promise<Row> {
  const table = supabase.from(TABLES[name])
  const id = values.id as string | undefined
  const { data, error } = id ? await table.update(clean(values)).eq("id", id).select().single() : await table.insert(clean(values)).select().single()
  if (error) throw new Error(friendly(error.message))
  const row = data as Row
  const rows = entry(name).rows
  patch(name, { rows: id ? rows.map((r) => (r.id === id ? row : r)) : [row, ...rows] })
  return row
}

export async function deleteRow(name: CollectionName, id: string) {
  const { error } = await supabase.from(TABLES[name]).delete().eq("id", id)
  if (error) throw new Error(friendly(error.message))
  patch(name, { rows: entry(name).rows.filter((r) => r.id !== id) })
}

/** Forget everything (sign out) */
export function clearStore() {
  cache = new Map()
  listeners.forEach((l) => l())
}
