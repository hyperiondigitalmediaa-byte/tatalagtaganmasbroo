"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MenuList } from "@/components/admin/menu-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MenuForm } from "@/components/admin/menu-form"

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [parentMenus, setParentMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menu")
      const data = await response.json()
      setMenus(data.filter((m: any) => !m.parentId))
      setParentMenus(data.filter((m: any) => !m.parentId).map((m: any) => ({ id: m.id, label: m.label })))
    } catch (error) {
      console.error("Error fetching menus:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchMenus()
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
          <h1 className="text-2xl md:text-3xl font-bold truncate">Menu Navigasi</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kelola menu navbar website</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Menu</DialogTitle>
              <DialogDescription>
                Buat menu navigasi baru untuk navbar website
              </DialogDescription>
            </DialogHeader>
            <MenuForm parentMenus={parentMenus} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <MenuList menus={menus} onUpdate={fetchMenus} />
    </div>
  )
}
