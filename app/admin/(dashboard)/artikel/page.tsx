import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ArticleTable } from "@/components/article/article-table"

async function getArticles() {
  const articles = await prisma.article.findMany({
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  })

  return articles
}

export default async function ArtikelPage() {
  const articles = await getArticles()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Artikel</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Kelola semua artikel berita Anda
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/artikel/buat">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Buat Artikel Baru</span>
            <span className="sm:hidden">Buat Artikel</span>
          </Link>
        </Button>
      </div>

      <ArticleTable articles={articles} />
    </div>
  )
}
