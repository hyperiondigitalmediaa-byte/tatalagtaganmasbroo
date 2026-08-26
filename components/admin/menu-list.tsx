"use client"

import React, { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronRight } from "lucide-react"
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

interface MenuItem {
  id: string
  label: string
  url: string
  type: string
  isActive: boolean
  order: number
  openNewTab: boolean
  children?: MenuItem[]
}

interface MenuListProps {
  menus: MenuItem[]
  onUpdate?: () => void
}

export function MenuList({ menus, onUpdate }: MenuListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/menu/${deleteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Menu berhasil dihapus!", {
          description: "Menu telah dihapus dari navigasi",
          duration: 3000,
        })
        
        if (onUpdate) {
          onUpdate()
        } else {
          window.location.reload()
        }
      } else {
        const data = await response.json()
        toast.error("Gagal menghapus menu", {
          description: data.error || "Terjadi kesalahan saat menghapus",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error deleting menu:", error)
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Belum ada menu. Tambahkan menu pertama Anda!</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-3">
        {menus.map((menu) => (
          <div key={menu.id} className="space-y-2">
            {/* Parent Menu Card */}
            <div className="border rounded-lg p-4 space-y-3 bg-card">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{menu.label}</h3>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                  {menu.url}
                </code>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">{menu.type}</Badge>
                {menu.isActive ? (
                  <Badge className="bg-green-600 text-xs">Aktif</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Nonaktif</Badge>
                )}
                <Badge variant="outline" className="text-xs">Urutan: {menu.order}</Badge>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/menu/${menu.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteId(menu.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>

            {/* Submenu Cards */}
            {menu.children && menu.children.length > 0 && (
              <div className="ml-4 space-y-2">
                {menu.children.map((child) => (
                  <div key={child.id} className="border rounded-lg p-3 space-y-2 bg-gray-50">
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-medium text-sm">{child.label}</h4>
                        <code className="text-xs bg-white px-2 py-1 rounded block truncate">
                          {child.url}
                        </code>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">{child.type}</Badge>
                      {child.isActive ? (
                        <Badge className="bg-green-600 text-xs">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Nonaktif</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">Urutan: {child.order}</Badge>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/menu/${child.id}/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(child.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu) => (
              <React.Fragment key={menu.id}>
                <TableRow>
                  <TableCell className="font-medium">{menu.label}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{menu.url}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{menu.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {menu.isActive ? (
                      <Badge className="bg-green-600">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>{menu.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/menu/${menu.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(menu.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {/* Submenu */}
                {menu.children && menu.children.length > 0 && menu.children.map((child) => (
                  <TableRow key={child.id} className="bg-gray-50">
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {child.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{child.url}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{child.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {child.isActive ? (
                        <Badge className="bg-green-600">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{child.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/menu/${child.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(child.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Menu?</AlertDialogTitle>
            <AlertDialogDescription>
              Menu ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
