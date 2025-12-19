"use server"

import { createClient } from "@supabase/supabase-js"

// Create a storage client with service role for uploads
function getStorageClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase credentials for storage")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function uploadImage(data: {
  base64: string
  fileName: string
  mimeType: string
}): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { base64, fileName, mimeType } = data

    if (!base64) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(mimeType)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.",
      }
    }

    // Decode base64 to buffer
    const base64Data = base64.split(",")[1] || base64
    const buffer = Buffer.from(base64Data, "base64")

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024 // 1MB
    if (buffer.length > maxSize) {
      return {
        success: false,
        error: "File too large. Maximum size is 1MB.",
      }
    }

    const supabase = getStorageClient()

    // Generate unique filename
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg"
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`
    const filePath = `uploads/${uniqueName}`

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage.from("images").upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.log("[v0] Storage upload error:", error.message)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.log("[v0] Upload error:", error instanceof Error ? error.message : "Unknown error")
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getStorageClient()

    // Extract file path from URL
    const urlParts = imageUrl.split("/storage/v1/object/public/images/")
    if (urlParts.length !== 2) {
      return { success: false, error: "Invalid image URL" }
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage.from("images").remove([filePath])

    if (error) {
      console.log("[v0] Storage delete error:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[v0] Delete error:", error instanceof Error ? error.message : "Unknown error")
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}
