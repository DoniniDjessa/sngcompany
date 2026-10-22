"use client"
import { useSyncExternalStore } from "react"
import type { Session as AuthSession } from "@supabase/supabase-js"
import { clearStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"

// Backoffice session = a Supabase Auth user listed in "sng-staff".
// The Supabase project is shared with other apps: an account without a staff row is signed out.
export interface Session {
  userId: string
  email: string
  name: string
  role: string
}

type State = { session: Session | null | undefined; error: string | null }
let state: State = { session: undefined, error: null }
const listeners = new Set<() => void>()
let started = false

function set(next: Partial<State>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

async function resolve(auth: AuthSession | null) {
  if (!auth) return set({ session: null })
  const { data } = await supabase.from("sng-staff").select("name, role, email").eq("user_id", auth.user.id).maybeSingle()
  if (!data) {
    await supabase.auth.signOut()
    return set({ session: null, error: "Ce compte n'a pas accès à l'espace de gestion SNG." })
  }
  set({ session: { userId: auth.user.id, email: data.email, name: data.name, role: data.role }, error: null })
}

function start() {
  if (started) return
  started = true
  supabase.auth.getSession().then(({ data }) => resolve(data.session))
  supabase.auth.onAuthStateChange((event, auth) => {
    // deferred: Supabase calls inside this callback would wait on the auth lock
    if (event === "SIGNED_OUT") setTimeout(() => { clearStore(); set({ session: null }) })
    else if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && auth && auth.user.id !== state.session?.userId) setTimeout(() => resolve(auth))
  })
}

function subscribe(l: () => void) {
  start()
  listeners.add(l)
  return () => listeners.delete(l)
}

/** undefined while checking, null when signed out */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, () => state.session, () => undefined)
}

export function useAuthError() {
  return useSyncExternalStore(subscribe, () => state.error, () => null)
}

export async function signIn(email: string, password: string): Promise<string | null> {
  set({ error: null })
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error) return error.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : error.message
  await resolve(data.session)
  return state.error
}

/** Opens a session received from the server (quick access by code), then checks the staff row.
 *  Done directly: setSession does not always emit the SIGNED_IN event the listener waits for. */
export async function adoptSession(tokens: { access_token: string; refresh_token: string }): Promise<string | null> {
  set({ error: null })
  const { data, error } = await supabase.auth.setSession(tokens)
  if (error || !data.session) return error?.message ?? "Session invalide."
  await resolve(data.session)
  return state.error
}

export async function signOut() {
  await supabase.auth.signOut()
}

/** Header for our API routes (uploads, staff management) */
export async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}
}
