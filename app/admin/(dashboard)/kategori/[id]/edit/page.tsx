import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id }
  })
  return category
}

export default async function EditKategoriPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/kategori">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Kategori</h1>
          <p className="text-muted-foreground">Ubah kategori</p>
        </div>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
