import { NextResponse } from "next/server"
import { buildKey, FOLDERS, signUpload, type Folder } from "@/lib/server/r2"
import { staffFromRequest } from "@/lib/server/supabase-admin"

// Staff only: presigned PUT URL (type and exact size are part of the signature, R2 rejects anything else)
export async function POST(req: Request) {
  if (!(await staffFromRequest(req))) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { filename, contentType, size, folder } = await req.json().catch(() => ({}))
  if (typeof filename !== "string" || typeof contentType !== "string" || typeof size !== "number" || size <= 0) {
    return NextResponse.json({ error: "filename, contentType et size requis" }, { status: 400 })
  }
  const rules = FOLDERS[folder as Folder]
  if (!rules) return NextResponse.json({ error: "Dossier invalide" }, { status: 400 })
  if (!(rules.types as readonly string[]).includes(contentType)) {
    return NextResponse.json({ error: "Type de fichier non accepté." }, { status: 415 })
  }
  if (size > rules.maxBytes) {
    return NextResponse.json({ error: `Fichier trop volumineux (${rules.maxBytes / 1024 / 1024} Mo maximum).` }, { status: 413 })
  }

  const key = buildKey(folder as Folder, filename)
  return NextResponse.json({ key, uploadUrl: await signUpload(key, contentType, size) })
}
