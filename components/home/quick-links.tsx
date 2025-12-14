import Link from "next/link"
import { BookOpen, CalendarDays, Users2, Megaphone, Camera, MapPin } from "lucide-react"

const links = [
  { href: "/about", label: "About Us", icon: Users2 },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/contact", label: "Contact", icon: MapPin },
  { href: "#", label: "Academics", icon: BookOpen },
]

export function QuickLinks() {
  return (
    <section aria-labelledby="quick-links-heading">
      <h2 id="quick-links-heading" className="sr-only">
        Quick Links
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-lg border bg-white dark:bg-gray-900 p-4 flex items-center gap-3 hover:shadow-md transition hover:-translate-y-0.5"
          >
            <span className="p-2 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <l.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
              {l.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
