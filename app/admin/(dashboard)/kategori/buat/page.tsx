import { CategoryForm } from "@/components/admin/category-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BuatKategoriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/kategori">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tambah Kategori</h1>
          <p className="text-muted-foreground">Buat kategori baru</p>
        </div>
      </div>

      <CategoryForm />
    </div>
  )
}
