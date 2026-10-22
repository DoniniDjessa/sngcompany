"use client"
import { useSyncExternalStore } from "react"

// Light / dark theme on <html data-theme>, remembered in localStorage (set before paint in app/layout.tsx)
type Theme = "light" | "dark"
const listeners = new Set<() => void>()
const read = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light")

export function useTheme() {
  const theme = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    read,
    (): Theme => "light",
  )

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    try {
      localStorage.setItem("theme", next)
    } catch {}
    listeners.forEach((l) => l())
  }

  return { theme, toggle }
}
