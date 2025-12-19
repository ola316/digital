import Image from "next/image"
import Link from "next/link"
import { getGalleryItems } from "@/lib/db/actions"

function getImageUrl(url: string, title: string) {
  if (!url) return `/placeholder.svg?height=240&width=400&query=${encodeURIComponent(title)}`
  // Handle Supabase Storage URLs and other http URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  if (url.startsWith("blob:") || url.startsWith("/placeholder") || url.startsWith("/")) {
    return url
  }
  return `/placeholder.svg?height=240&width=400&query=${encodeURIComponent(title)}`
}

export async function GalleryHighlights() {
  const gallery = await getGalleryItems({ featured: true })
  const highlights = gallery.slice(0, 6)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gallery Highlights</h2>
        <Link
          href="/gallery"
          className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Explore gallery →
        </Link>
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.length === 0 && (
          <p className="text-muted-foreground col-span-3 text-center py-8">No gallery items yet.</p>
        )}
        {highlights.map((g) => (
          <Link
            key={g.id}
            href={`/gallery?focus=${g.id}`}
            className="group relative rounded-xl overflow-hidden border bg-card shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={getImageUrl(g.image_url, g.title) || "/placeholder.svg"}
                alt={g.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <p className="text-white font-semibold">{g.title}</p>
              <p className="text-white/70 text-sm mt-1">{g.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
