"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Globe, LogOut, Menu, Moon, Plus, Search, Settings, Sun } from "@/components/icons"
import { useTheme } from "@/components/theme"
import { signOut, useSession, type Session } from "@/lib/gestion/auth"
import { NAV, navTrail } from "@/lib/gestion/nav"
import { RESOURCES, newLabel } from "@/lib/gestion/resources"
import { SITE } from "@/lib/site"
import { getRows, load, useCollection } from "@/lib/store"
import { Toasts } from "./ui"

export default function Shell({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (session === null) router.replace("/gestion/login")
  }, [session, router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!session) return session === undefined ? <div className="loading-row" style={{ paddingTop: "30vh" }}>Chargement…</div> : null

  return (
    <div className="bo-layout">
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <Sidebar session={session} mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="bo-main">
        <Topbar session={session} onMenu={() => setMobileOpen(true)} onSearch={() => setSearchOpen(true)} />
        <main className="bo-content" id="contenu">{children}</main>
      </div>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
      <Toasts />
    </div>
  )
}

function Sidebar({ session, mobileOpen, onNavigate }: { session: Session; mobileOpen: boolean; onNavigate: () => void }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const newRequests = useCollection("demandes").filter((d) => d.status === "nouvelle").length

  return (
    <aside className={`bo-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="bo-brand">
        <span className="bo-brand-mark">SNG</span>
        {!collapsed && (
          <div className="bo-brand-text">
            <strong>{SITE.name}</strong>
            <small>Espace de gestion</small>
          </div>
        )}
        <button className="bo-icon-btn collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Déplier le menu" : "Replier le menu"} aria-expanded={!collapsed}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="bo-nav" aria-label="Menu principal" onClick={(e) => (e.target as HTMLElement).closest("a") && onNavigate()}>
        {NAV.map((group) => (
          <div key={group.label} className="nav-section">
            {!collapsed && <div className="nav-label">{group.label}</div>}
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/gestion" && pathname.startsWith(item.href + "/"))
              const count = item.countKey === "demandes" ? newRequests : 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  target={item.href === "/" ? "_blank" : undefined}
                >
                  <item.icon />
                  {!collapsed && <span>{item.label}</span>}
                  {count > 0 && <span className="nav-count">{count}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="bo-sidebar-foot">
        <div className="bo-user">
          <span className="avatar">{session.name.charAt(0)}</span>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="bo-user-name">{session.name}</div>
              <div className="bo-user-role">{session.role}</div>
            </div>
          )}
          {!collapsed && <button className="bo-icon-btn" onClick={signOut} title="Déconnexion" aria-label="Déconnexion"><LogOut /></button>}
        </div>
      </div>
    </aside>
  )
}

function Topbar({ session, onMenu, onSearch }: { session: Session; onMenu: () => void; onSearch: () => void }) {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const trail = navTrail(pathname)
  const newRequests = useCollection("demandes").filter((d) => d.status === "nouvelle").length
  const [menu, setMenu] = useState<"new" | "user" | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(null)
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  return (
    <header className="bo-topbar">
      <button className="bo-icon-btn bo-menu-btn" onClick={onMenu} aria-label="Ouvrir le menu"><Menu /></button>
      <div className="bo-crumbs">
        <span>{trail.group}</span>
        <ChevronRight />
        <strong>{trail.label}</strong>
      </div>

      <button type="button" className="bo-search" onClick={onSearch} aria-label="Rechercher (Ctrl+K)">
        <Search />
        <span>Rechercher client, référence, véhicule…</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="bo-topbar-actions" ref={ref} onClick={(e) => (e.target as HTMLElement).closest("a") && setMenu(null)}>
        <div className="bo-dropdown">
          <button className="btn btn-main btn-sm" onClick={() => setMenu(menu === "new" ? null : "new")} aria-expanded={menu === "new"}>
            <Plus /> <span className="hide-sm">Nouveau</span> <ChevronDown />
          </button>
          {menu === "new" && (
            <div className="bo-dropdown-panel" role="menu">
              {RESOURCES.filter((r) => r.refPrefix || r.slug === "clients").map((r) => (
                <Link key={r.slug} href={`/gestion/${r.slug}?new=1`} className="bo-dropdown-item" role="menuitem">
                  <r.icon /> {newLabel(r)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button className="bo-icon-btn" onClick={toggle} aria-label="Changer de thème">{theme === "dark" ? <Sun /> : <Moon />}</button>

        <Link href="/gestion/demandes" className="bo-icon-btn" aria-label={`Demandes : ${newRequests} nouvelle(s)`}>
          <Bell />
          {newRequests > 0 && <span className="dot-count">{newRequests > 9 ? "9+" : newRequests}</span>}
        </Link>

        <div className="bo-dropdown">
          <button className="bo-icon-btn" onClick={() => setMenu(menu === "user" ? null : "user")} aria-expanded={menu === "user"} aria-haspopup="menu">
            <span className="avatar">{session.name.charAt(0)}</span>
            <ChevronDown />
          </button>
          {menu === "user" && (
            <div className="bo-dropdown-panel" role="menu">
              <div className="bo-dropdown-head">
                <div className="cell-main">{session.name}</div>
                <div className="cell-sub">{session.email}</div>
              </div>
              <Link href="/gestion/parametres" className="bo-dropdown-item" role="menuitem"><Settings /> Paramètres</Link>
              <a href="/" target="_blank" className="bo-dropdown-item" role="menuitem"><Globe /> Voir le site</a>
              <button className="bo-dropdown-item" role="menuitem" onClick={signOut}><LogOut /> Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/** Ctrl+K: search every table by reference, name, plate… */
function GlobalSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [term, setTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [, setLoaded] = useState(0)
  useEffect(() => {
    inputRef.current?.focus()
    Promise.all(RESOURCES.map((r) => load(r.collection))).then(() => setLoaded((n) => n + 1))
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const results = useMemo(() => {
    const t = term.trim().toLowerCase()
    if (t.length < 2) return []
    return RESOURCES.flatMap((res) =>
      getRows(res.collection)
        .filter((r) => res.searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(t)))
        .slice(0, 4)
        .map((r) => ({ res, row: r, title: String(r.ref ?? r.name ?? r.code ?? `${r.brand} ${r.model}`), sub: String(r.client ?? r.phone ?? r.plate ?? r.city ?? "") })),
    ).slice(0, 12)
  }, [term])

  return (
    <div className="dialog-backdrop" style={{ alignItems: "flex-start", paddingTop: "12vh" }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" style={{ maxWidth: 560, padding: 0 }} role="dialog" aria-modal="true" aria-label="Recherche globale">
        <div className="search-field" style={{ maxWidth: "none", margin: 0 }}>
          <Search />
          <input ref={inputRef} className="form-input" style={{ border: 0, borderBottom: "1px solid rgb(var(--border))", borderRadius: 0, padding: "0.9rem 1rem 0.9rem 2.3rem", boxShadow: "none" }} value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Rechercher dans tous les modules…" />
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "0.3rem" }}>
          {term.trim().length < 2 ? (
            <p className="cell-sub" style={{ padding: "1rem" }}>Tapez au moins 2 caractères : référence, client, immatriculation…</p>
          ) : results.length === 0 ? (
            <p className="cell-sub" style={{ padding: "1rem" }}>Aucun résultat pour « {term} ».</p>
          ) : (
            results.map(({ res, row, title, sub }) => (
              <button key={`${res.slug}-${row.id}`} className="bo-dropdown-item" onClick={() => { router.push(`/gestion/${res.slug}`); onClose() }}>
                <res.icon />
                <span style={{ flex: 1 }}><span className="cell-main">{title}</span><span className="cell-sub">{sub}</span></span>
                <span className="badge tone-neutral">{res.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
