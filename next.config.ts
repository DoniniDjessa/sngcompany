import type { NextConfig } from "next"

// photos of the SNG Elite Cars fleet are hosted in the Supabase storage (some are several MB):
// next/image resizes and compresses them
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : [],
  },
  // the quote page became the contact page
  redirects: async () => [{ source: "/devis", destination: "/contact", permanent: true }],
  // the backoffice is never indexed (it is reachable only by typing its address)
  headers: async () => [{ source: "/gestion/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }],
}

export default nextConfig
