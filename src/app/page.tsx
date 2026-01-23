import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { ProcessSection } from "@/components/landing/ProcessSection"
import { BenefitsSection } from "@/components/landing/BenefitsSection"
import { ContactSection } from "@/components/landing/ContactSection"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary scroll-smooth">
      <Navbar />
      <Hero />
      <ProcessSection />
      <BenefitsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
