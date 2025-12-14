"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SearchBar } from "@/components/shared/search-bar"
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
      const matchQ = g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      const matchC = category === "All" ? true : g.category === category
      const matchY = year === "All" ? true : g.year === year
      const matchT = type === "All" ? true : g.media_type === type
      return matchQ && matchC && matchY && matchT
    })
  }, [gallery, query, category, year, type])

  const active = filtered.find((g) => g.id === activeId)

  return (
    <>
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className="group relative rounded-lg overflow-hidden border"
              >
                <div className="relative h-40">
                  <Image
                    src={g.image_url || "/placeholder.svg?height=160&width=256&query=school gallery"}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs font-medium">{g.title}</p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground mt-6">No items match your filters.</p>}
        </div>
        <aside className="space-y-4 print:hidden">
          <SearchBar value={query} onChange={setQuery} placeholder="Search gallery..." />
          <div>
            <p className="text-sm font-medium mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-sm px-3 py-1.5 rounded border ${category === c ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Year</p>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`text-sm px-3 py-1.5 rounded border ${year === y ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as "All" | "photo" | "video")}
                  className={`text-sm px-3 py-1.5 rounded border ${type === t ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button
              className="text-sm px-3 py-1.5 rounded border hover:bg-accent"
              onClick={() => {
                setQuery("")
                setCategory("All")
                setYear("All")
                setType("All")
              }}
            >
              Clear filters
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Results: {filtered.length}</p>
        </aside>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-3xl" aria-describedby={undefined}>
          {active && (
            <div className="space-y-3">
              <div className="relative h-[360px] rounded-lg overflow-hidden">
                <Image
                  src={active.image_url || "/placeholder.svg?height=360&width=640&query=school gallery"}
                  alt={active.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{active.title}</h3>
                <p className="text-sm text-muted-foreground">{active.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {active.category} • {active.year}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
