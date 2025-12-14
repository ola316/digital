"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

export type Announcement = {
  id: number
  title: string
  content: string
  excerpt: string
  date: string
  category: string
  featured: boolean
  author: string
  published: boolean
}

export type Event = {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  featured: boolean
  image?: string
}

export type GalleryItem = {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  year: string
  type: "photo" | "video"
  featured: boolean
  date: string
}

export type Activity = {
  id: string
  type: "announcement" | "event" | "gallery" | "auth" | "settings"
  action: "create" | "update" | "delete" | "publish" | "feature" | "login" | "logout"
  message: string
  user: string
  timestamp: string
}

type Snapshot = {
  announcements: Announcement[]
  events: Event[]
  gallery: GalleryItem[]
  activity: Activity[]
  settings: {
    siteTitle: string
    tagline: string
  }
}

const STORAGE_KEY = "oakwood-data-store-v1"

function nowISO() {
  return new Date().toISOString()
}

class Emitter {
  private listeners = new Set<() => void>()
  subscribe(cb: () => void) {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }
  emit() {
    this.listeners.forEach((l) => l())
  }
}

class DataStore {
  private emitter = new Emitter()
  private state: Snapshot

  constructor() {
    this.state = this.load() ?? this.seed()
  }

  private load(): Snapshot | null {
    if (typeof window === "undefined") return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as Snapshot
    } catch {
      return null
    }
  }

  private save() {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  }

  private pushActivity(entry: Omit<Activity, "id" | "timestamp">) {
    const act: Activity = { id: crypto.randomUUID(), timestamp: nowISO(), ...entry }
    this.state.activity.unshift(act)
    // cap activity length
    this.state.activity = this.state.activity.slice(0, 200)
  }

  private seed(): Snapshot {
    const announcements: Announcement[] = [
      {
        id: 1,
        title: "Welcome Back to School",
        content:
          "We are excited to welcome students and families to a new academic year at Oakwood Academy. Please review the updated handbook and calendar.",
        excerpt: "A warm welcome to a new year of learning and growth.",
        date: new Date().toISOString(),
        category: "General",
        featured: true,
        author: "Principal Adams",
        published: true,
      },
      {
        id: 2,
        title: "Science Fair Registration Open",
        content:
          "Students are invited to participate in the annual Science Fair. Registration closes on September 30. Workshops available every Friday.",
        excerpt: "Showcase your curiosity and creativity at the Science Fair.",
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        category: "Academic",
        featured: true,
        author: "STEM Department",
        published: true,
      },
      {
        id: 3,
        title: "Varsity Soccer Tryouts",
        content:
          "Tryouts for the varsity soccer team will be held on the main field next week. Bring appropriate gear and hydration.",
        excerpt: "Join the Oakwood Owls on the field.",
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        category: "Sports",
        featured: false,
        author: "Athletics",
        published: true,
      },
      {
        id: 4,
        title: "Parent-Teacher Conferences",
        content:
          "Conferences will be held October 15-16. Online scheduling opens next week. Please book your time slots early.",
        excerpt: "Partnering for student success.",
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        category: "General",
        featured: false,
        author: "Office",
        published: true,
      },
      {
        id: 5,
        title: "Fall Theater Auditions",
        content:
          "Auditions for the fall production will take place in the auditorium. All are welcome. Backstage roles also available.",
        excerpt: "Calling all actors, musicians, and crew!",
        date: new Date(Date.now() - 86400000 * 20).toISOString(),
        category: "Cultural",
        featured: false,
        author: "Arts Department",
        published: true,
      },
      {
        id: 6,
        title: "Library Extended Hours",
        content:
          "The library will extend hours during midterms. Study groups are encouraged. Snacks provided after school.",
        excerpt: "Extra time, extra support.",
        date: new Date(Date.now() - 86400000 * 25).toISOString(),
        category: "Academic",
        featured: false,
        author: "Library",
        published: true,
      },
    ]

    const today = new Date()
    const events: Event[] = [
      {
        id: 1,
        title: "Back-to-School Night",
        description: "Meet teachers and explore classrooms. Welcome remarks by the principal.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString(),
        time: "18:00",
        location: "Main Campus",
        category: "Academic",
        featured: true,
        image: "/placeholder-cm8z3.png",
      },
      {
        id: 2,
        title: "Soccer Home Opener",
        description: "Oakwood Owls vs. Riverview High. Wear green!",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8).toISOString(),
        time: "16:00",
        location: "Athletic Field",
        category: "Sports",
        featured: true,
        image: "/high-school-soccer.png",
      },
      {
        id: 3,
        title: "Science Fair Workshop",
        description: "Project ideation and mentorship sessions.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12).toISOString(),
        time: "15:00",
        location: "STEM Lab",
        category: "Academic",
        featured: false,
        image: "/science-fair-workshop-lab.png",
      },
      {
        id: 4,
        title: "Fall Theater Auditions",
        description: "Auditions for roles and crew sign-ups.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString(),
        time: "17:00",
        location: "Auditorium",
        category: "Cultural",
        featured: false,
      },
      {
        id: 5,
        title: "Community Service Day",
        description: "Join us for a day of service across the city.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20).toISOString(),
        time: "09:00",
        location: "Citywide",
        category: "Community",
        featured: false,
      },
      {
        id: 6,
        title: "Parent-Teacher Conferences",
        description: "Scheduled meetings to discuss progress.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30).toISOString(),
        time: "10:00",
        location: "Main Campus",
        category: "General",
        featured: false,
      },
    ]

    const gallery: GalleryItem[] = [
      {
        id: 1,
        title: "Campus Green",
        description: "Our beautiful campus during spring.",
        imageUrl: "/school-campus-green-trees.png",
        category: "Campus",
        year: String(today.getFullYear()),
        type: "photo",
        featured: true,
        date: nowISO(),
      },
      {
        id: 2,
        title: "Robotics Team",
        description: "Robotics team at regional competition.",
        imageUrl: "/high-school-robotics.png",
        category: "Academic",
        year: String(today.getFullYear()),
        type: "photo",
        featured: true,
        date: nowISO(),
      },
      {
        id: 3,
        title: "Spring Concert",
        description: "Highlights from the spring concert.",
        imageUrl: "/high-school-spring-concert.png",
        category: "Cultural",
        year: String(today.getFullYear() - 1),
        type: "photo",
        featured: false,
        date: nowISO(),
      },
      {
        id: 4,
        title: "Basketball Finals",
        description: "Our team in the finals.",
        imageUrl: "/high-school-basketball-crowd.png",
        category: "Sports",
        year: String(today.getFullYear() - 1),
        type: "photo",
        featured: false,
        date: nowISO(),
      },
      {
        id: 5,
        title: "Graduation Highlights",
        description: "Celebrating our graduates.",
        imageUrl: "/high-school-graduation.png",
        category: "Ceremony",
        year: String(today.getFullYear() - 1),
        type: "photo",
        featured: false,
        date: nowISO(),
      },
      {
        id: 6,
        title: "Chemistry Lab",
        description: "Experiment day in the lab.",
        imageUrl: "/high-school-chemistry-lab.png",
        category: "Academic",
        year: String(today.getFullYear() - 2),
        type: "photo",
        featured: false,
        date: nowISO(),
      },
    ]

    const activity: Activity[] = [
      {
        id: crypto.randomUUID(),
        type: "auth",
        action: "login",
        message: "System initialized",
        user: "system",
        timestamp: nowISO(),
      },
    ]

    return {
      announcements,
      events,
      gallery,
      activity,
      settings: {
        siteTitle: "Oakwood Academy",
        tagline: "Inspiring Excellence, Nurturing Character",
      },
    }
  }

  subscribe(cb: () => void) {
    return this.emitter.subscribe(cb)
  }

  getSnapshot(): Snapshot {
    return this.state
  }

  // Announcements CRUD
  createAnnouncement(input: Omit<Announcement, "id" | "date">) {
    const id = Math.max(0, ...this.state.announcements.map((a) => a.id)) + 1
    const a: Announcement = { id, date: nowISO(), ...input }
    this.state.announcements.unshift(a)
    this.pushActivity({
      type: "announcement",
      action: "create",
      message: `Created announcement "${a.title}"`,
      user: "admin",
    })
    this.commit()
    return a
  }
  updateAnnouncement(id: number, patch: Partial<Announcement>) {
    this.state.announcements = this.state.announcements.map((a) => (a.id === id ? { ...a, ...patch } : a))
    this.pushActivity({ type: "announcement", action: "update", message: `Updated announcement #${id}`, user: "admin" })
    this.commit()
  }
  deleteAnnouncements(ids: number[]) {
    this.state.announcements = this.state.announcements.filter((a) => !ids.includes(a.id))
    this.pushActivity({
      type: "announcement",
      action: "delete",
      message: `Deleted ${ids.length} announcement(s)`,
      user: "admin",
    })
    this.commit()
  }

  // Events CRUD
  createEvent(input: Omit<Event, "id">) {
    const id = Math.max(0, ...this.state.events.map((e) => e.id)) + 1
    const e: Event = { id, ...input }
    this.state.events.push(e)
    this.pushActivity({ type: "event", action: "create", message: `Created event "${e.title}"`, user: "admin" })
    this.commit()
    return e
  }
  updateEvent(id: number, patch: Partial<Event>) {
    this.state.events = this.state.events.map((e) => (e.id === id ? { ...e, ...patch } : e))
    this.pushActivity({ type: "event", action: "update", message: `Updated event #${id}`, user: "admin" })
    this.commit()
  }
  deleteEvents(ids: number[]) {
    this.state.events = this.state.events.filter((e) => !ids.includes(e.id))
    this.pushActivity({ type: "event", action: "delete", message: `Deleted ${ids.length} event(s)`, user: "admin" })
    this.commit()
  }

  // Gallery CRUD
  createGalleryItem(input: Omit<GalleryItem, "id" | "date">) {
    const id = Math.max(0, ...this.state.gallery.map((g) => g.id)) + 1
    const g: GalleryItem = { id, date: nowISO(), ...input }
    this.state.gallery.unshift(g)
    this.pushActivity({ type: "gallery", action: "create", message: `Added gallery item "${g.title}"`, user: "admin" })
    this.commit()
    return g
  }
  updateGalleryItem(id: number, patch: Partial<GalleryItem>) {
    this.state.gallery = this.state.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g))
    this.pushActivity({ type: "gallery", action: "update", message: `Updated gallery item #${id}`, user: "admin" })
    this.commit()
  }
  deleteGalleryItems(ids: number[]) {
    this.state.gallery = this.state.gallery.filter((g) => !ids.includes(g.id))
    this.pushActivity({
      type: "gallery",
      action: "delete",
      message: `Deleted ${ids.length} gallery item(s)`,
      user: "admin",
    })
    this.commit()
  }

  // Settings
  updateSettings(patch: Partial<Snapshot["settings"]>) {
    this.state.settings = { ...this.state.settings, ...patch }
    this.pushActivity({ type: "settings", action: "update", message: `Updated site settings`, user: "admin" })
    this.commit()
  }

  private commit() {
    this.save()
    this.emitter.emit()
  }
}

const singleton = new DataStore()

export function useStoreSnapshot() {
  const subscribe = (onStoreChange: () => void) => singleton.subscribe(onStoreChange)
  const getSnapshot = () => singleton.getSnapshot()
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export const store = singleton

// Utilities
export function matchesQuery(s: string, q: string) {
  return s.toLowerCase().includes(q.toLowerCase())
}

export function useIsMounted() {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return mounted
}
