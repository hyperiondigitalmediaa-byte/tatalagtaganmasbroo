"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UserList } from "@/components/admin/user-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserForm } from "@/components/admin/user-form"

export default function UsersPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Only ADMIN can access this page
  if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
    redirect("/admin")
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [status])

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchUsers()
  }

  if (status === "loading" || loading) {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">Kelola User</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
            Manage admin dan editor yang bisa akses dashboard
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>
                Buat akun admin atau editor baru
              </DialogDescription>
            </DialogHeader>
            <UserForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <UserList users={users} onUpdate={fetchUsers} />
    </div>
  )
}
