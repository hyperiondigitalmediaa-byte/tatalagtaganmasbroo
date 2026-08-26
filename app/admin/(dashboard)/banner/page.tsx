"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BannerList } from "@/components/admin/banner-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BannerForm } from "@/components/admin/banner-form"

export default function BannerPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banner")
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchBanners()
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
          <h1 className="text-2xl md:text-3xl font-bold truncate">Banner</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kelola banner iklan di website</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Banner</DialogTitle>
              <DialogDescription>
                Buat banner iklan baru untuk website
              </DialogDescription>
            </DialogHeader>
            <BannerForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <BannerList banners={banners} onUpdate={fetchBanners} />
    </div>
  )
}
