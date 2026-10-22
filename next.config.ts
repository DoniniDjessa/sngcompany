import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // the quote page became the contact page
  redirects: async () => [{ source: "/devis", destination: "/contact", permanent: true }],
  // the backoffice is never indexed (it is reachable only by typing its address)
  headers: async () => [{ source: "/gestion/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }],
}

export default nextConfig
