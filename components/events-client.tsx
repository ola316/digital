"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CalendarDays, MapPin, List, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/shared/search-bar"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/db/types"

const categories = ["All", "Academic", "Sports", "Cultural", "Community", "General"]

function getImageUrl(url: string | null, title: string) {
  if (!url) return `/placeholder.svg?height=160&width=320&query=${encodeURIComponent(title)}`
  if (url.startsWith("blob:") || url.startsWith("/placeholder")) {
    return url
  }
  if (url.startsWith("http")) {
    return url
  }
  return `/placeholder.svg?height=160&width=320&query=${encodeURIComponent(title)}`
}

interface Props {
  events: Event[]
}

function ListView({ events, query, category }: { events: Event[]; query: string; category: string }) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return events
      .filter((e) => {
        const matchesQ =
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
        const matchesC = category === "All" ? true : e.category === category
        return matchesQ && matchesC
      })
      .sort((a, b) => +new Date(a.event_date) - +new Date(b.event_date))
  }, [events, query, category])

  return (
    <div className="grid gap-4">
      {filtered.map((e) => (
        <div key={e.id} className="grid md:grid-cols-[200px_1fr] gap-4 rounded-lg border overflow-hidden bg-card">
          <div className="relative h-40 md:h-full">
            <Image
              src={getImageUrl(e.image_url, e.title) || "/placeholder.svg"}
              alt={e.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-lg leading-tight">{e.title}</h3>
              <span className="text-xs border rounded px-2 py-0.5">{e.category}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
            <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> {new Date(e.event_date).toLocaleDateString()} • {e.event_time}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {e.location}
              </span>
            </div>
            <div className="mt-4">
              <Link href={`/events?focus=${e.id}`} className="text-emerald-700 hover:underline dark:text-emerald-300">
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">No events found.</p>}
    </div>
  )
}

function CalendarView({ events, query, category }: { events: Event[]; query: string; category: string }) {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const days = Array.from({ length: lastDay.getDate() }).map(
    (_, i) => new Date(now.getFullYear(), now.getMonth(), i + 1),
  )
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return events.filter((e) => {
      const matchesQ =
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      const matchesC = category === "All" ? true : e.category === category
      return matchesQ && matchesC
    })
  }, [events, query, category])

  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: firstDay.getDay() }).map((_, i) => (
        <div key={`pad-start-${i}`} className="rounded-lg border bg-muted/30 aspect-square" />
      ))}
      {days.map((d) => {
        const dayEvents = filtered.filter((e) => {
          const ed = new Date(e.event_date)
          return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate()
        })
        return (
          <div key={`day-${d.getDate()}`} className="rounded-lg border p-2 bg-card aspect-square overflow-auto">
            <div className="text-xs font-medium">{d.getDate()}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/events?focus=${e.id}`}
                  className="block text-xs rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-1 py-0.5"
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function EventsClient({ events }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [view, setView] = useState<"list" | "calendar">("list")

  const focus = searchParams.get("focus")

  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Explore upcoming and past events at Oakwood Academy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className={cn(view === "list" ? "bg-emerald-600 hover:bg-emerald-700" : "hover:text-emerald-700")}
          >
            <List className="h-4 w-4 mr-2" /> List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className={cn(view === "calendar" ? "bg-emerald-600 hover:bg-emerald-700" : "hover:text-emerald-700")}
          >
            <Calendar className="h-4 w-4 mr-2" /> Calendar
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-[1fr_240px] gap-6">
        <div>
          {view === "list" ? (
            <ListView events={events} query={query} category={category} />
          ) : (
            <CalendarView events={events} query={query} category={category} />
          )}
        </div>
        <aside className="space-y-4 print:hidden">
          <SearchBar value={query} onChange={setQuery} placeholder="Search events..." />
          <div className="space-y-2">
            <p className="text-sm font-medium">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded border",
                    category === c ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-accent",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                setCategory("All")
              }}
            >
              Clear filters
            </Button>
          </div>
        </aside>
      </section>
    </>
  )
}
