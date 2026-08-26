"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface ParentMenu {
  id: string
  label: string
}

interface MenuFormProps {
  menu?: {
    id: string
    label: string
    url: string
    type: string
    isActive: boolean
    order: number
    openNewTab: boolean
    parentId: string | null
  }
  parentMenus?: ParentMenu[]
  onSuccess?: () => void
}

export function MenuForm({ menu, parentMenus = [], onSuccess }: MenuFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    label: menu?.label || "",
    url: menu?.url || "",
    type: menu?.type || "LINK",
    parentId: menu?.parentId || "",
    isActive: menu?.isActive ?? true,
    order: menu?.order || 0,
    openNewTab: menu?.openNewTab || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = menu
        ? `/api/menu/${menu.id}`
        : "/api/menu"
      
      const method = menu ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(
          menu ? "Menu berhasil diperbarui!" : "Menu berhasil dibuat!",
          {
            description: `Menu "${formData.label}" telah disimpan`,
            duration: 3000,
          }
        )
        
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/admin/menu")
          router.refresh()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menyimpan menu", {
          description: data.error || "Terjadi kesalahan saat menyimpan",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error saving menu:", error)
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
            <Label htmlFor="label">Label Menu</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Contoh: HOME, HUKRIM, LEGISLATOR"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="/kategori/hukrim atau https://example.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Bisa internal (/kategori/politik) atau eksternal (https://example.com)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LINK">Link Biasa</SelectItem>
                <SelectItem value="CATEGORY">Kategori</SelectItem>
                <SelectItem value="PAGE">Halaman</SelectItem>
                <SelectItem value="DROPDOWN">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {parentMenus.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Menu (Optional)</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tidak ada (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada (Top Level)</SelectItem>
                  {parentMenus.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Pilih parent menu untuk membuat submenu/dropdown
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Urutan tampil menu (0 = paling kiri)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="openNewTab">Buka di Tab Baru</Label>
              <p className="text-xs text-muted-foreground">
                Link akan dibuka di tab baru
              </p>
            </div>
            <Switch
              id="openNewTab"
              checked={formData.openNewTab}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, openNewTab: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Status</Label>
              <p className="text-xs text-muted-foreground">
                Aktifkan atau nonaktifkan menu
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
          {isLoading ? "Menyimpan..." : menu ? "Update Menu" : "Buat Menu"}
        </Button>
      </div>
    </form>
  )
}
