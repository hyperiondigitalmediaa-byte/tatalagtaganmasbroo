import { prisma } from "@/lib/prisma"
import { ArticleForm } from "@/components/article/article-form"

async function getFormData() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ])

  return { categories, tags }
}

export default async function BuatArtikelPage() {
  const { categories, tags } = await getFormData()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Artikel Baru</h1>
        <p className="text-muted-foreground mt-2">
          Tulis dan publikasikan artikel berita Anda
        </p>
      </div>

      <ArticleForm categories={categories} tags={tags} />
    </div>
  )
}
