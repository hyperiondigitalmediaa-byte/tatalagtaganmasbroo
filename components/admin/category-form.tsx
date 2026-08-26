"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  onSuccess?: () => void
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || ""
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category ? formData.slug : generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = category
        ? `/api/kategori/${category.id}`
        : "/api/kategori"
      
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(
          category ? "Kategori berhasil diperbarui!" : "Kategori berhasil dibuat!",
          {
            description: `Kategori "${formData.name}" telah disimpan`,
            duration: 3000,
          }
        )
        
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/admin/kategori")
          router.refresh()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menyimpan kategori", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Politik, Ekonomi, Olahraga"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="politik-ekonomi-olahraga"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version dari nama kategori
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi singkat tentang kategori ini"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {!onSuccess && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Menyimpan..." : category ? "Update Kategori" : "Buat Kategori"}
        </Button>
      </div>
    </form>
  )
}
