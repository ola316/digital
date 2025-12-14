import Image from "next/image"
import Link from "next/link"
import { getGalleryItems } from "@/lib/db/actions"

export async function GalleryHighlights() {
  const gallery = await getGalleryItems({ featured: true })
  const highlights = gallery.slice(0, 6)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery Highlights</h2>
        <Link href="/gallery" className="text-sm text-emerald-700 hover:underline dark:text-emerald-300">
          Explore gallery
        </Link>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {highlights.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No gallery items yet.</p>}
        {highlights.map((g) => (
          <Link key={g.id} href={`/gallery?focus=${g.id}`} className="group relative rounded-lg overflow-hidden border">
            <div className="relative h-36">
              <Image
                src={g.image_url || "/placeholder.svg?height=144&width=256&query=school gallery"}
                alt={g.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-sm font-medium">{g.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
