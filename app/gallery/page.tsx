import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getGalleryItems } from "@/lib/db/actions"
import { GalleryClientWrapper } from "@/components/gallery-client-wrapper"

export const metadata = {
  title: "Gallery — Oakwood Academy",
  description: "Explore photos and videos from Oakwood Academy.",
}

export default async function GalleryPage() {
  const gallery = await getGalleryItems()

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
            <p className="text-muted-foreground">Explore photos and videos from across our community.</p>
          </header>
          <GalleryClientWrapper gallery={gallery} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
