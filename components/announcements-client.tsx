"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/shared/search-bar"
import { Bell, User, Calendar, ChevronRight, Megaphone, X } from "lucide-react"
import type { Announcement } from "@/lib/db/types"

const categories = ["All", "General", "Academic", "Sports", "Cultural"]

const categoryColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Academic: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Sports: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Cultural: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
}

interface Props {
  announcements: Announcement[]
}

export function AnnouncementsClient({ announcements }: Props) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return announcements.filter((a) => {
      const matchQ = a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
      const matchC = category === "All" ? true : a.category === category
      return matchQ && matchC
    })
  }, [announcements, query, category])

  return (
    <>
      <section className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* Main Content */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No announcements found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}

          {filtered.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAnnouncement(a)}
              className="group relative rounded-xl border bg-card p-5 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-emerald-500/50"
            >
              {/* Featured indicator */}
              {a.featured && (
                <div className="absolute -top-2 -right-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                    <Bell className="h-3 w-3" />
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={categoryColors[a.category] || "bg-gray-100 text-gray-800"}>{a.category}</Badge>
                    {a.featured && <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Featured</Badge>}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {a.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {a.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 print:hidden">
          <div className="rounded-xl border bg-card p-4">
            <SearchBar value={query} onChange={setQuery} placeholder="Search announcements..." />
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h4 className="text-sm font-semibold">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 ${
                    category === c
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "hover:bg-accent hover:border-emerald-500/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Results</span>
              <span className="text-sm font-semibold text-emerald-600">{filtered.length}</span>
            </div>
            {(query || category !== "All") && (
              <button
                className="w-full text-sm px-4 py-2 rounded-full border hover:bg-accent transition-colors"
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>
      </section>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={categoryColors[selectedAnnouncement.category] || "bg-gray-100 text-gray-800"}>
                  {selectedAnnouncement.category}
                </Badge>
                {selectedAnnouncement.featured && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Featured</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedAnnouncement.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedAnnouncement.created_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="prose prose-emerald dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedAnnouncement.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
