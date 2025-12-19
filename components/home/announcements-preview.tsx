import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Bell, User, Calendar, ChevronRight, ArrowRight } from "lucide-react"
import { getAnnouncements } from "@/lib/db/actions"

const categoryColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Academic: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Sports: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Cultural: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
}

export async function AnnouncementsPreview() {
  const announcements = await getAnnouncements({ published: true })
  const featured = announcements.filter((a) => a.featured).slice(0, 3)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Announcements</h2>
          <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest news</p>
        </div>
        <Link
          href="/announcements"
          className="group flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featured.length === 0 && (
          <div className="col-span-3 text-center py-12 rounded-xl border bg-card">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No announcements yet.</p>
          </div>
        )}

        {featured.map((a) => (
          <Link
            key={a.id}
            href={`/announcements/${a.id}`}
            className="group relative rounded-xl border bg-card p-5 hover:shadow-lg transition-all duration-300 hover:border-emerald-500/50 overflow-hidden"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

            {/* Featured indicator */}
            <div className="absolute -top-1 -right-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <Bell className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 mt-1">
              <Badge className={categoryColors[a.category] || "bg-gray-100 text-gray-800"}>{a.category}</Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {a.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {a.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(a.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
