// Database types for Oakwood Academy

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  featured: boolean
  published: boolean
  author: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  category: string
  featured: boolean
  image_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: number
  title: string
  description: string | null
  image_url: string
  category: string
  year: string
  type: "photo" | "video"
  featured: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  action_type: string
  action: string
  message: string
  user_id: string | null
  user_email: string | null
  created_at: string
}

export interface SiteSetting {
  id: number
  key: string
  value: string
  updated_at: string
}

// Input types for creating/updating records
export type CreateAnnouncement = Omit<Announcement, "id" | "created_at" | "updated_at">
export type UpdateAnnouncement = Partial<Omit<Announcement, "id" | "created_at" | "updated_at">>

export type CreateEvent = Omit<Event, "id" | "created_at" | "updated_at">
export type UpdateEvent = Partial<Omit<Event, "id" | "created_at" | "updated_at">>

export type CreateGalleryItem = Omit<GalleryItem, "id" | "created_at" | "updated_at">
export type UpdateGalleryItem = Partial<Omit<GalleryItem, "id" | "created_at" | "updated_at">>
