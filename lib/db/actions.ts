"use server"

import { getDbClient } from "@/lib/supabase/db"
import { revalidatePath } from "next/cache"
import type {
  Announcement,
  Event,
  GalleryItem,
  ActivityLog,
  CreateAnnouncement,
  UpdateAnnouncement,
  CreateEvent,
  UpdateEvent,
  CreateGalleryItem,
  UpdateGalleryItem,
} from "./types"

// Helper to log activity
async function logActivity(actionType: string, action: string, message: string, userId?: string, userEmail?: string) {
  const supabase = getDbClient()
  await supabase.from("activity_log").insert({
    action_type: actionType,
    action,
    message,
    user_id: userId || null,
    user_email: userEmail || null,
  })
}

// ============ ANNOUNCEMENTS ============

export async function getAnnouncements(options?: { featured?: boolean; published?: boolean }) {
  const supabase = getDbClient()
  let query = supabase.from("announcements").select("*").order("created_at", { ascending: false })

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }
  if (options?.published !== undefined) {
    query = query.eq("published", options.published)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Announcement[]
}

export async function getAnnouncementById(id: number) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("announcements").select("*").eq("id", id).single()

  if (error) throw error
  return data as Announcement
}

export async function createAnnouncement(input: CreateAnnouncement) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("announcements").insert(input).select().single()

  if (error) throw error

  await logActivity("announcement", "create", `Created announcement: ${input.title}`, input.created_by || undefined)
  revalidatePath("/")
  revalidatePath("/announcements")
  revalidatePath("/admin")

  return data as Announcement
}

export async function updateAnnouncement(id: number, updates: UpdateAnnouncement) {
  const supabase = getDbClient()
  const { data, error } = await supabase
    .from("announcements")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  await logActivity("announcement", "update", `Updated announcement #${id}`)
  revalidatePath("/")
  revalidatePath("/announcements")
  revalidatePath("/admin")

  return data as Announcement
}

export async function deleteAnnouncements(ids: number[]) {
  const supabase = getDbClient()
  const { error } = await supabase.from("announcements").delete().in("id", ids)

  if (error) throw error

  await logActivity("announcement", "delete", `Deleted ${ids.length} announcement(s)`)
  revalidatePath("/")
  revalidatePath("/announcements")
  revalidatePath("/admin")
}

// ============ EVENTS ============

export async function getEvents(options?: { featured?: boolean; upcoming?: boolean }) {
  const supabase = getDbClient()
  let query = supabase.from("events").select("*").order("event_date", { ascending: true })

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }
  if (options?.upcoming) {
    query = query.gte("event_date", new Date().toISOString().split("T")[0])
  }

  const { data, error } = await query
  if (error) throw error
  return data as Event[]
}

export async function getEventById(id: number) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) throw error
  return data as Event
}

export async function createEvent(input: CreateEvent) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("events").insert(input).select().single()

  if (error) throw error

  await logActivity("event", "create", `Created event: ${input.title}`, input.created_by || undefined)
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin")

  return data as Event
}

export async function updateEvent(id: number, updates: UpdateEvent) {
  const supabase = getDbClient()
  const { data, error } = await supabase
    .from("events")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  await logActivity("event", "update", `Updated event #${id}`)
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin")

  return data as Event
}

export async function deleteEvents(ids: number[]) {
  const supabase = getDbClient()
  const { error } = await supabase.from("events").delete().in("id", ids)

  if (error) throw error

  await logActivity("event", "delete", `Deleted ${ids.length} event(s)`)
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin")
}

// ============ GALLERY ============

export async function getGalleryItems(options?: { featured?: boolean; category?: string }) {
  const supabase = getDbClient()
  let query = supabase.from("gallery").select("*").order("created_at", { ascending: false })

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }
  if (options?.category) {
    query = query.eq("category", options.category)
  }

  const { data, error } = await query
  if (error) throw error
  return data as GalleryItem[]
}

export async function getGalleryItemById(id: number) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("gallery").select("*").eq("id", id).single()

  if (error) throw error
  return data as GalleryItem
}

export async function createGalleryItem(input: CreateGalleryItem) {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("gallery").insert(input).select().single()

  if (error) throw error

  await logActivity("gallery", "create", `Added gallery item: ${input.title}`, input.created_by || undefined)
  revalidatePath("/")
  revalidatePath("/gallery")
  revalidatePath("/admin")

  return data as GalleryItem
}

export async function updateGalleryItem(id: number, updates: UpdateGalleryItem) {
  const supabase = getDbClient()
  const { data, error } = await supabase
    .from("gallery")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  await logActivity("gallery", "update", `Updated gallery item #${id}`)
  revalidatePath("/")
  revalidatePath("/gallery")
  revalidatePath("/admin")

  return data as GalleryItem
}

export async function deleteGalleryItems(ids: number[]) {
  const supabase = getDbClient()
  const { error } = await supabase.from("gallery").delete().in("id", ids)

  if (error) throw error

  await logActivity("gallery", "delete", `Deleted ${ids.length} gallery item(s)`)
  revalidatePath("/")
  revalidatePath("/gallery")
  revalidatePath("/admin")
}

// ============ ACTIVITY LOG ============

export async function getActivityLog(limit = 50) {
  const supabase = getDbClient()
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActivityLog[]
}

// ============ SITE SETTINGS ============

export async function getSiteSettings() {
  const supabase = getDbClient()
  const { data, error } = await supabase.from("site_settings").select("*")

  if (error) throw error

  const settings: Record<string, string> = {}
  data.forEach((row) => {
    settings[row.key] = row.value
  })
  return settings
}

export async function updateSiteSetting(key: string, value: string) {
  const supabase = getDbClient()
  const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) throw error

  await logActivity("settings", "update", `Updated setting: ${key}`)
  revalidatePath("/")
  revalidatePath("/admin")
}
