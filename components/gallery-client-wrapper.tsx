"use client"

import { GalleryClient } from "@/components/gallery-client"
import type { GalleryItem } from "@/lib/db/types"

interface Props {
  gallery: GalleryItem[]
}

export function GalleryClientWrapper({ gallery }: Props) {
  return <GalleryClient gallery={gallery} />
}
