import Navbar from "@/components/site/Navbar"
import Footer from "@/components/site/Footer"
import { GoToTop, RevealOnScroll, WhatsAppWidget } from "@/components/site/Extras"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppWidget />
      <GoToTop />
      <RevealOnScroll />
    </>
  )
}
