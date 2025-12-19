"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SearchBar } from "@/components/shared/search-bar"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }
    if (url.startsWith("blob:") || url.startsWith("/placeholder") || url.startsWith("/")) {
      return url
    }
    return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(title)}`
  }

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={getImageUrl(g.image_url, g.title) || "/placeholder.svg"}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {g.type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {g.type === "video" ? "Video" : "Photo"}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                  <p className="text-white text-base font-semibold line-clamp-1">{g.title}</p>
                  <p className="text-white/80 text-sm mt-1.5">
                    {g.category} • {g.year}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No items match your filters.</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6 print:hidden lg:sticky lg:top-24 lg:h-fit">
          <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6">
            <SearchBar value={query} onChange={setQuery} placeholder="Search gallery..." />

            <div>
              <p className="text-sm font-semibold mb-3 text-foreground">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      category === c
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "hover:bg-accent border-border hover:border-emerald-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3 text-foreground">Year</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      year === y
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "hover:bg-accent border-border hover:border-emerald-300"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3 text-foreground">Type</p>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t as "All" | "photo" | "video")}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                      type === t
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "hover:bg-accent border-border hover:border-emerald-300"
                    }`}
                  >
                    {t === "photo" && <ImageIcon className="h-3.5 w-3.5" />}
                    {t === "video" && <Video className="h-3.5 w-3.5" />}
                    {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <button
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                  setYear("All")
                  setType("All")
                }}
              >
                Clear all filters
              </button>
              <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {filtered.length} items
              </span>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{active?.title || "Gallery Image"}</DialogTitle>
            <DialogDescription>{active?.description || "Gallery image preview"}</DialogDescription>
          </VisuallyHidden>
          {active && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActiveId(null)}
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                <span className="sr-only">Close</span>
              </Button>

              <div className="relative aspect-[16/10] w-full rounded-t-xl overflow-hidden">
                <Image
                  src={getImageUrl(active.image_url, active.title) || "/placeholder.svg"}
                  alt={active.title}
                  fill
                  className="object-contain bg-black"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  priority
                />
              </div>
              <div className="p-6 bg-card rounded-b-xl">
                <h3 className="font-bold text-xl text-foreground">{active.title}</h3>
                {active.description && (
                  <p className="text-muted-foreground mt-2 leading-relaxed">{active.description}</p>
                )}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full">
                    {active.category}
                  </span>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                    {active.year}
                  </span>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-full flex items-center gap-1">
                    {active.type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {active.type === "video" ? "Video" : "Photo"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
