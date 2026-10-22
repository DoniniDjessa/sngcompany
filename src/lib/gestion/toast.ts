"use client"
import { useEffect, useState } from "react"

// Short confirmation messages ("Enregistré", "Supprimé"), shown bottom right by <Toasts />
type Toast = { id: number; text: string; error?: boolean }
let items: Toast[] = []
const listeners = new Set<(t: Toast[]) => void>()

export function toast(text: string, error = false) {
  const t = { id: Date.now() + Math.random(), text, error }
  items = [...items, t]
  listeners.forEach((l) => l(items))
  setTimeout(() => {
    items = items.filter((i) => i.id !== t.id)
    listeners.forEach((l) => l(items))
  }, error ? 6000 : 2800)
}

export function useToasts() {
  const [list, setList] = useState<Toast[]>(items)
  useEffect(() => {
    listeners.add(setList)
    return () => {
      listeners.delete(setList)
    }
  }, [])
  return list
}
