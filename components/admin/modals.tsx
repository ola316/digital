"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "./file-upload"
import { createAnnouncement, createEvent, createGalleryItem } from "@/lib/db/actions"
import type { Announcement, Event, GalleryItem } from "@/lib/db/types"

export function useModal() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}

type AnnouncementModalProps = {
  open: boolean
  setOpen: (o: boolean) => void
  initial?: Partial<Announcement>
  onDone?: () => void
}

export function AnnouncementModal({ open, setOpen, initial, onDone }: AnnouncementModalProps) {
  const [data, setData] = useState<Partial<Announcement>>({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? "General",
    author: initial?.author ?? "Admin",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = !!initial?.id

  const submit = async () => {
    if (!data.title || !data.excerpt) return
    setIsSubmitting(true)

    try {
      await createAnnouncement({
        title: data.title!,
        excerpt: data.excerpt!,
        content: data.content ?? "",
        category: data.category ?? "General",
        author: data.author ?? "Admin",
        featured: !!data.featured,
        published: !!data.published,
        created_by: null,
      })
      setOpen(false)
      // Reset form
      setData({
        title: "",
        excerpt: "",
        content: "",
        category: "General",
        author: "Admin",
        featured: false,
        published: true,
      })
      onDone?.()
    } catch (error) {
      console.error("Failed to create announcement:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Announcement</DialogTitle>
          <DialogDescription>
            Fill out the announcement details below. You can mark it as featured to highlight on the homepage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Title</Label>
            <Input value={data.title} onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Input value={data.excerpt} onChange={(e) => setData((d) => ({ ...d, excerpt: e.target.value }))} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              rows={5}
              value={data.content}
              onChange={(e) => setData((d) => ({ ...d, content: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Input value={data.category} onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))} />
            </div>
            <div>
              <Label>Author</Label>
              <Input value={data.author} onChange={(e) => setData((d) => ({ ...d, author: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={!!data.featured} onCheckedChange={(v) => setData((d) => ({ ...d, featured: v }))} />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!data.published} onCheckedChange={(v) => setData((d) => ({ ...d, published: v }))} />
              <Label>Published</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type EventModalProps = {
  open: boolean
  setOpen: (o: boolean) => void
  initial?: Partial<Event>
  onDone?: () => void
}

export function EventModal({ open, setOpen, initial, onDone }: EventModalProps) {
  const [data, setData] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    event_date: initial?.event_date ?? new Date().toISOString().substring(0, 10),
    event_time: initial?.event_time ?? "09:00",
    location: initial?.location ?? "",
    category: initial?.category ?? "General",
    featured: initial?.featured ?? false,
    image_url: initial?.image_url ?? "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!initial?.id

  const submit = async () => {
    if (!data.title || !data.event_date) return
    setIsSubmitting(true)

    try {
      await createEvent({
        title: data.title,
        description: data.description,
        event_date: data.event_date,
        event_time: data.event_time,
        location: data.location,
        category: data.category,
        featured: data.featured,
        image_url: data.image_url || null,
        created_by: null,
      })
      setOpen(false)
      // Reset form
      setData({
        title: "",
        description: "",
        event_date: new Date().toISOString().substring(0, 10),
        event_time: "09:00",
        location: "",
        category: "General",
        featured: false,
        image_url: "",
      })
      onDone?.()
    } catch (error) {
      console.error("Failed to create event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Event</DialogTitle>
          <DialogDescription>
            Provide the event information below. Use a future date to show in upcoming events.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Title</Label>
            <Input value={data.title} onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={data.description}
              onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={data.event_date}
                onChange={(e) => setData((d) => ({ ...d, event_date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={data.event_time}
                onChange={(e) => setData((d) => ({ ...d, event_time: e.target.value }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={data.category} onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Location</Label>
              <Input value={data.location} onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))} />
            </div>
            <div>
              <FileUpload
                value={data.image_url || ""}
                onChange={(url) => setData((d) => ({ ...d, image_url: url }))}
                label="Event Image"
                placeholder="Enter URL or upload image"
                accept="image/*"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={data.featured} onCheckedChange={(v) => setData((d) => ({ ...d, featured: v }))} />
              <Label>Featured</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type GalleryModalProps = {
  open: boolean
  setOpen: (o: boolean) => void
  initial?: Partial<GalleryItem>
  onDone?: () => void
}

export function GalleryModal({ open, setOpen, initial, onDone }: GalleryModalProps) {
  const [data, setData] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    image_url: initial?.image_url ?? "",
    category: initial?.category ?? "Campus",
    year: initial?.year ?? String(new Date().getFullYear()),
    type: initial?.type ?? ("photo" as "photo" | "video"),
    featured: initial?.featured ?? false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!initial?.id

  const submit = async () => {
    if (!data.title || !data.image_url) return
    setIsSubmitting(true)

    try {
      await createGalleryItem({
        title: data.title,
        description: data.description || null,
        image_url: data.image_url,
        category: data.category,
        year: data.year,
        type: data.type,
        featured: data.featured,
        created_by: null,
      })
      setOpen(false)
      // Reset form
      setData({
        title: "",
        description: "",
        image_url: "",
        category: "Campus",
        year: String(new Date().getFullYear()),
        type: "photo",
        featured: false,
      })
      onDone?.()
    } catch (error) {
      console.error("Failed to create gallery item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Add"} Gallery Item</DialogTitle>
          <DialogDescription>
            Include a title and image. Mark as featured to highlight on the homepage gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Title</Label>
            <Input value={data.title} onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div>
            <FileUpload
              value={data.image_url}
              onChange={(url) => setData((d) => ({ ...d, image_url: url }))}
              label="Gallery Image"
              placeholder="Enter URL or upload image"
              accept="image/*"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label>Category</Label>
              <Input value={data.category} onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))} />
            </div>
            <div>
              <Label>Year</Label>
              <Input value={data.year} onChange={(e) => setData((d) => ({ ...d, year: e.target.value }))} />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={data.type}
                onChange={(e) => setData((d) => ({ ...d, type: e.target.value as "photo" | "video" }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={data.featured} onCheckedChange={(v) => setData((d) => ({ ...d, featured: v }))} />
              <Label>Featured</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
