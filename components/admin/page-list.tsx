"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink, Copy, Eye } from "lucide-react"
import { toast } from "sonner"
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

interface Page {
  id: string
  title: string
  slug: string
  isActive: boolean
  updatedAt: Date
}

interface PageListProps {
  pages: Page[]
  onUpdate?: () => void
}

export function PageList({ pages, onUpdate }: PageListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/halaman/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/halaman/${deleteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Halaman berhasil dihapus!", {
          description: "Halaman telah dihapus dari database",
          duration: 3000,
        })
        
        if (onUpdate) {
          onUpdate()
        } else {
          window.location.reload()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menghapus halaman", {
          description: data.error || "Terjadi kesalahan saat menghapus",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Belum ada halaman. Tambahkan halaman pertama Anda!</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-3">
        {pages.map((page) => (
          <div key={page.id} className="border rounded-lg p-4 space-y-3 bg-card">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{page.title}</h3>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                /halaman/{page.slug}
              </code>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {page.isActive ? (
                <Badge className="bg-green-600 text-xs">Aktif</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Nonaktif</Badge>
              )}
              <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                Update: {new Date(page.updatedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/halaman/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(page.slug)}
              >
                {copiedSlug === page.slug ? (
                  <>✓ Copied</>
                ) : (
                  <><Copy className="h-4 w-4 mr-2" />Copy</>
                )}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/halaman/${page.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeleteId(page.id)}
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
              <TableHead>Judul</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terakhir Update</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                </TableCell>
                <TableCell>
                  {page.isActive ? (
                    <Badge className="bg-green-600">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell suppressHydrationWarning>
                  {new Date(page.updatedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      asChild
                      title="Kunjungi Halaman"
                    >
                      <a
                        href={`/halaman/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyLink(page.slug)}
                      title="Copy Link"
                    >
                      {copiedSlug === page.slug ? (
                        <span className="text-xs text-green-600 font-semibold">✓</span>
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Edit">
                      <Link href={`/admin/halaman/${page.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(page.id)}
                      title="Hapus"
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
            <AlertDialogTitle>Hapus Halaman?</AlertDialogTitle>
            <AlertDialogDescription>
              Halaman ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
