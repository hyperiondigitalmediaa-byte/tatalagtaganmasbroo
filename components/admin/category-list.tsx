"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink } from "lucide-react"
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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    articles: number
  }
}

interface CategoryListProps {
  categories: Category[]
  onUpdate?: () => void
}

export function CategoryList({ categories, onUpdate }: CategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/kategori/${deleteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Kategori berhasil dihapus!", {
          description: "Kategori telah dihapus dari database",
          duration: 3000,
        })
        
        if (onUpdate) {
          onUpdate()
        } else {
          window.location.reload()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menghapus kategori", {
          description: data.error || "Terjadi kesalahan saat menghapus",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Belum ada kategori. Tambahkan kategori pertama Anda!</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full overflow-auto border rounded-lg">
        <div className="min-w-full inline-block align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Nama</TableHead>
                <TableHead className="whitespace-nowrap">Slug</TableHead>
                <TableHead className="whitespace-nowrap">Deskripsi</TableHead>
                <TableHead className="whitespace-nowrap">Jumlah Artikel</TableHead>
                <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium whitespace-nowrap">{category.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {category.description || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary">{category._count.articles} artikel</Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild title="Lihat halaman kategori">
                        <Link href={`/kategori/${category.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit kategori">
                        <Link href={`/admin/kategori/${category.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(category.id)}
                        disabled={category._count.articles > 0}
                        title={category._count.articles > 0 ? "Tidak bisa hapus kategori yang memiliki artikel" : "Hapus kategori"}
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
