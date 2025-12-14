import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getEvents } from "@/lib/db/actions"
import { EventsClientPage } from "./EventsClientPage"

export const metadata = {
  title: "Events — Oakwood Academy",
  description: "Upcoming and past events at Oakwood Academy.",
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <EventsClientPage events={events} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
