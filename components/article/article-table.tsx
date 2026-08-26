"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink, Clock, CheckCircle2, FileText, Archive } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  status: string
  views: number
  createdAt: Date
  scheduledAt?: Date | null
  author: { name: string }
  category: { name: string }
}

interface ArticleTableProps {
  articles: Article[]
}

export function ArticleTable({ articles }: ArticleTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkAction, setIsBulkAction] = useState(false)
  const [bulkActionType, setBulkActionType] = useState<"publish" | "draft" | "archive" | "delete" | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/articles/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Artikel berhasil dihapus!", {
          description: "Artikel telah dihapus dari database",
          duration: 3000,
        })
        router.refresh()
        setDeleteId(null)
      } else {
        toast.error("Gagal menghapus artikel", {
          description: "Terjadi kesalahan saat menghapus artikel",
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

  const toggleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(articles.map((a) => a.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = async (action: "publish" | "draft" | "archive" | "delete") => {
    if (selectedIds.length === 0) {
      toast.warning("Tidak ada artikel yang dipilih", {
        description: "Pilih minimal 1 artikel untuk melakukan aksi",
        duration: 3000,
      })
      return
    }

    // Set action type untuk AlertDialog
    setBulkActionType(action)
  }

  const confirmBulkAction = async () => {
    if (!bulkActionType) return

    const actionLabels = {
      publish: "Publikasikan",
      draft: "Jadikan Draft",
      archive: "Arsipkan",
      delete: "Hapus"
    }

    setIsBulkAction(true)
    try {
      const res = await fetch("/api/admin/articles/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: bulkActionType,
          articleIds: selectedIds
        })
      })

      if (res.ok) {
        toast.success(`${actionLabels[bulkActionType]} berhasil!`, {
          description: `${selectedIds.length} artikel telah diproses`,
          duration: 3000,
        })
        setSelectedIds([])
        setBulkActionType(null)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error("Gagal melakukan aksi bulk", {
          description: data.error || "Terjadi kesalahan",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsBulkAction(false)
      setBulkActionType(null)
    }
  }

  const getStatusBadge = (status: string, scheduledAt?: Date | null) => {
    const variants: Record<string, any> = {
      PUBLISHED: { variant: "default", icon: CheckCircle2, label: "Dipublikasi" },
      DRAFT: { variant: "secondary", icon: FileText, label: "Draft" },
      SCHEDULED: { variant: "outline", icon: Clock, label: "Terjadwal" },
      ARCHIVED: { variant: "destructive", icon: Archive, label: "Diarsipkan" }
    }

    const config = variants[status] || variants.DRAFT
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
        {status === "SCHEDULED" && scheduledAt && (
          <span className="text-xs ml-1">
            ({format(new Date(scheduledAt), "dd/MM HH:mm")})
          </span>
        )}
      </Badge>
    )
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={true} onCheckedChange={() => setSelectedIds([])} />
            <span className="font-medium">{selectedIds.length} artikel dipilih</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("publish")}
              disabled={isBulkAction}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Publikasikan
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("draft")}
              disabled={isBulkAction}
            >
              <FileText className="h-4 w-4 mr-1" />
              Draft
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("archive")}
              disabled={isBulkAction}
            >
              <Archive className="h-4 w-4 mr-1" />
              Arsipkan
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction("delete")}
              disabled={isBulkAction}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.includes(article.id)}
                onCheckedChange={() => toggleSelect(article.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{article.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {getStatusBadge(article.status, article.scheduledAt)}
                  <span>•</span>
                  <span>{article.category.name}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/${article.slug}`} target="_blank" className="cursor-pointer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Lihat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/artikel/${article.id}/edit`} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(article.id)}
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.views}</span>
              </div>
              <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: idLocale })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === articles.length && articles.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[35%]">Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Belum ada artikel. Buat artikel pertama Anda!
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(article.id)}
                      onCheckedChange={() => toggleSelect(article.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Oleh {article.author.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(article.status, article.scheduledAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{article.views}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(article.createdAt), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {article.status === "PUBLISHED" ? (
                          <DropdownMenuItem asChild>
                            <Link 
                              href={`/${article.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4 text-blue-600" />
                              Lihat Artikel
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <ExternalLink className="mr-2 h-4 w-4 text-gray-400" />
                            Lihat Artikel (Draft)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/artikel/${article.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(article.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* AlertDialog untuk Delete Single */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin
              menghapus artikel ini?
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

      {/* AlertDialog untuk Bulk Action */}
      <AlertDialog open={!!bulkActionType} onOpenChange={() => setBulkActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkActionType === "delete" && "Hapus Artikel?"}
              {bulkActionType === "publish" && "Publikasikan Artikel?"}
              {bulkActionType === "draft" && "Jadikan Draft?"}
              {bulkActionType === "archive" && "Arsipkan Artikel?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkActionType === "delete" && 
                `Anda akan menghapus ${selectedIds.length} artikel. Artikel yang dihapus tidak dapat dikembalikan.`
              }
              {bulkActionType === "publish" && 
                `Anda akan mempublikasikan ${selectedIds.length} artikel.`
              }
              {bulkActionType === "draft" && 
                `Anda akan mengubah ${selectedIds.length} artikel menjadi draft.`
              }
              {bulkActionType === "archive" && 
                `Anda akan mengarsipkan ${selectedIds.length} artikel.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkAction}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              disabled={isBulkAction}
              className={bulkActionType === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isBulkAction ? "Memproses..." : "Ya, Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
