"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function PengaturanPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'favicon' | null>(null)
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    logoUrl: "",
    faviconUrl: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    if (!file) return

    // Validasi file
    const validTypes = type === 'logo' 
      ? ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
      : ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon']
    
    if (!validTypes.includes(file.type)) {
      toast.error(`Format file tidak valid untuk ${type}`)
      return
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB")
      return
    }

    setUploading(type)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSettings(prev => ({
          ...prev,
          [type === 'logo' ? 'logoUrl' : 'faviconUrl']: data.url
        }))
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} berhasil diupload`)
      } else {
        toast.error(data.error || "Gagal upload file")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload")
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Pengaturan berhasil disimpan. Refresh halaman...")
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.error(data.error || "Gagal menyimpan pengaturan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold truncate">Pengaturan Website</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Kelola logo, favicon, dan informasi website
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 max-w-4xl">
        {/* Logo & Favicon */}
        <Card>
          <CardHeader>
            <CardTitle>Logo & Favicon</CardTitle>
            <CardDescription>
              Upload logo untuk navbar dan favicon untuk icon tab browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo Website</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Format: PNG, JPG, SVG (Rekomendasi: 200x50px, max 2MB)
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                {settings.logoUrl && (
                  <div className="relative w-full sm:w-48 h-16 border rounded-lg overflow-hidden bg-white">
                    <Image
                      src={settings.logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div className="w-full sm:w-auto">
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'logo')
                    }}
                    disabled={uploading === 'logo'}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label htmlFor="logo-upload" className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading === 'logo'}
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label>Favicon (Icon Tab Browser)</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Format: PNG, ICO (Rekomendasi: 32x32px atau 16x16px, max 2MB)
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                {settings.faviconUrl && (
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-white">
                    <Image
                      src={settings.faviconUrl}
                      alt="Favicon"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div className="w-full sm:w-auto">
                  <Input
                    type="file"
                    accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'favicon')
                    }}
                    disabled={uploading === 'favicon'}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <Label htmlFor="favicon-upload" className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading === 'favicon'}
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <span>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Website */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Website</CardTitle>
            <CardDescription>
              Nama dan deskripsi website untuk SEO dan branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nama Website</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Portal Berita"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Deskripsi Website</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Website berita terkini dan terpercaya"
                rows={3}
              />
              <p className="text-xs md:text-sm text-muted-foreground">
                Deskripsi ini akan muncul di hasil pencarian Google
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={loading} 
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
