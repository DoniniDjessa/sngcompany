import { NextResponse, type NextRequest } from "next/server"
import { deleteObject, isPublicKey, isValidKey, signDownload } from "@/lib/server/r2"
import { staffFromRequest } from "@/lib/server/supabase-admin"

// GET  ?key=photos/…   stable URL for <img src>: redirects to a short-lived signed URL (photos are public)
// POST { key, download? }  staff: signed URL of any file (documents included)
// DELETE ?key=…        staff: removes the file from the bucket

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? ""
  if (!isPublicKey(key) || !isValidKey(key)) return NextResponse.json({ error: "Clé invalide" }, { status: 400 })
  const res = NextResponse.redirect(await signDownload(key), 302)
  res.headers.set("Cache-Control", "public, max-age=240")
  return res
}

export async function POST(req: Request) {
  if (!(await staffFromRequest(req))) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  const { key, download } = await req.json().catch(() => ({}))
  if (typeof key !== "string" || !isValidKey(key)) return NextResponse.json({ error: "Clé invalide" }, { status: 400 })
  const name = download ? key.split("/").pop()!.replace(/^[0-9a-f-]{36}-/, "") : undefined
  return NextResponse.json({ url: await signDownload(key, name) })
}

export async function DELETE(req: NextRequest) {
  if (!(await staffFromRequest(req))) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  const key = req.nextUrl.searchParams.get("key") ?? ""
  if (!isValidKey(key)) return NextResponse.json({ error: "Clé invalide" }, { status: 400 })
  await deleteObject(key)
  return NextResponse.json({ ok: true })
}
