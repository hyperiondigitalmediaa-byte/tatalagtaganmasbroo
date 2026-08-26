"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { RichTextEditor } from "@/components/editor/rich-text-editor"

interface PageFormProps {
  page?: {
    id: string
    title: string
    slug: string
    content: string
    metaTitle: string | null
    metaDescription: string | null
    isActive: boolean
  }
  onSuccess?: () => void
}

export function PageForm({ page, onSuccess }: PageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    metaTitle: page?.metaTitle || "",
    metaDescription: page?.metaDescription || "",
    isActive: page?.isActive ?? true
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: page ? formData.slug : generateSlug(title)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = page
        ? `/api/halaman/${page.id}`
        : "/api/halaman"

      const method = page ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(
          page ? "Halaman berhasil diperbarui!" : "Halaman berhasil dibuat!",
          {
            description: `Halaman "${formData.title}" telah disimpan`,
            duration: 3000,
          }
        )
        
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/admin/halaman")
          router.refresh()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menyimpan halaman", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error saving page:", error)
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
            <Label htmlFor="title">Judul Halaman</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Tentang Kami, Kontak, Redaksi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="tentang-kami"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL: /halaman/{formData.slug || "slug"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Konten</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content: string) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Opsional - untuk SEO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Opsional - untuk SEO"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Status</Label>
              <p className="text-xs text-muted-foreground">
                Aktifkan atau nonaktifkan halaman
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
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
          {isLoading ? "Menyimpan..." : page ? "Update Halaman" : "Buat Halaman"}
        </Button>
      </div>
    </form>
  )
}
