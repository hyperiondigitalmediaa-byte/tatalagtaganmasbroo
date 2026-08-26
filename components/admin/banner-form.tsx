"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { Upload, X, Code } from "lucide-react"

interface BannerFormProps {
  banner?: {
    id: string
    title: string
    type: string
    imageUrl: string | null
    adCode: string | null
    linkUrl: string | null
    position: string
    isActive: boolean
    order: number
  }
  onSuccess?: () => void
}

export function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || "")
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    type: banner?.type || "IMAGE",
    imageUrl: banner?.imageUrl || "",
    adCode: banner?.adCode || "",
    linkUrl: banner?.linkUrl || "",
    position: banner?.position || "ARTICLE_LIST",
    isActive: banner?.isActive ?? true,
    order: banner?.order || 0
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
      formData.append("type", "banner")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        toast.success("Gambar berhasil diupload!", {
          description: "Gambar telah tersimpan di Cloudinary",
          duration: 3000,
        })
      } else {
        toast.error("Gagal upload gambar", {
          description: "Terjadi kesalahan saat upload",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Terjadi kesalahan saat upload", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = banner
        ? `/api/banner/${banner.id}`
        : "/api/banner"
      
      const method = banner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(
          banner ? "Banner berhasil diperbarui!" : "Banner berhasil dibuat!",
          {
            description: `Banner "${formData.title}" telah disimpan`,
            duration: 3000,
          }
        )
        
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/admin/banner")
          router.refresh()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menyimpan banner", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error saving banner:", error)
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
            <Label htmlFor="title">Judul Banner</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Banner Promo Ramadan"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Tipe Banner</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: string) => setFormData({ ...formData, type: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="IMAGE" id="type-image" />
                <Label htmlFor="type-image" className="font-normal cursor-pointer">
                  Upload Gambar
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SCRIPT" id="type-script" />
                <Label htmlFor="type-script" className="font-normal cursor-pointer">
                  Kode Iklan (AdSense, dll)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.type === "IMAGE" ? (
            <>
              <div className="space-y-2">
                <Label>Gambar Banner</Label>
            
            {!imageUrl ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {isUploading ? "Mengupload..." : "Klik untuk upload gambar"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF hingga 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Klik tombol X untuk mengganti gambar
                </p>
              </div>
            )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL Tujuan (Optional)</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="https://example.com/promo"
                />
                <p className="text-xs text-muted-foreground">
                  URL yang akan dibuka ketika banner diklik
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="adCode">Kode Iklan</Label>
              <Textarea
                id="adCode"
                value={formData.adCode}
                onChange={(e) => setFormData({ ...formData, adCode: e.target.value })}
                placeholder="Paste kode iklan Google AdSense atau script iklan lainnya di sini..."
                rows={8}
                className="font-mono text-sm"
                required
              />
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Code className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Paste kode script lengkap dari Google AdSense</li>
                    <li>Pastikan kode dimulai dengan &lt;script&gt; dan diakhiri &lt;/script&gt;</li>
                    <li>Kode akan ditampilkan persis seperti yang Anda paste</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="position">Posisi</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARTICLE_LIST">List Artikel</SelectItem>
                <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                <SelectItem value="HEADER">Header</SelectItem>
                <SelectItem value="DETAIL_ARTIKEL">Detail Artikel</SelectItem>
                <SelectItem value="FLOATING_LEFT">Floating Kiri</SelectItem>
                <SelectItem value="FLOATING_RIGHT">Floating Kanan</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.position === "ARTICLE_LIST" && "Banner akan muncul di antara list artikel"}
              {formData.position === "SIDEBAR" && "Banner akan muncul di sidebar kanan"}
              {formData.position === "HEADER" && "Banner akan muncul di bawah navbar (header)"}
              {formData.position === "DETAIL_ARTIKEL" && "Banner akan muncul di halaman detail artikel"}
              {formData.position === "FLOATING_LEFT" && "Banner akan melayang di sisi kiri layar (ukuran 160x600)"}
              {formData.position === "FLOATING_RIGHT" && "Banner akan melayang di sisi kanan layar (ukuran 160x600)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              min="0"
            />
            {formData.position === "DETAIL_ARTIKEL" ? (
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold">Panduan urutan untuk Detail Artikel:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li><strong>0</strong> = Di atas judul artikel</li>
                  <li><strong>1</strong> = Sebelum konten artikel</li>
                  <li><strong>2</strong> = Setelah konten artikel</li>
                  <li><strong>3</strong> = Sebelum share buttons bawah</li>
                  <li><strong>100-199</strong> = Di tengah-tengah konten artikel (otomatis tersebar)</li>
                  <li><strong>200+</strong> = Di sidebar (bisa banyak)</li>
                </ul>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Urutan tampil banner (0 = paling atas)
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Status</Label>
              <p className="text-xs text-muted-foreground">
                Aktifkan atau nonaktifkan banner
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

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {!onSuccess && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Batal
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={
            isLoading || 
            isUploading || 
            (formData.type === "IMAGE" && !imageUrl) ||
            (formData.type === "SCRIPT" && !formData.adCode)
          }
          className="w-full sm:w-auto order-1 sm:order-2 flex-1"
        >
          {isLoading ? "Menyimpan..." : banner ? "Update Banner" : "Buat Banner"}
        </Button>
      </div>
    </form>
  )
}
