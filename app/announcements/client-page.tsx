"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnnouncements } from "@/lib/db/actions"
import { AnnouncementsClient } from "@/components/announcements-client"

export default async function AnnouncementsClientPage() {
  const announcements = await getAnnouncements({ published: true })
  const featured = announcements.filter((a) => a.featured).slice(0, 3)

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">Latest updates from Oakwood Academy.</p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Featured</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {featured.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-3">No featured announcements.</p>
              )}
              {featured.map((a) => (
                <Card key={a.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-emerald-600 hover:bg-emerald-700">Featured</Badge>
                      <Badge variant="outline">{a.category}</Badge>
                    </div>
                    <CardTitle className="leading-tight">
                      <Link href={`/announcements/${a.id}`} className="hover:underline">
                        {a.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{a.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <AnnouncementsClient announcements={announcements} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
