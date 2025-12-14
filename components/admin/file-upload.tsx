"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

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
  accept = "image/*",
  label = "Image",
  placeholder = "Enter URL or upload file",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a blob URL for preview
    const blobUrl = URL.createObjectURL(file)
    setPreview(blobUrl)

    // Generate a better placeholder URL based on file type and name
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")

    if (isImage) {
      // For images, create a more specific placeholder URL
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-")
      const placeholderUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(fileName + " " + (fileExtension || "image"))}`
      onChange(placeholderUrl)
    } else {
      // For other files, use the blob URL
      onChange(blobUrl)
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
    setPreview(null)
  }

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="shrink-0">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        {(value || preview) && (
          <Button type="button" variant="outline" size="icon" onClick={clearFile} className="shrink-0 bg-transparent">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />
      {(preview || (value && value.startsWith("http"))) && (
        <div className="mt-2">
          <img src={preview || value} alt="Preview" className="h-20 w-20 object-cover rounded border" />
        </div>
      )}
    </div>
  )
}
