"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PageList } from "@/components/admin/page-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PageForm } from "@/components/admin/page-form"

export default function HalamanPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/halaman")
      const data = await response.json()
      setPages(data)
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchPages()
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
          <h1 className="text-2xl md:text-3xl font-bold truncate">Halaman</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kelola halaman statis seperti Tentang, Kontak, dll</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Halaman
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Halaman</DialogTitle>
              <DialogDescription>
                Buat halaman statis baru seperti Tentang Kami, Kontak, dll
              </DialogDescription>
            </DialogHeader>
            <PageForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <PageList pages={pages} onUpdate={fetchPages} />
    </div>
  )
}
