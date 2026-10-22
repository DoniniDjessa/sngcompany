import type { Metadata } from "next"
import { Boldonse, Outfit, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { SITE } from "@/lib/site"

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-outfit" })
const boldonse = Boldonse({ subsets: ["latin"], weight: "400", variable: "--font-boldonse" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Location de véhicules, transport, équipements, lavage & élevage`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "SNG Company",
    "location de véhicules Abidjan",
    "location voiture avec chauffeur",
    "déménagement Abidjan",
    "livraison Abidjan",
    "location groupe électrogène",
    "location chapiteau",
    "lavage auto à domicile",
    "élevage poulets œufs Abidjan",
    "Côte d'Ivoire",
  ],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/bg-cars.webp", alt: SITE.name }],
  },
  icons: { icon: "/logo-sng.png", apple: "/logo-sng.png" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${outfit.variable} ${jakarta.variable} ${boldonse.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t)d.setAttribute('data-theme',t);}catch(e){}try{if(location.pathname.indexOf('/gestion')!==0&&!sessionStorage.getItem('sng-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('sng-intro');}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  )
}
