import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "About — Oakwood Academy",
  description: "Our history, mission, vision, values, and faculty.",
}

const values = [
  { title: "Integrity", desc: "We uphold honesty and strong moral principles." },
  { title: "Excellence", desc: "We pursue the highest standards in all we do." },
  { title: "Community", desc: "We support and respect one another." },
  { title: "Curiosity", desc: "We encourage inquiry, innovation, and growth." },
]

const faculty = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Dr. Alex ${i + 1}`,
  role: i % 2 === 0 ? "Senior Faculty" : "Department Chair",
  image: `/placeholder.svg?height=320&width=320&query=faculty portrait ${i + 1}`,
}))

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">About Nowzer School</h1>
              <p className="mt-4 text-muted-foreground">
                Nowzer has been a beacon of academic excellence and character development. Our
                students thrive in a supportive community that celebrates diversity, creativity, and leadership.
              </p>
            </div>
            <div className="relative h-56 md:h-72 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=480&width=800"
                alt="Oakwood Academy building"
                fill
                className="object-cover"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">History Timeline</h2>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full" />
              <ul className="space-y-6">
                {[
                  { year: 1985, text: "Founded with a mission to inspire excellence." },
                  { year: 2001, text: "Expansion of STEM and Arts programs." },
                  { year: 2015, text: "New athletic complex and auditorium." },
                  { year: 2024, text: "Modernized labs and digital learning initiatives." },
                ].map((t) => (
                  <li key={t.year} className="relative">
                    <span className="absolute left-[-6px] top-1.5 h-3 w-3 rounded-full bg-emerald-600" />
                    <div className="ml-4">
                      <p className="font-medium">{t.year}</p>
                      <p className="text-sm text-muted-foreground">{t.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Mission, Vision, and Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-emerald-100 dark:border-emerald-900/30">
                <CardHeader>
                  <CardTitle>Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  To provide a safe, inclusive, and challenging learning environment that empowers students to reach
                  their full potential.
                </CardContent>
              </Card>
              <Card className="border-emerald-100 dark:border-emerald-900/30">
                <CardHeader>
                  <CardTitle>Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  To be a leading institution recognized for academic excellence, character, and community impact.
                </CardContent>
              </Card>
              <Card className="border-emerald-100 dark:border-emerald-900/30">
                <CardHeader>
                  <CardTitle>Values</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {values.map((v) => (
                    <div key={v.title}>
                      <p className="font-medium">{v.title}</p>
                      <p className="text-sm text-muted-foreground">{v.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Faculty Profiles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {faculty.map((f) => (
                <Card key={f.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image src={f.image || "/placeholder.svg"} alt={f.name} fill className="object-cover" />
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{f.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{f.role}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Achievements & Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Graduation Rate", value: "98%" },
                { label: "College Acceptance", value: "95%" },
                { label: "State Championships", value: "12" },
                { label: "AP Courses", value: "24" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border p-5 bg-white dark:bg-gray-900">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
