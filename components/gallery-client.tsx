"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SearchBar } from "@/components/shared/search-bar"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { GalleryItem } from "@/lib/db/types"

const categories = ["All", "Academic", "Sports", "Cultural", "Campus", "Ceremony"]
const types = ["All", "photo", "video"]

interface Props {
  gallery: GalleryItem[]
}

export function GalleryClient({ gallery }: Props) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [year, setYear] = useState("All")
  const [type, setType] = useState<"All" | "photo" | "video">("All")
  const [activeId, setActiveId] = useState<number | null>(null)

  const years = useMemo(
    () => ["All", ...Array.from(new Set(gallery.map((g) => g.year))).sort((a, b) => Number(b) - Number(a))],
    [gallery],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return gallery.filter((g) => {
      const matchQ = g.title.toLowerCase().includes(q) || (g.description || "").toLowerCase().includes(q)
      const matchC = category === "All" ? true : g.category === category
      const matchY = year === "All" ? true : g.year === year
      const matchT = type === "All" ? true : g.type === type
      return matchQ && matchC && matchY && matchT
    })
  }, [gallery, query, category, year, type])

  const active = filtered.find((g) => g.id === activeId)

  const getImageUrl = (url: string, title: string) => {
    if (!url) return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(title)}`
    // If it's a Supabase Storage URL or any http URL, use it directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }
    // If it's a blob URL or placeholder, keep it
    if (url.startsWith("blob:") || url.startsWith("/placeholder") || url.startsWith("/")) {
      return url
    }
    // Otherwise generate a placeholder
    return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(title)}`
  }

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
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
                  <p className="text-white text-sm font-semibold line-clamp-1">{g.title}</p>
                  <p className="text-white/70 text-xs mt-1">
                    {g.category} • {g.year}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items match your filters.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6 print:hidden lg:sticky lg:top-24 lg:h-fit">
          <div className="bg-card rounded-xl border shadow-sm p-5 space-y-5">
            <SearchBar value={query} onChange={setQuery} placeholder="Search gallery..." />

            <div>
              <p className="text-sm font-semibold mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      category === c ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Year</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      year === y ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent border-border"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Type</p>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t as "All" | "photo" | "video")}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      type === t ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent border-border"
                    }`}
                  >
                    {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                  setYear("All")
                  setType("All")
                }}
              >
                Clear all filters
              </button>
              <span className="text-sm text-muted-foreground">{filtered.length} items</span>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{active?.title || "Gallery Image"}</DialogTitle>
            <DialogDescription>{active?.description || "Gallery image preview"}</DialogDescription>
          </VisuallyHidden>
          {active && (
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={getImageUrl(active.image_url, active.title) || "/placeholder.svg"}
                  alt={active.title}
                  fill
                  className="object-contain bg-black"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>
              <div className="p-5 bg-card">
                <h3 className="font-semibold text-lg">{active.title}</h3>
                {active.description && <p className="text-muted-foreground mt-1">{active.description}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded">
                    {active.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{active.year}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
