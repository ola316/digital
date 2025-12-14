import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { QuickLinks } from "@/components/home/quick-links"
import { AnnouncementsPreview } from "@/components/home/announcements-preview"
import { EventsPreview } from "@/components/home/events-preview"
import { GalleryHighlights } from "@/components/home/gallery-highlights"
import { Stats } from "@/components/home/stats"

export const metadata = {
  title: "Oakwood Academy — Inspiring Excellence",
  description: "Modern school website for Oakwood Academy with events, announcements, and gallery.",
}

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <HeroCarousel />
          <QuickLinks />
          <AnnouncementsPreview />
          <EventsPreview />
          <GalleryHighlights />
          <Stats />
        </div>
      </main>
      <Footer />
    </div>
  )
}
