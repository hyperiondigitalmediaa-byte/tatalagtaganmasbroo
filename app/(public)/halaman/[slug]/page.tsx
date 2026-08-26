import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { sanitizeArticleContent } from "@/lib/html-sanitizer"

async function getPage(slug: string) {
  const page = await prisma.page.findUnique({
    where: { 
      slug,
      isActive: true
    }
  })
  return page
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan"
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined
  }
}

export default async function HalamanDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  // Sanitize content to prevent XSS
  const sanitizedContent = sanitizeArticleContent(page.content)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          <div className="h-1 w-20 bg-red-600 rounded"></div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      </div>
    </div>
  )
}
