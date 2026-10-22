import Navbar from "@/components/site/Navbar"
import Footer from "@/components/site/Footer"
import RoadThread from "@/components/site/RoadThread"
import { GoToTop, Headlights, Intro, RevealOnScroll, WhatsAppWidget } from "@/components/site/Extras"
import { SiteProvider, type ClientService } from "@/components/site/SiteContext"
import { getContent } from "@/lib/content-server"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { company, services } = await getContent()
  // icons are components (functions): JSON drops them, the client takes them back by slug
  const clientServices = JSON.parse(JSON.stringify(services)) as ClientService[]
  return (
    <SiteProvider value={{ company, services: clientServices }}>
      {/* first visit of the session (full intro) or reload (short intro): flag it before the page paints */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=document.documentElement.classList,n=performance.getEntriesByType('navigation')[0];if(!sessionStorage.getItem('sng-intro'))c.add('sng-intro');else if(n&&n.type==='reload')c.add('sng-intro','sng-intro-quick');}catch(e){}})();`,
        }}
      />
      <Navbar />
      {children}
      <Footer company={company} services={services} />
      <RoadThread tone="orange" />
      <WhatsAppWidget />
      <GoToTop />
      <RevealOnScroll />
      <Headlights />
      <Intro />
    </SiteProvider>
  )
}
