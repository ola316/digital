"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { CalendarDays, MapPin, List, Calendar, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
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

function ListView({
  events,
  query,
  category,
  onSelect,
}: { events: Event[]; query: string; category: string; onSelect: (id: number) => void }) {
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
    <div className="grid gap-5">
      {filtered.map((e) => (
        <button
          key={e.id}
          onClick={() => onSelect(e.id)}
          className="grid md:grid-cols-[220px_1fr] gap-0 rounded-2xl border border-border/50 overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-left"
        >
          <div className="relative h-48 md:h-full">
            <Image
              src={getImageUrl(e.image_url, e.title) || "/placeholder.svg"}
              alt={e.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {e.category}
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg leading-tight text-foreground">{e.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
            <div className="mt-4 text-sm text-muted-foreground flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {new Date(e.event_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {e.event_time}
              </span>
              <span className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {e.location}
              </span>
            </div>
          </div>
        </button>
      ))}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">No events found.</p>
          <p className="text-muted-foreground/70 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}

function CalendarView({
  events,
  query,
  category,
  onSelect,
}: { events: Event[]; query: string; category: string; onSelect: (id: number) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const days = Array.from({ length: lastDay.getDate() }).map(
    (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1),
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

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-card rounded-2xl border shadow-lg p-4">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-bold text-lg">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay.getDay() }).map((_, i) => (
          <div key={`pad-start-${i}`} className="rounded-xl bg-muted/20 aspect-square" />
        ))}
        {days.map((d) => {
          const dayEvents = filtered.filter((e) => {
            const ed = new Date(e.event_date)
            return (
              ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate()
            )
          })
          const isToday = d.toDateString() === new Date().toDateString()
          return (
            <div
              key={`day-${d.getDate()}`}
              className={cn(
                "rounded-xl border p-2 bg-card aspect-square overflow-auto transition-all hover:shadow-md",
                isToday && "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30",
              )}
            >
              <div className={cn("text-xs font-semibold mb-1", isToday && "text-emerald-600 dark:text-emerald-400")}>
                {d.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e.id)}
                    className="block w-full text-left text-[10px] rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 px-1.5 py-1 truncate hover:bg-emerald-200 dark:hover:bg-emerald-900/70 transition-colors"
                  >
                    {e.title}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function EventsClient({ events }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [view, setView] = useState<"list" | "calendar">("list")
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const selectedEvent = events.find((e) => e.id === selectedEventId)

  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Explore upcoming and past events at Oakwood Academy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className={cn(
              "rounded-full",
              view === "list"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "hover:text-emerald-700 hover:border-emerald-300",
            )}
          >
            <List className="h-4 w-4 mr-2" /> List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className={cn(
              "rounded-full",
              view === "calendar"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "hover:text-emerald-700 hover:border-emerald-300",
            )}
          >
            <Calendar className="h-4 w-4 mr-2" /> Calendar
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-[1fr_280px] gap-8">
        <div>
          {view === "list" ? (
            <ListView events={events} query={query} category={category} onSelect={setSelectedEventId} />
          ) : (
            <CalendarView events={events} query={query} category={category} onSelect={setSelectedEventId} />
          )}
        </div>
        <aside className="space-y-5 print:hidden">
          <div className="bg-card rounded-2xl border shadow-lg p-5 space-y-5">
            <SearchBar value={query} onChange={setQuery} placeholder="Search events..." />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-full border transition-all duration-200",
                      category === c
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "hover:bg-accent border-border hover:border-emerald-300",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
              <button
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                }}
              >
                Clear filters
              </button>
              <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {
                  events.filter((e) => {
                    const q = query.toLowerCase()
                    const matchesQ = e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
                    const matchesC = category === "All" ? true : e.category === category
                    return matchesQ && matchesC
                  }).length
                }{" "}
                events
              </span>
            </div>
          </div>
        </aside>
      </section>

      <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEventId(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{selectedEvent?.title || "Event Details"}</DialogTitle>
            <DialogDescription>{selectedEvent?.description || "Event details"}</DialogDescription>
          </VisuallyHidden>
          {selectedEvent && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedEventId(null)}
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                <span className="sr-only">Close</span>
              </Button>

              <div className="relative h-56 w-full">
                <Image
                  src={getImageUrl(selectedEvent.image_url, selectedEvent.title) || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-16">
                  <span className="text-xs font-medium bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                    {selectedEvent.category}
                  </span>
                  <h3 className="font-bold text-2xl text-white mt-2">{selectedEvent.title}</h3>
                </div>
              </div>
              <div className="p-6 bg-card rounded-b-xl">
                <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Date</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedEvent.event_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Time</p>
                      <p className="text-muted-foreground">{selectedEvent.event_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
