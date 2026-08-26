import { PageForm } from "@/components/admin/page-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BuatHalamanPage() {
  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/admin/halaman">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold truncate">Tambah Halaman</h1>
          <p className="text-sm md:text-base text-muted-foreground">Buat halaman statis baru</p>
        </div>
      </div>

      <PageForm />
    </div>
  )
}
