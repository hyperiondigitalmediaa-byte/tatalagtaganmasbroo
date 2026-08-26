"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SocialMedia {
  id: string
  platform: string
  url: string
  isActive: boolean
  order: number
}

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: MessageCircle,
  whatsapp: MessageCircle,
}

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  twitter: "Twitter / X",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
}

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    fetchSocialMedia()
  }, [])

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch("/api/admin/social-media")
      const data = await response.json()
      setSocialMedia(data)
    } catch (error) {
      console.error("Error fetching social media:", error)
      toast.error("Gagal memuat data", {
        description: "Terjadi kesalahan saat mengambil data social media",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.platform || !formData.url) {
      toast.error("Platform dan URL harus diisi", {
        description: "Pastikan semua field yang wajib telah diisi",
        duration: 3000,
      })
      return
    }

    try {
      const url = editingId
        ? `/api/admin/social-media/${editingId}`
        : "/api/admin/social-media"
      const method = editingId ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(
          editingId
            ? "Social media berhasil diupdate!"
            : "Social media berhasil ditambahkan!",
          {
            description: editingId
              ? "Perubahan telah disimpan ke database"
              : "Social media baru telah ditambahkan ke database",
            duration: 3000,
          }
        )
        fetchSocialMedia()
        resetForm()
      } else {
        const data = await response.json()
        toast.error("Gagal menyimpan data", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    }
  }

  const handleEdit = (item: SocialMedia) => {
    setEditingId(item.id)
    setFormData({
      platform: item.platform,
      url: item.url,
      isActive: item.isActive,
      order: item.order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/social-media/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Social media berhasil dihapus!", {
          description: "Social media telah dihapus dari database",
          duration: 3000,
        })
        fetchSocialMedia()
        setDeleteId(null)
      } else {
        const data = await response.json()
        toast.error("Gagal menghapus data", {
          description: data.error || "Terjadi kesalahan saat menghapus",
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

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        toast.success("Status berhasil diupdate!", {
          description: `Social media telah ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
          duration: 3000,
        })
        fetchSocialMedia()
      } else {
        const data = await response.json()
        toast.error("Gagal mengupdate status", {
          description: data.error || "Terjadi kesalahan saat mengupdate",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      isActive: true,
      order: 0,
    })
    setEditingId(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">Manajemen Social Media</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola link social media yang tampil di topbar dan footer
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-6xl">
        {/* List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Daftar Social Media</CardTitle>
                <CardDescription>
                  {socialMedia.length} social media terdaftar
                </CardDescription>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Edit Social Media" : "Tambah Social Media"}
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan platform dan URL social media
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select
                          value={formData.platform}
                          onValueChange={(value) =>
                            setFormData({ ...formData, platform: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(platformLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                          id="url"
                          type="url"
                          value={formData.url}
                          onChange={(e) =>
                            setFormData({ ...formData, url: e.target.value })
                          }
                          placeholder="https://facebook.com/username"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="order">Urutan</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, isActive: checked })
                          }
                        />
                        <Label htmlFor="isActive">Aktif</Label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" className="flex-1">
                        {editingId ? "Update" : "Tambah"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {socialMedia.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada social media. Klik tombol Tambah untuk memulai.
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-center">Urutan</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {socialMedia.map((item) => {
                        const Icon =
                          platformIcons[item.platform] || MessageCircle
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span className="font-medium">
                                  {platformLabels[item.platform] ||
                                    item.platform}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {item.url.substring(0, 40)}
                                {item.url.length > 40 && "..."}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell className="text-center">
                              {item.order}
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={item.isActive}
                                onCheckedChange={(checked) =>
                                  toggleActive(item.id, checked)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {socialMedia.map((item) => {
                    const Icon = platformIcons[item.platform] || MessageCircle
                    return (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">
                                {platformLabels[item.platform] || item.platform}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Urutan: {item.order}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={(checked) =>
                              toggleActive(item.id, checked)
                            }
                          />
                        </div>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                        >
                          {item.url}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="flex-1"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AlertDialog untuk Delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Social Media?</AlertDialogTitle>
            <AlertDialogDescription>
              Social media yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin
              menghapus social media ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
