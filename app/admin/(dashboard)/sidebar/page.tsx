"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, GripVertical, Pencil, Trash2, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Widget {
  id: string
  type: string
  title: string
  isActive: boolean
  order: number
  config: any
}

interface Settings {
  id: string
  isActive: boolean
  isSticky: boolean
}

const WIDGET_TYPES = [
  { value: "trending", label: "🔥 Trending Articles", description: "Artikel paling banyak dilihat" },
  { value: "latest", label: "📰 Latest Articles", description: "Artikel terbaru" },
  { value: "categories", label: "📂 Kategori Populer", description: "Daftar kategori" },
  { value: "tags", label: "🏷️ Tags Cloud", description: "Tag populer" },
  { value: "search", label: "🔍 Search Box", description: "Kotak pencarian" },
  { value: "ads", label: "💰 Ads Banner", description: "Banner iklan" },
  { value: "newsletter", label: "📧 Newsletter", description: "Form subscribe" },
  { value: "custom", label: "⚙️ Custom HTML", description: "HTML custom" },
]

export default function SidebarManagementPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)

  // Form state
  const [formType, setFormType] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formConfig, setFormConfig] = useState<any>({})
  const [adsMode, setAdsMode] = useState<"image" | "code">("image")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/sidebar")
      const data = await res.json()
      setWidgets(data.widgets)
      setSettings(data.settings)
    } catch (error) {
      toast.error("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/sidebar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        toast.success("Pengaturan disimpan")
      } else {
        toast.error("Gagal menyimpan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleWidget = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/sidebar/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive })
      })

      if (res.ok) {
        setWidgets(widgets.map(w => w.id === id ? { ...w, isActive } : w))
        toast.success(isActive ? "Widget diaktifkan" : "Widget dinonaktifkan")
      }
    } catch (error) {
      toast.error("Gagal mengubah status")
    }
  }

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteWidget = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/sidebar/${deleteId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setWidgets(widgets.filter(w => w.id !== deleteId))
        toast.success("Widget berhasil dihapus!", {
          description: "Widget telah dihapus dari sidebar",
          duration: 3000,
        })
        setDeleteId(null)
      } else {
        toast.error("Gagal menghapus widget", {
          description: "Terjadi kesalahan saat menghapus",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveWidget = async () => {
    if (!formType || !formTitle) {
      toast.error("Lengkapi form")
      return
    }

    try {
      const url = editingWidget
        ? `/api/admin/sidebar/${editingWidget.id}`
        : "/api/admin/sidebar"
      
      const method = editingWidget ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          title: formTitle,
          config: formConfig
        })
      })

      if (res.ok) {
        toast.success(editingWidget ? "Widget diupdate" : "Widget ditambahkan")
        setIsDialogOpen(false)
        fetchData()
        resetForm()
      }
    } catch (error) {
      toast.error("Gagal menyimpan")
    }
  }

  const resetForm = () => {
    setFormType("")
    setFormTitle("")
    setFormConfig({})
    setEditingWidget(null)
    setAdsMode("image")
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak valid. Gunakan JPG, PNG, atau WebP")
      return
    }

    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimal 2MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "ads")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setFormConfig({
          ...formConfig,
          mode: "image",
          imageUrl: data.url,
        })
        toast.success("Gambar berhasil diupload")
      } else {
        toast.error("Gagal upload gambar")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload")
    } finally {
      setIsUploading(false)
    }
  }

  const openEditDialog = (widget: Widget) => {
    setEditingWidget(widget)
    setFormType(widget.type)
    setFormTitle(widget.title)
    setFormConfig(widget.config || {})
    
    // Set ads mode based on config
    if (widget.type === "ads") {
      if (widget.config?.mode === "image" || widget.config?.imageUrl) {
        setAdsMode("image")
      } else {
        setAdsMode("code")
      }
    }
    
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div className="space-y-4 md:space-y-6"><div className="animate-pulse">Loading...</div></div>
  }

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">Pengaturan Sidebar</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Kelola widget sidebar dan pengaturan sticky
          </p>
        </div>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Global</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Aktifkan Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Tampilkan sidebar di semua halaman
              </p>
            </div>
            <Switch
              checked={settings?.isActive}
              onCheckedChange={(checked) =>
                setSettings(settings ? { ...settings, isActive: checked } : null)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sticky Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Sidebar mengikuti scroll (tetap terlihat)
              </p>
            </div>
            <Switch
              checked={settings?.isSticky}
              onCheckedChange={(checked) =>
                setSettings(settings ? { ...settings, isSticky: checked } : null)
              }
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </CardContent>
      </Card>

      {/* Widgets List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>Widget Sidebar</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Widget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingWidget ? "Edit Widget" : "Tambah Widget Baru"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tipe Widget</Label>
                    <Select value={formType} onValueChange={setFormType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe widget" />
                      </SelectTrigger>
                      <SelectContent>
                        {WIDGET_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div>{type.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Judul Widget</Label>
                    <Input
                      placeholder="Contoh: Artikel Trending"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>

                  {/* Config based on type */}
                  {formType === "trending" && (
                    <div className="space-y-2">
                      <Label>Jumlah Artikel</Label>
                      <Input
                        type="number"
                        min="3"
                        max="10"
                        value={formConfig.limit || 5}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, limit: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  )}

                  {formType === "latest" && (
                    <div className="space-y-2">
                      <Label>Jumlah Artikel</Label>
                      <Input
                        type="number"
                        min="3"
                        max="10"
                        value={formConfig.limit || 5}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, limit: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  )}

                  {formType === "categories" && (
                    <div className="space-y-2">
                      <Label>Jumlah Kategori</Label>
                      <Input
                        type="number"
                        min="4"
                        max="10"
                        value={formConfig.limit || 8}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, limit: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  )}

                  {formType === "ads" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ukuran Banner</Label>
                        <Select
                          value={formConfig.size || "300x250"}
                          onValueChange={(value) =>
                            setFormConfig({ ...formConfig, size: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300x250">300 x 250 (Recommended)</SelectItem>
                            <SelectItem value="300x600">300 x 600 (Half Page)</SelectItem>
                            <SelectItem value="336x280">336 x 280 (Large Rectangle)</SelectItem>
                            <SelectItem value="250x250">250 x 250 (Square)</SelectItem>
                            <SelectItem value="200x200">200 x 200 (Small Square)</SelectItem>
                            <SelectItem value="auto">Auto (Responsive)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tabs: Upload Image vs Custom Code */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex border-b">
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              adsMode === "image"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                            onClick={() => setAdsMode("image")}
                          >
                            📤 Upload Gambar
                          </button>
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              adsMode === "code"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                            onClick={() => setAdsMode("code")}
                          >
                            💻 Kode Custom
                          </button>
                        </div>

                        <div className="p-4">
                          {adsMode === "image" ? (
                            <div className="space-y-4">
                              {/* Image Upload */}
                              <div className="space-y-2">
                                <Label>Gambar Banner</Label>
                                {formConfig.imageUrl ? (
                                  <div className="space-y-2">
                                    <div className="relative border rounded-lg overflow-hidden">
                                      <img
                                        src={formConfig.imageUrl}
                                        alt="Banner preview"
                                        className="w-full h-auto"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setFormConfig({ ...formConfig, imageUrl: "" })
                                      }
                                    >
                                      Ganti Gambar
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/jpg,image/png,image/webp"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(file)
                                      }}
                                      className="hidden"
                                      id="banner-upload"
                                    />
                                    <label
                                      htmlFor="banner-upload"
                                      className="cursor-pointer"
                                    >
                                      {isUploading ? (
                                        <div className="text-muted-foreground">
                                          Uploading...
                                        </div>
                                      ) : (
                                        <div>
                                          <div className="text-4xl mb-2">📸</div>
                                          <div className="text-sm font-medium mb-1">
                                            Klik untuk upload gambar
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            JPG, PNG, WebP (Max 2MB)
                                          </div>
                                        </div>
                                      )}
                                    </label>
                                  </div>
                                )}
                              </div>

                              {/* Link URL */}
                              <div className="space-y-2">
                                <Label>URL Link Tujuan</Label>
                                <Input
                                  type="url"
                                  placeholder="https://example.com"
                                  value={formConfig.linkUrl || ""}
                                  onChange={(e) =>
                                    setFormConfig({
                                      ...formConfig,
                                      linkUrl: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* Open in new tab */}
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="openNewTab"
                                  checked={formConfig.openNewTab ?? true}
                                  onChange={(e) =>
                                    setFormConfig({
                                      ...formConfig,
                                      openNewTab: e.target.checked,
                                    })
                                  }
                                  className="rounded"
                                />
                                <Label htmlFor="openNewTab" className="cursor-pointer">
                                  Buka di tab baru
                                </Label>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label>Kode Iklan (HTML/JavaScript)</Label>
                              <textarea
                                className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm"
                                placeholder="Paste kode iklan Google AdSense atau HTML/JavaScript di sini..."
                                value={formConfig.adCode || ""}
                                onChange={(e) =>
                                  setFormConfig({
                                    ...formConfig,
                                    mode: "code",
                                    adCode: e.target.value,
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                💡 Tip: Untuk Google AdSense, gunakan ukuran "Auto (Responsive)"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleSaveWidget} className="w-full mt-2">
                    {editingWidget ? "Update Widget" : "Tambah Widget"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {widgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada widget. Klik "Tambah Widget" untuk memulai.
            </div>
          ) : (
            <div className="space-y-3">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg bg-card"
                >
                  <div className="hidden sm:block">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-sm sm:text-base truncate">{widget.title}</span>
                      <span className="text-xs text-muted-foreground">
                        ({WIDGET_TYPES.find(t => t.value === widget.type)?.label})
                      </span>
                    </div>
                    {widget.config?.limit && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Tampilkan {widget.config.limit} item
                      </p>
                    )}
                    {widget.type === "ads" && (
                      <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <p>Ukuran: {widget.config?.size || "300x250"}</p>
                        {widget.config?.mode === "image" && widget.config?.imageUrl && (
                          <p>Mode: 📤 Upload Gambar</p>
                        )}
                        {widget.config?.adCode && (
                          <p>Mode: 💻 Kode Custom ({widget.config.adCode.length} karakter)</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-between sm:justify-end">
                    <Switch
                      checked={widget.isActive}
                      onCheckedChange={(checked) => handleToggleWidget(widget.id, checked)}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(widget)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(widget.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AlertDialog untuk Delete Widget */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Widget?</AlertDialogTitle>
            <AlertDialogDescription>
              Widget ini akan dihapus dari sidebar. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWidget}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
