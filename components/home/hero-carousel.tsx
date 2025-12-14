"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Slide = {
  id: number
  title: string
  subtitle: string
  cta: { label: string; href: string }
  image: { src: string; alt: string }
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Inspiring Excellence",
    subtitle: "Where curiosity meets opportunity.",
    cta: { label: "Explore Programs", href: "/about" },
    image: { src: "/modern-school-campus-aerial.png", alt: "Campus" },
  },
  {
    id: 2,
    title: "Discover Your Potential",
    subtitle: "Academics, arts, athletics—be your best.",
    cta: { label: "View Events", href: "/events" },
    image: { src: "/engaged-high-school-students.png", alt: "Students" },
  },
  {
    id: 3,
    title: "Join Our Community",
    subtitle: "Building character, creating leaders.",
    cta: { label: "See Announcements", href: "/announcements" },
    image: { src: "/placeholder.svg?height=720&width=1440", alt: "Community" },
  },
]

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fn = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(fn)
  }, [])

  return (
    <section className="relative w-full overflow-hidden rounded-xl">
      <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== index}
          >
            {/* Background image */}
            <Image
              src={s.image.src || "/placeholder.svg"}
              alt={s.image.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            {/* Text */}
            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="p-6 sm:p-10 lg:p-14 text-white max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-bold mb-3">{s.title}</h1>
                <p className="text-base sm:text-lg mb-6 text-white/90">{s.subtitle}</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href={s.cta.href}>{s.cta.label}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
