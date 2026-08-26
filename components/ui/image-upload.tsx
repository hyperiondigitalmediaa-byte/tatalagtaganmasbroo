"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      alert("Format file tidak valid. Gunakan JPG, PNG, WebP, atau GIF")
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("Ukuran file terlalu besar. Maksimal 5MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "article")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        onChange(data.url)
      } else {
        const error = await res.json()
        alert(error.error || "Gagal upload gambar")
      }
    } catch (error) {
      alert("Terjadi kesalahan saat upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        // Preview
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Upload Area
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileChange(file)
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag & drop gambar di sini
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  atau klik tombol di bawah untuk memilih file
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Pilih Gambar
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP, GIF (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
