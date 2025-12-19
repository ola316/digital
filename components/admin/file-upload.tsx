"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { uploadImage } from "@/lib/db/storage"

type FileUploadProps = {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  placeholder?: string
}

export function FileUpload({
  value,
  onChange,
  accept = "image/jpeg,image/png,image/gif,image/webp",
  label = "Image",
  placeholder = "Enter URL or upload file",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed."
    }

    // Check file size (1MB max)
    const maxSize = 1 * 1024 * 1024 // 1MB
    if (file.size > maxSize) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 1MB.`
    }

    return null
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)

    // Validate file before upload
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    // Create preview
    const blobUrl = URL.createObjectURL(file)
    setPreview(blobUrl)

    // Upload to Supabase Storage
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadImage(formData)

      if (result.success && result.url) {
        onChange(result.url)
        setSuccess(true)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || "Failed to upload image")
        setPreview(null)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      setPreview(null)
      URL.revokeObjectURL(blobUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
    setPreview(null)
    setError(null)
    setSuccess(false)
  }

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError(null)
    setSuccess(false)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Determine which image to show in preview
  const previewImage = preview || (value && (value.startsWith("http") || value.startsWith("/")))

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
        {(value || preview) && !isUploading && (
          <Button type="button" variant="outline" size="icon" onClick={clearFile} className="shrink-0 bg-transparent">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File type hint */}
      <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, GIF, WebP. Max size: 1MB</p>

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Image uploaded successfully!</span>
        </div>
      )}

      {/* Image preview */}
      {previewImage && (
        <div className="mt-2 relative">
          <img
            src={preview || value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg border shadow-sm"
            onError={(e) => {
              // If image fails to load, show placeholder
              ;(e.target as HTMLImageElement).src = "/abstract-colorful-swirls.png"
            }}
          />
          {isUploading && (
            <div className="absolute inset-0 h-32 w-32 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
