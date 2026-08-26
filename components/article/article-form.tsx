"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { SEOPreview } from "@/components/seo-preview"
import { Loader2, Save, Send, Eye } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

interface ArticleFormProps {
  categories: Category[]
  tags: Tag[]
  initialData?: any
}

export function ArticleForm({ categories, tags, initialData }: ArticleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags?.map((t: any) => t.tag.id) || [],
    featuredImage: initialData?.featuredImage || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    focusKeyword: initialData?.focusKeyword || "",
    canonicalUrl: initialData?.canonicalUrl || "",
    ogTitle: initialData?.ogTitle || "",
    ogDescription: initialData?.ogDescription || "",
    ogImage: initialData?.ogImage || "",
    showViews: initialData?.showViews ?? true,
    scheduledAt: initialData?.scheduledAt
      ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
      : "",
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      // Remove special characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      // Replace multiple spaces with single hyphen
      .replace(/\s+/g, "-")
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Limit to 100 characters
      .substring(0, 100)
  }

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }))
  }

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED" | "SCHEDULED") => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      toast.error("Form tidak lengkap!", {
        description: "Judul, konten, dan kategori wajib diisi",
        duration: 4000,
      })
      return
    }

    // Determine final status
    let finalStatus = status
    if (status === "PUBLISHED" && formData.scheduledAt) {
      const scheduledDate = new Date(formData.scheduledAt)
      const now = new Date()
      if (scheduledDate > now) {
        finalStatus = "SCHEDULED"
      }
    }

    setIsLoading(true)
    try {
      const url = initialData
        ? `/api/articles/${initialData.id}`
        : "/api/articles"

      const method = initialData ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: finalStatus,
          scheduledAt: formData.scheduledAt || null,
          excerpt: formData.excerpt || formData.content.substring(0, 200),
          metaTitle: formData.metaTitle || formData.title,
        }),
      })

      if (res.ok) {
        const statusLabels = {
          DRAFT: "Draft",
          PUBLISHED: "Dipublikasikan",
          SCHEDULED: "Dijadwalkan"
        }
        
        toast.success(
          initialData ? "Artikel berhasil diperbarui!" : "Artikel berhasil dibuat!",
          {
            description: `Status: ${statusLabels[finalStatus]}`,
            duration: 3000,
          }
        )
        
        router.push("/admin/artikel")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error("Gagal menyimpan artikel", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      className="space-y-6"
    >
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul Artikel <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel..."
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="slug-artikel"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  URL: /artikel/{formData.slug || "slug-artikel"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Kategori <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Utama</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, featuredImage: url }))
                }
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                Konten Artikel <span className="text-destructive">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ringkasan singkat artikel (opsional, akan di-generate otomatis jika kosong)"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showViews" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Tampilkan Jumlah Pembaca
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan berapa orang yang sudah membaca artikel ini
                  </p>
                </div>
                <Switch
                  id="showViews"
                  checked={formData.showViews}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, showViews: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Jadwal Publish (Optional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledAt: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Artikel akan otomatis publish pada waktu yang ditentukan.
                  Kosongkan untuk publish manual.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 mt-6">
          {/* SEO Preview */}
          <SEOPreview
            title={formData.title}
            metaTitle={formData.metaTitle}
            metaDescription={formData.metaDescription}
            slug={formData.slug}
            focusKeyword={formData.focusKeyword}
          />

          {/* Basic SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Basic SEO</CardTitle>
              <CardDescription>
                Optimasi untuk mesin pencari (Google, Bing, dll)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="Judul untuk SEO (default: judul artikel)"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.metaTitle.length}/60 karakter (optimal: 50-60)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Deskripsi untuk SEO"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.metaDescription.length}/160 karakter (optimal: 150-160)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus Keyword</Label>
                <Input
                  id="focusKeyword"
                  placeholder="Kata kunci utama artikel ini"
                  value={formData.focusKeyword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      focusKeyword: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Kata kunci yang ingin di-ranking di Google
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
                <Input
                  id="canonicalUrl"
                  type="url"
                  placeholder="https://example.com/artikel-asli"
                  value={formData.canonicalUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Gunakan jika artikel ini adalah republish dari sumber lain
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Open Graph (Social Media) */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media (Open Graph)</CardTitle>
              <CardDescription>
                Tampilan saat dibagikan di Facebook, Twitter, WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  placeholder="Judul untuk social media (default: meta title)"
                  value={formData.ogTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ogTitle: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  placeholder="Deskripsi untuk social media (default: meta description)"
                  value={formData.ogDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ogDescription: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  type="url"
                  placeholder="URL gambar untuk social media (default: featured image)"
                  value={formData.ogImage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ogImage: e.target.value }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Rekomendasi: 1200x630px
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publikasikan
          </Button>
        </div>
      </div>
    </form>
  )
}
