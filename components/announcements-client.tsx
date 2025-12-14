"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/shared/search-bar"
import type { Announcement } from "@/lib/db/types"

const categories = ["All", "General", "Academic", "Sports", "Cultural"]

interface Props {
  announcements: Announcement[]
}

export function AnnouncementsClient({ announcements }: Props) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return announcements.filter((a) => {
      const matchQ = a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
      const matchC = category === "All" ? true : a.category === category
      return matchQ && matchC
    })
  }, [announcements, query, category])

  return (
    <section className="grid md:grid-cols-[1fr_240px] gap-6">
      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="rounded-lg border p-4 bg-card">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-tight">
                <Link href={`/announcements/${a.id}`} className="hover:underline">
                  {a.title}
                </Link>
              </h3>
              <Badge variant="outline">{a.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{a.excerpt}</p>
            <p className="text-xs text-muted-foreground mt-2">
              By {a.author} • {new Date(a.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No announcements found.</p>}
      </div>
      <aside className="space-y-4 print:hidden">
        <SearchBar value={query} onChange={setQuery} placeholder="Search announcements..." />
        <div className="space-y-2">
          <p className="text-sm font-medium">Category</p>
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
          <button
            className="text-sm px-3 py-1.5 rounded border hover:bg-accent"
            onClick={() => {
              setQuery("")
              setCategory("All")
            }}
          >
            Clear filters
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Results: {filtered.length}</p>
      </aside>
    </section>
  )
}
