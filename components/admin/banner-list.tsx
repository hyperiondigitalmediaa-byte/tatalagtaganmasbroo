"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink, Image as ImageIcon, Code } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface Banner {
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

interface BannerListProps {
  banners: Banner[]
  onUpdate?: () => void
}

export function BannerList({ banners, onUpdate }: BannerListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/banner/${deleteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Banner berhasil dihapus!", {
          description: "Banner telah dihapus dari database",
          duration: 3000,
        })
        
        if (onUpdate) {
          onUpdate()
        } else {
          window.location.reload()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menghapus banner", {
          description: data.error || "Terjadi kesalahan saat menghapus",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      ARTICLE_LIST: "List Artikel",
      SIDEBAR: "Sidebar",
      HEADER: "Header"
    }
    return labels[position] || position
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Belum ada banner. Tambahkan banner pertama Anda!</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="border rounded-lg p-4 space-y-3 bg-card">
            {/* Preview & Title */}
            <div className="flex gap-3">
              {banner.type === "IMAGE" && banner.imageUrl ? (
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                  <Code className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{banner.title}</h3>
                {banner.linkUrl && (
                  <a
                    href={banner.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <span className="truncate">{banner.linkUrl.substring(0, 30)}...</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={banner.type === "IMAGE" ? "default" : "secondary"} className="gap-1 text-xs">
                {banner.type === "IMAGE" ? (
                  <><ImageIcon className="h-3 w-3" /> Gambar</>
                ) : (
                  <><Code className="h-3 w-3" /> Script</>
                )}
              </Badge>
              <Badge variant="outline" className="text-xs">{getPositionLabel(banner.position)}</Badge>
              {banner.isActive ? (
                <Badge className="bg-green-600 text-xs">Aktif</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Nonaktif</Badge>
              )}
              <Badge variant="outline" className="text-xs">Urutan: {banner.order}</Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/admin/banner/${banner.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeleteId(banner.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Posisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  {banner.type === "IMAGE" && banner.imageUrl ? (
                    <div className="relative w-20 h-12 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <Code className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{banner.title}</p>
                    {banner.linkUrl && (
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {banner.linkUrl.substring(0, 40)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={banner.type === "IMAGE" ? "default" : "secondary"} className="gap-1">
                    {banner.type === "IMAGE" ? (
                      <><ImageIcon className="h-3 w-3" /> Gambar</>
                    ) : (
                      <><Code className="h-3 w-3" /> Script</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getPositionLabel(banner.position)}</Badge>
                </TableCell>
                <TableCell>
                  {banner.isActive ? (
                    <Badge className="bg-green-600">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell>{banner.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/banner/${banner.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Banner ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
