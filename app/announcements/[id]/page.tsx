"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useStoreSnapshot } from "@/lib/data-store"
import Link from "next/link"

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { announcements } = useStoreSnapshot()
  const id = Number(params.id)
  const ann = useMemo(() => announcements.find((a) => a.id === id), [announcements, id])

  if (!ann) {
    return (
      <div className="min-h-[100dvh]">
        <Navigation />
        <main className="pt-24 container mx-auto max-w-3xl px-4">
          <p className="text-sm text-muted-foreground">Announcement not found.</p>
          <Link href="/announcements" className="text-emerald-700 hover:underline dark:text-emerald-300">
            Back to announcements
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <article className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6">
            <p className="text-xs text-muted-foreground">{ann.category}</p>
            <h1 className="text-3xl font-bold tracking-tight">{ann.title}</h1>
            <p className="text-xs text-muted-foreground mt-2">
              By {ann.author} • {new Date(ann.date).toLocaleDateString()}
            </p>
          </header>
          <div className="prose dark:prose-invert max-w-none">
            <p>{ann.content}</p>
          </div>
          <div className="mt-8">
            <Link href="/announcements" className="text-emerald-700 hover:underline dark:text-emerald-300">
              ← Back to announcements
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
