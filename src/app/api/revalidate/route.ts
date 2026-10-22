import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { CONTENT_TAG } from "@/lib/content"
import { staffFromRequest } from "@/lib/server/supabase-admin"

// Staff: publish right away what was just saved (site content or catalogue)
export async function POST(req: Request) {
  if (!(await staffFromRequest(req))) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  const { tag } = await req.json().catch(() => ({}))
  const target = tag === "sng-catalogue" ? "sng-catalogue" : CONTENT_TAG
  revalidateTag(target, { expire: 0 })
  return NextResponse.json({ ok: true, tag: target })
}
