import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnnouncements } from "@/lib/db/actions"

export async function AnnouncementsPreview() {
  const announcements = await getAnnouncements({ published: true })
  const featured = announcements.filter((a) => a.featured).slice(0, 3)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Announcements</h2>
        <Link href="/announcements" className="text-sm text-emerald-700 hover:underline dark:text-emerald-300">
          View all
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {featured.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No announcements yet.</p>}
        {featured.map((a) => (
          <Card key={a.id} className="hover:shadow-md transition">
            <CardHeader className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-emerald-600 hover:bg-emerald-700">Featured</Badge>
                <Badge variant="outline">{a.category}</Badge>
              </div>
              <CardTitle className="leading-tight">
                <Link className="hover:underline" href={`/announcements/${a.id}`}>
                  {a.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{a.excerpt}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                By {a.author} • {new Date(a.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
