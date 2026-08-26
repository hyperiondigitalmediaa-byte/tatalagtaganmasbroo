"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Trash2, Shield, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

interface UserListProps {
  users: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
    _count: {
      articles: number
    }
  }>
  onUpdate?: () => void
}

export function UserList({ users, onUpdate }: UserListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        throw new Error("Gagal menghapus user")
      }

      toast.success("User berhasil dihapus!", {
        description: "User telah dihapus dari database",
        duration: 3000,
      })
      
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
      setDeleteId(null)
    } catch (error) {
      toast.error("Gagal menghapus user", {
        description: "Terjadi kesalahan saat menghapus",
        duration: 4000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Belum ada user</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 space-y-3 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(user.id)}
                  className="text-destructive hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                  {user.role === "ADMIN" ? (
                    <><Shield className="mr-1 h-3 w-3" /> Admin</>
                  ) : (
                    <><User className="mr-1 h-3 w-3" /> Editor</>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {user._count.articles} artikel
                </span>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Dibuat {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                  locale: idLocale
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Artikel</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada user
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? (
                        <><Shield className="mr-1 h-3 w-3" /> Admin</>
                      ) : (
                        <><User className="mr-1 h-3 w-3" /> Editor</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.articles} artikel</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                      locale: idLocale
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              User ini akan dihapus permanen. Artikel yang dibuat user ini tidak akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
