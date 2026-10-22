import type { Metadata } from "next"
import "./gestion.css"

export const metadata: Metadata = {
  title: { default: "Gestion", template: "%s · Gestion SNG" },
  robots: { index: false, follow: false },
}

export default function GestionRoot({ children }: { children: React.ReactNode }) {
  return <div className="bo">{children}</div>
}
