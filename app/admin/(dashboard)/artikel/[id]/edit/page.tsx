import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArticleForm } from "@/components/article/article-form"

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!article) {
    notFound()
  }

  return article
}

async function getFormData() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ])

  return { categories, tags }
}

export default async function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [article, { categories, tags }] = await Promise.all([
    getArticle(id),
    getFormData()
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artikel</h1>
        <p className="text-muted-foreground mt-2">
          Perbarui artikel: {article.title}
        </p>
      </div>

      <ArticleForm 
        categories={categories} 
        tags={tags} 
        initialData={article}
      />
    </div>
  )
}
