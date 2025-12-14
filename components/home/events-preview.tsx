import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"
import { getEvents } from "@/lib/db/actions"

export async function EventsPreview() {
  const events = await getEvents({ upcoming: true })
  const upcoming = events.slice(0, 3)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <Link href="/events" className="text-sm text-emerald-700 hover:underline dark:text-emerald-300">
          View calendar
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {upcoming.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No upcoming events.</p>}
        {upcoming.map((e) => (
          <Link key={e.id} href={`/events?focus=${e.id}`} className="group rounded-lg border overflow-hidden">
            <div className="relative h-40">
              <Image
                src={e.image_url || "/placeholder.svg?height=160&width=320&query=school event"}
                alt={e.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {e.title}
              </h3>
              <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {new Date(e.event_date).toLocaleDateString()} • {e.event_time}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{e.location}</span>
              </div>
              <div className="mt-2">
                <span className="inline-block text-xs border rounded px-2 py-0.5">{e.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
