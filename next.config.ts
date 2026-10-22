import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // the quote page became the contact page
  redirects: async () => [{ source: "/devis", destination: "/contact", permanent: true }],
}

export default nextConfig
