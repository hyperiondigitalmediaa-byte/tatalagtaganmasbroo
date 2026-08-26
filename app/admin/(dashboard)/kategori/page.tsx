"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryList } from "@/components/admin/category-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CategoryForm } from "@/components/admin/category-form"

export default function KategoriPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/kategori")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchCategories()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Kategori</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Kelola kategori artikel</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
              <DialogDescription>
                Buat kategori baru untuk artikel
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <CategoryList categories={categories} onUpdate={fetchCategories} />
    </div>
  )
}
