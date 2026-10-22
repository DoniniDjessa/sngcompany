import Navbar from "@/components/site/Navbar"
import Footer from "@/components/site/Footer"
import { GoToTop, Headlights, Intro, RevealOnScroll, WhatsAppWidget } from "@/components/site/Extras"
import { SiteProvider, type ClientService } from "@/components/site/SiteContext"
import { getContent } from "@/lib/content-server"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { company, services } = await getContent()
  // icons are components (functions): JSON drops them, the client takes them back by slug
  const clientServices = JSON.parse(JSON.stringify(services)) as ClientService[]
  return (
    <SiteProvider value={{ company, services: clientServices }}>
      <Navbar />
      {children}
      <Footer company={company} services={services} />
      <WhatsAppWidget />
      <GoToTop />
      <RevealOnScroll />
      <Headlights />
      <Intro />
    </SiteProvider>
  )
}
